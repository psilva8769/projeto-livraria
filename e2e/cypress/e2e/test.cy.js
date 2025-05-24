describe('Teste básico', () => {
  it('deve acessar a página inicial', () => {
    cy.visit('/')
    cy.get('body').should('be.visible')
  })
  
  it('deve verificar se a API está funcionando', () => {
    cy.request('GET', 'http://localhost:4000/api/product/list')
      .then((response) => {
        expect(response.status).to.eq(200)
      })
  })
})