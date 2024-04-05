const express = require("express");
const app = express();
app.use(express.json());
const Joi = require("joi");
const cors = require("cors");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const secretKey = "secretKey";
// const router = express.Router();
app.use(cors());
require("dotenv").config();
const accountSid = process.env.TwILI0_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const CallRecord = [];

// Create Connnections

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  // port: 3307,
  database: "TWILIOMYSQL",
});

// connect to database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connection done");
});

//crate db
app.get("/createdb", (req, res) => {
  let sql = "CREATE DATABASE  TWILIOMYSQL";
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log("result");
    res.send("Database Created");
  });
});

const coursess = [];
const Tokens = [];
// app.post("/signUp",(req,res)=>{
//     const schema ={
//         Name:Joi.string().min(3).required(),
//         Email:Joi.string().min(3).required(),
//         PhoneNumber:Joi.string().min(3).required(),
//         Password:Joi.string().min(3).required(),
//         ConfirmPassword:Joi.string().min(3).required(),
//     };
//     const result =Joi.validate(req.body,schema);
//      console.log(result);
//     if(result.error){
//        return res.status(400).send(result.error.details[0].message);
//         return;
//     }
//     // let BulkSms={Name:req.body.Name,Email:req.body.Email,PhoneNumber:req.body.Password,ConfirmPassword:req.body.ConfirmPassword};
//     // let sql="INSERT INTO BulkSms SET?"
//     // let query=db.query(sql,BulkSms,(err,result)=>{
//     //     if(err) throw err;
//     //     console.log(result);
//     //     res.send("One User added");
//     // });

//     const course={
//         id:courses.length+1,
//         Name:req.body.name,
//         Email:req.body.Email,
//         PhoneNumber:req.body.PhoneNumber,
//     };
//     courses.push(course);
//     res.send(courses);
// })
const courses = [
  // {id:1,name:'course1'},
  // {id:2,name:'course2'},
  // {id:3,name:'course3'},
];

const router = require("./routes/user.js");

app.use(router);

app.get("/createposttable", (req, res) => {
  let sql =
    "Create Table BulkSms(id int Auto_INCREMENT,BODY VARCHAR(255), numSegments VARCHAR(5),direction VARCHAR(255),fromNumber VARCHAR(255),ToNumber VARCHAR(255),dateUpdated VARCHAR(255),price VARCHAR(255),errMessage VARCHAR(255),uri VARCHAR(255),accountSid VARCHAR(255),numMedia VARCHAR(255),status VARCHAR(255),messagingServiceSid VARCHAR(255),sid VARCHAR(255),dateSent VARCHAR(255),errorCode VARCHAR(255),priceUnit VARCHAR(255),appVersion VARCHAR(255) ,subresourceUris VARCHAR(255), PRIMARY KEY(id))";
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log("result");
    res.send("Posts table created");
  });
});
// Insert post 1
app.get("/addpost1", (req, res) => {
  console.log("callRecordss", CallRecord[0]?.body);
  let BulkSms = {
    body: CallRecord[0]?.body,
    numSegments: CallRecord[0]?.numSegments,
    direction: CallRecord[0]?.direction,
    fromNumber: CallRecord[0]?.from,
    ToNumber: CallRecord[0]?.to,
    dateUpdated: CallRecord[0]?.dateUpdated,
    price: CallRecord[0]?.price,
    errMessage: CallRecord[0]?.errorMessage,
    uri: CallRecord[0]?.uri,
    accountSid: CallRecord[0]?.uri,
    accountSid: CallRecord[0]?.accountSid,
    numMedia: CallRecord[0]?.numMedia,
    status: CallRecord[0]?.status,
    messagingServiceSid: CallRecord[0]?.messagingServiceSid,
    sid: CallRecord[0]?.sid,
    dateSent: CallRecord[0]?.dateSent,
    errorCode: CallRecord[0]?.errorCode,
    priceUnit: CallRecord[0]?.priceUnit,
    appVersion: CallRecord[0]?.apiVersion,
    subresourceUris: CallRecord[0].ubresourceUris?.media,
  };
  let sql = "INSERT INTO BulkSms SET?";
  let query = db.query(sql, BulkSms, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Post 1 added");
  });
});

app.get("/getposts", (req, res) => {
  let sql = "SELECT * FROM posts";
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("posts fetched");
  });
});

app.get("/getposts/:id", (req, res) => {
  let sql = `SELECT * FROM posts WHERE id=${req.params.id}`;
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("single post fetched ");
  });
});

app.get("/updatepost/:id", (req, res) => {
  let newTitle = "updated title";
  let sql = `UPDATE posts SET title='${newTitle}' WHERE id=${req.params.id}`;
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("post updated ");
  });
});

app.get("/deletepost/:id", (req, res) => {
  let sql = `DELETE FROM posts WHERE id=${req.params.id}`;
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("post deleted ");
  });
});

app.get("/", (req, res) => {
  // res.set("Access-Control-Allow-Origin", "*");
  res.send({ msg: "Hello World karannnnnn" });
});

app.get("/api/course", (req, res) => {
  res.send([1, 2, 3]);
});

app.get("/api/posts/:id", (req, res) => {
  const course = courses.find((c) => c.id == parseInt(req.params.id));
});

app.post("/api/twillio", (req, res) => {
  const number = req.body.number;
  console.log("numberOnesss", number);
  // const schema = {
  //   number: Joi.string().min(10).required(),
  // };

  // const result = Joi.validate(number[0], schema);
  // console.log(result);
  // if (result.error) {
  //   return res.status(400).send(result.error.details[0].message);
  // }

  // Promise.all(
  //   number.map((number) => {
  //     return twilio.messages.create({
  //       to: number,
  //       from: process.env.TWILIO_FROM_NUMBER,
  //       body: body,
  //     });
  //   })
  // );
  // try {
  //   const message = client.messages.create(msgOptions);
  //   CallRecord.push(message);
  //   res.send(CallRecord);
  //   console.log(CallRecord);
  //   console.log("Messages sent!");
  // } catch (error) {
  //   console.log(error);
  // }

  const sendSMS = async (body) => {
    Promise.all(
      number.map(async (number) => {
        console.log("numberrr", number);
        let msgOptions = {
          from: process.env.TWILIO_FROM_NUMBER,
          to: number,
          body,
        };
        try {
          const message = await client.messages.create(msgOptions);
          CallRecord.push(message);
          res.send(CallRecord);
          console.log(CallRecord);
        } catch (error) {
          console.log(error);
        }
      })
    );
  };

  sendSMS("Hello how  are you karannnnnn");
});

app.put("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(400).send("the course will the  given ID was invalid");

  const schema = {
    name: Joi.string().min(3).required(),
  };
  const result = validateCourse(req.body);
  const { error } = validateCourse(req.body);
  if (error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  course.name = req.body.name;
  res.send(course);
});

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required(),
  };
  return Joi.validate(course, schema);
}

//   app.delete('api/courses/:id',(req,res)=>{
//     const course =courses.find(c=>c.id===parseInt(req.params.id));
//     if(!course) return res.status(400).send('the course will the  given ID was invalid')
//       const index=course.indexOf(course);
//     courses.splice(index,1);
//      res.send(course)
//   })

//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening ${port}...`));
