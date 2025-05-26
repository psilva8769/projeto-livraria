# Testes E2E - Projeto Livraria

Este projeto contém testes end-to-end para o sistema de livraria, incluindo tanto o frontend do usuário quanto o painel administrativo.

## Configuração

O projeto está configurado para trabalhar com duas aplicações diferentes:
- **Frontend do Usuário**: `http://localhost:5173`
- **Painel Administrativo**: `http://localhost:5174`

## Scripts Disponíveis

### Testes do Frontend (Usuário)
```bash
# Executar testes do usuário (user-flow, cart-flow, auth-flow)
npm run test:user

# Abrir Cypress para testes do usuário
npm run test:user:open
```

### Testes do Admin
```bash
# Executar testes do admin (admin-flow)
npm run test:admin

# Abrir Cypress para testes do admin
npm run test:admin:open
```

### Scripts Gerais
```bash
# Executar todos os testes
npm run cy:run

# Abrir Cypress (usa baseUrl padrão)
npm run cy:open
```

## Como Executar

### 1. Para testar fluxos do usuário:
```bash
# Certifique-se que o frontend está rodando na porta 5173
cd ..\frontend
npm run dev

# Em outro terminal, execute os testes
cd ..\e2e
npm run test:user
```

### 2. Para testar fluxos do admin:
```bash
# Certifique-se que o admin está rodando na porta 5174
cd ..\admin
npm run dev

# Em outro terminal, execute os testes
cd ..\e2e
npm run test:admin
```

### 3. Testando com ambos rodando:
Se você tiver ambas as aplicações rodando simultaneamente, você pode facilmente alternar entre os testes:

```bash
# Testes do usuário (frontend na porta 5173)
npm run test:user

# Testes do admin (admin na porta 5174)
npm run test:admin
```

## Comandos Customizados

### Para Frontend
- `cy.visitFrontend(path)` - Visita uma página do frontend
- `cy.login(email, password)` - Faz login no frontend
- `cy.addToCart(index)` - Adiciona produto ao carrinho

### Para Admin
- `cy.visitAdmin(path)` - Visita uma página do admin
- `cy.adminLogin(email, password)` - Faz login no admin

## Estrutura dos Testes

- `user-flow.cy.js` - Fluxo completo do usuário (registro, login, compra)
- `cart-flow.cy.js` - Funcionalidades do carrinho
- `auth-flow.cy.js` - Autenticação do usuário
- `admin-flow.cy.js` - Funcionalidades administrativas

## Variáveis de Ambiente

As seguintes variáveis podem ser configuradas:

```javascript
env: {
  apiUrl: 'http://localhost:4000/api',
  adminEmail: 'admin@admin.com',
  adminPassword: 'admin123',
  frontendUrl: 'http://localhost:5173',
  adminUrl: 'http://localhost:5174'
}
```

## Executar com URL Personalizada

```bash
# Executar com URL específica
set CYPRESS_BASE_URL=http://localhost:3000&& cypress run

# Ou no Linux/Mac
CYPRESS_BASE_URL=http://localhost:3000 cypress run
```
