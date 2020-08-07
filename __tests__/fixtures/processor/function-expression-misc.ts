// method definition
class A {
  doStuff() { }
}

//object property
const some = {
  deep: {
    nested: {
      fn: function doStuff() { },
      // anonymous function expression
      anonymousFn: function () { }
    }
  }
}

// assignment expression - member expression
const another = { deep: { nested: { fn: null } } }
another.deep.nested.fn = function doStuff() { }

// assignment expression - member expression - anonymous function expresion
const oneMore = { deep: { nested: { anonymousFn: null } } }
oneMore.deep.nested.anonymousFn = function () { }

// assignment expression - variable
let hello
hello = function doNot() { } // TODO think if output should either be hello.doNot or just doNot (look at member expression case above for consistency)

// assignment expression - variable - anonymous function expresion
var hello2
hello2 = function () { }

//variable declarator
const test = function doStuff() { }

//variable declarator - anonymous function expresion
const test2 = function () { }

// object property 
const a = {
  b: {
    ["1" + "2"]: null
  }
}
a.b[1 + 2] = function () { }

export { };