describe('Contact Form Integration', () => {
  beforeEach(() => {
    // Visit the contact page
    cy.visit('/contact')
    cy.url().should('include', '/contact')
    
    // Mock console.log to track form submission
    cy.window().then(win => {
      cy.spy(win.console, 'log').as('consoleLog')
    })
  })

  it('should submit contact form with valid data', () => {
    // Fill out the form with valid data
    cy.get('input[name="name"]').type('Test User')
    cy.get('input[name="email"]').type('test@example.com')
    cy.get('input[name="subject"]').type('Test Subject')
    cy.get('textarea[name="message"]').type('This is a test message.')
    
    // Submit the form
    cy.get('button[type="submit"]').contains('Enviar Mensagem').click()
    
    // Verify form was submitted (console.log was called)
    cy.get('@consoleLog').should('be.calledWithMatch', 'Form submitted:')
    
    // Verify form was reset after submission
    cy.get('input[name="name"]').should('have.value', '')
    cy.get('input[name="email"]').should('have.value', '')
    cy.get('input[name="subject"]').should('have.value', '')
    cy.get('textarea[name="message"]').should('have.value', '')
  })

  it('should validate required fields in form', () => {
    // Try to submit without filling in required fields
    cy.get('button[type="submit"]').contains('Enviar Mensagem').click()
    
    // Form should not be submitted (HTML5 validation prevents it)
    cy.get('@consoleLog').should('not.be.calledWithMatch', 'Form submitted:')
    
    // Fill out only name field
    cy.get('input[name="name"]').type('Test User')
    cy.get('button[type="submit"]').contains('Enviar Mensagem').click()
    cy.get('@consoleLog').should('not.be.calledWithMatch', 'Form submitted:')
    
    // Fill out only name and email fields
    cy.get('input[name="email"]').type('test@example.com')
    cy.get('button[type="submit"]').contains('Enviar Mensagem').click()
    cy.get('@consoleLog').should('not.be.calledWithMatch', 'Form submitted:')
    
    // Fill out all required fields except message
    cy.get('input[name="subject"]').type('Test Subject')
    cy.get('button[type="submit"]').contains('Enviar Mensagem').click()
    cy.get('@consoleLog').should('not.be.calledWithMatch', 'Form submitted:')
  })
})
