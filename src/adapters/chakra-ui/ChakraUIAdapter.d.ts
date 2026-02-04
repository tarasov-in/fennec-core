/**
 * ChakraUIAdapter - Chakra UI adapter for fennec-core
 *
 * Provides all UI components based on Chakra UI.
 * Alternative to AntdAdapter for projects using Chakra UI.
 *
 * @version 2.4.0 - Chakra UI Adapter
 */

import { UIAdapter } from '../UIAdapter';

/**
 * ChakraUIAdapter class - Chakra UI implementation of UIAdapter
 *
 * Component Mappings:
 * - Input → Input (Chakra UI)
 * - TextArea → Textarea (Chakra UI)
 * - InputNumber → NumberInput (Chakra UI)
 * - Select → Select (Chakra UI)
 * - Checkbox → Checkbox (Chakra UI)
 * - Radio → RadioGroup + Radio (Chakra UI)
 * - Switch → Switch (Chakra UI)
 * - DatePicker → Input type="date"
 * - TimePicker → Input type="time"
 * - RangePicker → Two Inputs in HStack
 * - Slider → Slider (Chakra UI)
 * - Upload → Button with file input
 * - Rate → Custom star rating
 * - ColorPicker → Input type="color"
 * - Table → Table (Chakra UI)
 * - List → List + ListItem (Chakra UI)
 * - Card → Card (Chakra UI)
 * - Modal → Modal (Chakra UI)
 * - Drawer → Drawer (Chakra UI)
 * - Tabs → Tabs + Tab (Chakra UI)
 * - Button → Button (Chakra UI)
 * - Dropdown → Menu (Chakra UI)
 * - Tooltip → Tooltip (Chakra UI)
 * - Pagination → Custom pagination
 * - Spin → Spinner (Chakra UI)
 * - Empty → Box with empty state
 * - Tag → Tag (Chakra UI)
 * - Badge → Badge (Chakra UI)
 *
 * @example
 * ```tsx
 * import { UIProvider, ChakraUIAdapter } from 'fennec-core';
 * import { ChakraProvider } from '@chakra-ui/react';
 *
 * const adapter = new ChakraUIAdapter();
 *
 * function App() {
 *   return (
 *     <ChakraProvider>
 *       <UIProvider adapter={adapter}>
 *         <YourApp />
 *       </UIProvider>
 *     </ChakraProvider>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Using with Field
 * import { Field, ChakraUIAdapter, UIProvider } from 'fennec-core';
 * import { ChakraProvider } from '@chakra-ui/react';
 *
 * const adapter = new ChakraUIAdapter();
 *
 * function MyForm() {
 *   return (
 *     <ChakraProvider>
 *       <UIProvider adapter={adapter}>
 *         <Field
 *           meta={{ type: 'string', label: 'Name' }}
 *           value={name}
 *           onChange={setName}
 *         />
 *       </UIProvider>
 *     </ChakraProvider>
 *   );
 * }
 * ```
 */
export class ChakraUIAdapter extends UIAdapter {
  /**
   * Adapter name identifier
   */
  adapterName: string;

  constructor();

  /**
   * Load Chakra UI components asynchronously
   */
  loadChakraComponents(): Promise<void>;

  /**
   * Get adapter type
   */
  getType(): string;

  /**
   * Check if this is mobile adapter
   */
  isMobile(): boolean;
}

export default ChakraUIAdapter;
