import React, { useEffect, useState } from 'react';
import FilterBar from '../../components/FilterBar';
import InfoText from '../../components/InfoText';

import { Typography, Collapse } from '@material-ui/core';
import { useMainPageStyles } from '../../styles/muiStyles';
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined';
import AdminsTable from './AdminTable';
import { User } from '../../redux/types';

const AdminsCard: React.FC<{
  admins: User[];
  viewAdmins: boolean;
  isMobile: boolean;
}> = ({ admins, viewAdmins, isMobile }) => {
  const classes = useMainPageStyles();
  const [filterValue, setFilterValue] = useState('');

  const filteredMembers = admins.filter((a) =>
    a.username.toLowerCase().includes(filterValue.toLowerCase())
  );

  const UsersDataToDisplay = () => {
    if (filteredMembers.length === 0) {
      return (
        <InfoText text="No matches found." variant={isMobile ? 'h6' : 'h5'} />
      );
    } else {
      return (
        <div style={{ marginTop: '1em' }}>
          <AdminsTable
            admins={filteredMembers}
            isMobile={isMobile}
          />
        </div>
      );
    }
  };

  return (
    <Collapse
      in={viewAdmins}
      timeout="auto"
      unmountOnExit
      className={classes.membersWrapper}
    >
      <div className={classes.flexInput}>
        <Typography
          variant={isMobile ? 'h6' : 'h5'}
          color="secondary"
          className={classes.flexHeader}
        >
          <PeopleAltOutlinedIcon
            fontSize={isMobile ? 'default' : 'large'}
            style={{ marginRight: '0.2em' }}
          />
          Other Admins
        </Typography>
        <div className={classes.filterMembersInput}>
          <FilterBar
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            label="Admins"
            size="small"
          />
        </div>
      </div>
      {UsersDataToDisplay()}
    </Collapse>
  );
};

export default AdminsCard;
