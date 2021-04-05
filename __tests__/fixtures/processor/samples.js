
const fn = [
	function ifSingleTrue() {
		if (true) return;
	},
	function ifSingleFalse() {
		if (false) return;
	},
	function ifSingleTrue() {
		if (true) function foo() {}
	},
	function ifSingleFalse() {
		if (false) function foo() {}
	},
	function ifTrue() {
		if (true) {
			function foo() {}
		} else {
			function bar() {}
		}
	},
	function ifFalse() {
		if (false) {
			function foo() {}
		} else {
			function bar() {}
		}
	},
	function ifSampleOneLinerTrue() {
		if (true) console.log(1); else console.log(2);    console.log('whatever');
	},
	function ifSampleOneLinerFalse() {
		if (false) console.log(1); else console.log(2);    console.log('whatever');
	},
	function ternaryConsequent() {
		true ?      console.log(1) :      console.log(2);    console.log('whatever');
	},
	function ternaryAlternate() {
		false ?     console.log(1) :      console.log(2);    console.log('whatever');
	},
	function switchSample () {
			console.log('Sample function called');
			switch (null) {
					case 0:
							console.log('0');
							break;
					case 1:
							console.log('1');
							break;
					default:
							console.log("default");
							break;
			};
	},
	function logical() {
		false && true;
		true || false;
		true && true && false && true
	},
	function loop(array = []) {
		for (let index = 0; index < array.length; index++) {
			const element = array[index];
		}
	},
	function loopBreak(array = [1, 2, 3]) {
		for (let index = 0; index < array.length; index++) {
			break;
			console.log();
		}
	},
	function loopContinue(array = [1, 2, 3]) {
		for (let index = 0; index < array.length; index++) {
			continue;
			console.log();
		}
	},
	function tryCatchFinally() {
		try {
			console.log(1);
		} catch (e) {
			console.log(2);
		} finally {
			console.log(3);
		}
	}
]
function callSamples() {
	fn.forEach(x => x());
}
