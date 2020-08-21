import specimen from '../../src/index';

describe('Processor', function () {
  describe('when ran on named function', function () {
    test('that nests named functions must return not-overlapping probe ranges', () => {
      const fixture =
      `function fn0() {
        function fn1() {
          function fn2() {
            function fn3() {
              return true
            }
            return true
          }
          return true
        }
        function fn4() {
          function fn5() {
            return true
          }
          return true
        }
        return true
      }`
      const data = specimen(fixture);
      const functions = data[0].functions;
      
      expect(functions[0].probes).toEqual(expect.not.arrayContaining([
        ...functions[1].probes,
        ...functions[2].probes,
        ...functions[3].probes,
        ...functions[4].probes,
        ...functions[5].probes,
      ]))
  
      expect(functions[1].probes).toEqual(expect.not.arrayContaining([
        ...functions[2].probes,
        ...functions[3].probes,
      ]))
  
      expect(functions[2].probes).toEqual(expect.not.arrayContaining([
        ...functions[3].probes,
      ]))
  
      expect(functions[4].probes).toEqual(expect.not.arrayContaining([
        ...functions[5].probes,
      ]))
  
    });
  
    // TODO add anonymous sibling case
    test('that have named sibling must return not-overlapping probe ranges', () => {
      const fixture =
      `function fn1() {
        return true
      }
      function fn2() {
        return true
      }`
      const data = specimen(fixture);
      const functions = data[0].functions;
      expect(functions[0].probes).toEqual(expect.not.arrayContaining([
        ...functions[1].probes,
      ]))
    });

    test('that nests anonymous function must return a single function with continuous probe range', () => {
      const fixture =
      `function fn0() {
        console.log('');
        (function(){
          console.log('');
        })()
        console.log('');
      }`
      const data = specimen(fixture);
      const functions = data[0].functions;
      expect(functions.length).toBe(1);
      expect(functions[0].probes).toIncludeSameMembers([1, 2, 3, 4, 5, 6, 7]);
    });

    test('that nests alternating anonymous/named functions must return all named functions with separate probe ranges', () => {
      const fixture =
      `function fn0() {
        console.log('');
        (function(){
          console.log('');
          function fn1() {
            console.log('');
            (function(){
              console.log('');
              function fn2() {
                (function(){
                console.log('');
                })()
              }
            console.log('');
            })()
          }
          console.log('');
        })()
        console.log('');
      }`
      const data = specimen(fixture);
      const functions = data[0].functions;
      expect(functions.length).toBe(3);

      expect(functions[0].probes).toEqual(expect.not.arrayContaining([
        ...functions[1].probes,
        ...functions[2].probes,
      ]))

      expect(functions[1].probes).toEqual(expect.not.arrayContaining([
        ...functions[2].probes,
      ]))
    });
  });

})

export default {};
