
const toBuiltinType = input => {
  return Object.prototype.toString.call(input).slice(8, -1)
}

const toFirstUpperCase = input => {
  const first = input.slice(0, 1).toUpperCase()
  const rest = input.slice(1)
  return first + rest
}

const NOT_NUM_REGEX = /[a-z]+/i

function toCustomType (input = 'Default', type) {
  const map = {
    Object: input?.constructor?.name !== 'Object' 
      ? input?.constructor?.name 
      : null,
    Function: input?.prototype?.constructor?.name || null,
    Default: null
  }
  return map[type] || null
}

function toDeepType (input = 'Default', type) {
  const map = {
    Number: input !== null && NOT_NUM_REGEX.test(input.toString())
      ? input.toString().match(NOT_NUM_REGEX)[0] 
      : null,
    Array: input && input[0] 
      ? toBuiltinType(input[0])
      : null,
    Default: null
  }
  return map[type] || null
}

export class NeuType {
  #proto
  #creator
  #builtin
  #deeptype
  #custom
  constructor (input, { shallow = false }) {
    const basejs = toBuiltinType(input)
    if (shallow) {
      this.#proto = null
      this.#builtin = basejs
      this.#deeptype = null
      this.#custom = null
    } else {
      this.#proto = input?.constructor?.prototype || null
      this.#builtin = basejs
      this.#deeptype = toDeepType(input, basejs) || null
      this.#custom = toCustomType(input, basejs) || null
      if (/Function\[[a-zA-Z]+]/.test(this.tag)) {
        this.#creator = input
      }
      if (/Object\[[a-zA-Z]+]/.test(this.tag) && this.#deeptype) {
        this.#creator = input.constructor || null
      }
    }
  }

  [Symbol.toPrimitive] (hint) {
    return this.tag
  }

  get [Symbol.toStringTag] () {
    return this.tag
  }

  toString () {
    return this.tag
  }

  get tag () {
    return (
      (this.#custom && `${this.#custom}[${this.#builtin.toLowerCase()}]`) ||
      (this.#builtin === 'Array' && `Array<${this.#deeptype || 'any'}>`) ||
      (!this.#deeptype && this.#builtin) ||
      (`${this.#builtin}[${this.#deeptype || 'any'}]`)
    )
  }

  get class () {
    return (
      (this.#creator && this.#deeptype) ||
      null
    )
  }

  new (input) {
    if (this.#creator) return new this.#creator(input)
  }

  is (type) {
    const instance = (obj) => this.instance(obj)
    const istype = (el) => {
      el = toFirstUpperCase(el)
      return (
        (this.#builtin === el) ||
        (this.#builtin !== 'Array' && this.#deeptype === el) ||
        (this.#custom === el) ||
        false
      )
    }
    return (typeof type === 'string' ? istype : instance)(type)
  }

  instance (instance) {
    return this.#proto instanceof instance
  }

  equals (input) {
    return this.tag === new NeuType(input).tag
  }
}

export function typeOf (input) {
  return new NeuType(input)
}

export default class IS {
  static toType = (input) => {
    return toBuiltinType(input)
  }

  static instance = (input, instance) => {
    return new NeuType(input).instance(instance)
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static array = input => {
    return IS.toType(input) === 'Array'
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static object = input => {
    return IS.toType(input) === 'Object'
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static emptyObject = input => {
    return IS.toType(input) === 'Object' && !Object.keys(input).length
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static string = input => {
    return IS.toType(input) === 'String'
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static emptyString = input => {
    return input === ''
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static boolean = input => {
    return new NeuType(input, { shallow: true }).is('Boolean')
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static number = input => {
    return new NeuType(input, { shallow: true }).is('Number')
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static null = input => {
    return new NeuType(input, { shallow: true }).is('Null')
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static NaN = input => {
    return new NeuType(input).tag === 'Number[NaN]'
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static infinite = input => {
    return new NeuType(input).is('Infinite')
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static date = input => {
    return new NeuType(input, true).is('Date')
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static undefined = input => {
    return new NeuType(input, { shallow: true }).is('Undefined')
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static function = input => {
    return new NeuType(input, { shallow: true }).is('Function')
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static symbol = input => {
    return new NeuType(input, { shallow: true }).is('Symbol')
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static emptyArray = input => {
    return new NeuType(input, { shallow: true }).is('Array') && !input.length
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static falseType = input => {
    return (
      IS.null(input) ||
      IS.undefined(input) ||
      IS.emptyString(input) ||
      IS.emptyArray(input)
    )
  }
}

console.log(new NeuType(IS.array).tag)
console.log(new NeuType({}).tag)
console.log(new NeuType(Date.now()).tag)
console.log(new NeuType([{ hello: 'world' }]).tag)
console.log(new NeuType('').tag)
console.log(new NeuType(null).tag)
console.log(new NeuType(NaN).tag)
console.log(new NeuType(Promise).tag)
console.log(new NeuType(NeuType).tag)
const neutype = new NeuType(Promise)
console.log(`${neutype}`)
console.log('' + neutype)
console.log(neutype)


function toCharCodesAt(str, id) {
  id = id || 0
  const code = str.charCodeAt(id)
  if (0xD800 <= code && code <= 0xDBFF) {
    let hi = code
    let low = str.charCodeAt(id + 1)
    if (isNaN(low)) {
      throw 'High surrogate not followed by ' +
        'low surrogate in fixedCharCodeAt()'
    }
    return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000
  }
  if (0xDC00 <= code && code <= 0xDFFF) return false
  return code
}

function toCharCodes (input) {
  if (!input.length) return ''
  const charCodes = []
  const { length } = input
  let index = -1
  while (++index < length) {
    const code = toCharCodesAt(input, index)
    if (code === false) continue
    charCodes.push(code)
    // if (code <= 127) charCodes.push(code)
    if (index >= 100) return charCodes.join(' ')
  }
  return charCodes.join(' ')
}
