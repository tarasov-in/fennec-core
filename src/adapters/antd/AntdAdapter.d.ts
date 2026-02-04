/**
 * AntdAdapter - Ant Design adapter for fennec-core
 *
 * Provides all UI components based on Ant Design.
 * This is the default adapter for fennec-core to ensure backward compatibility.
 *
 * @version 2.3.0 - TypeScript definitions
 */

import { UIAdapter } from '../UIAdapter';

/**
 * AntdAdapter class - Ant Design implementation of UIAdapter
 *
 * @example
 * ```tsx
 * import { UIProvider } from 'fennec-core';
 * import { AntdAdapter } from 'fennec-core';
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
export class AntdAdapter extends UIAdapter {
  constructor();

  /**
   * Ant Design Form hook for creating form instances
   */
  useFormInstance(): any;
}

export default AntdAdapter;
