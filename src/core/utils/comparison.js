/**
 * Object comparison utilities
 * Migrated from Tool/index.js
 */

/**
 * Deep equality comparison for objects
 * @param {any} obj1 - First object to compare
 * @param {any} obj2 - Second object to compare
 * @returns {boolean} True if objects are deeply equal
 */
export const equals = (obj1, obj2) => {
  if (obj1 === obj2)
    return true
  if (!obj1 || !obj2 || typeof (obj1) !== "object" || typeof (obj2) !== "object")
    return false

  // Проверяем является ли объект obj1 функцией,
  // если да то предполагаем что obj2 тоже функция и сравниваем коды функций
  if (typeof (obj1) === "function") {
    if (obj1.toString() === obj2.toString())
      return true
    else
      return false
  }

  // Если obj2 является функцией, значит предыдущее условие
  // показало что obj1 не является функцией, а значит obj1 != obj2
  if (typeof (obj2) === "function") {
    return false
  }

  var obj1PropertyCount = Object.keys(obj1).length
  var obj2PropertyCount = Object.keys(obj2).length

  // Если количество свойств сравниваемых объектов разное, то объекты не равны
  if (obj1PropertyCount !== obj2PropertyCount)
    return false

  // Так как предыдущее условие показало, что кол-во свойств у объектов равны,
  // проверяем если кол-во свойств объектов равно 0, то объекты пустые,
  // а соответственно равны
  if (obj1PropertyCount === 0)
    return true

  for (var property in obj1) {
    var prop1 = obj1[property]
    var prop2 = obj2[property]

    // Если свойство prop1 является объектом, то предполагаем,
    // что prop2 тоже объект и проверяем на равенство объектов свойства prop1 и prop2
    if (typeof (prop1) === "object") {
      if (!equals(prop1, prop2)) {
        return false
      }
      // Иначе если prop1 не является объектом, а prop2 является объектом,
      // останавливаем сравнение
    } else if (typeof (prop2) === "object") {
      return false
      // Если prop1 и prop2 не являются объектами, то просто их сравниваем
    } else if (typeof (prop1) !== "object" && typeof (prop2) !== "object") {
      if (prop1 !== prop2)
        return false
    }
  }

  return true
}
