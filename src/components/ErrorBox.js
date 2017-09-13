const { h, Component } = require('preact');
const styled = require('styled-components').default;

const Container = styled.pre`
  position: fixed;
  overflow: auto;
  left: 0;
  top: 0;
  z-index: 10000;
  box-sizing: border-box;
  margin: 0;
  padding: 2rem;
  width: 100vw;
  height: 100vh;
  background-color: #900;
  color: #fff;
  font-family: Menlo, Consolas, monospace;
  font-size: large;
`;

class ErrorBox extends Component {
  componentDidMount() {
    console.error(this.props.error);
  }

  render() {
    return (
      <Container>
        {this.props.error.stack}
      </Container>
    );
  }
}

module.exports = ErrorBox;
