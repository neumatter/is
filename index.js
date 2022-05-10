
const toSymbol = input => {
  return Object.prototype.toString.call(input).slice(8, -1)
}

const toFirstUpperCase = input => {
  const first = input.slice(0, 1).toUpperCase()
  const rest = input.slice(1)
  return first + rest
}

const NOT_NUM_REGEX = /[a-z]+/i

function mapSubtype (input = 'Default', type) {
  const map = {
    Object: input?.constructor?.name !== 'Object' 
      ? input?.constructor?.name 
      : null,
    Function: input?.name || null,
    Number: input !== null && NOT_NUM_REGEX.test(input.toString())
      ? input.toString().match(NOT_NUM_REGEX)[0] 
      : null,
    Array: input && input[0] 
      ? toSymbol(input[0])
      : null,
    Default: null
  }
  return map[type] || null
}

export class NeuType {
  #proto
  constructor (input, shallow) {
    const basejs = toSymbol(input)
    if (shallow) {
      this.#proto = null
      this.primary = basejs
      this.secondary = null
    } else {
      this.#proto = input?.__proto__ || null
      this.primary = basejs
      this.secondary = mapSubtype(input, basejs)
    }
  }

  get type () {
    return (
      (this.primary === 'Array' && `Array<${this.secondary || 'any'}>`) ||
      (!this.secondary && this.primary) ||
      (`${this.primary}[${this.secondary}]`)
    )
  }

  is (type) {
    const instance = (obj) => this.instance(obj)
    const istype = (el) => {
      el = toFirstUpperCase(el)
      return (
        (this.primary === el) ||
        (this.secondary === el) ||
        false
      )
    }
    return (typeof type === 'string' ? istype : instance)(type)
  }

  instance (instance) {
    if (!this.#proto) return false
    if (this.#proto === instance.prototype) return true
    let count = 0
    const nextInst = proto => {
      ++count
      return (count > 10 || !instance.prototype || !proto.__proto__)
        ? false 
        : (proto.__proto__ === instance.prototype)
          ? true 
          : nextInst(proto.__proto__)
    }
    return nextInst(this.#proto)
  }

  equals (input) {
    return this.type === new NeuType(input).type
  }
}

export function typeOf (input) {
  return new NeuType(input)
}

export default class IS {
  static toType = (input) => {
    return toSymbol(input)
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
  static string = input => {
    return IS.toType(input) === 'String'
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static emptyString = input => {
    return new NeuType(input).is('String') && input === ''
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static boolean = input => {
    return new NeuType(input, true).is('Boolean')
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static number = input => {
    return new NeuType(input, true).is('Number')
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static null = input => {
    return new NeuType(input, true).is('Null')
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static NaN = input => {
    return new NeuType(input).type === 'Number[NaN]'
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
    return new NeuType(input, true).is('Undefined')
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static function = input => {
    return new NeuType(input, true).is('Function')
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static symbol = input => {
    return new NeuType(input, true).is('Symbol')
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static emptyArray = input => {
    return new NeuType(input, true).is('Array') && !input.length
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
