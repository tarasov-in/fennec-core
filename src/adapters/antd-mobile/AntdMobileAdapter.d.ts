/**
 * AntdMobileAdapter - Ant Design Mobile adapter for fennec-core
 *
 * Provides mobile-optimized UI components based on antd-mobile.
 * Automatically used when forceMobile={true} or screen width ≤ 768px
 *
 * @version 2.2.0 - Initial mobile support
 * @version 2.3.0 - TypeScript definitions
 */

import { UIAdapter } from '../UIAdapter';

/**
 * AntdMobileAdapter class - Ant Design Mobile implementation of UIAdapter
 *
 * Component Mappings (Desktop → Mobile):
 * - Input → antd-mobile Input
 * - TextArea → antd-mobile TextArea
 * - InputNumber → antd-mobile Input (type="number")
 * - Select → antd-mobile Selector (single/multiple)
 * - Checkbox → antd-mobile Checkbox
 * - Radio → antd-mobile Radio
 * - Switch → antd-mobile Switch
 * - DatePicker → antd-mobile DatePicker
 * - TimePicker → antd-mobile DatePicker (precision="minute")
 * - Slider → antd-mobile Slider
 * - Rate → antd-mobile Rate
 * - Upload → antd-mobile ImageUploader
 * - List → antd-mobile List
 * - Modal → antd-mobile Popup
 * - Tabs → antd-mobile Tabs
 * - Button → antd-mobile Button
 * - Tag → antd-mobile Tag
 * - Badge → antd-mobile Badge
 * - Spin → antd-mobile SpinLoading
 * - Empty → antd-mobile Empty
 *
 * @example
 * ```tsx
 * import { UIProvider } from 'fennec-core';
 * import { AntdMobileAdapter } from 'fennec-core';
 *
 * const mobileAdapter = new AntdMobileAdapter();
 *
 * function MobileApp() {
 *   return (
 *     <UIProvider adapter={mobileAdapter}>
 *       <YourMobileApp />
 *     </UIProvider>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Automatic mobile detection
 * import { Field } from 'fennec-core';
 *
 * // Automatically uses AntdMobileAdapter on mobile devices (≤768px)
 * <Field meta={{ type: 'string' }} value={value} onChange={setValue} />
 *
 * // Force mobile UI
 * <Field forceMobile={true} meta={{ type: 'string' }} value={value} onChange={setValue} />
 * ```
 */
export class AntdMobileAdapter extends UIAdapter {
  constructor();
}

export default AntdMobileAdapter;
