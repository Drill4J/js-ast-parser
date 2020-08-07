const level0 = {
    level1: {
        level2: {
        }
    }
}
level0.level1.level2 = function () {
    console.log('hello');
}

export {}; // hint that file is a module
