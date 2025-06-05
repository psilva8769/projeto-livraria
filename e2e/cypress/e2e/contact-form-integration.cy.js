describe('Contact Form Integration', () => {
  beforeEach(() => {
    // Visita a página de contato
    cy.visit('/contact')
    cy.url().should('include', '/contact')
    
    // Faz mock do console.log para rastrear o envio do formulário
    cy.window().then(win => {
      cy.spy(win.console, 'log').as('consoleLog')
    })
  })

  it('should submit contact form with valid data', () => {
    // Preenche o formulário com dados válidos
    cy.get('input[name="name"]').type('Test User')
    cy.get('input[name="email"]').type('test@example.com')
    cy.get('input[name="subject"]').type('Test Subject')
    cy.get('textarea[name="message"]').type('This is a test message.')
    
    // Envia o formulário
    cy.get('button[type="submit"]').contains('Enviar Mensagem').click()
    
    // Verifica se o formulário foi enviado (console.log foi chamado)
    cy.get('@consoleLog').should('be.calledWithMatch', 'Form submitted:')
    
    // Verifica se o formulário foi resetado após o envio
    cy.get('input[name="name"]').should('have.value', '')
    cy.get('input[name="email"]').should('have.value', '')
    cy.get('input[name="subject"]').should('have.value', '')
    cy.get('textarea[name="message"]').should('have.value', '')
  })

  it('should validate required fields in form', () => {
    // Tenta enviar sem preencher os campos obrigatórios
    cy.get('button[type="submit"]').contains('Enviar Mensagem').click()
    
    // O formulário não deve ser enviado (validação HTML5 impede)
    cy.get('@consoleLog').should('not.be.calledWithMatch', 'Form submitted:')
    
    // Preenche apenas o campo nome
    cy.get('input[name="name"]').type('Test User')
    cy.get('button[type="submit"]').contains('Enviar Mensagem').click()
    cy.get('@consoleLog').should('not.be.calledWithMatch', 'Form submitted:')
    
    // Preenche apenas os campos nome e email
    cy.get('input[name="email"]').type('test@example.com')
    cy.get('button[type="submit"]').contains('Enviar Mensagem').click()
    cy.get('@consoleLog').should('not.be.calledWithMatch', 'Form submitted:')
    
    // Preenche todos os campos obrigatórios exceto mensagem
    cy.get('input[name="subject"]').type('Test Subject')
    cy.get('button[type="submit"]').contains('Enviar Mensagem').click()
    cy.get('@consoleLog').should('not.be.calledWithMatch', 'Form submitted:')
  })
})
