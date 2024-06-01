import { mkfile, mkdir, getChildren, getName, getMeta, isFile, reduce } from '@hexlet/immutable-fs-trees';
import _ from 'lodash';

// Создание дерева
const tree = mkdir('root', [
  mkdir('etc', [
    mkdir('apache', [
      mkfile('httpd.conf'),
    ]),
    mkdir('nginx', [
      mkfile('nginx.conf'),
    ]),
    mkdir('consul', [
      mkfile('config.json'),
    ]),
  ]),
  mkdir('var', [
    mkdir('log', [
      mkfile('nginx.log'),
      mkfile('system.log'),
    ]),
  ]),
  mkdir('opt', []),
  mkdir('home', []),
]);

// Функция для изменения владельца у всех файлов и директорий
const changeOwner = (node, owner) => {
  const name = getName(node);
  const meta = { ...getMeta(node), owner };
  if (isFile(node)) {
    return mkfile(name, meta);
  }
  const children = getChildren(node);
  const newChildren = children.map(child => changeOwner(child, owner));
  return mkdir(name, newChildren, meta);
};

// Функция вывода имен всех файлов/директорий вместе с именем владельца
const printTree = (node) => {
  const name = getName(node);
  const { owner } = getMeta(node);
  console.log(`${name} (${owner})`);
  if (!isFile(node)) {
    const children = getChildren(node);
    children.forEach(printTree);
  }
};

// Подсчет всех узлов и листьев дерева
const countNodes = (node) => reduce((acc, n) => acc + 1, node, 0);
const countFiles = (node) => reduce((acc, n) => (isFile(n) ? acc + 1 : acc), node, 0);
const countDirs = (node) => reduce((acc, n) => (!isFile(n) ? acc + 1 : acc), node, 0);

// Функция вывода количества файлов в директориях
const printDirFileCounts = (node) => {
  if (isFile(node)) return;
  const name = getName(node);
  const children = getChildren(node);
  const fileCount = children.filter(isFile).length;
  console.log(`${name}: ${fileCount}`);
  children.forEach(printDirFileCounts);
};

// Добавление пустых директорий и вывод их имен
const addEmptyDirs = (node) => {
  if (isFile(node)) return node;
  const name = getName(node);
  const children = getChildren(node);
  const newChildren = [...children, mkdir('empty-dir1'), mkdir('empty-dir2')];
  return mkdir(name, newChildren, getMeta(node));
};

const printEmptyDirs = (node) => {
  if (!isFile(node) && getChildren(node).length === 0) {
    console.log(getName(node));
  } else if (!isFile(node)) {
    getChildren(node).forEach(printEmptyDirs);
  }
};

// Применение функций
const updatedTree = changeOwner(tree, 'user1');
printTree(updatedTree);

console.log('Total nodes:', countNodes(updatedTree));
console.log('Total files:', countFiles(updatedTree));
console.log('Total directories:', countDirs(updatedTree));

printDirFileCounts(updatedTree);

const treeWithEmptyDirs = addEmptyDirs(updatedTree);
printEmptyDirs(treeWithEmptyDirs);
