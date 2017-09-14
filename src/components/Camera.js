const resemble = require('../vendor/resemble');
const { h, Component } = require('preact');
const { Box, Button } = require('rebass');
const styled = require('styled-components').default;
const Webcam = require('react-webcam');

const POSE_DELAY = 1000;
const MEASURE_INTERVAL = 500;
const STABILITY_PERCENTAGE = 7.5;

const Frame = styled.div`
  padding: ${props => props.theme.space[2]}px;
  background-color: ${props => props.theme.colors[
    props.isPosing ? props.isStable === null ?
      'yellow' : props.isStable ? 'green' : 'red' : 'black']};
  transition: background-color .25s;

  img,
  video {
    width: 100%;
    height: auto;
  }
`;

class Camera extends Component {
  constructor(props) {
    super(props);

    this.capture = this.capture.bind(this);
    this.compare = this.compare.bind(this);
    this.pose = this.pose.bind(this);
    this.take = this.take.bind(this);

    this.state = {
      isPosing: false,
      isStable: null
    };
  }

  capture() {
    return this.webcam.getScreenshot();
  }

  compare() {
    const image = this.capture();

    if (this.previousImage) {
      resemble(image)
      .compareTo(this.previousImage)
      .ignoreColors()
      .onComplete(data => {
        const isStable =
          data.rawMisMatchPercentage < STABILITY_PERCENTAGE;

        if (isStable !== this.state.isStable) {
          this.setState({
            isStable
          });
        }

        if (isStable) {
          return setTimeout(this.take, MEASURE_INTERVAL);
        }

        setTimeout(this.compare, MEASURE_INTERVAL);
      });
    } else {
      setTimeout(this.compare, MEASURE_INTERVAL);
    }

    this.previousImage = image;
  }

  pose() {
    this.previousImage = null;
    
    this.setState({
      isPosing: true,
      isStable: null
    });

    setTimeout(this.compare, POSE_DELAY);
  }

  take() {
    this.setState({
      isPosing: false,
      isStable: null
    });
  }

  render({}, {isPosing, isStable}) {
    return (
      <Box align="center" mx={2} my={[4, 5, 6]}>
        <Frame
          isPosing={isPosing}
          isStable={isStable}
          style={{
            display: isPosing || !this.previousImage ? '' : 'none'
          }}
        >
          <Webcam
            ref={x => this.webcam = x}
            audio={false}
            width={1280}
            height={720}
            screenshotFormat="image/png" />
          </Frame>
        {isStable === null && !isPosing && this.previousImage ? (
          <Box>
            <Frame isPosing={isPosing} isStable={isStable}>
              <img src={this.previousImage} />
            </Frame>
            <Button is="a" w={1} mt={2} bg="green" href={this.previousImage} download="mediocre-picture.png">
              Keep this picture
            </Button>
          </Box>
        ) : null}
        <Button w={1} mt={2} onClick={this.pose} disabled={isPosing}>
          {isPosing ? 'Strike a pose!' : `Take a${!isPosing && this.previousImage ? 'nother': ''} picture`}
        </Button>
      </Box>
    );
  }
}

module.exports = Camera;
