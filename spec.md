# Especificação Técnica (SPEC)

## 1. Arquitetura do Sistema (Next.js + Vercel)

```
[ Cliente (Navegador) ]
       │
       ├──> Validação Local do CNPJ (Algoritmo dos 2 Dígitos Verificadores)
       │
       ├──> Efeitos Visuais CRT + Web Audio API (Sintetizador)
       │
       └──> HTTP GET /api/cnpj/[cnpj]
                  │
                  ▼
   [ Next.js App Router / Vercel Serverless Function ]
                  │ (Com Cache SWR / Stale-While-Revalidate)
                  ▼
         [ BrasilAPI / MinhaReceita API ]
                  │
                  ▼
   [ Retorno JSON Padronizado com Dados da Empresa ]

```

## 2. Tech Stack Confirmada

-   **Framework Framework:** Next.js 14+ (App Router).
    
-   **Hospedagem & Deploy:** Vercel (CI/CD automático via Git, Vercel Edge Network).
    
-   **Estilização:** Tailwind CSS + CSS Modules / Arbitrary Values para layout brutalista + Custom CSS Shaders para efeito CRT.
    
-   **Ícones:** Lucide React (`Terminal`, `Building2`, `ShieldAlert`, `Users`, `CheckCircle2`, `XCircle`, `Volume2`, `VolumeX`).
    
-   **Áudio:** Web Audio API nativo (sem dependência externa de arquivos MP3).
    
-   **Fonte Externa de Dados:** BrasilAPI (`https://brasilapi.com.br/api/cnpj/v1/{cnpj}`) ou fallback para MinhaReceita API.
    

## 3. Algoritmo de Validação do CNPJ (Client-Side em TypeScript)

Validação matemática rigorosa dos 14 dígitos do CNPJ executada localmente antes de disparar qualquer requisição ao servidor.

```
export function validarCNPJ(cnpj: string): boolean {
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  
  if (cleanCNPJ.length !== 14) return false;
  
  // Elimina CNPJs com todos os dígitos iguais (ex: 00.000.000/0000-00)
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false;

  let tamanho = cleanCNPJ.length - 2;
  let numeros = cleanCNPJ.substring(0, tamanho);
  const digitos = cleanCNPJ.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i), 10) * pos--;
    if (pos < 2) pos = 9;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0), 10)) return false;

  tamanho = tamanho + 1;
  numeros = cleanCNPJ.substring(0, tamanho);
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

```

## 4. Next.js API Route (`app/api/cnpj/[cnpj]/route.ts`)

```
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { cnpj: string } }
) {
  const cnpj = params.cnpj.replace(/\D/g, '');

  if (cnpj.length !== 14) {
    return NextResponse.json({ error: 'CNPJ inválido' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`, {
      next: { revalidate: 86400 } // Cache no Vercel Data Cache por 24 horas
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'CNPJ não encontrado' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Falha na comunicação com o servidor' }, { status: 500 });
  }
}

```

## 5. Estrutura de Componentes UI (Next.js)

1.  `app/layout.tsx`: Layout base com inclusão de fontes mono (`Share Tech Mono` ou `VT323`).
    
2.  `<CRTContainer />`: Wrapper client-side com overlays de scanline, filtro CRT, vinheta e chaveamento de efeitos.
    
3.  `<TerminalHeader />`: Barra superior com relógio UTC/BRT em tempo real, status do Vercel Edge Server e botão de mute/CRT.
    
4.  `<CnpjInputForm />`: Input com máscara dinâmica (`00.000.000/0001-00`), botão brutalista e feedback instantâneo.
    
5.  `<MatrixBackground />`: Canvas animado com chuva de código Matrix em verde fosfórico.
    
6.  `<CompanyResultCard />`: Exibição detalhada dos dados do CNPJ:
    
    -   Razão Social e Nome Fantasia
        
    -   Situação Cadastral (ATIVA, SUSPENSA, BAIXADA, INAPT)
        
    -   CNAE Principal e Secundários
        
    -   Data de Abertura e Capital Social
        
    -   QSA (Quadro de Sócios e Administradores)
        
7.  `<TerminalConsoleLogs />`: Log em tempo real das ações do sistema no estilo Unix.
    

## 6. Segurança & Conformidade (LGPD)

-   **Dados Públicos:** CNPJ e informações da Receita Federal são dados públicos de pessoas jurídicas (Lei da Transparência).
    
-   **Privacidade do Usuário:** Nenhum log do usuário nem o histórico local é armazenado nos servidores da Vercel.
    
-   **Aviso no Footer:** _"Esta ferramenta é uma interface pública de consulta cadastral corporativa. Não retemos nem processamos dados privados."_