
const SENDER = 'Narrative Structure <nsapp@stimulating-solutions.com>';

export default function () {
  //SETUP ACCOUNTS EMAIL TEMPLATES
  Accounts.emailTemplates.siteName = 'Narrative Structure';
  Accounts.emailTemplates.from = SENDER;
  Accounts.emailTemplates.enrollAccount = {
    subject(user) {
      return `Welcome to the NS app, ${user.profile.name}`;
    },
    text(user, url) {
      return 'You have been enrolled in the Narrative Structure app!'
        + ' To activate your account, please click the link below:\n\n'
        + url.replace('herokuapp', 'stimulating-solutions');
    }
  };
  Accounts.emailTemplates.resetPassword = {
    subject(user) {
      return `Your Narrative Structure password has been reset`;
    },
    text(user, url) {
      return `Hello ${user.profile.name},\n` +
        '\n' +
        'To reset your password, please click the link below.\n' +
        '\n' +
        url.replace('herokuapp', 'stimulating-solutions')+'\n' +
        '\n' +
        'Thanks!\n';
    }
  };
}
