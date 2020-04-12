import { BaseShape } from 'src/app/models/shapes/base-shape';
import { Coordinate } from 'src/app/utils/math/coordinate';

export class Path extends BaseShape {
  static readonly PATH_STYLE: string = 'round';
  private _trace: string;
  private points: Coordinate[];

  get trace(): string {
    return this._trace;
  }

  set trace(node: string) {
    this._trace = node;
    this.svgNode.setAttribute('d', this.trace);
  }

  get width(): number {
    return this.points.length > 0 ? Coordinate.maxArrayXYCoord(this.points).x - this.origin.x : 0;
  }

  get height(): number {
    return this.points.length > 0 ? Coordinate.maxArrayXYCoord(this.points).y - this.origin.y : 0;
  }

  get origin(): Coordinate {
    return this.points.length > 0 ? Coordinate.minArrayXYCoord(this.points) : new Coordinate();
  }

  set origin(c: Coordinate) {
    if (this.points.length > 0) {
      const delta = Coordinate.substract(c, this.origin);
      const oldPoints = new Array<Coordinate>();
      oldPoints.push(...this.points);
      this.points.length = 0;
      oldPoints.forEach((point) => {
        point = Coordinate.add(point, delta);
        this.addPoint(point);
      });
    }
  }

  constructor(c?: Coordinate) {
    super('path');
    this.points = new Array<Coordinate>();
    if(c) {
      this.addPoint(c);
    }
  }

  readElement(json: string): void {
    super.readElement(json);
    const data = JSON.parse(json) as this;
    this.points.length = 0;
    data.points.forEach((p) => {
      this.addPoint(p);
    });
  }

  addPoint(c: Coordinate): void {
    this.points.push(c);
    if (this.points.length === 1) {
      this.trace = 'M ' + c.x + ' ' + c.y;
    } else {
      this.trace += ' L ' + c.x + ' ' + c.y;
    }
  }

  updateProperties(): void {
    super.updateProperties();

    this.svgNode.style.fill = Path.CSS_NONE;

    this.svgNode.style.stroke = this.primaryColor.rgbString;
    this.svgNode.style.strokeOpacity = this.primaryColor.a.toString();

    this.svgNode.style.strokeLinecap = Path.PATH_STYLE;
    this.svgNode.style.strokeLinejoin = Path.PATH_STYLE;
  }
}
