import { useForm, Controller } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import {
  clearSubmitBugError,
  selectBugsState,
} from '../../redux/slices/bugsSlice';
import { BugPayload, EmailPayload } from '../../redux/types';
import ErrorBox from '../../components/ErrorBox';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  Button,
  InputAdornment,
  FormLabel,
  FormControl,
} from '@material-ui/core';
import { useFormStyles } from '../../styles/muiStyles';
import TitleIcon from '@material-ui/icons/Title';
import SubjectIcon from '@material-ui/icons/Subject';
import { selectAuthState } from '../../redux/slices/authSlice';
import { changeSettings } from '../../redux/slices/usersSlice';

interface EmailFormProps {
  closeDialog?: () => void;
  emailExist: boolean;
  currentData?: EmailPayload;
}

const validationSchema = yup.object({
    email: yup
      .string()
  });

const EmailForm: React.FC<EmailFormProps> = ({
  closeDialog,
  emailExist,
  currentData,
}) => {

  const classes = useFormStyles();
  const dispatch = useDispatch();
  const { user } = useSelector(selectAuthState);
  const userId = user?.id;
  const { submitError, submitLoading } = useSelector(selectBugsState);
  const { register, control, handleSubmit, errors } = useForm({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: user?.email || '',
      notificationsOn: user?.notificationsOn || true,
    },
  });

  const handleChangeSettings = (data: EmailPayload) => {
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
