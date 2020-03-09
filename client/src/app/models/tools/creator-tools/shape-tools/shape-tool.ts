import { Rectangle } from 'src/app/models/shapes/rectangle';
import { ContourType } from 'src/app/models/tool-properties/contour-type';
import { ShapeToolProperties } from 'src/app/models/tool-properties/shape-tool-properties';
import { CreatorTool } from 'src/app/models/tools/creator-tools/creator-tool';
import { EditorService } from 'src/app/services/editor.service';
import { Color } from 'src/app/utils/color/color';
import { KeyboardListener } from 'src/app/utils/events/keyboard-listener';
import { Coordinate } from 'src/app/utils/math/coordinate';

export abstract class ShapeTool<T extends ShapeToolProperties> extends CreatorTool<T> {
  protected previewArea: Rectangle;
  private forceEqualDimensions: boolean;
  protected initialMouseCoord: Coordinate;

  protected constructor(editorService: EditorService) {
    super(editorService);

    this.previewArea = new Rectangle();
    this.forceEqualDimensions = false;
    this.keyboardListener.addEvents([
      [
        KeyboardListener.getIdentifier('Shift', false, true),
        () => {
          this.setEqualDimensions(true);
          return false;
        },
      ],
      [
        KeyboardListener.getIdentifier('Shift', false, false, 'keyup'),
        () => {
          this.setEqualDimensions(false);
          return false;
        },
      ],
    ]);
  }

  abstract resizeShape(origin: Coordinate, dimensions: Coordinate): void;

  handleMouseEvent(e: MouseEvent): void {
    super.handleMouseEvent(e);
    // todo - make a proper mouse manager
    const mouseCoord = new Coordinate(e.offsetX, e.offsetY);

    if (this.isActive) {
      switch (e.type) {
        case 'mouseup':
          this.applyShape();
          break;
        case 'mousemove':
          this.updateCurrentCoord(mouseCoord);
          break;
      }
    } else if (e.type === 'mousedown') {
      this.isActive = true;
      this.initialMouseCoord = mouseCoord;
      this.shape = this.createShape();
      this.updateProperties();
      this.addShape();

      this.updateCurrentCoord(mouseCoord);
      this.editorService.addPreviewShape(this.previewArea);
    }
  }

  setEqualDimensions(value: boolean): void {
    this.forceEqualDimensions = value;
    if (this.isActive) {
      this.updateCurrentCoord(this.mousePosition);
    }
  }

  updateCurrentCoord(c: Coordinate): void {
    const delta = Coordinate.substract(c, this.initialMouseCoord);
    const previewDimensions = Coordinate.abs(delta);
    let dimensions = new Coordinate(previewDimensions.x, previewDimensions.y);
    let origin = Coordinate.minXYCoord(c, this.initialMouseCoord);

    if (this.forceEqualDimensions) {
      const minDimension = Math.min(dimensions.x, dimensions.y);
      dimensions = new Coordinate(minDimension, minDimension);
    }

    if (delta.y < 0) {
      origin = new Coordinate(origin.x, origin.y + previewDimensions.y - dimensions.y);
    }

    if (delta.x < 0) {
      origin = new Coordinate(origin.x + previewDimensions.x - dimensions.x, origin.y);
    }

    this.previewArea.origin = origin;
    this.previewArea.width = dimensions.x;
    this.previewArea.height = dimensions.y;
    this.previewArea.shapeProperties.fillColor = Color.TRANSPARENT;
    this.previewArea.updateProperties();

    this.resizeShape(dimensions, origin);
  }

  protected updateProperties(): void {
    if (this.shape) {
      const {contourType, strokeWidth} = this.toolProperties;
      const {primaryColor, secondaryColor} = this.editorService.colorsService;

      this.shape.shapeProperties.strokeWidth = this.getStrokeWidth(contourType, strokeWidth);
      this.shape.shapeProperties.fillColor = this.getFillColor(contourType, primaryColor);
      this.shape.shapeProperties.strokeColor = this.getStrokeColor(contourType, secondaryColor);
      this.shape.updateProperties();

    }
  }

  protected getStrokeWidth(contourType: ContourType, width: number): number {
    return contourType === ContourType.FILLED ? 0 : width;
  }

  protected getFillColor(contourType: ContourType, color: Color): Color {
    return contourType === ContourType.CONTOUR ? Color.TRANSPARENT : color;
  }

  protected getStrokeColor(contourType: ContourType, color: Color): Color {
    return contourType === ContourType.FILLED ? Color.TRANSPARENT : color;
  }
}
