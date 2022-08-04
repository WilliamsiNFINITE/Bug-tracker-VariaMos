import { Alert, AlertTitle } from '@material-ui/lab';

const DemoCredsBox: React.FC<{
  adminSignup: boolean;
  githubHelp?: boolean;
  emailHelp?: boolean;
  }> = ({ adminSignup, githubHelp, emailHelp })  => {
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
  else if (githubHelp === true) {
    return (
      <div style={{ width: '100%', marginTop: '0.8em', marginBottom: '0.8em' }}>
        <Alert severity="info">
          <AlertTitle>Github Username Help</AlertTitle>
          If you have permissions on the VariaMos Github repository, whenever a bug is assigned to you here it will also be asigned to you on Github Issues.
        </Alert>
      </div>
    );
  }
  else if (emailHelp === true) {
    return (
      <div style={{ width: '100%', marginTop: '0.8em', marginBottom: '0.8em' }}>
        <Alert severity="info">
          <AlertTitle>Email Help</AlertTitle>
          If you have notifications on you will receive an email whenever a bug is assigned to you or when someone replies to one of your messages.
        </Alert>
      </div>  
    )}  
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
