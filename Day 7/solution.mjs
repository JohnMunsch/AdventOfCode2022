import { open } from 'node:fs/promises';

const commandsRegex = /^\$ (?<type>cd|ls) ?(?<location>\.|\.\.|[a-z]+|\/)?$/;
const contentsRegex = /^(?<typeOrSize>dir|\d+) (?<name>[a-z]*.?[a-z]*?)$/;

const CD = 'cd';
const LS = 'ls';
const DIR = 'dir';
const FILE = 'file';

const TOTAL_STORAGE = 70000000;
const TARGET_FREE_SPACE = 30000000;

class FileNode {
  name;
  type;

  // Only a file has a filesize.
  filesize;

  // Only a dir has children and/or a parent.
  children = [];
  parent = null;

  constructor(type, name, filesize = 0) {
    this.type = type;
    this.name = name;
    this.filesize = filesize;
  }

  get size() {
    if (this.type === DIR) {
      // Calculate the size of this node and everything below it.
      return this.children.reduce((sum, child) => sum + child.size, 0);
    } else {
      return this.filesize;
    }
  }

  set parent(parent) {
    this.parent = parent;
  }

  addNode(newNode) {
    this.children.push(newNode);
  }

  toString(indent = '') {
    const description = `(${this.type}, size=${this.size})`;

    console.log(`${indent}- ${this.name} ${description}`);
    this.children.forEach((child) => {
      child.toString(indent + '  ');
    });
  }
}

class Command {
  type;
  location;
  nodes = [];

  constructor(type, location = null) {
    this.type = type;
    this.location = location;
  }

  addNode(newNode) {
    this.nodes.push(newNode);
  }
}

async function loadExampleInput() {
  const input = [
    '$ cd /',
    '$ ls',
    'dir a',
    '14848514 b.txt',
    '8504156 c.dat',
    'dir d',
    '$ cd a',
    '$ ls',
    'dir e',
    '29116 f',
    '2557 g',
    '62596 h.lst',
    '$ cd e',
    '$ ls',
    '584 i',
    '$ cd ..',
    '$ cd ..',
    '$ cd d',
    '$ ls',
    '4060174 j',
    '8033020 d.log',
    '5626152 d.ext',
    '7214296 k',
  ];

  return parseInput(input);
}

async function loadInput() {
  let input = [];

  const file = await open('./input');

  for await (const line of file.readLines()) {
    input.push(line);
  }

  return parseInput(input);
}

function parseInput(input) {
  let commands = [];
  let latestCommand;

  input.forEach((line) => {
    const commandMatch = line.match(commandsRegex);

    if (commandMatch) {
      latestCommand = new Command(
        commandMatch.groups.type,
        commandMatch.groups.location
      );
      commands.push(latestCommand);
    } else {
      // The assumption is that this is a directory or file match.
      const contentMatch = line.match(contentsRegex);

      if (contentMatch) {
        if (contentMatch.groups.typeOrSize === DIR) {
          latestCommand.addNode(new FileNode(DIR, contentMatch.groups.name));
        } else {
          latestCommand.addNode(
            new FileNode(
              FILE,
              contentMatch.groups.name,
              parseInt(contentMatch.groups.typeOrSize, 10)
            )
          );
        }
      }
    }
  });

  return commands;
}

function executeCommands(parsedInput) {
  let root = new FileNode(DIR, '/');
  let focus;

  // Iterate through the commands and execute them to build up a picture of the file system.
  parsedInput.forEach((command) => {
    switch (command.type) {
      case CD:
        // Change the focus within the tree.
        if (command.location === '..') {
          focus = focus.parent;
        } else if (command.location === '/') {
          focus = root;
        } else {
          // Find the matching directory among the nodes here.
          focus = focus.children.find((child) => {
            return child.name === command.location;
          });
        }
        break;
      case LS:
        // Set the file nodes at the current focus.
        command.nodes.forEach((node) => {
          if (node.type === DIR) {
            node.parent = focus;
          }

          focus.addNode(node);
        });
        break;
    }
  });

  return root;
}

function filterDirectories(tree) {
  let directories = [];

  if (tree.type === DIR) {
    directories.push(tree);

    tree.children.forEach((child) => {
      directories.push(filterDirectories(child));
    });
  }

  return directories.flat();
}

function neededDeletion(tree) {
  const currentFreeSpace = TOTAL_STORAGE - tree.size;

  if (currentFreeSpace >= TARGET_FREE_SPACE) {
    return 0;
  } else {
    return TARGET_FREE_SPACE - currentFreeSpace;
  }
}

const parsedInput = await loadInput();
const tree = executeCommands(parsedInput);
tree.toString();

const directories = filterDirectories(tree);
const directoriesAtOrBelow100k = directories.filter(
  (directory) => directory.size <= 100000
);
const directoriesTotal = directoriesAtOrBelow100k.reduce(
  (sum, directory) => sum + directory.size,
  0
);
console.log(directoriesTotal);

const minimumDeletion = neededDeletion(tree);
const smallestDirectoryToDelete = directories.reduce(
  (currentLowest, directory) => {
    const directorySize = directory.size;

    if (directorySize > minimumDeletion && directorySize < currentLowest) {
      return directorySize;
    } else {
      return currentLowest;
    }
  },
  Number.MAX_SAFE_INTEGER
);
console.log(smallestDirectoryToDelete);
