#!/usr/bin/env node
// based on https://github.com/Rush/link-module-alias
// sudo node updateAliases.js clean ; sudo node updateAliases.js

const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

// let baseDir = path.resolve(__dirname); // TODO: allow arg instead of __dirname

let baseDir;

if(process.argv[2] === 'clean') {
  baseDir = path.resolve(__dirname, "../../");
} else if (process.argv.length === 3 ){
  baseDir = path.resolve(process.argv[2]);
} else {
  baseDir = path.resolve(__dirname, "../../");
}

let packageJson;

try {
  packageJson = JSON.parse(fs.readFileSync(path.join(baseDir, 'package.json')/*`${baseDir}/package.json`*/, 'utf8'));
} catch(err) {
  console.error('Cannot open package.json:', err);
  process.exit(1);
}

let moduleAliases = packageJson._moduleAliases;
if(!moduleAliases) {
  console.error(`_moduleAliases in package.json is empty, skipping`);
  process.exit(0);
}
console.log("moduleAliases: ", moduleAliases);

const { promisify } = require('util');

const stat = promisify(fs.stat);
const lstat = promisify(fs.lstat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);
const readdir = promisify(fs.readdir);
const symlink = promisify(fs.symlink);
const mkdir = promisify(fs.mkdir);
const rmdir = promisify(fs.rmdir);

//const chalk = require('chalk');

function addColor({moduleName, type, target}) {
  if(type === 'none') {
    return `${moduleName} ALREADY EXISTS`;
    //return chalk.red(moduleName) + ` -> ${chalk.bold(chalk.red('ALREADY EXISTS'))}`;
  } else if(type === 'symlink') {
    return `${moduleName} -> ${target}`;
    //return chalk.cyan(moduleName) + ` -> ${chalk.bold(target)}`;
  } else if(type === 'proxy') {
    return `${moduleName} -> ${target}`;
    //return chalk.green(moduleName) + ` -> ${chalk.bold(target)}`;
  }
  return `${moduleName} `;
}

function addColorUnlink({moduleName, type}) {
  if(type === 'none') {
    //moduleName = chalk.red(moduleName);
  } else if(type === 'symlink') {
    //moduleName = chalk.cyan(moduleName);
  } else if(type === 'proxy') {
    //moduleName = chalk.green(moduleName);
  }
  return moduleName;
}

async function exists(filename) {
  try {
    await stat(filename);
    return true;
  } catch(err) {
    return false;
  }
}

async function unlinkModule(moduleName) {
  console.log("unlinkModule ", moduleName, "...");
  const moduleDir = path.join('node_modules', moduleName);
  let statKey;
  try {
    statKey = await lstat(moduleDir);
  } catch(err) {}

  let type;
  if(statKey && statKey.isSymbolicLink()) {
    await unlink(moduleDir);
    await unlink(path.join('node_modules', `.link-module-alias-${moduleName}`));
    type = 'symlink';
  } else if(statKey) {
    await unlink(path.join(moduleDir, 'package.json'));
    await rmdir(moduleDir);
    await unlink(path.join('node_modules', `.link-module-alias-${moduleName}`));
    type = 'proxy';
  } else {
    type = 'none';
  }
  return { moduleName, type };
}

function js(strings, ...interpolatedValues) {
  return strings.reduce((total, current, index) => {
    total += current;
    if (interpolatedValues.hasOwnProperty(index)) {
      total += JSON.stringify(interpolatedValues[index]);
    }
    return total;
  }, '');
}

async function linkModule(moduleName) {
  // console.log("linkModule ", moduleName)
  const moduleDir = path.join('node_modules', moduleName);
  const moduleExists = await exists(moduleDir);
  const linkExists = moduleExists && await exists(`node_modules/.link-module-alias-${moduleName}`);
  const target = moduleAliases[moduleName];

  let type;
  if(moduleExists && !linkExists) {
    // console.error(chalk.red(`Module ${moduleName} already exists and wasn't created by us, skipping`));
    console.error(`Module ${moduleName} already exists and wasn't created by us, skipping`);
    type = 'none';
    return { moduleName, type, target };
  } else if(linkExists) {
    await unlinkModule(moduleName);
  }

  if(target.match(/\.js$/)) {
    // console.log(`Target ${target} is a direct link, creating proxy require`);
    await mkdir(moduleDir);
    await writeFile(path.join(moduleDir, 'package.json'), js`
      {
        "name": ${moduleName},
        "main": ${path.join(baseDir, target)}
      }
    `);
    type = 'proxy';
  } else {
    const stat = fs.statSync(target);
    if(!stat.isDirectory) {
      console.log(`Target ${target} is not a directory, skipping ...`);
      type = 'none';
      return { moduleName, type, target };
    }
    await symlink(path.join(baseDir, target), moduleDir, 'dir');
    type = 'symlink';
  }
  await writeFile(path.join('node_modules', `.link-module-alias-${moduleName}`), '');
  return { moduleName, type, target };
}

async function linkModules() {
  console.log("linkModules1")
  try { await mkdir('node_modules'); } catch(err) {}
  console.log("linkModules2")
  const modules = await Promise.all(Object.keys(moduleAliases).map(async key => {
    return linkModule(key);
  }));
  console.log('link-module-alias:', modules.map(addColor).join(', '));
}

async function unlinkModules() {
  const nodeModulesExists = await exists('node_modules');
  if(!nodeModulesExists) {
    return;
  }
  const allModules = await readdir('node_modules');

  const modules = allModules.map(file => {
    const m = file.match(/^\.link-module-alias-(.*)/);
    return m && m[1];
  }).filter(v => !!v);

  const unlinkedModules = await Promise.all(modules.map(mod => {
    return unlinkModule(mod);
  }));
  if(unlinkedModules.length) {
    console.log('link-module-alias: Cleaned ', unlinkedModules.filter(v => {
      return v.type !== 'none';
    }).map(addColorUnlink).join(' '));
  } else {
    console.log('link-module-alias: No modules to clean');
  }
}

if (process.argv.length > 2) {
  if(process.argv[2] === 'clean') {
    unlinkModules();
  } else if (process.argv.length === 3 ){
    linkModules();
  } else {
    linkModules();
  }
}