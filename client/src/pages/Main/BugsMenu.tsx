import { useState } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteBug, closeReopenBug, selectAllAdmins } from '../../redux/slices/bugsSlice';
import { BugPayload } from '../../redux/types';
import ConfirmDialog from '../../components/ConfirmDialog';
import FormDialog from '../../components/FormDialog';
import BugForm from './BugForm';
import NoteForm from './NoteForm';

import { Menu, IconButton } from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import RedoIcon from '@material-ui/icons/Redo';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import CommentOutlinedIcon from '@material-ui/icons/CommentOutlined';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import AdminForm from './AdminForm';
import { selectAuthState } from '../../redux/slices/authSlice';

interface BugsMenuProps {
  bugId: string;
  currentData: BugPayload;
  isResolved: boolean;
  iconSize?: 'small' | 'default' | 'large';
  isAdmin: boolean | undefined;
}

const BugsMenu: React.FC<BugsMenuProps> = ({
  bugId,
  currentData,
  isResolved,
  iconSize,
  isAdmin,
}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const admins = useSelector(selectAllAdmins);
  const { user } = useSelector(selectAuthState);
  if (user) {admins.push(user);}

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleDeleteBug = () => {
    dispatch(deleteBug(bugId, history));
  };

  const handleCloseBug = () => {
    dispatch(closeReopenBug(bugId, 'close'));
  };

  const handleReopenBug = () => {
    dispatch(closeReopenBug(bugId, 'reopen'));
  };

  return (
    <div>
      <IconButton onClick={handleOpenMenu} size="small">
        <MoreHorizIcon color="primary" fontSize={iconSize || 'large'} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        marginThreshold={8}
        elevation={4}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <FormDialog
          triggerBtn={{
            type: 'menu',
            text: 'Leave A Note',
            icon: CommentOutlinedIcon,
            iconStyle: { marginRight: '10px' },
            closeMenu: handleCloseMenu,
          }}
          title="Post a note"
        >
          <NoteForm isReply={false} isEditMode={false} bugId={bugId} />
        </FormDialog>
          {isAdmin ? (
          <FormDialog
          triggerBtn={{
            type: 'menu',
            text: 'Update Bug',
            icon: EditOutlinedIcon,
            iconStyle: { marginRight: '10px' },
            closeMenu: handleCloseMenu,
          }}
          title="Edit the bug details"
        >
          <BugForm
            isEditMode={true}
            bugId={bugId}
            currentData={currentData}
          />
        </FormDialog>
          ): ''}
        {(isResolved && isAdmin) ? (
          <ConfirmDialog
            title="Re-open the Bug"
            contentText="Are you sure you want to re-open the bug?"
            actionBtnText="Re-open Bug"
            triggerBtn={{
              type: 'menu',
              text: 'Re-open Bug',
              icon: RedoIcon,
              iconStyle: { marginRight: '10px' },
              closeMenu: handleCloseMenu,
            }}
            actionFunc={handleReopenBug}
          />
        ) : '' }
        {(!isResolved && isAdmin) ? (
          <ConfirmDialog
            title="Close the Bug"
            contentText="Are you sure you want to close the bug?"
            actionBtnText="Close Bug"
            triggerBtn={{
              type: 'menu',
              text: 'Close Bug',
              icon: DoneOutlineIcon,
              iconStyle: { marginRight: '10px' },
              closeMenu: handleCloseMenu,
            }}
            actionFunc={handleCloseBug}
          />
        ) : '' }
        {isAdmin ? (
          <ConfirmDialog
            title="Confirm Delete Bug"
            contentText="Are you sure you want to permanently delete the bug?"
            actionBtnText="Delete Bug"
            triggerBtn={{
              type: 'menu',
              text: 'Delete Bug',
              icon: DeleteOutlineIcon,
              iconStyle: { marginRight: '10px' },
              closeMenu: handleCloseMenu,
            }}
            actionFunc={handleDeleteBug}
        />
        ) : ''}
        {isAdmin ? (
          <FormDialog
          triggerBtn={{
            type: 'menu',
            text: 'Assign bug',
            icon: ControlPointIcon,
            iconStyle: { marginRight: '10px' },
            closeMenu: handleCloseMenu,
          }}
          title="Assign the bug to specific admins"
        >
          <AdminForm
            editMode="assign"
            currentAdmins={admins.map((a) => a.id)}
            bugId={bugId}
          />
        </FormDialog>
        ) : '' }
      </Menu>
    </div>
  );
};

export default BugsMenu;
