import { open } from 'node:fs/promises';

async function loadExampleInput() {
  let elves = new Map();

  // Sample data - Answer: 24000
  elves.set(1, [1000, 2000, 3000]);
  elves.set(2, [4000]);
  elves.set(3, [5000, 6000]);
  elves.set(4, [7000, 8000, 9000]);
  elves.set(5, [10000]);

  return elves;
}

async function loadInput() {
  let elves = new Map();
  let elfNumber = 0;
  let currentElf;

  const file = await open('./input');

  for await (const line of file.readLines()) {
    const value = Number.parseInt(line, 10);

    if (!isNaN(value)) {
      // If it's a number, add it to the current elf. If there is no current elf, create one.
      if (!currentElf) {
        elfNumber++;
        currentElf = [value];
      } else {
        currentElf.push(value);
      }
    } else {
      // If it's a blank line. Save and clear the current elf.
      elves.set(elfNumber, currentElf);
      currentElf = undefined;
    }
  }
  elves.set(elfNumber, currentElf);

  return elves;
}

function totalCalories(food) {
  // Add up the total calories from this array of food.
  return food.reduce((sum, item) => sum + item, 0);
}

function findXHighestCalories(elves, topX) {
  const allCalories = Array.from(elves.values()).map((food) => {
    return totalCalories(food);
  });

  allCalories.sort((a, b) => a - b);
  allCalories.reverse();
  console.log(allCalories);

  return allCalories.slice(0, topX).reverse();
}

const elves = await loadInput();
const highestCalories = findXHighestCalories(elves, 1)[0];
const topThreeHighestCalories = findXHighestCalories(elves, 3).reduce(
  (sum, value) => sum + value,
  0
);

console.log(highestCalories, topThreeHighestCalories);
