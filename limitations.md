# Known limitations

## Naming collisions

Following examples display sourcefiles that will produce multiple functions with same names.
Currently functions from this examples are impossible to distinguish from their same-named counterparts.

### Block statements

```
  function a () {
    console.log('im first')
  }
  for (let index = 0; index < array.length; index++) {
     function a() { // can't distinguish, naming collision
      alert(x)
    }
  }
```

### IIFEs

```
  function a() {
    console.log('im first')
  }
  (function(){
    function a() { // can't distinguish, naming collision
      console.log('im second')
    }
  })()
```

### Lone array expressions (not assigned to any `variable` / `const` / `property`)

```
  function a() {
    console.log('im first')
  }
  [
    function a() { // can't distinguish, naming collision
      console.log('im second')
    }
  ]
```

**Note**: functions inside array expression assigned to a `var`, `const` or `property` will produce correct result

_valid example_:

```
  function a() {
    console.log('im first')
  }
  const someArray = [
    function a() { // will get "someArray[0].a" name
      console.log('im second')
    }
  ]
```

### Functions nested in elements of array expressions

Algorithm is unable to distinguish between functions nested inside objects that are elements of an array

```
  function a() {
    console.log('im first')
  }
  const arr = [
    {
      a () {} // we all look the same
    },
    {
      a () {}  // we all look the same
    },
  ]
```

_valid example_: though functions nested in array directly will get distinct names

```
  function a() {
    console.log('im first')
  }
  const arr = [
    a () {}, // will return function name "arr.0.a"
    a () {}, // will return function name "arr.1.a"
  ]
```
