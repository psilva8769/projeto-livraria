describe('Fluxo completo do usuário', () => {
  let users

  before(() => {
    cy.fixture('users').then(data => {
      users = data
    })
  })

  beforeEach(() => {
    cy.visit('/')
  })

    Cypress.Commands.add('register', (user) => {
    cy.visit('/login')
    
    // Clicar para mudar para modo "Sign Up" usando o texto correto em português
    cy.contains('span.cursor-pointer', 'Criar conta').click()
    
    // Aguardar o formulário carregar
    cy.get('input[placeholder="Nome"]').should('be.visible')
    
    // Preencher formulário de registro
    cy.get('input[placeholder="Nome"]').type(user.name)
    cy.get('input[placeholder="E-mail"]').type(user.email)
    cy.get('input[placeholder="Senha"]').type(user.password)
    
    // Clicar no botão de cadastro
    cy.contains('button', 'Cadastrar').click()
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

it('deve completar jornada: registro → login → compra → pedido', () => {
    // 1. Registro
    cy.register(users.validUser)

    // 2. Login
    cy.login(users.validUser.email, users.validUser.password)

    // 3. Adicionar produtos ao carrinho
    cy.addToCart(0)
    cy.addToCart(1)

    // 4. Verificar carrinho
    cy.get('a[data-discover="true"][href="/cart"]').click()
    cy.get('.bg-white .flex.items-center').should('have.length.at.least', 2)
    cy.get('.flexBetween.pt-3').contains('Total:')

    // 5. Atualizar quantidade
    cy.get('.bg-white .flex.items-center button').eq(1).click()
    cy.get('.bg-white .flex.items-center p.px-2').first().should('have.text', '2')

    // 6. Proceder ao checkout
    cy.get('button').contains('Finalizar Compra').click()

    // 7. Preencher dados de entrega
    cy.get('input[placeholder="Nome"]').type('João')
    cy.get('input[placeholder="Sobrenome"]').type('Silva')
    cy.get('input[placeholder="E-mail"]').type('joao.silva@email.com')
    cy.get('input[placeholder="Telefone"]').type('(11) 99999-9999')
    cy.get('input[placeholder="Rua"]').type('Rua das Flores, 123')
    cy.get('input[placeholder="Cidade"]').type('São Paulo')
    cy.get('input[placeholder="Estado"]').type('SP')
    cy.get('input[placeholder="CEP"]').type('01234-567')
    cy.get('input[placeholder="País"]').type('Brasil')

    // 8. Finalizar pedido
    cy.get('button').contains('Finalizar Pedido').click()

})

})