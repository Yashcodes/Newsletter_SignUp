const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const port = 80;
const app = express();

app.use(express.static("static"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  let jsonData = JSON.stringify(data);

  const url = "https://us10.api.mailchimp.com/3.0/lists/65f3fa3cdf";

  const options = {
    method: "POST",
    auth: "yash81:bd43ad369aa04ee10d6adc92c7e88628-us10",
  };

  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || 80, () => {
  console.log("Server running on port " + port);
});

// API key
// bd43ad369aa04ee10d6adc92c7e88628-us10

// list id
// 65f3fa3cdf
