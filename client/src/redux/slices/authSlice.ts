import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../store';
import authService from '../../services/auth';
import storage from '../../utils/localStorage';
import { CredentialsPayload, UserState } from '../types';
import { notify } from './notificationSlice';
import { fetchUsers } from './usersSlice';
import { getErrorMsg } from '../../utils/helperFuncs';
import { fetchBugs } from './bugsSlice';


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
      //console.log("userdata: ", userData);
      dispatch(setUser(userData));
      storage.saveUser(userData);
      authService.setToken(userData.token);
      authService.setisAdmin(userData.isAdmin);
      authService.setEmail(userData.email);
      authService.setNotifications(userData.notificationsOn);
      //console.log("login token: ", userData.token);
      dispatch(fetchBugs());
      dispatch(fetchUsers());
      dispatch(notify(`Welcome back, ${userData.username}!`, 'success'));
    } catch (e: any) {
      dispatch(setAuthError(getErrorMsg(e)));
    }
  };
};

export const signup = (credentials: CredentialsPayload): AppThunk => {
  return async (dispatch) => {
    try {
      dispatch(setAuthLoading());
      const userData = await authService.signup(credentials);
      dispatch(setUser(userData));

      storage.saveUser(userData);
      authService.setToken(userData.token);
      authService.setisAdmin(userData.isAdmin);
      //console.log("signup token: ", userData.token);
      dispatch(fetchBugs());
      dispatch(fetchUsers());
      dispatch(
        notify(`Hi, ${userData.username}! Welcome to Bug Tracker :D`, 'success')
      );
    } catch (e: any) {
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
      //alert("User is still logged");
      //console.log("loggedUser: ", loggedUser);
      dispatch(setUser(loggedUser));
      authService.setToken(loggedUser.token);
      //console.log("auto login token: ", loggedUser.token);
      authService.setisAdmin(loggedUser.isAdmin);
      authService.setEmail(loggedUser.email);
      authService.setNotifications(loggedUser.notificationsOn);
      dispatch(fetchBugs());
      dispatch(fetchUsers());
    }
    // auto user ()
    else {
      //alert("User is not logged in")
      // Automatically connect as auto user
      const autoUserToken: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsInVzZXJuYW1lIjoidXNlciJ9.7lC6scQ1vxLzFKSlZN2_1iGPBy56WYZ05nLPlx8G1eU"
      const autoUserId: string = "00000000-0000-0000-0000-000000000000"
      const autoUserName: string = "user"
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

export const selectAuthState = (state: RootState) => state.auth;

export default authSlice.reducer;
