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
 * useUI - хук для получения UI адаптера
 *
 * Возвращает текущий UI адаптер из контекста.
 * Если адаптер не найден, выбрасывает ошибку с подсказкой.
 *
 * @returns {UIAdapter} Экземпляр UI адаптера
 * @throws {Error} Если используется вне UIProvider
 *
 * @example
 * function MyComponent() {
 *   const ui = useUI();
 *   const Input = ui.Input;
 *   return <Input value={value} onChange={onChange} />;
 * }
 */
export function useUI() {
  const adapter = useContext(UIContext)

  if (!adapter) {
    throw new Error(
      'useUI must be used within UIProvider. ' +
      'Wrap your app with <UIProvider adapter={new AntdAdapter()}>'
    )
  }

  return adapter
}

/**
 * useUIAdapter - алиас для useUI (для обратной совместимости)
 * @returns {UIAdapter} Экземпляр UI адаптера
 */
export function useUIAdapter() {
  return useUI()
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

// ==================== Специализированные хуки ====================

/**
 * useInput - хук для получения Input компонента
 * @returns {React.Component} Input компонент
 */
export function useInput() {
  const ui = useUI()
  return ui.Input
}

/**
 * useTextArea - хук для получения TextArea компонента
 * @returns {React.Component} TextArea компонент
 */
export function useTextArea() {
  const ui = useUI()
  return ui.TextArea
}

/**
 * useInputNumber - хук для получения InputNumber компонента
 * @returns {React.Component} InputNumber компонент
 */
export function useInputNumber() {
  const ui = useUI()
  return ui.InputNumber
}

/**
 * useSelect - хук для получения Select компонента
 * @returns {React.Component} Select компонент
 */
export function useSelect() {
  const ui = useUI()
  return ui.Select
}

/**
 * useCheckbox - хук для получения Checkbox компонента
 * @returns {React.Component} Checkbox компонент
 */
export function useCheckbox() {
  const ui = useUI()
  return ui.Checkbox
}

/**
 * useRadio - хук для получения Radio компонента
 * @returns {React.Component} Radio компонент
 */
export function useRadio() {
  const ui = useUI()
  return ui.Radio
}

/**
 * useDatePicker - хук для получения DatePicker компонента
 * @returns {React.Component} DatePicker компонент
 */
export function useDatePicker() {
  const ui = useUI()
  return ui.DatePicker
}

/**
 * useTimePicker - хук для получения TimePicker компонента
 * @returns {React.Component} TimePicker компонент
 */
export function useTimePicker() {
  const ui = useUI()
  return ui.TimePicker
}

/**
 * useRangePicker - хук для получения RangePicker компонента
 * @returns {React.Component} RangePicker компонент
 */
export function useRangePicker() {
  const ui = useUI()
  return ui.RangePicker
}

/**
 * useSlider - хук для получения Slider компонента
 * @returns {React.Component} Slider компонент
 */
export function useSlider() {
  const ui = useUI()
  return ui.Slider
}

/**
 * useUpload - хук для получения Upload компонента
 * @returns {React.Component} Upload компонент
 */
export function useUpload() {
  const ui = useUI()
  return ui.Upload
}

/**
 * useDragger - хук для получения Dragger компонента
 * @returns {React.Component} Dragger компонент
 */
export function useDragger() {
  const ui = useUI()
  return ui.Dragger
}

/**
 * useTable - хук для получения Table компонента
 * @returns {React.Component} Table компонент
 */
export function useTable() {
  const ui = useUI()
  return ui.Table
}

/**
 * useList - хук для получения List компонента
 * @returns {React.Component} List компонент
 */
export function useList() {
  const ui = useUI()
  return ui.List
}

/**
 * useCard - хук для получения Card компонента
 * @returns {React.Component} Card компонент
 */
export function useCard() {
  const ui = useUI()
  return ui.Card
}

/**
 * useImage - хук для получения Image компонента
 * @returns {React.Component} Image компонент
 */
export function useImage() {
  const ui = useUI()
  return ui.Image
}

/**
 * useForm - хук для получения Form компонента
 * @returns {React.Component} Form компонент
 */
export function useForm() {
  const ui = useUI()
  return ui.Form
}

/**
 * useFormItem - хук для получения FormItem компонента
 * @returns {React.Component} FormItem компонент
 */
export function useFormItem() {
  const ui = useUI()
  return ui.FormItem
}

/**
 * useModal - хук для получения Modal компонента
 * @returns {React.Component} Modal компонент
 */
export function useModal() {
  const ui = useUI()
  return ui.Modal
}

/**
 * useDrawer - хук для получения Drawer компонента
 * @returns {React.Component} Drawer компонент
 */
export function useDrawer() {
  const ui = useUI()
  return ui.Drawer
}

/**
 * useTabs - хук для получения Tabs компонента
 * @returns {React.Component} Tabs компонент
 */
export function useTabs() {
  const ui = useUI()
  return ui.Tabs
}

/**
 * useTabPane - хук для получения TabPane компонента
 * @returns {React.Component} TabPane компонент
 */
export function useTabPane() {
  const ui = useUI()
  return ui.TabPane
}

/**
 * useDivider - хук для получения Divider компонента
 * @returns {React.Component} Divider компонент
 */
export function useDivider() {
  const ui = useUI()
  return ui.Divider
}

/**
 * useSpace - хук для получения Space компонента
 * @returns {React.Component} Space компонент
 */
export function useSpace() {
  const ui = useUI()
  return ui.Space
}

/**
 * useButton - хук для получения Button компонента
 * @returns {React.Component} Button компонент
 */
export function useButton() {
  const ui = useUI()
  return ui.Button
}

/**
 * useDropdown - хук для получения Dropdown компонента
 * @returns {React.Component} Dropdown компонент
 */
export function useDropdown() {
  const ui = useUI()
  return ui.Dropdown
}

/**
 * useTooltip - хук для получения Tooltip компонента
 * @returns {React.Component} Tooltip компонент
 */
export function useTooltip() {
  const ui = useUI()
  return ui.Tooltip
}

/**
 * usePagination - хук для получения Pagination компонента
 * @returns {React.Component} Pagination компонент
 */
export function usePagination() {
  const ui = useUI()
  return ui.Pagination
}

/**
 * useSpin - хук для получения Spin компонента
 * @returns {React.Component} Spin компонент
 */
export function useSpin() {
  const ui = useUI()
  return ui.Spin
}

/**
 * useEmpty - хук для получения Empty компонента
 * @returns {React.Component} Empty компонент
 */
export function useEmpty() {
  const ui = useUI()
  return ui.Empty
}

/**
 * useTag - хук для получения Tag компонента
 * @returns {React.Component} Tag компонент
 */
export function useTag() {
  const ui = useUI()
  return ui.Tag
}

/**
 * useBadge - хук для получения Badge компонента
 * @returns {React.Component} Badge компонент
 */
export function useBadge() {
  const ui = useUI()
  return ui.Badge
}
