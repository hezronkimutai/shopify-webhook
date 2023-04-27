import * as nodemailer from "nodemailer";

export async function mailer() {
  const {
    MAILER_HOSTNAME,
    MAILER_USERNAME,
    MAILER_PASSWORD,
    MAILER_TO,
    MAILER_FROM} = process.env;
    const hostname = MAILER_HOSTNAME;
    const username = MAILER_USERNAME;
    const password = MAILER_PASSWORD;


    const transporter = nodemailer.createTransport({
        host: hostname,
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: username,
            pass: password,
        },
        logger: true
    });

    console.log("Transport created")
    const info = await transporter.sendMail({
      from: MAILER_FROM,
      to: MAILER_TO,
      subject: "Shopify email notification",
      text: "Email notification",
      html: "<strong>Email notification</strong>",
      headers: { 'x-shopify': 'shopify header' }
  });
  console.log("Message sent: %s", info.response);
}
