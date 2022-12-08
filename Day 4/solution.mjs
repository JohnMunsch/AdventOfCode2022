import { open } from 'node:fs/promises';

async function loadExampleInput() {
  return [
    splitSectionAssignmentPairs('2-4,6-8'),
    splitSectionAssignmentPairs('2-3,4-5'),
    splitSectionAssignmentPairs('5-7,7-9'),
    splitSectionAssignmentPairs('2-8,3-7'),
    splitSectionAssignmentPairs('6-6,4-6'),
    splitSectionAssignmentPairs('2-6,4-8'),
  ];
}

async function loadInput() {
  let sectionAssignmentPairs = [];

  const file = await open('./input');

  for await (const line of file.readLines()) {
    sectionAssignmentPairs.push(splitSectionAssignmentPairs(line));
  }

  return sectionAssignmentPairs;
}

function splitSectionAssignmentPairs(sectionAssignmentPairs) {
  const pairs = sectionAssignmentPairs.split(',');

  const elf1Assignment = pairs[0].split('-');
  const elf2Assignment = pairs[1].split('-');

  return {
    elf1Assignment: {
      low: parseInt(elf1Assignment[0], 10),
      high: parseInt(elf1Assignment[1], 10),
    },
    elf2Assignment: {
      low: parseInt(elf2Assignment[0], 10),
      high: parseInt(elf2Assignment[1], 10),
    },
  };
}

function isAssignmentFullyContained(assignment1, assignment2) {
  return (
    assignment1.low >= assignment2.low && assignment1.high <= assignment2.high
  );
}

function isAssignmentPartiallyContained(assignment1, assignment2) {
  return (
    (assignment1.low >= assignment2.low &&
      assignment1.low <= assignment2.high &&
      assignment1.high > assignment2.high) ||
    (assignment1.low < assignment2.low &&
      assignment1.high >= assignment2.low &&
      assignment1.high <= assignment2.high)
  );
}

function fullyContained(assignments) {
  return assignments.filter((assignment) => {
    // console.log(
    //   assignment,
    //   isAssignmentFullyContained(
    //     assignment.elf1Assignment,
    //     assignment.elf2Assignment
    //   ) ||
    //     isAssignmentFullyContained(
    //       assignment.elf2Assignment,
    //       assignment.elf1Assignment
    //     )
    // );
    return (
      isAssignmentFullyContained(
        assignment.elf1Assignment,
        assignment.elf2Assignment
      ) ||
      isAssignmentFullyContained(
        assignment.elf2Assignment,
        assignment.elf1Assignment
      )
    );
  });
}

function partiallyContained(assignments) {
  return assignments.filter((assignment) => {
    console.log(
      assignment,
      isAssignmentFullyContained(
        assignment.elf1Assignment,
        assignment.elf2Assignment
      ),
      isAssignmentFullyContained(
        assignment.elf2Assignment,
        assignment.elf1Assignment
      ),
      isAssignmentPartiallyContained(
        assignment.elf1Assignment,
        assignment.elf2Assignment
      )
    );
    return (
      isAssignmentFullyContained(
        assignment.elf1Assignment,
        assignment.elf2Assignment
      ) ||
      isAssignmentFullyContained(
        assignment.elf2Assignment,
        assignment.elf1Assignment
      ) ||
      isAssignmentPartiallyContained(
        assignment.elf1Assignment,
        assignment.elf2Assignment
      )
    );
  });
}

const assignments = await loadInput();
const fullyContainedAssignments = fullyContained(assignments);
const partiallyContainedAssignments = partiallyContained(assignments);

console.log(
  fullyContainedAssignments.length,
  partiallyContainedAssignments.length
);
