export default class IS {
  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static array = input => {
    return Array.isArray(input) && typeof input === 'object'
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static object = input => {
    return typeof input === 'object' && input !== null && !Array.isArray(input)
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static string = input => {
    return typeof input === 'string'
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static emptyString = input => {
    return typeof input === 'string' && input === ''
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static boolean = input => {
    return typeof input === 'boolean'
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static number = input => {
    return typeof input === 'number'
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static null = input => {
    return input === null && typeof input === 'object'
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static NaN = input => {
    return typeof input === 'number' && isNaN(input)
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static infinite = input => {
    return typeof input === 'number' && !isFinite(input)
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static date = input => {
    return (
      typeof input === 'object' &&
      input !== null &&
      typeof input.getMonth === 'function'
    )
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static undefined = input => {
    return input === undefined && typeof input === 'undefined'
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static function = input => {
    return typeof input === 'function'
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static symbol = input => {
    return typeof input === 'symbol'
  }

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static emptyArray = input => {
    return IS.array(input) && !input.length
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
