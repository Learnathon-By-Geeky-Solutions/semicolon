const { MailtrapClient } = require("mailtrap");
import dotenv from "dotenv";
dotenv.config();

const TOKEN = process.env.MAILTRAP_TOKEN;
const ENDPOINT = process.env.MAILTRAP_ENDPOINT;

const client = new MailtrapClient({
  endpoint: ENDPOINT,
  token: TOKEN,
});

const sender = {
  email: "hello@demomailtrap.com",
  name: "HELLO, test from mochi",
};
const recipients = [
  {
    email: "mehreenhossain@iut-dhaka.edu",
  }
];

client
  .send({
    from: sender,
    to: recipients,
    subject: "You are awesome!",
    text: "Congrats for sending test email with Mailtrap!",
    category: "Integration Test",
})
.then(console.log, console.error);