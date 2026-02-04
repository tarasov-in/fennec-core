/**
 * FennecError - кастомный класс ошибки для fennec-core
 *
 * @param {string} message - Сообщение об ошибке
 * @param {string} name - Имя ошибки
 * @param {Object} object - Дополнительный объект с данными об ошибке
 *
 * @example
 * throw new FennecError('User not found', 'NotFound', { userID: 123 })
 */
export function FennecError(message = '', name = '', object = {}) {
  this.name = `Error${name ? ': ' + name : ''}`
  this.message = message
  this.object = object
}

FennecError.prototype = Error.prototype
