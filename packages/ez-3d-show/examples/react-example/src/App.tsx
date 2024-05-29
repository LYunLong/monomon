import React from 'react';
import logo from './logo.svg';
import './App.css';


import Ez3dShow from './ez_3d_show';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Ez3dShow 
          mtlURL="https://cgdl.qihucdn.com/wargame/AX2.mtl"
          objURL="https://cgdl.qihucdn.com/wargame/AX.obj" 
          sceneWidth = "500"
          sceneHeight = "800"
        ></Ez3dShow>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
