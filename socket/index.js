var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var qs = require("query-string");
var cors = require("cors");
const OTP = [];
const users = [];

app.use(cors());

app.get("/", (req, res) => {
  res.end("dev");
});

app.get("/otp-status", (req, res) => {
  const email = req.query.email;
  let index = OTP.findIndex(
    (q) => q.user_email.toLowerCase() === email.toLowerCase()
  );
  if (index >= 0) {
    res.json({
      status: true,
      duration: OTP[index].duration,
      user_email: OTP[index].user_email,
    });
  } else {
    res.json({
      status: false,
    });
  }
});

function startCountDown(user) {
  let index = OTP.findIndex(
    (q) => q.user_email.toLowerCase() === user.user_email.toLowerCase()
  );
  if (index >= 0 && !OTP[index].countdown) {
    OTP[index].countdown = null;
    clearInterval(OTP[index].countdown);
    OTP[index].countdown = setInterval(() => {
      const otp = OTP[index];
      if (otp) {
        otp.duration -= 1000;
        if (otp.duration <= 0) {
          clearInterval(OTP[index].countdown);
          OTP.splice(index, 1);
        }
      }
    }, 1000);
  }
}

io.on("connection", (socket) => {
  console.log("test");
  socket.on("notification", (args) => {
    console.log(args);
  });

  socket.on("chat", (args) => {
    console.log("new message", args);
  });

  socket.on("otp", (args) => {
    let otpIndex = OTP.findIndex(
      (q) => q.user_email.toLowerCase() === args.user_email.toLowerCase()
    );
    if (otpIndex >= 0) {
      OTP[otpIndex] = args;
    } else {
      OTP.push(args);
    }
    startCountDown(args);
  });
});

setInterval(() => {
  console.log(
    OTP.map((q) => ({
      email: q.user_email,
      duration: q.duration,
    }))
  );
}, 1000);

http.listen(3001, () => {
  console.log("listening on *:80");
});
