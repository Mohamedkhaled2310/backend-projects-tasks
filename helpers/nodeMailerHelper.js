const nodeMailer = recuir('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  },
});

export const sendInviteEmail = async (to, projectName, inviteUrl) => {
  await transporter.sendMail({
    from: `"Project App" <${process.env.EMAIL_USER}>`,
    to,
    subject: `You're invited to join project "${projectName}"`,
    html: `
      <p>You have been invited to join the project <strong>${projectName}</strong>.</p>
      <p>Click <a href="${inviteUrl}">here</a> to accept the invitation.</p>
      <p>If you don’t have an account, you can register and automatically join the project.</p>
    `,
  });
};
