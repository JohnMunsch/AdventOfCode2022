import { open } from 'node:fs/promises';

async function loadExampleInput() {
  return [
    'bvwbjplbgvbhsrlpgdmjqwftvncz',
    'nppdvjthqldpwncqszvftbrmjlhg',
    'nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg',
    'zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw',
  ];
}

async function loadExampleInput2() {
  return [
    'mjqjpqmgbljsphdztnvjfqwrcgsmlb',
    'bvwbjplbgvbhsrlpgdmjqwftvncz',
    'nppdvjthqldpwncqszvftbrmjlhg',
    'nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg',
    'zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw',
  ];
}

async function loadInput() {
  let datastreams = [];
  const file = await open('./input');

  for await (const line of file.readLines()) {
    datastreams.push(line);
  }

  return datastreams;
}

function findStartOfPacket(datastream, sequenceLength) {
  // Go from the fourth character (the first which could be a complete four character
  // unique sequence) through to the end of the stream.
  for (let i = 1; i < datastream.length - sequenceLength; i++) {
    const sequence = datastream.substring(i - 1, i - 1 + sequenceLength);

    let repeatChecker = new Set();
    sequence.split('').forEach((character) => repeatChecker.add(character));

    console.log(sequence, repeatChecker, repeatChecker.size);
    if (repeatChecker.size === sequenceLength) {
      return i - 1 + sequenceLength;
    }
  }

  return null;
}

function findPacketStarts(datastreams, sequenceLength = 4) {
  return datastreams.map((datastream) => {
    return findStartOfPacket(datastream, sequenceLength);
  });
}

const datastreams = await loadInput();
const packetStarts = findPacketStarts(datastreams, 14);
console.log(datastreams, packetStarts);
