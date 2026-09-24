# Lume Showcase ⚡ Plataforma de Vendas e Demonstração Comercial

> **Zero-Backend, 100% Client-Side SPA em Angular 20**  
> Demonstração comercial completa desenvolvida para os vendedores da Lume apresentarem o produto a clientes em reuniões presenciais ou chamadas de vídeo com máxima agilidade, estabilidade e impacto visual.

---

## 🚀 Destaques da Solução

- **Zero Dependência de Backend:** Não necessita de API NestJS ou banco de dados MySQL rodando. Inicia instantaneamente e funciona 100% offline ou online.
- **Persistência Reativa em LocalStorage:** Todos os produtos, categorias, fotos de câmera e personalizações são salvos localmente no navegador e refletem em tempo real entre o Painel Admin e a Vitrine Pública.
- **⚡ Painel Flutuante do Vendedor (`DemoControlComponent`):** Dock discreto no canto inferior da tela (presente em todas as páginas) para controle dinâmico da demonstração.
- **5 Nichos Nativos de Moda (1-Click Switch):**
  1. **Oliveira:** Moda Esportiva, Fitness & Casual *(Navy `#0A152E` & Dourado Nobre `#CCA45E`)*
  2. **Barone Imports:** Streetwear Heavyweight 240g *(All-Black `#080809` & Branco/Vermelho `#FFFFFF`)*
  3. **Maré:** Resort, Linho Puro & Beachwear *(Terracota Solar `#C15C3D` & Areia Natural)*
  4. **Terra Forte:** Moda Country & Vaquejada *(Couro Rústico `#140E0A` & Âmbar Dourado `#D97706`)*
  5. **Atelier Aura:** Alfaiataria & Luxo Minimalista *(Grafite `#0E0E10` & Pérola/Lã Fria `#F5F5F7`)*
- **Personalização ao Vivo na Frente do Cliente (Pitch Mode):**
  - Altere o nome da marca para o nome da loja do seu prospect (ex: *"Camila Modas"*, *"Alpha Street"*).
  - Altere a cor primária da marca com Color Picker e veja botões, degradês e bordas mudarem no mesmo segundo.
  - Insira o WhatsApp do cliente para fazer o checkout e receber o pedido de teste ao vivo no celular dele!
- **📸 Cadastro com Câmera do Dispositivo:** Tire foto na hora com a câmera do celular/notebook para cadastrar novos produtos. As imagens são convertidas em Base64 e salvas localmente.
- **🛍️ Sacola & Checkout no WhatsApp:** Adicione variações (tamanho/cor) à sacola e gere a mensagem oficial pronta para o WhatsApp do vendedor ou do cliente.
- **🔄 Restauração com 1 Clique:** Botão *"Resetar Demonstração"* para limpar o navegador e deixar a base nova para a próxima reunião.

---

## 🛠️ Tecnologias Utilizadas

- **Angular 20 (Standalone Components & Signals)**
- **SCSS Moderno** com temas orientados a variáveis CSS nativas (`:root`)
- **Web APIs:** LocalStorage, MediaDevices (Câmera WebRTC), FileReader (Base64)
- **Zero Server Overhead:** Build estático de alta performance (`dist/lume-showcase/browser`) pronto para Vercel, Netlify, Cloudflare Pages ou GitHub Pages.

---

## 💻 Como Rodar Localmente

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor local de demonstração
npm start
# ou
ng serve

# 3. Acessar no navegador
http://localhost:4200
```

---

## 📦 Como Gerar Build de Produção

```bash
npm run build
```
Os arquivos estáticos serão gerados em `dist/lume-showcase/browser`. Podem ser hospedados em qualquer CDN estática gratuita.

---

## 🔐 Acesso ao Painel Administrativo

- **Rota:** `/admin/products`
- **Usuário Padrão:** `admin@lumestore.com.br`
- **Modo Demonstração:** Já autenticado automaticamente por padrão. Se visitar `/login`, há o botão de 1 clique *"⚡ Entrar Instantâneo no Modo Demo"*.

---

© 2026 Lume Commerce — Tecnologia White-Label de Alta Conversão.
