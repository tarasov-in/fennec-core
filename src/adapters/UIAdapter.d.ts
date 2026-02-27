/**
 * UIAdapter - Base class for UI adapters
 *
 * Defines the contract for all UI components that an adapter must provide.
 * Each adapter (AntdAdapter, AntdMobileAdapter, MaterialUIAdapter, etc.)
 * should extend this class and provide implementations for all components.
 *
 * @version 2.3.0 - Added TypeScript definitions
 */

import { ComponentType, ReactNode } from 'react';
import { Dayjs } from 'dayjs';

// ==================== Common Types ====================

export interface BaseComponentProps {
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export interface BaseInputProps<T = any> extends BaseComponentProps {
  value?: T;
  onChange?: (value: T) => void;
  placeholder?: string;
}

export interface SelectOption {
  label: string;
  value: any;
}

export interface ColumnDef {
  title: string;
  dataIndex: string;
  key?: string;
  render?: (value: any, record: any, index: number) => ReactNode;
  sorter?: boolean | ((a: any, b: any) => number);
  filters?: Array<{ text: string; value: any }>;
  width?: number | string;
}

export interface PaginationConfig {
  current?: number;
  pageSize?: number;
  total?: number;
  showSizeChanger?: boolean;
  pageSizeOptions?: string[];
  onChange?: (page: number, pageSize: number) => void;
}

export interface FormInstance {
  getFieldValue: (name: string) => any;
  setFieldValue: (name: string, value: any) => void;
  getFieldsValue: () => Record<string, any>;
  setFieldsValue: (values: Record<string, any>) => void;
  validateFields: () => Promise<Record<string, any>>;
  resetFields: () => void;
}

export interface ValidationRule {
  required?: boolean;
  message?: string;
  pattern?: RegExp;
  min?: number;
  max?: number;
  len?: number;
  validator?: (rule: any, value: any) => Promise<void>;
}

// ==================== Component Props Interfaces ====================

export interface InputProps extends BaseInputProps<string> {
  type?: 'text' | 'password' | 'email' | 'url' | 'tel' | 'search';
  maxLength?: number;
  showCount?: boolean;
  allowClear?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  addonBefore?: ReactNode;
  addonAfter?: ReactNode;
}

export interface TextAreaProps extends BaseInputProps<string> {
  rows?: number;
  minRows?: number;
  maxRows?: number;
  maxLength?: number;
  showCount?: boolean;
  allowClear?: boolean;
  autoSize?: boolean | { minRows?: number; maxRows?: number };
}

export interface InputNumberProps extends BaseInputProps<number> {
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  formatter?: (value: number | string | undefined) => string;
  parser?: (displayValue: string | undefined) => number;
}

export interface SelectProps extends BaseInputProps<any> {
  options?: SelectOption[];
  multiple?: boolean;
  mode?: 'multiple' | 'tags';
  searchable?: boolean;
  allowClear?: boolean;
  loading?: boolean;
  onSearch?: (query: string) => void;
  showSearch?: boolean;
  filterOption?: boolean | ((inputValue: string, option: SelectOption) => boolean);
}

export interface CheckboxProps extends BaseComponentProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  indeterminate?: boolean;
}

export interface RadioProps extends BaseComponentProps {
  value?: any;
  onChange?: (value: any) => void;
  options?: SelectOption[];
  buttonStyle?: 'outline' | 'solid';
}

export interface SwitchProps extends BaseComponentProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  checkedChildren?: ReactNode;
  unCheckedChildren?: ReactNode;
  loading?: boolean;
}

export interface DatePickerProps extends BaseInputProps<Dayjs | string> {
  format?: string;
  showTime?: boolean;
  picker?: 'date' | 'week' | 'month' | 'quarter' | 'year';
  disabledDate?: (currentDate: Dayjs) => boolean;
  showToday?: boolean;
}

export interface TimePickerProps extends BaseInputProps<Dayjs | string> {
  format?: string;
  use12Hours?: boolean;
  hourStep?: number;
  minuteStep?: number;
  secondStep?: number;
}

export interface RangePickerProps extends BaseComponentProps {
  value?: [Dayjs, Dayjs];
  onChange?: (dates: [Dayjs, Dayjs]) => void;
  format?: string;
  showTime?: boolean;
  disabledDate?: (currentDate: Dayjs) => boolean;
}

export interface SliderProps extends BaseInputProps<number | [number, number]> {
  min?: number;
  max?: number;
  step?: number;
  marks?: Record<number, string | ReactNode>;
  range?: boolean;
  vertical?: boolean;
  tooltipVisible?: boolean;
}

export interface UploadFile {
  uid: string;
  name: string;
  status?: 'uploading' | 'done' | 'error' | 'removed';
  url?: string;
  thumbUrl?: string;
  response?: any;
}

export interface UploadProps extends BaseInputProps<UploadFile[]> {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxCount?: number;
  listType?: 'text' | 'picture' | 'picture-card';
  onUpload?: (file: File) => Promise<any>;
  beforeUpload?: (file: File) => boolean | Promise<boolean>;
  onRemove?: (file: UploadFile) => boolean | Promise<boolean>;
}

export interface DraggerProps extends UploadProps {
  height?: number | string;
}

export interface RateProps extends BaseInputProps<number> {
  count?: number;
  allowHalf?: boolean;
  allowClear?: boolean;
  character?: ReactNode;
  tooltips?: string[];
}

export interface ColorPickerProps extends BaseInputProps<string> {
  showText?: boolean;
  format?: 'hex' | 'rgb' | 'hsl';
  presets?: Array<{ label: string; colors: string[] }>;
}

export interface TableProps extends BaseComponentProps {
  dataSource?: any[];
  columns?: ColumnDef[];
  loading?: boolean;
  pagination?: false | PaginationConfig;
  onChange?: (
    pagination: PaginationConfig,
    filters: Record<string, any>,
    sorter: any
  ) => void;
  rowKey?: string | ((record: any) => string);
  rowSelection?: {
    selectedRowKeys?: string[];
    onChange?: (selectedRowKeys: string[], selectedRows: any[]) => void;
    type?: 'checkbox' | 'radio';
  };
  scroll?: { x?: number | string; y?: number | string };
  expandable?: {
    expandedRowRender?: (record: any) => ReactNode;
    rowExpandable?: (record: any) => boolean;
  };
}

export interface ListProps extends BaseComponentProps {
  dataSource?: any[];
  renderItem?: (item: any, index: number) => ReactNode;
  loading?: boolean;
  pagination?: false | PaginationConfig;
  grid?: { gutter?: number; column?: number };
  header?: ReactNode;
  footer?: ReactNode;
}

export interface CardProps extends BaseComponentProps {
  title?: string | ReactNode;
  extra?: ReactNode;
  bordered?: boolean;
  hoverable?: boolean;
  loading?: boolean;
  cover?: ReactNode;
  actions?: ReactNode[];
  children?: ReactNode;
}

export interface ImageProps extends BaseComponentProps {
  src?: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  preview?: boolean | { visible?: boolean; onVisibleChange?: (visible: boolean) => void };
  fallback?: string;
  placeholder?: ReactNode;
}

export interface FormProps extends BaseComponentProps {
  onFinish?: (values: Record<string, any>) => void;
  onFinishFailed?: (errorInfo: any) => void;
  initialValues?: Record<string, any>;
  form?: FormInstance;
  layout?: 'horizontal' | 'vertical' | 'inline';
  labelCol?: { span?: number; offset?: number };
  wrapperCol?: { span?: number; offset?: number };
  children?: ReactNode;
}

export interface FormItemProps extends BaseComponentProps {
  label?: string | ReactNode;
  name?: string | string[];
  rules?: ValidationRule[];
  required?: boolean;
  help?: string;
  validateStatus?: 'success' | 'warning' | 'error' | 'validating';
  hasFeedback?: boolean;
  labelCol?: { span?: number; offset?: number };
  wrapperCol?: { span?: number; offset?: number };
  children?: ReactNode;
}

export interface ModalProps extends BaseComponentProps {
  visible?: boolean;
  open?: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  onOk?: () => void;
  title?: string | ReactNode;
  footer?: ReactNode | null;
  width?: number | string;
  centered?: boolean;
  maskClosable?: boolean;
  closable?: boolean;
  confirmLoading?: boolean;
  children?: ReactNode;
}

export interface DrawerProps extends BaseComponentProps {
  visible?: boolean;
  open?: boolean;
  onClose?: () => void;
  title?: string | ReactNode;
  placement?: 'left' | 'right' | 'top' | 'bottom';
  width?: number | string;
  height?: number | string;
  closable?: boolean;
  maskClosable?: boolean;
  children?: ReactNode;
}

export interface TabsProps extends BaseComponentProps {
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (key: string) => void;
  items?: Array<{ key: string; label: string; children: ReactNode; disabled?: boolean }>;
  type?: 'line' | 'card' | 'editable-card';
  tabPosition?: 'top' | 'right' | 'bottom' | 'left';
  children?: ReactNode;
}

export interface TabPaneProps {
  key: string;
  tab: string | ReactNode;
  disabled?: boolean;
  children?: ReactNode;
}

export interface DividerProps extends BaseComponentProps {
  type?: 'horizontal' | 'vertical';
  orientation?: 'left' | 'center' | 'right';
  orientationMargin?: string | number;
  dashed?: boolean;
  plain?: boolean;
  children?: ReactNode;
}

export interface SpaceProps extends BaseComponentProps {
  direction?: 'horizontal' | 'vertical';
  size?: 'small' | 'middle' | 'large' | number;
  align?: 'start' | 'end' | 'center' | 'baseline';
  wrap?: boolean;
  split?: ReactNode;
  children?: ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  type?: 'primary' | 'default' | 'dashed' | 'text' | 'link';
  htmlType?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  icon?: ReactNode;
  shape?: 'default' | 'circle' | 'round';
  size?: 'small' | 'middle' | 'large';
  block?: boolean;
  danger?: boolean;
  ghost?: boolean;
  children?: ReactNode;
}

export interface DropdownProps {
  menu?: { items?: any[] } | any;
  trigger?: ('click' | 'hover' | 'contextMenu')[];
  placement?: 'bottomLeft' | 'bottomCenter' | 'bottomRight' | 'topLeft' | 'topCenter' | 'topRight';
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  children?: ReactNode;
}

export interface TooltipProps {
  title?: string | ReactNode;
  placement?:
    | 'top'
    | 'left'
    | 'right'
    | 'bottom'
    | 'topLeft'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomRight'
    | 'leftTop'
    | 'leftBottom'
    | 'rightTop'
    | 'rightBottom';
  trigger?: 'hover' | 'focus' | 'click' | 'contextMenu';
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  children?: ReactNode;
}

export interface PaginationProps extends BaseComponentProps {
  current?: number;
  defaultCurrent?: number;
  total?: number;
  pageSize?: number;
  defaultPageSize?: number;
  onChange?: (page: number, pageSize: number) => void;
  onShowSizeChange?: (current: number, size: number) => void;
  showSizeChanger?: boolean;
  pageSizeOptions?: string[];
  showQuickJumper?: boolean;
  showTotal?: (total: number, range: [number, number]) => ReactNode;
  simple?: boolean;
}

export interface SpinProps extends BaseComponentProps {
  spinning?: boolean;
  size?: 'small' | 'default' | 'large';
  tip?: string;
  delay?: number;
  indicator?: ReactNode;
  children?: ReactNode;
}

export interface EmptyProps extends BaseComponentProps {
  description?: string | ReactNode;
  image?: ReactNode;
  imageStyle?: React.CSSProperties;
  children?: ReactNode;
}

export interface TagProps extends BaseComponentProps {
  color?: string;
  onClose?: (event: React.MouseEvent<HTMLElement>) => void;
  closable?: boolean;
  closeIcon?: ReactNode;
  icon?: ReactNode;
  bordered?: boolean;
  children?: ReactNode;
}

export interface BadgeProps {
  count?: number | ReactNode;
  showZero?: boolean;
  overflowCount?: number;
  dot?: boolean;
  status?: 'success' | 'processing' | 'default' | 'error' | 'warning';
  text?: ReactNode;
  color?: string;
  offset?: [number, number];
  children?: ReactNode;
}

export interface PopoverProps extends BaseComponentProps {
  content?: ReactNode;
  title?: ReactNode;
  trigger?: 'click' | 'hover' | 'focus' | 'contextMenu';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

export interface IconSet {
  Filter?: ComponentType<any>;
  SortAscending?: ComponentType<any>;
  SortDescending?: ComponentType<any>;
  Fullscreen?: ComponentType<any>;
  FullscreenExit?: ComponentType<any>;
}

// ==================== UIAdapter Class ====================

/**
 * UIAdapter - Base class for all UI framework adapters
 *
 * Provides a consistent interface for fennec-core to interact with different
 * UI frameworks (Ant Design, Material UI, Chakra UI, etc.)
 */
export class UIAdapter {
  // ==================== Input Components ====================
  Input: ComponentType<InputProps> | null;
  TextArea: ComponentType<TextAreaProps> | null;
  InputNumber: ComponentType<InputNumberProps> | null;

  // ==================== Selection Components ====================
  Select: ComponentType<SelectProps> | null;
  Checkbox: ComponentType<CheckboxProps> | null;
  Radio: ComponentType<RadioProps> | null;
  Switch: ComponentType<SwitchProps> | null;

  // ==================== Date/Time Components ====================
  DatePicker: ComponentType<DatePickerProps> | null;
  TimePicker: ComponentType<TimePickerProps> | null;
  RangePicker: ComponentType<RangePickerProps> | null;

  // ==================== Other Input Components ====================
  Slider: ComponentType<SliderProps> | null;
  Upload: ComponentType<UploadProps> | null;
  Dragger: ComponentType<DraggerProps> | null;
  Rate: ComponentType<RateProps> | null;
  ColorPicker: ComponentType<ColorPickerProps> | null;

  // ==================== Display Components ====================
  Table: ComponentType<TableProps> | null;
  List: ComponentType<ListProps> | null;
  Card: ComponentType<CardProps> | null;
  Image: ComponentType<ImageProps> | null;

  // ==================== Form Components ====================
  Form: ComponentType<FormProps> | null;
  FormItem: ComponentType<FormItemProps> | null;

  // ==================== Layout Components ====================
  Modal: ComponentType<ModalProps> | null;
  Drawer: ComponentType<DrawerProps> | null;
  Tabs: ComponentType<TabsProps> | null;
  TabPane: ComponentType<TabPaneProps> | null;
  Divider: ComponentType<DividerProps> | null;
  Space: ComponentType<SpaceProps> | null;

  // ==================== Action Components ====================
  Button: ComponentType<ButtonProps> | null;
  Dropdown: ComponentType<DropdownProps> | null;
  Tooltip: ComponentType<TooltipProps> | null;
  Popover: ComponentType<PopoverProps> | null;

  // ==================== Utility Components ====================
  Pagination: ComponentType<PaginationProps> | null;
  Spin: ComponentType<SpinProps> | null;
  Empty: ComponentType<EmptyProps> | null;
  Tag: ComponentType<TagProps> | null;
  Badge: ComponentType<BadgeProps> | null;

  // ==================== Optional icon set (used by Collection filter UI) ====================
  Icons?: IconSet;

  // ==================== Utility Methods ====================

  /**
   * Transform form data between fennec-core and UI framework format
   */
  transformFormData(data: Record<string, any>): Record<string, any>;

  /**
   * Transform table data between fennec-core and UI framework format
   */
  transformTableData(data: any[]): any[];

  /**
   * Create validator function from fennec-core validation rules
   */
  createValidator(rules: ValidationRule[]): () => Promise<void>;

  /**
   * Format date value for UI framework
   */
  formatDate(value: any, format?: string): any;

  /**
   * Parse date value from UI framework
   */
  parseDate(value: any, format?: string): any;

  /**
   * Create form instance for UI framework
   */
  createFormInstance(): FormInstance;

  /**
   * Normalize file list from UI framework Upload component
   */
  normalizeFiles(fileList: any): UploadFile[];
}
