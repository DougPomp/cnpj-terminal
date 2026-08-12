export interface Socio {
  nome: string;
  qualificacao: string;
  pais_origem?: string;
  nome_representante?: string;
  qualificacao_representante?: string;
  faixa_etaria?: string;
}

export interface Cnae {
  codigo: number | string;
  descricao: string;
}

export interface CompanyData {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  situacao_cadastral: 'ATIVA' | 'SUSPENSA' | 'BAIXADA' | 'INAPTA' | 'NULA' | string;
  data_situacao_cadastral?: string;
  motivo_situacao_cadastral?: string;
  data_inicio_atividade: string;
  cnae_fiscal_principal: Cnae;
  cnaes_secundarios?: Cnae[];
  natureza_juridica: string;
  capital_social: number;
  porte: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  email?: string;
  telefone?: string;
  qsa: Socio[];
  fonte_dados?: string;
  data_consulta?: string;
}

/**
 * Remove todos os caracteres não numéricos.
 */
export function cleanCNPJ(cnpj: string): string {
  return cnpj.replace(/\D/g, '');
}

/**
 * Aplica máscara de CNPJ no formato 00.000.000/0001-00
 */
export function formatarCNPJ(value: string): string {
  const digits = cleanCNPJ(value).slice(0, 14);
  
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`;
}

/**
 * Algoritmo oficial dos dois dígitos verificadores do CNPJ.
 */
export function validarCNPJ(cnpj: string): boolean {
  const clean = cleanCNPJ(cnpj);

  if (clean.length !== 14) return false;

  // Elimina CNPJs com todos os dígitos iguais (ex: 00.000.000/0000-00)
  if (/^(\d)\1{13}$/.test(clean)) return false;

  let tamanho = clean.length - 2;
  let numeros = clean.substring(0, tamanho);
  const digitos = clean.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i), 10) * pos--;
    if (pos < 2) pos = 9;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0), 10)) return false;

  tamanho = tamanho + 1;
  numeros = clean.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i), 10) * pos--;
    if (pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1), 10)) return false;

  return true;
}

/**
 * Formata valores numéricos de Capital Social para BRL (R$)
 */
export function formatarMoeda(valor: number): string {
  if (isNaN(valor)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
}
