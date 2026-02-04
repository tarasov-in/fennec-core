import _ from 'lodash'

/**
 * Генерация data-locator атрибута для тестирования
 *
 * @param {string} locator - Базовый локатор
 * @param {Object|string|number} obj - Объект с ID/uuid/key или примитив
 * @returns {string} Значение для data-locator
 *
 * @example
 * getLocator('button', { ID: 123 }); // 'buttonID123'
 * getLocator('item', { uuid: 'abc' }); // 'itemUUIDabc'
 * getLocator('button', 42); // 'button42'
 */
export function getLocator(locator, obj) {
  if (_.isObject(obj)) {
    let id = (obj?.ID) ? `ID${obj?.ID}` : ''
    let uuid = (obj?.uuid) ? `UUID${obj?.uuid}` : ''
    let key = (obj?.key) ? `KEY${obj?.key}` : ''
    let ID = id || uuid || key
    return (locator || '') + ID
  } else if (obj) {
    return (locator || '') + obj
  } else return (locator || '')
}

/**
 * Константы типов элементов для использования в data-locator
 * Используются для указания типа элемента в функции getLocator
 */
export const LOCATOR_TYPES = {
  // Интерактивные элементы
  BUTTON: 'button',
  INPUT: 'input',
  TEXTAREA: 'textarea',
  SELECT: 'select',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  TOGGLE: 'toggle',
  LINK: 'link',
  FILE_INPUT: 'file-input',
  DATE_PICKER: 'date-picker',
  SLIDER: 'slider',

  // Структурные элементы
  CONTAINER: 'container',
  LIST_ITEM: 'list-item',
  CARD: 'card',
  TABLE: 'table',
  TABLE_ROW: 'table-row',
  TABLE_CELL: 'table-cell',
  TABLE_HEADER: 'table-header',
  NAVIGATION: 'navigation',
  TAB: 'tab',
  TAB_PANEL: 'tab-panel',

  // Модальные и всплывающие элементы
  MODAL: 'modal',
  DIALOG: 'dialog',
  POPUP: 'popup',
  TOOLTIP: 'tooltip',
  DROPDOWN: 'dropdown',
  DROPDOWN_ITEM: 'dropdown-item',
  MENU: 'menu',
  MENU_ITEM: 'menu-item',

  // Индикаторы состояния
  STATUS: 'status',
  NOTIFICATION: 'notification',
  ALERT: 'alert',
  BADGE: 'badge',
  PROGRESS: 'progress',
  LOADING: 'loading',

  // Текстовые элементы
  TEXT: 'text',
  TITLE: 'title',
  LABEL: 'label',
  HEADING: 'heading',
  PARAGRAPH: 'paragraph',

  // Медиа-элементы
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  ICON: 'icon',

  // Формы
  FORM: 'form',
  FORM_GROUP: 'form-group',
  FORM_FIELD: 'form-field',

  // Специальные элементы приложения
  SEARCHBAR: 'searchbar',
  PAGINATION: 'pagination',
  BREADCRUMBS: 'breadcrumbs',
  SIDEBAR: 'sidebar',
  HEADER: 'header',
  FOOTER: 'footer'
}

/**
 * Константы действий для использования в data-locator
 * Используются для указания возможного действия с элементом в функции getLocator
 */
export const LOCATOR_ACTIONS = {
  // Базовые действия
  CLICK: 'click',
  DOUBLE_CLICK: 'double-click',
  RIGHT_CLICK: 'right-click',
  HOVER: 'hover',
  FOCUS: 'focus',
  BLUR: 'blur',

  // Действия с вводом
  INPUT: 'input',
  TYPE: 'type',
  CLEAR: 'clear',
  PASTE: 'paste',

  // Действия с выбором
  SELECT: 'select',
  DESELECT: 'deselect',
  CHECK: 'check',
  UNCHECK: 'uncheck',
  TOGGLE: 'toggle',

  // Действия с перетаскиванием
  DRAG: 'drag',
  DROP: 'drop',
  DRAG_AND_DROP: 'drag-and-drop',

  // Действия с файлами
  UPLOAD: 'upload',
  DOWNLOAD: 'download',

  // Действия с формами
  SUBMIT: 'submit',
  RESET: 'reset',
  VALIDATE: 'validate',

  // Действия с модальными окнами
  OPEN: 'open',
  CLOSE: 'close',
  CONFIRM: 'confirm',
  CANCEL: 'cancel',
  DISMISS: 'dismiss',

  // Действия с таблицами и списками
  SORT: 'sort',
  FILTER: 'filter',
  SEARCH: 'search',
  PAGINATE: 'paginate',

  // Действия внутри приложения
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',

  // Действия с элементами списка
  ADD_ITEM: 'add-item',
  REMOVE_ITEM: 'remove-item',
  EDIT_ITEM: 'edit-item',
  MOVE_ITEM: 'move-item',

  // Действия просмотра
  EXPAND: 'expand',
  COLLAPSE: 'collapse',
  ZOOM: 'zoom',
  SCROLL: 'scroll',

  // Прочие действия
  COPY: 'copy',
  PRINT: 'print',
  SHARE: 'share',
  REFRESH: 'refresh'
}

/**
 * Генерирует значение для атрибута data-locator с дополнительными параметрами
 *
 * @param {string} id - Уникальный человекочитаемый идентификатор
 * @param {any} value - Значение элемента (опциональное)
 * @param {Object} options - Дополнительные параметры (опциональные)
 * @param {string} options.action - Тип действия с элементом (click, input, toggle и т.д.)
 * @param {string} options.type - Тип элемента (button, input, checkbox, list-item и т.д.)
 * @param {number} options.index - Индекс элемента в коллекции
 * @returns {string} - Значение для атрибута data-locator
 *
 * @example
 * getAILocator('submit-button', null, { type: 'button', action: 'click' });
 * // 'submit-button-type-button-action-click'
 *
 * getAILocator('user-item', 123, { type: 'list-item', index: 0 });
 * // 'user-item-value-123-type-list-item-index-0'
 */
export function getAILocator(id, value = null, options = {}) {
  if (!id || typeof id !== 'string') {
    console.warn('getLocator: id должен быть непустой строкой')
    return ''
  }

  // Основные компоненты локатора
  const parts = [id]

  // Добавляем тип элемента, если указан
  if (options.type) {
    parts.push(`type-${options.type}`)
  }

  // Добавляем действие, если указано
  if (options.action) {
    parts.push(`action-${options.action}`)
  }

  // Добавляем значение, если передано
  if (value !== null && value !== undefined) {
    const cleanValue = String(value).replace(/\s+/g, '-').toLowerCase()
    parts.push(`value-${cleanValue}`)
  }

  // Добавляем индекс, если указан
  if (typeof options.index === 'number') {
    parts.push(`index-${options.index}`)
  }

  return parts.join('-')
}
