import { open } from 'node:fs/promises';

const ROCK = 1;
const PAPER = 2;
const SCISSORS = 3;

const SHOULD_LOSE = 1;
const SHOULD_DRAW = 2;
const SHOULD_WIN = 3;

const LOSS = 0;
const DRAW = 3;
const WIN = 6;

function translate(code) {
  switch (code) {
    case 'A':
      return ROCK;
    case 'B':
      return PAPER;
    case 'C':
      return SCISSORS;
    case 'X':
      return ROCK;
    case 'Y':
      return PAPER;
    case 'Z':
      return SCISSORS;
  }
}

function correctedTranslate(code) {
  switch (code) {
    case 'A':
      return ROCK;
    case 'B':
      return PAPER;
    case 'C':
      return SCISSORS;
    case 'X':
      return SHOULD_LOSE;
    case 'Y':
      return SHOULD_DRAW;
    case 'Z':
      return SHOULD_WIN;
  }
}

function myShapeBasedOnOpponentShapeAndDesiredOutcome(
  opponentShape,
  desiredOutcome
) {
  if (desiredOutcome === SHOULD_DRAW) {
    return opponentShape;
  } else if (desiredOutcome === SHOULD_LOSE) {
    switch (opponentShape) {
      case ROCK:
        return SCISSORS;
      case PAPER:
        return ROCK;
      case SCISSORS:
        return PAPER;
    }
  } else if (desiredOutcome === SHOULD_WIN) {
    switch (opponentShape) {
      case ROCK:
        return PAPER;
      case PAPER:
        return SCISSORS;
      case SCISSORS:
        return ROCK;
    }
  }
}

function shapeScore(shape) {
  return shape;
}

function roundScore(opponentShape, myShape) {
  // Rock defeats Scissors, Scissors defeats Paper, and Paper defeats Rock
  if (opponentShape === myShape) {
    return shapeScore(myShape) + DRAW;
  } else if (
    (opponentShape === ROCK && myShape === SCISSORS) ||
    (opponentShape === SCISSORS && myShape === PAPER) ||
    (opponentShape === PAPER && myShape === ROCK)
  ) {
    return shapeScore(myShape) + LOSS;
  } else {
    return shapeScore(myShape) + WIN;
  }
}

async function loadInput() {
  let rounds = [];

  const file = await open('./input');

  for await (const line of file.readLines()) {
    // Parse the line into an opponent's play and your play in response.
    let [opponent, me] = line.split(' ');

    rounds.push({
      opponentShape: translate(opponent),
      myShape: translate(me),
      desiredOutcome: correctedTranslate(me),
    });
  }

  return rounds;
}

function totalScore(rounds) {
  return rounds.reduce((sum, round) => {
    return sum + roundScore(round.opponentShape, round.myShape);
  }, 0);
}

function correctedTotalScore(rounds) {
  return rounds.reduce((sum, round) => {
    let myShape = myShapeBasedOnOpponentShapeAndDesiredOutcome(
      round.opponentShape,
      round.desiredOutcome
    );

    return sum + roundScore(round.opponentShape, myShape);
  }, 0);
}

const rounds = await loadInput();

const score = totalScore(rounds);
const correctedScore = correctedTotalScore(rounds);

console.log(score, correctedScore);
