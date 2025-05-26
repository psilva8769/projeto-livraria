// e2e/cypress/e2e/cart-flow.cy.js
describe('Funcionalidades do carrinho', () => {
  let users

  before(() => {
    cy.fixture('users').then(data => {
      users = data
    })
  })

  beforeEach(() => {
    cy.visit('/')
    cy.login(users.validUser.email, users.validUser.password)
  })

  it('deve gerenciar itens no carrinho', () => {
    // Adicionar produtos
    cy.addToCart(0)
    cy.addToCart(1)
    cy.addToCart(2)

    // Verificar carrinho - acessar através do link
    cy.get('a[data-discover="true"][href="/cart"]').click()
    
    // Verificar se há itens no carrinho através do contador no header
    cy.get('a[data-discover="true"][href="/cart"] span')
      .invoke('text')
      .then(text => {
        const count = parseInt(text, 10)
        expect(count).to.be.greaterThan(0)
      })

    // Atualizar quantidade - usar seletores mais específicos baseados na estrutura real
    // Encontrar o primeiro item do carrinho
    cy.get('.bg-white\\/80').first().within(() => {
      // Botão "+" (segundo botão no controle de quantidade)
      cy.get('button').eq(1).click() // Botão "+"
      
      // Verificar se a quantidade aumentou para 2
      cy.get('p.px-4.font-semibold.text-navy').should('contain', '2')
      
      // Botão "-" (primeiro botão no controle de quantidade)
      cy.get('button').eq(0).click()
      
      // Verificar se a quantidade voltou para 1
      cy.get('p.px-4.font-semibold.text-navy').should('contain', '1')
    })

    // Remover todos os itens - usar o botão com title="Remover"
    cy.get('button[title="Remover"]').each(($btn) => {
      cy.wrap($btn).click()
      cy.wait(300) // Aguardar remoção
    })

    // Verificar se o carrinho está vazio
    cy.get('a[data-discover="true"][href="/cart"] span')
      .invoke('text')
      .then(text => {
        const count = parseInt(text, 10)
        expect(count).to.equal(0)
      })
  })

  it('deve calcular total corretamente', () => {
    cy.addToCart(0)
    cy.get('a[data-discover="true"][href="/cart"]').click()
    
    // Verificar componente CartTotal - usar a estrutura real do componente
    cy.contains('h5', 'Total:').parent().within(() => {
      // Verificar se o valor do total está presente e tem formato correto
      cy.get('p.h5.font-bold.text-accent')
        .invoke('text')
        .should('match', /^\$\d+\.00$/) // formato: $XX.00
    })
  })

})
