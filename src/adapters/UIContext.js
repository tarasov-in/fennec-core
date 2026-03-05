import React, { createContext, useContext, useMemo } from 'react'

/**
 * UIContext - контекст для UI адаптера
 *
 * Предоставляет доступ к UI компонентам через Context API.
 * Позволяет компонентам fennec-core получать UI компоненты из адаптера
 * без прямой зависимости от конкретной UI библиотеки.
 */
const UIContext = createContext(null)

/**
 * UIProvider - провайдер UI адаптера
 *
 * Оборачивает приложение и предоставляет UI адаптер всем дочерним компонентам.
 *
 * @param {Object} props
 * @param {UIAdapter} props.adapter - Экземпляр UI адаптера (AntdAdapter, MuiAdapter, etc.)
 * @param {React.ReactNode} props.children - Дочерние компоненты
 *
 * @example
 * import { UIProvider } from 'fennec-core';
 * import { AntdAdapter } from 'fennec-core/adapters/antd';
 *
 * function App() {
 *   return (
 *     <UIProvider adapter={new AntdAdapter()}>
 *       <YourApp />
 *     </UIProvider>
 *   );
 * }
 */
export function UIProvider({ children, adapter }) {
  // Мемоизируем адаптер, чтобы избежать лишних ререндеров
  const memoizedAdapter = useMemo(() => adapter, [adapter])

  return (
    <UIContext.Provider value={memoizedAdapter}>
      {children}
    </UIContext.Provider>
  )
}

/**
 * useUIAdapter - хук для получения UI адаптера
 *
 * Возвращает текущий UI адаптер из контекста.
 * Если адаптер не найден, выбрасывает ошибку с подсказкой.
 *
 * @returns {UIAdapter} Экземпляр UI адаптера
 * @throws {Error} Если используется вне UIProvider
 *
 * @example
 * function MyComponent() {
 *   const ui = useUIAdapter();
 *   const Input = ui.Input;
 *   return <Input value={value} onChange={onChange} />;
 * }
 */
export function useUIAdapter() {
  const adapter = useContext(UIContext)

  if (!adapter) {
    throw new Error(
      'useUIAdapter must be used within UIProvider. ' +
      'Wrap your app with <UIProvider adapter={new AntdAdapter()}>'
    )
  }

  return adapter
}

/**
 * useUIOptional - опциональный хук для получения UI адаптера
 *
 * Возвращает UI адаптер или null если провайдер не найден.
 * Полезно для компонентов, которые могут работать как с адаптером, так и без него.
 *
 * @returns {UIAdapter|null} Экземпляр UI адаптера или null
 *
 * @example
 * function MyComponent() {
 *   const ui = useUIOptional();
 *   if (!ui) {
 *     // Fallback на старую реализацию
 *     return <OldImplementation />;
 *   }
 *   return <NewImplementation ui={ui} />;
 * }
 */
export function useUIOptional() {
  return useContext(UIContext)
}
