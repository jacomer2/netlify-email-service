var nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const allowedOrigins = ["http://localhost:5173", "https://mtnstreamenergy.com"];

export const handler = async (event) => {
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
    return {
      statusCode: 200,
      headers,
    };
  }
  //   app.post("/email", (req, res) => {
  try {
    const data = JSON.parse(event.body);

    const { firstName, lastName, email, number, company, message } = data;

    //   const { firstName, lastName, email, number, company, message } = req.body;

    // const firstName = "jacob";
    // const lastName = "comer";
    // const email = "jacomer2@yahoo.com";
    // const number = "4035043854";
    // const company = "nobody";
    // const message = "leasing services";

    var transporter = nodemailer.createTransport(
      {
        service: "gmail",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_BOT,
          pass: process.env.APP_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
      },
      {
        debug: true, // Enable debug output
        logger: true, // Log information
      }
    );

    var mailOptions = {
      from: process.env.EMAIL_BOT,
      to: process.env.COMPANY_EMAIL,
      subject: "Land services inquiry",
      text: `\nEmail from: ${email}\n\nName: ${firstName} ${lastName}\n\nPhone number: ${number}\n\nCompany: ${company}\n\nMessage: ${message}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

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
