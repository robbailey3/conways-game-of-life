import { Settings } from 'http2';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Canvas } from '../canvas/canvas';
import { Cell } from '../cell/cell';

export class Game {
  public config = {
    cellSize: 25,
  };

  public timeout: number;

  private cells: Cell[][] = [];

  private canvas: Canvas;
  constructor(hostEl: HTMLCanvasElement) {
    this.canvas = new Canvas(hostEl, this.config.cellSize);
    this.addClickListener();
  }

  public init() {
    this.createCells();
    this.animate();
  }

  public pause() {
    window.clearTimeout(this.timeout);
  }

  public play() {
    this.animate();
  }

  private createCells() {
    for (let i = 0; i < window.innerWidth; i += this.config.cellSize) {
      const row = [];
      for (let j = 0; j < window.innerHeight; j += this.config.cellSize) {
        row.push(new Cell({ x: i, y: j }, false));
      }
      this.cells.push(row);
    }
  }

  private calculateNext() {
    for (let l = 1; l < this.cells.length - 1; l += 1) {
      for (let m = 1; m < this.cells[0].length - 1; m += 1) {
        let aliveNeighbours = 0;
        for (let i = -1; i <= 1; i += 1) {
          for (let j = -1; j <= 1; j += 1) {
            aliveNeighbours += Number(this.cells[l + i][m + j].isAlive);
          }
        }
        aliveNeighbours -= Number(this.cells[l][m].isAlive);

        if (this.cells[l][m].isAlive && aliveNeighbours < 2) {
          this.cells[l][m].isAlive = false;
        } else if (this.cells[l][m].isAlive && aliveNeighbours > 3) {
          this.cells[l][m].isAlive = false;
        } else if (!this.cells[l][m].isAlive && aliveNeighbours === 3) {
          this.cells[l][m].isAlive = true;
        }
      }
    }
  }

  private drawCells() {
    this.cells.forEach((row) =>
      row.forEach((cell) =>
        this.canvas.fillRect(
          cell.position.x,
          cell.position.y,
          this.config.cellSize,
          this.config.cellSize,
          cell.isAlive ? '#fff' : '#333'
        )
      )
    );
  }

  private animate() {
    this.canvas.clear();
    this.calculateNext();
    this.drawCells();
    this.canvas.drawGrid();
    this.timeout = window.setTimeout(() => {
      this.animate();
    }, 1000);
  }

  private addClickListener() {
    fromEvent(document, 'click')
      .pipe(debounceTime(200))
      .subscribe({
        next: ($evt: MouseEvent) => {
          this.cells.forEach((row) =>
            row.forEach((cell) => {
              if (
                $evt.clientX > cell.position.x &&
                $evt.clientX < cell.position.x + this.config.cellSize &&
                $evt.clientY > cell.position.y &&
                $evt.clientY < cell.position.y + this.config.cellSize
              ) {
                cell.isAlive = true;
                this.canvas.fillRect(
                  cell.position.x,
                  cell.position.y,
                  this.config.cellSize,
                  this.config.cellSize,
                  cell.isAlive ? '#fff' : '#333'
                );
              }
            })
          );
        },
      });
  }
}
