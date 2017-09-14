const { h } = require('preact');
const { Flex, Link, Small } = require('rebass');
const styled = require('styled-components').default;

const Camera = require('./Camera');

const Container = styled(Flex)`
  max-width: 24rem;
  height: 100%;
`;

module.exports = () => (
  <Container direction="column" justify="space-between" align="center" mx="auto">
    <Camera />
    <Small my={3} center>
      Mediocre pictures. By <Link href="https://twitter.com/collypops">@collypops</Link>
    </Small>
  </Container>
);

module.exports.displayName = 'App';
