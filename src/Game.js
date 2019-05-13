import React from 'react';
import useInterval from './hooks/useInterval'

import generate from './logic/generate_board';

import Square from './Square'

import img0 from './svg/0.svg';
import img1 from './svg/1.svg';
import img2 from './svg/2.svg';
import img3 from './svg/3.svg';
import img4 from './svg/4.svg';
import img5 from './svg/5.svg';
import img6 from './svg/6.svg';
import img7 from './svg/7.svg';

const images = [ img0, img1, img2, img3, img4, img5, img6, img7];

const Game = ({ size }) => {
  const [ board, setBoard ] = React.useState(generate(size));
  const [ selected, selectSquare ] = React.useState([]);
  const [ completed, setCompleted ] = React.useState([]);
  const [ showingResult, setShowingResult ] = React.useState(false);
  
  useInterval(() => {
    next();
  }, showingResult ? 500 : null);
  
  const restart = () => {
    setBoard(generate(size));
    selectSquare([]);
    setCompleted([]);
  }

  const next = () => {
    selectSquare([]);
    setShowingResult(false);
  }

  const select = (id) => {
    if(showingResult) // Currently in timeout to show result. Ignore action
      return;
    if(selected.length === 0){
      selectSquare([id]);
    }
    else if(selected[0] !== id){
      // two elements selected, show both elements and check if they're equal
      if(board[id] === board[selected[0]]) {
        setCompleted([board[id], ...completed]);
        next();
      } else { // not a matching pair, set timeout to display result and make the player wait 500ms before next move
        selectSquare([id, ...selected]);
        setShowingResult(true);
      }
    }
  }

  return (
    <div>
      {completed.length === size ?
        <h1>Congratulations! <button onClick={restart}>Restart?</button></h1> :
        <h1>Memory - Select squares and find matching pairs!</h1>
      }
      <div className="memory-grid">
        {board.map((element, index) => (
          <Square
            key={index}
            click={() => select(index)}
            selected={selected.includes(index)}
            completed={completed.includes(element)}
          >
            <img src={images[element]} alt="" />
          </Square>
        ))}
      </div>
    </div>
  );
}

export default Game;