import { useDispatch, useSelector } from 'react-redux';
import FilterBar from '../../components/FilterBar';
import SortBar from '../../components/SortBar';
import FormDialog from '../../components/FormDialog';
import BugForm from './BugForm';/*
import AdminForm from './AdminForm';*/
import { BugSortValues, BugFilterValues } from '../../redux/types';
import {
  sortBugsBy,
  filterBugsBy,
  selectBugsState,
  selectAllAdmins,
} from '../../redux/slices/bugsSlice';

import {
  RadioGroup,
  Radio,
  FormControl,
  FormControlLabel,
  FormLabel,
  Button,
} from '@material-ui/core';
import { useActionCardStyles } from '../../styles/muiStyles';
import AddIcon from '@material-ui/icons/Add';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { selectAuthState } from '../../redux/slices/authSlice';
import AdminForm from './AdminForm';
import { useState } from 'react';
import AdminsCard from './AdminsCard';

const menuItems = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'a-z', label: 'Title (A - Z)' },
  { value: 'z-a', label: 'Title (Z - A)' },
  { value: 'h-l', label: 'Priority (High - Low)' },
  { value: 'l-h', label: 'Priority (Low - High)' },
  { value: 'closed', label: 'Recently Closed' },
  { value: 'reopened', label: 'Recently Re-opened' },
  { value: 'updated', label: 'Recently Updated' },
  { value: 'most-notes', label: 'Most Notes' },
  { value: 'least-notes', label: 'Least Notes' },
];

const BugsActionCard: React.FC<{

  filterValue: string;
  setFilterValue: (filterValue: string) => void;
  isMobile: boolean;
}> = ({ filterValue, setFilterValue, isMobile }) => {
  const classes = useActionCardStyles();
  const dispatch = useDispatch();
  const { sortBy, filterBy } = useSelector(selectBugsState);
  const admins = useSelector(selectAllAdmins);
  const { user } = useSelector(selectAuthState);
  const isAdmin = user?.isAdmin;
  const [viewAdmins, setViewAdmins] = useState(false);
  const handleSortChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const selectedValue = e.target.value as BugSortValues;
    dispatch(sortBugsBy(selectedValue));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = e.target.value as BugFilterValues;
    dispatch(filterBugsBy(selectedValue));
  };

  return (
    <div>
      <div className={classes.inputs}>
        <div className={classes.searchBarWrapper}>
          <FilterBar
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            label="Bugs"
            size={isMobile ? 'small' : 'medium'}
          />
        </div>
        <div className={classes.sortBarWrapper}>
          <SortBar
            sortBy={sortBy}
            handleSortChange={handleSortChange}
            menuItems={menuItems}
            label="Bugs"
            size={isMobile ? 'small' : 'medium'}
          />
        </div>
      </div>
      <div className={classes.flexWrapper}>
        <FormDialog
          triggerBtn={
            isMobile
              ? {
                  type: 'fab',
                  variant: 'extended',
                  text: 'Bug',
                  icon: AddIcon,
                }
              : {
                  type: 'normal',
                  text: 'Add Bug',
                  icon: AddIcon,
                  size: 'large',
                }
          }
          title="Add a new bug"
        >
          <BugForm isEditMode={false} />
        </FormDialog>

        {isAdmin ? (
        <FormDialog
          triggerBtn={{
            type: isMobile ? 'round' : 'normal',
            text: 'Add Administrators',
            icon: AddIcon,
            size: 'large',
            style: isMobile ? { marginRight: '0em' } : { marginRight: '1em' },
          }}
          title="Add administrator(s)"
        >
          <AdminForm
            editMode="admin"
            currentAdmins={admins.map((a) => a.id)}
          />
        </FormDialog>
        ) : '' }

        {isAdmin ? (
        <Button
          color="secondary"
          variant="outlined"
          startIcon={viewAdmins ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          onClick={() => setViewAdmins(!viewAdmins)}
          size= 'large'
          style={{ marginRight: '1em' }}
        >
          {viewAdmins ? 'Hide Admins' : 'View Admins'}
          
        </Button>
        ) : '' }   



     


        <FormControl component="fieldset">
          <FormLabel component="legend" style={{ fontSize: '0.8em' }}>
            Filter Bugs By
          </FormLabel>
          <RadioGroup row value={filterBy} onChange={handleFilterChange}>
            <FormControlLabel
              value="all"
              control={<Radio color="primary" />}
              label="All"
            />
            <FormControlLabel
              value="closed"
              control={<Radio color="primary" />}
              label="Closed"
            />
            <FormControlLabel
              value="open"
              control={<Radio color="primary" />}
              label="Open"
            />
          </RadioGroup>
        </FormControl>
      </div>
      {admins.length > 1 && (
          <AdminsCard
          admins={ admins }
          viewAdmins={ viewAdmins}
          isMobile={ isMobile }
          />
      )}
    </div>
  );
};

export default BugsActionCard;
