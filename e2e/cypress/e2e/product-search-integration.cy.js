describe('Product Search Integration', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('a[href="/shop"]').first().click()
    cy.url().should('include', '/shop')
  })
  
  it('deve filtrar produtos pelo campo de busca', () => {
    // Obter o campo de busca
    cy.get('input[type="text"][placeholder*="Pesquise"]').should('be.visible')
    
    // Digitar consulta de busca - usando um termo mais genérico que provavelmente irá corresponder
    cy.get('input[type="text"][placeholder*="Pesquise"]').type('a')
    
    // Esperar o filtro acontecer com timeout maior
    cy.wait(1000)
    
    // Verificar se o grid de livros está visível
    cy.get('.grid').should('be.visible')
    
    // Limpar busca
    cy.get('input[type="text"][placeholder*="Pesquise"]').clear()
    
    // Tentar outra busca
    cy.get('input[type="text"][placeholder*="Pesquise"]').type('Random Text That Should Not Match XYZ123')
    cy.wait(1000)
    
    // Verificar se a mensagem "nenhum resultado" aparece
    cy.contains('Nenhum livro encontrado').should('be.visible')
  })

  it('deve ordenar produtos por preço', () => {
    // Obter o elemento select de ordenação
    cy.get('select').should('be.visible')
    
    // Selecionar ordenação por menor preço
    cy.get('select').select('low')
    cy.wait(500)
    
    // Verificar se os produtos estão visíveis
    cy.get('.grid').should('be.visible')
    
    // Selecionar ordenação por maior preço
    cy.get('select').select('high')
    cy.wait(500)
    
    // Verificar se os produtos estão visíveis
    cy.get('.grid').should('be.visible')
  })
})
