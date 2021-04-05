const example = (lang) => (greeting) => (userName) => `${lang}: ${greeting} ${userName}!`;
const ex = () => function () {};
const en = example('EN');
// const gr = example('GR');
// const fr = example('FR');

// const enGreeting = en('Good morning')('Alice');
// const grGreeting = gr('Guten Tag');

// enGreeting('Alice');
