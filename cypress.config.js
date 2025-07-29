const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:9300',
    specPattern: 'tests/e2e/**/*.spec.js',
    supportFile: 'tests/support/index.js',
    video: false,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
}) 