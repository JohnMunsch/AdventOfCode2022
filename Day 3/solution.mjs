import { open } from 'node:fs/promises';

async function loadExampleInput() {
  let input = [
    'vJrwpWtwJgWrhcsFMMfFFhFp',
    'jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL',
    'PmmdzqPrVvPwwTWBwg',
    'wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn',
    'ttgJtRGJQctTZtZT',
    'CrZsJsPPZsGzwwsLwLmpwMDw',
  ];

  const rucksacks = input.map((rucksack) => {
    return splitRucksack(rucksack);
  });

  return rucksacks;
}

async function loadInput() {
  let rucksacks = [];

  const file = await open('./input');

  for await (const line of file.readLines()) {
    rucksacks.push(splitRucksack(line));
  }

  return rucksacks;
}

function splitRucksack(rucksack) {
  const half = rucksack.length / 2;

  return {
    compartment1: rucksack.substring(0, half),
    compartment2: rucksack.substring(half),
  };
}

// This code assumes there is exactly one common item between the two compartments in the rucksack.
function findCommonItem(items1, items2, items3) {
  // Split up the first set of items into strings of a single character.
  const individualItems = items1.split('');

  // Then look for each one in the second set of items and return the first one found.
  return individualItems.find((item) => {
    if (!items3) {
      return items2.includes(item);
    } else {
      return items2.includes(item) && items3.includes(item);
    }
  });
}

function priority(item) {
  const aValue = 'a'.charCodeAt(0);
  const zValue = 'z'.charCodeAt(0);
  const capitalAValue = 'A'.charCodeAt(0);
  const capitalZValue = 'Z'.charCodeAt(0);

  const itemValue = item.charCodeAt(0);

  if (itemValue >= aValue && itemValue <= zValue) {
    return itemValue - aValue + 1;
  } else {
    return itemValue - capitalAValue + 27;
  }
}

const rucksacks = await loadInput();
const commonItems = rucksacks.map((rucksack) => {
  return findCommonItem(rucksack.compartment1, rucksack.compartment2);
});
const priorityOfCommonItems = commonItems.reduce((sum, commonItem) => {
  return sum + priority(commonItem);
}, 0);

const groupedRucksacks = [];
for (let i = 0; i < rucksacks.length; i += 3) {
  groupedRucksacks.push({
    rucksack1: rucksacks[i].compartment1 + rucksacks[i].compartment2,
    rucksack2: rucksacks[i + 1].compartment1 + rucksacks[i + 1].compartment2,
    rucksack3: rucksacks[i + 2].compartment1 + rucksacks[i + 2].compartment2,
  });
}
const commonBadges = groupedRucksacks.map((group) => {
  // We don't actually need to look for items that are in all three rucksacks if we assume that
  // there is exactly one shared item.
  return findCommonItem(group.rucksack1, group.rucksack2, group.rucksack3);
});
const priorityOfCommonBadges = commonBadges.reduce((sum, commonBadge) => {
  return sum + priority(commonBadge);
}, 0);

console.log(priorityOfCommonItems, priorityOfCommonBadges);
