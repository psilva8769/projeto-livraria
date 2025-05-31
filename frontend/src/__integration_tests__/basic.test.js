const sum = (a, b) => a + b;

// Testa se a soma de 1 + 2 é igual a 3
test('soma 1 + 2 para ser igual a 3', () => {
  expect(sum(1, 2)).toBe(3);
});
