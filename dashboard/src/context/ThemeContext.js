import { createContext, useState, useEffect } from 'react';
export const ThemeContext = createContext();
export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(() => localStorage.getItem('dark')==='1');
  useEffect(() => { localStorage.setItem('dark', dark ? '1':'0'); document.body.dataset.theme = dark ? 'dark' : 'light'; }, [dark]);
  return <ThemeContext.Provider value={{dark, setDark}}>{children}</ThemeContext.Provider>;
};
