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
    dispatch(logout());
  };

  const mainButton = () => {
      return (
          <a href="https://variamos.com/home/">
              <img src="VariaMosLogo.5980c241.png" alt="logo" width="191" height="39" className="img-fluid" />
          </a>
      );
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
