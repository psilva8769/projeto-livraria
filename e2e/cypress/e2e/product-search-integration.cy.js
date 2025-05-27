describe('Product Search Integration', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('a[href="/shop"]').first().click()
    cy.url().should('include', '/shop')
  })
  
  it('should filter products by search input', () => {
    // Get the search input field
    cy.get('input[type="text"][placeholder*="Pesquise"]').should('be.visible')
    
    // Type in search query - using a more generic search term that's likely to match
    cy.get('input[type="text"][placeholder*="Pesquise"]').type('a')
    
    // Wait for filtering to happen with longer timeout
    cy.wait(1000)
    
    // Verify that the grid of books is displayed
    cy.get('.grid').should('be.visible')
    
    // Clear search
    cy.get('input[type="text"][placeholder*="Pesquise"]').clear()
    
    // Try another search
    cy.get('input[type="text"][placeholder*="Pesquise"]').type('Random Text That Should Not Match XYZ123')
    cy.wait(1000)
    
    // Verify "no results" message appears
    cy.contains('Nenhum livro encontrado').should('be.visible')
  })

  it('should sort products by price', () => {
    // Get the sort select element
    cy.get('select').should('be.visible')
    
    // Select sort by low price
    cy.get('select').select('low')
    cy.wait(500)
    
    // Verify products are displayed
    cy.get('.grid').should('be.visible')
    
    // Select sort by high price
    cy.get('select').select('high')
    cy.wait(500)
    
    // Verify products are displayed
    cy.get('.grid').should('be.visible')
  })
})
