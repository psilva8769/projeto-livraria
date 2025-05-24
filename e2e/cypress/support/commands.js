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

// Comando para limpar todas as sessões
Cypress.Commands.add('clearAllSessions', () => {
  Cypress.session.clearAllSavedSessions()
})