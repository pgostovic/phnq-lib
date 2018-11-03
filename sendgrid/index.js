import Client from './client';

export default class SendgridClient extends Client {
  sendEmail({ from, to, subject, body }) {
    return super.sendEmail({ from, to, subject, body });
  }
}
