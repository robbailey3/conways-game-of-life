export class Canvas {
  public config = {
    backgroundColor: '#101010',
    strokeColor: '#fff',
    fillColor: '#fff',
  };

  private ctx: CanvasRenderingContext2D;

  constructor(private hostElement: HTMLCanvasElement, public cellSize: number) {
    this.ctx = hostElement.getContext('2d');
    this.setFullScreen();
    this.clear();
  }

  public drawLine(
    start: { x: number; y: number },
    end: { x: number; y: number },
    strokeColor
  ) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.lineWidth = 1;
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);
    this.ctx.strokeStyle = strokeColor;
    this.ctx.closePath();
    this.ctx.stroke();
    this.ctx.restore();
  }

  public drawGrid() {
    for (let i = this.cellSize; i < window.innerWidth; i += this.cellSize) {
      // Draw the vertical lines
      this.drawLine({ x: i, y: 0 }, { x: i, y: window.innerHeight }, '#222');
      for (let j = this.cellSize; j < window.innerHeight; j += this.cellSize) {
        // Draw the horizontal lines
        this.drawLine({ x: 0, y: j }, { x: window.innerWidth, y: j }, '#222');
      }
    }
  }

  public fillRect(
    x: number,
    y: number,
    w: number,
    h: number,
    fill = this.config.fillColor
  ) {
    this.ctx.save();
    this.ctx.fillStyle = fill;
    this.ctx.fillRect(x, y, w, h);
    this.ctx.restore();
  }

  public clear(): this {
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.ctx.save();
    this.ctx.fillStyle = this.config.backgroundColor;
    this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    this.ctx.restore();
    return this;
  }

  private setFullScreen() {
    this.hostElement.width = window.innerWidth;
    this.hostElement.height = window.innerHeight;
  }
}
