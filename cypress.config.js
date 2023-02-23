const { defineConfig } = require("cypress");

module.exports = defineConfig({
  chromeWebSecurity: false,
  video: false,
  screenshotOnRunFailure: false,

  component: {
    specPattern: "cypress/__tests__/ComponentTesting/*.cy.{js,jsx,ts,tsx}",
    setupNodeEvents(on, config) {
      console.log("setupNodeEvents for components");

      // https://github.com/bahmutov/cypress-code-coverage
      // eslint-disable-next-line global-require
      require("@bahmutov/cypress-code-coverage/plugin")(on, config);
      // eslint-disable-next-line global-require
      require("@cypress/code-coverage/task")(on, config);
      // eslint-disable-next-line global-require
      on("file:preprocessor", require("@cypress/code-coverage/use-babelrc"));

      return {
        close: () => {},
        config,
      };
    },

    env: {
      codeCoverageTasksRegistered: true,
    },

    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
      webpackConfig: {
        mode: "development",
        devtool: false,
        module: {
          rules: [
            // application and Cypress files are bundled like React components
            // and instrumented using the babel-plugin-istanbul
            // (we will filter the code coverage for non-application files later)
            {
              test: /\.js/,
              exclude: /node_modules/,
              use: {
                loader: "babel-loader",
                options: {
                  presets: ["@babel/preset-env", "@babel/preset-react"],
                  plugins: [
                    // we could optionally insert this plugin
                    // only if the code coverage flag is on
                    "istanbul",
                  ],
                },
              },
            },
            {
              test: /\.css$/,
              use: [
                { loader: "style-loader" },
                {
                  loader: "css-loader",
                  options: {
                    modules: true,
                  },
                },
                { loader: "sass-loader" },
              ],
            },
          ],
        },
      },
    },
    specs: ["./components"],
  },

  // e2e: {
  //   // setupNodeEvents(on, config) {},
  // },

  e2e: {
    env: {
      codeCoverageTasksRegistered: true,
    },

    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
      webpackConfig: {
        mode: "development",
        devtool: false,
        module: {
          rules: [
            // application and Cypress files are bundled like React components
            // and instrumented using the babel-plugin-istanbul
            // (we will filter the code coverage for non-application files later)
            {
              test: /\.js/,
              exclude: /node_modules/,
              use: {
                loader: "babel-loader",
                options: {
                  presets: ["@babel/preset-env", "@babel/preset-react"],
                  plugins: [
                    // we could optionally insert this plugin
                    // only if the code coverage flag is on
                    "istanbul",
                  ],
                },
              },
            },
            {
              test: /\.css$/,
              use: [
                { loader: "style-loader" },
                {
                  loader: "css-loader",
                  options: {
                    modules: true,
                  },
                },
                { loader: "sass-loader" },
              ],
            },
          ],
        },
      },
    },

    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
