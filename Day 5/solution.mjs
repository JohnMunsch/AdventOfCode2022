import { open } from 'node:fs/promises';

import { startingState } from './starting.mjs';

async function loadExampleInput() {
  let input = {
    state: [['Z', 'N'], ['M', 'C', 'D'], ['P']],
    actions: [],
  };

  input.actions.push(parseAction('move 1 from 2 to 1'));
  input.actions.push(parseAction('move 3 from 1 to 3'));
  input.actions.push(parseAction('move 2 from 2 to 1'));
  input.actions.push(parseAction('move 1 from 1 to 2'));

  return input;
}

// This is our first puzzle where we have to pull in two entirely different types of data.
async function loadInput() {
  let input = {
    state: [],
    actions: [],
  };

  input.state = startingState;

  const file = await open('./actions');

  for await (const line of file.readLines()) {
    input.actions.push(parseAction(line));
  }

  return input;
}

function parseAction(actionLine) {
  const actionRegex =
    /move (?<move>[0-9]+) from (?<from>[0-9]+) to (?<to>[0-9]+)$/;

  let results = actionLine.match(actionRegex);
  return {
    move: parseInt(results.groups.move, 10),
    from: parseInt(results.groups.from, 10),
    to: parseInt(results.groups.to, 10),
  };
}

function updateState(state, action) {
  for (let i = 0; i < action.move; i++) {
    const item = state[action.from - 1].pop();
    state[action.to - 1].push(item);
  }
}

function newUpdateState(state, action) {
  let toMove = [];

  for (let i = 0; i < action.move; i++) {
    toMove.push(state[action.from - 1].pop());
  }

  toMove.reverse();

  state[action.to - 1].push(...toMove);
}

function rearrange(state, actions) {
  actions.forEach((action) => {
    updateState(state, action);
  });

  return state;
}

function newRearrange(state, actions) {
  actions.forEach((action) => {
    newUpdateState(state, action);
  });

  return state;
}

function topmost(state) {
  let items = state.map((stack) => stack[stack.length - 1]);

  return items.join('');
}

const input = await loadInput();
// const rearrangedState = rearrange(input.state, input.actions);
// console.log(topmost(rearrangedState));

const newRearrangedState = newRearrange(input.state, input.actions);
console.log(topmost(newRearrangedState));
