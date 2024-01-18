// src/server.js
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');

const app = express();
const port = 3000;

const apiUrl = 'https://opentdb.com/api.php?amount=10&category=10'; 
let triviaList = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

async function fetchRandomBookTrivia() {
  try {

    const response = await axios.get(apiUrl);

    triviaList = response.data.results.map(item => ({
      question: item.question,
      correctAnswer: item.correct_answer
    }));

  } catch (error) {
    console.error('Error fetching random book trivia:', error.message);
    throw error;
  }
}

app.get('/', async (req, res) => {
  try {
    if (triviaList.length === 0) {
      await fetchRandomBookTrivia();
    }

    res.render('index', { triviaList });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

app.post('/', async (req, res) => {
  try {
    const selectedQuestionIndex = req.body.selectedQuestion;
    const selectedTrivia = triviaList[selectedQuestionIndex];

    res.render('response', { selectedTrivia });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
