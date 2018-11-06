import sgMail from '@sendgrid/mail';

export const sendgrid = {
  setApiKey(apiKey) {
    sgMail.setApiKey(apiKey);
  },

  sendEmail({ to, from, subject, text, html }) {
    sgMail.send({ to, from, subject, text, html });
  },
};
