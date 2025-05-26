# 📚 Sistema de Livraria

Um sistema completo de livraria com frontend para clientes, painel administrativo e API backend.

## 🏗️ Arquitetura do Sistema

- **Frontend**: Interface do cliente (React + Vite)
- **Admin**: Painel administrativo (React + Vite)
- **Backend**: API REST (Node.js + Express + MongoDB)
- **E2E**: Testes end-to-end (Cypress)

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- MongoDB
- Git

## 🔧 Instalação do MongoDB

### Windows

1. **Baixe o MongoDB Community Server**:
   - Acesse: https://www.mongodb.com/try/download/community
   - Selecione a versão para Windows
   - Baixe e instale o arquivo .msi

2. **Configure o MongoDB**:
   ```powershell
   # Crie o diretório de dados
   mkdir C:\data\db
   
   # Adicione o MongoDB ao PATH (ou use o MongoDB Compass)
   # C:\Program Files\MongoDB\Server\7.0\bin
   ```

3. **Inicie o MongoDB**:
   ```powershell
   # Via linha de comando
   mongod
   
   # Ou inicie o serviço Windows
   net start MongoDB
   ```

### Linux (Ubuntu/Debian)

```bash
# Instale o MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Inicie o MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### macOS

```bash
# Via Homebrew
brew tap mongodb/brew
brew install mongodb-community@7.0

# Inicie o MongoDB
brew services start mongodb/brew/mongodb-community@7.0
```

## 🚀 Primeiros Passos (Guia Rápido)

### 1. Instalar MongoDB
Siga as instruções da seção [Instalação do MongoDB](#instalação-do-mongodb) abaixo.

### 2. Configurar o Backend
```powershell
cd backend
copy .env.example .env
# Edite o arquivo .env com suas configurações
```

### 3. Executar o Sistema
```cmd
# Método mais fácil - execute na raiz do projeto
start-all.bat
```

**Pronto!** O sistema estará rodando em:
- Frontend: http://localhost:5173  
- Admin: http://localhost:5174
- Backend: http://localhost:4000

## 🚀 Instalação e Execução

### Instalação das Dependências

```powershell
# Clone o repositório
git clone <url-do-repositorio>
cd projeto-livraria

# Instale as dependências de todos os projetos
npm run install-all
```

### Configuração do Backend

1. Crie o arquivo `.env` no diretório `backend/`:
```env
MONGODB_URI=mongodb://localhost:27017/livraria
JWT_SECRET=seu_jwt_secret_aqui
CLOUDINARY_NAME=seu_cloudinary_name
CLOUDINARY_API_KEY=sua_cloudinary_api_key
CLOUDINARY_API_SECRET=seu_cloudinary_api_secret
STRIPE_SECRET_KEY=sua_stripe_secret_key
```

### Execução das Aplicações

#### Método Rápido (Recomendado)

**Opção 1: Script Batch (Mais Fácil)**
```cmd
# Execute o arquivo start-all.bat
start-all.bat
```

**Opção 2: Script PowerShell**
```powershell
# Execute o script PowerShell
.\start-all.ps1
```

#### Execução Manual Individual

```powershell
# Backend (API)
cd backend
npm run server

# Frontend (Cliente)
cd frontend
npm run dev

# Admin (Painel Administrativo)
cd admin
npm run dev
```

#### Scripts NPM (Após instalar dependências)

```powershell
# Instalar todas as dependências
npm run install-all

# Execute todas as aplicações simultaneamente
npm run dev:all
```

## 🌐 URLs das Aplicações

- **Frontend (Cliente)**: http://localhost:5173
- **Admin (Painel)**: http://localhost:5174
- **Backend (API)**: http://localhost:4000

## 📱 Scripts Disponíveis

### Scripts de Execução

```powershell
# Executar todas as aplicações (MAIS FÁCIL)
start-all.bat                # Script Windows Batch
.\start-all.ps1             # Script PowerShell

# Instalar dependências em todos os projetos
npm run install-all

# Executar aplicações individualmente
npm run dev:backend         # Apenas backend
npm run dev:frontend        # Apenas frontend  
npm run dev:admin          # Apenas admin

# Executar simultaneamente (precisa do concurrently)
npm run dev:all
```

### Scripts de Build e Teste

```powershell
# Executar testes
npm run test:all            # Todos os testes
npm run test:backend        # Testes do backend
npm run test:frontend       # Testes do frontend

# Executar testes E2E
npm run test:e2e

# Build de produção
npm run build:all

# Linting
npm run lint:all

# Limpeza (remover node_modules)
npm run clean
```

## 🧪 Testes

### Testes Unitários

```powershell
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Testes E2E

```powershell
cd e2e
npm run cypress:open
```

## 📂 Estrutura do Projeto

```
projeto-livraria/
├── frontend/          # Interface do cliente
├── admin/             # Painel administrativo
├── backend/           # API REST
├── e2e/              # Testes end-to-end
├── package.json      # Scripts principais
└── README.md         # Este arquivo
```

## 🔑 Funcionalidades

### Frontend (Cliente)
- Catálogo de livros
- Sistema de carrinho
- Autenticação de usuários
- Processo de checkout
- Histórico de pedidos

### Admin (Painel Administrativo)
- Gerenciamento de produtos
- Gerenciamento de pedidos
- Dashboard administrativo
- Upload de imagens

### Backend (API)
- API RESTful
- Autenticação JWT
- Upload de imagens (Cloudinary)
- Integração com Stripe
- Validação de dados

## 🛠️ Tecnologias Utilizadas

### Frontend
- React 18
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- React Toastify

### Backend
- Node.js
- Express
- MongoDB (Mongoose)
- JWT
- Bcrypt
- Cloudinary
- Stripe

### Testes
- Jest
- Cypress
- Testing Library

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte e dúvidas, abra uma issue no repositório do projeto.
