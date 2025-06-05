# Implementação de Testes de Integração do Frontend

## Visão Geral

Este documento apresenta uma visão geral dos testes de integração implementados para o frontend da aplicação de e-commerce de livraria.

## Testes Implementados

Foram implementados dois principais testes de integração utilizando Cypress:

### 1. Teste de Integração da Busca de Produtos

**Arquivo:** `cypress/e2e/product-search-integration.cy.js`

**Descrição:** Testa a funcionalidade de busca e filtragem na página da loja.

**Casos de Teste:**
- **deve filtrar produtos pelo campo de busca**: Verifica se a busca de produtos funciona corretamente:
  - Testa a busca por um termo genérico que deve retornar resultados
  - Testa a busca por um termo inexistente para verificar se a mensagem de "nenhum resultado" aparece
  - Verifica se a grade de produtos é atualizada corretamente conforme o termo pesquisado

- **deve ordenar produtos por preço**: Testa a funcionalidade de ordenação de produtos:
  - Verifica se os produtos podem ser ordenados por preço (do menor para o maior e vice-versa)
  - Confirma se a grade de produtos é exibida corretamente após a ordenação

### 2. Teste de Integração do Formulário de Contato

**Arquivo:** `cypress/e2e/contact-form-integration.cy.js`

**Descrição:** Testa o envio e a validação do formulário de contato.

**Casos de Teste:**
- **deve enviar o formulário de contato com dados válidos**: Verifica que:
  - O formulário aceita dados válidos
  - O envio do formulário é processado corretamente
  - O formulário é resetado após o envio bem-sucedido

- **deve validar campos obrigatórios no formulário**: Testa a validação do formulário:
  - Verifica que o envio do formulário vazio é impedido
  - Testa o preenchimento parcial do formulário (faltando diferentes campos obrigatórios)
  - Garante o comportamento correto da validação para cada campo obrigatório

## Como Executar os Testes

Para executar estes testes de integração:

```bash
# Navegue até o diretório e2e
cd e2e

# Execute todos os testes de integração
npx cypress run --spec "cypress/e2e/contact-form-integration.cy.js,cypress/e2e/product-search-integration.cy.js"

# Execute um teste específico
npx cypress run --spec "cypress/e2e/product-search-integration.cy.js"
```

## Cobertura dos Testes

Estes testes de integração cobrem dois fluxos críticos de usuário na aplicação:

1. **Busca e Filtragem de Produtos**: Funcionalidade essencial de e-commerce que permite aos usuários encontrar produtos
2. **Envio do Formulário de Contato**: Interação importante para suporte ao cliente e feedback

## Observações

- Estes testes foram desenvolvidos para funcionar em conjunto com os testes unitários existentes
- Ambos os testes utilizam interações realistas de usuário (cliques, digitação) para simular o comportamento real
- Os testes foram escritos para serem resilientes a pequenas mudanças na interface, utilizando seletores flexíveis
