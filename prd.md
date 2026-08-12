# Product Requirement Document (PRD)

## 1. Visão Geral do Produto

**Nome do Projeto:** CNPJ Terminal // CyberLookup Enterprise

**Proposta de Valor:** Uma plataforma web de consulta de dados cadastrais de empresas (CNPJ) ultrarrápida, minimalista e temática, inspirada na estética brutalista retro-futurista de _The Matrix_ e interfaces de terminais cibernéticos dos anos 80/90.

## 2. Objetivos do Produto

-   **Acessibilidade e Rapidez:** Permitir a validação e consulta detalhada do status cadastral, Razão Social, CNAE, Capital Social e dados societários de um CNPJ em poucas interações.
    
-   **Experiência Imersiva:** Proporcionar uma interface visual rica e fluida, transformando a pesquisa corporativa em uma experiência de hacking cibernético.
    
-   **Performance & Escalabilidade:** Utilizar a infraestrutura Serverless da Vercel para entregar tempo de resposta baixíssimo com revalidação inteligente.
    
-   **Segurança e Privacidade:** Garantir que consultas de dados públicos sejam feitas sem retenção indevida ou logs invasivos do usuário.
    

## 3. Público-Alvo e Casos de Uso

-   **Público Principal:** Desenvolvedores, analistas B2B, entusiastas da cultura cyberpunk/retro e profissionais que buscam checar dados de empresas brasileiras com visual estilizado.
    
-   **Caso de Uso 1 (Consulta Corporativa):** O usuário digita o CNPJ (`00.000.000/0001-00`), pressiona Enter ou clica em "EXAMINAR_EMPRESA", e visualiza os dados cadastrais (Razão Social, Nome Fantasia, QSA, CNAE, Endereço e Situação Cadastral) com efeito visual de decodificação no terminal.
    
-   **Caso de Uso 2 (Histórico Local & Cache):** O usuário pode acessar rapidamente as últimas empresas pesquisadas através de histórico gravado localmente no navegador (`localStorage`).
    

## 4. Funcionalidades Principais (Requirements)

**ID**

**Funcionalidade**

**Descrição**

**Prioridade**

**FR-01**

Input Máscara de CNPJ

Formatação automática no padrão `00.000.000/0001-00` enquanto o usuário digita.

P0 (Essencial)

**FR-02**

Validação Algorítmica

Validação local client-side dos dois dígitos verificadores antes do envio da requisição.

P0 (Essencial)

**FR-03**

API Route Serverless

Endpoint API Route no Next.js (`/api/cnpj/[cnpj]`) que consulta a BrasilAPI / ReceitaWS com fallback e caching.

P0 (Essencial)

**FR-04**

Animação Cipher / Matrix

Efeito visual de decodificação de texto no estilo Matrix cipher ao carregar os dados.

P1 (Importante)

**FR-05**

Efeitos CRT Toggle

Botão para alternar efeitos visuais CRT (scanlines, curvação de tela e flicker) para acessibilidade/desempenho.

P1 (Importante)

**FR-06**

Exibição de Sócios (QSA)

Tabela brutalista com lista de sócios e administradores da empresa pesquisada.

P1 (Importante)

**FR-07**

Histórico Local Encriptado

Armazenamento no `localStorage` dos últimos 5 CNPJs pesquisados.

P2 (Desejável)

**FR-08**

Efeitos Sonoros Retro

Efeitos de áudio sintetizados via Web Audio API (teclado mecânico, bipe de carregamento e sinalização de erros).

P2 (Desejável)

## 5. Requisitos Não-Funcionais

-   **Performance:** Tempo de carregamento da página no Vercel Edge < 1s (LCP), com tempo de resposta do front-end < 100ms.
    
-   **Hospedagem:** Vercel (Edge Network / Serverless Functions).
    
-   **Acessibilidade (a11y):** Suporte total a `prefers-reduced-motion` e opção de desativar efeitos de scanlines.
    
-   **Responsividade:** Layout adaptável brutalista otimizado para mobile, tablet e desktop.