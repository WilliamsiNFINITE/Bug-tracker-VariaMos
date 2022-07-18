import { Link as RouterLink, useHistory, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthState, logout, login } from '../redux/slices/authSlice';
import UserButtonsDesktop from './UserButtonsDesktop';
import UserMenuMobile from './UserMenuMobile';
import BugIcon from '../svg/bug-logo.svg';
import { CredentialsPayload } from '../redux/types';

import {
  AppBar,
  Toolbar,
  Typography,
  Link,
  Button,
  useMediaQuery,
  Container,
} from '@material-ui/core';
import { useNavStyles } from '../styles/muiStyles';
import { useTheme } from '@material-ui/core/styles';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const NavBar = () => {
  const { user } = useSelector(selectAuthState);

  const dispatch = useDispatch();
  const history = useHistory();
  const { pathname } = useLocation();
  const classes = useNavStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const handleLogout = () => {
    dispatch(logout());/*
    const autoUserCredentials: CredentialsPayload = {
      username: "user",
      password: "pass",
    };

    dispatch(login(autoUserCredentials))*/
    //history.push('/');
  };

  const handleGoBack = () => {
    if (pathname.includes('/bugs')) {
      history.push(`${pathname.slice(0, pathname.indexOf('/bugs'))}`);
    } else {
      history.push('/');
    }
  };

  const mainButton = () => {
    if (['/', '/login', '/signup'].includes(pathname) || !pathname.includes('/bugs')) {
      return (
        <div className={classes.logoWrapper}>
          <Button
            className={classes.logoBtn}
            component={RouterLink}
            to="/"
            color="secondary"
          >
            <img src={BugIcon} alt="logo" className={classes.svgImage} />
            VariaMosBugTracker
          </Button>
          
        </div>
      );
    } else {
      return (
        <Button
          startIcon={<ArrowBackIcon />}
          color="secondary"
          onClick={handleGoBack}
          className={classes.backBtn}
        >
          {pathname.includes('/bugs') ? 'Back to bugs list' : 'Home'}
        </Button>
      );
    }
  };

  return (
    <Container disableGutters={isMobile} className={classes.container}>
      <AppBar elevation={1} color="inherit" position="static">
        <Toolbar variant="dense" disableGutters={isMobile}>
          <div className={classes.leftPortion}>{mainButton()}</div>
          <UserButtonsDesktop
            isMobile={isMobile}
            user={user}
            handleLogout={handleLogout}
          />
          <UserMenuMobile
            isMobile={isMobile}
            user={user}
            handleLogout={handleLogout}
          />
        </Toolbar>
      </AppBar>
    </Container>
  );
};

export default NavBar;
