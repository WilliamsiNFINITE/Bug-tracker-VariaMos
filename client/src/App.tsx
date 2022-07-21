import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { autoLogin } from './redux/slices/authSlice';
import { selectThemeState, toggleDarkMode } from './redux/slices/themeSlice';
import NavBar from './components/NavBar';
import Routes from './Routes';
import ToastNotification from './components/ToastNotification';
import storage from './utils/localStorage';

import customTheme from './styles/customTheme';
import { useBodyStyles } from './styles/muiStyles';
import { ThemeProvider } from '@material-ui/core/styles';
import { selectUsersState } from './redux/slices/usersSlice';/*
import { User } from '../../server/src/entity/User';*/

const App = () => {
  const dispatch = useDispatch();
  const { darkMode } = useSelector(selectThemeState);
  const classes = useBodyStyles(darkMode)();

  useEffect(() => {
    dispatch(autoLogin());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const loadedDarkMode = storage.loadDarkMode();
    if (loadedDarkMode && !darkMode) {
      dispatch(toggleDarkMode());
    }
    // eslint-disable-next-line
  }, []);

  return (
    <ThemeProvider theme={customTheme(darkMode)}>
      <div className={classes.root}>
        <NavBar />
        <Routes />
        <ToastNotification />
      </div>
    </ThemeProvider>
  );
};

export default App;
