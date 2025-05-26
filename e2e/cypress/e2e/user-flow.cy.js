
// Custom commands - moved outside describe block
Cypress.Commands.add('register', (user) => {
  cy.visit('/login')
  
  // Clicar para mudar para modo "Sign Up" usando o texto correto em português
  cy.contains('span.cursor-pointer', 'Criar conta').click()
  
  // Aguardar o formulário carregar
  cy.get('input[placeholder="Nome"]').should('be.visible')
  
  // Preencher formulário de registro
  cy.get('input[placeholder="Nome"]').clear().type(user.name)
  cy.get('input[placeholder="E-mail"]').clear().type(user.email)
  cy.get('input[placeholder="Senha"]').clear().type(user.password)
  
  // Clicar no botão de cadastro
  cy.contains('button', 'Cadastrar').click()
  
  // Aguardar redirecionamento ou confirmação
  cy.wait(2000)
})

Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login')
  
  // Aguardar o formulário carregar
  cy.get('input[placeholder="E-mail"]').should('be.visible')
  
  // Preencher formulário de login
  cy.get('input[placeholder="E-mail"]').clear().type(email)
  cy.get('input[placeholder="Senha"]').clear().type(password)
  
  // Clicar no botão de login
  cy.get('button[type="submit"]').contains('Entrar').click()
  
  // Aguardar login ser processado
  cy.wait(3000)
})

Cypress.Commands.add('addToCart', (index) => {
  // Garantir que estamos na página inicial
  cy.visit('/')
  cy.wait(2000)
  
  // Fazer scroll para garantir que o elemento esteja visível
  cy.get('span[title="Adicionar ao carrinho"]').eq(index).scrollIntoView()
  
  // Aguardar um pouco para garantir que o elemento está totalmente carregado
  cy.wait(1000)
  
  // Tentar clicar normalmente primeiro, se falhar usar force
  cy.get('span[title="Adicionar ao carrinho"]').eq(index).then($el => {
    if ($el.is(':visible')) {
      cy.wrap($el).click()
    } else {
      cy.wrap($el).click({ force: true })
    }
  })
  
  // Aguardar o produto ser adicionado
  cy.wait(1000)
})

describe('Fluxo completo do usuário', () => {
  let users

  before(() => {
    cy.fixture('users').then(data => {
      users = data
    })
  })
  beforeEach(() => {
    cy.visit('/')
    cy.wait(2000)
    
    // Clear cart by logging out and back in to reset state
    cy.window().then((win) => {
      win.localStorage.clear()
    })
  })

  it('deve completar jornada: registro → login → compra → pedido', () => {
    // 1. Registro
    cy.register(users.validUser)

    // 2. Login
    cy.login(users.validUser.email, users.validUser.password)    // 3. Adicionar produtos ao carrinho
    cy.addToCart(0)
    cy.addToCart(1)

    // 4. Verificar carrinho
    cy.get('a[data-discover="true"][href="/cart"]').should('be.visible').click()
    cy.wait(3000)
      // Verificar se há produtos no carrinho baseado na estrutura real
    cy.get('div.bg-white\\/80').should('have.length.at.least', 1)
    cy.contains('h5', 'Total:').should('be.visible')// 5. Atualizar quantidade - usar os controles corretos da quantidade
    cy.get('div.bg-white\\/80').first().within(() => {
      // Primeiro, pegar a quantidade atual
      cy.get('p.px-4.font-semibold.text-navy').invoke('text').then((currentQty) => {
        const currentQuantity = parseInt(currentQty.trim())
        
        // Clicar no botão "+" (aumentar quantidade)
        cy.get('.flex.items-center.bg-gradient-to-r button').last().click()
        cy.wait(1000)
        
        // Verificar se a quantidade aumentou em 1
        cy.get('p.px-4.font-semibold.text-navy').should('contain.text', (currentQuantity + 1).toString())
      })
    })

    // 6. Proceder ao checkout
    cy.get('button').contains('Finalizar Compra').should('be.visible').click()
    cy.wait(2000)    // 7. Preencher dados de entrega
    cy.get('input[placeholder="Seu primeiro nome"]').should('be.visible').clear().type('João')
    cy.get('input[placeholder="Seu sobrenome"]').clear().type('Silva')
    cy.get('input[placeholder="seu@email.com"]').clear().type('joao.silva@email.com')
    cy.get('input[placeholder="(11) 99999-9999"]').clear().type('(11) 99999-9999')
    cy.get('input[placeholder="Rua, número e complemento"]').clear().type('Rua das Flores, 123')
    cy.get('input[placeholder="São Paulo"]').clear().type('São Paulo')
    cy.get('input[placeholder="SP"]').clear().type('SP')
    cy.get('input[placeholder="00000-000"]').clear().type('01234-567')
    cy.get('input[placeholder="Brasil"]').clear().type('Brasil')

    // 8. Finalizar pedido
    cy.get('button').contains('Finalizar Pedido').should('be.visible').click()
    cy.wait(3000)

    // 9. Verificar se o pedido foi finalizado com sucesso
    // Pode adicionar verificações adicionais aqui dependendo do comportamento da aplicação
  })

})