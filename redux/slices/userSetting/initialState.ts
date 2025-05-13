export enum TTheme {
  dark = "D",
  light = "L",
}

export enum TFontSize {
  small = "S",
  medium = "M",
  large = "L",
}

export interface IUserSettings {
  themeSelection: TTheme;
  fontSize: TFontSize;
}

type InitialState = {
  settings: {
    themeSelection: TTheme | null;
    fontSize: TFontSize | null;
  };
  lastSavedSettings: null | IUserSettings;
};

export const initialState: InitialState = {
  settings: {
    themeSelection: null,
    fontSize: null,
  },
  lastSavedSettings: null,
};
