const { log } = require('console');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

const dir1 = 'D:/CODING/code/software_architecture/CS2-SoftwareArchitecture/uploads';
const dir2 = 'D:/CODING/code/software_architecture/CS2-SoftwareArchitecture/output';
// const relativeDir1 = '../uploads';
// const relativeDir2 = '../output';

(async () => {
    await rimraf.rimraf(dir1);
    await rimraf.rimraf(dir2);
})();

setTimeout(() => {
    fs.mkdir(dir1, { recursive: true }, (err) => { });
    fs.mkdir(dir2, { recursive: true }, (err) => { });
}, 100);

(async () => {
    await rimraf.rimraf(dir1);
    await rimraf.rimraf(dir2);
})();

setTimeout(() => {
    fs.mkdir(dir1, { recursive: true }, (err) => { });
    fs.mkdir(dir2, { recursive: true }, (err) => { });
}, 100);