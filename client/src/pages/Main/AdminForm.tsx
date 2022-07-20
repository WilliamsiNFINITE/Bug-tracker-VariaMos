import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { inviteAdmin, selectUsersState } from '../../redux/slices/usersSlice';
import { InviteAdminPayload, User } from '../../redux/types';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import TitleIcon from '@material-ui/icons/Title';

import {
  TextField,
  Button,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  InputAdornment,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useFormStyles } from '../../styles/muiStyles';
import GroupIcon from '@material-ui/icons/Group';
import { addAdmins } from '../../redux/slices/usersSlice';
import { assignBugTo } from '../../redux/slices/bugsSlice';
import { selectAuthState } from '../../redux/slices/authSlice';

interface BaseType {
    closeDialog?: () => void;
  }

  
const validationSchema = yup.object({
    email: yup.string()
    });

interface MakeAdmin extends BaseType {
    editMode: 'admin' | 'assign';
    currentAdmins: string[];
    bugId?: string;
  }

const AdminForm: React.FC<MakeAdmin> = ({
    closeDialog,
    editMode,
    currentAdmins,
    bugId,
}) => {
  
    const [select, setSelect]= useState('');
    const classes = useFormStyles();
    const dispatch = useDispatch();
    const { users } = useSelector(selectUsersState);
    const [admins, setAdmins] = useState<string[]>([]);

    const user = useSelector(selectAuthState).user;
    const AllUsers: User[] = Object.assign([], users);
    const { register, control, handleSubmit, errors } = useForm({
      mode: 'onChange',
      resolver: yupResolver(validationSchema),
      defaultValues: {
        email: '',
      },
    });

    if (user) {AllUsers.push(user);}

    const selectAdminsOnChange = (e: any, selectedOption: User[]) => {
        setAdmins(selectedOption.map((s) => s.id));
    };

    const handleAddAdmins = (e: React.FormEvent<EventTarget>) => {
        e.preventDefault();

        if (editMode === "admin") {
          dispatch(addAdmins(admins, closeDialog));
        }
        else {
          if (bugId) {
            dispatch(assignBugTo(bugId, admins, closeDialog))
          }
        }
        window.location.reload();
    };

    const handleInviteAdmin = (data: InviteAdminPayload) => {
      dispatch(inviteAdmin(data, closeDialog));
    }
    
    const SelectAddAdmin = () => {
      setSelect("add");
    }

    const SelectInviteAdmin = () => {
      setSelect("invite");
    }

    return (
        <form
          onSubmit={select === "invite" ? handleSubmit(handleInviteAdmin) : handleAddAdmins}
        >
      {select === "" && editMode !== 'assign' ? (
        <Button
          size="large"
          color="primary"
          variant="contained"
          fullWidth
          className={classes.submitBtn}
          type="button"
          onClick={SelectAddAdmin} 
      >
        ADD ADMINISTRATOR (user must already exist)
      </Button>
      ) : '' }
      {select === "" && editMode !== 'assign' ? (
      <Button
        size="large"
        color="primary"
        variant="contained"
        fullWidth
        className={classes.submitBtn}
        type="button"
        onClick={SelectInviteAdmin}
      >
        INVITE ADMINISTRATOR 
      </Button>
      ) : '' }

          {editMode === "admin" && select === "add" ? (
            <Autocomplete
              style={{ marginTop: 0 }}
              multiple
              filterSelectedOptions
              onChange={selectAdminsOnChange}
              options={
                users.filter((u) => !currentAdmins?.includes(u.id) && u.username !== "user")
              }
              getOptionLabel={(option) => option.username}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  required={editMode === 'admin'}
                  label="Select admin(s)"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment
                          position="start"
                          style={{ paddingLeft: '0.4em' }}
                        >
                          <GroupIcon color="primary" />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                  inputProps={{
                    ...params.inputProps,
                    required: admins.length === 0
                  }}
                />
              )}
              renderOption={(option) => (
                <ListItem dense component="div">
                  <ListItemAvatar>
                    <Avatar className={classes.avatar}>
                      {option.username.slice(0, 1)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={option.username}
                    primaryTypographyProps={{
                      color: 'secondary',
                      variant: 'body1',
                    }}
                  />
                </ListItem>
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    avatar={<Avatar>{option.username.slice(0, 1)}</Avatar>}
                    color="secondary"
                    variant="outlined"
                    label={option.username}
                    {...getTagProps({ index })}
                  />
                ))
              }
            />
            ) : editMode === 'assign' && 
            <Autocomplete
              style={{ marginTop: 0 }}
              multiple
              filterSelectedOptions
              onChange={selectAdminsOnChange}
              options={
                  AllUsers.filter((u) => currentAdmins?.includes(u.id))
              }
              getOptionLabel={(option) => option.username}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Select admin(s) to assign the bug to"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment
                          position="start"
                          style={{ paddingLeft: '0.4em' }}
                        >
                          <GroupIcon color="primary" />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                  inputProps={{
                    ...params.inputProps,
                    required: admins.length === 0
                  }}
                />
              )}
              renderOption={(option) => (
                <ListItem dense component="div">
                  <ListItemAvatar>
                    <Avatar className={classes.avatar}>
                      {option.username.slice(0, 1)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={option.username}
                    primaryTypographyProps={{
                      color: 'secondary',
                      variant: 'body1',
                    }}
                  />
                </ListItem>
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    avatar={<Avatar>{option.username.slice(0, 1)}</Avatar>}
                    color="secondary"
                    variant="outlined"
                    label={option.username}
                    {...getTagProps({ index })}
                  />
                ))
              }
            />
          }
          {editMode === "admin" && select === "add" ? (
          <Button
            size="large"
            color="primary"
            variant="contained"
            fullWidth
            className={classes.submitBtn}
            type="submit"
          >
           Add New Administrators

          </Button>
          ) : editMode === 'assign' && (
            <Button
            size="large"
            color="primary"
            variant="contained"
            fullWidth
            className={classes.submitBtn}
            type="submit"
          >
           Assign Bug

          </Button>
        )}

        {editMode === "admin" && select === "invite" ? (
          <><TextField
            className={classes.fieldMargin}
            inputRef={register}
            name="email"
            required
            fullWidth
            type="text"
            label="Email Adress"
            variant="outlined"
            error={'email' in errors}
            helperText={'email' in errors ? errors.email?.message : ''}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TitleIcon color="primary" />
                </InputAdornment>
              ),
            }} /><Button
              size="large"
              color="primary"
              variant="contained"
              fullWidth
              className={classes.submitBtn}
              type="submit"
            >
              Invite Administrator

            </Button></>

        ) : '' }

        </form>
      );
}


export default AdminForm;

