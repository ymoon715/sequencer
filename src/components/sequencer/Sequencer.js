import React, { Component } from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import CHH from "../../samples/ClosedHiHat.mp3";
import OHH from "../../samples/OpenHiHat.mp3";
import Kick from "../../samples/Kick.mp3";
import Rim from "../../samples/Rim.mp3";
import Snare from "../../samples/Snare.mp3";
import Bass from "../../samples/Bass.mp3";
import Chord1 from "../../samples/Chord1.mp3";
import Chord2 from "../../samples/Chord2.mp3";
import Chord3 from "../../samples/Chord3.mp3";
import Chord4 from "../../samples/Chord4.mp3";
import SFX from "../../samples/SFX.mp3";
import "../../stylesheets/Sequencer.css";
// create audio context
window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
const gainNode = audioCtx.createGain();
const biquadFilter = audioCtx.createBiquadFilter();
const compressor = audioCtx.createDynamicsCompressor();
const delayNode = audioCtx.createDelay(5);
const visualizer = audioCtx.createAnalyser();

const styles = {
  select: {
    background: "#2a333c",
    color: "#FFFFFF",
    fontSize: 8,
    borderRadius: 5
  },
  selectTwo: {
    background: "#2a333c",
    color: "#FFFFFF",
    fontSize: 12,
    borderRadius: 5
  },
  menu: {
    background: "#2a333c",
    borderRadius: 5
  },
  item: {
    background: "#000000",
    color: "#FFFFFF",
    fontSize: 8
  },
  itemtwo: {
    background: "#000000",
    color: "#FFFFFF",
    fontSize: 12
  },
  focused: {
    background: "#0A0D0F",
    color: "#000000"
  }
};

class Sequencer extends Component {
  state = {
    load: true,
    sequencer: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    step: 0,
    steps: 15,
    playing: false,
    sample: null,
    bpm: 100,
    gain: 1,
    type: "highpass",
    detune: 0,
    frequency: 350,
    Q: 1,
    biGain: 0,
    threshold: -24,
    knee: 30,
    ratio: 12,
    attack: 0.003,
    release: 0.25,
    delay: 0
  };
  //load samples before allowing user to play around
  componentDidMount() {
    let th = this;
    this.setupSample.call(this).then(sample => {
      th.setState({ load: false, sample: sample });
      biquadFilter.type = "highpass";
    });
  }
  // toggle pads to activate pad
  togglePads = (group, pad) => {
    const clonedPads = this.state.sequencer;
    let newPad = this.state.sequencer[group];
    if (this.state.sequencer[group][pad] === 0) {
      newPad[pad] = 1;
      clonedPads[group] = newPad;
      this.setState({ sequencer: clonedPads });
    } else if (this.state.sequencer[group][pad] === 1) {
      newPad[pad] = 0;
      clonedPads[group] = newPad;
      this.setState({ sequencer: clonedPads });
    }
  };
  // fetch files and buffer them
  async getFile(audioContext, files) {
    const response = await fetch(files);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
  }

  async setupSample() {
    const filePath = [
      CHH,
      OHH,
      Kick,
      Rim,
      Snare,
      Bass,
      Chord1,
      Chord2,
      Chord3,
      Chord4,
      SFX
    ];
    const sample = [];
    for (let i = 0; i < filePath.length; i++) {
      sample.push(await this.getFile(audioCtx, filePath[i]));
    }
    return sample;
  }

  playSample = (audioContext, audioBuffer) => {
    const sampleSource = audioContext.createBufferSource();
    sampleSource.buffer = audioBuffer;
    sampleSource.connect(visualizer);
    visualizer.connect(biquadFilter);
    biquadFilter.connect(compressor);
    compressor.connect(delayNode);
    delayNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    sampleSource.start();
    this.visualize();
    return sampleSource;
  };

  playLine = () => {
    const { sample, sequencer } = this.state;
    if (sequencer[this.state.step][0] === 1) {
      this.playSample(audioCtx, sample[0]);
    }
    if (sequencer[this.state.step][1] === 1) {
      this.playSample(audioCtx, sample[1]);
    }
    if (sequencer[this.state.step][2] === 1) {
      this.playSample(audioCtx, sample[2]);
    }
    if (sequencer[this.state.step][3] === 1) {
      this.playSample(audioCtx, sample[3]);
    }
    if (sequencer[this.state.step][4] === 1) {
      this.playSample(audioCtx, sample[4]);
    }
    if (sequencer[this.state.step][5] === 1) {
      this.playSample(audioCtx, sample[5]);
    }
    if (sequencer[this.state.step][6] === 1) {
      this.playSample(audioCtx, sample[6]);
    }
    if (sequencer[this.state.step][7] === 1) {
      this.playSample(audioCtx, sample[7]);
    }
    if (sequencer[this.state.step][8] === 1) {
      this.playSample(audioCtx, sample[8]);
    }
    if (sequencer[this.state.step][9] === 1) {
      this.playSample(audioCtx, sample[9]);
    }
    if (sequencer[this.state.step][10] === 1) {
      this.playSample(audioCtx, sample[10]);
    }
  };

  visualize = () => {
    if (this.state.playing === true) {
      visualizer.fftSize = 512;
      const bufferLength = visualizer.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const canvas = document.querySelector(".visualizer");
      const canvasCtx = canvas.getContext("2d");
      let width = canvas.width;
      let height = canvas.height;

      canvasCtx.clearRect(0, 0, width, height);
      const drawVisual = requestAnimationFrame(this.visualize);
      visualizer.getByteFrequencyData(dataArray);
      if (dataArray.filter(a => a !== 0).length !== 0) {
        canvasCtx.fillStyle = "rgb(0,0,0)";
        canvasCtx.fillRect(0, 0, width, height);

        let x = 0;
        let barWidth = (width / bufferLength) * 2.5;
        let barHeight;
        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i];
          canvasCtx.fillStyle = "rgb(0,255,0)";
          //"rgb(" + (barHeight + 100) + ",50,50)";
          canvasCtx.fillRect(
            x,
            height - barHeight / 2,
            barWidth,
            barHeight / 2
          );
          x += barWidth + 1;
        }
      }
    }
  };

  changeBPM = e => {
    clearInterval(this.interval);
    this.setState({ bpm: e.target.value }, () => {
      if (this.state.playing === true) {
        this.interval = setInterval(() => {
          this.playLine();
          this.setState({
            step:
              this.state.step + 1 > this.state.steps ? 0 : this.state.step + 1
          });
        }, (60 * 1000) / this.state.bpm / 2);
      }
    });
  };
  gainChange = e => {
    this.setState({ gain: e.target.value }, () => {
      if (this.state.gain >= 0.93) {
        gainNode.gain.value = 1;
      } else if (this.state.gain <= 0.08) {
        gainNode.gain.value = 0;
      } else {
        gainNode.gain.value = this.state.gain;
      }
    });
  };

  // lookahead = (60 * 1000) / this.state.bpm / 2
  playSequencer = () => {
    if (!this.state.playing) {
      this.setState({ playing: true });
      this.interval = setInterval(() => {
        this.playLine();
        this.setState({
          step: this.state.step + 1 > this.state.steps ? 0 : this.state.step + 1
        });
      }, (60 * 1000) / this.state.bpm / 2);
    } else {
      this.setState({ playing: false, step: 0 });
      clearInterval(this.interval);
    }
  };

  filterType = e => {
    this.setState(
      { type: e.target.value },
      () => (biquadFilter.type = this.state.type)
    );
  };

  changeFilter = e => {
    let name = e.target.getAttribute("name");
    this.setState(
      { [e.target.name]: e.target.value },
      () => (biquadFilter[name].value = this.state[name])
    );
  };

  changeBiGain = e => {
    this.setState(
      { biGain: e.target.value },
      () => (biquadFilter.gain.value = this.state.biGain)
    );
  };

  changeCompressor = e => {
    let name = e.target.getAttribute("name");
    this.setState(
      { [e.target.name]: e.target.value },
      () => (compressor[name].value = this.state[name])
    );
  };

  changeDelay = e => {
    this.setState(
      { delay: e.target.value },
      () => (delayNode.delayTime.value = this.state.delay)
    );
  };
  render() {
    const { sample, step } = this.state;
    const { classes } = this.props;
    let playing;
    let gainValue = this.state.gain;
    if (this.state.playing) {
      playing = <i className="fas fa-stop" />;
    } else {
      playing = <i className="fas fa-play" />;
    }
    let content;
    if (sample === null) {
      content = "Loading";
    } else {
      content = (
        <div className="container">
          <div className="controls">
            <div className="main-controls">
              <div className="control-container">
                <span>Play/Stop:</span>
                <div className="play-stop" onClick={this.playSequencer}>
                  {playing}
                </div>
              </div>

              <div className="control-container">
                <span>BPM: </span>
                <div className="play-stop">
                  <input
                    orient="circular"
                    name="bpm"
                    type="range"
                    min="40"
                    max="300"
                    step="any"
                    value={this.state.bpm}
                    onChange={this.changeBPM}
                  />
                  <p>{Math.floor(this.state.bpm)}</p>
                </div>
              </div>
              <div className="control-container">
                <span>Delay: </span>
                <div className="play-stop">
                  <input
                    name="delay"
                    type="range"
                    min="0"
                    max="5"
                    step="any"
                    value={this.state.delay}
                    onChange={this.changeDelay}
                  />
                  <p>{Math.floor(this.state.delay)}</p>
                </div>
              </div>
              <div className="control-container">
                <span>Volume: </span>
                <div className="play-stop">
                  <input
                    name="gain"
                    type="range"
                    min="0"
                    max="1"
                    step="any"
                    value={this.state.gain}
                    onChange={this.gainChange}
                  />
                  <p>{Math.floor(this.state.gain * 100)}</p>
                </div>
              </div>
            </div>
          </div>
          <canvas className="visualizer" />
          <div className="sequencer">
            {this.state.sequencer.map((a, i) => (
              <div key={`pad-container${i}`} className="pad-container">
                {a.map((b, c) => (
                  <div
                    key={`pad-${c}`}
                    className={classNames("pad", {
                      active: i === step,
                      on: b === 1
                    })}
                    onClick={() => this.togglePads(i, c)}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="controls">
            <div className="control-container">
              <span>Compressor</span>
              <div className="filter">
                <div className="control-container">
                  <span>Threshold: </span>
                  <div className="play-stop">
                    <input
                      name="threshold"
                      type="range"
                      min="-100"
                      max="0"
                      step="any"
                      value={this.state.threshold}
                      onChange={this.changeCompressor}
                    />
                    <p>{Math.floor(this.state.threshold)}</p>
                  </div>
                </div>
                <div className="control-container">
                  <span>Knee: </span>
                  <div className="play-stop">
                    <input
                      name="knee"
                      type="range"
                      min="0"
                      max="40"
                      step="any"
                      value={this.state.knee}
                      onChange={this.changeCompressor}
                    />
                    <p>{Math.floor(this.state.knee)}</p>
                  </div>
                </div>
                <div className="control-container">
                  <span>Ratio: </span>
                  <div className="play-stop">
                    <input
                      name="ratio"
                      type="range"
                      min="1"
                      max="20"
                      step="any"
                      value={this.state.ratio}
                      onChange={this.changeCompressor}
                    />
                    <p>{Math.floor(this.state.ratio)}</p>
                  </div>
                </div>

                <div className="control-container">
                  <span>Attack: </span>
                  <div className="play-stop">
                    <input
                      name="attack"
                      type="range"
                      min="0"
                      max="1"
                      step="0.001"
                      value={this.state.attack}
                      onChange={this.changeCompressor}
                    />
                    <p>{this.state.attack}</p>
                  </div>
                </div>
                <div className="control-container">
                  <span>Release: </span>
                  <div className="play-stop">
                    <input
                      name="release"
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={this.state.release}
                      onChange={this.changeCompressor}
                    />
                    <p>{this.state.release}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="control-container">
              <span>Filter</span>
              <div className="filter">
                <div className="control-container">
                  <span>Type:</span>
                  <div className="play-stop">
                    <Select
                      value={this.state.type}
                      classes={{
                        root: classes.select,
                        selectMenu: classes.menu
                      }}
                      IconComponent={props => <p />}
                      onChange={this.filterType}
                    >
                      <MenuItem
                        value="lowpass"
                        classes={{
                          root: classes.item,
                          selected: classes.focused
                        }}
                      >
                        Low Pass
                      </MenuItem>
                      <MenuItem
                        value="highpass"
                        classes={{
                          root: classes.item,
                          selected: classes.focused
                        }}
                      >
                        High Pass
                      </MenuItem>
                      <MenuItem
                        value="bandpass"
                        classes={{
                          root: classes.item,
                          selected: classes.focused
                        }}
                      >
                        Band Pass
                      </MenuItem>
                      <MenuItem
                        value="lowshelf"
                        classes={{
                          root: classes.item,
                          selected: classes.focused
                        }}
                      >
                        Low Shelf
                      </MenuItem>
                      <MenuItem
                        value="highshelf"
                        classes={{
                          root: classes.item,
                          selected: classes.focused
                        }}
                      >
                        High Shelf
                      </MenuItem>
                      <MenuItem
                        value="peaking"
                        classes={{
                          root: classes.item,
                          selected: classes.focused
                        }}
                      >
                        Peaking
                      </MenuItem>
                      <MenuItem
                        value="notch"
                        classes={{
                          root: classes.item,
                          selected: classes.focused
                        }}
                      >
                        Notch
                      </MenuItem>
                      <MenuItem
                        value="allpass"
                        classes={{
                          root: classes.item,
                          selected: classes.focused
                        }}
                      >
                        All Pass
                      </MenuItem>
                    </Select>
                  </div>
                </div>
                <div className="control-container">
                  <span>Frequency: </span>
                  <div className="play-stop">
                    <input
                      name="frequency"
                      type="range"
                      min="0"
                      max="22050"
                      step="any"
                      value={this.state.frequency}
                      onChange={this.changeFilter}
                    />
                    <p>{Math.floor(this.state.frequency)}</p>
                  </div>
                </div>
                <div className="control-container">
                  <span>Detune: </span>
                  <div className="play-stop">
                    <input
                      name="detune"
                      type="range"
                      min="0"
                      max="100"
                      step="any"
                      value={this.state.detune}
                      onChange={this.changeFilter}
                    />
                    <p>{Math.floor(this.state.detune)}</p>
                  </div>
                </div>
                <div className="control-container">
                  <span>Q: </span>
                  <div className="play-stop">
                    <input
                      name="Q"
                      type="range"
                      min="0"
                      max="40"
                      step="any"
                      value={this.state.Q}
                      onChange={this.changeFilter}
                    />
                    <p>{Math.floor(this.state.Q)}</p>
                  </div>
                </div>
                <div className="control-container">
                  <span>Gain: </span>
                  <div className="play-stop">
                    <input
                      name="biGain"
                      type="range"
                      min="-40"
                      max="40"
                      step="any"
                      value={this.state.biGain}
                      onChange={this.changeBiGain}
                    />
                    <p>{Math.floor(this.state.biGain)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="application">
        <div className="title">
          <h3>MOON SEQUENCER</h3>
        </div>
        <div className="content">
          <div className="note-name-container">
            <div className="note-name">
              <h3>Closed Hi-Hat</h3>
            </div>
            <div className="note-name">
              <h3>Open Hi-Hat</h3>
            </div>
            <div className="note-name">
              <h3>Kick</h3>
            </div>
            <div className="note-name">
              <h3>Rim</h3>
            </div>
            <div className="note-name">
              <h3>Snare</h3>
            </div>
            <div className="note-name">
              <h3>Bass</h3>
            </div>
            <div className="note-name">
              <h3>Chord 1</h3>
            </div>
            <div className="note-name">
              <h3>Chord 2</h3>
            </div>
            <div className="note-name">
              <h3>Chord 3</h3>
            </div>
            <div className="note-name">
              <h3>Chord 4</h3>
            </div>
            <div className="note-name">
              <h3>SFX</h3>
            </div>
          </div>
          {content}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Sequencer);
