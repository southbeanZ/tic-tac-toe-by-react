import React, { Component } from 'react';
import './App.css';

// stateless functional components
function Square(props) {
  return (
    <button className="square" onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

// class Square extends React.Component {
//   // constructor() {
//   //   super();
//   //   this.state = {
//   //     value: null
//   //   };
//   // }

//   render() {
//     return (
//       <button className="square" onClick={() => this.props.onClick()}>
//         {this.props.value}
//       </button>
//     );
//   }
// }

class Board extends React.Component {
  // constructor() {
  //   super();
  //   this.state = {
  //     squaresVal: Array(9).fill(null),
  //     isXNext: true
  //   };
  // }

  // handleClick(i) {
  //   const squares = this.state.squaresVal.slice();
  //   if(calculateWinner(squares) || squares[i]) {
  //     return;
  //   }
  //   squares[i] = this.state.isXNext ? 'X' : 'O';
  //   this.setState({
  //     squaresVal: squares,
  //     isXNext: !this.state.isXNext
  //   });
  // }

  renderSquare(i) {
    return <Square key={i} value={this.props.squares[i]} onClick={() => this.props.onClick(i)}/>;
  }
  render() {
    const boardRows = [];
    for(let i = 0; i < 3; i++) {
      let boardRow = [];
      for(let j = 0; j < 3; j++) {
        boardRow[j] = this.renderSquare(i * 3 + j); 
      }
      boardRows[i] = (<div className="board-row" key={i}>{boardRow}</div>);
    }
    return (
      <div>
        {boardRows}       
      </div>
    );
  }
}

// <div className="board-row">
//   {this.renderSquare(0)}
//   {this.renderSquare(1)}
//   {this.renderSquare(2)}
// </div>
// <div className="board-row">
//   {this.renderSquare(3)}
//   {this.renderSquare(4)}
//   {this.renderSquare(5)}
// </div>
// <div className="board-row">
//   {this.renderSquare(6)}
//   {this.renderSquare(7)}
//   {this.renderSquare(8)}
// </div>

class App extends Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        curSquare: '(0, 0)'  //记录当前步
      }],
      xIsNext: true,
      stepNum: 0,
      isDescend: false
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNum+1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if(calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        curSquare: '(' + (i % 3 + 1) + ', ' + Math.floor(i / 3 + 1) + ')'
      }]),
      xIsNext: !this.state.xIsNext,
      stepNum: history.length
    });
  }

  jumpTo(move) {
    this.setState({
      stepNum: move,
      xIsNext: (move % 2) ? false : true
    });
  }

  // 切换move显示次序
  toggleOrder() {
    this.setState({
      isDescend: !this.state.isDescend
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNum];
    const winner = calculateWinner(current.squares);

    let status;
    if(winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    const moves = history.map((step, move) => {
      const desc = move ? 'Move #' + step.curSquare : 'Game start';
      var itemClassName = '';
      if(current.curSquare === step.curSquare) {
        itemClassName += 'is-select';
      }

      return (
        <li key={move} className={itemClassName} value={move+1}>
          <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
      );
    });

    if(this.state.isDescend) {
      moves.reverse();
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={(i) => this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.toggleOrder()}>Order Toggle</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

export default App;

// ========================================

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}