import { Route, Routes } from 'react-router-dom';
import './App.css';
import Tiles from './Tiles';
import Timer from './Timer';
import Select from 'react-select';
import { useState, useEffect } from 'react';

function App() {
  const options = [
    { size: '10', label: 'Easy' },
    { size: '15', label: 'Medium' },
    { size: '25', label: 'Hard' }
  ];

  const [selected, setSelected] = useState(
    JSON.parse(localStorage.getItem('selectedOption')) || { size: '10', label: 'Easy' }
  );

  const handleChange = (selectedOption) => {
    setSelected(selectedOption)
    window.location.reload()
  };

  useEffect(() => {
    localStorage.setItem('selectedOption', JSON.stringify(selected));
  }, [selected]);

  return (
    <>
      <header className="headerBar">
        <h1 id="title">MINESWEEPER</h1>
      </header>

      <p className="option">
        <Select options={options} value={selected} onChange={handleChange} />
      </p>

      <section className="gameControl">
        <button id="start" onClick={() => window.location.reload()}>
          Start Game
        </button>
        <Timer start={Date.now()} />
      </section>

      <Routes>
        <Route path="/" element={<Tiles difficulty={selected} />} />
      </Routes>
    </>
  );
}

export default App;