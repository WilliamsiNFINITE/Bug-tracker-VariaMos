import React, { useState } from 'react';

import { Collapse } from '@material-ui/core';
import { useMainPageStyles } from '../../styles/muiStyles';
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined';
import BugsDetailsPage from './BugsDetailsPage';

const BugCard: React.FC<{
  viewBug: boolean;
  id: string;
  bugId: string;
}> = ({ viewBug, id, bugId }) => {
  const classes = useMainPageStyles();

  const BugDataToDisplay = () => {
    if (id === bugId) {
      return (
          <div style={{ marginTop: '1em' }}>
              <BugsDetailsPage
                  bugId={ bugId } 
              />
          </div>
        );
      }
    }


    return (
        <Collapse
            in={viewBug}
            timeout="auto"
            unmountOnExit
            className={classes.membersWrapper}
          >
            {BugDataToDisplay()}
        </Collapse>
      );

};

export default BugCard;
