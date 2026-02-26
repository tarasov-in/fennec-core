/**
 * UIAdapter - базовый класс для UI адаптеров
 *
 * Определяет контракт для всех UI компонентов, которые должен предоставить адаптер.
 * Каждый адаптер (AntdAdapter, MuiAdapter, etc.) должен наследоваться от этого класса
 * и предоставить реализацию всех компонентов.
 *
 * @class UIAdapter
 */
export class UIAdapter {
  // ==================== Input Components ====================

  /**
   * Input - текстовый ввод
   * @type {React.Component}
   * @props {any} value - Текущее значение
   * @props {Function} onChange - Обработчик изменения (value) => void
   * @props {string} placeholder - Placeholder текст
   * @props {boolean} disabled - Disabled состояние
   * @props {string} type - Тип input (text, password, email, etc.)
   */
  Input = null

  /**
   * TextArea - многострочный текст
   * @type {React.Component}
   * @props {any} value - Текущее значение
   * @props {Function} onChange - Обработчик изменения (value) => void
   * @props {string} placeholder - Placeholder текст
   * @props {boolean} disabled - Disabled состояние
   * @props {number} rows - Количество строк
   */
  TextArea = null

  /**
   * InputNumber - числовой ввод
   * @type {React.Component}
   * @props {number} value - Текущее значение
   * @props {Function} onChange - Обработчик изменения (value) => void
   * @props {number} min - Минимальное значение
   * @props {number} max - Максимальное значение
   * @props {number} step - Шаг изменения
   * @props {boolean} disabled - Disabled состояние
   */
  InputNumber = null

  // ==================== Selection Components ====================

  /**
   * Select - выбор из списка
   * @type {React.Component}
   * @props {any} value - Выбранное значение(я)
   * @props {Function} onChange - Обработчик изменения (value) => void
   * @props {Array<{label: string, value: any}>} options - Список опций
   * @props {boolean} multiple - Множественный выбор
   * @props {boolean} searchable - Поиск по опциям
   * @props {boolean} disabled - Disabled состояние
   * @props {boolean} loading - Состояние загрузки
   * @props {Function} onSearch - Обработчик поиска (query) => void
   */
  Select = null

  /**
   * Checkbox - чекбокс
   * @type {React.Component}
   * @props {boolean} checked - Состояние (выбран/не выбран)
   * @props {Function} onChange - Обработчик изменения (checked) => void
   * @props {boolean} disabled - Disabled состояние
   * @props {string} label - Текст метки
   */
  Checkbox = null

  /**
   * Radio - радио-кнопки
   * @type {React.Component}
   * @props {any} value - Выбранное значение
   * @props {Function} onChange - Обработчик изменения (value) => void
   * @props {Array<{label: string, value: any}>} options - Список опций
   * @props {boolean} disabled - Disabled состояние
   */
  Radio = null

  /**
   * Switch - переключатель
   * @type {React.Component}
   * @props {boolean} checked - Состояние (вкл/выкл)
   * @props {Function} onChange - Обработчик изменения (checked) => void
   * @props {boolean} disabled - Disabled состояние
   */
  Switch = null

  // ==================== Date/Time Components ====================

  /**
   * DatePicker - выбор даты
   * @type {React.Component}
   * @props {any} value - Текущая дата (dayjs object or string)
   * @props {Function} onChange - Обработчик изменения (date) => void
   * @props {string} format - Формат даты
   * @props {boolean} disabled - Disabled состояние
   * @props {boolean} showTime - Показывать время
   */
  DatePicker = null

  /**
   * TimePicker - выбор времени
   * @type {React.Component}
   * @props {any} value - Текущее время (dayjs object or string)
   * @props {Function} onChange - Обработчик изменения (time) => void
   * @props {string} format - Формат времени
   * @props {boolean} disabled - Disabled состояние
   */
  TimePicker = null

  /**
   * RangePicker - выбор диапазона дат
   * @type {React.Component}
   * @props {Array} value - Диапазон [start, end] (dayjs objects)
   * @props {Function} onChange - Обработчик изменения ([start, end]) => void
   * @props {string} format - Формат даты
   * @props {boolean} disabled - Disabled состояние
   */
  RangePicker = null

  // ==================== Other Input Components ====================

  /**
   * Slider - слайдер
   * @type {React.Component}
   * @props {number} value - Текущее значение
   * @props {Function} onChange - Обработчик изменения (value) => void
   * @props {number} min - Минимальное значение
   * @props {number} max - Максимальное значение
   * @props {number} step - Шаг изменения
   * @props {boolean} disabled - Disabled состояние
   */
  Slider = null

  /**
   * Upload - загрузка файлов
   * @type {React.Component}
   * @props {any} value - Текущие файлы
   * @props {Function} onChange - Обработчик изменения (fileList) => void
   * @props {string} accept - Допустимые типы файлов
   * @props {boolean} multiple - Множественная загрузка
   * @props {number} maxSize - Максимальный размер файла
   * @props {Function} onUpload - Обработчик загрузки (file) => Promise
   */
  Upload = null

  /**
   * Dragger - drag-and-drop загрузка файлов
   * @type {React.Component}
   * @props {any} value - Текущие файлы
   * @props {Function} onChange - Обработчик изменения (fileList) => void
   * @props {string} accept - Допустимые типы файлов
   * @props {boolean} multiple - Множественная загрузка
   */
  Dragger = null

  /**
   * Rate - оценка (звезды)
   * @type {React.Component}
   * @props {number} value - Текущая оценка
   * @props {Function} onChange - Обработчик изменения (rating) => void
   * @props {number} count - Количество звезд (по умолчанию 5)
   * @props {boolean} disabled - Disabled состояние
   * @props {boolean} allowHalf - Разрешить половинчатые значения
   */
  Rate = null

  /**
   * ColorPicker - выбор цвета
   * @type {React.Component}
   * @props {string} value - Текущий цвет (hex, rgb, etc.)
   * @props {Function} onChange - Обработчик изменения (color) => void
   * @props {boolean} disabled - Disabled состояние
   * @props {boolean} showText - Показывать текстовое значение
   */
  ColorPicker = null

  // ==================== Display Components ====================

  /**
   * Table - таблица
   * @type {React.Component}
   * @props {Array<Object>} dataSource - Данные для отображения
   * @props {Array<ColumnDef>} columns - Определения колонок
   * @props {boolean} loading - Состояние загрузки
   * @props {PaginationConfig} pagination - Конфигурация пагинации
   * @props {Function} onChange - Обработчик изменений (pagination, filters, sorter) => void
   * @props {string} rowKey - Поле для уникального ключа строки
   * @props {Object} rowSelection - Конфигурация выбора строк
   */
  Table = null

  /**
   * List - список
   * @type {React.Component}
   * @props {Array<Object>} dataSource - Данные для отображения
   * @props {Function} renderItem - Функция рендеринга элемента (item) => ReactNode
   * @props {boolean} loading - Состояние загрузки
   * @props {PaginationConfig} pagination - Конфигурация пагинации
   */
  List = null

  /**
   * Card - карточка
   * @type {React.Component}
   * @props {string|ReactNode} title - Заголовок
   * @props {ReactNode} extra - Дополнительный контент в заголовке
   * @props {ReactNode} children - Содержимое карточки
   */
  Card = null

  /**
   * Image - изображение
   * @type {React.Component}
   * @props {string} src - URL изображения
   * @props {string} alt - Альтернативный текст
   * @props {number} width - Ширина
   * @props {number} height - Высота
   * @props {boolean} preview - Возможность предпросмотра
   */
  Image = null

  // ==================== Form Components ====================

  /**
   * Form - форма
   * @type {React.Component}
   * @props {Function} onFinish - Обработчик успешной отправки (values) => void
   * @props {Object} initialValues - Начальные значения
   * @props {FormInstance} form - Instance формы
   * @props {string} layout - Layout (horizontal, vertical, inline)
   */
  Form = null

  /**
   * FormItem - элемент формы
   * @type {React.Component}
   * @props {string} label - Метка поля
   * @props {string} name - Имя поля
   * @props {Array} rules - Правила валидации
   * @props {boolean} required - Обязательное поле
   * @props {ReactNode} children - Контрол формы
   */
  FormItem = null

  // ==================== Layout Components ====================

  /**
   * Modal - модальное окно
   * @type {React.Component}
   * @props {boolean} visible - Видимость
   * @props {Function} onClose - Обработчик закрытия () => void
   * @props {string|ReactNode} title - Заголовок
   * @props {ReactNode} footer - Футер (кнопки)
   * @props {number|string} width - Ширина
   * @props {ReactNode} children - Содержимое
   */
  Modal = null

  /**
   * Drawer - боковая панель
   * @type {React.Component}
   * @props {boolean} visible - Видимость
   * @props {Function} onClose - Обработчик закрытия () => void
   * @props {string|ReactNode} title - Заголовок
   * @props {string} placement - Позиция (left, right, top, bottom)
   * @props {number|string} width - Ширина
   * @props {ReactNode} children - Содержимое
   */
  Drawer = null

  /**
   * Tabs - вкладки
   * @type {React.Component}
   * @props {string} activeKey - Активная вкладка
   * @props {Function} onChange - Обработчик изменения (key) => void
   * @props {Array<{key: string, label: string, children: ReactNode}>} items - Вкладки
   * @props {ReactNode} children - Вкладки (альтернативный способ)
   */
  Tabs = null

  /**
   * TabPane - панель вкладки
   * @type {React.Component}
   * @props {string} key - Ключ вкладки
   * @props {string} tab - Заголовок вкладки
   * @props {ReactNode} children - Содержимое
   */
  TabPane = null

  /**
   * Divider - разделитель
   * @type {React.Component}
   * @props {string} type - Тип (horizontal, vertical)
   * @props {string} orientation - Выравнивание текста (left, center, right)
   * @props {string|ReactNode} children - Текст разделителя
   */
  Divider = null

  /**
   * Space - расстояние между элементами
   * @type {React.Component}
   * @props {string} direction - Направление (horizontal, vertical)
   * @props {number|string} size - Размер отступа (small, middle, large, number)
   * @props {ReactNode} children - Элементы
   */
  Space = null

  // ==================== Action Components ====================

  /**
   * Button - кнопка
   * @type {React.Component}
   * @props {Function} onClick - Обработчик клика () => void
   * @props {string} type - Тип (primary, default, dashed, text, link)
   * @props {boolean} disabled - Disabled состояние
   * @props {boolean} loading - Состояние загрузки
   * @props {ReactNode} icon - Иконка
   * @props {ReactNode} children - Текст кнопки
   */
  Button = null

  /**
   * Dropdown - выпадающее меню
   * @type {React.Component}
   * @props {Array|Object} menu - Меню (items или menu object)
   * @props {string} trigger - Триггер (click, hover)
   * @props {ReactNode} children - Элемент, который триггерит dropdown
   */
  Dropdown = null

  /**
   * Tooltip - всплывающая подсказка
   * @type {React.Component}
   * @props {string|ReactNode} title - Текст подсказки
   * @props {string} placement - Позиция (top, bottom, left, right)
   * @props {ReactNode} children - Элемент с подсказкой
   */
  Tooltip = null

  // ==================== Utility Components ====================

  /**
   * Pagination - пагинация
   * @type {React.Component}
   * @props {number} current - Текущая страница
   * @props {number} total - Всего элементов
   * @props {number} pageSize - Размер страницы
   * @props {Function} onChange - Обработчик изменения (page, pageSize) => void
   * @props {boolean} showSizeChanger - Показывать переключатель размера
   */
  Pagination = null

  /**
   * Spin - индикатор загрузки
   * @type {React.Component}
   * @props {boolean} spinning - Состояние загрузки
   * @props {string} size - Размер (small, default, large)
   * @props {ReactNode} children - Обертываемый контент
   */
  Spin = null

  /**
   * Empty - пустое состояние
   * @type {React.Component}
   * @props {string|ReactNode} description - Описание
   * @props {ReactNode} image - Изображение для пустого состояния
   */
  Empty = null

  /**
   * Tag - тег
   * @type {React.Component}
   * @props {string} color - Цвет тега
   * @props {Function} onClose - Обработчик закрытия () => void
   * @props {boolean} closable - Возможность закрытия
   * @props {ReactNode} children - Содержимое тега
   */
  Tag = null

  /**
   * Badge - бейдж
   * @type {React.Component}
   * @props {number|string} count - Число для отображения
   * @props {boolean} dot - Показать точку вместо числа
   * @props {ReactNode} children - Элемент с бейджем
   */
  Badge = null

  // ==================== Utility Methods ====================

  /**
   * Преобразование данных формы
   * Используется для нормализации данных между fennec-core и конкретным UI framework
   *
   * @param {Object} data - Данные формы
   * @returns {Object} Преобразованные данные
   */
  transformFormData(data) {
    return data
  }

  /**
   * Преобразование данных таблицы
   * Используется для нормализации данных между fennec-core и конкретным UI framework
   *
   * @param {Array} data - Данные таблицы
   * @returns {Array} Преобразованные данные
   */
  transformTableData(data) {
    return data
  }

  /**
   * Создание валидатора на основе правил
   *
   * @param {Array} rules - Правила валидации fennec-core
   * @returns {Function} Функция валидатора для конкретного UI framework
   */
  createValidator(rules) {
    return () => Promise.resolve()
  }

  /**
   * Форматирование даты
   *
   * @param {any} value - Значение даты
   * @param {string} format - Формат
   * @returns {any} Отформатированная дата для конкретного UI framework
   */
  formatDate(value, format) {
    return value
  }

  /**
   * Парсинг даты
   *
   * @param {any} value - Значение даты из UI
   * @param {string} format - Формат
   * @returns {any} Распарсенная дата
   */
  parseDate(value, format) {
    return value
  }

  /**
   * Получение экземпляра формы
   * Разные UI frameworks имеют разные способы создания form instance
   *
   * @returns {Object} Form instance
   */
  createFormInstance() {
    return {}
  }

  /**
   * Нормализация файлов для Upload компонента
   *
   * @param {any} fileList - Список файлов из UI
   * @returns {Array} Нормализованный список файлов
   */
  normalizeFiles(fileList) {
    return fileList
  }

  /**
   * Рендер контрола по типу поля (для Field без item.render).
   * Адаптер по type (string, float, boolean, date, ...) возвращает нужный компонент ввода.
   *
   * @param {Object} options
   * @param {string} options.type - Тип из мета (string, float, bool, date, datetime, int, password, text, ...)
   * @param {any} options.value - Текущее значение
   * @param {Function} options.onChange - (value) => void
   * @param {string} [options.mode] - Режим (model, filter, ...)
   * @param {Object} [options.item] - Описание поля из мета (label, required, options, filterType, ...)
   * @param {boolean} [options.disabled]
   * @param {string} [options.placeholder]
   * @returns {React.ReactNode|null} Элемент ввода или null
   */
  renderField(options) {
    return null
  }
}
