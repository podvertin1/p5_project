class Cell {
  constructor(rowIndex, columnIndex, cellWidth) {
    this.i = rowIndex;
    this.j = columnIndex;
    this.w = cellWidth;
    
    this.isShowTopWall = true;
    this.isShowRightWall = true;
    this.isShowBottomWall = true;
    this.isShowLeftWall = true;
    
    this.isVisited = false;
  }
  
  show() {
    let x = this.j * this.w;
    let y = this.i * this.w;
    
    if(this.isVisited) {
      noStroke();
      fill('#E91E63');
      rect(x, y, this.w, this.w);
    }
    
    this.showWall(x,y);
  }
  
  showWall(x, y) {
    stroke('#090808')
    
    if(this.isShowTopWall) {
      line(x, y, x+this.w, y);
    }
    
    if(this.isShowRightWall) {
      line(x+this.w, y, x+this.w, y+this.w);
    }
    
    if(this.isShowBottomWall) {
      line(x, y+this.w, x+this.w, y+this.w);
    }
    
    if(this.isShowLeftWall) {
      line(x, y, x, y+this.w);
    }
  }
}

class Grid {
  constructor(rows, cols, cellWidth) {
    this.cells = [];
    this.rows = rows;
    this.cols = cols;
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let cell = new Cell(i, j, cellWidth);
        this.cells.push(cell);
      }
    }
    
    this.cells[0].isVisited = true;
    this.current = this.cells[0];
    this.stack = []; // Добавляем стек для алгоритма DFS
  }
  
  show() {
    for (let cell of this.cells) {
      cell.show();
    }
    
    // Подсветка текущей ячейки
    noStroke();
    fill(255, 0, 0, 100);
    rect(this.current.j * this.current.w, this.current.i * this.current.w, this.current.w, this.current.w);
  }
  
  mazeStep() {
    let next = this.findRandomNotVisitedNeighbour(this.current);
    
    if (next) {
      this.removeWalls(this.current, next);
      next.isVisited = true;
      this.stack.push(this.current);
      this.current = next;
    } else if (this.stack.length > 0) {
      this.current = this.stack.pop();
    }
  }
  
  index(i, j) {
    if(i < 0 || j < 0 || i > this.rows-1 || j > this.cols-1) {
      return -1;
    }
    
    return (i*this.cols) + j;
  }
  
  findRandomNotVisitedNeighbour(cell) {
    let neighbours = [];
    
    let top = this.index(cell.i-1, cell.j);
    let right = this.index(cell.i, cell.j+1);
    let bottom = this.index(cell.i+1, cell.j);
    let left = this.index(cell.i, cell.j-1);
    
    if(top != -1 && !this.cells[top].isVisited) {
      neighbours.push(this.cells[top]);
    }
    
    if(right != -1 && !this.cells[right].isVisited) {
      neighbours.push(this.cells[right]);
    }
    
    if(bottom != -1 && !this.cells[bottom].isVisited) {
      neighbours.push(this.cells[bottom]);
    }
    
    if(left != -1 && !this.cells[left].isVisited) {
      neighbours.push(this.cells[left]);
    }
    
    if(neighbours.length > 0) {
      return random(neighbours);
    } else {
      return undefined;
    }
  }
  
  removeWalls(current, next) {
    let dx = current.j - next.j;
    let dy = current.i - next.i;
    
    // Сосед сверху
    if(dy == 1) {
      current.isShowTopWall = false;
      next.isShowBottomWall = false;
    }
    // Сосед снизу
    else if(dy == -1) {
      current.isShowBottomWall = false;
      next.isShowTopWall = false;
    }
    // Сосед слева
    if(dx == 1) {
      current.isShowLeftWall = false;
      next.isShowRightWall = false;
    }
    // Сосед справа
    else if(dx == -1) {
      current.isShowRightWall = false;
      next.isShowLeftWall = false;
    }
  }
}

let grid;
let isGenerating = true;

function setup() {
  createCanvas(400, 400);
  
  let w = 40;
  grid = new Grid(floor(height/w), floor(width/w), w);
  
  frameRate(15);
}

function draw() {
  background('#607D8B');
  
  grid.show();
  
  if(isGenerating) {
    grid.mazeStep();
  }
}

