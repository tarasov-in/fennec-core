/**
 * ChakraUIAdapter - Chakra UI adapter for fennec-core
 *
 * Provides all UI components based on Chakra UI.
 * Alternative to AntdAdapter and MaterialUIAdapter for projects using Chakra UI.
 *
 * @version 2.4.0 - Chakra UI Adapter
 */

import { UIAdapter } from '../UIAdapter'
import React from 'react'

/**
 * ChakraUIAdapter class - Chakra UI implementation of UIAdapter
 *
 * Component Mappings:
 * - Input → Input from @chakra-ui/react
 * - TextArea → Textarea from @chakra-ui/react
 * - InputNumber → NumberInput from @chakra-ui/react
 * - Select → Select from @chakra-ui/react
 * - Checkbox → Checkbox from @chakra-ui/react
 * - Radio → RadioGroup with Radio from @chakra-ui/react
 * - Switch → Switch from @chakra-ui/react
 * - DatePicker → Input type="date" (Chakra UI doesn't have built-in date picker)
 * - TimePicker → Input type="time"
 * - RangePicker → Two Inputs in HStack
 * - Slider → Slider from @chakra-ui/react
 * - Upload → Button with file input
 * - Rate → Custom rating component (Chakra UI doesn't have built-in)
 * - ColorPicker → Input type="color"
 * - Table → Table from @chakra-ui/react
 * - List → List with ListItem from @chakra-ui/react
 * - Card → Card from @chakra-ui/react
 * - Modal → Modal from @chakra-ui/react
 * - Drawer → Drawer from @chakra-ui/react
 * - Tabs → Tabs with TabList/TabPanels from @chakra-ui/react
 * - Button → Button from @chakra-ui/react
 * - Dropdown → Menu from @chakra-ui/react
 * - Tooltip → Tooltip from @chakra-ui/react
 * - Pagination → Custom pagination (Chakra UI doesn't have built-in)
 * - Spin → Spinner from @chakra-ui/react
 * - Empty → Box with text
 * - Tag → Tag from @chakra-ui/react
 * - Badge → Badge from @chakra-ui/react
 */
export class ChakraUIAdapter extends UIAdapter {
  constructor() {
    super()
    this.adapterName = 'ChakraUIAdapter'

    // Lazy load Chakra UI components
    this.loadChakraComponents()
  }

  async loadChakraComponents() {
    try {
      const chakra = await import('@chakra-ui/react')

      // ==================== Input Components ====================

      // Input - text input field
      this.Input = ({ value, onChange, placeholder, disabled, type = 'text', maxLength, ...props }) => {
        return (
          <chakra.Input
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            isDisabled={disabled}
            type={type}
            maxLength={maxLength}
            size="md"
            {...props}
          />
        )
      }

      // TextArea - multiline text input
      this.TextArea = ({ value, onChange, placeholder, disabled, rows = 4, maxLength, ...props }) => {
        return (
          <chakra.Textarea
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            isDisabled={disabled}
            rows={rows}
            maxLength={maxLength}
            size="md"
            {...props}
          />
        )
      }

      // InputNumber - number input
      this.InputNumber = ({ value, onChange, placeholder, disabled, min, max, step = 1, ...props }) => {
        return (
          <chakra.NumberInput
            value={value ?? ''}
            onChange={(valueString, valueNumber) => onChange?.(valueNumber)}
            min={min}
            max={max}
            step={step}
            isDisabled={disabled}
            size="md"
            {...props}
          >
            <chakra.NumberInputField placeholder={placeholder} />
            <chakra.NumberInputStepper>
              <chakra.NumberIncrementStepper />
              <chakra.NumberDecrementStepper />
            </chakra.NumberInputStepper>
          </chakra.NumberInput>
        )
      }

      // Select - dropdown select
      this.Select = ({ value, onChange, options = [], disabled, placeholder, multiple, ...props }) => {
        if (multiple) {
          // For multiple select, use Chakra's Select with multiple attribute
          return (
            <chakra.Select
              value={value || []}
              onChange={(e) => {
                const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value)
                onChange?.(selectedOptions)
              }}
              isDisabled={disabled}
              placeholder={placeholder}
              multiple
              size="md"
              {...props}
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </chakra.Select>
          )
        }

        return (
          <chakra.Select
            value={value ?? ''}
            onChange={(e) => onChange?.(e.target.value)}
            isDisabled={disabled}
            placeholder={placeholder}
            size="md"
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </chakra.Select>
        )
      }

      // Checkbox - checkbox input
      this.Checkbox = ({ value, onChange, disabled, children, ...props }) => {
        return (
          <chakra.Checkbox
            isChecked={!!value}
            onChange={(e) => onChange?.(e.target.checked)}
            isDisabled={disabled}
            size="md"
            {...props}
          >
            {children}
          </chakra.Checkbox>
        )
      }

      // Radio - radio group
      this.Radio = ({ value, onChange, options = [], disabled, ...props }) => {
        return (
          <chakra.RadioGroup value={value ?? ''} onChange={onChange} isDisabled={disabled} {...props}>
            <chakra.Stack direction="column" spacing={2}>
              {options.map((option) => (
                <chakra.Radio key={option.value} value={option.value}>
                  {option.label}
                </chakra.Radio>
              ))}
            </chakra.Stack>
          </chakra.RadioGroup>
        )
      }

      // Switch - toggle switch
      this.Switch = ({ value, onChange, disabled, children, ...props }) => {
        return (
          <chakra.FormControl display="flex" alignItems="center">
            <chakra.Switch
              isChecked={!!value}
              onChange={(e) => onChange?.(e.target.checked)}
              isDisabled={disabled}
              size="md"
              {...props}
            />
            {children && (
              <chakra.FormLabel ml={2} mb={0}>
                {children}
              </chakra.FormLabel>
            )}
          </chakra.FormControl>
        )
      }

      // ==================== Date/Time Components ====================

      // DatePicker - date input (Chakra UI doesn't have native date picker)
      this.DatePicker = ({ value, onChange, disabled, format = 'YYYY-MM-DD', ...props }) => {
        const dateValue = value ? new Date(value).toISOString().split('T')[0] : ''

        return (
          <chakra.Input
            type="date"
            value={dateValue}
            onChange={(e) => onChange?.(e.target.value)}
            isDisabled={disabled}
            size="md"
            {...props}
          />
        )
      }

      // TimePicker - time input
      this.TimePicker = ({ value, onChange, disabled, ...props }) => {
        return (
          <chakra.Input
            type="time"
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
            isDisabled={disabled}
            size="md"
            {...props}
          />
        )
      }

      // RangePicker - date range picker (two date inputs)
      this.RangePicker = ({ value = [], onChange, disabled, ...props }) => {
        const [start, end] = value

        return (
          <chakra.HStack spacing={2} {...props}>
            <chakra.Input
              type="date"
              value={start ? new Date(start).toISOString().split('T')[0] : ''}
              onChange={(e) => onChange?.([e.target.value, end])}
              isDisabled={disabled}
              placeholder="Start date"
              size="md"
            />
            <chakra.Text>to</chakra.Text>
            <chakra.Input
              type="date"
              value={end ? new Date(end).toISOString().split('T')[0] : ''}
              onChange={(e) => onChange?.([start, e.target.value])}
              isDisabled={disabled}
              placeholder="End date"
              size="md"
            />
          </chakra.HStack>
        )
      }

      // ==================== Other Input Components ====================

      // Slider - range slider
      this.Slider = ({ value, onChange, min = 0, max = 100, step = 1, disabled, ...props }) => {
        return (
          <chakra.Slider
            value={value ?? min}
            onChange={onChange}
            min={min}
            max={max}
            step={step}
            isDisabled={disabled}
            {...props}
          >
            <chakra.SliderTrack>
              <chakra.SliderFilledTrack />
            </chakra.SliderTrack>
            <chakra.SliderThumb />
          </chakra.Slider>
        )
      }

      // Upload - file upload button
      this.Upload = ({ onChange, disabled, accept, multiple, children, ...props }) => {
        const inputRef = React.useRef(null)

        return (
          <chakra.Box {...props}>
            <chakra.Input
              ref={inputRef}
              type="file"
              onChange={(e) => onChange?.(e.target.files)}
              disabled={disabled}
              accept={accept}
              multiple={multiple}
              display="none"
            />
            <chakra.Button
              onClick={() => inputRef.current?.click()}
              isDisabled={disabled}
              leftIcon={<chakra.Icon as={() => '📁'} />}
              colorScheme="blue"
              size="md"
            >
              {children || 'Upload'}
            </chakra.Button>
          </chakra.Box>
        )
      }

      // Dragger - drag and drop upload (same as Upload for Chakra UI)
      this.Dragger = this.Upload

      // Rate - rating component (custom implementation)
      this.Rate = ({ value = 0, onChange, count = 5, disabled, ...props }) => {
        return (
          <chakra.HStack spacing={1} {...props}>
            {Array.from({ length: count }, (_, index) => (
              <chakra.Icon
                key={index}
                as={() => (index < value ? '⭐' : '☆')}
                fontSize="24px"
                color={index < value ? 'yellow.400' : 'gray.300'}
                cursor={disabled ? 'default' : 'pointer'}
                onClick={() => !disabled && onChange?.(index + 1)}
              />
            ))}
          </chakra.HStack>
        )
      }

      // ColorPicker - color input
      this.ColorPicker = ({ value, onChange, disabled, ...props }) => {
        return (
          <chakra.Input
            type="color"
            value={value || '#000000'}
            onChange={(e) => onChange?.(e.target.value)}
            isDisabled={disabled}
            size="md"
            width="100px"
            {...props}
          />
        )
      }

      // ==================== Display Components ====================

      // Table - data table
      this.Table = ({ columns = [], dataSource = [], loading, pagination, onChange, ...props }) => {
        return (
          <chakra.Box overflowX="auto" {...props}>
            <chakra.Table variant="simple">
              <chakra.Thead>
                <chakra.Tr>
                  {columns.map((col, index) => (
                    <chakra.Th key={col.key || index}>{col.title}</chakra.Th>
                  ))}
                </chakra.Tr>
              </chakra.Thead>
              <chakra.Tbody>
                {loading ? (
                  <chakra.Tr>
                    <chakra.Td colSpan={columns.length} textAlign="center">
                      <chakra.Spinner />
                    </chakra.Td>
                  </chakra.Tr>
                ) : dataSource.length === 0 ? (
                  <chakra.Tr>
                    <chakra.Td colSpan={columns.length} textAlign="center" color="gray.500">
                      No data
                    </chakra.Td>
                  </chakra.Tr>
                ) : (
                  dataSource.map((record, rowIndex) => (
                    <chakra.Tr key={record.id || rowIndex}>
                      {columns.map((col, colIndex) => (
                        <chakra.Td key={col.key || colIndex}>
                          {col.render ? col.render(record[col.dataIndex], record, rowIndex) : record[col.dataIndex]}
                        </chakra.Td>
                      ))}
                    </chakra.Tr>
                  ))
                )}
              </chakra.Tbody>
            </chakra.Table>
          </chakra.Box>
        )
      }

      // List - item list
      this.List = ({ dataSource = [], renderItem, ...props }) => {
        return (
          <chakra.List spacing={2} {...props}>
            {dataSource.map((item, index) => (
              <chakra.ListItem key={item.id || index}>{renderItem ? renderItem(item, index) : String(item)}</chakra.ListItem>
            ))}
          </chakra.List>
        )
      }

      // Card - card container
      this.Card = ({ title, children, extra, ...props }) => {
        return (
          <chakra.Card {...props}>
            {title && (
              <chakra.CardHeader display="flex" justifyContent="space-between" alignItems="center">
                <chakra.Heading size="md">{title}</chakra.Heading>
                {extra}
              </chakra.CardHeader>
            )}
            <chakra.CardBody>{children}</chakra.CardBody>
          </chakra.Card>
        )
      }

      // Image - image display
      this.Image = ({ src, alt, ...props }) => {
        return <chakra.Image src={src} alt={alt} {...props} />
      }

      // ==================== Layout Components ====================

      // Modal - modal dialog
      this.Modal = ({ visible, onClose, title, children, footer, width, ...props }) => {
        return (
          <chakra.Modal isOpen={visible} onClose={onClose} size={width ? 'full' : 'md'} {...props}>
            <chakra.ModalOverlay />
            <chakra.ModalContent maxWidth={width}>
              {title && (
                <chakra.ModalHeader>{title}</chakra.ModalHeader>
              )}
              <chakra.ModalCloseButton />
              <chakra.ModalBody>{children}</chakra.ModalBody>
              {footer && <chakra.ModalFooter>{footer}</chakra.ModalFooter>}
            </chakra.ModalContent>
          </chakra.Modal>
        )
      }

      // Drawer - side drawer
      this.Drawer = ({ visible, onClose, title, children, placement = 'right', width, ...props }) => {
        return (
          <chakra.Drawer isOpen={visible} onClose={onClose} placement={placement} size={width ? 'full' : 'md'} {...props}>
            <chakra.DrawerOverlay />
            <chakra.DrawerContent maxWidth={width}>
              <chakra.DrawerCloseButton />
              {title && <chakra.DrawerHeader>{title}</chakra.DrawerHeader>}
              <chakra.DrawerBody>{children}</chakra.DrawerBody>
            </chakra.DrawerContent>
          </chakra.Drawer>
        )
      }

      // Tabs - tabbed interface
      this.Tabs = ({ items = [], activeKey, onChange, ...props }) => {
        const index = items.findIndex((item) => item.key === activeKey)

        return (
          <chakra.Tabs index={index} onChange={(idx) => onChange?.(items[idx]?.key)} {...props}>
            <chakra.TabList>
              {items.map((item) => (
                <chakra.Tab key={item.key}>{item.label}</chakra.Tab>
              ))}
            </chakra.TabList>
            <chakra.TabPanels>
              {items.map((item) => (
                <chakra.TabPanel key={item.key}>{item.children}</chakra.TabPanel>
              ))}
            </chakra.TabPanels>
          </chakra.Tabs>
        )
      }

      // Divider - horizontal/vertical divider
      this.Divider = ({ orientation = 'horizontal', ...props }) => {
        return <chakra.Divider orientation={orientation} {...props} />
      }

      // Space - spacing container (using Stack)
      this.Space = ({ direction = 'horizontal', size = 'md', children, ...props }) => {
        const spacing = size === 'small' ? 2 : size === 'large' ? 4 : 3

        return (
          <chakra.Stack direction={direction === 'horizontal' ? 'row' : 'column'} spacing={spacing} {...props}>
            {children}
          </chakra.Stack>
        )
      }

      // ==================== Action Components ====================

      // Button - action button
      this.Button = ({ type = 'default', children, onClick, disabled, loading, icon, ...props }) => {
        const colorScheme = type === 'primary' ? 'blue' : type === 'danger' ? 'red' : 'gray'
        const variant = type === 'default' ? 'outline' : 'solid'

        return (
          <chakra.Button
            colorScheme={colorScheme}
            variant={variant}
            onClick={onClick}
            isDisabled={disabled}
            isLoading={loading}
            leftIcon={icon}
            size="md"
            {...props}
          >
            {children}
          </chakra.Button>
        )
      }

      // Dropdown - dropdown menu
      this.Dropdown = ({ items = [], children, ...props }) => {
        return (
          <chakra.Menu {...props}>
            <chakra.MenuButton as={chakra.Button} rightIcon={<chakra.Icon as={() => '▼'} />}>
              {children}
            </chakra.MenuButton>
            <chakra.MenuList>
              {items.map((item) => (
                <chakra.MenuItem key={item.key} onClick={item.onClick} color={item.danger ? 'red.500' : undefined}>
                  {item.label}
                </chakra.MenuItem>
              ))}
            </chakra.MenuList>
          </chakra.Menu>
        )
      }

      // Tooltip - tooltip overlay
      this.Tooltip = ({ title, children, ...props }) => {
        return (
          <chakra.Tooltip label={title} {...props}>
            {children}
          </chakra.Tooltip>
        )
      }

      // ==================== Utility Components ====================

      // Pagination - pagination control (custom implementation)
      this.Pagination = ({ current = 1, total = 0, pageSize = 10, onChange, ...props }) => {
        const totalPages = Math.ceil(total / pageSize)

        return (
          <chakra.HStack spacing={2} justifyContent="center" {...props}>
            <chakra.Button
              size="sm"
              onClick={() => onChange?.(current - 1, pageSize)}
              isDisabled={current === 1}
            >
              Previous
            </chakra.Button>
            <chakra.Text>
              Page {current} of {totalPages}
            </chakra.Text>
            <chakra.Button
              size="sm"
              onClick={() => onChange?.(current + 1, pageSize)}
              isDisabled={current === totalPages}
            >
              Next
            </chakra.Button>
          </chakra.HStack>
        )
      }

      // Spin - loading spinner
      this.Spin = ({ spinning = true, children, ...props }) => {
        if (!spinning) return children

        return (
          <chakra.Box position="relative" {...props}>
            <chakra.Center position="absolute" top={0} left={0} right={0} bottom={0} bg="whiteAlpha.800" zIndex={1}>
              <chakra.Spinner size="lg" color="blue.500" />
            </chakra.Center>
            <chakra.Box opacity={spinning ? 0.5 : 1}>{children}</chakra.Box>
          </chakra.Box>
        )
      }

      // Empty - empty state
      this.Empty = ({ description = 'No data', ...props }) => {
        return (
          <chakra.Box textAlign="center" py={8} color="gray.500" {...props}>
            <chakra.Text fontSize="3xl" mb={2}>
              📭
            </chakra.Text>
            <chakra.Text>{description}</chakra.Text>
          </chakra.Box>
        )
      }

      // Tag - tag label
      this.Tag = ({ children, closable, onClose, color, ...props }) => {
        return (
          <chakra.Tag colorScheme={color} size="md" {...props}>
            <chakra.TagLabel>{children}</chakra.TagLabel>
            {closable && <chakra.TagCloseButton onClick={onClose} />}
          </chakra.Tag>
        )
      }

      // Badge - badge indicator
      this.Badge = ({ count, children, dot, ...props }) => {
        return (
          <chakra.Box position="relative" display="inline-block" {...props}>
            {children}
            {(count > 0 || dot) && (
              <chakra.Badge
                position="absolute"
                top="-2"
                right="-2"
                colorScheme="red"
                borderRadius="full"
                px={dot ? 0 : 2}
                minW={dot ? '8px' : '20px'}
                h={dot ? '8px' : '20px'}
                fontSize={dot ? '0' : 'xs'}
              >
                {!dot && count}
              </chakra.Badge>
            )}
          </chakra.Box>
        )
      }
    } catch (error) {
      console.error('Failed to load Chakra UI components:', error)
      console.warn('Please install @chakra-ui/react: npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion')
    }
  }

  getType() {
    return 'chakra-ui'
  }

  isMobile() {
    return false
  }
}

export default ChakraUIAdapter
