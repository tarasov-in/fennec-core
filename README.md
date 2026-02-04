# Fennec Core

> Modern React UI library with UI-agnostic architecture

[![NPM](https://img.shields.io/npm/v/fennec-core.svg)](https://www.npmjs.com/package/fennec-core)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Fennec Core - это современная React библиотека для построения data-driven приложений с полной независимостью от UI framework.

## ✨ Особенности

- 🎨 **UI Agnostic** - работает с любой UI библиотекой (Ant Design, Material UI, Chakra UI, и др.)
- 🧩 **Модульная архитектура** - разделение бизнес-логики и UI
- 📦 **Tree-shaking friendly** - оптимизация bundle size
- 🔄 **100% обратная совместимость** - плавная миграция с v1.x
- ✅ **Fully tested** - unit тесты для всей бизнес-логики
- 📚 **Storybook** - интерактивная документация
- 📱 **Mobile Support** (v2.2+) - автоматическое responsive переключение Desktop ↔ Mobile
- 🎯 **TypeScript Support** (v2.3+) - полная поддержка TypeScript с comprehensive type definitions
- 🚀 **Performance Optimizations** (v2.3+) - React.memo optimization, 23-87% faster rendering
- 🎨 **Material UI Adapter** (v2.3+) - полная поддержка Material UI в дополнение к Ant Design
- ⚡ **Chakra UI Adapter** (v2.4+) - полная поддержка Chakra UI с custom theme и dark mode

## 📦 Установка

```bash
npm install fennec-core
# или
yarn add fennec-core
```

### Peer Dependencies

```bash
npm install react react-dom antd
```

## 🚀 Быстрый старт

### Базовое использование

```jsx
import React from 'react'
import { Field, Model, Collection } from 'fennec-core'
import 'fennec-core/dist/index.css'

// Field - поле формы с автоматической валидацией
function Example() {
  const [email, setEmail] = React.useState('')

  return (
    <Field
      item={{
        name: 'email',
        type: 'string',
        label: 'Email',
        validators: { required: true, email: true }
      }}
      value={email}
      onChange={setEmail}
      formItem={true}
    />
  )
}
```

### Model - форма из metadata

```jsx
import { Form } from 'antd'
import { Model } from 'fennec-core'

function UserForm() {
  const [form] = Form.useForm()

  const userMeta = {
    name: 'User',
    properties: [
      { name: 'name', type: 'string', label: 'Full Name', validators: { required: true } },
      { name: 'email', type: 'string', label: 'Email', validators: { required: true, email: true } },
      { name: 'age', type: 'integer', label: 'Age', validators: { min: 18, max: 100 } }
    ]
  }

  return (
    <Model
      form={form}
      name="User"
      meta={userMeta}
      submit={(values) => console.log('Submit:', values)}
    />
  )
}
```

### Collection - коллекция с кастомным render

```jsx
import { Collection, JSXMap } from 'fennec-core'
// Spin — из вашего UI (antd: import { Spin } from 'antd')

function UsersTable() {
  const filters = () => [
    { name: 'name', label: 'Name', type: 'string', filter: true, sort: true },
    { name: 'email', label: 'Email', type: 'string', filter: true },
    { name: 'role', label: 'Role', type: 'string', filter: true, filterType: 'group',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' }
      ]
    }
  ]

  return (
    <Collection
      name="Users"
      filters={filters}
      source="/api/users"
      modelActions={[
        { label: 'Edit', onClick: (user) => console.log('Edit', user) },
        { label: 'Delete', onClick: (user) => console.log('Delete', user) }
      ]}
      allowFullscreen={true}
      render={(items, { loading, setCollectionItem, removeCollectionItem, modelActions }) => (
        <Spin spinning={loading} tip="Загрузка...">
          {JSXMap(items || [], (item, idx) => (
            <div key={item.ID || idx}>
              {item.name} — {item.email}
              {/* действия через modelActions */}
            </div>
          ))}
        </Spin>
      )}
    />
  )
}
```

## 🎯 Основные компоненты

### Field - 26 типов полей

Поддерживает все популярные типы:
- **Строковые**: string, email, url, phone, password, text
- **Числовые**: integer, float, double, bigdecimal
- **Булевы**: boolean, bool (через Switch)
- **Временные**: date, time, datetime, timestamp
- **Выбор**: select, multiselect, radio, checkbox
- **Файлы**: file, files, image
- **Специальные**: rate, color, slider, json

```jsx
<Field
  item={{ name: 'rating', type: 'rate', label: 'Rating' }}
  value={rating}
  onChange={setRating}
/>
```

### Model - Формы из metadata

Автоматическое создание форм из описания метаданных:
- Context filters для скрытия полей
- Валидация на основе validators
- One-to-many relations через Tabs
- Initial values из object
- Field name transformation

### Collection - Таблицы и списки

Мощный компонент для работы с коллекциями:
- **Фильтры**: group, range, string, func, queryRaw
- **Сортировка**: по любым полям
- **Pagination**: с изменением размера страницы
- **Actions**: для строк и всей коллекции
- **Selection**: checkbox/radio
- **Modes**: table и list
- **Fullscreen**: встроенный режим

### Action - Модальные окна и Wizards

Универсальный компонент для модальных действий:
- **Simple Actions**: одношаговые действия
- **Multi-Step Wizards**: многошаговые формы с навигацией
- **Controlled/Uncontrolled**: гибкое управление visibility
- **PubSub Integration**: события open/close
- **Async Support**: обработка async операций
- **FormData Support**: загрузка файлов

```jsx
// Simple Action
<Action
  form={EditForm}
  object={data}
  action={(values, unlock, close) => {
    saveData(values).then(close)
  }}
  okText="Save"
  placeholder="Edit"
/>

// Multi-Step Wizard
<Action
  steps={[
    { key: 'step1', form: Step1Form, titles: { header: 'Step 1' } },
    { key: 'step2', form: Step2Form, titles: { header: 'Step 2' } }
  ]}
  action={(allStepsData, unlock, close) => {
    submitWizard(allStepsData).then(close)
  }}
  nextText="Next"
  okText="Finish"
/>
```

## 📱 Mobile Support

Fennec Core v2.2 добавляет полную поддержку mobile UI с автоматическим responsive переключением!

### Автоматическое Responsive Поведение

Все компоненты теперь автоматически переключаются между Desktop и Mobile UI:

```jsx
import { Field, Model, Collection, Action } from 'fennec-core'

// Автоматическое переключение на breakpoint 768px
<Field item={...} value={...} onChange={...} />
// Desktop (>768px): Antd Input, Select, DatePicker
// Mobile (≤768px): antd-mobile Input, Selector, DatePicker

<Collection items={...} />
// Desktop: Table с columns
// Mobile: List с items
```

**Установка для mobile:**

```bash
npm install fennec-core@2.3.0 antd-mobile react-responsive
```

### Ключевой принцип

**Desktop Core + Mobile Renderer = Правильный Mobile компонент**

```
✅ Одна FieldCore логика для Desktop И Mobile
✅ Одна ModelCore логика для всех платформ
✅ Desktop и Mobile имеют идентичное поведение
✅ Нет дублирования бизнес-логики
```

### forceMobile Prop

Для тестирования или mobile-only apps используйте `forceMobile`:

```jsx
// Принудительный mobile режим
<Field
  forceMobile={true}
  item={{ name: 'email', type: 'email', label: 'Email' }}
  value={email}
  onChange={setEmail}
/>

// Mobile UI даже на desktop устройствах
<Model forceMobile={true} object={data} onChange={setData} items={fields} />
```

---

## 🎯 TypeScript Support

### Полная поддержка TypeScript

Fennec Core v2.3+ включает comprehensive TypeScript definitions для всех компонентов:

```typescript
import { Field, Model, Collection } from 'fennec-core';
import type { FieldMeta, ModelMeta, FieldProps } from 'fennec-core';

// Field с type inference
const meta: FieldMeta = {
  type: 'string',
  label: 'Username',
  required: true,
  maxLength: 50
};

<Field meta={meta} value={username} onChange={setUsername} />

// Model с typed metadata
const userMeta: ModelMeta = {
  name: 'User',
  properties: [
    { name: 'username', type: 'string', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'age', type: 'integer', min: 0, max: 150 }
  ]
};

<Model meta={userMeta} object={user} onChange={setUser} />
```

### Преимущества TypeScript

- ✅ **Full IntelliSense** - автокомплит для всех props
- ✅ **Type Safety** - проверка типов на этапе компиляции
- ✅ **26+ Field Types** - полная типизация всех типов полей
- ✅ **Generic Types** - поддержка TypeScript generics
- ✅ **100% Backward Compatible** - JavaScript код продолжает работать

### Type-Safe CRUD

```typescript
interface User {
  id: number;
  username: string;
  email: string;
}

async function createUser(user: Omit<User, 'id'>): Promise<User> {
  const response = await CREATE('/api/users', user);
  return response.data;
}
```

Подробнее: [TYPESCRIPT.md](./TYPESCRIPT.md)

### Component Mappings

| Desktop Component | Mobile Component | Преимущество |
|------------------|------------------|--------------|
| Antd Input | antd-mobile Input | Touch-friendly |
| Antd Select | antd-mobile Selector + Picker | Wheel picker UI |
| Antd DatePicker | antd-mobile DatePicker | Native mobile picker |
| Antd Table | antd-mobile List | Better scrolling |
| Antd Modal | antd-mobile CenterPopup | Better mobile UX |
| Antd Pagination | antd-mobile InfiniteScroll | Mobile pattern |

### Mobile Renderers

Для advanced use cases используйте Mobile Renderers напрямую:

```jsx
import { UIProvider, AntdMobileAdapter } from 'fennec-core'
import { FieldMobileRenderer, ModelMobileRenderer } from 'fennec-core'

const mobileAdapter = new AntdMobileAdapter()

function MobileApp() {
  return (
    <UIProvider adapter={mobileAdapter}>
      <FieldMobileRenderer
        fieldCore={fieldCore}
        item={{ name: 'name', type: 'string' }}
        value={value}
        onChange={setValue}
      />
    </UIProvider>
  )
}
```

**Mobile Renderers:**
- `FieldMobileRenderer` - 26 field types support
- `ModelMobileRenderer` - forms с vertical/horizontal/grid layouts
- `CollectionMobileRenderer` - List display с custom display functions
- `ActionMobileRenderer` - CenterPopup modals + wizards

---

## 🚀 Performance Optimizations

### React.memo Optimization

компоненты оптимизированы с помощью React.memo и smart prop comparison:

```jsx
// Field автоматически оптимизирован
<Field meta={meta} value={value} onChange={setValue} />
// - Пропускает ре-рендер если props не изменились
// - Умное сравнение meta, value, onChange
// - 38-87% быстрее в зависимости от сценария
```

### Performance Benefits

- **Field render time**: 2.1ms → 1.3ms (**-38%**)
- **Single field update**: 12ms → 1.5ms (**-87%**)
- **Collection render**: 245ms → 152ms (**-38%**)
- **Bundle size**: 72 KB → 55 KB (**-23%**)

### Bundle Analysis

```bash
npm run analyze
```

Визуализация bundle composition с webpack-bundle-analyzer.

См. [PERFORMANCE.md](PERFORMANCE.md) для детального руководства по оптимизации.

---

## 🎨 UI Adapters

Fennec Core поддерживает несколько UI фреймворков через систему адаптеров:

### Material UI Adapter 

```tsx
import { UIProvider, MaterialUIAdapter } from 'fennec-core';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme();
const adapter = new MaterialUIAdapter();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <UIProvider adapter={adapter}>
        <YourApp />
      </UIProvider>
    </ThemeProvider>
  );
}
```

**Установка:**
```bash
npm install @mui/material @mui/x-date-pickers @emotion/react @emotion/styled dayjs
```

**Features:**
- 32 компонента маппированы на Material UI
- Полная поддержка Material UI theme
- Все компоненты работают с MaterialUIAdapter

См. [MATERIAL_UI_ADAPTER.md](MATERIAL_UI_ADAPTER.md) для полного руководства.

### Chakra UI Adapter 

```tsx
import { UIProvider, ChakraUIAdapter } from 'fennec-core';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

const customTheme = extendTheme({
  colors: {
    brand: {
      500: '#2196f3',
    },
  },
});

const adapter = new ChakraUIAdapter();

function App() {
  return (
    <ChakraProvider theme={customTheme}>
      <UIProvider adapter={adapter}>
        <YourApp />
      </UIProvider>
    </ChakraProvider>
  );
}
```

**Установка:**
```bash
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion
```

**Features:**
- 26+ компонентов маппированы на Chakra UI
- Built-in dark mode support
- Меньший bundle size чем Ant Design
- Отличная accessibility (a11y)
- Custom components для Rate и Pagination
- Native HTML5 date/time pickers

См. [CHAKRA_UI_ADAPTER.md](CHAKRA_UI_ADAPTER.md) для полного руководства.

### Сравнение адаптеров

| Feature | AntdAdapter | MaterialUIAdapter | ChakraUIAdapter |
|---------|-------------|-------------------|-----------------|
| Bundle Size | ~500KB | ~300KB | ~200KB |
| Components | 100+ | 80+ | 50+ |
| Date Pickers | Built-in | @mui/x-date-pickers | HTML5 native |
| Theming | Less variables | ThemeProvider | extendTheme |
| Mobile | antd-mobile | Responsive | Responsive |
| Dark Mode | Manual | Built-in | Built-in |
| TypeScript | Good | Excellent | Excellent |
| Accessibility | Good | Excellent | Excellent |

## 🏗️ Архитектура

Fennec Core использует трехслойную архитектуру:

```
┌─────────────┐
│  Component  │  ← Чистый API
│ (Clean API) │
└──────┬──────┘
       │
┌──────▼──────┐
│  Renderer   │  ← UI рендеринг
│ (UI Layer)  │
└──────┬──────┘
       │
┌──────▼──────┐
│    Core     │  ← Бизнес-логика
│  (Business  │
│    Logic)   │
└─────────────┘
       │
┌──────▼──────┐
│ UIAdapter   │  ← Абстракция UI
│ (UI Bridge) │
└─────────────┘
```

### UI Adapter System

UI Adapter позволяет использовать любую UI библиотеку:

```jsx
import { UIProvider, AntdAdapter } from 'fennec-core'

function App() {
  return (
    <UIProvider adapter={new AntdAdapter()}>
      <YourApp />
    </UIProvider>
  )
}
```

Создайте свой adapter для Material UI, Chakra UI, или любой другой библиотеки:

```javascript
import { UIAdapter } from 'fennec-core'
import { TextField, Button } from '@mui/material'

class MuiAdapter extends UIAdapter {
  constructor() {
    super()
    this.Input = TextField
    this.Button = Button
    // ... остальные компоненты
  }
}
```

См. [src/adapters/README.md](src/adapters/README.md) для деталей.

## 📚 Модульные импорты

Fennec Core поддерживает модульные импорты для tree-shaking:

```javascript
// Компоненты
import {
  Field,
  Model,
  Collection,
  Action,                
} from 'fennec-core'

// Модули
import {
  CRUD,          // CREATE, READ, UPDATE, DELETE
  PubSub,        // publish, subscribe, unsubscribe
  Roles,         // HasRole, HasRoleID
  Query,         // QueryParam, QueryOrder, QueryDetail
  Validation,    // formItemRules, validator
  Meta,          // GetMeta, GetMetaProperties
  ErrorHandling  // errorCatch, errorAlert
} from 'fennec-core'

// Использование
CRUD.CREATE(auth, 'users', data)
PubSub.publish('event', data)
Roles.HasRole(user, 'admin')
```

## 🔄 Миграция с v1.x

Для миграции на v2 просто измените импорты:

```jsx
// v2.0 - новые компоненты
import { Field, Model, Collection } from 'fennec-core'

<Field item={...} />
<Model name="User" />
<Collection source="/api/users" render={(items, ctx) => <div>{/* разметка */}</div>} />
```

**Детальное руководство**: см. [MIGRATION.md](MIGRATION.md)

## 📖 Документация

- **[MIGRATION.md](MIGRATION.md)** - руководство по миграции с v1.x
- **[DEPRECATION.md](DEPRECATION.md)** - устаревшие файлы и план удаления
- **[CHANGELOG.md](CHANGELOG.md)** - полная история изменений
- **[RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md)** - чеклист для релиза v2.0.0
- **[REFACTORING_PLAN.md](REFACTORING_PLAN.md)** - план рефакторинга
- **[PROGRESS.md](PROGRESS.md)** - текущий прогресс разработки
- **[MOBILE_REFACTORING_NOTES.md](MOBILE_REFACTORING_NOTES.md)** - Mobile рефакторинг (v2.2)
- **[src/adapters/README.md](src/adapters/README.md)** - создание UI адаптеров
- **[examples/](examples/)** - примеры использования
- **[Storybook](stories/)** - интерактивные примеры

### Примеры кода

См. папку [examples/](examples/) с готовыми примерами:

- **[quick-start.jsx](examples/quick-start.jsx)** - быстрый старт с компонентами
- **[field-types.jsx](examples/field-types.jsx)** - все 26 типов полей
- **[custom-adapter.jsx](examples/custom-adapter.jsx)** - создание кастомного UI адаптера
- **[migration-example.jsx](examples/migration-example.jsx)** - миграция с v1.x на v2.0

### Запуск Storybook

```bash
npm run storybook
```

Откроется на `http://localhost:6006` с интерактивными примерами всех компонентов.

## 🧪 Тестирование

```bash
# Запустить все тесты
npm test

# С coverage
npm test -- --coverage

# Конкретный файл
npm test -- FieldCore.test.js
```

### Покрытие тестами

- **FieldCore**: 63 теста, 100% coverage
- **ModelCore**: 31 тест, 100% coverage
- **CollectionCore**: 39 тестов, 100% coverage

## 🛠️ Development

```bash
# Установка зависимостей
npm install

# Разработка
npm start

# Сборка
npm run build

# Storybook
npm run storybook

# Тесты
npm test
```

## 🤝 Contributing

Мы приветствуем вклад от сообщества! См. [CONTRIBUTING.md](CONTRIBUTING.md) для:

- Как сообщить о баге
- Как предложить новую функцию
- Процесс разработки
- Pull Request guidelines
- Создание UI адаптеров

## 📄 License

MIT © [tarasov-in](https://github.com/tarasov-in)

См. [LICENSE](LICENSE) для полного текста лицензии.

---

## 💡 Примеры использования

### CRUD Operations

```javascript
import { CRUD } from 'fennec-core'

// Create
CRUD.CREATE(auth, 'users', { name: 'John', email: 'john@example.com' })
  .then(user => console.log('Created:', user))
  .catch(err => console.error('Error:', err))

// Read
CRUD.READ(auth, 'users', userId)
  .then(user => console.log('User:', user))

// Update
CRUD.UPDATE(auth, 'users', { ID: userId, name: 'Jane' })
  .then(user => console.log('Updated:', user))

// Delete
CRUD.DELETE(auth, 'users', userId)
  .then(() => console.log('Deleted'))
```

### PubSub Events

```javascript
import { PubSub } from 'fennec-core'

// Подписка на событие
PubSub.subscribe('user:created', (user) => {
  console.log('New user:', user)
})

// Публикация события
PubSub.publish('user:created', { name: 'John', email: 'john@example.com' })

// Отписка
PubSub.unsubscribe('user:created')
```

### Role-based Access

```javascript
import { Roles } from 'fennec-core'

const user = { roles: ['admin', 'moderator'] }

// Проверка роли
if (Roles.HasRole(user, 'admin')) {
  console.log('User is admin')
}

// Проверка ID роли
if (Roles.HasRoleID(user, 1)) {
  console.log('User has role with ID 1')
}
```

## 🌟 Showcase

Fennec Core используется в production приложениях для:

- 📊 Admin панелей
- 📝 CRUD приложений
- 📈 Data-driven dashboards
- 🏢 Enterprise приложений

---

**Made with ❤️ by [tarasovin](https://github.com/tarasovin)**
