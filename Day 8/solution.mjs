import { open } from 'node:fs/promises';

async function loadExampleInput() {
  const input = ['30373', '25512', '65332', '33549', '35390'];

  return input;
}

async function loadInput() {
  const file = await open('./input');

  for await (const line of file.readLines()) {
  }
}

function parseInput(input) {
  return input.map((row) => row.split(''));
}

function checkVisibility(rows, row, column, targetHeight) {
  let directions = {
    up: [],
    right: [],
    down: [],
    left: [],
  };

  // Generate a series of coordinates outward from the designated tree that we need to check.

  // If any of the series is of zero length, we can stop here because the tree is definitely
  // visible.
  if (
    directions.up.length === 0 ||
    directions.right.length === 0 ||
    directions.down.length === 0 ||
    directions.left.length === 0
  ) {
    return true;
  } else {
    // As long as it is visible frome one direction, it's considered to be visible.
    return directions.values().some((direction) => {
      // Check every tree in this direction to make sure it's less than the height of the tree
      // in question.
      return direction.every((height) => height < targetHeight);
    });
  }
}

const trees = await loadExampleInput();
const rows = parseInput(trees);
console.log(rows);
