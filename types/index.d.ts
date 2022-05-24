
declare module '@neumatter/is'


export declare class NeuType {
  toString: () => string
  tag: string
  class: any
  new: (input: any) => any
  is: (type: any) => boolean
  instance: (instance: any) => boolean
  equals: (input: any) => boolean
}

declare class IS {

  static instance: (input: any, instance: any) => boolean
  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static array: (input:any) => boolean

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static object: (input:any) => boolean
  static emptyObject: (input:any) => boolean

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static string: (input:any) => boolean

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static emptyString: (input:any) => boolean

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static boolean: (input:any) => boolean

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static number: (input:any) => boolean

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static null: (input:any) => boolean

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static NaN: (input:any) => boolean

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static infinite: (input:any) => boolean

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static date: (input:any) => boolean

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static undefined: (input:any) => boolean

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static function: (input:any) => boolean

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static symbol: (input:any) => boolean

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static emptyArray: (input:any) => boolean

  /**
   *
   * @param {*} input
   * @returns {boolean}
   */
  static falseType: (input:any) => boolean
}

export default IS
