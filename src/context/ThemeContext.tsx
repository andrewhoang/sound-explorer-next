import { createContext } from "react";

export interface IThemeContext {
  theme: string;
  setTheme?: () => void;
}

export const defaultState = {
  theme: "light",
};

export const ThemeContext = createContext<IThemeContext>(defaultState);
