import React from 'react';
import useInterval from './hooks/useInterval'

import generate from './logic/generate_board';

import Square from './Square'

const Game = ({ size }) => {
  if (size > 8 || size < 1) {
    throw new Error('Game size must be an integer, 0 to 8.')
  }
  const [ board, setBoard ] = React.useState(generate(size));
  const [ selected, setSelected ] = React.useState([]);
  const [ completed, setCompleted ] = React.useState([]);
  const [ showingResult, setShowingResult ] = React.useState(false);
  
  useInterval(() => {
    next();
  }, showingResult ? 500 : null);
  
  const restart = () => {
    setBoard(generate(size));
    setSelected([]);
    setCompleted([]);
  }

  const next = () => {
    setSelected([]);
    setShowingResult(false);
  }

  const select = (id) => {
    if(showingResult) // Currently in timeout to show result. Ignore action
      return;
    if(selected.length === 0){ // if there's no selected item, mark clicked as selected
      setSelected([id]);
    }
    else if(selected[0] !== id){
      // two elements selected, show both elements and check if they're equal
      setSelected([id, ...selected]);
      
      if(board[id] === board[selected[0]]){ // success, found a matching pair, add it to completed
        setCompleted([board[id], ...completed]);
        next();
      } else { // not a matching pair, set timeout to display result and make the player wait 500ms before next move
        setShowingResult(true);
      }
    }
  }
  
  const gameIsComplete = completed.length === size;
  const message = gameIsComplete
    ? <span>Congratulations! <button onClick={restart}>Restart?</button></span>
    : <span>Select squares and find matching elements!</span>

  return (
    <div>
      <h1>Memory</h1>
      <p>{message}</p>
      <div className="memory-grid">
        {board.map((element, index) => (
          <Square
            key={index}
            click={() => select(index)}
            selected={selected.includes(index)}
            completed={completed.includes(element)}
            element={element}
          />
        ))}
      </div>
    </div>
  );
}

export default Game;