import { BugState, BugFilterValues } from '../redux/types';

const filterBugs = (filterBy: BugFilterValues, bug: BugState, userId: string | undefined) => {
  //console.log(bug)
  switch (filterBy) {
    case 'all':
      return true;
    case 'closed':
      console.log("BUG NOTES: ", bug.notes);
      console.log("BUG ASSIGNMENTS: ", bug.assignments);
      return bug.isResolved === true;
    case 'open':
      return bug.isResolved === false;
    case 'myBugs':
      const l = bug.assignments.length;
      for (let i = 0; i < l; i++) {
        if (bug.assignments[i].adminId === userId) {
          return true;
        }
      }
      return false;
  }
};

export default filterBugs;
