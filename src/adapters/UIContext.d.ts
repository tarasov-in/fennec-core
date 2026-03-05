/**
 * UIContext - React Context for UI Adapter
 *
 * Provides UIAdapter instance throughout the component tree
 *
 * @version 2.3.0 - TypeScript definitions
 */

import { ComponentType, ReactNode } from 'react';
import { UIAdapter } from './UIAdapter';

export interface UIProviderProps {
  /**
   * UIAdapter instance (AntdAdapter, AntdMobileAdapter, etc.)
   */
  adapter: UIAdapter;

  /**
   * Children components
   */
  children: ReactNode;
}

/**
 * UIProvider - Context provider for UIAdapter
 *
 * @example
 * ```tsx
 * import { UIProvider, AntdAdapter } from 'fennec-core';
 *
 * const adapter = new AntdAdapter();
 *
 * function App() {
 *   return (
 *     <UIProvider adapter={adapter}>
 *       <YourApp />
 *     </UIProvider>
 *   );
 * }
 * ```
 */
export const UIProvider: ComponentType<UIProviderProps>;

/**
 * useUIAdapter - Hook to access current UIAdapter
 *
 * Throws error if used outside UIProvider
 *
 * @example
 * ```tsx
 * import { useUIAdapter } from 'fennec-core';
 *
 * function MyComponent() {
 *   const adapter = useUIAdapter();
 *   const Button = adapter.Button;
 *
 *   return <Button onClick={handleClick}>Click me</Button>;
 * }
 * ```
 */
export function useUIAdapter(): UIAdapter;

/**
 * useUIOptional - Hook to access current UIAdapter (optional)
 *
 * Returns undefined if used outside UIProvider
 *
 * @example
 * ```tsx
 * import { useUIOptional, AntdAdapter } from 'fennec-core';
 *
 * function MyComponent() {
 *   const adapter = useUIOptional() || new AntdAdapter();
 *   const Button = adapter.Button;
 *
 *   return <Button onClick={handleClick}>Click me</Button>;
 * }
 * ```
 */
export function useUIOptional(): UIAdapter | undefined;
