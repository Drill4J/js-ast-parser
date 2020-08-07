const Something = class {
  constructor() {
    console.log('outer')
  }

  outer() {

  }
}

module Test {
  class Something {
    constructor() {
      console.log('inner')
    }

    inner() {

    }
  }
}

export { }; // hint that file is a module