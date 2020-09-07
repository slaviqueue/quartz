# quartz

I'm developing this language to practice my mad programming language design skills. It compiles to javascript.

### DISCLAIMER
I haven't implemented module system yet and I don't want to keep std stuff in global scope.
So for now, code examples compiled to js will not work, because of lack of
implementations of functions like `print`, `pThen` and `pCatch` (`.then` and `.catch` for promises) etc

### What is this for

I'm trying to solve some problems which I'm facing in front-end (or backend with nodejs) development.
This language is targeted to be safer and more ergonomic than JS.

So, what do we have here:

- Static type checking
- Type inference
- Function purity by default, one should specify function impurity manually by using `impure` keyword
- Variable immutability by default
- Pipe operator

### Some code examples

#### Hello, world:

```
print('Hello, world!')
```

or with pipe

```
'Hello, world!' |> print
```

#### Pure/impure functions:

All functions in quartz are pure by default. Which means that you:
- Are not allowed to use impure functions from pure ones
- Are not allowed to use mutable variables which were declared in parent scopes from pure functions

So, this code will break in compile time with error which tells that you're doing some side-effects inside pure function:
```
impure fn fetchStuff () {
  fetch('http://someapi.com/data')
}

fn doSomeCalculations () {
  fetchStuff()
    |> pThen(sortOutAllBelow(50))
    |> pThen(getAverage)
    |> pCatch()
}
```

To fix this, one can add `impure` keyword before declaring `doSomeCalculations`, but it's better to move data fetching from it.

### Issues so far

#### - No explicit return statement

Not sure if it will be introduced since everything is an expression and in js "return" is a statement

#### - Reserved js keywords cannot be used as identifiers

For example despite there's no such keyword as "const" in quartz, using it as an identifier will lead to a runtime error
