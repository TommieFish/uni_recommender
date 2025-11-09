# My TS Syntax Notes

### `console.log():`
    Writes the output to the system log. Accessed through terminal when using npm start or npm run dev. Can also be shown in logs section for vercel

### `let x = y:`
    assigns y to x, and allows the variable x to be changed

### `const x = y:`
    assigns y to x, and x cannot be changed anywhere else. Better than let for speed

### `=> :`
    A shorthand for declaring anonymous functions - ones that are used once then discarded. Useful to be used inside the "Functions" section below.

### `x = ...y:`
    creates a copy of the variable y (it can be a list) and assigns it to x. Generally used in functions

### `this:`
    need to know context that a function is executing in. ??

### `x : VARIABLE_TYPE`
    Sets x to the specific variable type. Required for type safety

### `Inside a function using (x : variable_type, y : varialbe_type):`
    Used to define the types of function parameters.

### `@param {type} name -Description`
    Describes the type of the perameter (optional) and a description of what the perameter does (Optional)

### `x ?? y`
    return x if it is not falsy (null). y is default value.

---
## HTML code

### `flex`
    Enables flexbox (allows for other flex related classes to work)

### `flex-col`
    Sets flex direction to column (vertically)

### `flex-row`
    Sets flex direction to row (horizontally)

### `justify-start`
    Aligns items to left

### `justify-center`
    Centers items in flex direction

### `justify-end`
    Aligns items to right

### `space=x=4`
    Adds horizontal spacing between items

### `items-center`
    Vertically centers items within row

### `rounded-full`
    Rounds the element (if equal width and height, is a circle, if wider than tall a pill shape and vice versa)

### `transition-colors`
    enables smooth animation when elements color's change.

### `duration-x`
    Linked to color changing. Sets animation speed

### `hover:x`
    Triggers change (specified by what is after colon)

### `dark:x`
    What is after colon is only shown in dark mode. I use only for text colour

### `focus:`
    prefix yo apply styles when element is in focus state (when clicked). Mainly used for input fields

### `w-x/y`
    sets an element to (x/y) percent of its parent container

### `mb-a`
    Adds a margin of 'a' units at the bottom (basically padding on bottom side)

### `mt-`
    Adds a margin of 'a' units at the top (basically padding on top side)

---
### `<div>`
    Generic container element - used to group & style elements in its container 

### `<options>`
    Defines an option in a dropdown (e.g: <select>)

### `<select>`
    Creates dropdown menu

### `<datalist>`
    Gives user list of predefined options for an <input> element. 

### `<strong>`
    Displays text as bold (basically font-bold)

### `<ul>`
    Defines unordered list. Used mainly for bullet points

### `<thead>`
    defines table header section. Groups one or more tr rows that contain th cells

### `<tr>`
    table row. Defines the horizontal row of cells

### `<th>`
    headers for table row.


### `<main>`


### `[&_x]:`
    Targets any element that matches "x" selector, such as <button> and applies the following clause to all child elements of the "x" selector"
**Example:**
```ts
<div className="[&_button]:hover:bg-blue-100"</div>
```
    Any children of the button selector under the <div> will now inherit the hover styling unless overridden.



---


### `.map():`
Transforms each element using whatever function is the parameter and creates a new array of the results. Very commonly used to skip over needing a for loop.  
**Syntax:**
```ts
array.map((currentValue: number, index: number, arr: arr_type[]) => return `function_to_transform_elements`);
```


### `.ForEach():`
    calls a function for each element in an array. Similar to .map() but doesn`t return an output
**Syntax:** 
```ts
array.forEach((currentValue : number, index : number, arr : arr_type[]), thisValue);
```

### `.filter():`
    Creates a new array with elements that pass the test that is inside the perameters. Doesn`t mutate the original list.
**Syntax:** 
```ts
array.filter((currentValue : number, index : number, arr : arr_type), thisValue);
```

### `.reduce():`
    Executes the function that is specified by the perameters, and returns the accumulated result from the function. Doesn`t mutate the original list
**Syntax:** 
```ts
array.reduce((total : number, currentValue : number, currentIndex : number, arr : arr_type), initialValue);
```

### `.find():`
    Searches the first element in the array, testing the function. Stops execution once match is found. Returns matched elemnt, not index
**Syntax:** 
```ts
array.find(element_to_find)
```

### `.every():`
    checks if all elements in an array pass a test. Returns true if all elements pass and false if not
**Syntax:** 
```ts
array.every(function_to_check_against);
```

### `.parseInt()`
    Takes in a string and returns an int of specific base (e.g: base 10 or base 2)
**Syntax:** 
```ts
    parseInt(input: string, base?: number);
```

### `useEffect()`
    A react hook that runs side effects as soon as the component renders. It effects something outside the component. Dependencies array can be null (so not there), but it controls when the useEffect runs. Uses anonymous functions for efficiency as ease of writing.
**Syntax:** 
```ts
useEffect(() => {
    //code
}, [dependencies])
```

### `.sort():`
    Sorts elements in place and returns sorted array. Basically a bubble sort 
**Syntax:** 
```ts
    array.sort((a: arr_type, b: arr_type) => {
    return a - b; //asc
    });
```

//Function **syntax: ** from w3schools
