<div align="center">

  <img src="public/images/lume-logo.png" alt="Lume Showcase Logo" width="140" />

  # ⚡ LUME SHOWCASE
  ### *Plataforma Comercial de Demonstração de Alta Conversão para E-Commerce de Moda*

  [![Angular](https://img.shields.io/badge/Angular-20.0-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![SCSS](https://img.shields.io/badge/SCSS-HotPink?style=for-the-badge&logo=sass&logoColor=white)](https://sass-lang.com/)
  [![Client Side](https://img.shields.io/badge/Architecture-100%25%20Client--Side-0DF5A4?style=for-the-badge)](https://pages.cloudflare.com/)
  [![Zero Backend](https://img.shields.io/badge/Backend-Zero%20Dependency-brightgreen?style=for-the-badge)](#)
  [![Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-F38020?style=for-the-badge&logo=cloudflare)](https://lume-showcase.pages.dev)

  <br />

  <p align="center">
    <strong>Aplicação SPA autônoma desenvolvida para equipes comerciais e executivos de vendas apresentarem a tecnologia Lume a donos de marcas de moda com personalização em tempo real, estabilidade absoluta e fechamento de alto impacto.</strong>
  </p>

  <p align="center">
    <a href="#-visão-geral">Visão Geral</a> •
    <a href="#-principais-recursos">Recursos</a> •
    <a href="#-nichos-nativos-de-moda">Nichos de Moda</a> •
    <a href="#-pitch-mode-personalização-ao-vivo">Pitch Mode</a> •
    <a href="#-limpeza-e-reset-em-1-toque">Reset Rápido</a> •
    <a href="#-arquitetura-e-pastas">Arquitetura</a> •
    <a href="#-execução-e-deploy">Execução & Deploy</a>
  </p>

  <br />

</div>

---

## 📌 Visão Geral

O **Lume Showcase** é a versão de demonstração comercial interativa da plataforma Lume. Criado para resolver os desafios clássicos de vendas de software para varejistas de moda (quedas de servidor, lentidão em conexões 4G/5G, complexidade de banco de dados e necessidade de demonstrar a marca do próprio cliente durante a conversa).

Toda a infraestrutura roda **100% no navegador (Client-Side SPA)** com armazenamento reativo em `LocalStorage`, simulando perfeitamente a experiência completa de uma loja virtual e painel de controle administrativo profissional sem exigir qualquer servidor ou banco de dados conectado.

---

## ✨ Principais Recursos

### 🛍️ Vitrine Pública de Alta Conversão
- **Design System Dark Luxury & High-End:** Interface sofisticada com paleta dark obsidian, microinterações fluidas e tipografia editorial de alta legibilidade.
- **Navegação Mobile-First & Desktop:** Header com drawer lateral intuitivo para celular, busca instantânea e categorias dinâmicas.
- **Página de Produto (PDP) Detalhada:** Seletor de variações de cor e tamanho, acordeões de composição e caimento, e botão de compra rápida.
- **Sacola & Checkout Otimizado:**
  - Layout responsivo no celular com botão único de pagamento para evitar poluição visual.
  - Simulador de frete integrado (cálculo instantâneo PAC e SEDEX).
  - Fechamento flexível com envio estruturado de pedidos para o WhatsApp.
- **Área do Cliente com Login Dinâmico:**
  - Login tradicional e autenticação com Google.
  - **Botão e ícone oficial do Google com estilização dinâmica**, sincronizados instantaneamente à paleta de cores da marca ativa.
  - Central de pedidos com consulta detalhada e acompanhamento de status em tempo real.

### ⚙️ Painel de Controle Administrativo (ERP Demonstrativo)
- **Gestão de Produtos:** Cadastro, edição, precificação, inativação e fotos.
- **📸 Captura com Câmera do Dispositivo:** Tire uma foto na hora durante a reunião presencial para cadastrar uma peça de roupa do próprio cliente e vê-la imediatamente na vitrine pública.
- **Gestão de Categorias:** Organização flexível com reflexo imediato nos menus de navegação.
- **Gestão de Pedidos:** Acompanhamento de pedidos de teste com alteração de status (Pendente, Pago, Em Separação, Enviado, Entregue).
- **Base de Clientes:** Listagem de clientes com histórico de compras.

---

## 🎨 Nichos Nativos de Moda (1-Click Switch)

O vendedor pode alternar instantaneamente entre nichos de mercado com um clique, carregando identidades visuais e catálogos completos:

| Nicho | Estilo & Segmento | Identidade Visual |
| :--- | :--- | :--- |
| **Lume** *(Oficial)* | Futurewear & Tech Apparel | Preto Cyber `#080809` & Verde Neon `#0DF5A4` |
| **Oliveira** | Moda Esportiva, Performance & Casual | Azul Marinho `#0A152E` & Dourado Nobre `#CCA45E` |
| **Vortex** | Streetwear Heavyweight & Cultura Urbana | All-Black `#080809` & Vermelho Vibrante `#E63946` |
| **Maré** | Resort, Linho Puro & Beachwear | Terracota Solar `#C15C3D` & Areia Natural |
| **Terra Forte** | Moda Country, Western & Vaquejada | Couro Rústico `#140E0A` & Âmbar Dourado `#D97706` |
| **Atelier Aura** | Alfaiataria Feminina & Luxo Minimalista | Grafite `#0E0E10` & Pérola Nobre `#F5F5F7` |

---

## ⚡ Pitch Mode: Personalização ao Vivo

Durante reuniões comerciais, o vendedor abre o dock flutuante (`DemoControlComponent`) e personaliza a loja na frente do cliente em segundos:

1. **Nome da Marca:** Altere para o nome da loja do prospect (ex.: *"Camila Modas"*, *"Alpha Street"*).
2. **Color Pickers em Tempo Real:** Modifique a cor primária, secundária e fundos — todos os botões, banners, tags e ícones (inclusive o botão do Google) atualizam no mesmo instante via variáveis CSS (`--primary`, `--surface`, etc.).
3. **WhatsApp de Teste:** Insira o número do WhatsApp do cliente; ao finalizar um pedido de teste, o cliente recebe o pedido formatado direto no celular dele!

---

## 🔄 Limpeza e Reset em 1 Toque

Pensado especialmente para vendedores em trânsito que realizam múltiplos pitches por dia no smartphone:

- **1-Tap Wipe:** Limpa o carrinho de teste, descarta personalizações provisórias, zera dados de demonstração e restaura o catálogo oficial Lume.
- **Recarregamento Automático:** Redireciona para a raiz (`/`) com a memória do navegador limpa para o próximo prospect.
- **5 Pontos de Acesso Estratégicos:**
  1. *Botão Flutuante Rápido:* Posicionado acima da varinha mágica de demonstração em qualquer tela.
  2. *Menu Lateral Mobile (Drawer):* Botão destacado no rodapé da navegação no celular.
  3. *Cabeçalho do Painel Demo:* Botão rápido no topo do painel flutuante.
  4. *Rodapé do Painel Demo:* Botão expandido de restauração completa.
  5. *Rodapé da Loja:* Link discreto de reset no fim da página.

---

## 📁 Arquitetura e Pastas

```text
lume-showcase/
├── public/
│   ├── images/
│   │   ├── lume-logo.png              # Logo oficial Lume
│   │   ├── hero-lume.jpg              # Banner da vitrine
│   │   └── products/                  # Imagens locais por nicho de demonstração
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── core/                      # Camada central da aplicação
│   │   │   ├── config/
│   │   │   │   ├── demo-themes.ts     # Configuração dos 6 nichos e catálogos padrão
│   │   │   │   └── store.config.ts    # Configurações globais da vitrine
│   │   │   ├── models/                # Interfaces TypeScript (Produto, Categoria, Pedido, Cliente)
│   │   │   └── services/
│   │   │       ├── demo-storage.service.ts  # Gerenciador reativo de estado e LocalStorage
│   │   │       ├── cart.service.ts          # Gerenciamento da sacola
│   │   │       └── whatsapp.service.ts      # Montagem de mensagens para WhatsApp
│   │   ├── features/                  # Módulos funcionais
│   │   │   ├── store/                 # Vitrine (Home, Catálogo, PDP, Carrinho, Checkout)
│   │   │   ├── customer-area/         # Central do Cliente e Rastreamento
│   │   │   ├── auth/                  # Telas de Login/Registro e Google OAuth
│   │   │   ├── products/              # Painel Admin: Produtos & Câmera
│   │   │   ├── categories/            # Painel Admin: Categorias
│   │   │   ├── orders/                # Painel Admin: Pedidos
│   │   │   ├── customers/             # Painel Admin: Clientes
│   │   │   └── settings/              # Painel Admin: Ajustes da Loja
│   │   ├── layouts/                   # Layouts (StoreLayout, MainLayout, AuthLayout)
│   │   └── shared/                    # Componentes compartilhados
│   │       └── components/demo-control/  # Dock flutuante do vendedor
│   └── styles.scss                    # Variáveis CSS nativas e design tokens
└── angular.json
```

---

## 💻 Execução e Deploy

### Pré-requisitos
- **Node.js**: v18+ ou v20+
- **NPM**

### 1. Rodar Localmente
```bash
# Instalar dependências
npm install

# Iniciar servidor local
npm start
# ou
ng serve
```
Acesse no navegador: `http://localhost:4200`

### 2. Gerar Build de Produção
```bash
npm run build
```
O build estático ultra-otimizado será gerado no diretório `dist/lume-showcase/browser`.

### 3. Hospedagem
Como o projeto é 100% estático e não requer servidor backend, pode ser hospedado com custo zero em qualquer serviço de Edge CDN:
- **Cloudflare Pages** *(Configuração ativa em `https://lume-showcase.pages.dev`)*
- **Vercel**
- **Netlify**
- **GitHub Pages**

---

<div align="center">
  <sub>© 2026 Lume Commerce — Tecnologia White-Label de Alta Conversão para o Varejo de Moda.</sub>
</div>
