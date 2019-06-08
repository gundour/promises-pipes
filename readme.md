# promises-pipes

promises-pipes package includes a set of useful functions that simplify dealing with iterative promises.

## Getting Started

### Installation
```
npm i promises-pipes
```

### Usage
```
const {series} = require('promises-pipes')

function promiseFunction(...args) {
	return new Promise((resolve, reject) => {
        setTimeout(function () {
            resolve(args)
        }, 100);
    })
}

let promises = [
	[promiseFunction, 'Hello','World'],
	[promiseFunction, 1, 2, 3],
    [promiseFunction]
]

series(promises)
	.then(results => {
    	// results array
        // [ [ 'Hello', 'World' ], [ 1, 2, 3 ], [] ]
    })
    .catch(err => {
    	throw err
    })
```

## Methods
Each method execute tasks in a different behavior, eather sequencial or parallel.

<b>Task</b></br>
A task is an array ```[promiseFunction, ...args]```, The first item of the array should be a function that returns a promise, and the rest of the items are the arguments that the function expects.


### series
Excute tasks sequentially
```
series([tasks])
```

### seriesTimes
Excute task multiple times sequentially
```
seriesTimes(task, number)
```

### parallel
Excute parallel tasks, does not guarantee the sequence of execution.
```
parallel([tasks])
```

### limitedParallel
Excute parallel tasks but limit the number of running tasks.
```
limitedParallel([tasks], limit)
