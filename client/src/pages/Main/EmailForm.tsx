import { useForm, Controller } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import {
  clearSubmitBugError,
  selectBugsState,
} from '../../redux/slices/bugsSlice';
import { SettingsPayload } from '../../redux/types';
import ErrorBox from '../../components/ErrorBox';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  Button,
  IconButton,
  InputAdornment,
  FormLabel,
  FormControl,
} from '@material-ui/core';
import { useFormStyles } from '../../styles/muiStyles';
import TitleIcon from '@material-ui/icons/Title';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import GitHubIcon from '@material-ui/icons/GitHub';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import VisibilityIcon from '@material-ui/icons/Visibility';
import LockIcon from '@material-ui/icons/Lock';
import { selectAuthState } from '../../redux/slices/authSlice';
import { changeSettings } from '../../redux/slices/usersSlice';
import { useState } from 'react';
import DemoCredsBox from '../../components/DemoCredsBox';

interface EmailFormProps {
  closeDialog?: () => void;
  emailExist: boolean;
  currentData?: SettingsPayload;
}

const validationSchema = yup.object({
    email: yup.string(),
  });

const EmailForm: React.FC<EmailFormProps> = ({
  closeDialog,
  emailExist,
  currentData,
}) => {

  const [emailHelp, setEmailHelp] = useState<boolean>(false);
  const [githubHelp, setGithubHelp] = useState<boolean>(false);
  const [githubTokenHelp, setGithubTokenHelp] = useState<boolean>(false);
  const classes = useFormStyles();
  const dispatch = useDispatch();
  const { user } = useSelector(selectAuthState);
  const { submitError, submitLoading } = useSelector(selectBugsState);
  const [showToken, setShowToken] = useState<boolean>(false);
  const [showPass, setShowPass] = useState<boolean>(false);
  const [showConfPass, setShowConfPass] = useState<boolean>(false);
  const { register, control, handleSubmit, errors } = useForm({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: user?.email || '',
      github: user?.github || '',
      githubToken: null,
      notificationsOn: user?.notificationsOn || true,
      newPassword: '',
      oldPassword: '',
    },
  });

  const handleChangeSettings = (data: SettingsPayload) => {
    dispatch(changeSettings(data, closeDialog));
  };

  return (
    <form
      onSubmit={handleSubmit(handleChangeSettings)}
    >
      <br></br>
      <TextField
        inputRef={register}
        name="email"
        fullWidth
        type="text"
        label="New Email adress"
        variant="outlined"
        error={'email' in errors}
        helperText={'email' in errors ? errors.email?.message : ''}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <TitleIcon color="primary" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setEmailHelp((prevState) => !prevState)}
                size="small"
              >
                <HelpOutlineIcon color="primary" />
              </IconButton>
            
            </InputAdornment>
          )
        }}
      />

    {emailHelp && (
          <DemoCredsBox adminSignup={false} emailHelp={true}></DemoCredsBox>
        )}

  {user?.isAdmin? (
    <><TextField
          inputRef={register}
          className={classes.fieldMargin}
          name="github"
          fullWidth
          type="text"
          label="Github username"
          variant="outlined"
          error={'github' in errors}
          helperText={'github' in errors ? errors.github?.message : ''}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton
                  onClick={() => window.open('https://github.com/')}
                  size="small"
                >
                  <GitHubIcon color="primary" />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setGithubHelp((prevState) => !prevState)}
                  size="small"
                >
                  <HelpOutlineIcon color="primary" />
                </IconButton>

              </InputAdornment>
            )
          }} />
          {githubHelp && (
          <DemoCredsBox adminSignup={false} githubHelp={true}></DemoCredsBox>
        )}
        <TextField
            inputRef={register}
            className={classes.fieldMargin}
            name="githubToken"
            fullWidth
            type={showToken ? 'text' : 'password'}
            label="Github Personal Access Token"
            variant="outlined"
            error={'githubToken' in errors}
            helperText={'githubToken' in errors ? errors.githubToken?.message : ''}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    onClick={() => window.open('https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token#creating-a-token')}
                    size="small"
                  >
                    <VpnKeyIcon color="primary" />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                      onClick={() => setShowToken((prevState) => !prevState)}
                      size="small"
                    >
                      {showToken ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>

                  <IconButton
                    onClick={() => setGithubTokenHelp((prevState) => !prevState)}
                    size="small"
                  >
                    <HelpOutlineIcon color="primary" />
                  </IconButton>

                </InputAdornment>
              )
            }}
             />
             {githubTokenHelp && (
          <DemoCredsBox adminSignup={false} githubTokenHelp={true}></DemoCredsBox>
        )}</>
  ) : ''}
    

      <TextField
        className={classes.fieldMargin}
        inputRef={register}
        name="newPassword"
        fullWidth
        type={showPass ? 'text' : 'password'}
        label="New Password"
        variant="outlined"
        error={'newPassword' in errors}
        helperText={'newPassword' in errors ? errors.newPassword?.message : ''}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPass((prevState) => !prevState)}
                      size="small"
                    >
                      {showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
          ),
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon color="primary" />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        className={classes.fieldMargin}
        inputRef={register}
        name="oldPassword"
        fullWidth
        type={showConfPass ? 'text' : 'password'}
        label="Old Password"
        variant="outlined"
        error={'oldPassword' in errors}
        helperText={'oldPassword' in errors ? errors.oldPassword?.message : ''}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfPass((prevState) => !prevState)}
                      size="small"
                    >
                      {showConfPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
          ),
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon color="primary" />
            </InputAdornment>
          ),
        }}
      />

      <Controller
        control={control}
        name="notifications"
        as={
          <FormControl className={classes.radioGroupForm}>
            <RadioGroup row className={classes.radioGroup}>
              <FormLabel className={classes.radioGroupLabel}>
                Notifications (On/Off):
              </FormLabel>
              <div className={classes.formControlLabels}>
                <FormControlLabel
                  value="on"
                  control={<Radio color="primary" />}
                  label="On"
                />
                <FormControlLabel
                  value="off"
                  control={<Radio color="primary" />}
                  label="Off"
                />
              </div>
            </RadioGroup>
          </FormControl>
        }
      />
      
      <Button
        size="large"
        color="primary"
        variant="contained"
        fullWidth
        className={classes.submitBtn}
        type="submit"
        disabled={submitLoading}
      >
        Change Settings
      </Button>
      {submitError && (
        <ErrorBox
          errorMsg={submitError}
          clearErrorMsg={() => dispatch(clearSubmitBugError())}
        />
      )}
    </form>
  );
};

export default EmailForm;
