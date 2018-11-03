import Sendgrid from 'sendgrid';

class Client {
  constructor(apiKey) {
    this.sg = new Sendgrid(apiKey);
  }

  async sendEmail({ from, to, subject, body }) {
    const req = this.sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: {
        personalizations: [{ to: [{ email: to }], subject }],
        from: { email: from },
        content: [{ type: 'text/plain', value: body }],
      },
    });

    try {
      const { statusCode, body, headers } = await this.sg.API(req);
    } catch (err) {}
  }
}

export default Client;
