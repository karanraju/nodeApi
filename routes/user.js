const express = require("express");
const app = express();
// const image = express();
app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
const Joi = require("joi");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const secretKey = "secretKey";
const router = express.Router();
const multer = require("multer");
// const path = require("path");
// const upload = multer({ dest:"uploads/" });
//  const upload = multer({ dest: "./routes/image/" });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-&${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

// const storage=multer.diskStorage({
//   destination:"./routers/images",
//   filename:(req,file,cb)=>{
//     return cb(null,`$(file.filename)_${Date.now()${path.extrme}}`)
//   }
// })

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  // port: 3307,
  database: "TWILIOMYSQL",
});

router.post("/upload", upload.single("profileImage"), function (req, res) {
  // req.file is the name of your file in the form above, here 'uploaded_file'
  // req.body will hold the text fields, if there were any
  console.log(req.file, req.body.name);
  res.send(req.file);
  // return res.redirect("/");
});

router.get("/message", (req, res) => {
  console.log("Show some messages or whatever...");
  res.end();
});

router.get("/createsiginUptable", (req, res) => {
  let sql =
    "Create Table siginUptable(Name VARCHAR(255), Email VARCHAR(255),PhoneNumber VARCHAR(255),Password VARCHAR(255),ConfirmPassword VARCHAR(255),Image VARCHAR(255))";
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log("result");
    res.send("signupTable created");
  });
});

router.post("/api/signUp", upload.single("profileImage"), (req, res) => {
  const schema = {
    name: Joi.string().min(3).required(),
    email: Joi.string().min(3).required(),
    password: Joi.string().min(3).required(),
    confirmPassword: Joi.string().min(3).required(),
    // Image:Joi.string().min(3).reuired()
  };
  const result = Joi.validate(req.body, schema);
  console.log(result);
  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
    return;
  }
  let siginUptable = {
    Name: req.body.name,
    Email: req.body.email,
    PhoneNumber: req.body.PhoneNumber,
    Password: req.body.password,
    ConfirmPassword: req.body.confirmPassword,
    Image: req.file.path,
  };
  let sql = "INSERT INTO siginUptable SET?";
  let query = db.query(sql, siginUptable, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Post 1 added");
  });
});

router.post("/login", (req, res) => {
  console.log("reqq", req.body);

  let sql = "SELECT * FROM  siginuptable  WHERE `Email`= ? AND `Password`= ? ";
  const user = {
    Email: req.body.Email,
    Password: req.body.Password,
  };

  db.query(sql, [req.body.Email, req.body.Password], (err, data) => {
    if (err) return res.json("Error");
    if (data.length > 0) {
      jwt.sign({ user }, secretKey, { expiresIn: "300s" }, (err, token) => {
        return res.json({
          token,
          data,
        });
      });
    } else {
      return res.json("No Record");
    }
  });
});

//   app.post("/log", (req, resp) => {
//     const user = {
//       id: 1,
//       username: "anil",
//       email: "abc@gmail.com",
//     };
//     jwt.sign({ user }, secretKey, { expiresIn: "300s" }, (err, token) => {
//       resp.json({
//         token,
//       });
//     });
//   });

//   app.post("/profile", verifyToken, (req, resp) => {
//     jwt.verify(req.token, secretKey, (err, authData) => {
//       if (err) {
//         resp.send({ result: "invalid token" });
//       } else {
//         resp.json({
//           message: "profile accessed",
//           authData,
//         });
//       }
//     });
//   });

// function verifyToken(req, resp, next) {
//     const bearerHeader = req.headers["authorization"];
//     if (typeof bearerHeader !== "undefined") {
//       const bearer = bearerHeader.split(" ");
//       const token = bearer[1];
//       req.token = token;
//       next();
//     } else {
//       resp.send({
//         result: "Token is  not valid",
//       });
//     }
//   }

module.exports = router;
