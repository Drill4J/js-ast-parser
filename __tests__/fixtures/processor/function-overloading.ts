var say = Function.create(false , [
  function(msg1) {
      console.log(msg1);
  },
  function(msg1 , msg2) {
      var concat = msg1 + " , " + msg2;
      console.log(concat);
  },
  function(msg1 , msg2 , msg3 , msg4) {
      var concat = msg1 + " , " + msg2 + " , " + msg3;
      console.log(concat);
  }
]);