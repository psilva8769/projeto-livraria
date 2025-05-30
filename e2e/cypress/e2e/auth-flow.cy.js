describe('Fluxo de autenticação - Look the Book Bookstore', () => {
  let users

  before(() => {
    cy.fixture('users').then(data => {
      users = data
    })
  })

  beforeEach(() => {
    // Limpar localStorage e sessionStorage antes de cada teste
    cy.clearLocalStorage()
    cy.clearCookies()
  })

  // Comandos customizados do Cypress
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

  describe('Registro de Usuário', () => {
    it('deve registrar usuário com dados válidos', () => {
      cy.register(users.validUser)
      
      // Verificar redirecionamento para home após registro
      cy.url().should('eq', Cypress.config().baseUrl + '/')
      
      // Verificar se o usuário está logado - procurar pelo ícone do usuário      
      // Ou verificar se não tem mais o botão "Entrar"
      cy.contains('button', 'Entrar').should('not.exist')
    })

    it('deve mostrar erro para email já existente', () => {
      // Primeiro registro
      cy.register(users.validUser)
      cy.visit('/login')
      
      // Segundo registro com mesmo email
      cy.register(users.validUser)
      
      // Verificar mensagem de erro (assumindo que aparece via toast)
      cy.get('.Toastify__toast--error').should('be.visible')
    })

    it('deve validar campos obrigatórios no registro', () => {
      cy.visit('/login')
      
      // Mudar para modo Sign Up
      cy.contains('span.cursor-pointer', 'Criar conta').click()
      
      // Tentar registrar sem preencher campos
      cy.contains('button', 'Cadastrar').click()
      
      // Verificar validação HTML5
    // Tentar submeter sem preencher campos e verificar mensagens de validação HTML5
    cy.get('input[placeholder="Nome"]')[0]?.checkValidity && cy.get('input[placeholder="Nome"]').then($input => {
      expect($input[0].validationMessage).to.not.equal('')
    })
    cy.get('input[placeholder="E-mail"]')[0]?.checkValidity && cy.get('input[placeholder="E-mail"]').then($input => {
      expect($input[0].validationMessage).to.not.equal('')
    })
    cy.get('input[placeholder="Senha"]')[0]?.checkValidity && cy.get('input[placeholder="Senha"]').then($input => {
      expect($input[0].validationMessage).to.not.equal('')
    })
    })

    it('deve validar formato de email', () => {
      cy.visit('/login')
      
      // Mudar para modo Sign Up
      cy.contains('span.cursor-pointer', 'Criar conta').click()
      
      cy.get('input[placeholder="Nome"]').type('Test User')
      cy.get('input[placeholder="E-mail"]').type('email-invalido')
      cy.get('input[placeholder="Senha"]').type('123456')
      
      cy.contains('button', 'Cadastrar').click()
      
      // Verificar se o campo email mostra erro de validação
    // O navegador exibe a validação HTML5 padrão para e-mail inválido
    cy.get('input[placeholder="E-mail"]')
      .then($input => {
        expect($input[0].validationMessage).to.contain('@')
      })
    })
  })

  describe('Login de Usuário', () => {
    beforeEach(() => {
      // Garantir que usuário existe antes de cada teste de login
      cy.visit('/login')
    })

    it('deve fazer login com credenciais válidas', () => {
      cy.login(users.validUser.email, users.validUser.password)
      
      // Verificar redirecionamento para home
      cy.url().should('eq', Cypress.config().baseUrl + '/')
      
      // Verificar se ícone do usuário aparece
      // Verificar se o ícone do usuário (TbUserCircle) está visível após login
      cy.get('.text-\\[32px\\]').should('be.visible')
      // Ou garantir que o botão "Entrar" não está mais presente
      cy.contains('button', 'Entrar').should('not.exist')
    })

    it('deve mostrar erro para credenciais inválidas', () => {
      cy.login('usuario@inexistente.com', 'senhaerrada')
      
      // Verificar mensagem de erro via toast
      cy.get('.Toastify__toast--error').should('be.visible')
    })

    it('deve mostrar erro para senha incorreta', () => {
      cy.login(users.validUser.email, 'senhaerrada')
      
      // Verificar mensagem de erro via toast
      cy.get('.Toastify__toast--error').should('be.visible')
    })
  })

  describe('Funcionalidades da Navbar', () => {
    beforeEach(() => {
      // Fazer login antes de testar funcionalidades da navbar
      cy.login(users.validUser.email, users.validUser.password)
    })

    it('deve mostrar menu do usuário quando logado', () => {
      // Verificar se o usuário está logado - procurar pelo ícone do usuário      
      // Ou verificar se não tem mais o botão "Entrar"
      cy.contains('button', 'Entrar').should('not.exist')
    
    // Forçar exibição do menu dropdown (workaround para group-hover no Cypress)
    cy.get('ul.group-hover\\:flex').invoke('show').should('be.visible')
      
      // Verificar se opção "Pedidos" está presente
      cy.contains('li', 'Pedidos').should('be.visible')
    })

    it('deve permitir logout', () => {
      // Fazer hover no ícone do usuário
      cy.get('.relative.group').filter(':has(svg.text-\\[32px\\])').first().should('be.visible').trigger('mouseover')
    
    // Forçar exibição do menu dropdown (workaround para group-hover no Cypress)
    cy.get('ul.group-hover\\:flex').invoke('show').should('be.visible')
      
      // Clicar em "Sair"
    cy.contains('li', 'Sair').click()
      
      // Verificar se foi redirecionado para login
      cy.url().should('include', '/login')
      
      // Verificar se botão "Entrar" aparece novamente
    cy.get('button[type="submit"]').contains('Entrar').click()
    })

    it('deve navegar para pedidos', () => {
      // Fazer hover no ícone do usuário
      // Selecionar o ícone do usuário de forma mais específica para evitar ambiguidades
      cy.get('.relative.group').filter(':has(svg.text-\\[32px\\])').first().should('be.visible').trigger('mouseover')
    
    // Forçar exibição do menu dropdown (workaround para group-hover no Cypress)
    cy.get('ul.group-hover\\:flex').invoke('show').should('be.visible')
      
      // Clicar em "Pedidos"
      cy.contains('li', 'Pedidos').click()
      
      // Verificar se foi para página de pedidos
      cy.url().should('include', '/orders')
    })
  })

  describe('Proteção de Rotas', () => {
    it('deve permitir acesso a rotas protegidas quando autenticado', () => {
      // Fazer login primeiro
      cy.login(users.validUser.email, users.validUser.password)
      
      // Tentar acessar rota protegida
      cy.visit('/orders')
      
      // Verificar se consegue acessar (página carrega com título correto)
      cy.url().should('include', '/orders')
      cy.contains('Lista de Pedidos').should('be.visible')
    })
  })

//   describe('Persistência de Sessão', () => {
//     it('deve manter usuário logado após refresh da página', () => {
//       cy.login(users.validUser.email, users.validUser.password)
      
//       // Recarregar a página
//       cy.reload()
      
//       // Verificar se ainda está logado (ícone do usuário visível)
//       cy.get('.text-\\[29px\\]').should('be.visible')
//     })

//     it('deve manter carrinho após login', () => {
//       // Visitar loja
//       cy.visit('/shop')
      
//       // Adicionar item ao carrinho (procurar pelo ícone de adicionar)
//       cy.get('[title="Adicionar ao carrinho"]').first().click()
      
//       // Fazer login
//       cy.register(users.validUser)
      
//       // Verificar se carrinho tem itens (número no badge)
//       cy.visit('/cart')
//       cy.get('.bg-primary.ring-1').should('exist') // Badge do carrinho
//     })
//   })

  describe('Navegação e Interface', () => {
    it('deve alternar entre Login e Cadastro', () => {
      cy.visit('/login')
      
      // Verificar estado inicial (Login)
      cy.contains('h3', 'Entrar').should('be.visible')
      
      // Clicar para ir para cadastro
      cy.contains('span.cursor-pointer', 'Criar conta').click()
      
      // Verificar mudança para cadastro
      cy.contains('h3', 'Cadastro').should('be.visible')
      cy.get('input[placeholder="Nome"]').should('be.visible')
      
      // Voltar para login
      cy.contains('span.cursor-pointer', 'Entrar').click()
      
      // Verificar volta para login
      cy.contains('h3', 'Entrar').should('be.visible')
      cy.get('input[placeholder="Nome"]').should('not.exist')
    })

    it('deve mostrar link "Esqueceu sua senha"', () => {
      cy.visit('/login')
      
      cy.contains('div', 'Esqueceu sua senha?')
        .should('have.class', 'text-secondary')
        .and('have.class', 'hover:text-navy')
        .and('have.class', 'cursor-pointer')
        .and('be.visible')
    })

    it('deve ter elementos visuais corretos', () => {
      cy.visit('/login')
      
      // Verificar se imagem de login está presente
      cy.get('img[alt=""]').should('be.visible') // loginImg
      
      // Verificar se formulário está no lado correto
      cy.get('.flexCenter.w-full.sm\\:w-1\\/2').should('exist')
    })
  })

  describe('Integração com Backend', () => {
    it('deve fazer chamada para API de registro', () => {
      // Interceptar chamada de registro
      cy.intercept('POST', '**/api/user/register', { fixture: 'users.json' }).as('register')
      
      cy.register(users.validUser)
      
      // Verificar se chamada foi feita
      cy.wait('@register').then((interception) => {
        expect(interception.request.body).to.include({
          name: users.validUser.name,
          email: users.validUser.email,
          password: users.validUser.password
        })
      })
    })

    it('deve fazer chamada para API de login', () => {
      // Interceptar chamada de login
      cy.intercept('POST', '**/api/user/login', { fixture: 'users.json' }).as('login')
      
      cy.login(users.validUser.email, users.validUser.password)
      
      // Verificar se chamada foi feita
      cy.wait('@login').then((interception) => {
        expect(interception.request.body).to.include({
          email: users.validUser.email,
          password: users.validUser.password
        })
      })
    })
  })
})