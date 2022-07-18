import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../store';
import userService from '../../services/users';
import { SettingsPayload, InviteAdminPayload, User } from '../types';
import { notify } from './notificationSlice';
import { getErrorMsg } from '../../utils/helperFuncs';
import { string } from 'yup';
import { useState } from 'react';

interface InitialBugState {
  users: User[];
  status: 'idle' | 'loading' | 'succeeded';
  error: string | null;
}

const initialState: InitialBugState = {
  users: [],
  status: 'idle',
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
      state.status = 'succeeded';
      state.error = null;
    },
    setUsersLoading: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    addAdmin: (state, action: PayloadAction<{ admins: string }>) => {
      state.status = 'succeeded';
      state.error = null;
    },
    removeAdministrator: (state, action: PayloadAction<{ adminId: string }>) => {
      state.status = 'succeeded';
      state.error = null;
    },
    ChangeSettings: (state, action: PayloadAction<{ data: SettingsPayload; userId: string }>) => {
      state.users = state.users.map((u) => u.id === action.payload.userId ? {...u, ...action.payload.data } : u
      );
      state.status = 'succeeded';
      state.error = null;
    }
  },
});

export const { setUsers, setUsersLoading, addAdmin, removeAdministrator, ChangeSettings } = usersSlice.actions;

export const fetchUsers = (): AppThunk => {
  return async (dispatch) => {
    try {
      dispatch(setUsersLoading());
      const allUsers = await userService.getUsers();
      dispatch(setUsers(allUsers));
    } catch (e) {
      dispatch(notify(getErrorMsg(e), 'error'));
    }
  };
};

export const addAdmins = (
  admins: string[],
  closeDialog?: () => void
) : AppThunk => {
  return async (dispatch) => {
    try {
      const newAdmins = await userService.addAdmins(admins);
      dispatch(addAdmin({ admins: newAdmins }));
      dispatch(notify('New admin(s) added!', 'success'));
      closeDialog && closeDialog();
    }
    catch (e) {
      dispatch(notify(getErrorMsg(e), 'error'));
    }
  };
};

export const inviteAdmin = (
  data: InviteAdminPayload,
  closeDialog?: () => void
) : AppThunk => {
  return async (dispatch) => {
    try {
      await userService.inviteAdmin(data);
      dispatch(notify('Email was sent successfully!', 'success'));
      closeDialog && closeDialog();
    }
    catch (e) {
    dispatch(notify(getErrorMsg(e), 'error'));
    }
  };
};

export const removeAdmin = (
  adminId: string
): AppThunk => {
  return async (dispatch) => {
    try {
      await userService.removeAdmin(adminId);
      dispatch(removeAdministrator({ adminId }));
      dispatch(notify('Removed the administrator.', 'success'));
    } catch (e) {
      dispatch(notify(getErrorMsg(e), 'error'));
    }
  };
};

export const changeSettings = (
  data: SettingsPayload,
  closeDialog?: () => void
): AppThunk => {
  return async (dispatch) => {
    try {
      const updatedUser: User = await userService.changeSettings(data);
      const userId = updatedUser.id;
      dispatch(ChangeSettings( { data, userId }));
      dispatch(notify('New settings saved!', 'success'));
      closeDialog && closeDialog();
    } catch (e) {
      dispatch(notify(getErrorMsg(e), 'error'));
    }
  };
};

export const selectUsersState = (state: RootState) => {
  return state.users;
}

export default usersSlice.reducer;
