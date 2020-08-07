// export default {
const wrapper = {
  brown() { },
  fox: function () { },
  jumped: () => { },
  over,
  theLazy: function dog() { },
  annoying: {
    nested: {
      stuff: function (treat) {
        console.log('tasty', treat)
      },
      named: function dog(treat) {
        console.log('tasty', treat)
      },
    }
  }
}

function over() { }

function dog() { }

export { }; // hint that file is a module

/*
  line 15 col 15
  line 20 col 50
  default.brown

  default.fox
  default.jumped
  ...
  default.dog
  default.annoying.nested.stuff.dog

  dog
*/