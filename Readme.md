
# is/NeuType

Tool for better type checking in javascript. 
You can also create your own type for stricter type enforcement.

<br />

# Table of Contents
1. [ Install ](#install) <br />
2. [ Usage ](#examples) <br />

<br />

<a name="install"></a>
## Install

```console
npm i @neumatter/is
```

<br />

<a name="examples"></a>
## Usage


### Default:

```js
// CJS require
const is = require('@neumatter/is')
const { NeuType } = require('@neumatter/is')
// ESM import
import is, { NeuType } from '@neumatter/is'

is.array([]) // true
is.emptyArray([]) // true
is.falseType([]) // true

is.object({}) // true
is.emptyObject({}) // true

is.string('') // true
is.emptyString('') // true
is.falseType('') // true

is.boolean(false) // true

is.number(NaN) // true
is.NaN(NaN) // true

is.infinite(Infinite) // true

is.null(null) // true
is.falseType(null) // true

is.date(new Date()) // true

is.undefined(undefined) // true
is.falseType(undefined) // true

is.function(NeuType) // true
is.instance(new NeuType(), NeuType) // true

is.symbol(Symbol) // true
```


### Generating Types:

```js
// CJS require
const { NeuType } = require('@neumatter/is')
// ESM import
import { NeuType } from '@neumatter/is'

const arrType = new NeuType([{ hello: 'world' }])
arrType.tag // Array<Object>
arrType.is('Array') // true
arrType.instance(Array) // true
arrType.equals([{ random: 'obj' }]) // true | type must match Array<Object>

// Type From Class
class SomeClass {}
const someClassObj = new SomeClass()
const classObjType = new NeuType(someClassObj)
classObjType.tag // Object[SomeClass]
classObjType.is('Object') // true
classObjType.is('SomeClass') // true
classObjType.is(SomeClass) // true
classObjType.equals(SomeClass) // false
classObjType.new() // returns new instance of SomeClass
`${classObjType}` // Object[SomeClass]
'' + classObjType // Object[SomeClass]
console.log(classObjType) // NeuType [Object[SomeClass]] {}

is.array([]) // true
is.emptyArray([]) // true
is.falseType([]) // true

is.object({}) // true
is.emptyObject({}) // true

is.string('') // true
is.emptyString('') // true
is.falseType('') // true

is.boolean(false) // true

is.number(NaN) // true
is.NaN(NaN) // true

is.infinite(Infinite) // true

is.null(null) // true
is.falseType(null) // true

is.date(new Date()) // true

is.undefined(undefined) // true
is.falseType(undefined) // true

is.function(NeuType) // true
is.instance(new NeuType(), NeuType) // true

is.symbol(Symbol) // true
```
