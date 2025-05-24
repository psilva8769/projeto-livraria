// cypress/e2e/about.cy.js
describe('About Page', () => {
  beforeEach(() => {
    cy.visit('/') // ajuste a URL inicial para onde o About está renderizado
  })

  it('should display main title', () => {
    cy.contains("Unveiling Our Store's key features!").should('be.visible')
  })

  it('should display all feature headings', () => {
    cy.contains('Easy Returns Process').should('be.visible')
    cy.contains('Secure Payment Options').should('be.visible')
    cy.contains('Live Customer Support').should('be.visible')
  })

  it('should display feature descriptions', () => {
    cy.get('section')
      .should('contain.text', 'Lorem ipsum dolor sit amet consectetur')
  })

  it('should display about image with alt attribute', () => {
    cy.get('img[alt="aboutImg"]').should('be.visible')
  })
})
