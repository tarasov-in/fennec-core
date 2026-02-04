# FieldCore Tests

## Обзор

Comprehensive test suite для FieldCore с покрытием всех типов полей и граничных случаев.

## Запуск тестов

```bash
# Все тесты
npm test

# Только FieldCore тесты
npm test -- --testPathPattern=FieldCore

# С покрытием
npm test -- --coverage --testPathPattern=FieldCore
```

## Покрытие

### Типы полей (100%)
- ✅ String types (string, email, url, phone, password, text)
- ✅ Numeric types (integer, int, long, float, double, bigdecimal)
- ✅ Boolean types (boolean, bool)
- ✅ Date types (date, localdate)
- ✅ Time types (time, localtime)
- ✅ DateTime types (datetime, timestamp, localdatetime)

### Тестируемые сценарии

#### 1. Field Type Detection (2 теста)
- Определение типа по умолчанию (string)
- Определение типа из metadata

#### 2. String Types (4 теста)
- Конвертация number → string
- Обработка null/undefined
- Обработка пустой строки
- Сохранение string значения

#### 3. Integer Types (6 тестов)
- Парсинг из string
- Сохранение number
- Обработка decimal через floor
- Отрицательные числа
- Zero value
- Empty string → undefined

#### 4. Float Types (4 теста)
- Парсинг из string
- Сохранение precision
- BigDecimal
- Scientific notation

#### 5. Boolean Types (5 тестов)
- True boolean
- False boolean
- Truthy values → true
- Falsy values → false
- Корректный parsing

#### 6. Date Types (5 тестов)
- Парсинг ISO string
- Обработка dayjs object
- Null/undefined → null
- Dayjs → YYYY-MM-DD
- Invalid date handling

#### 7. Time Types (4 теста)
- Парсинг HH:mm:ss string
- Обработка dayjs object
- Dayjs → HH:mm:ss
- Edge time values (00:00:00, 23:59:59)

#### 8. DateTime Types (4 теста)
- Парсинг ISO string
- Timestamp type
- Dayjs → ISO string
- LocalDateTime

#### 9. Validation Rules (2 теста)
- Определение required field
- Определение non-required field

#### 10. Placeholder Generation (5 тестов)
- Custom placeholder from props
- Meta placeholder
- Generated placeholder для integer
- Generated placeholder для date
- Empty string для boolean

#### 11. Type-Specific Props (6 тестов)
- Min/max для integer
- Precision для float
- Checked для boolean
- Format для date
- ShowTime для datetime
- Custom format

#### 12. Component Props Generation (4 теста)
- Value и onChange
- Disabled state
- Disabled from meta
- onChange callback

#### 13. Label and Help Text (4 теста)
- Label from props
- Label from meta
- Help text
- Tooltip

#### 14. Edge Cases (8 тестов)
- Undefined meta
- Null value
- Empty object meta
- Missing onChange
- Very large numbers
- NaN handling

**Всего тестов: 63**

## Граничные случаи

### Обрабатываемые граничные случаи:
- ✅ Null и undefined значения
- ✅ Пустые строки
- ✅ Очень большие числа (MAX_SAFE_INTEGER)
- ✅ NaN для numeric types
- ✅ Invalid dates
- ✅ Edge time values (00:00:00, 23:59:59)
- ✅ Отрицательные числа
- ✅ Scientific notation
- ✅ Truthy/falsy values для boolean
- ✅ Отсутствующие callbacks
- ✅ Undefined/empty metadata

## Структура тестов

```
describe('FieldCore')
  ├─ Field Type Detection
  ├─ String Types - formatValue
  ├─ Integer Types - formatValue/parseValue
  ├─ Float Types - formatValue/parseValue
  ├─ Boolean Types - formatValue/parseValue
  ├─ Date Types - formatValue/parseValue
  ├─ Time Types - formatValue/parseValue
  ├─ DateTime Types - formatValue/parseValue
  ├─ Validation Rules
  ├─ Placeholder Generation
  ├─ Type-Specific Props
  ├─ Component Props Generation
  ├─ Label and Help Text
  └─ Edge Cases
```

## Качество тестов

- **Покрытие типов**: 100% всех поддерживаемых типов
- **Граничные случаи**: 8 специальных тестов
- **Интеграция с dayjs**: Полное покрытие temporal types
- **Validation**: Проверка всех validation rules
- **Props generation**: Все type-specific props покрыты

## Следующие шаги

После расширения FieldCore на новые типы (select, file, etc.), добавить соответствующие тесты в этот файл.
