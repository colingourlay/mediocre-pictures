const { h } = require('preact');
const { Flex, Link, Small } = require('rebass');

const Camera = require('./Camera');

module.exports = () => (
  <Flex direction="column" justify="space-between" align="center" style={{height: '100%'}}>
    <Camera />
    <Small mb={3} center>
      Mediocre pictures. By <Link href="https://twitter.com/collypops">@collypops</Link>
    </Small>
  </Flex>
);

module.exports.displayName = 'App';
