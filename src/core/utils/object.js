/**
 * Object value access utilities
 * Migrated from Tool/index.js
 */

/**
 * Gets nested value from object by path
 * Supports array indexing and complex paths like "user.roles[0].name"
 * @param {Object} object - Source object
 * @param {string} subObject - Path to value (e.g., "user.role.name" or "items[0].title")
 * @returns {any} Value at path or undefined
 */
export function getObjectValue(object, subObject) {
  // Если присутствуют под объекты
  if (object && subObject) {
    // Разбиваем строку subObject через "." не трогая при этом точки в угловых скобках [sdf.sdf]
    var subObjects = subObject
      .replace(/\[[\wа-яА-ЯёЁ\d\."']*\]/g, function (item) {
        return item.replace(".", "<<8>>")
      })
      .split(".")
      ?.map(function (item) {
        return item.replace(/<<8>>/g, ".")
      })

    // Перебираем под объекты
    for (var i = 0; i < subObjects.length; i++) {
      var index = subObjects[i].match(/\[.*\]/)
      var subObj = subObjects[i].replace(/\[.*\]/, "")

      if (subObj) {
        var lastObj = subObj

        if (object === null) {
          console.debug("Ошибка получения объекта: " + subObject + "; Не удается найти свойство: " + "\"" + subObj + "\"")
          return
        }

        object = object[subObj]
        if (object === undefined) {
          console.debug("Ошибка получения объекта: " + subObject + "; Не удается найти свойство: " + "\"" + subObj + "\"")
          return
        }

        // Проверяем является ли под объект массивом
        if (index) {
          var rexp = /\[([\wа-яА-ЯёЁ\d\.]+)\]|\[["|']([\wа-яА-ЯёЁ\d\.]+)["|']\]/g
          var matchArray

          // Поиск всех индексов для n-мерного массива
          while ((matchArray = rexp.exec(index))) {
            var matchIndex = matchArray[1] || matchArray[2]
            if (matchIndex) {
              object = object[matchIndex]
              if (object === undefined) {
                console.debug("Ошибка получения объекта: " + subObject + "; Не существует элемента с индексом: \"" + matchIndex + "\" в объекте: " + lastObj)
                return
              }
            } else {
              console.debug("Ошибка получения объекта: " + subObject + "; Не могу получить указанный объект. Ошибка получения индекса элемента.")
              return
            }
          }
        }
      } else {
        console.debug("Ошибка получения объекта: " + subObject + "; Не могу получить указанный объект.")
        return
      }
    }
  }
  return object
}

/**
 * Gets nested value from object by path with default fallback
 * @param {Object} object - Source object
 * @param {string} subObject - Path to value
 * @param {any} defValue - Default value if path doesn't exist
 * @returns {any} Value at path or default value
 */
export function getObjectValueOrDefault(object, subObject, defValue) {
  var result = getObjectValue(object, subObject)
  if (result === undefined || result === null) {
    if (defValue !== undefined) {
      return defValue
    }
  }
  return result
}
