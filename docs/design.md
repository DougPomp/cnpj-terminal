# Design System: Matrix CRT Brutalism (CNPJ Terminal)

## 1. Filosofia de Design

O estilo une o **Brutalismo Digital** (ausência de bordas arredondadas, alto contraste, sombras bloco de 90°, layout cru) com a **Estética Cyberpunk/Matrix CRT** (fundo preto profundo `#020B05`, verde fosférico e néon, linhas de varredura CRT, vinheta de tubo de raio catódico e animações glitch).

## 2. Paleta de Cores

**Nome da Cor**

**Hex / Token**

**Uso**

**Matrix Pure Black**

`#020B05`

Fundo principal da aplicação

**Terminal Green (Fosfórico)**

`#00FF41`

Texto primário, bordas ativas, acentos principais

**Neon Mint**

`#33FF77`

Hover states, destaques de texto importante

**Dark Cyber Green**

`#00220A`

Fundo de cards, containers e inputs

**Warning Yellow**

`#FFD700`

Alertas, CNPJ Suspenso ou Pendente de Regularização

**Cyber Red**

`#FF0033`

CNPJ Baixado/Inapto, erros de validação ou 404

**Muted Terminal**

`#005511`

Bordas inativas, textos secundários, linhas auxiliares

## 3. Tipografia

-   **Fonte Principal (Mono):** `Share Tech Mono`, `VT323` ou `Fira Code` via Google Fonts / `next/font/google`.
    
-   **Tamanhos Padrão:**
    
    -   **Display / Header:** `3rem` (48px) - `font-mono uppercase font-bold tracking-widest`
        
    -   **Input do CNPJ:** `2.25rem` (36px) - `font-mono font-bold`
        
    -   **Body / Rótulos:** `1rem` (16px) - `font-mono`
        
    -   **Logs / Monitores:** `0.875rem` (14px) - `font-mono opacity-80`
        

## 4. Regras do Brutalismo Digital (UI Rules)

1.  **Sem Border Radius:** `border-radius: 0px !important;` (Tudo é estritamente retangular).
    
2.  **Bordas Rígidas:** `border: 2px solid #00FF41;`
    
3.  **Sombra Brutalista (Hard Offset Shadow):**
    
    ```
    box-shadow: 5px 5px 0px 0px #00FF41;
    
    ```
    
4.  **Inversão no Hover (Hover State):**
    
    ```
    .brutalist-button {
      background-color: transparent;
      color: #00FF41;
      border: 2px solid #00FF41;
      box-shadow: 4px 4px 0px #00FF41;
      transition: all 0.1s step-end;
    }
    .brutalist-button:hover {
      background-color: #00FF41;
      color: #020B05;
      box-shadow: none;
      transform: translate(4px, 4px);
    }
    
    ```
    

## 5. Efeitos Visuais CRT & Cyberpunk (CSS)

### 5.1. Overlay de Scanlines (Linhas de Varredura)

```
.crt-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
    rgba(18, 16, 16, 0) 50%, 
    rgba(0, 0, 0, 0.35) 50%
  );
  background-size: 100% 4px;
  z-index: 999;
  pointer-events: none;
}

```

### 5.2. Curvatura de Tela & Vinheta CRT

```
.crt-screen {
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.9);
}

.crt-screen::before {
  content: " ";
  display: block;
  position: absolute;
  top: 0; left: 0; bottom: 0; right: 0;
  background: linear-gradient(
    rgba(18, 16, 16, 0) 50%, 
    rgba(0, 0, 0, 0.25) 50%
  ), linear-gradient(
    90deg,
    rgba(255, 0, 0, 0.03),
    rgba(0, 255, 0, 0.01),
    rgba(0, 0, 255, 0.03)
  );
  z-index: 2;
  background-size: 100% 3px, 6px 100%;
  pointer-events: none;
}

```

### 5.3. Brilho do Fósforo de Texto (Green Glow)

```
.matrix-glow {
  color: #00FF41;
  text-shadow: 
    0 0 4px rgba(0, 255, 65, 0.6),
    0 0 10px rgba(0, 255, 65, 0.4),
    0 0 18px rgba(0, 255, 65, 0.2);
}

```

## 6. Mapeamento de Status da Empresa (CNPJ)

**Status Cadastral**

**Cor Temática**

**Badge de Terminal**

**ATIVA**

`#00FF41` (Terminal Green)

`[ STATUS: ATIVA // OK ]`

**SUSPENSA / PENDENTE**

`#FFD700` (Warning Yellow)

`[ STATUS: SUSPENSA // WARN ]`

**INAPTA / BAIXADA / NULA**

`#FF0033` (Cyber Red)

`[ STATUS: INAPTA // FAIL ]`