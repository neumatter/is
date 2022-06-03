
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

class NeuType {
  #proto
  #creator
  #builtin
  #deeptype
  #custom
  constructor (input, options) {
    const basejs = toBuiltinType(input)
    options = options || {}
    if (options.shallow) {
      this.#proto = null
      this.#builtin = basejs === 'AsyncFunction' ? 'Function' : basejs
      this.#deeptype = null
      this.#custom = null
    } else {
      this.#proto = input?.constructor?.prototype || null
      if (basejs === 'AsyncFunction') {
        this.#builtin = 'Function'
        this.#deeptype = 'AsyncFunction'
      } else {
        this.#builtin = basejs
        this.#deeptype = toDeepType(input, basejs) || null
      }
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

function typeOf (input) {
  return new NeuType(input)
}

class IS {
  static toType (input) {
    return toBuiltinType(input)
  }

  static instance (input, instance) {
    return new NeuType(input).instance(instance)
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static array (input) {
    return IS.toType(input) === 'Array'
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static object (input) {
    return IS.toType(input) === 'Object'
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static emptyObject (input) {
    return IS.toType(input) === 'Object' && !Object.keys(input).length
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static string (input) {
    return IS.toType(input) === 'String'
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static emptyString (input) {
    return input === ''
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static boolean (input) {
    return new NeuType(input, { shallow: true }).is('Boolean')
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static number (input) {
    return new NeuType(input, { shallow: true }).is('Number')
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static null (input) {
    return new NeuType(input, { shallow: true }).is('Null')
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static NaN (input) {
    return new NeuType(input).tag === 'Number[NaN]'
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static infinite (input) {
    return new NeuType(input).is('Infinite')
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static date (input) {
    return new NeuType(input, true).is('Date')
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static undefined (input) {
    return new NeuType(input, { shallow: true }).is('Undefined')
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static function (input) {
    return new NeuType(input, { shallow: true }).is('Function')
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static symbol (input) {
    return new NeuType(input, { shallow: true }).is('Symbol')
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static regex (input) {
    return new NeuType(input, { shallow: true }).is('RegExp')
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static emptyArray (input) {
    return new NeuType(input, { shallow: true }).is('Array') && !input.length
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static falseType (input) {
    return (
      IS.null(input) ||
      IS.undefined(input) ||
      IS.emptyString(input) ||
      IS.emptyArray(input)
    )
  }
}

module.exports = IS

module.exports.NeuType = NeuType
