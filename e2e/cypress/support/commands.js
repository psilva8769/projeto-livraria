// Adicionar ao final do arquivo commands.js existente

// Comando para preservar sessão de login
Cypress.Commands.add('loginWithSession', (email, password) => {
  cy.session([email, password], () => {
    cy.visit('/login')
    cy.get('[data-cy="email-input"]').type(email)
    cy.get('[data-cy="password-input"]').type(password)
    cy.get('[data-cy="login-button"]').click()
    cy.url().should('not.include', '/login')
  })
})

// Comando para preservar sessão de admin
Cypress.Commands.add('adminLoginWithSession', () => {
  cy.session('admin', () => {
    cy.visit('/admin/login')
    cy.get('[data-cy="admin-email"]').type(Cypress.env('adminEmail'))
    cy.get('[data-cy="admin-password"]').type(Cypress.env('adminPassword'))
    cy.get('[data-cy="admin-login-button"]').click()
    cy.url().should('include', '/admin')
  })
})

// Comando de login simples para testes do carrinho
Cypress.Commands.add('login', (email, password) => {
  cy.visitFrontend('/login')
  
  // Aguardar o formulário carregar
  cy.get('input[placeholder="E-mail"]').should('be.visible')
  
  // Preencher formulário de login
  cy.get('input[placeholder="E-mail"]').type(email)
  cy.get('input[placeholder="Senha"]').type(password)
  
  // Clicar no botão de login
  cy.get('button[type="submit"]').contains('Entrar').click()
})

// Comando para adicionar ao carrinho
Cypress.Commands.add('addToCart', (index) => {
  // Primeiro fazer scroll até o elemento e hover no item para mostrar o botão
  cy.get('.bg-white\\/80.backdrop-blur-sm.rounded-2xl').eq(index).scrollIntoView()
  cy.get('.bg-white\\/80.backdrop-blur-sm.rounded-2xl').eq(index).trigger('mouseover')
  cy.wait(200) // Aguardar animação do hover
  // Depois clicar no botão que aparece com force para contornar problemas de visibilidade
  cy.get('.bg-white\\/80.backdrop-blur-sm.rounded-2xl').eq(index).find('span[title="Adicionar ao carrinho"]').click({ force: true })
  cy.wait(500) // Aguardar atualização do estado
})

// Comando para limpar todas as sessões
Cypress.Commands.add('clearAllSessions', () => {
  Cypress.session.clearAllSavedSessions()
})

// Comandos para diferentes URLs
Cypress.Commands.add('visitFrontend', (path = '/') => {
  const frontendUrl = Cypress.env('frontendUrl') || 'http://localhost:5173'
  cy.visit(`${frontendUrl}${path}`)
})

Cypress.Commands.add('visitAdmin', (path = '/') => {
  const adminUrl = Cypress.env('adminUrl') || 'http://localhost:5174'
  cy.visit(`${adminUrl}${path}`)
})