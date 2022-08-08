import { Alert, AlertTitle } from '@material-ui/lab';

const DemoCredsBox: React.FC<{
  adminSignup: boolean;
  githubHelp?: boolean;
  emailHelp?: boolean;
  descriptionHelp?: boolean;
  classHelp?: boolean;
  imageHelp?: boolean;
  JSONHelp?: boolean;
  }> = ({ adminSignup, githubHelp, emailHelp, descriptionHelp, classHelp, imageHelp, JSONHelp })  => {
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
          <AlertTitle>Why should I enter my Github username ?</AlertTitle>
          If you have permissions on the VariaMos Github repository, whenever a bug is assigned to you here it will also be asigned to you on Github Issues.
        </Alert>
      </div>
    );
  }
  else if (emailHelp === true) {
    return (
      <div style={{ width: '100%', marginTop: '0.8em', marginBottom: '0.8em' }}>
        <Alert severity="info">
          <AlertTitle>What is my email for ?</AlertTitle>
          If you have notifications on you will receive an email whenever someone replies to one of your messages.
          If you are an administrator you will also receive one whenever a bug is assigned to you.
        </Alert>
      </div>  
    )}  
  else if (descriptionHelp === true) {
    return (
      <div style={{ width: '100%', marginTop: '0.8em', marginBottom: '0.8em' }}>
        <Alert severity="info">
          <AlertTitle>How long should my description be ?</AlertTitle>
          Please describe precisely your issue and explain the steps to reproduce it.
          The more information we get, the easier the bug will be to solve.
        </Alert>
      </div>  
    )}
  else if (imageHelp === true) {
    return (
      <div style={{ width: '100%', marginTop: '0.8em', marginBottom: '0.8em' }}>
        <Alert severity="info">
          <AlertTitle>Why upload an image/video ?</AlertTitle>
          This is optional.
          You can add an image or a video to help us understand your issue.
          Having one usually helps a lot.
        </Alert>
      </div>  
    )} 
  else if (JSONHelp === true) {
    return (
      <div style={{ width: '100%', marginTop: '0.8em', marginBottom: '0.8em' }}>
        <Alert severity="info">
          <AlertTitle>Why upload a JSON file ?</AlertTitle>
          This is optional.
          You can add the JSON file corresponding to your VariaMos project if it is related to your issue.
          It can help us to reproduce it and understand/solve it faster.
        </Alert>
      </div>  
    )}
  else if (classHelp === true) {
    return (
      <div style={{ width: '100%', marginTop: '0.8em', marginBottom: '0.8em' }}>
        <Alert severity="info">
          <AlertTitle>What is this ?</AlertTitle>
          This is optional. If your issue is related to a specific VariaMos language or bug type please select it from the list.
          If you do not know which one to choose, leave this field empty. 
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
