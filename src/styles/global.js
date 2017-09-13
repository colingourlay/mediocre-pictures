const cssWipe = require('css-wipe/js');
const { injectGlobal } = require('styled-components');
const theme = require('./theme');

injectGlobal`
  ${cssWipe}

  html {
    font-family: ${theme.fontSans};
    font-size: ${theme.sizeRem};
  }
`;
