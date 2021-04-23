const express = require("express");
const cors = require("cors");
const auth = require("./auth");
const { Quiz } = require("./database");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.text());
app.use("/", auth);

app.post("/addQuiz", async (req, res) => {
  let quiz = new Quiz({
    ...req.body,
    owner: req.owner,
  });
  await quiz.save();
  res.send("quiz is added succesfully......");
});

app.post("/updateQuiz", async (req, res) => {
  let quiz = await Quiz.findOne({ _id: req.body._id });
  quiz.name = req.body.name;
  quiz.questions = req.body.questions;
  quiz.emails = req.body.emails;
  await quiz.save();
  res.send("quiz is updated succesfully......");
});

app.get("/getQuizzes", async (req, res) => {
  let owner = req.owner;
  let quizzes = await Quiz.find({ owner });
  quizzes = quizzes.map((quiz) => {
    return {
      _id: quiz._id,
      name: quiz.name,
    };
  });
  res.send(quizzes);
});

app.get("/getQuiz/:_id", async (req, res) => {
  let _id = req.params._id;
  let quiz = await Quiz.findOne({ _id });
  res.send(quiz);
});

app.get("/tests", async (req, res) => {
  let target = req.owner;
  let quizzes = await Quiz.find().in("emails", [target]);
  quizzes = quizzes.map((quiz) => {
    return {
      _id: quiz._id,
      name: quiz.name,
    };
  });
  res.send(quizzes);
});

app.get("/tests/:_id", async (req, res) => {
  let _id = req.params._id;
  let quiz = await Quiz.findOne({ _id });
  quiz = {
    _id: quiz._id,
    name: quiz.name,
    questions: quiz.questions,
  };
  quiz.questions = quiz.questions.map((question) => {
    return {
      question: question.question,
      answers: question.answers,
    };
  });
  res.send(quiz);
});

app.post("/getDegree/:_id", async (req, res) => {
  let _id = req.params._id;
  let answers = req.body;
  let quiz = await Quiz.findOne({ _id });
  let count = 0;
  for (let i = 0; i < quiz.questions.length; i++) {
    if (answers[i] === quiz.questions[i].correctAnswer) count++;
  }
  console.log(count);
  res.send({ degree: (count / quiz.questions.length) * 100 });
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
