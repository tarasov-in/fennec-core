import React from 'react';
import {
  AuthProvider,
  UserConfigProvider,
  TranslateProvider,
  MetaProvider,
  MetaContext,
  FormObserverContext,
} from 'fennec-core';

// Мок-мета для демо: одна сущность "product" с полями
const MOCK_META = {
  product: {
    name: 'product',
    label: 'Товар',
    properties: [
      { name: 'ID', type: 'uint', label: 'ID', hidden: true },
      { name: 'Title', type: 'string', label: 'Название', filter: true, sort: true },
      { name: 'Price', type: 'float', label: 'Цена', filter: true, sort: true },
      { name: 'CreatedAt', type: 'datetime', label: 'Создан', filter: true, sort: true },
    ],
  },
};

// Мок-данные для коллекции
const MOCK_ITEMS = [
  { ID: 1, Title: 'Товар 1', Price: 100.5, CreatedAt: '2024-01-15T10:00:00Z' },
  { ID: 2, Title: 'Товар 2', Price: 250, CreatedAt: '2024-02-01T12:30:00Z' },
  { ID: 3, Title: 'Товар 3', Price: 75.99, CreatedAt: '2024-01-20T09:15:00Z' },
];

function mockResponse(body) {
  return {
    status: 200,
    ok: true,
    headers: { get: () => null },
    json: () => Promise.resolve(body),
  };
}

function mockFetch(url, options = {}) {
  const u = typeof url === 'string' ? url : url?.url || '';
  if (u.includes('/api/meta')) {
    return Promise.resolve(mockResponse({ data: MOCK_META }));
  }
  if (u.includes('userconfig') || u.includes('UserConfig')) {
    return Promise.resolve(mockResponse({ status: true, data: [] }));
  }
  if (u.includes('/api/query') || u.includes('/api/query-read') || u.includes('product')) {
    return Promise.resolve(
      mockResponse({
        status: true,
        data: {
          content: MOCK_ITEMS,
          totalElements: MOCK_ITEMS.length,
          totalPages: 1,
          number: 1,
          size: 20,
        },
      })
    );
  }
  if (u.includes('/api/query-create') || u.includes('/api/query-update')) {
    return Promise.resolve(
      mockResponse({
        status: true,
        data: { ID: 99, Title: 'Новый', Price: 0, CreatedAt: new Date().toISOString() },
      })
    );
  }
  return fetch(url, options);
}

// Устанавливаем мок fetch до инициализации приложения (для MetaProvider и CRUD)
if (typeof window !== 'undefined') {
  const origFetch = window.fetch;
  window.fetch = function (url, ...args) {
    const urlStr = typeof url === 'string' ? url : url?.url || '';
    if (urlStr.includes('/api/')) {
      return mockFetch(url, ...args);
    }
    return origFetch.call(this, url, ...args);
  };
}

// Поддельный JWT (только payload: { sub: "1" }) чтобы loggedIn() был true
const FAKE_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIn0.x';
if (typeof document !== 'undefined') {
  document.cookie = `token=${FAKE_TOKEN}; path=/; max-age=3600`;
}

const formObserverDefault = [false, () => false, () => {}];

export function DemoProviders({ children }) {
  return (
    <AuthProvider>
      <UserConfigProvider>
        <TranslateProvider>
          <MetaProvider>
            <FormObserverContext.Provider value={formObserverDefault}>
              {children}
            </FormObserverContext.Provider>
          </MetaProvider>
        </TranslateProvider>
      </UserConfigProvider>
    </AuthProvider>
  );
}

export { MetaContext };
