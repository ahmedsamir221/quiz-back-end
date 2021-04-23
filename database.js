const mongoose = require("mongoose");

mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const question = new mongoose.Schema({
  question: String,
  answers: [String],
  correctAnswer: Number,
});
const quiz = new mongoose.Schema({
  owner: String,
  name: String,
  questions: [question],
  emails: [String],
});

let Quiz = mongoose.model("quizzes", quiz);

module.exports.Quiz = Quiz;
