import { BaseShape } from 'src/app/models/shapes/base-shape';
import { SimpleSelectionTool } from 'src/app/models/tools/editing-tools/simple-selection-tool';
import { EditorService } from 'src/app/services/editor.service';

export class ColorApplicatorTool extends SimpleSelectionTool {
  constructor(editorService: EditorService) {
    super(editorService);
  }

  selectShape(shape: BaseShape, rightClick: boolean = false): void {
    if (!rightClick) {
      shape.primaryColor = this.editorService.colorsService.primaryColor;
    } else {
      shape.secondaryColor = this.editorService.colorsService.secondaryColor;
    }
    shape.updateProperties();
  }
}
