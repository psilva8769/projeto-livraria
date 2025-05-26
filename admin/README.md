# 👨‍💼 Admin - Painel Administrativo da Livraria

Painel administrativo desenvolvido em React para gerenciar o sistema de livraria.

## 📋 Funcionalidades

- **Dashboard**: Visão geral das vendas e estatísticas
- **Gerenciamento de Produtos**: Adicionar, editar e remover livros
- **Gerenciamento de Pedidos**: Visualizar e atualizar status dos pedidos
- **Upload de Imagens**: Sistema de upload para capas de livros
- **Autenticação**: Sistema de login administrativo
- **Interface Responsiva**: Funciona em desktop e mobile

## 🛠️ Tecnologias

- **React 18**: Biblioteca JavaScript
- **Vite**: Build tool e dev server
- **React Router DOM**: Roteamento
- **Axios**: Cliente HTTP
- **React Icons**: Ícones
- **React Toastify**: Notificações
- **Tailwind CSS**: Framework CSS

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
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto admin (se necessário):

```env
VITE_BACKEND_URL=http://localhost:4000
```

### Configuração da API

O painel admin se comunica com o backend através da API. Certifique-se de que:

1. O backend está rodando na porta 4000
2. O CORS está configurado para permitir requisições do admin
3. As rotas de admin estão funcionando corretamente

## 🏃‍♂️ Execução

```bash
# Desenvolvimento
npm run dev
# Acesse: http://localhost:5174

# Produção
npm run build
npm run preview
```

## 🎯 Funcionalidades Principais

### 1. Login Administrativo

- Tela de login dedicada para administradores
- Autenticação via token JWT
- Redirecionamento automático após login

### 2. Dashboard

- Estatísticas de vendas
- Gráficos de performance
- Resumo de pedidos recentes
- Produtos mais vendidos

### 3. Gerenciamento de Produtos

#### Adicionar Produtos
- Formulário para novos livros
- Upload de múltiplas imagens
- Categorização por gênero
- Definição de preços e descrições

#### Listar Produtos
- Visualização em grid/lista
- Filtros por categoria
- Busca por nome/autor
- Ações rápidas (editar/excluir)

### 4. Gerenciamento de Pedidos

- Lista completa de pedidos
- Filtros por status (Pendente, Processando, Enviado, Entregue)
- Atualização de status
- Detalhes completos do pedido
- Informações do cliente

## 🎨 Interface do Usuário

### Layout Principal

```
+------------------+
|     Header       |
+------+-----------+
| Side |   Main    |
| bar  |  Content  |
|      |           |
+------+-----------+
```

### Componentes

- **Header**: Navegação principal e logout
- **Sidebar**: Menu lateral com navegação
- **Login**: Tela de autenticação
- **Add**: Formulário de adição de produtos
- **List**: Listagem de produtos
- **Orders**: Gerenciamento de pedidos

## 📱 Responsividade

O painel é totalmente responsivo e funciona em:

- **Desktop**: Layout completo com sidebar
- **Tablet**: Layout adaptado
- **Mobile**: Menu collapse e interface otimizada

## 🔒 Autenticação e Segurança

### Sistema de Autenticação

```javascript
// Login flow
1. Usuário insere credenciais
2. Envio para /api/user/admin
3. Recebimento do token JWT
4. Armazenamento no localStorage
5. Redirecionamento para dashboard
```

### Proteção de Rotas

Todas as rotas administrativas são protegidas e verificam:
- Presença do token
- Validade do token
- Permissões de administrador

## 📊 Gerenciamento de Estado

O aplicativo utiliza:
- **React Hooks**: useState, useEffect
- **Context API**: Para compartilhar dados globais
- **localStorage**: Para persistir o token de autenticação

## 🖼️ Upload de Imagens

### Funcionalidades
- Upload múltiplo de imagens
- Preview antes do upload
- Integração com Cloudinary
- Validação de formato e tamanho

### Formatos Suportados
- JPG/JPEG
- PNG
- WebP

## 📋 Formulários

### Adicionar Produto

```javascript
Campos obrigatórios:
- Nome do livro
- Descrição
- Preço
- Categoria
- Pelo menos uma imagem

Campos opcionais:
- Subcategoria
- Tamanhos disponíveis
- Marcar como bestseller
```

### Atualizar Pedido

```javascript
Status disponíveis:
- Processando Pedido
- Pedido Embalado
- Pedido Enviado
- Entregue
```

## 🎨 Customização de Estilos

O projeto usa Tailwind CSS para estilização:

```bash
# Configuração do Tailwind
tailwind.config.js

# Arquivo principal de estilos
src/index.css
```

### Classes Principais

```css
/* Cores do tema */
.bg-primary: Cor principal do sistema
.text-primary: Texto principal
.border-primary: Bordas principais

/* Layout */
.admin-container: Container principal
.sidebar: Barra lateral
.main-content: Conteúdo principal
```

## 🧪 Testes

```bash
# Executar testes (se configurados)
npm test

# Lint do código
npm run lint
```

## 📁 Estrutura do Projeto

```
admin/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Header.jsx        # Cabeçalho
│   │   ├── Login.jsx         # Tela de login
│   │   └── Sidebar.jsx       # Menu lateral
│   ├── pages/
│   │   ├── Add.jsx           # Adicionar produtos
│   │   ├── List.jsx          # Listar produtos
│   │   └── Orders.jsx        # Gerenciar pedidos
│   ├── assets/
│   │   ├── login.png         # Imagem de login
│   │   ├── logo.png          # Logo do sistema
│   │   └── upload_icon.png   # Ícone de upload
│   ├── App.jsx               # Componente principal
│   ├── main.jsx              # Ponto de entrada
│   └── index.css             # Estilos globais
├── index.html                # HTML base
├── package.json              # Dependências
├── tailwind.config.js        # Config Tailwind
├── vite.config.js            # Config Vite
└── README.md                 # Este arquivo
```

## 🚀 Deploy

### Build para Produção

```bash
# Gerar build
npm run build

# Arquivos gerados em dist/
# Upload para servidor web (Nginx, Apache, etc.)
```

### Variáveis de Ambiente para Produção

```env
VITE_BACKEND_URL=https://sua-api-producao.com
```

## 📈 Performance

### Otimizações Implementadas

- **Code Splitting**: Divisão automática do código
- **Tree Shaking**: Remoção de código não utilizado
- **Asset Optimization**: Otimização de imagens e recursos
- **Lazy Loading**: Carregamento sob demanda

### Métricas Recomendadas

- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)

## 🔧 Manutenção

### Atualizações de Dependências

```bash
# Verificar dependências desatualizadas
npm outdated

# Atualizar dependências
npm update

# Atualizar versões major (cuidado!)
npm install package@latest
```

### Logs e Debug

```bash
# Modo desenvolvimento com logs detalhados
npm run dev

# Build com análise de bundle
npm run build -- --analyze
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Crie um Pull Request

### Padrões de Código

- Use ESLint para manter a qualidade do código
- Siga as convenções do React
- Documente componentes complexos
- Escreva testes para novas funcionalidades

## 📞 Suporte

Para dúvidas sobre o painel administrativo:
- Consulte este README
- Verifique os logs do navegador
- Teste a conexão com a API
- Abra uma issue no repositório
