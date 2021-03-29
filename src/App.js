import './App.css';
import React from 'react';
import Display from './components/Display';


function App() {

  const [displayState, setDisplayState] = React.useState("Off");
  const [fileLoad, setFileLoad] = React.useState(false);

  return (
    <div>
      <h1 className="PageTitle">Stick Playground</h1>
      <div className="DisplayContainer">
        <Display file={fileLoad} />
      </div>
      <div className="ButtonContainer">
        <button onClick={() => setDisplayState("Play")}>Play</button>
        <button onClick={() => setDisplayState("Pause")}>Pause</button>
        {
        //<button onClick={() => setDisplayState("Off")}>Cancel</button>
        }
        <button onClick={() => {
          console.log("click");
          setFileLoad(!fileLoad)}
        }>Cancel</button>
      </div>

    </div>
  );
}

export default App;

//NOTE: I think the page is refreshing on each onClick even if the state is already set to that value. Create a Check to see if the state needs to be updated
