import { Alert, AlertTitle } from '@material-ui/lab';
import demoCreds from '../data/demoCreds';

const DemoCredsBox: React.FC<{
  adminSignup: boolean;
  }> = ({ adminSignup })  => {
  if (adminSignup === true) {
    return (
      <div style={{ width: '100%', marginTop: '0.8em', marginBottom: '0.8em' }}>
      <Alert severity="info">
        <AlertTitle>VariaMos Bug Tracker</AlertTitle>
        Please enter your invitation code.
      </Alert>
    </div>
    )
  }
  else {
  return (
    <div style={{ width: '100%', marginTop: '0.8em', marginBottom: '0.8em' }}>
      <Alert severity="info">
        <AlertTitle>VariaMos Bug Tracker</AlertTitle>
        Thank you for your help !
      </Alert>
    </div>
  );
  }
};

export default DemoCredsBox;
