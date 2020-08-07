function functionA() {
	console.log('A')
}

const functionB = () => {
	console.log('B')
}

const variableC = function functionC () {
	console.log('C')
}

const variableD = function () {
	console.log('D')
};

// Program, ExpressionStatement, CallExpression / ArrowFunctionExpression
((name2) => {
    console.log(name2)
})('somename');

// Program, ExpressionStatement, CallExpression / FunctionExpression
(function (name3) {
    console.log(name3)
})();

// Program, ExpressionStatement, CallExpression / FunctionExpression
(function test(name4) {
    console.log(name4)
})();

export {}; // hint that file is a module
