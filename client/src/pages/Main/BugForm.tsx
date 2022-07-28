import { useForm, Controller } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import {
  createNewBug,
  editBug,
  clearSubmitBugError,
  selectBugsState,
} from '../../redux/slices/bugsSlice';
import { BugPayload } from '../../redux/types';
import ErrorBox from '../../components/ErrorBox';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import backendUrl from '../../backendUrl';
import {
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  Button,
  InputAdornment,
  FormLabel,
  FormControl,
  Input,
  Container,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Chip,
} from '@material-ui/core';
import { useFormStyles } from '../../styles/muiStyles';
import GroupIcon from '@material-ui/icons/Group';
import TitleIcon from '@material-ui/icons/Title';
import SubjectIcon from '@material-ui/icons/Subject';
import React, { useState } from 'react';
import { Autocomplete } from '@material-ui/lab';
import { SemanticClassificationFormat } from 'typescript';

const validationSchema = yup.object({
  title: yup
    .string()
    .required('Required')
    .min(3, 'Must be at least 3 characters')
    .max(60, 'Must be at most 60 characters'),

  description: yup.string().required('Required'),
  class: yup.string()
});

interface BugFormProps {
  closeDialog?: () => void;
  isEditMode: boolean;
  currentData?: BugPayload;
  bugId?: string;
}

const BugForm: React.FC<BugFormProps> = ({
  closeDialog,
  isEditMode,
  currentData,
  bugId,
}) => {
  const classes = useFormStyles();
  const dispatch = useDispatch();
  const { submitError, submitLoading } = useSelector(selectBugsState);
  const [bugCategory, setBugCategory] = useState<string>('');

  // If you want to add a BugClass, add it to the following list
  const BugCategories = [
  "App Architecture",
  "Security Issue",
  "Performance Issue", 
  "Feature Models",
  "TestRequirements Models",
  "Components Models",
  "DomainSecurityRequirements Models",
  "SecurityRequirements Models",
  "istar Models",
  "UI Components Models",
  "Adaptive AML Models",
  "UI Variability Models"
  ];

  const { register, control, handleSubmit, errors } = useForm({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: currentData?.title || '',
      description: currentData?.description || '',
      priority: currentData?.priority || 'low',
      class: bugCategory || '',
    },
  });

  const handleClassChange = (e: any) => {
    const selectedValue = e.target.innerText;
    setBugCategory(selectedValue);
  };

  const handleCreateBug = async (data: BugPayload) => {
    imageForm?.submit();
    dispatch(createNewBug(data, bugCategory, closeDialog));  
  };

  const handleUpdateBug = (data: BugPayload) => {
    //imageForm?.submit();
    if (typeof(bugId) === "string") {
      dispatch(editBug(bugId, data, bugCategory, closeDialog));
    }
  };

  const imageForm = document.getElementById("image-form") as HTMLFormElement;

  return (

    <><form id="image-form" method="POST" action={backendUrl + '/bugs/upload'} encType="multipart/form-data">
      <input type="file" name='image' accept="image/*, video/*"></input>
    </form>
    <br></br>
    <form
      onSubmit={handleSubmit(isEditMode ? handleUpdateBug : handleCreateBug)}
    >
        <TextField
          inputRef={register}
          name="title"
          required
          fullWidth
          type="text"
          label="Bug Title"
          variant="outlined"
          error={'title' in errors}
          helperText={'title' in errors ? errors.title?.message : ''}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <TitleIcon color="primary" />
              </InputAdornment>
            ),
          }} />
        <TextField
          className={classes.fieldMargin}
          multiline
          rows={1}
          rowsMax={4}
          inputRef={register}
          name="description"
          required
          fullWidth
          type="text"
          label="Description"
          variant="outlined"
          error={'description' in errors}
          helperText={'description' in errors ? errors.description?.message : ''}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SubjectIcon color="primary" />
              </InputAdornment>
            ),
          }} />
          
          <Autocomplete
              style={{ marginTop: 20 }}
              filterSelectedOptions
              onChange={handleClassChange}
              options={
                  BugCategories
              }
              getOptionLabel={(option) => option}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Class (optional)"
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
                />
              )}
              renderOption={(option) => (
                <ListItem dense component="div">
                  <ListItemAvatar>
                    <Avatar className={classes.avatar}>
                      {option.slice(0, 1)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={option}
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
                    avatar={<Avatar>{option.slice(0, 1)}</Avatar>}
                    color="secondary"
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
            />
        <Controller
          control={control}
          name="priority"
          as={<FormControl className={classes.radioGroupForm}>
            <RadioGroup row defaultValue="low" className={classes.radioGroup}>
              <FormLabel className={classes.radioGroupLabel}>
                Priority:
              </FormLabel>
              <div className={classes.formControlLabels}>
                <FormControlLabel
                  value="low"
                  control={<Radio color="primary" />}
                  label="Low" />
                <FormControlLabel
                  value="medium"
                  control={<Radio color="primary" />}
                  label="Medium" />
                <FormControlLabel
                  value="high"
                  control={<Radio color="primary" />}
                  label="High" />
              </div>
            </RadioGroup>
          </FormControl>} />

          
        <Button
          size="large"
          color="primary"
          variant="contained"
          fullWidth
          className={classes.submitBtn}
          type="submit"
          disabled={submitLoading}
        >
          {isEditMode ? 'Update Bug' : 'Create New Bug'}
        </Button>
        {submitError && (
          <ErrorBox
            errorMsg={submitError}
            clearErrorMsg={() => dispatch(clearSubmitBugError())} />
        )}
      </form></>

  );
};

export default BugForm;
