import React, { Component } from "react";
import Sequencer from "./components/sequencer/Sequencer";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Sequencer />
      </div>
    );
  }
}

export default App;
