const gt = (a) => (b) => (c) => (consequent, alternate) => (a > b ? a > c ? consequent(a) : consequent(c) : alternate(b)) || 'default'
