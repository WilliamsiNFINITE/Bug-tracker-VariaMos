import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    pageLoadTimeout : 10000,
    viewportHeight: 1060,
    projectId: "87jdpk",
  },
});
