var nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const allowedOrigins = [
  "http://localhost:5173",
  "https://mtnstreamenergy.com",
  "http://mtnstreamenergy.com",
  "https://www.mtnstreamenergy.com",
  "http://www.mtnstreamenergy.com",
];

export const handler = async (event) => {
  console.log("reached handler function");
  const origin = event.headers.origin;

  const headers = {
    "Access-Control-Allow-Origin": allowedOrigins.includes(origin)
      ? origin
      : "",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (event.httpMethod === "OPTIONS") {
    // Handle preflight request
    console.log("inside preflight request");
    return {
      statusCode: 200,
      headers,
    };
  }

  try {
    const data = JSON.parse(event.body);

    const { firstName, lastName, email, number, company, message } = data;

    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_BOT,
        pass: process.env.APP_PASS,
      },
    });

    var mailOptions = {
      from: process.env.EMAIL_BOT,
      to: process.env.COMPANY_EMAIL,
      subject: "Land services inquiry",
      text: `\nEmail from: ${email}\n\nName: ${firstName} ${lastName}\n\nPhone number: ${number}\n\nCompany: ${company}\n\nMessage: ${message}`,
    };

    console.log("Preparing to send email...");
    await new Promise((resolve, reject) => {
      console.log("inside promise");
      transporter.sendMail(mailOptions, (error, info) => {
        console.log("inside callback function");

        if (error) {
          console.log("SendMail Error:", error);
          reject(error);
        } else {
          console.log("Email sent successfully:", info.response);
          resolve(info);
        }
      });
    });
    console.log("SendMail function executed.");
    // Return success response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Email sent successfully" }),
    };
  } catch (error) {
    console.error("Error: ", error);
    // Return error response
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
