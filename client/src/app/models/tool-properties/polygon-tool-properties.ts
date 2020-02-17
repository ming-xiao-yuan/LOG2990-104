import { ToolProperties } from './tool-properties';

export enum PolygonContourType {
  FILLEDCONTOUR = 'Plein avec contour',
  FILLED = 'Plein',
  CONTOUR = 'Contour',
}

export class PolygonToolProperties extends ToolProperties {
  static readonly MIN_THICKNESS = 1;
  static readonly MAX_THICKNESS = 10;

  minThickness = PolygonToolProperties.MIN_THICKNESS;
  maxThickness = PolygonToolProperties.MAX_THICKNESS;

  thickness: number;
  contourType: PolygonContourType;

  constructor(thickness: number = PolygonToolProperties.MIN_THICKNESS, contourType: PolygonContourType = PolygonContourType.FILLEDCONTOUR) {
    super('PolygonTool');
    this.thickness = thickness;
    this.contourType = contourType;
  }
}
