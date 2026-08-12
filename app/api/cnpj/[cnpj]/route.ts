import { NextResponse } from 'next/server';
import { cleanCNPJ, validarCNPJ, CompanyData, Socio, Cnae } from '@/lib/cnpj';

export const runtime = 'nodejs';

export async function GET(
  request: Request,
  { params }: { params: { cnpj: string } }
) {
  const cnpjParam = params.cnpj || '';
  const cleaned = cleanCNPJ(cnpjParam);

  if (cleaned.length !== 14 || !validarCNPJ(cleaned)) {
    return NextResponse.json(
      { error: 'DÍGITOS_INVÁLIDOS: O CNPJ fornecido não passou na verificação algorítmica.' },
      { status: 400 }
    );
  }

  // Tentar BrasilAPI primeiro com timeout de 3.5s
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const brasilRes = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleaned}`, {
      signal: controller.signal,
      headers: { 'User-Agent': 'CNPJ-Terminal-CyberLookup/1.0' },
      next: { revalidate: 86400 }, // Cache por 24 horas no Next Data Cache
    });

    clearTimeout(timeoutId);

    if (brasilRes.ok) {
      const data = await brasilRes.json();

      const normalized: CompanyData = {
        cnpj: data.cnpj,
        razao_social: data.razao_social || 'NÃO INFORMADA',
        nome_fantasia: data.nome_fantasia || data.razao_social || 'N/A',
        situacao_cadastral: data.descricao_situacao_cadastral || (data.situacao_cadastral === 2 ? 'ATIVA' : 'SUSPENSA'),
        data_situacao_cadastral: data.data_situacao_cadastral,
        motivo_situacao_cadastral: data.motivo_situacao_cadastral,
        data_inicio_atividade: data.data_inicio_atividade || 'N/A',
        cnae_fiscal_principal: {
          codigo: data.cnae_fiscal || data.cnae_fiscal_principal?.codigo || 'N/A',
          descricao: data.cnae_fiscal_descricao || data.cnae_fiscal_principal?.descricao || 'Atividade não especificada',
        },
        cnaes_secundarios: Array.isArray(data.cnaes_secundarios)
          ? data.cnaes_secundarios.map((item: Record<string, unknown>) => ({
              codigo: item.codigo as string | number,
              descricao: item.descricao as string,
            }))
          : [],
        natureza_juridica: data.natureza_juridica || 'N/A',
        capital_social: typeof data.capital_social === 'number' ? data.capital_social : parseFloat(data.capital_social || '0'),
        porte: data.porte || 'NÃO INFORMADO',
        logradouro: `${data.descricao_tipo_de_logradouro || ''} ${data.logradouro || ''}`.trim(),
        numero: data.numero || 'S/N',
        complemento: data.complemento || '',
        bairro: data.bairro || '',
        municipio: data.municipio || '',
        uf: data.uf || '',
        cep: data.cep || '',
        email: data.email || '',
        telefone: data.ddd_telefone_1 || data.telefone || '',
        qsa: Array.isArray(data.qsa)
          ? data.qsa.map((s: Record<string, unknown>) => ({
              nome: (s.nome_socio || s.nome || 'N/A') as string,
              qualificacao: (s.qualificacao_socio || s.qualificacao || 'Sócio/Administrador') as string,
              pais_origem: s.pais as string | undefined,
              faixa_etaria: s.faixa_etaria as string | undefined,
            }))
          : [],
        fonte_dados: 'BrasilAPI [PRIMARY_NODE]',
        data_consulta: new Date().toISOString(),
      };

      return NextResponse.json(normalized, {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
        },
      });
    }
  } catch {
    // Falha ou timeout na BrasilAPI; prosseguir para o fallback MinhaReceita
  }

  // Fallback: MinhaReceita API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const minhaReceitaRes = await fetch(`https://minhareceita.org/${cleaned}`, {
      signal: controller.signal,
      headers: { 'User-Agent': 'CNPJ-Terminal-CyberLookup/1.0' },
    });

    clearTimeout(timeoutId);

    if (minhaReceitaRes.ok) {
      const data = await minhaReceitaRes.json();

      const normalized: CompanyData = {
        cnpj: data.cnpj,
        razao_social: data.razao_social || 'NÃO INFORMADA',
        nome_fantasia: data.nome_fantasia || data.razao_social || 'N/A',
        situacao_cadastral: data.descricao_situacao_cadastral || 'ATIVA',
        data_situacao_cadastral: data.data_situacao_cadastral,
        data_inicio_atividade: data.data_inicio_atividade || 'N/A',
        cnae_fiscal_principal: {
          codigo: data.cnae_fiscal || 'N/A',
          descricao: data.cnae_fiscal_descricao || 'Atividade principal',
        },
        cnaes_secundarios: Array.isArray(data.cnaes_secundarios)
          ? data.cnaes_secundarios.map((item: Record<string, unknown>) => ({
              codigo: item.codigo as string | number,
              descricao: item.descricao as string,
            }))
          : [],
        natureza_juridica: data.natureza_juridica || 'N/A',
        capital_social: typeof data.capital_social === 'number' ? data.capital_social : parseFloat(data.capital_social || '0'),
        porte: data.porte || 'NÃO INFORMADO',
        logradouro: `${data.descricao_tipo_de_logradouro || ''} ${data.logradouro || ''}`.trim(),
        numero: data.numero || 'S/N',
        complemento: data.complemento || '',
        bairro: data.bairro || '',
        municipio: data.municipio || '',
        uf: data.uf || '',
        cep: data.cep || '',
        qsa: Array.isArray(data.qsa)
          ? data.qsa.map((s: Record<string, unknown>) => ({
              nome: (s.nome_socio_raz_social || s.nome || 'N/A') as string,
              qualificacao: (s.qualificacao_socio || s.qualificacao || 'Sócio') as string,
            }))
          : [],
        fonte_dados: 'MinhaReceita API [FALLBACK_NODE]',
        data_consulta: new Date().toISOString(),
      };

      return NextResponse.json(normalized, {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
        },
      });
    }
  } catch {
    // Falha em ambas as fontes
  }

  return NextResponse.json(
    { error: 'CONEXAO_FALHOU: Não foi possível obter resposta das redes ReceitaWS/BrasilAPI.' },
    { status: 503 }
  );
}
