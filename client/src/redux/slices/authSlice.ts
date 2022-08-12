import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../store';
import authService from '../../services/auth';
import storage from '../../utils/localStorage';
import { CredentialsPayload, InviteCodeData, UserState } from '../types';
import { notify } from './notificationSlice';
import { fetchUsers } from './usersSlice';
import { getErrorMsg } from '../../utils/helperFuncs';
import { fetchBugs } from './bugsSlice';
import { autoUserId, autoUserName, autoUserToken } from '../../utils/variables';


interface InitialAuthState {
  user: UserState | null;
  loading: boolean;
  error: string | null;
}

const initialState: InitialAuthState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    removeUser: (state) => {
      state.user = null;
    },
    setAuthLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setAuthError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setUser,
  removeUser,
  setAuthLoading,
  setAuthError,
  clearAuthError,
} = authSlice.actions;

export const login = (credentials: CredentialsPayload): AppThunk => {
  return async (dispatch) => {
    try {
      dispatch(setAuthLoading());
      const userData = await authService.login(credentials);
      dispatch(setUser(userData));
      storage.saveUser(userData);
      authService.setToken(userData.token);
      authService.setisAdmin(userData.isAdmin);
      authService.setEmail(userData.email);
      authService.setGithub(userData.github);
      authService.setNotifications(userData.notificationsOn);
      dispatch(fetchBugs());
      dispatch(fetchUsers());
      dispatch(notify(`Welcome back, ${userData.username}!`, 'success'));
    } catch (e) {
      dispatch(setAuthError(getErrorMsg(e)));
    }
  };
};

export const signup = (credentials: CredentialsPayload, adminMode: boolean): AppThunk => {
  return async (dispatch) => {
    try {
      dispatch(setAuthLoading());
      const userData = await authService.signup(credentials, adminMode);
      dispatch(setUser(userData));
      storage.saveUser(userData);
      authService.setToken(userData.token);
      authService.setisAdmin(userData.isAdmin);
      dispatch(fetchBugs());
      dispatch(fetchUsers());
      dispatch(notify(`Hi, ${userData.username}! Welcome to Bug Tracker :D`, 'success'));
    } catch (e) {
      dispatch(setAuthError(getErrorMsg(e)));
    }
  };
};

export const logout = (): AppThunk => {
  return (dispatch) => {
    dispatch(removeUser());
    storage.removeUser();
    dispatch(autoLogin);
    window.location.reload();
    dispatch(notify('Logged out!', 'success'));
  };
};

export const autoLogin = (): AppThunk => {
  return (dispatch) => {
    //alert("Auto login");
    const loggedUser = storage.loadUser();
    // real user
    if (loggedUser) {
      dispatch(setUser(loggedUser));
      authService.setToken(loggedUser.token);
      authService.setisAdmin(loggedUser.isAdmin);
      authService.setEmail(loggedUser.email);
      authService.setGithub(loggedUser.github);
      authService.setNotifications(loggedUser.notificationsOn);
      dispatch(fetchBugs());
      dispatch(fetchUsers());
    }
    // auto user ()
    else {
      // Automatically connect as auto user
      // Automatically connect as auto user
      const autoUserStringData: string = `{
        "id":"${autoUserId}",
        "username":"${autoUserName}",
        "token":"${autoUserToken}",
        "isAdmin":false,
        "email":"",
        "notificationsOn":false
      }`;

      const autoUser = JSON.parse(autoUserStringData);
      dispatch(setUser(autoUser));
      authService.setToken(autoUser.token);
      authService.setisAdmin(autoUser.isAdmin);
      authService.setEmail(autoUser.email);
      authService.setNotifications(autoUser.notificationsOn);
      dispatch(fetchBugs());
      dispatch(fetchUsers());
      }
    };
};

export const verifyCode = async (
  inviteCode: InviteCodeData,
  closeDialog?: () => void,
  ): Promise<boolean> => {
    try {
      await authService.verifyInvitation(inviteCode);
      notify(`Your invitation has been sucessfully validated!`, 'success');
      closeDialog && closeDialog();
      return true;
    } catch (e) {
      setAuthError(getErrorMsg(e));
      return false;
    }
  };
//};

export const selectAuthState = (state: RootState) => state.auth;

export default authSlice.reducer;
