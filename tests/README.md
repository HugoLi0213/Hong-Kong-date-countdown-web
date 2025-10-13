# Hong Kong Holiday Countdown - Test Suite

This directory contains the test suite for the Hong Kong Holiday Countdown web application.

## Test Structure

```
tests/
├── setup.js              # Global test setup and mocks
├── basic.test.js         # Basic functionality tests
├── app-core.test.js      # Core application logic tests
└── unit/                 # Unit tests for Vue components
    ├── NotificationSettings.test.js
    ├── LanguageSwitcher.test.js
    ├── EmptyState.test.js
    └── NotificationBadge.test.js
```

## Test Framework

- **Vitest**: Fast unit test framework with Jest-compatible API
- **@vue/test-utils**: Vue component testing utilities
- **jsdom**: DOM simulation for browser environment testing

## Running Tests

```bash
# Run all tests
npm test

# Run tests once (CI mode)
npm run test:run

# Run tests with UI
npm run test:ui

# Run specific test file
npm run test:run tests/app-core.test.js

# Run unit tests only
npm run test:run tests/unit
```

## Test Coverage

### ✅ Working Tests
- **Basic Tests** (2 tests): Framework validation
- **App Core Tests** (11 tests): Core application functionality
  - Local Storage utilities
  - Date calculations
  - Language support
  - Holiday data structure validation

### 🔧 Component Tests (In Development)
- Vue component tests are configured but need additional setup for Vue plugin integration
- Tests are written and ready to run once Vue testing environment is fully configured

## Test Categories

### Local Storage Utilities
- Saving/loading notification settings
- Managing favorite holidays
- Settings persistence

### Date Calculations
- Days until holiday calculations
- Past/future holiday identification

### Language Support
- English/Chinese translations
- Language switching logic

### Holiday Data Structure
- Required properties validation
- Bilingual content verification
- Holiday type validation

## Mock Setup

The test environment includes mocks for:
- `localStorage` API
- `Notification` API
- `navigator.share` API
- `navigator.clipboard` API

## Future Enhancements

1. **Vue Component Testing**: Complete Vue plugin configuration for component unit tests
2. **Integration Tests**: End-to-end user workflow testing
3. **API Testing**: Backend integration testing (if applicable)
4. **Performance Testing**: Load and performance benchmarks
5. **Accessibility Testing**: WCAG compliance validation

## Configuration Files

- `vitest.config.js`: Vitest configuration with Vue support
- `vite.config.js`: Vite configuration with path aliases
- `tsconfig.json`: TypeScript configuration
- `tsconfig.node.json`: Node.js TypeScript configuration

## Adding New Tests

1. Create test file in appropriate directory (`tests/` or `tests/unit/`)
2. Follow naming convention: `*.test.js`
3. Import testing utilities: `import { describe, it, expect } from 'vitest'`
4. Use descriptive test names and organize with `describe` blocks
5. Mock external dependencies as needed

Example:
```javascript
import { describe, it, expect } from 'vitest'

describe('My Feature', () => {
  it('should work correctly', () => {
    expect(myFunction()).toBe(expectedResult)
  })
})
```