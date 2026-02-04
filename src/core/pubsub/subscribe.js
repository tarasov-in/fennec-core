import PubSub from 'pubsub-js'

/**
 * Подписка на сообщение через PubSub
 *
 * @param {string} msg - Название сообщения (топик) для подписки
 * @param {Function} func - Функция-обработчик (msg, data) => void
 * @returns {string} Token подписки (для отписки)
 *
 * @example
 * const token = subscribe('user.created', (msg, data) => {
 *   console.log('User created:', data);
 * });
 */
export const subscribe = (msg, func) => {
  return PubSub.subscribe(msg, func)
}
