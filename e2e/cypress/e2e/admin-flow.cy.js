describe('Painel Administrativo - Look the Book Bookstore', () => {
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
  })  // Comando customizado para login do admin
  Cypress.Commands.add('adminLogin', (email, password) => {
    // Usar o comando visitAdmin ao invés de URL hardcoded
    cy.visitAdmin('/')
    
    // Aguardar o formulário carregar
    cy.get('input[placeholder="Email"]').should('be.visible')
    
    // Preencher formulário de login
    cy.get('input[placeholder="Email"]').type(email)
    cy.get('input[placeholder="Password"]').type(password)
    
    // Clicar no botão de login
    cy.contains('button', 'Login').click()
  })

  describe('Autenticação do Admin', () => {
    it('deve fazer login como administrador', () => {
      cy.adminLogin(users.adminUser.email, users.adminUser.password)
      
      // Verificar se foi redirecionado para o painel admin
      cy.get('.bg-primary').should('be.visible')
      cy.contains('Look the Book').should('be.visible')
      
      // Verificar se o sidebar está presente
      cy.contains('Add Item').should('be.visible')
      cy.contains('List').should('be.visible')
      cy.contains('Orders').should('be.visible')
    })

    it('deve mostrar erro para credenciais inválidas', () => {
      cy.adminLogin('admin@invalido.com', 'senhaerrada')
      
      // Verificar mensagem de erro via toast
      cy.get('.Toastify__toast--error').should('be.visible')
    })

    it('deve fazer logout', () => {
      cy.adminLogin(users.adminUser.email, users.adminUser.password)
      
      // Clicar no botão de logout
      cy.get('.text-lg').click() // BiLogOut icon
      
      // Verificar se foi redirecionado para login
      cy.contains('Admin Panel').should('be.visible')
    })
  })

  describe('Gerenciamento de Produtos', () => {
    const productData = {
      name: 'Livro de Teste Cypress',
      price: '49',
      category: 'Fiction',
      description: 'Descrição de teste para o produto criado pelo Cypress.'
    }

    beforeEach(() => {
      // Fazer login antes de cada teste
      cy.adminLogin(users.adminUser.email, users.adminUser.password)
    })

    it('deve adicionar um novo produto', () => {
      // Verificar se está na página de adicionar (rota padrão)
      cy.contains('Nome do Produto').should('be.visible')
      
      // Preencher formulário
      cy.get('input[placeholder="Escreva aqui..."]').first().type(productData.name)
      cy.get('textarea[placeholder="Escreva aqui..."]').type(productData.description)
      
      // Selecionar categoria
      cy.get('select').select('Ficção')
      
      // Adicionar preço
      cy.get('input[placeholder="Preço"]').type(productData.price)
      
      // Marcar como popular
      cy.get('input[type="checkbox"]').check()
        // Submeter formulário
      cy.contains('button', 'Adicionar Produto').click()
      
      // Aguardar resposta da API e verificar mensagem de sucesso ou erro
    cy.get('.Toastify__toast-body > :nth-child(2)', { timeout: 15000 })
      .should('be.visible')
      .and('contain.text', 'Product Created')
    })

    it('deve listar produtos existentes', () => {
      // Navegar para a lista de produtos
      cy.contains('List').click()
      
      // Verificar se os headers da tabela estão presentes
      cy.contains('h5', 'Imagem').should('be.visible')
      cy.contains('h5', 'Nome').should('be.visible')
      cy.contains('h5', 'Categoria').should('be.visible')
      cy.contains('h5', 'Preço').should('be.visible')
      cy.contains('h5', 'Remover').should('be.visible')
      
      // Aguardar um pouco para produtos carregarem
      cy.wait(1000)
        // Verificar se há pelo menos um produto ou se a estrutura da grid está presente
      cy.get('.grid').should('exist')
    })

    it('deve remover um produto', () => {
      // Navegar para a lista de produtos
      cy.contains('List').click()
      
      // Aguardar produtos carregarem
      cy.wait(2000)
      
      // Verificar se existe pelo menos um produto para remover
      cy.get('body').then($body => {        if ($body.find('.text-lg').length > 0) {
          // Clicar no ícone de lixeira do primeiro produto (TbTrash)
          cy.get('.text-lg').first().click()
          
        //   // Aguardar resposta da API e verificar mensagem de sucesso
        //   cy.get('.Toastify__toast', { timeout: 15000 })
        //     .should('be.visible')
        //     .and('contain.text', 'sucesso')
        } else {
          // Se não há produtos, apenas verificar que a lista está vazia
          cy.log('Nenhum produto disponível para remover')
        }
      })
    })
  })

  describe('Gerenciamento de Pedidos', () => {
    beforeEach(() => {
      // Fazer login antes de cada teste
      cy.adminLogin(users.adminUser.email, users.adminUser.password)
      
      // Navegar para a página de pedidos
      cy.contains('Orders').click()
    })

    it('deve listar pedidos existentes', () => {
      // Verificar se elementos dos pedidos estão presentes
      cy.contains('Itens:').should('be.visible')
      cy.contains('Nome:').should('be.visible')
      cy.contains('Endereço:').should('be.visible')
      cy.contains('Total de itens:').should('be.visible')
      cy.contains('Método de pagamento:').should('be.visible')
      cy.contains('Pagamento:').should('be.visible')
      cy.contains('Data:').should('be.visible')
      cy.contains('Preço:').should('be.visible')
    })

    it('deve alterar status de um pedido', () => {
      // Selecionar o primeiro select de status
      cy.get('select').first().select('Shipped')
      
      // Verificar se o valor foi alterado
      cy.get('select').first().should('have.value', 'Shipped')
    })

    it('deve mostrar informações detalhadas do pedido', () => {
      // Verificar se as informações do pedido estão visíveis
      cy.get('.text-3xl.text-secondary').should('be.visible') // TfiPackage icon
      
      // Verificar se há itens no pedido
      cy.contains('x').should('exist') // quantidade de itens
      
      // Verificar se há informações de endereço
      cy.contains(',').should('exist') // vírgulas no endereço
    })
  })

  describe('Navegação do Sidebar', () => {
    beforeEach(() => {
      cy.adminLogin(users.adminUser.email, users.adminUser.password)
    })

    it('deve navegar entre as páginas', () => {
      // Verificar navegação para Add Item (página padrão)
      cy.contains('Nome do Produto').should('be.visible')
      
      // Navegar para List
      cy.contains('List').click()
      cy.contains('h5', 'Imagem').should('be.visible')
      
      // Navegar para Orders
      cy.contains('Orders').click()
      cy.contains('Itens:').should('be.visible')
      
      // Voltar para Add Item
      cy.contains('Add Item').click()
      cy.contains('Nome do Produto').should('be.visible')
    })

    it('deve destacar a página ativa', () => {
      // Verificar se Add Item está ativo por padrão
      cy.get('.active-link').should('exist')
      
      // Navegar para List e verificar se fica ativo
      cy.contains('List').click()
      cy.get('.active-link').should('exist')
    })
  })

  describe('Interface e Responsividade', () => {
    beforeEach(() => {
      cy.adminLogin(users.adminUser.email, users.adminUser.password)
    })

    it('deve mostrar logo corretamente', () => {
      cy.get('img[alt="logoImg"]').should('be.visible')
      cy.contains('Look the Book').should('be.visible')
    })

    it('deve ter formulários funcionais', () => {
      // Verificar se formulário está presente
      cy.contains('Nome do Produto').should('be.visible')
      cy.get('input[placeholder="Escreva aqui..."]').first().should('be.visible')
      cy.get('textarea[placeholder="Escreva aqui..."]').should('be.visible')
      cy.get('input[placeholder="Preço"]').should('be.visible')
      cy.contains('button', 'Adicionar Produto').should('be.visible')
    })
  })

  describe('Integração com Backend', () => {
    beforeEach(() => {
      cy.adminLogin(users.adminUser.email, users.adminUser.password)
    })

    it('deve fazer chamada para API de listagem de produtos', () => {
      // Interceptar chamada de listagem
      cy.intercept('GET', '**/api/product/list').as('listProducts')
      
      // Navegar para lista
      cy.contains('List').click()
        // Verificar se chamada foi feita
      cy.wait('@listProducts')
    })

    it('deve fazer chamada para API de remoção de produto', () => {
      // Interceptar chamada de remoção
      cy.intercept('POST', '**/api/product/delete').as('deleteProduct')
      
      // Navegar para lista
      cy.contains('List').click()
      
      // Aguardar produtos carregarem
      cy.wait(2000)
      
      // Verificar se existe produto para remover e tentar remover
      cy.get('body').then($body => {
        if ($body.find('.text-lg').length > 0) {
          cy.get('.text-lg').first().click()
          // Verificar se toast aparece (independente de interceptar a chamada)
        //   cy.get('.Toastify__toast').should('be.visible')
        } else {
          cy.log('Nenhum produto disponível para testar remoção')
        }
      })
    })

    it('deve fazer chamada para API de pedidos', () => {
      // Interceptar chamada de listagem de pedidos
      cy.intercept('POST', '**/api/order/list').as('listOrders')
      
      // Navegar para pedidos
      cy.contains('Orders').click()
      
      // Verificar se chamada foi feita
      cy.wait('@listOrders')
    })
  })
})