import PubSub from 'pubsub-js'

/**
 * Публикация сообщения через PubSub
 *
 * @param {string} msg - Название сообщения (топик)
 * @param {any} data - Данные для передачи подписчикам
 *
 * @example
 * publish('user.created', { id: 123, name: 'John' });
 */
export const publish = (msg, data) => {
  PubSub.publish(msg, data)
}
