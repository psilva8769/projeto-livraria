// Tradução das mensagens do Jest para Português
const messages = {
  describe: 'Componente',
  test: 'teste',
  it: 'deve',
  beforeEach: 'antes de cada',
  afterEach: 'depois de cada',
  beforeAll: 'antes de todos',
  afterAll: 'depois de todos',
  pass: 'passou',
  fail: 'falhou',
  skip: 'pulou',
  todo: 'a fazer',
  
  // Mensagens comuns do expect
  toBeInTheDocument: 'estar no documento',
  toHaveClass: 'ter a classe',
  toHaveAttribute: 'ter o atributo',
  toBe: 'ser',
  toEqual: 'igual a',
  toContain: 'conter',
  toHaveLength: 'ter comprimento',
  toHaveBeenCalled: 'ter sido chamado',
  toHaveBeenCalledWith: 'ter sido chamado com',
  not: 'não',
};

// Configuração para traduzir as mensagens
if (global.expect) {
  const originalExpect = global.expect;
  global.expect = (...args) => {
    const expectation = originalExpect(...args);
    Object.keys(messages).forEach(key => {
      if (expectation[key]) {
        const originalMethod = expectation[key];
        expectation[key] = (...methodArgs) => {
          try {
            return originalMethod.apply(expectation, methodArgs);
          } catch (error) {
            error.message = error.message.replace(new RegExp(key, 'g'), messages[key]);
            throw error;
          }
        };
      }
    });
    return expectation;
  };
}
