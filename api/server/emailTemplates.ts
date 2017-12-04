export default function () {
  //SETUP ACCOUNTS EMAIL TEMPLATES
  Accounts.emailTemplates.siteName = 'AwesomeSite';
  Accounts.emailTemplates.from = 'Stimulating Solutions <no-reply@stimulating-solutions.com>';
  Accounts.emailTemplates.enrollAccount.subject = (user) => {
    return `Welcome to Awesome Town, ${user.profile.name}`;
  };
  Accounts.emailTemplates.enrollAccount.text = (user, url) => {
    return 'You have been selected to participate in building a better future!'
      + ' To activate your account, simply click the link below:\n\n'
      + url;
  };
  Accounts.emailTemplates.resetPassword.from = () => {
    // Overrides the value set in `Accounts.emailTemplates.from` when resetting
    // passwords.
    return 'Stimulating Solutions Password Reset <no-reply@stimulating-solutions.com>';
  };
  Accounts.emailTemplates.verifyEmail = {
     subject() {
        return "Activate your account now!";
     },
     text(user, url) {
        return `Hey ${user}! Verify your e-mail by following this link: ${url}`;
     }
  };
}