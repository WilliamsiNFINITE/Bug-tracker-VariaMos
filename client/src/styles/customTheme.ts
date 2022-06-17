import { createMuiTheme } from '@material-ui/core/styles';

const customTheme = (darkMode: boolean) =>
  createMuiTheme({
    palette: {
      type: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#5819E9' : '#2E7EF6',
        light: darkMode ? '#2251D2' : '#c2e0ff',
      },
      secondary: {
        main: darkMode ? '#e4fffd' : '#00008B',
      },
    },
    overrides: {
      MuiTypography: {
        root: {
          wordBreak: 'break-word',
        },
      },
    },
  });

export default customTheme;
