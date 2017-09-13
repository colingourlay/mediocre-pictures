const { h, render } = require('preact');
const { Provider } = require('rebass');

const theme = require('./styles/theme');
require('./styles/global');

const root = document.querySelector('main');

function init() {
  const App = require('./components/App');

  render(
    (
      <Provider theme={theme}>
        <App />
      </Provider>
    ),
    root,
    root.firstChild
  );
}

init();

if (module.hot) {
  module.hot.accept('./components/App', () => {
    try {
      init();
    } catch (err) {
      const ErrorBox = require('./components/ErrorBox');

      render(<ErrorBox error={err} />, root, root.firstChild);
    }
  });
}

if (process.env.NODE_ENV === 'development') {
  require('preact/devtools');
}
