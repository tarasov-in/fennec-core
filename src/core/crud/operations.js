import { GET, POST, GETP, POSTP } from './http'
import { QueryParams } from '../query'

/**
 * CREATE - создание объекта
 *
 * @param {Object} auth - Объект аутентификации
 * @param {string} name - Название модели
 * @param {Object} object - Объект для создания
 * @param {Function} callback - Callback при успехе
 * @param {Function} error - Callback при ошибке
 *
 * @example
 * CREATE(auth, 'users', { name: 'John', email: 'john@example.com' },
 *   (res) => console.log('Created:', res.data),
 *   (err) => console.error('Error:', err)
 * )
 */
export const CREATE = (auth, name, object, callback, error) => {
  POST(auth, '/api/query-create/' + name.toLowerCase(), object, callback, error)
}

/**
 * READ - чтение всех объектов
 *
 * @param {Object} auth - Объект аутентификации
 * @param {string} name - Название модели
 * @param {Function} callback - Callback при успехе
 * @param {Function} error - Callback при ошибке
 *
 * @example
 * READ(auth, 'users',
 *   (res) => console.log('Data:', res.data),
 *   (err) => console.error('Error:', err)
 * )
 */
export const READ = (auth, name, callback, error) => {
  GET(auth, '/api/query/' + name.toLowerCase(), callback, error)
}

/**
 * READWITH - чтение с query параметрами
 *
 * @param {Object} auth - Объект аутентификации
 * @param {string} name - Название модели
 * @param {Array|string} queryParams - Query параметры
 * @param {Function} callback - Callback при успехе
 * @param {Function} error - Callback при ошибке
 *
 * @example
 * READWITH(auth, 'users', [QueryParam('age', 25), QueryOrder('name', 'asc')],
 *   (res) => console.log('Data:', res.data),
 *   (err) => console.error('Error:', err)
 * )
 */
export const READWITH = (auth, name, queryParams, callback, error) => {
  let ext = QueryParams(queryParams)
  GET(auth, '/api/query/' + name.toLowerCase() + (ext ? '?' + ext : ''), callback, error)
}

/**
 * UPDATE - обновление объекта
 *
 * @param {Object} auth - Объект аутентификации
 * @param {string} name - Название модели
 * @param {Object} object - Объект для обновления (должен содержать ID)
 * @param {Function} callback - Callback при успехе
 * @param {Function} error - Callback при ошибке
 *
 * @example
 * UPDATE(auth, 'users', { ID: 123, name: 'John Doe' },
 *   (res) => console.log('Updated:', res.data),
 *   (err) => console.error('Error:', err)
 * )
 */
export const UPDATE = (auth, name, object, callback, error) => {
  POST(auth, '/api/query-update/' + name.toLowerCase(), object, callback, error)
}

/**
 * DELETE - удаление объекта
 *
 * @param {Object} auth - Объект аутентификации
 * @param {string} name - Название модели
 * @param {number} id - ID объекта для удаления
 * @param {Function} callback - Callback при успехе
 * @param {Function} error - Callback при ошибке
 *
 * @example
 * DELETE(auth, 'users', 123,
 *   (res) => console.log('Deleted:', res.data),
 *   (err) => console.error('Error:', err)
 * )
 */
export const DELETE = (auth, name, id, callback, error) => {
  GET(auth, '/api/query-delete/' + name.toLowerCase() + '/' + id, callback, error)
}

// ==================== Promise-based API ====================

/**
 * CREATEP - создание объекта (Promise)
 *
 * @param {Object} auth - Объект аутентификации
 * @param {string} name - Название модели
 * @param {Object} object - Объект для создания
 * @returns {Promise} Promise с результатом
 *
 * @example
 * const result = await CREATEP(auth, 'users', { name: 'John' })
 * console.log('Created:', result.data)
 */
export const CREATEP = (auth, name, object) => {
  return POSTP(auth, '/api/query-create/' + name.toLowerCase(), object)
}

/**
 * READP - чтение всех объектов (Promise)
 *
 * @param {Object} auth - Объект аутентификации
 * @param {string} name - Название модели
 * @returns {Promise} Promise с результатом
 *
 * @example
 * const result = await READP(auth, 'users')
 * console.log('Data:', result.data)
 */
export const READP = (auth, name) => {
  return GETP(auth, '/api/query/' + name.toLowerCase())
}

/**
 * READWITHP - чтение с query параметрами (Promise)
 *
 * @param {Object} auth - Объект аутентификации
 * @param {string} name - Название модели
 * @param {Array|string} queryParams - Query параметры
 * @returns {Promise} Promise с результатом
 *
 * @example
 * const result = await READWITHP(auth, 'users', [QueryParam('age', 25)])
 * console.log('Data:', result.data)
 */
export const READWITHP = (auth, name, queryParams) => {
  let ext = QueryParams(queryParams)
  return GETP(auth, '/api/query/' + name.toLowerCase() + (ext ? '?' + ext : ''))
}

/**
 * UPDATEP - обновление объекта (Promise)
 *
 * @param {Object} auth - Объект аутентификации
 * @param {string} name - Название модели
 * @param {Object} object - Объект для обновления
 * @returns {Promise} Promise с результатом
 *
 * @example
 * const result = await UPDATEP(auth, 'users', { ID: 123, name: 'Jane' })
 * console.log('Updated:', result.data)
 */
export const UPDATEP = (auth, name, object) => {
  return POSTP(auth, '/api/query-update/' + name.toLowerCase(), object)
}

/**
 * DELETEP - удаление объекта (Promise)
 *
 * @param {Object} auth - Объект аутентификации
 * @param {string} name - Название модели
 * @param {number} id - ID объекта
 * @returns {Promise} Promise с результатом
 *
 * @example
 * const result = await DELETEP(auth, 'users', 123)
 * console.log('Deleted:', result.data)
 */
export const DELETEP = (auth, name, id) => {
  return GETP(auth, '/api/query-delete/' + name.toLowerCase() + '/' + id)
}
