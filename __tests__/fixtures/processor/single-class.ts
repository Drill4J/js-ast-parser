class A {
  constructor() {
    console.log('class A')
  }

  twin() {
    console.log('class A twin')
  }

  lone() {
    console.log('class A lone')
  }
}

export {}; // hint that file is a module

/*
expected
  [
    {
      fileName: 'single-class.ts',
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
  ]
*/