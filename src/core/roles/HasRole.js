/**
 * Проверка наличия роли у пользователя по имени роли
 *
 * @param {Object} user - Объект пользователя
 * @param {Array} user.roleUser - Массив ролей пользователя
 * @param {string} name - Название роли для проверки
 * @returns {boolean} true если роль найдена, false иначе
 *
 * @example
 * const user = {
 *   roleUser: [
 *     { roleID: 1, role: { name: 'admin' } },
 *     { roleID: 2, role: { name: 'user' } }
 *   ]
 * };
 * HasRole(user, 'admin'); // true
 * HasRole(user, 'moderator'); // false
 */
export const HasRole = (user, name) => {
  if (user && user.roleUser) {
    for (let i = 0; i < user.roleUser.length; i++) {
      const element = user.roleUser[i]
      if (element.role.name === name) {
        return true
      }
    }
  }
  return false
}
