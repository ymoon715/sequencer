import React, { Component } from "react";
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
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

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
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    step: 0,
    steps: 7,
    bpm: 100,
    playing: false,
    sample: null
  };
  //load samples before allowing user to play around
  componentDidMount() {
    let th = this;
    this.setupSample.call(this).then(sample => {
      th.setState({ load: false, sample: sample });
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
    sampleSource.connect(audioContext.destination);
    sampleSource.start();
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
  onChange = e => {
    this.setState({ bpm: e.target.value, playing: false });
    clearInterval(this.interval);
  };

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

  render() {
    const { sample, step } = this.state;
    let playing;
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
          <div className="title">
          <h3>MOON'S SEQUENCER</h3>
          </div>
          <div className="controls">
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
                  type="number"
                  min="80"
                  max="300"
                  step="1"
                  value={this.state.bpm}
                  onChange={this.onChange}
                />
              </div>
            </div>
          </div>
          <div className="sequencer">
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
        </div>
      );
    }
    return <div>{content}</div>;
  }
}

export default Sequencer;
