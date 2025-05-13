import { TFontSize } from "./initialState";



export const NumberToFontSize: { [key: number]: TFontSize } = {
  0: TFontSize.small,
  50: TFontSize.medium,
  100: TFontSize.large,
};

export const FontSizeToNumber: { [key in TFontSize]: number } = {
  [TFontSize.small]: 0,
  [TFontSize.medium]: 50,
  [TFontSize.large]: 100,
};

export function getFontSizeNumber(value: String | Number) {
  const convertedVal = Number(value);
  if (convertedVal >= 0 && convertedVal <= 33) {
    return 0;
  } else if (convertedVal > 33 && convertedVal <= 66) {
    return 50;
  } else {
    return 100;
  }
}
export function mapFontSize(key: number): TFontSize;
export function mapFontSize(key: TFontSize): number;
export function mapFontSize(key: number | TFontSize) {
  if (typeof key === "number") return NumberToFontSize[key];
  else return FontSizeToNumber[key];
}
