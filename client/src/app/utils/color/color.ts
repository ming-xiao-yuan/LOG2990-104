/**
 * Represents a color.
 * RGB values must be between 0 and 1
 * HSL values must be between 0-360 (for hue) and 0-1 for saturation and lightness
 * Values will be made to fit the bounds
 *
 * Hue value will be made to keep the same angle if the value is out of bounds (ie: 400 will give a hue of 40)
 *
 */
import { ColorComponents } from 'src/app/utils/color/color-components';
import { MathUtil } from '../math/math-util';

export class Color implements ColorComponents {
  static RED: Color = Color.rgb(1);
  static GREEN: Color = Color.rgb(0, 1, 0);
  static BLUE: Color = Color.rgb(0, 0, 1);
  static WHITE: Color = Color.rgb(1, 1, 1);
  static BLACK: Color = Color.rgb();
  static TRANSPARENT: Color = Color.rgb(0, 0, 0, 0);

  /**
   * red component 0..1
   */
  readonly r: number;

  /**
   * green component 0..1
   */
  readonly g: number;

  /**
   * blue component 0..1
   */
  readonly b: number;

  /**
   * hue component 0..360
   */
  readonly h: number;

  /**
   * saturation component 0..1
   */
  readonly s: number;

  /**
   * lightness component 0..1
   */
  readonly l: number;

  /**
   * transparency component 0..1
   */
  readonly a: number;

  /**
   * Constructor for a color from hsl or rgb values.
   * If HSL values are given, they will be prioritized over RGB values
   * If both HSL values and RGB values are given, RGB will be recalculated.
   *
   * Method for calculating rgb components from HSL is an implementation of:
   * https://en.wikipedia.org/wiki/HSL_and_HSV#HSL_to_RGB
   *
   */
  private constructor(components: ColorComponents, doNotCompute: boolean = false) {
    const { h, s, l, r, g, b, a } = components;
    if (doNotCompute) {
      this.h = MathUtil.fitAngle(h || 0);
      this.s = MathUtil.fit(s || 0);
      this.l = MathUtil.fit(l || 0);

      this.r = MathUtil.fit(r || 0);
      this.g = MathUtil.fit(g || 0);
      this.b = MathUtil.fit(b || 0);
    } else if (!(h === undefined || s === undefined || l === undefined)) {
      this.h = MathUtil.fitAngle(h);
      this.s = MathUtil.fit(s);
      this.l = MathUtil.fit(l);

      const f = (n: number) => {
        // tslint:disable-next-line:no-magic-numbers
        const k = (n + h / 30) % 12;
        const A = s * Math.min(l, 1 - l);
        // tslint:disable-next-line:no-magic-numbers
        return l - A * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      };
      this.r = f(0);
      // tslint:disable-next-line:no-magic-numbers
      this.g = f(8);
      // tslint:disable-next-line:no-magic-numbers
      this.b = f(4);
    } else if (!(r === undefined || g === undefined || b === undefined)) {
      this.r = MathUtil.fit(r);
      this.g = MathUtil.fit(g);
      this.b = MathUtil.fit(b);

      this.h = Color.calculateHue(this.r, this.g, this.b);
      this.s = Color.calculateSaturation(this.r, this.g, this.b);
      this.l = Color.calculateLightness(this.r, this.g, this.b);
    }
    this.a = MathUtil.fit(a || 0);
  }

  /* Color creator static methods */

  static alpha(color: Color, a: number = 1): Color {
    return new Color({ ...color, a }, true);
  }

  /**
   * Creates a color from RGBA values
   * @param r red from 0 to 1
   * @param g green from 0 to 1
   * @param b blue from 0 to 1
   * @param a alpha from 0 to 1
   */
  static rgb(r: number = 0, g: number = 0, b: number = 0, a: number = 1): Color {
    return new Color({ r, g, b, a });
  }

  /**
   * Creates a color from values between 0 and 255
   */
  static rgb255(r255: number = 0, g255: number = 0, b255: number = 0, a: number = 1): Color {
    // tslint:disable-next-line:no-magic-numbers
    return Color.rgb(r255 / 255, g255 / 255, b255 / 255, a);
  }

  /**
   * Creates a color form HSL values
   * @param h hue between 0 and 360
   * @param s saturation between 0 and 1
   * @param l lightness between 0 and 1
   * @param a alpha between 0 and 1
   */
  static hsl(h: number = 0, s: number = 0, l: number = 0, a: number = 1): Color {
    return new Color({ h, s, l, a });
  }

  /**
   * Creates a color from hex string
   */
  static hex(hexString: string, a: number = 1): Color {
    const r = parseInt(hexString.substr(0, 2), 16);
    const g = parseInt(hexString.substr(2, 2), 16);
    // tslint:disable-next-line:no-magic-numbers
    const b = parseInt(hexString.substr(4, 2), 16);
    return Color.rgb255(r, g, b, a);
  }

  /* Utility methods */

  get hex(): string {
    const radix = 16;
    const r = this.r255.toString(radix).padStart(2, '0');
    const g = this.g255.toString(radix).padStart(2, '0');
    const b = this.b255.toString(radix).padStart(2, '0');
    return `${r}${g}${b}`;
  }

  get negative(): Color {
    return Color.rgb(1 - this.r, 1 - this.g, 1 - this.b);
  }

  /* private static methods to get HSL components from RGB*/

  /**
   * Gets hue value from RGB color
   * Based on: https://en.wikipedia.org/wiki/HSL_and_HSV#Hue_and_chroma
   */
  private static calculateHue(r: number = 0, g: number = 0, b: number = 0): number {
    const M = Math.max(r, g, b);
    const m = Math.min(r, g, b);
    const C = M - m;

    let h: number | undefined;
    switch (M) {
      case r:
        // tslint:disable-next-line:no-magic-numbers
        h = ((g - b) / C) % 6;
        break;
      case g:
        h = (b - r) / C + 2;
        break;
      case b:
        // tslint:disable-next-line:no-magic-numbers
        h = (r - g) / C + 4;
        break;
    }
    // tslint:disable-next-line:no-magic-numbers
    return MathUtil.fitAngle(h ? 60 * h : 0);
  }

  /**
   * Gets saturation from RGB color
   * Based on: https://en.wikipedia.org/wiki/HSL_and_HSV#Saturation
   */
  private static calculateSaturation(r: number = 0, g: number = 0, b: number = 0): number {
    const M = Math.max(r, g, b);
    const m = Math.min(r, g, b);
    const C = M - m;
    const L = (M + m) / 2;
    const S = () => C / (1 - Math.abs(2 * L - 1));

    return L === 1 || L === 0 ? 0 : S();
  }

  /**
   * Gets lightness from RGB color
   * Based on: https://en.wikipedia.org/wiki/HSL_and_HSV#Saturation
   */
  private static calculateLightness(r: number = 0, g: number = 0, b: number = 0): number {
    const M = Math.max(r, g, b);
    const m = Math.min(r, g, b);
    return (M + m) / 2;
  }

  /* Methods to get string values of colors */

  /**
   * Get HSL string `hsl(h,s%,l%)`
   * @param h hue (0 to 360)
   * @param s saturation (0 to 1)
   * @param l lightness (0 to 1)
   */
  static getHslString(h: number, s: number, l: number): string {
    // tslint:disable-next-line:no-magic-numbers
    return `hsl(${h}, ${s * 100}%, ${l * 100}%)`;
  }

  /**
   * Get hex string `#FFFFFF`
   */
  get hexString(): string {
    return '#' + this.hex;
  }

  /**
   * Get RGB string `rgb(255,255,255)`
   */
  get rgbString(): string {
    // tslint:disable-next-line:no-magic-numbers
    return `rgb(${this.r * 255}, ${this.g * 255}, ${this.b * 255})`;
  }

  get hslString(): string {
    return Color.getHslString(this.h, this.s, this.l);
  }

  /* Getters */

  get opaqueColor(): Color {
    return new Color({ ...this, a: 1 });
  }

  get color255(): ColorComponents {
    return { ...this, r: this.r255, g: this.g255, b: this.b255 };
  }

  get r255(): number {
    // tslint:disable-next-line:no-magic-numbers
    return Math.round(this.r * 255);
  }

  get g255(): number {
    // tslint:disable-next-line:no-magic-numbers
    return Math.round(this.g * 255);
  }

  get b255(): number {
    // tslint:disable-next-line:no-magic-numbers
    return Math.round(this.b * 255);
  }
}
