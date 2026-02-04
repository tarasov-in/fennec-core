# CollectionCore Tests

## Overview

Comprehensive test suite for CollectionCore with coverage of all business logic methods for filtering, sorting, pagination, and collection management.

## Running Tests

```bash
# All tests
npm test

# Only CollectionCore tests
npm test -- --testPathPattern=CollectionCore

# With coverage
npm test -- --coverage --testPathPattern=CollectionCore
```

## Coverage

### Test Categories

#### 1. Default Filters (3 tests)
- ✅ Extract default filters from filter definitions
- ✅ Return empty object for no filtered values
- ✅ Handle empty filters array

#### 2. Default Sorting (2 tests)
- ✅ Extract default sorting from filter definitions
- ✅ Return default sorting when no sorted value

#### 3. Query Parameters Building (2 tests)
- ✅ Build basic query parameters (page, count, detail)
- ✅ Include sorting parameters

#### 4. Filter Building by Type (5 tests)
- ✅ Build group filter (w-in-*)
- ✅ Build range filter for integers (w-lge-*, w-lwe-*)
- ✅ Build range filter for dates
- ✅ Build string filter with default comparer (co)
- ✅ Build string filter with custom comparer

#### 5. Range Filter Building (5 tests)
- ✅ Handle time range (HH:mm:ss format)
- ✅ Handle datetime range (YYYY-MM-DD HH:mm format)
- ✅ Return empty array for invalid range
- ✅ Handle float range
- ✅ Handle integer range

#### 6. Default Filter Building (4 tests)
- ✅ Handle func type with queryPrefix
- ✅ Handle queryRaw
- ✅ Handle queryRaw as function
- ✅ Handle queryComparer as function

#### 7. Collection Item Management (2 tests)
- ✅ Update item in collection
- ✅ Remove item from collection

#### 8. Filter Changes Detection (3 tests)
- ✅ Detect filter changes
- ✅ Detect no changes when filters are same
- ✅ Detect changes when filter added

#### 9. Pagination Validation (4 tests)
- ✅ Validate and fix pagination parameters
- ✅ Fix invalid current page (min 1)
- ✅ Fix invalid count (min 1)
- ✅ Handle string parameters

#### 10. Pagination Checks (3 tests)
- ✅ Detect more pages available
- ✅ Detect last page
- ✅ Detect beyond last page

#### 11. Filter Value Management (6 tests)
- ✅ Get filter value
- ✅ Return undefined for non-existent filter
- ✅ Set filter value
- ✅ Remove filter when value is empty
- ✅ Not remove permanent filter when empty
- ✅ Remove filter when array is empty

**Total Tests: 39**

## Test Structure

```
describe('CollectionCore')
  ├─ Default Filters
  ├─ Default Sorting
  ├─ Query Parameters Building
  ├─ Filter Building by Type
  ├─ Range Filter Building
  ├─ Default Filter Building
  ├─ Collection Item Management
  ├─ Filter Changes Detection
  ├─ Pagination Validation
  ├─ Pagination Checks
  └─ Filter Value Management
```

## Quality Metrics

- **Coverage**: 100% of public methods
- **Filter Types**: All filter types covered (group, range, string, func, queryRaw)
- **Data Types**: All temporal types covered (time, date, datetime)
- **Edge Cases**: Invalid ranges, empty values, permanent filters
- **Business Logic**: Pure business logic testing without UI

## Filter Types Tested

### Group Filters
- `filterType: "group"` → `w-in-{field}` parameter

### Range Filters
- Numbers (int, uint, float, double, bigdecimal) → `w-lge-{field}`, `w-lwe-{field}`
- Time → `w-lge-{field}`, `w-lwe-{field}` with HH:mm:ss format
- Date → `w-lge-{field}`, `w-lwe-{field}` with YYYY-MM-DD format
- DateTime → `w-lge-{field}`, `w-lwe-{field}` with YYYY-MM-DD HH:mm format

### String Filters
- Default comparer: `co` (contains) → `w-co-{field}`
- Custom comparer: specified in metadata → `w-{comparer}-{field}`
- Function comparer: dynamic based on value

### Function Filters
- `queryPrefix` support
- `queryRaw` support (static and function)
- `queryComparer` support (static and function)

## Next Steps

After completing CollectionCore tests, add:
- CollectionRenderer integration tests (with mocked UIAdapter)
- Collection component tests
- Storybook stories for interactive examples
