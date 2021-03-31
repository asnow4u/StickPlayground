import './App.css';
import React from 'react';
import Display from './components/Display';


function App() {

  const [playState, setPlayState] = React.useState("Play");
  const [fileLoad, setFileLoad] = React.useState(false);

  return (
    <div>
      <h1 className="PageTitle">Stick Playground</h1>
      <div className="DisplayContainer">
        <Display state={playState} />
      </div>
      <div className="ButtonContainer">
        <button onClick={() => setPlayState("Play")}>Play</button>
        <button onClick={() => setPlayState("Pause")}>Pause</button>
        <button onClick={() => setPlayState("Stop")}>Cancel</button>
      </div>

    </div>
  );
}

export default App;

//NOTE: I think the page is refreshing on each onClick even if the state is already set to that value. Create a Check to see if the state needs to be updated
