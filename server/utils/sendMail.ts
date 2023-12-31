import nodemailer, { Transporter } from "nodemailer";
import ejs from "ejs";
import path from "path";

type UserData = {
  user: {
    name: string;
  };
  activationCode: string;
};

type CourseData = {
  name: string;
  title: string;
};

type OrderData = {
  order: {
    _id: string;
    name: string;
    price: number;
    date: string;
  };
};

type EmailData = UserData | CourseData | OrderData;

interface IEmailOptions {
  email: string;
  subject: string;
  template: string;
  data: EmailData;
}

const sendMail = async (options: IEmailOptions): Promise<void> => {
  const transpoter: Transporter = nodemailer.createTransport({
    host: process.env.SMPT_HOST,
    port: parseInt(process.env.SMPT_PORT || "587"),
    service: process.env.SMPT_SERVICE,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });

  const { email, subject, template, data } = options;

  // get the path to the email template file
  const templatePath = path.join(__dirname, "../mails", template);

  // Render the email template with EJS
  const html: string = await ejs.renderFile(templatePath, data);

  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: email,
    subject,
    html,
  };

  await transpoter.sendMail(mailOptions);
};

export default sendMail;
