#!/usr/bin/env node
// based on https://github.com/Rush/link-module-alias
// sudo node updateAliases.js clean ; sudo node updateAliases.js

declare let process: any;

// tslint:disable:no-console
declare let console: any;

declare let __dirname: any;

import * as fs from 'fs';
import * as path from 'path';
import * as child_process from 'child_process';

let baseDir: any;

let packageJson: any;

let moduleAliases: any;

import { promisify } from 'util';

const stat = promisify(fs.stat);
const lstat = promisify(fs.lstat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);
const readdir = promisify(fs.readdir);
const symlink = promisify(fs.symlink);
const mkdir = promisify(fs.mkdir);
const rmdir = promisify(fs.rmdir);

function addColor({ moduleName, type, target }: any) {
  if (type === 'none') {
    return `${moduleName} ALREADY EXISTS`;
  } else if (type === 'symlink') {
    return `${moduleName} -> ${target}`;
  } else if (type === 'proxy') {
    return `${moduleName} -> ${target}`;
  }
  return `${moduleName} `;
}

async function exists(filename: any) {
  try {
    await stat(filename);
    return true;
  } catch (err) {
    return false;
  }
}

async function unlinkModule(moduleName: any) {
  const moduleDir = path.join('node_modules', moduleName);
  let statKey;
  try {
    statKey = await lstat(moduleDir);
  // tslint:disable-next-line:no-empty
  } catch (err) {}

  let type;
  if (statKey && statKey.isSymbolicLink()) {
    await unlink(moduleDir);
    await unlink(path.join('node_modules', `.link-module-alias-${moduleName}`));
    type = 'symlink';
  } else if (statKey) {
    await unlink(path.join(moduleDir, 'package.json'));
    await rmdir(moduleDir);
    await unlink(path.join('node_modules', `.link-module-alias-${moduleName}`));
    type = 'proxy';
  } else {
    type = 'none';
  }
  return { moduleName, type };
}

function js(strings: any, ...interpolatedValues: any[]) {
  return strings.reduce((total: any, current: any, index: any) => {
    let totalValues = '';
    totalValues += current;
    if (interpolatedValues.hasOwnProperty(index)) {
      totalValues += JSON.stringify(interpolatedValues[index]);
    }
    return totalValues;
  // tslint:disable-next-line:align
  }, '');
}

async function linkModule(moduleName: any) {
  // console.log("linkModule ", moduleName)
  const moduleDir = path.join('node_modules', moduleName);
  const moduleExists = await exists(moduleDir);
  const linkExists = moduleExists && (await exists(`node_modules/.link-module-alias-${moduleName}`));
  const target = moduleAliases[moduleName];

  let type;
  if (moduleExists && !linkExists) {
    // console.error(chalk.red(`Module ${moduleName} already exists and wasn't created by us, skipping`));
    console.error(`Module ${moduleName} already exists and wasn't created by us, skipping`);
    type = 'none';
    return { moduleName, type, target };
  } else if (linkExists) {
    await unlinkModule(moduleName);
  }

  if (target.match(/\.js$/)) {
    // console.log(`Target ${target} is a direct link, creating proxy require`);
    await mkdir(moduleDir);
    await writeFile(
      path.join(moduleDir, 'package.json'),
      js`
      {
        "name": ${moduleName},
        "main": ${path.join(baseDir, target)}
      }
    `
    );
    type = 'proxy';
  } else {
    // tslint:disable-next-line:no-shadowed-variable
    const stat = fs.statSync(target);
    if (!stat.isDirectory) {
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
  console.log('linkModules1');
  try {
    await mkdir('node_modules');
  // tslint:disable-next-line:no-empty
  } catch (err) {}
  console.log('linkModules2');
  const modules = await Promise.all(
    Object.keys(moduleAliases).map(async (key) => {
      return linkModule(key);
    })
  );
  console.log('link-module-alias:', modules.map(addColor).join(', '));
}

export default {
  async updateAliases(customBaseDir: any, customPackageJsonDir: any) {
    console.log('updateAliases in ', customBaseDir);
    baseDir = customBaseDir;

    try {
      packageJson = JSON.parse(fs.readFileSync(customPackageJsonDir, 'utf8'));
    } catch (err) {
      console.error('Cannot open package.json:', err);
      process.exit(1);
    }
    moduleAliases = packageJson._moduleAliases;
    console.log('_moduleAliases in ', moduleAliases);
    await linkModules();
  },
};
