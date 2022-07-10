export function prim(grid, startNode, finishNode) {
    let walls = [];
    grid = makeAllWalls(grid, startNode);
    walls = addNeighbours(walls, startNode, grid);

    while(!!walls.length) {
        const cell = pickRandom(walls);
        console.log(cell.row, cell.col);
        // break;
        if(NotWallNeighbours(cell, grid) === 1)
        {
            // const {col, row} = cell;
            // grid[row][col].isWall = false;
            cell.isWall = false;
            walls = addNeighbours(walls, cell, grid);
        }
    }
    finishNode.isWall = false;
    return grid;
}

function pickRandom(walls) {
    const random = Math.floor(walls.length * Math.random());
    // console.log(random);
    const cell = walls[random];
    walls.splice(random, 1);
    return cell;
}

function NotWallNeighbours(cell, grid) {
    let count = 0;
    const {col, row} = cell;
    if (row > 0 && grid[row - 1][col].isWall === false) count++;
    if (row < grid.length - 1 && grid[row + 1][col].isWall === false) count++;
    if (col > 0 && grid[row][col - 1].isWall === false) count++;
    if (col < grid[0].length - 1 && grid[row][col + 1].isWall === false) count++;

    console.log(count);
    return count;
}

function makeAllWalls(grid, startNode) {
    for(const row of grid)
        for(const node of row)
            if(node !== startNode)
                node.isWall = true;

    // if(grid[5][10].isWall)
    //     console.log("a");

    return grid;
}

function addNeighbours(walls, node, grid) {
    const {col, row} = node;
    if (row > 0 && grid[row - 1][col].isWall) walls.push(grid[row - 1][col]);
    if (row < grid.length - 1 && grid[row + 1][col].isWall) walls.push(grid[row + 1][col]);
    if (col > 0 && grid[row][col - 1].isWall) walls.push(grid[row][col - 1]);
    if (col < grid[0].length - 1 && grid[row][col + 1].isWall) walls.push(grid[row][col + 1]);

    return walls;
}