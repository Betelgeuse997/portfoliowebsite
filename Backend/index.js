const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3500;
const multiparty = require("multiparty");
require("dotenv").config();


app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'HTML_files')));

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });
  
  // verify connection configuration
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });
  
  app.post("/send", (req, res) => {
    let form = new multiparty.Form();
    let data = {};
    form.parse(req, function (err, fields) {
      Object.keys(fields).forEach(function (property) {
        data[property] = fields[property].toString();
      });
      console.log(data);
      const mail = {
        sender: `${data.name} <${data.email}>`,
        to: process.env.EMAIL, // receiver email,
        subject: "Mail from Portfolio Website",
        text: `${data.name} <${data.email}> \n${data.message}`,
      };
      transporter.sendMail(mail, (err, data) => {
        if (err) {
          console.log(err);
          res.status(500).send("Something went wrong.");
        } else {
          res.status(200).send("Email successfully sent to recipient!");
        }
      });
    });
  });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'HTML_files','home.html'));
})

app.get('/education', (req, res) => {
    res.sendFile(path.join(__dirname,'HTML_files','education.html'));
})

app.get('/skills', (req, res) => {
    res.sendFile(path.join(__dirname,'HTML_files','skills.html'));
})

app.get('/experience', (req, res) => {
    res.sendFile(path.join(__dirname,'HTML_files','experience.html'));
})

app.get('/projects', (req, res) => {
    res.sendFile(path.join(__dirname,'HTML_files','projects.html'));
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

