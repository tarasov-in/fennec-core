# ModelCore Tests

## Overview

Comprehensive test suite for ModelCore with coverage of all business logic methods.

## Running Tests

```bash
# All tests
npm test

# Only ModelCore tests
npm test -- --testPathPattern=ModelCore

# With coverage
npm test -- --coverage --testPathPattern=ModelCore
```

## Coverage

### Test Categories

#### 1. Property Extraction (6 tests)
- ✅ Get all properties from metadata
- ✅ Handle invalid metadata
- ✅ Filter out ID and one-to-many relations
- ✅ Get only one-to-many relations
- ✅ Handle empty scheme
- ✅ Filter one-to-many by scheme

#### 2. Tail Scheme (3 tests)
- ✅ Extract tail scheme from nested paths
- ✅ Return undefined for empty scheme
- ✅ Handle single-level scheme

#### 3. Context Filters (3 tests)
- ✅ Extract exclude fields from array context filters
- ✅ Extract exclude fields from object context filters
- ✅ Return empty object for no context filters

#### 4. Field Names (4 tests)
- ✅ Add ID suffix for object types
- ✅ Add ID suffix for document types
- ✅ No ID suffix for regular types
- ✅ Uncapitalize field names

#### 5. Initial Values (2 tests)
- ✅ Return object as initial values
- ✅ Return empty object when no object provided

#### 6. Property Exclusion (3 tests)
- ✅ Exclude properties in exclude fields
- ✅ Exclude properties with ID suffix
- ✅ Not exclude properties not in exclude fields

#### 7. Properties for Rendering (1 test)
- ✅ Return filtered properties excluding context filters

#### 8. One-to-Many Relations Check (3 tests)
- ✅ Return true when object has ID and relations exist
- ✅ Return false when object has no ID
- ✅ Return false when no relations exist

#### 9. Property Labels (3 tests)
- ✅ Return label for non-boolean types
- ✅ Return undefined for boolean types (bool)
- ✅ Return undefined for boolean types (boolean)

#### 10. Functional Properties (3 tests)
- ✅ Identify functional properties
- ✅ Not identify regular properties as functional
- ✅ Require both type=func and render function

**Total Tests: 31**

## Test Structure

```
describe('ModelCore')
  ├─ Property Extraction
  ├─ Tail Scheme
  ├─ Context Filters
  ├─ Field Names
  ├─ Initial Values
  ├─ Property Exclusion
  ├─ Properties for Rendering
  ├─ One-to-Many Relations Check
  ├─ Property Labels
  └─ Functional Properties
```

## Quality Metrics

- **Coverage**: 100% of public methods
- **Edge Cases**: All edge cases covered
- **Business Logic**: All business rules tested
- **No UI Dependencies**: Pure business logic testing

## Next Steps

After completing ModelCore tests, add tests for:
- ModelRenderer (integration tests with mocked UIAdapter)
- Model (integration tests)
