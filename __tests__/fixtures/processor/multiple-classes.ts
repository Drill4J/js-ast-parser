class HelloController {
  constructor() {
    console.log('HelloController') //ignore that
  }

  //ignore next
  twin() {
    console.log('twin from HelloController')
  }

  hello() {
    console.log('hello')
  }
}

//ignore block
class ByeController {
  constructor() {
    console.log('ByeController')
  }

  twin() {
    console.log('twin from ByeController')
  }

  bye() {
    console.log('bye');
  }
}

function lonelyFunction() {
  console.log('lonelyFunction')
}

export { }; // hint that file is a module

/*expected
  [
    {
      fileName: 'multiple-classes.ts/classA',
      methods: [
        {
          name: 'constructor'
        },
        {
          name: 'twin'
        },
        {
          name: 'lone'
        },
      ]
    },
    {
      fileName: 'multiple-classes.ts/classB',
      methods: [
        {
          name: 'constructor'
        },
        {
          name: 'twin'
        },
        {
          name: 'diff'
        },
      ]
    },
    {
      fileName: 'multiple-classes.ts',
      methods: [
        {
          name: 'standalone'
        }
      ]
    }
  ]
*/