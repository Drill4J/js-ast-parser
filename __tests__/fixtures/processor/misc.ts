// // export default function helloWorld(ok:boolean) { return ok };
export default {
    a() {
        console.log('123')
    },
    b() {

    },
    c() {

    },
}

export function helloWorld2(ok:boolean) { return ok };

const newMethod = (name) => {
    console.log(name)
}

class A {
    
    private me = 123;

    private inject = [
        '123',
        '1234',
        () => {}
    ]

    private inject1 = [
        '123',
        '1234',
        () => {}
    ]

    private _hello: string;
    private maxHelloLength = 10;

    get hello () {
        return this._hello
    }
    set hello (value: string) {
        if (value && value.length > this.maxHelloLength) {
            throw new Error(`hello max length of ${this.maxHelloLength} is exceeded`)
        }
        this._hello = value
    }

    constructor() {
        console.log(('class a'))
    }
}

// filename/a/constructor
// filename/Whatever/b/constructor

module Whatever {
    class B {
        constructor() {
            console.log(('class b'))
        }
    
        b(params: string) {
            
        }
    
        с(params: number) {
            
        }
    }
    function test() {

    }
}

// Program ExpressionStatement ArrowFunctionExpression
(name2) => { // ignored because Program / ExpressionStatement is in ignored list (ExpressionStatement.expression could be anything!) but it is valuable approach because it ensures only top-level selection
    console.log(name2)
}

const a = function() { 
    return true
}

// file/b/c/e

function b() {
    function c() { 
        function e() { 
            return true
        }
        return true
    }
    function d() { 
        return true
    }
    return true
}

//partial line coverage const a = c > b ? (function(){}()) : 0;

let one = (nameOne) => { console.log(nameOne) },
    two = (nameTwo) => { console.log(nameTwo) }

//export const happy = 'happy birthday'
//export default 'to you'

export const quick = { // mistakenly eaten by variable declaration, check it!
    fox: function() {

    },
    jumped: () => {},
    over() {},
    lazy: function dog() {},
    abc
};

function abc() {
}

const quick2 = { // mistakenly eaten by variable declaration, check it!
    fox: function() {
        console.log('abc')
    },
    jumped: () => {},
    over() {},
    lazy: function dog() {}
};
export { quick2 };

// Program ExpressionStatement CallExpression / ArrowFunctionExpression
((name2) => {
    console.log(name2)
})();

// Program ExpressionStatement CallExpression / FunctionExpression
(function (name3) {
    console.log(name3)
})();

// Program ExpressionStatement CallExpression / FunctionExpression (that's weird, why not FunctionDeclaration)
(function test(name4) {
    console.log(name4)
})();

export const itIsAnArrayExpression =  [
    (a) => a + 1,
    (b) => b + 2,
]

// methods/members(?) of a single class
// functions in Program node (exported, not exported / named, anonymous, declared via variable)
// functions in TSModuleBlock node
// functions as object properties

// both functions & classes in Program node
// Immediately-invoked Function Expressions (IIFE) in Program node
// multiple classes
// class inside TSModuleBlock node

//      methods of different classes with the same names (e.g. constructor, or anything else)
//      function declared next to class & that class methods with the same names