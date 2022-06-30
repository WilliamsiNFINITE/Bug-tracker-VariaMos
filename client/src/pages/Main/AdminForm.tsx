import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUsersState } from '../../redux/slices/usersSlice';
import { User } from '../../redux/types';

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

interface MakeAdmin extends BaseType {
    editMode: 'admin' | '';
    currentAdmins: string[];
    bugId?: string;
  }

const AdminForm: React.FC<MakeAdmin> = ({
    closeDialog,
    editMode,
    currentAdmins,
    bugId
}) => {
   
    const classes = useFormStyles();
    const dispatch = useDispatch();
    const { users } = useSelector(selectUsersState);
    const [admins, setAdmins] = useState<string[]>([]);

    const user = useSelector(selectAuthState).user;
    const AllUsers: User[] = Object.assign([], users);

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
    };

    return (
        <form
          onSubmit={
                handleAddAdmins
          }
        >
            {editMode === "admin" ? (
            <Autocomplete
              style={{ marginTop: 0 }}
              multiple
              filterSelectedOptions
              onChange={selectAdminsOnChange}
              options={
                users.filter((u) => !currentAdmins?.includes(u.id))
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
            ) : 
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
          {editMode === "admin" ? (
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
          ) : (
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

        </form>
      );
}

export default AdminForm;

