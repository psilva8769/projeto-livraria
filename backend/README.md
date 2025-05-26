# 🔧 Backend - API do Sistema de Livraria

API REST desenvolvida em Node.js com Express e MongoDB para gerenciar o sistema de livraria.

## 📋 Funcionalidades

- **Autenticação**: Sistema de login/registro com JWT
- **Produtos**: CRUD completo de livros
- **Carrinho**: Gerenciamento de carrinho de compras
- **Pedidos**: Processamento e histórico de pedidos
- **Upload**: Upload de imagens via Cloudinary
- **Pagamentos**: Integração com Stripe
- **Validação**: Validação robusta de dados

## 🛠️ Tecnologias

- **Node.js**: Runtime JavaScript
- **Express**: Framework web
- **MongoDB**: Banco de dados NoSQL
- **Mongoose**: ODM para MongoDB
- **JWT**: Autenticação
- **Bcrypt**: Hash de senhas
- **Cloudinary**: Armazenamento de imagens
- **Stripe**: Processamento de pagamentos
- **Multer**: Upload de arquivos
- **Validator**: Validação de dados

## 🚀 Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
```

## 🔧 Configuração

Crie um arquivo `.env` na raiz do projeto backend com as seguintes variáveis:

```env
# Banco de Dados
MONGODB_URI=mongodb://localhost:27017/livraria

# Autenticação
JWT_SECRET=seu_jwt_secret_muito_seguro_aqui

# Cloudinary (Upload de Imagens)
CLOUDINARY_NAME=seu_cloudinary_name
CLOUDINARY_API_KEY=sua_cloudinary_api_key
CLOUDINARY_API_SECRET=seu_cloudinary_api_secret

# Stripe (Pagamentos)
STRIPE_SECRET_KEY=sua_stripe_secret_key

# Servidor
PORT=4000
NODE_ENV=development
```

### Configuração do MongoDB

1. **Certifique-se que o MongoDB está rodando**:
   ```bash
   # Windows
   net start MongoDB
   
   # Linux/macOS
   sudo systemctl start mongod
   ```

2. **Verifique a conexão**:
   ```bash
   mongo mongodb://localhost:27017/livraria
   ```

### Configuração do Cloudinary

1. Crie uma conta em [Cloudinary](https://cloudinary.com/)
2. Obtenha suas credenciais no dashboard
3. Configure as variáveis no arquivo `.env`

### Configuração do Stripe

1. Crie uma conta em [Stripe](https://stripe.com/)
2. Obtenha sua Secret Key no dashboard
3. Configure a variável no arquivo `.env`

## 🏃‍♂️ Execução

```bash
# Desenvolvimento (com nodemon)
npm run server

# Produção
npm start

# Testes
npm test
```

## 📡 Endpoints da API

### Autenticação

```http
POST /api/user/register
POST /api/user/login
POST /api/user/admin
```

### Produtos

```http
GET /api/product/list          # Listar produtos
POST /api/product/add          # Adicionar produto (admin)
POST /api/product/remove       # Remover produto (admin)
```

### Carrinho

```http
POST /api/cart/add             # Adicionar ao carrinho
POST /api/cart/update          # Atualizar carrinho
POST /api/cart/get             # Obter carrinho
```

### Pedidos

```http
POST /api/order/place          # Fazer pedido
POST /api/order/stripe         # Verificar pagamento Stripe
POST /api/order/userorders     # Pedidos do usuário
GET /api/order/list            # Listar todos pedidos (admin)
POST /api/order/status         # Atualizar status (admin)
```

## 📊 Modelos de Dados

### Usuario (User)

```javascript
{
  name: String,
  email: String (único),
  password: String (hash),
  cartData: Object,
  date: Date
}
```

### Produto (Product)

```javascript
{
  name: String,
  description: String,
  price: Number,
  image: [String],
  category: String,
  subCategory: String,
  sizes: [String],
  bestseller: Boolean,
  date: Date
}
```

### Pedido (Order)

```javascript
{
  userId: String,
  items: Array,
  amount: Number,
  address: Object,
  status: String,
  paymentMethod: String,
  payment: Boolean,
  date: Date
}
```

## 🔒 Middleware

### auth.js
Verifica token JWT para usuários autenticados.

```javascript
// Uso
app.get('/protected-route', auth, (req, res) => {
  // req.body.userId está disponível
});
```

### adminAuth.js
Verifica se o usuário é um administrador.

```javascript
// Uso
app.post('/admin-only', adminAuth, (req, res) => {
  // Apenas admins podem acessar
});
```

### multer.js
Configuração para upload de arquivos.

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Executar testes específicos
npm test -- --testNamePattern="User Controller"

# Executar com coverage
npm test -- --coverage
```

### Estrutura de Testes

```
__tests__/
├── controllers/
│   ├── userController.test.js
│   ├── productController.test.js
│   ├── cartController.test.js
│   └── orderController.test.js
├── middleware/
│   ├── auth.test.js
│   └── adminAuth.test.js
└── routes/
    ├── userRoute.test.js
    ├── productRoute.test.js
    ├── cartRoute.test.js
    └── orderRoute.test.js
```

## 🚀 Deploy

### Variáveis de Ambiente para Produção

```env
NODE_ENV=production
MONGODB_URI=sua_string_conexao_mongodb_atlas
JWT_SECRET=jwt_secret_super_seguro_para_producao
```

### Comandos de Deploy

```bash
# Build (se necessário)
npm run build

# Iniciar em produção
npm start
```

## 📁 Estrutura do Projeto

```
backend/
├── config/
│   └── db.js              # Conexão MongoDB
├── controllers/
│   ├── userController.js  # Lógica de usuários
│   ├── productController.js # Lógica de produtos
│   ├── cartController.js  # Lógica do carrinho
│   └── orderController.js # Lógica de pedidos
├── middleware/
│   ├── auth.js           # Middleware de autenticação
│   ├── adminAuth.js      # Middleware admin
│   └── multer.js         # Configuração upload
├── models/
│   ├── userModel.js      # Schema do usuário
│   ├── productModel.js   # Schema do produto
│   └── orderModel.js     # Schema do pedido
├── routes/
│   ├── userRoute.js      # Rotas de usuário
│   ├── productRoute.js   # Rotas de produto
│   ├── cartRoute.js      # Rotas do carrinho
│   └── orderRoute.js     # Rotas de pedidos
├── __tests__/            # Testes automatizados
├── uploads/              # Arquivos temporários
├── .env                  # Variáveis de ambiente
├── server.js             # Servidor principal
└── package.json          # Dependências
```

## 🔍 Monitoramento e Logs

O servidor utiliza middleware de logging básico. Para produção, considere:

- **Morgan**: Logging de requisições HTTP
- **Winston**: Sistema de logs avançado
- **New Relic**: Monitoramento de performance

## 🛡️ Segurança

- Senhas hasheadas com bcrypt
- Autenticação via JWT
- Validação de entrada de dados
- CORS configurado
- Rate limiting (recomendado para produção)

## 📚 Documentação da API

Para documentação detalhada da API, considere usar:
- **Swagger/OpenAPI**
- **Postman Collections**

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Crie um Pull Request

## 📞 Suporte

Para dúvidas sobre o backend:
- Abra uma issue no repositório
- Verifique os logs do servidor
- Consulte a documentação do MongoDB e Express
