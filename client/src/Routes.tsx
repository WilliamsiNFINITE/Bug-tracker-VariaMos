import { Switch, Route, Redirect } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import BugsPage from './pages/Main/BugsPage';
import BugDetailsPage from './pages/Main/BugsDetailsPage';
import NotFoundPage from './pages/Main/NotFoundPage';
import { useSelector } from 'react-redux';
import { selectAuthState } from './redux/slices/authSlice';
import storage from './utils/localStorage';

import { Container, useMediaQuery } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { selectBugsState } from './redux/slices/bugsSlice';
import { UserState } from './redux/types';
import { updateShorthandPropertyAssignment } from 'typescript';

const Routes = () => {
  const { user } = useSelector(selectAuthState);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isLoggedIn = storage.loadUser() || user;

  return (
    <Container disableGutters={isMobile}>
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
        <Route exact path="/signup">
          {user?.username === "user" ? <SignupPage /> : <Redirect to="/" />}
        </Route>
        <Route>
          <NotFoundPage />
        </Route>
      </Switch>
    </Container>
  );
};

export default Routes;
