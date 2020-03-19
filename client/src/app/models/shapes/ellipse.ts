import { BaseShape } from 'src/app/models/shapes/base-shape';
import { Coordinate } from 'src/app/utils/math/coordinate';

export class Ellipse extends BaseShape {
  private _radiusX: number;
  private _radiusY: number;

  get radiusX(): number {
    return this._radiusX;
  }

  set radiusX(rx: number) {
    this._radiusX = !rx ? 0 : Math.abs(rx);
    this.svgNode.setAttribute('rx', this._radiusX.toString());
  }

  get radiusY(): number {
    return this._radiusY;
  }

  set radiusY(ry: number) {
    this._radiusY = !ry ? 0 : Math.abs(ry);
    this.svgNode.setAttribute('ry', this._radiusY.toString());
  }

  get origin(): Coordinate {
    return this._origin;
  }

  set origin(c: Coordinate) {
    this._origin = c;
    this.svgNode.setAttribute('cx', this.center.x.toString());
    this.svgNode.setAttribute('cy', this.center.y.toString());
  }
  get center(): Coordinate {
    return Coordinate.add(this.origin, new Coordinate(this._radiusX, this._radiusY));
  }

  constructor(origin: Coordinate = new Coordinate(), rx: number = 0, ry: number = rx) {
    super('ellipse');
    this.origin = origin;
    this.radiusX = rx;
    this.radiusY = ry;
  }
}
