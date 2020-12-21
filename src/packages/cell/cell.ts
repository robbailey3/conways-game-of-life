export class Cell {
  public nextGenIsAlive;
  constructor(
    public position: { x: number; y: number },
    public isAlive: boolean
  ) {}
}
