# 🛒 Frontend - Interface do Cliente da Livraria

Interface do cliente desenvolvida em React para o sistema de livraria.

## 📋 Funcionalidades

- **Catálogo de Livros**: Navegação e busca por livros
- **Sistema de Carrinho**: Adicionar/remover itens do carrinho
- **Autenticação**: Login e registro de usuários
- **Processo de Checkout**: Finalização de compras
- **Histórico de Pedidos**: Visualização de pedidos anteriores
- **Filtros e Busca**: Filtrar por categoria, preço, etc.
- **Interface Responsiva**: Funciona em desktop e mobile

## 🛠️ Tecnologias

- **React 18**: Biblioteca JavaScript
- **Vite**: Build tool e dev server
- **React Router DOM**: Roteamento
- **Axios**: Cliente HTTP
- **React Icons**: Ícones
- **React Toastify**: Notificações
- **Tailwind CSS**: Framework CSS
- **Swiper**: Carousel/slider de imagens

## 🚀 Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Executar testes
npm test

# Lint do código
npm run lint
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto frontend (se necessário):

```env
VITE_BACKEND_URL=http://localhost:4000
```

### Configuração da API

O frontend se comunica com o backend através da API. Certifique-se de que:

1. O backend está rodando na porta 4000
2. O CORS está configurado corretamente
3. As rotas da API estão funcionando

## 🏃‍♂️ Execução

```bash
# Desenvolvimento
npm run dev
# Acesse: http://localhost:5173

# Produção
npm run build
npm run preview
```

## 🎯 Funcionalidades Principais

### 1. Página Inicial (Home)

- Banner principal com destaques
- Seção de produtos em destaque
- Newsletter e informações da empresa
- Links para redes sociais

### 2. Catálogo de Produtos (Shop)

- Lista completa de livros
- Filtros por categoria, preço
- Sistema de busca por título/autor
- Paginação de resultados
- Ordenação (preço, relevância, etc.)

### 3. Detalhes do Produto

- Informações completas do livro
- Galeria de imagens
- Descrição detalhada
- Avaliações e comentários
- Botão "Adicionar ao Carrinho"

### 4. Carrinho de Compras

- Lista de itens selecionados
- Alteração de quantidades
- Cálculo de subtotal e total
- Botão para finalizar compra
- Aplicação de cupons de desconto

### 5. Autenticação

- **Login**: Entrada de usuários existentes
- **Registro**: Criação de novas contas
- **Recuperação de Senha**: Reset via email
- **Perfil**: Edição de dados pessoais

### 6. Checkout

- Formulário de endereço de entrega
- Seleção de método de pagamento
- Revisão final do pedido
- Integração com Stripe para pagamento

### 7. Histórico de Pedidos

- Lista de pedidos realizados
- Status de cada pedido
- Detalhes completos de compra
- Opção de recompra

## 🎨 Interface do Usuário

### Layout Principal

```
+------------------+
|     Header       |
+------------------+
|   Navigation     |
+------------------+
|   Main Content   |
|                  |
|                  |
+------------------+
|     Footer       |
+------------------+
```

### Componentes Principais

- **Header**: Logo, busca, carrinho, login
- **Navbar**: Menu de navegação principal
- **ProductItem**: Card individual de produto
- **CartTotal**: Resumo do carrinho
- **Features**: Seção de recursos/vantagens
- **Footer**: Links e informações da empresa

## 📱 Responsividade

O site é totalmente responsivo e funciona em:

- **Desktop**: Layout completo
- **Tablet**: Layout adaptado
- **Mobile**: Menu hambúrguer e interface otimizada

## 🛒 Fluxo de Compra

```
1. Navegação → 2. Seleção → 3. Carrinho → 4. Login → 5. Checkout → 6. Pagamento → 7. Confirmação
```

### Detalhes do Fluxo

1. **Navegação**: Cliente navega pelo catálogo
2. **Seleção**: Adiciona produtos ao carrinho
3. **Carrinho**: Revisa itens selecionados
4. **Login**: Faz login ou cria conta
5. **Checkout**: Preenche dados de entrega
6. **Pagamento**: Processa pagamento via Stripe
7. **Confirmação**: Recebe confirmação do pedido

## 🔒 Autenticação e Segurança

### Sistema de Autenticação

```javascript
// Login flow
1. Usuário insere credenciais
2. Envio para /api/user/login
3. Recebimento do token JWT
4. Armazenamento no localStorage
5. Redirecionamento automático
```

### Proteção de Dados

- Tokens JWT para sessões
- Validação de formulários
- Sanitização de entradas
- Proteção contra XSS

## 📊 Gerenciamento de Estado

O aplicativo utiliza:

- **React Context**: Para carrinho e autenticação
- **useState/useEffect**: Para estado local
- **localStorage**: Para persistir dados do carrinho

### Contextos Principais

```javascript
// ShopContext - Gerencia produtos e carrinho
- products: Lista de produtos
- cartItems: Itens no carrinho
- addToCart(): Adicionar ao carrinho
- removeFromCart(): Remover do carrinho

// AuthContext - Gerencia autenticação
- user: Dados do usuário logado
- token: Token de autenticação
- login(): Fazer login
- logout(): Fazer logout
```

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm test -- --watch

# Executar com coverage
npm test -- --coverage

# Executar testes específicos
npm test -- --testNamePattern="Component Name"
```

### Estrutura de Testes

```
src/
├── components/
│   └── __tests__/
│       ├── Navbar.test.jsx
│       ├── Features.test.jsx
│       ├── Item.test.jsx
│       ├── CartTotal.test.jsx
│       └── Title.test.jsx
├── pages/
│   └── __tests__/
│       ├── Home.test.jsx
│       ├── Shop.test.jsx
│       ├── Login.test.jsx
│       ├── Cart.test.jsx
│       └── Contact.test.jsx
└── __mocks__/
    ├── react-router-dom.js
    ├── axios.js
    ├── ShopContext.js
    └── react-toastify.js
```

## 📁 Estrutura do Projeto

```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Navbar.jsx         # Navegação principal
│   │   ├── Features.jsx       # Seção de recursos
│   │   ├── Item.jsx           # Card de produto
│   │   ├── CartTotal.jsx      # Total do carrinho
│   │   └── Title.jsx          # Componente de título
│   ├── pages/
│   │   ├── Home.jsx           # Página inicial
│   │   ├── Shop.jsx           # Catálogo de produtos
│   │   ├── About.jsx          # Sobre a empresa
│   │   ├── Contact.jsx        # Contato
│   │   ├── Login.jsx          # Login/Registro
│   │   ├── Cart.jsx           # Carrinho de compras
│   │   ├── PlaceOrder.jsx     # Finalizar compra
│   │   └── Orders.jsx         # Histórico de pedidos
│   ├── context/
│   │   └── ShopContext.jsx    # Context do carrinho
│   ├── assets/
│   │   ├── book_*.png         # Imagens dos livros
│   │   └── icons/             # Ícones do sistema
│   ├── utils/
│   │   └── api.js             # Configuração da API
│   ├── App.jsx                # Componente principal
│   ├── main.jsx               # Ponto de entrada
│   └── index.css              # Estilos globais
├── __mocks__/                 # Mocks para testes
├── package.json               # Dependências
├── tailwind.config.js         # Config Tailwind
├── vite.config.js             # Config Vite
└── README.md                  # Este arquivo
```

## 🎨 Customização de Estilos

O projeto usa Tailwind CSS:

```css
/* Cores principais */
--primary-color: #f97316;
--secondary-color: #1f2937;
--text-color: #374151;
--bg-color: #ffffff;

/* Breakpoints responsivos */
sm: 640px   /* Mobile */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large Desktop */
```

## 🚀 Deploy

### Build para Produção

```bash
# Gerar build
npm run build

# Arquivos gerados em dist/
# Upload para servidor web ou CDN
```

### Variáveis de Ambiente para Produção

```env
VITE_BACKEND_URL=https://sua-api-producao.com
VITE_STRIPE_PUBLIC_KEY=sua_stripe_public_key
```

## 📈 Performance

### Otimizações Implementadas

- **Code Splitting**: Divisão automática do código
- **Tree Shaking**: Remoção de código não utilizado
- **Image Optimization**: Otimização de imagens
- **Lazy Loading**: Carregamento sob demanda
- **Bundle Splitting**: Separação de vendors

### Métricas de Performance

- First Contentful Paint (FCP) < 1.8s
- Largest Contentful Paint (LCP) < 2.5s
- First Input Delay (FID) < 100ms
- Cumulative Layout Shift (CLS) < 0.1

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Crie um Pull Request

### Padrões de Código

- Use ESLint para manter a qualidade
- Siga as convenções do React
- Escreva testes para novas funcionalidades
- Use componentes funcionais com hooks
- Mantenha componentes pequenos e reutilizáveis

## 📞 Suporte

Para dúvidas sobre o frontend:
- Consulte este README
- Verifique os logs do navegador (F12)
- Teste a conexão com a API
- Abra uma issue no repositório
