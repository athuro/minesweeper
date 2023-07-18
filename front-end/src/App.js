import {Route, Routes, Link} from 'react-router-dom'
import './App.css';
import Tiles from './Tiles';

function App() {
  return (
    <>
      <header className='headerBar'>
          <h1>Minesweeper</h1>
      </header>

      <Routes>
        <Route path='/' element={<Tiles/>} />
      </Routes>
    </>
    
  );
}

export default App;
