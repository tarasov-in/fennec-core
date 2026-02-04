/**
 * MaterialUIAdapter - Material UI adapter for fennec-core
 *
 * Provides all UI components based on Material UI (MUI).
 * Alternative to AntdAdapter for projects using Material UI.
 *
 * @version 2.4.0 - Material UI Adapter
 */

import { UIAdapter } from '../UIAdapter';

/**
 * MaterialUIAdapter class - Material UI implementation of UIAdapter
 *
 * Component Mappings:
 * - Input → TextField
 * - TextArea → TextField (multiline)
 * - InputNumber → TextField (type="number")
 * - Select → Select with MenuItem
 * - Checkbox → Checkbox with FormControlLabel
 * - Radio → RadioGroup with FormControlLabel
 * - Switch → Switch with FormControlLabel
 * - DatePicker → @mui/x-date-pickers DatePicker
 * - TimePicker → @mui/x-date-pickers TimePicker
 * - RangePicker → Two DatePickers in Stack
 * - Slider → Slider
 * - Upload → Button with file input
 * - Rate → Rating
 * - ColorPicker → TextField (type="color")
 * - Table → Table with TableContainer
 * - List → List with ListItem
 * - Card → Card with CardHeader/CardContent
 * - Modal → Dialog
 * - Drawer → Drawer
 * - Tabs → Tabs with Tab
 * - Button → Button
 * - Dropdown → Menu
 * - Tooltip → Tooltip
 * - Pagination → TablePagination
 * - Spin → CircularProgress
 * - Empty → Box with text
 * - Tag → Chip
 * - Badge → Badge
 *
 * @example
 * ```tsx
 * import { UIProvider } from 'fennec-core';
 * import { MaterialUIAdapter } from 'fennec-core';
 * import { ThemeProvider, createTheme } from '@mui/material/styles';
 *
 * const theme = createTheme();
 * const adapter = new MaterialUIAdapter();
 *
 * function App() {
 *   return (
 *     <ThemeProvider theme={theme}>
 *       <UIProvider adapter={adapter}>
 *         <YourApp />
 *       </UIProvider>
 *     </ThemeProvider>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Using with Field
 * import { Field, MaterialUIAdapter, UIProvider } from 'fennec-core';
 *
 * const adapter = new MaterialUIAdapter();
 *
 * function MyForm() {
 *   return (
 *     <UIProvider adapter={adapter}>
 *       <Field
 *         meta={{ type: 'string', label: 'Name' }}
 *         value={name}
 *         onChange={setName}
 *       />
 *     </UIProvider>
 *   );
 * }
 * ```
 */
export class MaterialUIAdapter extends UIAdapter {
  /**
   * Adapter name identifier
   */
  adapterName: string;

  constructor();

  /**
   * Get adapter type
   */
  getType(): string;

  /**
   * Check if this is mobile adapter
   */
  isMobile(): boolean;
}

export default MaterialUIAdapter;
