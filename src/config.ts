// define our parent property accessible via globalThis. Also apply the TypeScript type.
var app: globalAppVariables;

// define the child properties and their types.
type globalAppVariables = {
  repoJsonPath: string;
  gamesFolderPath: string
};

// set the values.
globalThis.app = {
  repoJsonPath: "./repos.json",
  gamesFolderPath: "./games/",
  // more can go here.
};


// Freeze so these can only be defined in this file.
Object.freeze(globalThis.app);
