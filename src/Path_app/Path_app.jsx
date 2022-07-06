import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrderDijkstra} from '../algorithms/dijkstra';
import {astar, getNodesInShortestPathOrderAstar} from '../algorithms/astar';

import './Path_app.css';

let START_NODE_ROW = 10;
let START_NODE_COL = 15;
let FINISH_NODE_ROW = 10;
let FINISH_NODE_COL = 35;

let START_LAST_ROW = 10;
let START_LAST_COL = 15;
let FINISH_LAST_ROW = 10;
let FINISH_LAST_COL = 35;

let CHANGE_START = false;
let CHANGE_FINISH = false;

let weightValue = 1;
let nodeWasPressed = false;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      weightIsPressed: 1,
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  }

  handleMouseDown(row, col) {
    if (row === START_NODE_ROW && col === START_NODE_COL) {
      CHANGE_START = true;
      this.setState({mouseIsPressed: true});
      return;
    }

    if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) {
      CHANGE_FINISH = true;
      this.setState({mouseIsPressed: true});
      return;
    }
    if (weightValue > 1) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid, mouseIsPressed: true});
  }

  handleMouseEnter(row, col) {
    if(this.state.mouseIsPressed && CHANGE_START) {
      START_NODE_ROW = row;
      START_NODE_COL = col;
      
      const grid = changeStartPosition(this.state.grid, row, col);
      this.setState({grid});

      START_LAST_ROW = row;
      START_LAST_COL = col;
      return;
    }

    if(this.state.mouseIsPressed && CHANGE_FINISH) {
      FINISH_NODE_ROW = row;
      FINISH_NODE_COL = col;
      
      const grid = changeFinishPosition(this.state.grid, row, col);
      this.setState({grid});

      FINISH_LAST_ROW = row;
      FINISH_LAST_COL = col;
      return;
    }

    if (!this.state.mouseIsPressed || (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) || (row === START_NODE_ROW && col === START_NODE_COL)) return;
    if (weightValue > 1) return;
    
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }

  handleMouseUp(row, col) {
    console.log('a');
    nodeWasPressed = true;
    CHANGE_START = false;
    CHANGE_FINISH = false;
    this.setState({mouseIsPressed: false});

    if((row === FINISH_NODE_ROW && col === FINISH_NODE_COL) || (row === START_NODE_ROW && col === START_NODE_COL)) return;
    
    if(weightValue > 1)
    {
      const newGrid = updateWeight(this.state.grid, row, col);
      this.setState({grid: newGrid});
    }

    console.log(row, col);
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      // eslint-disable-next-line
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if(node.row === START_NODE_ROW && node.col === START_NODE_COL)
        {
          document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-start node-visited';  
        }
        else if(node.row === FINISH_NODE_ROW && node.col === FINISH_NODE_COL)
        {
          document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-finish node-visited';  
        }
        else if(node.weight > 1)
        {
          document.getElementById(`node-${node.row}-${node.col}`).className =
          `node node-weight-${node.weight} node-visited`;
        }
        else
        {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            'node node-visited';
        }
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      // eslint-disable-next-line
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        
        if(node.row === START_NODE_ROW && node.col === START_NODE_COL)
        {
          document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-start node-shortest-path';  
        }
        else if(node.row === FINISH_NODE_ROW && node.col === FINISH_NODE_COL)
        {
          document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-finish node-shortest-path';  
        }
        else if(node.weight > 1)
        {
          document.getElementById(`node-${node.row}-${node.col}`).className =
          `node node-weight-${node.weight} node-shortest-path`;
        }
        else
        {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            'node node-shortest-path';
        }
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    this.clearGraph();
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrderDijkstra(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeAstar() {
    this.clearGraph();
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = astar(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrderAstar(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  addWeight(weight) {
    if(weightValue !== weight) weightValue = weight;
    else if(weightValue === weight) weightValue = 1;

    this.setState({weightIsPressed: weightValue});
    // console.log(extraClassName);
  }

  clearGraph() {
    const {grid} = this.state;
    for (let row = 0; row < 20; row++)
    {
      for (let col = 0; col < 50; col++)
      {
        const node = grid[row][col];
        node.distance = Infinity;
        node.isVisited = false;
        node.previousNode = null;
        if(node.row === START_NODE_ROW && node.col === START_NODE_COL)
        {
          document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-start';  
        }
        else if(node.row === FINISH_NODE_ROW && node.col === FINISH_NODE_COL)
        {
          document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-finish';  
        }
        else if(node.weight > 1)
        {
          document.getElementById(`node-${node.row}-${node.col}`).className =
          `node node-weight-${node.weight}`;
        }
        else if(node.isWall)
        {
          document.getElementById(`node-${node.row}-${node.col}`).className =
          `node node-wall`;  
        }
        else
        {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            'node';
        }
      }
    }
  }

  addtext(val) {
    console.log(document.getElementById("myRange").value);
    document.getElementById("demo").innerHTML = val;  
  }

  pressOutside() {
    console.log('b');
    if(nodeWasPressed === false) 
    {
      this.setState({weightIsPressed: 1});
      weightValue = 1;
    }
    nodeWasPressed = false;
  }

  render() {
    const {grid, mouseIsPressed, weightIsPressed} = this.state;
    const extraClassName = weightIsPressed > 1
      ? `cursor-${weightIsPressed}`
      : '';

    return (
      <div className={`${extraClassName}`}  onKeyUp={() => this.pressOutside()} onMouseUp={() => this.pressOutside()}>
        <nav>
          <div className='bg-image'></div>
          <button className="start-button" onClick={() => this.visualizeDijkstra()}>
            Visualize Dijkstra's Algorithm
          </button>
          <button className="start-button" onClick={() => this.visualizeAstar()}>
            Visualize A* Algorithm
          </button>
          <button className="start-button" onClick={() => this.clearGraph()}>
            Clear
          </button>
          <button className="start-button" onClick={() => window.location.reload()}>
            Restart
          </button>
        </nav>
        
        <div className='weight-bar'>
          <button className="w9 weight-box" onClick={() => this.addWeight(9)}></button>
          <button className="w8 weight-box" onClick={() => this.addWeight(8)}></button>
          <button className="w7 weight-box" onClick={() => this.addWeight(7)}></button>
          <button className="w6 weight-box" onClick={() => this.addWeight(6)}></button>
          <button className="w5 weight-box" onClick={() => this.addWeight(5)}></button>
          <button className="w4 weight-box" onClick={() => this.addWeight(4)}></button>
          <button className="w3 weight-box" onClick={() => this.addWeight(3)}></button>
          <button className="w2 weight-box" onClick={() => this.addWeight(2)}></button>
          <span className="weight-text">Add Weights from here &rarr;</span>
        </div>

        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, weight, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                      onMouseUp={(row, col) => this.handleMouseUp(row, col)}
                      row={row}
                      weight={weight}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) 
  {
    const currentRow = [];
    for (let col = 0; col < 50; col++) 
    {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
    weight: 1,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    weight: 1,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const changeStartPosition = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const other_node = newGrid[START_LAST_ROW][START_LAST_COL];
  const newNode = {
    ...node,
    isWall: false,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
  };
  const lastNode = {
    ...other_node,
    isStart: false,
  }
  newGrid[START_LAST_ROW][START_LAST_COL] = lastNode;
  newGrid[row][col] = newNode;
  return newGrid;
};

const changeFinishPosition = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const other_node = newGrid[FINISH_LAST_ROW][FINISH_LAST_COL];
  const newNode = {
    ...node,
    isWall: false,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
  };
  const lastNode = {
    ...other_node,
    isFinish: false,
  }
  newGrid[FINISH_LAST_ROW][FINISH_LAST_COL] = lastNode;
  newGrid[row][col] = newNode;
  return newGrid;
};

const updateWeight = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  let toUpdateWeight = weightValue;
  if (node.weight === weightValue) toUpdateWeight = 1;
  const newNode = {
    ...node,
    isWall: false,
    weight: toUpdateWeight,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};