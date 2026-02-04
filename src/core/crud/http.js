import { FennecError } from '../error/FennecError'
import { errorCatch } from '../error/errorCatch'
import { QueryParams } from '../query'

/**
 * HTTP GET запрос
 *
 * @param {Object} auth - Объект аутентификации
 * @param {string} url - URL для запроса
 * @param {Function} callback - Callback при успехе
 * @param {Function} error - Callback при ошибке
 */
export const GET = (auth, url, callback, error) => {
  auth.fetch(url)
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
 * HTTP GET запрос с query параметрами
 *
 * @param {Object} auth - Объект аутентификации
 * @param {string} url - URL для запроса
 * @param {Array|string} queryParams - Query параметры
 * @param {Function} callback - Callback при успехе
 * @param {Function} error - Callback при ошибке
 */
export const GETWITH = (auth, url, queryParams, callback, error) => {
  let ext = QueryParams(queryParams)
  GET(auth, url + (ext ? '?' + ext : ''), callback, error)
}

/**
 * HTTP POST запрос
 *
 * @param {Object} auth - Объект аутентификации
 * @param {string} url - URL для запроса
 * @param {Object} object - Данные для отправки
 * @param {Function} callback - Callback при успехе
 * @param {Function} error - Callback при ошибке
 */
export const POST = (auth, url, object, callback, error) => {
  auth.fetch(url, {
    method: 'POST',
    body: JSON.stringify(object)
  })
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
 * HTTP POST запрос с FormData
 *
 * @param {Object} auth - Объект аутентификации
 * @param {string} url - URL для запроса
 * @param {FormData} formData - FormData для отправки
 * @param {Function} callback - Callback при успехе
 * @param {Function} error - Callback при ошибке
 */
export const POSTFormData = (auth, url, formData, callback, error) => {
  auth.fetchForData(url, {
    method: 'POST',
    body: formData
  })
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

// ==================== Promise-based API ====================

/**
 * HTTP GET запрос (Promise)
 *
 * @param {Object} auth - Объект аутентификации
 * @param {string} url - URL для запроса
 * @returns {Promise} Promise с результатом
 */
export const GETP = (auth, url) => {
  return new Promise((resolve, reject) => {
    auth.fetch(url)
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

/**
 * HTTP GET запрос с query параметрами (Promise)
 *
 * @param {Object} auth - Объект аутентификации
 * @param {string} url - URL для запроса
 * @param {Array|string} queryParams - Query параметры
 * @returns {Promise} Promise с результатом
 */
export const GETWITHP = (auth, url, queryParams) => {
  let ext = QueryParams(queryParams)
  return GETP(auth, url + (ext ? '?' + ext : ''))
}

/**
 * HTTP POST запрос (Promise)
 *
 * @param {Object} auth - Объект аутентификации
 * @param {string} url - URL для запроса
 * @param {Object} object - Данные для отправки
 * @returns {Promise} Promise с результатом
 */
export const POSTP = (auth, url, object) => {
  return new Promise((resolve, reject) => {
    auth.fetch(url, {
      method: 'POST',
      body: JSON.stringify(object)
    })
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

/**
 * HTTP POST запрос с FormData (Promise)
 *
 * @param {Object} auth - Объект аутентификации
 * @param {string} url - URL для запроса
 * @param {FormData} formData - FormData для отправки
 * @returns {Promise} Promise с результатом
 */
export const POSTFormDataP = (auth, url, formData) => {
  return new Promise((resolve, reject) => {
    auth.fetchForData(url, {
      method: 'POST',
      body: formData
    })
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
