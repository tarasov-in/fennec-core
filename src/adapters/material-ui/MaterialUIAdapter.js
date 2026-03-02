/**
 * MaterialUIAdapter - Material UI adapter for fennec-core
 *
 * Provides all UI components based on Material UI (MUI).
 * Alternative to AntdAdapter for projects using Material UI.
 *
 * @class MaterialUIAdapter
 * @extends UIAdapter
 * @version 2.4.0
 */

import { UIAdapter } from '../UIAdapter'
import {
  TextField,
  Select,
  MenuItem,
  Checkbox,
  Radio,
  RadioGroup,
  FormControlLabel,
  Switch,
  Slider,
  Rating,
  Button,
  IconButton,
  Modal,
  Drawer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Divider,
  Box,
  Stack,
  Chip,
  Badge,
  CircularProgress,
  Tooltip,
  Menu,
  FormControl,
  InputLabel,
  FormHelperText
} from '@mui/material'
import { DatePicker, TimePicker, DateTimePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import React from 'react'

export class MaterialUIAdapter extends UIAdapter {
  constructor() {
    super()
    this.adapterName = 'material-ui'
  }

  // ==================== Helper Methods ====================

  /**
   * Get adapter type
   * @returns {string}
   */
  getType() {
    return 'material-ui'
  }

  /**
   * Check if this is mobile adapter
   * @returns {boolean}
   */
  isMobile() {
    return false
  }

  // ==================== Input Components ====================

  /**
   * Input - Material UI TextField
   */
  Input = ({ value, onChange, placeholder, disabled, type = 'text', ...props }) => {
    return (
      <TextField
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        type={type}
        fullWidth
        variant="outlined"
        size="small"
        {...props}
      />
    )
  }

  /**
   * TextArea - Material UI TextField with multiline
   */
  TextArea = ({ value, onChange, placeholder, disabled, rows = 4, ...props }) => {
    return (
      <TextField
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        multiline
        rows={rows}
        fullWidth
        variant="outlined"
        {...props}
      />
    )
  }

  /**
   * InputNumber - Material UI TextField with type="number"
   */
  InputNumber = ({ value, onChange, min, max, step, disabled, ...props }) => {
    return (
      <TextField
        type="number"
        value={value ?? ''}
        onChange={(e) => {
          const val = e.target.value === '' ? undefined : Number(e.target.value)
          onChange?.(val)
        }}
        disabled={disabled}
        fullWidth
        variant="outlined"
        size="small"
        inputProps={{ min, max, step }}
        {...props}
      />
    )
  }

  // ==================== Selection Components ====================

  /**
   * Select - Material UI Select
   */
  Select = ({ value, onChange, options = [], disabled, multiple, searchable, ...props }) => {
    return (
      <FormControl fullWidth size="small" disabled={disabled}>
        {props.label && <InputLabel>{props.label}</InputLabel>}
        <Select
          value={value ?? (multiple ? [] : '')}
          onChange={(e) => onChange?.(e.target.value)}
          multiple={multiple}
          label={props.label}
          {...props}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    )
  }

  /**
   * Checkbox - Material UI Checkbox
   */
  Checkbox = ({ checked, onChange, label, disabled, ...props }) => {
    const checkbox = (
      <Checkbox
        checked={!!checked}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
        {...props}
      />
    )

    if (label) {
      return <FormControlLabel control={checkbox} label={label} disabled={disabled} />
    }

    return checkbox
  }

  /**
   * Radio - Material UI RadioGroup
   */
  Radio = ({ value, onChange, options = [], disabled, ...props }) => {
    return (
      <RadioGroup
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
        {...props}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
            disabled={disabled}
          />
        ))}
      </RadioGroup>
    )
  }

  /**
   * Switch - Material UI Switch
   */
  Switch = ({ checked, onChange, label, disabled, ...props }) => {
    const switchComponent = (
      <Switch
        checked={!!checked}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
        {...props}
      />
    )

    if (label) {
      return <FormControlLabel control={switchComponent} label={label} disabled={disabled} />
    }

    return switchComponent
  }

  // ==================== Date/Time Components ====================

  /**
   * DatePicker - Material UI DatePicker
   */
  DatePicker = ({ value, onChange, format = 'YYYY-MM-DD', disabled, ...props }) => {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          value={value ? dayjs(value) : null}
          onChange={(newValue) => onChange?.(newValue)}
          format={format}
          disabled={disabled}
          slotProps={{
            textField: { fullWidth: true, size: 'small' }
          }}
          {...props}
        />
      </LocalizationProvider>
    )
  }

  /**
   * TimePicker - Material UI TimePicker
   */
  TimePicker = ({ value, onChange, format = 'HH:mm:ss', disabled, ...props }) => {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          value={value ? dayjs(value) : null}
          onChange={(newValue) => onChange?.(newValue)}
          format={format}
          disabled={disabled}
          slotProps={{
            textField: { fullWidth: true, size: 'small' }
          }}
          {...props}
        />
      </LocalizationProvider>
    )
  }

  /**
   * RangePicker - Not directly supported in MUI, use two DatePickers
   */
  RangePicker = ({ value, onChange, format = 'YYYY-MM-DD', disabled, ...props }) => {
    const [start, end] = value || [null, null]

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack direction="row" spacing={2}>
          <DatePicker
            label="Start Date"
            value={start ? dayjs(start) : null}
            onChange={(newValue) => onChange?.([newValue, end])}
            format={format}
            disabled={disabled}
            slotProps={{
              textField: { fullWidth: true, size: 'small' }
            }}
            {...props}
          />
          <DatePicker
            label="End Date"
            value={end ? dayjs(end) : null}
            onChange={(newValue) => onChange?.([start, newValue])}
            format={format}
            disabled={disabled}
            slotProps={{
              textField: { fullWidth: true, size: 'small' }
            }}
            {...props}
          />
        </Stack>
      </LocalizationProvider>
    )
  }

  // ==================== Other Input Components ====================

  /**
   * Slider - Material UI Slider
   */
  Slider = ({ value, onChange, min = 0, max = 100, step = 1, disabled, ...props }) => {
    return (
      <Slider
        value={value ?? min}
        onChange={(e, newValue) => onChange?.(newValue)}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        valueLabelDisplay="auto"
        {...props}
      />
    )
  }

  /**
   * Upload - Basic file upload (MUI doesn't have built-in Upload)
   */
  Upload = ({ value, onChange, accept, multiple, disabled, ...props }) => {
    return (
      <Button
        variant="outlined"
        component="label"
        disabled={disabled}
        fullWidth
        {...props}
      >
        Upload File
        <input
          type="file"
          hidden
          accept={accept}
          multiple={multiple}
          onChange={(e) => {
            const files = Array.from(e.target.files || [])
            onChange?.(files)
          }}
        />
      </Button>
    )
  }

  /**
   * Dragger - Same as Upload for MUI
   */
  Dragger = this.Upload

  /**
   * Rate - Material UI Rating
   */
  Rate = ({ value, onChange, count = 5, disabled, allowHalf, ...props }) => {
    return (
      <Rating
        value={value ?? 0}
        onChange={(e, newValue) => onChange?.(newValue)}
        max={count}
        disabled={disabled}
        precision={allowHalf ? 0.5 : 1}
        {...props}
      />
    )
  }

  /**
   * ColorPicker - Basic color input (MUI doesn't have built-in ColorPicker)
   */
  ColorPicker = ({ value, onChange, disabled, ...props }) => {
    return (
      <TextField
        type="color"
        value={value || '#000000'}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        fullWidth
        size="small"
        {...props}
      />
    )
  }

  // ==================== Display Components ====================

  /**
   * Table - Material UI Table
   */
  Table = ({
    dataSource = [],
    columns = [],
    loading,
    pagination,
    onChange,
    rowKey = 'id',
    ...props
  }) => {
    return (
      <TableContainer>
        <Table size="small" {...props}>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.key || col.dataIndex}>{col.title}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dataSource.map((row, index) => (
              <TableRow key={typeof rowKey === 'function' ? rowKey(row) : row[rowKey] || index}>
                {columns.map((col) => (
                  <TableCell key={col.key || col.dataIndex}>
                    {col.render
                      ? col.render(row[col.dataIndex], row, index)
                      : row[col.dataIndex]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {pagination && (
          <TablePagination
            component="div"
            count={pagination.total || 0}
            page={(pagination.current || 1) - 1}
            rowsPerPage={pagination.pageSize || 10}
            onPageChange={(e, page) => {
              onChange?.({ ...pagination, current: page + 1 }, {}, {})
            }}
            onRowsPerPageChange={(e) => {
              onChange?.({ ...pagination, pageSize: parseInt(e.target.value, 10) }, {}, {})
            }}
          />
        )}
      </TableContainer>
    )
  }

  /**
   * List - Material UI List
   */
  List = ({ dataSource = [], renderItem, loading, ...props }) => {
    return (
      <List {...props}>
        {dataSource.map((item, index) => (
          <ListItem key={index}>
            {renderItem ? renderItem(item, index) : <ListItemText primary={JSON.stringify(item)} />}
          </ListItem>
        ))}
      </List>
    )
  }

  /**
   * Card - Material UI Card
   */
  Card = ({ title, extra, children, ...props }) => {
    return (
      <Card {...props}>
        {title && <CardHeader title={title} action={extra} />}
        <CardContent>{children}</CardContent>
      </Card>
    )
  }

  /**
   * Image - Basic img tag
   */
  Image = ({ src, alt, width, height, ...props }) => {
    return <img src={src} alt={alt} width={width} height={height} {...props} />
  }

  // ==================== Form Components ====================

  /**
   * Form - Material UI Box as form container
   */
  Form = ({ onFinish, children, ...props }) => {
    return (
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault()
          onFinish?.(new FormData(e.target))
        }}
        {...props}
      >
        {children}
      </Box>
    )
  }

  /**
   * FormItem - Material UI FormControl
   */
  FormItem = ({ label, name, required, help, children, ...props }) => {
    return (
      <FormControl fullWidth margin="normal" required={required} {...props}>
        {label && <InputLabel shrink>{label}</InputLabel>}
        {children}
        {help && <FormHelperText>{help}</FormHelperText>}
      </FormControl>
    )
  }

  // ==================== Layout Components ====================

  /**
   * Modal - Material UI Dialog
   */
  Modal = ({ visible, open, onClose, title, children, footer, width, ...props }) => {
    return (
      <Dialog
        open={visible ?? open ?? false}
        onClose={onClose}
        maxWidth={width ? false : 'sm'}
        fullWidth={!width}
        PaperProps={{ sx: width ? { width } : {} }}
        {...props}
      >
        {title && <DialogTitle>{title}</DialogTitle>}
        <DialogContent>{children}</DialogContent>
        {footer && <DialogActions>{footer}</DialogActions>}
      </Dialog>
    )
  }

  /**
   * Drawer - Material UI Drawer
   */
  Drawer = ({ visible, open, onClose, title, placement = 'right', children, width, ...props }) => {
    return (
      <Drawer
        open={visible ?? open ?? false}
        onClose={onClose}
        anchor={placement}
        PaperProps={{ sx: { width: width || 400 } }}
        {...props}
      >
        {title && <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>{title}</Box>}
        <Box sx={{ p: 2 }}>{children}</Box>
      </Drawer>
    )
  }

  /**
   * Tabs - Material UI Tabs
   */
  Tabs = ({ activeKey, onChange, items = [], children, ...props }) => {
    const [value, setValue] = React.useState(activeKey || 0)

    const handleChange = (event, newValue) => {
      setValue(newValue)
      onChange?.(newValue)
    }

    return (
      <Box>
        <Tabs value={value} onChange={handleChange} {...props}>
          {items.map((item, index) => (
            <Tab key={item.key || index} label={item.label} />
          ))}
        </Tabs>
        {items[value]?.children}
      </Box>
    )
  }

  /**
   * TabPane - Not needed in MUI (handled by Tabs items)
   */
  TabPane = null

  /**
   * Divider - Material UI Divider
   */
  Divider = ({ type = 'horizontal', children, ...props }) => {
    return (
      <Divider orientation={type === 'vertical' ? 'vertical' : 'horizontal'} {...props}>
        {children}
      </Divider>
    )
  }

  /**
   * Space - Material UI Stack
   */
  Space = ({ direction = 'horizontal', size = 2, children, ...props }) => {
    return (
      <Stack
        direction={direction === 'vertical' ? 'column' : 'row'}
        spacing={size}
        {...props}
      >
        {children}
      </Stack>
    )
  }

  // ==================== Action Components ====================

  /**
   * Button - Material UI Button
   */
  Button = ({ onClick, type = 'default', children, disabled, loading, ...props }) => {
    const variantMap = {
      primary: 'contained',
      default: 'outlined',
      text: 'text',
      link: 'text'
    }

    return (
      <Button
        onClick={onClick}
        variant={variantMap[type] || 'outlined'}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <CircularProgress size={20} sx={{ mr: 1 }} />}
        {children}
      </Button>
    )
  }

  /**
   * Dropdown - Material UI Menu
   */
  Dropdown = ({ menu, children, trigger = ['click'], ...props }) => {
    const [anchorEl, setAnchorEl] = React.useState(null)

    return (
      <React.Fragment>
        <span onClick={(e) => setAnchorEl(e.currentTarget)}>{children}</span>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          {...props}
        >
          {menu?.items?.map((item, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                item.onClick?.()
                setAnchorEl(null)
              }}
            >
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </React.Fragment>
    )
  }

  /**
   * Tooltip - Material UI Tooltip
   */
  Tooltip = ({ title, children, ...props }) => {
    return (
      <Tooltip title={title} {...props}>
        <span>{children}</span>
      </Tooltip>
    )
  }

  // ==================== Utility Components ====================

  /**
   * Pagination - Material UI TablePagination
   */
  Pagination = ({ current, total, pageSize, onChange, ...props }) => {
    return (
      <TablePagination
        component="div"
        count={total || 0}
        page={(current || 1) - 1}
        rowsPerPage={pageSize || 10}
        onPageChange={(e, page) => onChange?.(page + 1, pageSize)}
        onRowsPerPageChange={(e) => onChange?.(1, parseInt(e.target.value, 10))}
        {...props}
      />
    )
  }

  /**
   * Spin - Material UI CircularProgress
   */
  Spin = ({ spinning = true, children, size = 40, ...props }) => {
    if (!spinning && children) return children

    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress size={size} {...props} />
        {children}
      </Box>
    )
  }

  /**
   * Empty - Basic empty state
   */
  Empty = ({ description = 'No Data', ...props }) => {
    return (
      <Box sx={{ textAlign: 'center', p: 4, color: 'text.secondary' }} {...props}>
        {description}
      </Box>
    )
  }

  /**
   * Tag - Material UI Chip
   */
  Tag = ({ color, onClose, closable, children, ...props }) => {
    return (
      <Chip
        label={children}
        color={color}
        onDelete={closable ? onClose : undefined}
        size="small"
        {...props}
      />
    )
  }

  /**
   * Badge - Material UI Badge
   */
  Badge = ({ count, dot, children, ...props }) => {
    return (
      <Badge badgeContent={dot ? '●' : count} color="error" {...props}>
        {children}
      </Badge>
    )
  }
}
