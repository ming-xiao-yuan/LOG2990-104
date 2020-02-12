import { Color } from 'src/app/utils/color/color';
import { ToolProperties } from './ToolProperties';

export enum ColorPickerColorType {
  PRIMARY = 1,
  SECONDARY = 0,
}

export class ColorPickerToolProperties extends ToolProperties {
  selectedColor: ColorPickerColorType;
  primaryColor: Color;
  secondaryColor: Color;

  constructor(selectedColor = ColorPickerColorType.PRIMARY, primaryColor = Color.WHITE, secondaryColor = Color.BLACK) {
    super('ColorPicker');

    this.selectedColor = selectedColor;
    this.primaryColor = primaryColor;
    this.secondaryColor = secondaryColor;
  }
}
