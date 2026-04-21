const { defineConfig } = require("@playwright/test")

module.exports = defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: "http://127.0.0.1:4173",
    viewport: { width: 390, height: 844 },
    colorScheme: "light"
  },
  webServer: {
    command: "python3 -m http.server 4173 --bind 127.0.0.1 --directory _site",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
})
