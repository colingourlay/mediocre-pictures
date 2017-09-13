const resemble = require('../vendor/resemble');
const { h, Component } = require('preact');
const { Box, Button } = require('rebass');
const styled = require('styled-components').default;
const Webcam = require('react-webcam');

const POSE_DELAY = 1000;
const MEASURE_INTERVAL = 500;
const STABILITY_PERCENTAGE = 7.5;

const Container = styled(Box)`
  max-width: 20rem;

  img,
  video {
    width: 100%;
    height: auto;
  }

  img {
    border: .5rem solid black;
  }

  video {
    border: .5rem solid ${props => props.theme.colors[
      props.isPosing ? props.isStable === null ?
        'blue' : props.isStable ? 'green' : 'red' : 'black']};
    background-color: black;
    transition: border-color .25s;
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

  take(image) {
    this.setState({
      isPosing: false,
      isStable: null
    });
  }

  render({}, {isPosing, isStable}) {
    return (
      <Container align="center" isPosing={isPosing} isStable={isStable} m={1}>
        <Webcam
          ref={x => this.webcam = x}
          audio={false}
          width={1280}
          height={960}
          style={{display: isPosing || !this.previousImage ? '' : 'none'}}
          screenshotFormat="image/png" />
        {isStable === null && !isPosing && this.previousImage ? (
          <Box>
            <img src={this.previousImage} />
            <Button is="a" w={1} mt={2} bg="green" href={this.previousImage} download="mediocre-picture.png">
              Keep this picture
            </Button>
          </Box>
        ) : null}
        <Button w={1} mt={2} onClick={this.pose} disabled={isPosing}>
          {isPosing ? 'Try to keep steady…' : `Pose for a${!isPosing && this.previousImage ? 'nother': ''} picture`}
        </Button>
      </Container>
    );
  }
}

module.exports = Camera;
