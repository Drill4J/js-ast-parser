function rootA() {
  function rootA_childA() {
    function rootA_childA_ChildE() {
      return true
    }
    return true
  }
  function rootA_ChildB() {
    return true
  }
  return true
}

export { }; // hint that file is a module

/*
expected
  [
    {
      fileName: 'nested-functions.ts',
      methods: [
        {
          name: 'rootA'
        },
        {
          name: 'rootA_ChildA'
        },
        {
          name: 'rootA_ChildA_ChildE'
        },
        {
          name: 'rootA_ChildB'
        },
      ]
    },
  ]
*/
