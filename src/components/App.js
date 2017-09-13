const { h } = require('preact');
const { Flex, Heading } = require('rebass');

const Camera = require('./Camera');

module.exports = () => (
    <Flex direction="column" align="center" m={1}>
      <Heading center>Mediocre Pictures</Heading>
      <Camera />
    </Flex>
);

module.exports.displayName = 'App';
