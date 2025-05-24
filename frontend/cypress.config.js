import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // ajuste conforme porta do seu app React
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

