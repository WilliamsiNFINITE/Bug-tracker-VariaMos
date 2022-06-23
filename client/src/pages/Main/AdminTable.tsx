import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthState } from '../../redux/slices/authSlice';
import ConfirmDialog from '../../components/ConfirmDialog';

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from '@material-ui/core';
import { useTableStyles } from '../../styles/muiStyles';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import BlockIcon from '@material-ui/icons/Block';
import { removeAdmin } from '../../redux/slices/usersSlice';
import { User } from '../../redux/types';

const adminHeaders = ['Username'];

const AdminsTable: React.FC<{
  admins: User[];
  isMobile: boolean;
}> = ({ admins, isMobile }) => {
  const classes = useTableStyles();
  const dispatch = useDispatch();
  const { user } = useSelector(selectAuthState);

  const isAdmin = user?.isAdmin;

  const handleRemoveAdmin = (adminId: string) => {
    dispatch(removeAdmin(adminId));
  };

  return (
    <Paper className={classes.scrollableTable}>
      <Table stickyHeader size={isMobile ? 'small' : 'medium'}>
        <TableHead>
          <TableRow>
            {adminHeaders.map((a) => (
              <TableCell key={a} align="center">
                {a}
              </TableCell>
            ))}
            {isAdmin && <TableCell align="center">Remove</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {admins.map((a) => (
            <TableRow key={a.id}>
              <TableCell align="center">
                {a.username} {a.id === user?.id && '(You)'}
              </TableCell>
              {isAdmin && (
                <TableCell align="center">
                  {a.id === user?.id ? (
                    <BlockIcon
                      color="secondary"
                      fontSize={isMobile ? 'default' : 'large'}
                    />
                  ) : (
                    <ConfirmDialog
                      title="Confirm Remove Admin"
                      contentText={`Are you sure you want to remove ${a.username} from the admin team?`}
                      actionBtnText="Remove Admin"
                      triggerBtn={{
                        type: 'icon',
                        iconSize: isMobile ? 'default' : 'large',
                        icon: HighlightOffIcon,
                        size: 'small',
                      }}
                      actionFunc={() => handleRemoveAdmin(a.id)}
                    />
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default AdminsTable;
