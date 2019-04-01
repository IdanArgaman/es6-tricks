/**************/
/* ES6 Tricks */
/**************/

////////////////////////
/* Nested Destructing */
////////////////////////

const user = {
  id: 339,
  name: 'Fred',
  age: 42,
  education: {
    degree: 'Masters'
  }
};
const {education: {degree}} = user;

console.log(degree); //prints: Masters

////////////////////////////
/* Dynamic Property Names */
////////////////////////////

let  city= 'sheffield_';

let a = {
    [ city + 'population' ]: 350000
};

a[ city + 'county' ] = 'South Yorkshire';

console.log(a); 

///////////////////////////////////
/* Enforcing required parameters */
///////////////////////////////////

const required = () => {throw new Error('Missing parameter')};

//The below function will throw an error if either "a" or "b" is missing.

const add = (a = required(), b = required()) => a + b;
add(1, 2) //3
// add(1)    // Error: Missing parameter.

/////////////////////////////////////
/* Using reduce for filter and Map */
/////////////////////////////////////

const numbers = [10, 20, 30, 40];
const doubledOver50 = numbers.reduce((finalList /* accamulator */, num) => {
  
  num = num * 2; //double each number (i.e. map)
  
  //filter number > 50
  if (num > 50) {
    finalList.push(num);
  }

  return finalList;
}, []);

doubledOver50; // [60, 80]

//////////////////////////////////////////
/* Using reduce to count items in array */
//////////////////////////////////////////

var cars = ['BMW','Benz', 'Benz', 'Tesla', 'BMW', 'Toyota'];
var carsObj = cars.reduce(function (obj, name) { 
   obj[name] = obj[name] ? /* note ! */ ++obj[name] : 1;
  return obj;
}, {});

console.log(carsObj); // => { BMW: 2, Benz: 2, Tesla: 1, Toyota: 1 }

/////////////////////////////////////////////////
/* Removing unwanted properties from an object */
/////////////////////////////////////////////////

let {_internal, tooBig, ...cleanObject} = {el1: '1', _internal:"secret", tooBig:{}, el2: '2', el3: '3'};
console.log(cleanObject); // {el1: '1', el2: '2', el3: '3'}

///////////////////
/* Merge objects */
///////////////////

let object1 = { a:1, b:2,c:3 }
let object2 = { b:30, c:40, d:50}
let merged = {...object1, ...object2} //spread and re-add into merged
console.log(merged) // {a:1, b:30, c:40, d:50}

////////////////////////////
/* Remove dups from array */
////////////////////////////

let arr = [1, 1, 2, 2, 3, 3];
//let deduped = [...new Set(arr)] // [1, 2, 3] -> Set's constructor accepts an array

////////////////////////////////////////////////
/* Convert set to array and use array methods */
////////////////////////////////////////////////

let mySet = new Set([1,2, 3, 4, 5]);
//var filtered = [...mySet].filter((x) => x > 3) // [4, 5]

////////////////////
/* Swap using es6 */
////////////////////
let param1 = 1;
let param2 = 2;


// swap and assign param1 & param2 each others values

[param1, param2] = [param2, param1];
console.log(param1) // 2
console.log(param2) // 1

/////////////////////////////////////////////////////////////
/* Using array.entries and destrcuting to simulate forEach */
/////////////////////////////////////////////////////////////

const arr = ['a', 'b', 'c'];
for (const [index, elem] of /* Note */  arr.entries()) {
    console.log(`index = ${index}, elem = ${elem}`);
}

//////////////////////
/* class expression */
//////////////////////

var Rectangle = class /* note no name */ {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
  area() {
    return this.height * this.width;
  }
}

/* A class signature from MDN:

  var MyClass = class [className] [extends] {
    // class body
  };

  So, we can see that the class name is not mandatory
*/

///////////
/* MIXIN */
///////////

// This is a function that returns class that extend the supplied class by 
// adding a save method
const Storage = Sup => class extends Sup {
    save(database) {  }
};

// This is a function that returns class that extend the supplied class by 
// adding a validate method
const Validation = Sup => class extends Sup {
    validate(schema) { }
};

class Person {  }

// Applying mixins on Person
class Employee extends Storage(Validation(Person)) {  }

//////////////////////////////////////////
/* Log variable with its name and value */
//////////////////////////////////////////

let myVar = 'foo';
// output:
// {myVar: "foo"}
console.log({myVar});

//////////////////////////
/* Coercing to a string */
//////////////////////////

// We ensure that the provide number is a string
let num = 2;
let numString = `${num}`; // Replaces the old: let numString = num + '';

// output:
// {num: 2, numString: "2"}
console.log({num, numString});

////////////////////////////////////////
/* Enforcing maximum number of params */
////////////////////////////////////////

function max(a, b, c, ...shouldBeEmpty) {
	if (shouldBeEmpty.length > 0)
		throw Error('max 3 parameters allowed!');

	return Math.max(a, b, c);
};

// not an error
// output 6
max(4, 5, 6);

// error!
// max(4, 5, 6, 7);

///////////////////////////
/* Add timeout to fetch  */
///////////////////////////

// Wrap `setTimeout` in a promise such that if
// the timeout completes, the promise is rejected

const timeout = (delay = 30000) => {
    return new Promise((resolve, reject) => {
        let rejectWithError = () => {
            reject(new Error('Timed out!'));
        };

        setTimeout(rejectWithError, delay);
    });
}

// Return a promise that will be fulfilled if
// the fetch is fulfilled before the timeout
// is rejected.

const fetchWithTimeout = (url, delay = 3000) => {
	// construct an array to pass to `Promise.race`
  // !!!!!!!!!!!!!NOTE!!!!!!!!!!!!
	return Promise.race([
		fetch(url),
		timeout(delay)
	]);
}

// Make an XHR request for the URL that has to
// return a response *before* the 1 s timeout
// happens

fetchWithTimeout('/json/data.json', 1000)
    .then(response => {
    	// successful response before the 1 s timeout
    	console.log('successful response', response)
    })
    .catch((e) => {
    	// Either the timeout occurred or some other error.
    	// Would need to check the method or use a custom
    	// `Error` subclass in `timeout`
    	console.error('request error', e);
    });


/////////////////////////////
/* Simulate abstarct class */
/////////////////////////////

/* The new.target property lets you detect whether a function or constructor was called using 
   the new operator. In constructors and functions instantiated with the new operator, 
   new.target returns a reference to the constructor or function. In normal function calls, 
   new.target is undefined */

class Note {
	constructor() {
		if (new.target === Note) {  /* Did the Note consturctor was used ??? */
			throw new Error('Note cannot be directly constructed.')
		}
	}
}
class ColorNote extends Note {

}


//let note = new Note();			   // error!
let colorNote = new ColorNote();   // ok

/* Lazy range function */

function* range(start, count) {
    for (let delta = 0; delta < count; delta++) {
        yield start + delta;
    }
}

for (let teenageYear of range(13, 7)) {
    console.log(`Teenage angst @ ${teenageYear}!`);
}

//////////////////////////////////
/* ES6 Tagged Template Literals */
//////////////////////////////////

const myTag = (literals, ...vals) => {
  console.log('Literals:', literals); //Output -> Literals [ 'Hello ', '!' ]
  console.log('Interpolation:', vals); //Output -> Interpolation Steve

  return 'Result from myTag';
};

const name = 'Steve';
const jobs = 'jobs';

const result = myTag `Hello ${name} ${jobs}!`;

console.log(result); //Output -> Result from myTag

///////////////
/* ES6 - let */
///////////////

// 1

function varTest() {
  var x = 1;
  if (true) {
    var x = 2;  // same variable!
    console.log(x);  // 2
  }
  console.log(x);  // 2
}

function letTest() {
  let x = 1;
  if (true) {
    let x = 2;  // different variable
    console.log(x);  // 2
  }
  console.log(x);  // 1
}

// 2

var r1 = 'global';
let r2 = 'global';
console.log(this.r1); // "global"     //doesn't work on stackblitz (this shold be window)
console.log(this.r2); // undefined

// 3 - Emulating private members

var Thing;

{
  let privateScope = new WeakMap(); // can't be access outside the block
  let counter = 0;

  Thing = function() {
    this.someProperty = 'foo';
    
    privateScope.set(this, {
      hidden: ++counter,
    });
  };

  Thing.prototype.showPublic = function() {
    return this.someProperty;
  };

  Thing.prototype.showPrivate = function() {
    return privateScope.get(this).hidden;
  };
}

console.log("privateSscope:", typeof privateScope); // "undefined"
console.log("counter:", typeof counter); // "undefined"

var thing = new Thing();

// Thing {someProperty: "foo"}
// Note that we can't see "hidden" in the console
console.log(thing); 

console.log(thing.showPublic()); // "foo"
console.log(thing.someProperty); // "foo" -> direct access
console.log(thing.showPrivate()); // 1

// 4

var a = 1;
var b = 2;

if (a === 1) {
  var a = 11; // the scope is global
  let b = 22; // the scope is inside the if-block

  console.log(a);  // 11
  console.log(b);  // 22
} 

console.log(a); // 11
console.log(b); // 2

///////////////
/* let - TDZ */
///////////////

/* Unlike variables declared with var, which will start with the value undefined, 
let variables are not initialized until their definition is evaluated. Accessing 
the variable before the initialization results in a ReferenceError. The variable 
is in a "temporal dead zone" from the start of the block until the initialization 
is processed. */

console.log(typeof undeclaredVariable);
// results in a 'ReferenceError'
console.log(typeof tdz);
let tdz = 10;


