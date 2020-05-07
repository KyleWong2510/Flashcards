const inquirer = require('inquirer');
const Card = require('../src/Card');
const Deck = require('../src/Deck');
const Round = require('../src/Round');
const data = require('./data');

const genList = (round) => {
  let card = round.returnCurrentCard();
  
  let choices = card.answers.map((answer, index) => {
    return {
      key: index,
      value: answer
    }
  });
  return {
    type: 'rawlist',
    message: card.question,
    name: 'answers',
    choices: choices
  };
}

const getRound = (round) => {
  return Promise.resolve(round);
}

const confirmUpdate = (id, round) => {
  const feedback = round.takeTurn(id);
  return {
    name: 'feedback',
    message: `Your answer of ${id} is ${feedback}`
  }
}

async function main(round) {

  const currentRound = await getRound(round);
  const getAnswer = await inquirer.prompt(genList(currentRound));
  const getConfirm = await inquirer.prompt(confirmUpdate(getAnswer.answers, round));

    if(!round.returnCurrentCard() && round.calculatePercentage() < 90) {
      round.endRound()
      console.log(':(')
      console.log('~~~~~~~~~~~~~~~~~~~~  ** UNFORTUNATELY, YOU BLEW IT BIG TIME! ** We are looking for 90% or more.  Try again!  ~~~~~~~~~~~~~~~~~~~~')
      console.log(':(')
      const cards = data.prototypeData.map(({id, question, answers, correctAnswer}) => {
        return new Card(id, question, answers, correctAnswer)
      }) 
      const deck = new Deck(cards)
      round = new Round(deck)
      round.startTimer()
    }
    if(!round.returnCurrentCard()) {
      round.endRound();
    } else {
      main(round);
    }
}

module.exports.main = main;