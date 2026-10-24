// No network: transpile the real handler and replace its transport before invocation.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

function load(relative) {
  const filename = path.resolve(__dirname, '..', relative);
  const instance = new Module(filename, module);
  instance.filename = filename;
  instance.paths = Module._nodeModulePaths(path.dirname(filename));
  const originalRequire = instance.require.bind(instance);
  instance.require = (id) => id === '@/lib/cnpj' ? load('lib/cnpj.ts') : originalRequire(id);
  instance._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, filename);
  return instance.exports;
}

const { GET } = load('app/api/cnpj/[cnpj]/route.ts');
const { validarCNPJ, formatarCNPJ } = load('lib/cnpj.ts');
// Generated checksum-valid input; no real company's data is used or requested.
const cnpj = '12345678000195';
const fixture = {
  cnpj, razao_social: 'EMPRESA SINTETICA', nome_fantasia: 'TESTE',
  descricao_situacao_cadastral: 'ATIVA', data_inicio_atividade: '2020-01-01',
  cnae_fiscal: 1234, cnae_fiscal_descricao: 'ATIVIDADE TESTE',
  capital_social: '123.45', descricao_tipo_de_logradouro: 'RUA', logradouro: 'SINTETICA',
  qsa: [{ nome_socio: 'SOCIO SINTETICO', nome_socio_raz_social: 'SOCIO SINTETICO', qualificacao_socio: 'TESTE' }],
  cnaes_secundarios: [{ codigo: 5678, descricao: 'TESTE SECUNDARIO' }],
};
const nativeFetch = global.fetch;
const nativeTimeout = global.setTimeout;
const timers = [];
global.setTimeout = (...args) => { const timer = nativeTimeout(...args); timers.push(timer); return timer; };
let count = 0;
async function scenario(name, transport, verify, input = cnpj) {
  const calls = [];
  global.fetch = async (url, options) => {
    assert.match(url, /^https:\/\/(brasilapi\.com\.br\/api\/cnpj\/v1\/|minhareceita\.org\/)12345678000195$/);
    calls.push({ url, options });
    return transport(calls.length, url, options);
  };
  const params = process.env.BASELINE === '1' ? { cnpj: input } : Promise.resolve({ cnpj: input });
  const response = await GET(new Request('http://localhost/api/cnpj/' + input), { params });
  await verify(response, await response.json(), calls);
  count++;
  console.log('PASS', name);
}

(async () => {
  assert.equal(validarCNPJ(cnpj), true);
  assert.equal(validarCNPJ('00000000000000'), false);
  assert.equal(validarCNPJ('12345678000196'), false);
  assert.equal(formatarCNPJ(cnpj), '12.345.678/0001-95');
  count += 4;
  await scenario('invalid input has no transport', () => assert.fail('network'), (res, data, calls) => {
    assert.equal(res.status, 400); assert.match(data.error, /INV/); assert.equal(calls.length, 0);
    assert.equal(res.headers.has('cache-control'), false);
  }, '00000000000000');
  await scenario('primary normalization and 24h cache', () => Response.json(fixture), (res, data, calls) => {
    assert.equal(res.status, 200); assert.equal(calls.length, 1);
    assert.equal(data.razao_social, fixture.razao_social); assert.equal(data.capital_social, 123.45);
    assert.equal(data.qsa[0].nome, 'SOCIO SINTETICO'); assert.equal(data.cnaes_secundarios[0].codigo, 5678);
    assert.equal(data.logradouro, 'RUA SINTETICA'); assert.match(data.fonte_dados, /PRIMARY/);
    assert.equal(calls[0].options.next.revalidate, 86400);
    assert.equal(res.headers.get('cache-control'), 'public, s-maxage=86400, stale-while-revalidate=43200');
  });
  await scenario('HTTP failure uses fallback', (n) => n === 1 ? new Response(null, { status: 404 }) : Response.json(fixture), (res, data, calls) => {
    assert.equal(res.status, 200); assert.equal(calls.length, 2); assert.match(calls[1].url, /minhareceita/);
    assert.equal(data.qsa[0].nome, 'SOCIO SINTETICO'); assert.match(data.fonte_dados, /FALLBACK/);
  });
  await scenario('transport timeout uses fallback', (n) => {
    if (n === 1) throw new DOMException('Synthetic timeout', 'AbortError');
    return Response.json(fixture);
  }, (res, data, calls) => { assert.equal(res.status, 200); assert.equal(calls.length, 2); assert.match(data.fonte_dados, /FALLBACK/); });
  const started = Date.now();
  await scenario('actual 3500ms abort signal uses fallback', (n, url, options) => {
    if (n === 1) return new Promise((resolve, reject) => {
      options.signal.addEventListener('abort', () => reject(new DOMException('Synthetic abort', 'AbortError')), { once: true });
    });
    return Response.json(fixture);
  }, (res, data, calls) => {
    assert.equal(res.status, 200); assert.equal(calls.length, 2);
    assert.ok(Date.now() - started >= 3400); assert.ok(calls[0].options.signal.aborted);
    assert.match(data.fonte_dados, /FALLBACK/);
  });
  await scenario('both upstreams fail without caching errors', () => new Response(null, { status: 500 }), (res, data, calls) => {
    assert.equal(res.status, 503); assert.equal(calls.length, 2); assert.match(data.error, /CONEXAO_FALHOU/);
    assert.equal(res.headers.has('cache-control'), false);
  });
  await scenario('malformed primary JSON uses fallback', (n) => n === 1 ? new Response('{') : Response.json({ cnpj, razao_social: 'MINIMO' }), (res, data) => {
    assert.equal(res.status, 200); assert.equal(data.razao_social, 'MINIMO'); assert.deepEqual(data.qsa, []);
    assert.equal(data.capital_social, 0); assert.equal(data.nome_fantasia, 'MINIMO');
  });
  console.log(`${count} checks passed (7 API scenarios + 4 validation/format checks); all transport simulated.`);
})().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => {
  global.fetch = nativeFetch; global.setTimeout = nativeTimeout; timers.forEach(clearTimeout);
});
