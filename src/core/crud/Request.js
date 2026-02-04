import { FennecError } from '../error/FennecError'
import { errorCatch } from '../error/errorCatch'

/**
 * Базовая функция для HTTP запросов
 *
 * @param {Object} auth - Объект аутентификации с методом fetch
 * @param {string} url - URL для запроса
 * @param {Object} options - Опции для fetch
 * @param {Function} callback - Callback при успехе (res) => void
 * @param {Function} error - Callback при ошибке (err) => void
 */
export const Request = (auth, url, options, callback, error) => {
  auth.fetch(url, options)
    .then((res) => {
      if (res && res.status === true) {
        if (callback) {
          callback(res)
        }
      } else if (res && res.status === false) {
        throw new FennecError(res.message, '', res)
      }
    })
    .catch(error || errorCatch)
}

/**
 * Promise-based базовая функция для HTTP запросов
 *
 * @param {Object} auth - Объект аутентификации
 * @param {string} url - URL для запроса
 * @param {Object} options - Опции для fetch
 * @returns {Promise} Promise с результатом
 */
export const RequestP = (auth, url, options) => {
  return new Promise((resolve, reject) => {
    auth.fetch(url, options)
      .then((res) => {
        if (res && res.status === true) {
          resolve(res)
        } else if (res && res.status === false) {
          throw new FennecError(res.message, '', res)
        }
      })
      .catch(reject)
  })
}
