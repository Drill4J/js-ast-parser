
			const fn = [
				function ifSampleOneLinerTrue() {
					if (true) function foo() {} else function bar() {}
				},
				function ifSampleOneLinerFalse() {
					if (false) function foo() {} else function bar() {}
				},
				function ternaryConsequent() {
					true ?      function meh() {} :      function bah() {};
				},
				function ternaryAlternate() {
					false ?          function meh() {}      : function bah() {};
				},
			]
			function callSamples() {
				fn.forEach(x => x());
			}
		