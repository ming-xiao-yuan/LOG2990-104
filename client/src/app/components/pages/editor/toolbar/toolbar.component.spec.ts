import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Color } from 'src/app/utils/color/color';
import { SharedModule } from '../../../shared/shared.module';
import { ToolbarComponent } from './toolbar.component';

import { Color } from '../../../../utils/color/color';

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;

  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule],
      declarations: [ToolbarComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarComponent);
    router = TestBed.get(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go home', () => {
    const spy = spyOn(router, 'navigate');

    const backButton = fixture.debugElement.nativeElement.querySelector('#back-button');

    backButton.click();

    expect(spy).toHaveBeenCalledWith(['']);
  });

  it('should go to the help guide', () => {
    const spy = spyOn(router, 'navigate');

    const helpButton = fixture.debugElement.nativeElement.querySelector('#help-button');

    helpButton.click();

    expect(spy).toHaveBeenCalledWith(['help']);
  });

  it('should select the pen tool', () => {
    fixture.debugElement.nativeElement.querySelector('#pen-button').click();
    fixture.detectChanges();

    expect(component.currentTool).toBe(component.tools.Pen);
  });

  it('should open the drawer when double clicking the brush tool button', () => {
    const brushButton = fixture.debugElement.nativeElement.querySelector('#brush-button');
    const doubleClickEvent = new Event('dblclick');
    brushButton.dispatchEvent(doubleClickEvent);
    fixture.detectChanges();

    expect(component.drawer.opened).toBe(true);
  });

  it('should close the drawer when selecting the rectangle tool a second time', () => {
    const rectangleButton = fixture.debugElement.nativeElement.querySelector('#rectangle-button');
    const doubleClickEvent = new Event('dblclick');
    rectangleButton.dispatchEvent(doubleClickEvent);
    fixture.detectChanges();

    rectangleButton.dispatchEvent(doubleClickEvent);
    fixture.detectChanges();

    expect(component.drawer.opened).toBe(false);
  });

  it('should select the rectangle tool', () => {
    const rectangleButton = fixture.debugElement.nativeElement.querySelector('#rectangle-button');
    rectangleButton.click();
    fixture.detectChanges();

    expect(component.currentTool).toBe(component.tools.Rectangle);
  });

  it('should select the line tool', () => {
    const lineButton = fixture.debugElement.nativeElement.querySelector('#line-button');
    lineButton.click();
    fixture.detectChanges();

    expect(component.currentTool).toBe(component.tools.Line);
  });

  it('should select the brush tool', () => {
    const brushButton = fixture.debugElement.nativeElement.querySelector('#brush-button');
    brushButton.click();
    fixture.detectChanges();

    expect(component.currentTool).toBe(component.tools.Brush);
  });

  it('should create the color picker when selecting a color', () => {
    fixture.debugElement.nativeElement.querySelector('#colorpicker-button').click();
    fixture.detectChanges();

    expect(component.colorPicker).not.toBeUndefined();
  });

  it('should select the primary color and the secondary color when clicking associated squares', () => {
    component.selectTool(component.tools.ColorPicker);
    fixture.detectChanges();

    const primaryColorSquare = fixture.debugElement.nativeElement.querySelector('#toolbar-primary-color');
    const secondaryColorSquare = fixture.debugElement.nativeElement.querySelector('#toolbar-secondary-color');

    secondaryColorSquare.click();

    expect(component.colorPickerProperties.selectedColor).toEqual(0);

    primaryColorSquare.click();

    expect(component.colorPickerProperties.selectedColor).toEqual(1);
  });

  it('should show the correct primary color in the square when a new color is picked', () => {
    const primaryColorSquare = fixture.debugElement.nativeElement.querySelector('#toolbar-primary-color');
    primaryColorSquare.click();
    fixture.detectChanges();

    component.colorPicker.color = Color.BLUE;
    component.colorPicker.colorChanged.emit(component.colorPicker.color);

    expect(component.colorPickerProperties.primaryColor.hexString).toEqual(Color.BLUE.hexString);
  });

  it('should show the correct secondary color in the square when a new color is picked', () => {
    const secondaryColorSquare = fixture.debugElement.nativeElement.querySelector('#toolbar-secondary-color');
    secondaryColorSquare.click();
    fixture.detectChanges();

    component.colorPicker.color = Color.GREEN;
    component.colorPicker.colorChanged.emit(component.colorPicker.color);

    expect(component.colorPickerProperties.secondaryColor.hexString).toEqual(Color.GREEN.hexString);
  });

  it('should emit editBackgroundChanged on update background button clicked', () => {
    const backgroundChangedSpy = spyOn(component.editorBackgroundChanged, 'emit');
    component.selectColor(true);
    fixture.detectChanges();
    component.colorPicker.color = Color.GREEN;

    fixture.debugElement.nativeElement.querySelector('#btn-update-background').click();

    expect(backgroundChangedSpy).toHaveBeenCalledWith(Color.GREEN);
  });
});
