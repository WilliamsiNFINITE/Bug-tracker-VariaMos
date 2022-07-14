import React, { useState } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { BugState, UserState } from '../../redux/types';
import BugsMenu from './BugsMenu';
import { formatDateTime } from '../../utils/helperFuncs';
import { priorityStyles, statusStyles } from '../../styles/customStyles';

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Link,
  Paper,
} from '@material-ui/core';
import { useTableStyles } from '../../styles/muiStyles';
import BugCard from './BugCard';

const tableHeaders = [
  'Title',
  'Priority',
  'Status',
  'Added',
  'Updated',
  'Notes',
  'Actions',
];

const BugsTable: React.FC<{ bugs: BugState[], user: UserState | null }> = ({ bugs, user }) => {
  const classes = useTableStyles();
  const history = useHistory();
  const [viewBug, setViewBug] = useState(false);
  const [bugId, setBugId] = useState('');

  const actionsOnClick = (bugId: string) => {
    //history.push(`/bugs/${bugId}`);
    setViewBug(!viewBug);
    setBugId(bugId);
  }

  return (
    <Paper className={classes.table}>
      <Table>
        <TableHead>
          <TableRow>
            {tableHeaders.map((t) => (
              <TableCell key={t} align="center">
                {t}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {bugs.map((b) => (
            <TableRow key={b.id}>
              <TableCell
                align="center"
                onClick={() =>
                  actionsOnClick(b.id)
                }
                className={classes.clickableCell}
              >
                {/*<Link
                  component={RouterLink}
                  to={`/bugs/${b.id}`}
                  color="secondary"
              >
                  {b.title}
              </Link>*/}
              {b.title}
              </TableCell>
              
              <TableCell align="center">
                <div
                  style={{
                    ...priorityStyles(b.priority),
                    textTransform: 'capitalize',
                    margin: '0 auto',
                  }}
                >
                  {b.priority}
                </div>
              </TableCell>
              <TableCell align="center">
                <div
                  style={{
                    ...statusStyles(b.isResolved),
                    margin: '0 auto',
                  }}
                >
                  {b.isResolved ? 'Closed' : 'Open'}
                </div>
              </TableCell>
              <TableCell align="center">
                {formatDateTime(b.createdAt)} ~ {b.createdBy.username}
              </TableCell>
              <TableCell align="center">
                {!b.updatedAt || !b.updatedBy
                  ? 'n/a'
                  : `${formatDateTime(b.updatedAt)} ~ ${b.updatedBy.username}`}
              </TableCell>
              <TableCell align="center">{b.notes.length}</TableCell>
              <TableCell align="center">
                <BugsMenu
                  bugId={b.id}
                  currentData={{
                    title: b.title,
                    description: b.description,
                    priority: b.priority,
                  }}
                  isResolved={b.isResolved}
                  isAdmin={user?.isAdmin}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <BugCard
        viewBug={ viewBug }
        bugId={ bugId }
       />              
    </Paper>

  );
};

export default BugsTable;
