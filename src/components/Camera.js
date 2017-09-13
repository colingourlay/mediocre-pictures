const resemble = require('../vendor/resemble');
const { h, Component } = require('preact');
const { Box, Button } = require('rebass');
const styled = require('styled-components').default;
const Webcam = require('react-webcam');

const POSE_DELAY = 1500;
const MEASURE_INTERVAL = 500;
const STABILITY_PERCENTAGE = 7.5;

const Container = styled(Box)`
  img,
  video {
    width: 100%;
    height: auto;
  }

  video {
    border: .5rem solid ${props =>
      props.isPosing ? props.isStable === null ?
        'orange' : props.isStable ? 'green' : 'red' : 'black'};
    background-color: black;
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
      <Container isPosing={isPosing} isStable={isStable} m={1}>
        <Webcam
          ref={x => this.webcam = x}
          audio={false}
          screenshotFormat="image/png" />
        <Button w={1} mt={2} onClick={this.pose} disabled={isPosing}>Pose for picture</Button>
        {isStable === null && !isPosing && this.previousImage ? (
          <Box mt={2}>
            <img src={this.previousImage} />
            <Button is="a" w={1} mt={2} href={this.previousImage} download="image.png">Download</Button>
          </Box>
        ) : null}
      </Container>
    );
  }
}

module.exports = Camera;
