import { Alert, AlertTitle } from '@material-ui/lab';
import demoCreds from '../data/demoCreds';

const DemoCredsBox = () => {
  return (
    <div style={{ width: '100%', marginTop: '0.8em', marginBottom: '0.8em' }}>
      <Alert severity="info">
        <AlertTitle>VariaMos Bug Tracker</AlertTitle>
        Login to report your issue
      </Alert>
    </div>
  );
};

export default DemoCredsBox;
