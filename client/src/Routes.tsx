import { Switch, Route, Redirect } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import BugsPage from './pages/Main/BugsPage';
import NotFoundPage from './pages/Main/NotFoundPage';
import { useSelector } from 'react-redux';
import { selectAuthState } from './redux/slices/authSlice';
import { Container, useMediaQuery } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import InviteVerificationPage from './pages/Auth/InviteVerificationPage';

const Routes = () => {
  const { user } = useSelector(selectAuthState);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <Container disableGutters={isMobile} maxWidth={false}>
      <Switch>
        <Route exact path="/">
          {<BugsPage isMobile={false} />}
        </Route>
        <Route exact path="/bugs">
          {<BugsPage isMobile={false} />}
        </Route>
        <Route exact path="/login">
          {user?.username === "user" ? <LoginPage /> : <Redirect to="/" />}
        </Route>
        <Route exact path={'/invite/SUJ3NW12UVhIaVNiOTVuNzJrN2g='}>
          <InviteVerificationPage />
        </Route>
        <Route exact path="/signup">
          {user?.username === "user" ? <SignupPage adminMode={false}/> : <Redirect to="/" />}
        </Route>

        <Route>
          <NotFoundPage />
        </Route>
      </Switch>
    </Container>
  );
};

export default Routes;
