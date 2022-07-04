import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectBugsById,
  deleteBug,
  closeReopenBug,
  selectAllAdmins,
} from '../../redux/slices/bugsSlice';
import { RootState } from '../../redux/store';
import FormDialog from '../../components/FormDialog';
import BugForm from './BugForm';
import ConfirmDialog from '../../components/ConfirmDialog';
import NotesCard from './NotesCard';
import { formatDateTime } from '../../utils/helperFuncs';
import { priorityStyles, statusStyles } from '../../styles/customStyles';
import CSS from 'csstype';

import { Paper, Typography, Divider, useMediaQuery } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { useMainPageStyles } from '../../styles/muiStyles';
import RedoIcon from '@material-ui/icons/Redo';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { selectAuthState } from '../../redux/slices/authSlice';
import AdminForm from './AdminForm';

interface ParamTypes {
  bugId: string;
}

const BugsDetailsPage = () => {
  const classes = useMainPageStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { bugId } = useParams<ParamTypes>();
  const history = useHistory();
  const dispatch = useDispatch();
  const bug = useSelector((state: RootState) =>
    selectBugsById(state, bugId)
  );
  const { user } = useSelector(selectAuthState);
  const admins = useSelector(selectAllAdmins);
  
  if (!bug) {
    return (
      <div className={classes.root}>
        <Paper className={classes.notFoundPaper}>
          <Typography
            variant="h6"
            color="secondary"
            className={classes.error404Text}
            style={{ marginTop: '5em' }}
          >
            404: Bug Not Found!
          </Typography>
        </Paper>
      </div>
    );
  }

  const {
    id,
    title,
    description,
    priority,
    isResolved,
    createdBy,
    createdAt,
    updatedBy,
    updatedAt,
    closedBy,
    closedAt,
    reopenedBy,
    reopenedAt,
    notes,
    assignments,
  } = bug;

  const handleDeleteBug = () => {
    dispatch(deleteBug(bugId, history));
  };

  const handleCloseBug = () => {
    dispatch(closeReopenBug(bugId, 'close'));
  };

  const handleReopenBug = () => {
    dispatch(closeReopenBug(bugId, 'reopen'));
  };

  const statusCSS: CSS.Properties = {
    ...statusStyles(isResolved),
    display: 'inline',
    padding: '0.20em 0.4em',
  };

  const statusInfo = () => {
    if (!isResolved && reopenedAt && reopenedBy) {
      return (
        <span>
          <div style={statusCSS}>Re-opened</div> -{' '}
          <em>{formatDateTime(reopenedAt)}</em> ~{' '}
          <strong>{reopenedBy.username}</strong>
        </span>
      );
    } else if (isResolved && closedAt && closedBy) {
      return (
        <span>
          <div style={statusCSS}>Closed</div> -{' '}
          <em>{formatDateTime(closedAt)}</em> ~{' '}
          <strong>{closedBy.username}</strong>
        </span>
      );
    } else {
      return <div style={statusCSS}>Open</div>;
    }
  };

  const closeReopenBtns = () => {
    if (isResolved) {
      return (
        <ConfirmDialog
          title="Re-open the Bug"
          contentText="Are you sure you want to re-open the bug?"
          actionBtnText="Re-open Bug"
          triggerBtn={{
            type: isMobile ? 'round' : 'normal',
            text: 'Re-open Bug',
            icon: RedoIcon,
          }}
          actionFunc={handleReopenBug}
        />
      );
    } else {
      return (
        <ConfirmDialog
          title="Close the Bug"
          contentText="Are you sure you want to close the bug?"
          actionBtnText="Close Bug"
          triggerBtn={{
            type: isMobile ? 'round' : 'normal',
            text: 'Close Bug',
            icon: DoneOutlineIcon,
          }}
          actionFunc={handleCloseBug}
        />
      );
    }
  };

  const updateBugBtn = () => {
    return (
      <FormDialog
        triggerBtn={{
          type: isMobile ? 'round' : 'normal',
          text: 'Update Bug Info',
          icon: EditOutlinedIcon,
          style: { marginLeft: '1em' },
        }}
        title="Edit the bug details"
      >
        <BugForm
          isEditMode={true}
          bugId={id}
          currentData={{ title, description, priority }}
        />
      </FormDialog>
    );
  };

  const deleteBugBtn = () => {
    return (
      <ConfirmDialog
        title="Confirm Delete Bug"
        contentText="Are you sure you want to permanently delete the bug?"
        actionBtnText="Delete Bug"
        triggerBtn={{
          type: isMobile ? 'round' : 'normal',
          text: 'Delete Bug',
          icon: DeleteOutlineIcon,
          style: { marginLeft: '1em' },
        }}
        actionFunc={handleDeleteBug}
      />
    );
  };

  const assignBugBtn = () => {
    return (
      <FormDialog
        triggerBtn={{
          type: isMobile ? 'round' : 'normal',
          text: 'Assign bug',
          icon: EditOutlinedIcon,
          style: { marginLeft: '1em' },
        }}
        title="Assign the bug to specific admin(s)"
      >
        <AdminForm
          editMode="assign"
          currentAdmins={admins.map((a) => a.id)}
          bugId={bugId}
        />
      </FormDialog>
    );
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.detailsHeader}>
        <Typography variant={isMobile ? 'h5' : 'h4'} color="secondary">
          <strong>{title}</strong>
        </Typography>
        <Divider style={{ margin: '0.5em 0' }} />
        <Typography color="secondary" variant="h6">
          {description}
        </Typography>
        <Typography
          color="secondary"
          variant="subtitle2"
          className={classes.marginText}
        >
          Status: {statusInfo()}
        </Typography>
        <Typography
          color="secondary"
          variant="subtitle2"
          className={classes.marginText}
        >
          Priority:{' '}
          <div
            style={{
              ...priorityStyles(priority),
              display: 'inline',
              padding: '0.20em 0.4em',
              textTransform: 'capitalize',
            }}
          >
            {priority}
          </div>
        </Typography>
        <Typography color="secondary" variant="subtitle2">
          Created: <em>{formatDateTime(createdAt)}</em> ~{' '}
          <strong>{createdBy.username}</strong>
        </Typography>
        {updatedBy && updatedAt && (
          <Typography color="secondary" variant="subtitle2">
            Updated: <em>{formatDateTime(updatedAt)}</em> ~{' '}
            <strong>{updatedBy.username}</strong>
          </Typography>
        )}
        {user?.isAdmin ? (
        <div className={classes.btnsWrapper}>
          {closeReopenBtns()}
          {updateBugBtn()}
          {deleteBugBtn()}
          {assignBugBtn()}
        </div>
        ) : '' }
      </Paper>
      <NotesCard
        notes={notes}
        bugId={id}
        isMobile={isMobile}
      />
    </div>
  );
};

export default BugsDetailsPage;
