/**
 * Notifier API - абстракция для уведомлений (без зависимости от UI-библиотеки).
 * Приложение или адаптер может установить: setNotifier({ error: (msg) => message.error(msg) })
 */
let _notifier = null

export function setNotifier(notifier) {
  _notifier = notifier
}

export function getNotifier() {
  return _notifier
}

/**
 * Обработчик ошибок по умолчанию
 *
 * Использует notifier.error() если установлен (setNotifier), иначе console.error.
 * Не зависит от конкретной UI-библиотеки.
 *
 * @param {Error} err - Объект ошибки
 * @param {Function} callback - Опциональный callback после обработки ошибки
 *
 * @example
 * fetch('/api/data')
 *   .then(processData)
 *   .catch(errorCatch)
 */
export const errorCatch = (err, callback) => {
  if (err) {
    const msg = '' + err
    if (_notifier?.error) {
      _notifier.error(msg)
    } else {
      console.error(msg)
    }
    if (callback) callback()
  }
}

/**
 * Обработчик ошибок с alert (для мобильных)
 *
 * @param {Error} err - Объект ошибки
 * @param {Function} callback - Опциональный callback
 */
export const errorAlert = (err, callback) => {
  const messageError = (err) => {
    const alertInstance = alert('Ошибка', err, [
      { text: 'OK', onPress: () => alertInstance?.close() }
    ])
    setTimeout(() => {
      alertInstance?.close()
    }, 5000)
  }
  if (err) {
    messageError('' + err)
    if (callback) callback()
  }
}

/**
 * Показать сообщение об ошибке через alert
 *
 * @param {string} err - Сообщение об ошибке
 */
export const messageError = (err) => {
  const alertInstance = alert('Ошибка', err, [
    { text: 'OK', onPress: () => alertInstance?.close() }
  ])
  setTimeout(() => {
    alertInstance?.close()
  }, 5000)
}
