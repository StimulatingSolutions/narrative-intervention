export default function () {
  //SETUP ACCOUNTS EMAIL TEMPLATES
  Accounts.emailTemplates.siteName = 'Narrative Structure';
  Accounts.emailTemplates.from = 'Narrative Structure <nsapp@stimulating-solutions.com>';
  Accounts.emailTemplates.enrollAccount.subject = (user) => {
    return `Welcome to the NS app, ${user.profile.name}`;
  };
  Accounts.emailTemplates.enrollAccount.text = (user, url) => {
    return 'You have been enrolled in the Narrative Structure app!'
      + ' To activate your account, simply click the link below:\n\n'
      + url.replace('herokuapp', 'stimulating-solutions');
  };
  Accounts.emailTemplates.resetPassword.subject = () => {
    return `Your Narrative Structure password has been reset`;
  };
  Accounts.emailTemplates.resetPassword.from = () => {
    // Overrides the value set in `Accounts.emailTemplates.from` when resetting
    // passwords.
    return 'NS Password Reset <nsapp@stimulating-solutions.com>';
  };
  Accounts.emailTemplates.verifyEmail = {
     subject() {
        return "Activate your account now!";
     },
     text(user, url) {
        return `Hey ${user}! Verify your e-mail by following this link: ${url.replace('herokuapp', 'stimulating-solutions')}`;
     }
  };
}
