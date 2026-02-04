# UI Adapters для Fennec Core

## Что такое UI Adapter?

UI Adapter - это абстракция, которая позволяет fennec-core работать с любой UI библиотекой (Ant Design, Material UI, Chakra UI, и т.д.) через единый интерфейс.

Адаптер предоставляет набор стандартизированных компонентов (Input, Select, Table, Form и т.д.), которые внутри используют компоненты конкретной UI библиотеки.

## Зачем это нужно?

1. **Гибкость** - Вы можете использовать fennec-core с любой UI библиотекой
2. **Переиспользование** - Ваши данные и бизнес-логика не зависят от UI
3. **Белые лейблы** - Легко создать свой брендированный интерфейс
4. **Миграция** - Можно постепенно перейти с одной UI библиотеки на другую

## Использование встроенного AntdAdapter

По умолчанию fennec-core использует Ant Design. Вам не нужно делать ничего дополнительно:

```javascript
import { Field, Model } from 'fennec-core';

// Работает автоматически с Ant Design
function App() {
  return <Model name="users" />;
}
```

Если вы хотите явно указать AntdAdapter:

```javascript
import { UIProvider } from 'fennec-core';
import { AntdAdapter } from 'fennec-core/adapters/antd';

function App() {
  return (
    <UIProvider adapter={new AntdAdapter()}>
      <Model name="users" />
    </UIProvider>
  );
}
```

## Создание собственного адаптера

### Шаг 1: Создайте класс адаптера

Наследуйтесь от `UIAdapter` и реализуйте все необходимые компоненты:

```javascript
// MyCustomAdapter.js
import { UIAdapter } from 'fennec-core/adapters';
import { TextField, Select, Button, DataGrid } from 'my-ui-library';

export class MyCustomAdapter extends UIAdapter {
  // Input компонент
  Input = ({ value, onChange, ...props }) => (
    <TextField
      value={value}
      onValueChange={onChange}
      {...props}
    />
  );

  // Select компонент
  Select = ({ value, onChange, options, ...props }) => (
    <Select
      value={value}
      onSelect={onChange}
      items={options}
      {...props}
    />
  );

  // Table компонент
  Table = ({ dataSource, columns, ...props }) => (
    <DataGrid
      rows={dataSource}
      columns={columns}
      {...props}
    />
  );

  // Button компонент
  Button = ({ onClick, children, ...props }) => (
    <Button onClick={onClick} {...props}>
      {children}
    </Button>
  );

  // ... реализуйте остальные компоненты
}
```

### Шаг 2: Используйте свой адаптер

```javascript
import { UIProvider, Model, Field } from 'fennec-core';
import { MyCustomAdapter } from './MyCustomAdapter';

function App() {
  return (
    <UIProvider adapter={new MyCustomAdapter()}>
      <Model name="users" />
      <Field item={{ type: 'string', name: 'email' }} />
    </UIProvider>
  );
}
```

## Контракты компонентов

Каждый компонент должен соответствовать определенному контракту (набору пропсов).

### Input

```javascript
Input = ({ value, onChange, placeholder, disabled, type }) => { ... }
```

**Props:**
- `value` (any) - Текущее значение
- `onChange` (function) - Обработчик изменения `(value) => void`
- `placeholder` (string) - Placeholder текст
- `disabled` (boolean) - Disabled состояние
- `type` (string) - Тип input (text, password, email, и т.д.)

### Select

```javascript
Select = ({ value, onChange, options, multiple, searchable, loading, onSearch }) => { ... }
```

**Props:**
- `value` (any) - Выбранное значение(я)
- `onChange` (function) - Обработчик изменения `(value) => void`
- `options` (Array<{label: string, value: any}>) - Список опций
- `multiple` (boolean) - Множественный выбор
- `searchable` (boolean) - Поиск по опциям
- `loading` (boolean) - Состояние загрузки
- `onSearch` (function) - Обработчик поиска `(query) => void`

### Table

```javascript
Table = ({ dataSource, columns, loading, pagination, onChange, rowKey }) => { ... }
```

**Props:**
- `dataSource` (Array<Object>) - Данные для отображения
- `columns` (Array<ColumnDef>) - Определения колонок
- `loading` (boolean) - Состояние загрузки
- `pagination` (Object) - Конфигурация пагинации
- `onChange` (function) - Обработчик изменений `(pagination, filters, sorter) => void`
- `rowKey` (string) - Поле для уникального ключа строки

### Form

```javascript
Form = ({ onFinish, initialValues, form, layout }) => { ... }
```

**Props:**
- `onFinish` (function) - Обработчик успешной отправки `(values) => void`
- `initialValues` (Object) - Начальные значения
- `form` (Object) - Instance формы
- `layout` (string) - Layout (horizontal, vertical, inline)

### FormItem

```javascript
FormItem = ({ label, name, rules, required, children }) => { ... }
```

**Props:**
- `label` (string) - Метка поля
- `name` (string) - Имя поля
- `rules` (Array) - Правила валидации
- `required` (boolean) - Обязательное поле
- `children` (ReactNode) - Контрол формы

### DatePicker

```javascript
DatePicker = ({ value, onChange, format, disabled, showTime }) => { ... }
```

**Props:**
- `value` (any) - Текущая дата (dayjs object or string)
- `onChange` (function) - Обработчик изменения `(date) => void`
- `format` (string) - Формат даты
- `disabled` (boolean) - Disabled состояние
- `showTime` (boolean) - Показывать время

### Button

```javascript
Button = ({ onClick, type, disabled, loading, icon, children }) => { ... }
```

**Props:**
- `onClick` (function) - Обработчик клика `() => void`
- `type` (string) - Тип (primary, default, dashed, text, link)
- `disabled` (boolean) - Disabled состояние
- `loading` (boolean) - Состояние загрузки
- `icon` (ReactNode) - Иконка
- `children` (ReactNode) - Текст кнопки

### Modal

```javascript
Modal = ({ visible, onClose, title, footer, width, children }) => { ... }
```

**Props:**
- `visible` (boolean) - Видимость
- `onClose` (function) - Обработчик закрытия `() => void`
- `title` (string|ReactNode) - Заголовок
- `footer` (ReactNode) - Футер (кнопки)
- `width` (number|string) - Ширина
- `children` (ReactNode) - Содержимое

## Полный список компонентов

Ваш адаптер должен предоставить следующие компоненты:

**Input компоненты:**
- `Input` - текстовый ввод
- `TextArea` - многострочный текст
- `InputNumber` - числовой ввод

**Selection компоненты:**
- `Select` - выбор из списка
- `Checkbox` - чекбокс
- `Radio` - радио-кнопки

**Date/Time компоненты:**
- `DatePicker` - выбор даты
- `TimePicker` - выбор времени
- `RangePicker` - выбор диапазона дат

**Other Input компоненты:**
- `Slider` - слайдер
- `Upload` - загрузка файлов
- `Dragger` - drag-and-drop загрузка

**Display компоненты:**
- `Table` - таблица
- `List` - список
- `Card` - карточка
- `Image` - изображение

**Form компоненты:**
- `Form` - форма
- `FormItem` - элемент формы

**Layout компоненты:**
- `Modal` - модальное окно
- `Drawer` - боковая панель
- `Tabs` - вкладки
- `TabPane` - панель вкладки
- `Divider` - разделитель
- `Space` - расстояние между элементами

**Action компоненты:**
- `Button` - кнопка
- `Dropdown` - выпадающее меню
- `Tooltip` - всплывающая подсказка

**Utility компоненты:**
- `Pagination` - пагинация
- `Spin` - индикатор загрузки
- `Empty` - пустое состояние
- `Tag` - тег
- `Badge` - бейдж

## Utility методы

Помимо компонентов, адаптер может предоставить utility методы:

```javascript
export class MyAdapter extends UIAdapter {
  // ... компоненты

  // Преобразование данных формы
  transformFormData(data) {
    return data;
  }

  // Преобразование данных таблицы
  transformTableData(data) {
    return data;
  }

  // Создание валидатора
  createValidator(rules) {
    return () => Promise.resolve();
  }

  // Форматирование даты
  formatDate(value, format) {
    return value;
  }

  // Парсинг даты
  parseDate(value, format) {
    return value;
  }

  // Создание формы
  createFormInstance() {
    return {};
  }

  // Нормализация файлов
  normalizeFiles(fileList) {
    return fileList;
  }
}
```

## Примеры адаптеров

### Пример 1: Гибридный адаптер (Ant Design + кастомные компоненты)

```javascript
import { AntdAdapter } from 'fennec-core/adapters/antd';
import { MyCustomTable } from './components/MyCustomTable';

export class HybridAdapter extends AntdAdapter {
  // Используем Ant Design для всего, кроме Table
  Table = MyCustomTable;
}
```

### Пример 2: Material UI адаптер (упрощенный)

```javascript
import { UIAdapter } from 'fennec-core/adapters';
import {
  TextField,
  Select as MuiSelect,
  MenuItem,
  Button as MuiButton,
  DataGrid
} from '@mui/material';

export class MuiAdapter extends UIAdapter {
  Input = ({ value, onChange, ...props }) => (
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      variant="outlined"
      {...props}
    />
  );

  Select = ({ value, onChange, options, ...props }) => (
    <MuiSelect
      value={value}
      onChange={(e) => onChange(e.target.value)}
      {...props}
    >
      {options?.map(opt => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </MuiSelect>
  );

  Button = ({ onClick, children, type, ...props }) => (
    <MuiButton
      onClick={onClick}
      variant={type === 'primary' ? 'contained' : 'outlined'}
      {...props}
    >
      {children}
    </MuiButton>
  );

  Table = ({ dataSource, columns, ...props }) => (
    <DataGrid
      rows={dataSource}
      columns={columns}
      {...props}
    />
  );

  // ... остальные компоненты
}
```

## Best Practices

### 1. Нормализация событий

Разные UI библиотеки передают события по-разному. Ваш адаптер должен нормализовать их:

```javascript
// Плохо - передаем event как есть
Input = (props) => <TextField onChange={props.onChange} />;

// Хорошо - извлекаем value из event
Input = ({ onChange, ...props }) => (
  <TextField onChange={(e) => onChange(e.target.value)} {...props} />
);
```

### 2. Использование defaultProps

Установите разумные значения по умолчанию:

```javascript
Select = ({
  value,
  onChange,
  options,
  searchable = true,  // ← default значение
  ...props
}) => { ... }
```

### 3. Переиспользование базовых компонентов

Не дублируйте код, переиспользуйте компоненты:

```javascript
export class MyAdapter extends UIAdapter {
  Input = MyInput;

  // TextArea использует тот же MyInput с другим prop
  TextArea = (props) => <MyInput multiline {...props} />;
}
```

### 4. Обработка отсутствующих компонентов

Если ваша UI библиотека не имеет аналога компонента, создайте простую реализацию:

```javascript
// Если нет Badge компонента, создайте простой
Badge = ({ count, children }) => (
  <div style={{ position: 'relative' }}>
    {children}
    {count > 0 && (
      <span style={{
        position: 'absolute',
        top: -10,
        right: -10,
        background: 'red',
        color: 'white',
        borderRadius: '50%',
        padding: '2px 6px',
        fontSize: '12px'
      }}>
        {count}
      </span>
    )}
  </div>
);
```

## Тестирование адаптера

Создайте простой тест для проверки всех компонентов:

```javascript
import { render } from '@testing-library/react';
import { UIProvider } from 'fennec-core';
import { MyCustomAdapter } from './MyCustomAdapter';
import { Field, Model } from 'fennec-core';

describe('MyCustomAdapter', () => {
  it('should render Field with Input', () => {
    const { container } = render(
      <UIProvider adapter={new MyCustomAdapter()}>
        <Field item={{ type: 'string', name: 'test' }} />
      </UIProvider>
    );
    expect(container).toBeInTheDocument();
  });

  it('should render Model', () => {
    const { container } = render(
      <UIProvider adapter={new MyCustomAdapter()}>
        <Model name="users" />
      </UIProvider>
    );
    expect(container).toBeInTheDocument();
  });
});
```

## Публикация адаптера

Если вы создали адаптер для популярной UI библиотеки, вы можете опубликовать его как отдельный npm пакет:

```json
{
  "name": "@your-company/fennec-core-mui-adapter",
  "version": "1.0.0",
  "peerDependencies": {
    "fennec-core": "^1.2.0",
    "@mui/material": "^5.0.0"
  }
}
```

## Помощь и поддержка

- **Документация:** [fennec-core docs](https://github.com/your-org/fennec-core)
- **Примеры:** [examples/adapters/](../../examples/adapters/)
- **Issues:** [GitHub Issues](https://github.com/your-org/fennec-core/issues)

## Вклад в проект

Если вы создали адаптер для популярной UI библиотеки, мы будем рады принять его в официальные адаптеры! Создайте Pull Request в репозиторий fennec-core.
