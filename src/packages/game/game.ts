import { fromEvent } from "rxjs";
import { debounceTime, map, switchMap, take } from "rxjs/operators";
import { Canvas } from "../canvas/canvas";
import { Cell } from "../cell/cell";

export class Game {
  public config = {
    cellSize: 20,
  };

  public isPlaying: boolean = false;

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
    this.isPlaying = false;
    window.cancelAnimationFrame(this.timeout);
  }

  public play() {
    if (!this.isPlaying) {
      this.animate();
    }
  }

  public clear() {
    if (this.isPlaying) {
      this.pause();
    }
    this.cells.forEach((row) => row.forEach((cell) => (cell.isAlive = false)));
    this.drawCells();
    this.canvas.drawGrid();
  }

  private createCells() {
    for (let i = 0; i < window.innerWidth; i += this.config.cellSize) {
      const row = [];
      for (let j = 0; j < window.innerHeight; j += this.config.cellSize) {
        row.push(new Cell({ x: i, y: j }, Math.random() * 10 > 5));
      }
      this.cells.push(row);
    }
  }

  private calculateNext() {
    for (let l = 0; l < this.cells.length - 1; l += 1) {
      for (let m = 0; m < this.cells[0].length - 1; m += 1) {
        let aliveNeighbours = 0;
        for (let i = -1; i <= 1; i += 1) {
          for (let j = -1; j <= 1; j += 1) {
            if ((l === 0 && i === -1) || (m === 0 && j === -1)) {
              continue;
            }
            aliveNeighbours += Number(this.cells[l + i][m + j].isAlive);
          }
        }
        aliveNeighbours -= Number(this.cells[l][m].isAlive);

        if (this.cells[l][m].isAlive && aliveNeighbours < 2) {
          this.cells[l][m].nextGenIsAlive = false;
        } else if (this.cells[l][m].isAlive && aliveNeighbours > 3) {
          this.cells[l][m].nextGenIsAlive = false;
        } else if (!this.cells[l][m].isAlive && aliveNeighbours === 3) {
          this.cells[l][m].nextGenIsAlive = true;
        } else {
          this.cells[l][m].nextGenIsAlive = this.cells[l][m].isAlive;
        }
      }
    }
    this.cells.forEach((row) =>
      row.forEach((cell) => {
        cell.isAlive = cell.nextGenIsAlive;
      })
    );
  }

  private drawCells() {
    this.cells.forEach((row) =>
      row.forEach((cell) =>
        this.canvas.fillRect(
          cell.position.x,
          cell.position.y,
          this.config.cellSize,
          this.config.cellSize,
          cell.isAlive ? "#00FF00" : "#333"
        )
      )
    );
  }

  private animate() {
    this.isPlaying = true;
    this.canvas.clear();
    this.calculateNext();
    this.drawCells();
    this.canvas.drawGrid();
    this.timeout = window.requestAnimationFrame(() => {
      this.animate();
    });
  }

  private addClickListener() {
    fromEvent(document, "click")
      .pipe(debounceTime(10))
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
                  cell.isAlive ? "#fff" : "#333"
                );
              }
            })
          );
        },
      });
    const $clickStart = fromEvent<MouseEvent>(document, "mousedown");

    const $clickEnd = fromEvent<MouseEvent>(document, "mouseup");

    $clickStart
      .pipe(
        map((evt) => ({ startX: evt.clientX, startY: evt.clientY })),
        switchMap((start) =>
          $clickEnd.pipe(
            take(1),
            map((evt) => ({
              endX: evt.clientX,
              endY: evt.clientY,
              startX: start.startX,
              startY: start.startY,
            }))
          )
        )
      )
      .subscribe((delta) => {
        const lineLength = Math.sqrt(
          Math.pow(delta.endX - delta.startX, 2) +
            Math.pow(delta.endY - delta.startY, 2)
        );

        const lineAngle = Math.atan2(
          delta.endY - delta.startY,
          delta.endX - delta.startX
        );

        const linePoints = [
          ...Array.from({
            length: Math.ceil(lineLength / this.config.cellSize),
          }).map((_, index) => {
            const x = delta.startX + Math.cos(lineAngle) * (this.config.cellSize * (index + 1));
            const y = delta.startY + Math.sin(lineAngle) * (this.config.cellSize * (index));
            return { x, y };
          }),
        ];

        this.cells.forEach((row) =>
          row.forEach((cell) => {
            linePoints.forEach((lp) => {
              if (
                cell.position.x > lp.x &&
                cell.position.x < lp.x + this.config.cellSize &&
                cell.position.y > lp.y &&
                cell.position.y < lp.y + this.config.cellSize
              ) {
                cell.isAlive = true;
                this.canvas.fillRect(
                  cell.position.x,
                  cell.position.y,
                  this.config.cellSize,
                  this.config.cellSize,
                  cell.isAlive ? "#fff" : "#333"
                );
              }
            })
          })
        );
      });
  }
}
