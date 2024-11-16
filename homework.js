// write a variable that is a string and output to console (hint: it's console.log(variable name))
let example = "Hello World";
console.log(example);

// write a variable that is a number and output to console (hint: it's console.log(variable name))
let exampleNumber = 21;
console.log(exampleNumber);

// write a variable that takes any two numbers and adds them 
let addingNumbers = 3 + 5;
console.log(addingNumbers);

// write a variable that takes any two numbers and subtracts them and output to console
let subtractingNumbers = 10 - 3;
console.log(subtractingNumbers);

// write a variable that takes any two numbers and performs a modulo that has a value of 1  and output to console 
let moduloNumbers = 10 % 9;
console.log(moduloNumbers);

// write a variable that takes any two numbers and perform an exponential value and output to console 
let exponentNumber = 2 ** 4;
console.log(exponentNumber);

// write a statement that is false using a conditional statement and output to console 
let a = "Hello";
let b = "Wow";
if (a == b)
{
    console.log(`${a} is equal to ${b}`);
}
else
{
    console.log(`${a} is not equal to ${b}`);
}


// I have created an object below, output to console the value of "breed" (hint: the structure is ObjectName.value you want to call)
// the keyword "this" is self referencing the object 

let siggy = {
    breed : "cat", 
    baby: "big baby", 
    fluffy: "fluffy", 
    output: function() {

        return `Siggy is a ${this.breed} that is a ${this.fluffy} ${this.baby}`

    }
}

// methods! You call methods the same way you call a function.  I'll call siggy.output() below. 

console.log(siggy.output()); 

// copy + paste the siggy object below and rename the variable from Siggy to an animal or name of your choice 
// then, I want you to change the object to the value of your choosing  

let max = {
    breed : "dog", 
    size: "small puppy", 
    mood: "calm", 
    output: function() {

        return `Max is a ${this.breed} that is a ${this.mood} ${this.size}`

    }
}

// console.log the values of that object one by one. 

console.log(max.breed);
console.log(max.mood);
console.log(max.size);
console.log(max.output());


// create an array 
let newArray = ["Bob", "Amy", "Robert", "Dave"];

// call the value in the 3 position of this array and output to console 

let someArray = ["Ishrat", "Is", "Really", "Proud", "Of", "You"]
console.log(someArray[2]); // Count starts at 0 so 3rd position is 2

// call all values in the array using a loop 
for (let i = 0; i < someArray.length; i++)
{
    console.log(someArray[i]);
}


// what is the value of the variable ifStatement, leave your answer in the console. 

let ifStatement; 
let value = 5; 

if(value < 5)
{
    ifStatement = true;
}

else{
    ifStatement = false; 
}
console.log(ifStatement);
console.log("false");