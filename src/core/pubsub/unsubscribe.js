import PubSub from 'pubsub-js'

/**
 * Отписка от сообщения через PubSub
 *
 * @param {string} token - Token подписки, полученный от subscribe()
 *
 * @example
 * const token = subscribe('user.created', handler);
 * unsubscribe(token);
 */
export const unsubscribe = (token) => {
  PubSub.unsubscribe(token)
}
