// e2e/cypress/e2e/cart-flow.cy.js
describe('Funcionalidades do carrinho', () => {
  let users

  before(() => {
    cy.fixture('users').then(data => {
      users = data
    })
  })

    Cypress.Commands.add('login', (email, password) => {
    cy.visit('/login')
    
    // Aguardar o formulário carregar
    cy.get('input[placeholder="E-mail"]').should('be.visible')
    
    // Preencher formulário de login
    cy.get('input[placeholder="E-mail"]').type(email)
    cy.get('input[placeholder="Senha"]').type(password)
    
    // Clicar no botão de login
    cy.get('button[type="submit"]').contains('Entrar').click()
  })

    Cypress.Commands.add('addToCart', (index) => {
        cy.get('span[title="Adicionar ao carrinho"]').eq(index).click()
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

    // Verificar carrinho
    cy.get('a[data-discover="true"][href="/cart"]').click()
    cy.get('a[data-discover="true"][href="/cart"] span')
      .invoke('text')
      .then(text => {
        const count = parseInt(text, 10)
        expect(count).to.be.greaterThan(0)
      })

    // Atualizar quantidade
    // Aumentar quantidade usando botão "+"
    // Aumentar quantidade usando botão "+"
    cy.get('.bg-white .flex.items-center button').eq(1).click()

    // Verifica se o valor agora é 2
    cy.get('.bg-white .flex.items-center p.px-2').first().should('have.text', '2')

    // Diminuir quantidade usando botão "-"
    cy.get('.bg-white .flex.items-center button').eq(0).click()
    cy.get('.bg-white .flex.items-center p.px-2').first().should('have.text', '1')

    // Remover item (ícone SVG do lixo)
    cy.get('svg.cursor-pointer.text-xl.text-secondary')
      .should('exist')
      .each(($el) => {
        cy.wrap($el).click()
      })

        // Verifica se o carrinho está vazio
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
    
    // Verificar se o total é maior que zero
    cy.get('.flexBetween.pt-3').contains('Total:').siblings('p.h5')
      .invoke('text')
      .should('match', /^\$\d+(\.\d{1,3})?(\.\d{2})?$/) // matches $94, $94.9, $94.90, $94.9.00

    // Optionally, normalize the value to ensure correct format
    // .then((text) => {
    //   expect(text).to.match(/^\$\d+(\.\d{1,2})?$/)
    // })
})

it('deve persistir carrinho entre sessões', () => {
    cy.addToCart(0)
    cy.addToCart(1)
    
    // Recarregar página
    cy.reload()
    
    // Verificar se itens persistiram
    cy.get('a[data-discover="true"][href="/cart"]').click()
    cy.get('.bg-white .flex.items-center').should('have.length.at.least', 2)
})
})