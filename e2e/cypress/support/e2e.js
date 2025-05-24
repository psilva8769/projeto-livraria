// Importar comandos customizados
import './commands'

// Configurações globais do Cypress
Cypress.on('uncaught:exception', (err, runnable) => {
  // Retorna false para prevenir que erros não tratados falhem o teste
  // Útil para erros de third-party que não afetam a funcionalidade
  if (err.message.includes('Script error')) {
    return false
  }
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false
  }
  return true
})

// Hook para executar antes de cada teste
beforeEach(() => {
  // Limpar localStorage e sessionStorage antes de cada teste
  cy.clearLocalStorage()
  cy.clearAllSessionStorage()
  
  // Removi as interceptações por enquanto - adicione conforme necessário
})

// Hook para executar após cada teste
afterEach(() => {
  // Logs adicionais em caso de falha
  cy.on('fail', (err) => {
    console.log('Teste falhou:', err.message)
  })
})

// Configuração de viewport padrão
Cypress.config('viewportWidth', 1280)
Cypress.config('viewportHeight', 720)

// Timeout personalizado para elementos
Cypress.config('defaultCommandTimeout', 8000)
Cypress.config('requestTimeout', 10000)
Cypress.config('responseTimeout', 10000)

// Configuração para screenshots automáticos
Cypress.Screenshot.defaults({
  screenshotOnRunFailure: true,
  capture: 'viewport'
})

