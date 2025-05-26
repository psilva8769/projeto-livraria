import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:5173',
    viewportWidth: 1280,
    viewportHeight: 720,    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',

  video: false,
  screenshotOnRunFailure: true,
  retries: {
    runMode: 2,
    openMode: 0,
  },
      env: {
      apiUrl: 'http://localhost:4000/api',
      adminEmail: 'admin@admin.com',
      adminPassword: 'admin123',
      frontendUrl: 'http://localhost:5173',
      adminUrl: 'http://localhost:5174'
    }
  },
})