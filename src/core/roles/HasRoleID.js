/**
 * Проверка наличия роли у пользователя по ID роли
 *
 * @param {Object} user - Объект пользователя
 * @param {Array} user.roleUser - Массив ролей пользователя
 * @param {number} roleID - ID роли для проверки
 * @returns {boolean} true если роль найдена, false иначе
 *
 * @example
 * const user = {
 *   roleUser: [
 *     { roleID: 1, role: { name: 'admin' } },
 *     { roleID: 2, role: { name: 'user' } }
 *   ]
 * };
 * HasRoleID(user, 1); // true
 * HasRoleID(user, 3); // false
 */
export const HasRoleID = (user, roleID) => {
  if (user && user.roleUser) {
    for (let i = 0; i < user.roleUser.length; i++) {
      const element = user.roleUser[i]
      if (element.roleID === roleID) {
        return true
      }
    }
  }
  return false
}
