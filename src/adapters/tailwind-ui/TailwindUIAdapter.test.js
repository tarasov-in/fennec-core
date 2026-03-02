/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import TailwindUIAdapter from './TailwindUIAdapter'

// Mock Heroicons
jest.mock('@heroicons/react/24/outline', () => ({
  ChevronLeftIcon: () => <svg data-testid="chevron-left-icon" />,
  ChevronRightIcon: () => <svg data-testid="chevron-right-icon" />,
  ChevronUpDownIcon: () => <svg data-testid="chevron-up-down-icon" />,
  CheckIcon: () => <svg data-testid="check-icon" />,
  XMarkIcon: () => <svg data-testid="x-mark-icon" />,
  EyeIcon: () => <svg data-testid="eye-icon" />,
  EyeSlashIcon: () => <svg data-testid="eye-slash-icon" />,
}))

jest.mock('@heroicons/react/24/solid', () => ({
  StarIcon: () => <svg data-testid="star-icon" />,
}))

describe('TailwindUIAdapter', () => {
  let adapter

  beforeEach(() => {
    adapter = new TailwindUIAdapter()
  })

  describe('Adapter Initialization', () => {
    test('should initialize with correct name and version', () => {
      expect(adapter.name).toBe('TailwindUI')
      expect(adapter.version).toBeDefined()
    })

    test('should have all required component methods', () => {
      const requiredComponents = [
        'Input', 'InputNumber', 'Password', 'Textarea', 'Select',
        'Checkbox', 'Switch', 'RadioGroup', 'DatePicker', 'TimePicker',
        'DateTimePicker', 'Slider', 'Rate', 'Button', 'Tag', 'Badge',
        'Tooltip', 'Progress', 'Alert', 'Spin', 'Avatar', 'Empty',
        'Card', 'Collapse', 'Tabs', 'Modal', 'Drawer', 'Divider',
        'Dropdown', 'Pagination', 'Upload', 'Table'
      ]

      requiredComponents.forEach(component => {
        expect(adapter[component]).toBeDefined()
        expect(typeof adapter[component]).toBe('function')
      })
    })
  })

  describe('Input Components', () => {
    describe('Input', () => {
      test('should render input with label', () => {
        const { Input } = adapter
        render(<Input label="Username" value="" onChange={() => {}} />)

        expect(screen.getByLabelText('Username')).toBeInTheDocument()
      })

      test('should call onChange when value changes', async () => {
        const handleChange = jest.fn()
        const { Input } = adapter
        render(<Input value="" onChange={handleChange} />)

        const input = screen.getByRole('textbox')
        await userEvent.type(input, 'test')

        expect(handleChange).toHaveBeenCalled()
      })

      test('should display error message', () => {
        const { Input } = adapter
        render(<Input value="" onChange={() => {}} error="Required field" />)

        expect(screen.getByText('Required field')).toBeInTheDocument()
      })

      test('should be disabled when disabled prop is true', () => {
        const { Input } = adapter
        render(<Input value="" onChange={() => {}} disabled />)

        expect(screen.getByRole('textbox')).toBeDisabled()
      })

      test('should show placeholder', () => {
        const { Input } = adapter
        render(<Input value="" onChange={() => {}} placeholder="Enter text" />)

        expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
      })

      test('should mark as required', () => {
        const { Input } = adapter
        render(<Input value="" onChange={() => {}} required />)

        expect(screen.getByRole('textbox')).toBeRequired()
      })
    })

    describe('InputNumber', () => {
      test('should render number input', () => {
        const { InputNumber } = adapter
        render(<InputNumber value={0} onChange={() => {}} />)

        const input = screen.getByRole('spinbutton')
        expect(input).toBeInTheDocument()
        expect(input).toHaveAttribute('type', 'number')
      })

      test('should respect min and max values', () => {
        const { InputNumber } = adapter
        render(<InputNumber value={5} onChange={() => {}} min={0} max={10} />)

        const input = screen.getByRole('spinbutton')
        expect(input).toHaveAttribute('min', '0')
        expect(input).toHaveAttribute('max', '10')
      })

      test('should respect step value', () => {
        const { InputNumber } = adapter
        render(<InputNumber value={0} onChange={() => {}} step={0.5} />)

        expect(screen.getByRole('spinbutton')).toHaveAttribute('step', '0.5')
      })

      test('should call onChange with number value', async () => {
        const handleChange = jest.fn()
        const { InputNumber } = adapter
        render(<InputNumber value={0} onChange={handleChange} />)

        const input = screen.getByRole('spinbutton')
        await userEvent.clear(input)
        await userEvent.type(input, '42')

        expect(handleChange).toHaveBeenCalledWith(42)
      })
    })

    describe('Password', () => {
      test('should render password input', () => {
        const { Password } = adapter
        render(<Password value="" onChange={() => {}} />)

        const input = screen.getByLabelText(/password/i)
        expect(input).toHaveAttribute('type', 'password')
      })

      test('should toggle visibility when clicking eye icon', async () => {
        const { Password } = adapter
        render(<Password value="secret" onChange={() => {}} />)

        const input = screen.getByLabelText(/password/i)
        expect(input).toHaveAttribute('type', 'password')

        const toggleButton = screen.getByRole('button')
        await userEvent.click(toggleButton)

        expect(input).toHaveAttribute('type', 'text')

        await userEvent.click(toggleButton)
        expect(input).toHaveAttribute('type', 'password')
      })
    })

    describe('Textarea', () => {
      test('should render textarea', () => {
        const { Textarea } = adapter
        render(<Textarea value="" onChange={() => {}} />)

        expect(screen.getByRole('textbox')).toBeInTheDocument()
      })

      test('should respect rows prop', () => {
        const { Textarea } = adapter
        render(<Textarea value="" onChange={() => {}} rows={5} />)

        expect(screen.getByRole('textbox')).toHaveAttribute('rows', '5')
      })

      test('should call onChange when value changes', async () => {
        const handleChange = jest.fn()
        const { Textarea } = adapter
        render(<Textarea value="" onChange={handleChange} />)

        await userEvent.type(screen.getByRole('textbox'), 'test')

        expect(handleChange).toHaveBeenCalled()
      })
    })

    describe('Select', () => {
      const options = [
        { label: 'Option 1', value: '1' },
        { label: 'Option 2', value: '2' },
        { label: 'Option 3', value: '3' }
      ]

      test('should render select with options', () => {
        const { Select } = adapter
        render(<Select value="1" onChange={() => {}} options={options} />)

        expect(screen.getByRole('button')).toBeInTheDocument()
        expect(screen.getByText('Option 1')).toBeInTheDocument()
      })

      test('should open dropdown when clicked', async () => {
        const { Select } = adapter
        render(<Select value="1" onChange={() => {}} options={options} />)

        await userEvent.click(screen.getByRole('button'))

        await waitFor(() => {
          expect(screen.getByRole('listbox')).toBeInTheDocument()
        })
      })

      test('should call onChange when option selected', async () => {
        const handleChange = jest.fn()
        const { Select } = adapter
        render(<Select value="1" onChange={handleChange} options={options} />)

        await userEvent.click(screen.getByRole('button'))

        await waitFor(() => {
          const option = screen.getByText('Option 2')
          userEvent.click(option)
        })

        await waitFor(() => {
          expect(handleChange).toHaveBeenCalled()
        })
      })
    })
  })

  describe('Boolean Components', () => {
    describe('Checkbox', () => {
      test('should render checkbox with label', () => {
        const { Checkbox } = adapter
        render(<Checkbox checked={false} onChange={() => {}} label="Accept terms" />)

        expect(screen.getByLabelText('Accept terms')).toBeInTheDocument()
      })

      test('should toggle checked state', async () => {
        const handleChange = jest.fn()
        const { Checkbox } = adapter
        render(<Checkbox checked={false} onChange={handleChange} label="Test" />)

        await userEvent.click(screen.getByRole('checkbox'))

        expect(handleChange).toHaveBeenCalledWith(true)
      })

      test('should be disabled when disabled prop is true', () => {
        const { Checkbox } = adapter
        render(<Checkbox checked={false} onChange={() => {}} disabled />)

        expect(screen.getByRole('checkbox')).toBeDisabled()
      })
    })

    describe('Switch', () => {
      test('should render switch component', () => {
        const { Switch } = adapter
        render(<Switch checked={false} onChange={() => {}} />)

        expect(screen.getByRole('switch')).toBeInTheDocument()
      })

      test('should toggle switch state', async () => {
        const handleChange = jest.fn()
        const { Switch } = adapter
        render(<Switch checked={false} onChange={handleChange} />)

        await userEvent.click(screen.getByRole('switch'))

        expect(handleChange).toHaveBeenCalledWith(true)
      })

      test('should display label when provided', () => {
        const { Switch } = adapter
        render(<Switch checked={false} onChange={() => {}} label="Enable notifications" />)

        expect(screen.getByText('Enable notifications')).toBeInTheDocument()
      })
    })

    describe('RadioGroup', () => {
      const options = [
        { label: 'Option A', value: 'a' },
        { label: 'Option B', value: 'b' }
      ]

      test('should render radio group with options', () => {
        const { RadioGroup } = adapter
        render(<RadioGroup value="a" onChange={() => {}} options={options} />)

        expect(screen.getByLabelText('Option A')).toBeInTheDocument()
        expect(screen.getByLabelText('Option B')).toBeInTheDocument()
      })

      test('should call onChange when option selected', async () => {
        const handleChange = jest.fn()
        const { RadioGroup } = adapter
        render(<RadioGroup value="a" onChange={handleChange} options={options} />)

        await userEvent.click(screen.getByLabelText('Option B'))

        expect(handleChange).toHaveBeenCalledWith('b')
      })
    })
  })

  describe('Date/Time Components', () => {
    describe('DatePicker', () => {
      test('should render date picker', () => {
        const { DatePicker } = adapter
        render(<DatePicker value="" onChange={() => {}} />)

        const input = screen.getByRole('textbox')
        expect(input).toHaveAttribute('type', 'date')
      })

      test('should call onChange when date changes', async () => {
        const handleChange = jest.fn()
        const { DatePicker } = adapter
        render(<DatePicker value="" onChange={handleChange} />)

        const input = screen.getByRole('textbox')
        await userEvent.type(input, '2025-12-20')

        expect(handleChange).toHaveBeenCalled()
      })
    })

    describe('TimePicker', () => {
      test('should render time picker', () => {
        const { TimePicker } = adapter
        render(<TimePicker value="" onChange={() => {}} />)

        const input = screen.getByRole('textbox')
        expect(input).toHaveAttribute('type', 'time')
      })
    })

    describe('DateTimePicker', () => {
      test('should render datetime picker', () => {
        const { DateTimePicker } = adapter
        render(<DateTimePicker value="" onChange={() => {}} />)

        const input = screen.getByRole('textbox')
        expect(input).toHaveAttribute('type', 'datetime-local')
      })
    })
  })

  describe('Other Input Components', () => {
    describe('Slider', () => {
      test('should render slider', () => {
        const { Slider } = adapter
        render(<Slider value={50} onChange={() => {}} />)

        expect(screen.getByRole('slider')).toBeInTheDocument()
      })

      test('should respect min and max values', () => {
        const { Slider } = adapter
        render(<Slider value={50} onChange={() => {}} min={0} max={100} />)

        const slider = screen.getByRole('slider')
        expect(slider).toHaveAttribute('min', '0')
        expect(slider).toHaveAttribute('max', '100')
      })

      test('should call onChange when value changes', async () => {
        const handleChange = jest.fn()
        const { Slider } = adapter
        render(<Slider value={50} onChange={handleChange} />)

        const slider = screen.getByRole('slider')
        fireEvent.change(slider, { target: { value: '75' } })

        expect(handleChange).toHaveBeenCalledWith(75)
      })
    })

    describe('Rate', () => {
      test('should render rating stars', () => {
        const { Rate } = adapter
        render(<Rate value={3} onChange={() => {}} count={5} />)

        const stars = screen.getAllByTestId('star-icon')
        expect(stars).toHaveLength(5)
      })

      test('should call onChange when star clicked', async () => {
        const handleChange = jest.fn()
        const { Rate } = adapter
        render(<Rate value={0} onChange={handleChange} count={5} />)

        const buttons = screen.getAllByRole('button')
        await userEvent.click(buttons[3])

        expect(handleChange).toHaveBeenCalledWith(4)
      })

      test('should be disabled when disabled prop is true', () => {
        const { Rate } = adapter
        render(<Rate value={3} onChange={() => {}} disabled />)

        const buttons = screen.getAllByRole('button')
        buttons.forEach(button => {
          expect(button).toBeDisabled()
        })
      })
    })
  })

  describe('Display Components', () => {
    describe('Tag', () => {
      test('should render tag with children', () => {
        const { Tag } = adapter
        render(<Tag>Test Tag</Tag>)

        expect(screen.getByText('Test Tag')).toBeInTheDocument()
      })

      test('should render with different colors', () => {
        const { Tag } = adapter
        const { container } = render(<Tag color="blue">Blue Tag</Tag>)

        expect(container.firstChild).toHaveClass('bg-blue-100')
      })

      test('should render close button when closable', () => {
        const { Tag } = adapter
        render(<Tag closable>Closable</Tag>)

        expect(screen.getByTestId('x-mark-icon')).toBeInTheDocument()
      })

      test('should call onClose when close button clicked', async () => {
        const handleClose = jest.fn()
        const { Tag } = adapter
        render(<Tag closable onClose={handleClose}>Test</Tag>)

        const closeButton = screen.getByRole('button')
        await userEvent.click(closeButton)

        expect(handleClose).toHaveBeenCalled()
      })
    })

    describe('Badge', () => {
      test('should render badge with count', () => {
        const { Badge, Button } = adapter
        render(
          <Badge count={5}>
            <Button>Notifications</Button>
          </Badge>
        )

        expect(screen.getByText('5')).toBeInTheDocument()
      })

      test('should not render badge when count is 0', () => {
        const { Badge, Button } = adapter
        render(
          <Badge count={0}>
            <Button>Notifications</Button>
          </Badge>
        )

        expect(screen.queryByText('0')).not.toBeInTheDocument()
      })

      test('should show "99+" when count exceeds 99', () => {
        const { Badge, Button } = adapter
        render(
          <Badge count={150}>
            <Button>Notifications</Button>
          </Badge>
        )

        expect(screen.getByText('99+')).toBeInTheDocument()
      })
    })

    describe('Progress', () => {
      test('should render progress bar', () => {
        const { Progress } = adapter
        const { container } = render(<Progress percent={50} />)

        expect(container.querySelector('[style*="width: 50%"]')).toBeInTheDocument()
      })

      test('should show percentage text', () => {
        const { Progress } = adapter
        render(<Progress percent={75} showInfo />)

        expect(screen.getByText('75%')).toBeInTheDocument()
      })

      test('should apply status colors', () => {
        const { Progress } = adapter
        const { container: success } = render(<Progress percent={100} status="success" />)
        const { container: error } = render(<Progress percent={50} status="error" />)

        expect(success.querySelector('.bg-green-600')).toBeInTheDocument()
        expect(error.querySelector('.bg-red-600')).toBeInTheDocument()
      })
    })

    describe('Alert', () => {
      test('should render alert with message', () => {
        const { Alert } = adapter
        render(<Alert message="Test message" />)

        expect(screen.getByText('Test message')).toBeInTheDocument()
      })

      test('should render different types', () => {
        const { Alert } = adapter
        const { container: info } = render(<Alert type="info" message="Info" />)
        const { container: success } = render(<Alert type="success" message="Success" />)
        const { container: warning } = render(<Alert type="warning" message="Warning" />)
        const { container: error } = render(<Alert type="error" message="Error" />)

        expect(info.querySelector('.bg-blue-50')).toBeInTheDocument()
        expect(success.querySelector('.bg-green-50')).toBeInTheDocument()
        expect(warning.querySelector('.bg-yellow-50')).toBeInTheDocument()
        expect(error.querySelector('.bg-red-50')).toBeInTheDocument()
      })

      test('should render close button when closable', () => {
        const { Alert } = adapter
        render(<Alert message="Test" closable />)

        expect(screen.getByRole('button')).toBeInTheDocument()
      })

      test('should call onClose when close button clicked', async () => {
        const handleClose = jest.fn()
        const { Alert } = adapter
        render(<Alert message="Test" closable onClose={handleClose} />)

        await userEvent.click(screen.getByRole('button'))

        expect(handleClose).toHaveBeenCalled()
      })
    })

    describe('Spin', () => {
      test('should render loading spinner', () => {
        const { Spin } = adapter
        const { container } = render(<Spin />)

        expect(container.querySelector('.animate-spin')).toBeInTheDocument()
      })

      test('should render different sizes', () => {
        const { Spin } = adapter
        const { container: small } = render(<Spin size="small" />)
        const { container: large } = render(<Spin size="large" />)

        expect(small.querySelector('.h-4.w-4')).toBeInTheDocument()
        expect(large.querySelector('.h-12.w-12')).toBeInTheDocument()
      })
    })

    describe('Avatar', () => {
      test('should render avatar with text', () => {
        const { Avatar } = adapter
        render(<Avatar>JD</Avatar>)

        expect(screen.getByText('JD')).toBeInTheDocument()
      })

      test('should render avatar with image', () => {
        const { Avatar } = adapter
        render(<Avatar src="https://example.com/avatar.jpg" />)

        expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/avatar.jpg')
      })

      test('should render different sizes', () => {
        const { Avatar } = adapter
        const { container: small } = render(<Avatar size="small">A</Avatar>)
        const { container: large } = render(<Avatar size="large">B</Avatar>)

        expect(small.querySelector('.h-8.w-8')).toBeInTheDocument()
        expect(large.querySelector('.h-16.w-16')).toBeInTheDocument()
      })
    })

    describe('Empty', () => {
      test('should render empty state', () => {
        const { Empty } = adapter
        render(<Empty description="No data" />)

        expect(screen.getByText('No data')).toBeInTheDocument()
      })
    })
  })

  describe('Layout Components', () => {
    describe('Card', () => {
      test('should render card with title and children', () => {
        const { Card } = adapter
        render(<Card title="Card Title">Card Content</Card>)

        expect(screen.getByText('Card Title')).toBeInTheDocument()
        expect(screen.getByText('Card Content')).toBeInTheDocument()
      })

      test('should render extra content in header', () => {
        const { Card, Button } = adapter
        render(
          <Card title="Title" extra={<Button>Action</Button>}>
            Content
          </Card>
        )

        expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
      })
    })

    describe('Divider', () => {
      test('should render divider', () => {
        const { Divider } = adapter
        const { container } = render(<Divider />)

        expect(container.querySelector('hr')).toBeInTheDocument()
      })
    })

    describe('Modal', () => {
      test('should render modal when open', () => {
        const { Modal } = adapter
        render(
          <Modal open={true} onClose={() => {}}>
            <Modal.Panel>
              <Modal.Title>Modal Title</Modal.Title>
              <p>Modal content</p>
            </Modal.Panel>
          </Modal>
        )

        expect(screen.getByText('Modal Title')).toBeInTheDocument()
        expect(screen.getByText('Modal content')).toBeInTheDocument()
      })

      test('should not render when closed', () => {
        const { Modal } = adapter
        render(
          <Modal open={false} onClose={() => {}}>
            <Modal.Panel>
              <p>Modal content</p>
            </Modal.Panel>
          </Modal>
        )

        expect(screen.queryByText('Modal content')).not.toBeInTheDocument()
      })
    })

    describe('Drawer', () => {
      test('should render drawer when open', () => {
        const { Drawer } = adapter
        render(
          <Drawer open={true} onClose={() => {}} title="Drawer Title">
            Drawer content
          </Drawer>
        )

        expect(screen.getByText('Drawer Title')).toBeInTheDocument()
        expect(screen.getByText('Drawer content')).toBeInTheDocument()
      })

      test('should render different placements', () => {
        const { Drawer } = adapter
        const { container: left } = render(
          <Drawer open={true} onClose={() => {}} placement="left">Left</Drawer>
        )
        const { container: right } = render(
          <Drawer open={true} onClose={() => {}} placement="right">Right</Drawer>
        )

        expect(left.querySelector('[class*="left-0"]')).toBeInTheDocument()
        expect(right.querySelector('[class*="right-0"]')).toBeInTheDocument()
      })
    })

    describe('Collapse', () => {
      test('should render collapse component', () => {
        const { Collapse } = adapter
        render(
          <Collapse>
            <Collapse.Button>Click to expand</Collapse.Button>
            <Collapse.Panel>Hidden content</Collapse.Panel>
          </Collapse>
        )

        expect(screen.getByRole('button', { name: 'Click to expand' })).toBeInTheDocument()
      })

      test('should toggle panel visibility', async () => {
        const { Collapse } = adapter
        render(
          <Collapse>
            <Collapse.Button>Toggle</Collapse.Button>
            <Collapse.Panel>Panel content</Collapse.Panel>
          </Collapse>
        )

        expect(screen.queryByText('Panel content')).not.toBeVisible()

        await userEvent.click(screen.getByRole('button', { name: 'Toggle' }))

        await waitFor(() => {
          expect(screen.getByText('Panel content')).toBeVisible()
        })
      })
    })

    describe('Tabs', () => {
      test('should render tabs', () => {
        const { Tabs } = adapter
        render(
          <Tabs>
            <Tabs.List>
              <Tabs.Tab>Tab 1</Tabs.Tab>
              <Tabs.Tab>Tab 2</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panels>
              <Tabs.Panel>Content 1</Tabs.Panel>
              <Tabs.Panel>Content 2</Tabs.Panel>
            </Tabs.Panels>
          </Tabs>
        )

        expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument()
        expect(screen.getByRole('tab', { name: 'Tab 2' })).toBeInTheDocument()
      })

      test('should switch tabs when clicked', async () => {
        const { Tabs } = adapter
        render(
          <Tabs>
            <Tabs.List>
              <Tabs.Tab>Tab 1</Tabs.Tab>
              <Tabs.Tab>Tab 2</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panels>
              <Tabs.Panel>Content 1</Tabs.Panel>
              <Tabs.Panel>Content 2</Tabs.Panel>
            </Tabs.Panels>
          </Tabs>
        )

        expect(screen.getByText('Content 1')).toBeInTheDocument()

        await userEvent.click(screen.getByRole('tab', { name: 'Tab 2' }))

        await waitFor(() => {
          expect(screen.getByText('Content 2')).toBeInTheDocument()
        })
      })
    })
  })

  describe('Action Components', () => {
    describe('Button', () => {
      test('should render button with children', () => {
        const { Button } = adapter
        render(<Button>Click me</Button>)

        expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
      })

      test('should render different types', () => {
        const { Button } = adapter
        const { container: primary } = render(<Button type="primary">Primary</Button>)
        const { container: dashed } = render(<Button type="dashed">Dashed</Button>)

        expect(primary.querySelector('.bg-indigo-600')).toBeInTheDocument()
        expect(dashed.querySelector('.border-dashed')).toBeInTheDocument()
      })

      test('should call onClick when clicked', async () => {
        const handleClick = jest.fn()
        const { Button } = adapter
        render(<Button onClick={handleClick}>Click</Button>)

        await userEvent.click(screen.getByRole('button'))

        expect(handleClick).toHaveBeenCalled()
      })

      test('should be disabled when disabled prop is true', () => {
        const { Button } = adapter
        render(<Button disabled>Disabled</Button>)

        expect(screen.getByRole('button')).toBeDisabled()
      })

      test('should show loading state', () => {
        const { Button } = adapter
        const { container } = render(<Button loading>Loading</Button>)

        expect(container.querySelector('.animate-spin')).toBeInTheDocument()
      })
    })

    describe('Dropdown', () => {
      test('should render dropdown', () => {
        const { Dropdown } = adapter
        render(
          <Dropdown>
            <Dropdown.Button>Options</Dropdown.Button>
            <Dropdown.Items>
              <Dropdown.Item>Edit</Dropdown.Item>
              <Dropdown.Item>Delete</Dropdown.Item>
            </Dropdown.Items>
          </Dropdown>
        )

        expect(screen.getByRole('button', { name: 'Options' })).toBeInTheDocument()
      })

      test('should show menu items when clicked', async () => {
        const { Dropdown } = adapter
        render(
          <Dropdown>
            <Dropdown.Button>Options</Dropdown.Button>
            <Dropdown.Items>
              <Dropdown.Item>Edit</Dropdown.Item>
              <Dropdown.Item>Delete</Dropdown.Item>
            </Dropdown.Items>
          </Dropdown>
        )

        await userEvent.click(screen.getByRole('button', { name: 'Options' }))

        await waitFor(() => {
          expect(screen.getByRole('menu')).toBeInTheDocument()
          expect(screen.getByText('Edit')).toBeInTheDocument()
          expect(screen.getByText('Delete')).toBeInTheDocument()
        })
      })
    })

    describe('Pagination', () => {
      test('should render pagination', () => {
        const { Pagination } = adapter
        render(<Pagination current={1} total={100} pageSize={10} onChange={() => {}} />)

        expect(screen.getByText('1')).toBeInTheDocument()
        expect(screen.getByText(/Showing.*1.*to.*10.*of.*100/)).toBeInTheDocument()
      })

      test('should call onChange when page changes', async () => {
        const handleChange = jest.fn()
        const { Pagination } = adapter
        render(<Pagination current={1} total={100} pageSize={10} onChange={handleChange} />)

        await userEvent.click(screen.getByText('2'))

        expect(handleChange).toHaveBeenCalledWith(2, 10)
      })

      test('should disable previous button on first page', () => {
        const { Pagination } = adapter
        render(<Pagination current={1} total={100} pageSize={10} onChange={() => {}} />)

        const prevButtons = screen.getAllByRole('button').filter(btn =>
          btn.querySelector('[data-testid="chevron-left-icon"]')
        )
        expect(prevButtons[0]).toBeDisabled()
      })

      test('should disable next button on last page', () => {
        const { Pagination } = adapter
        render(<Pagination current={10} total={100} pageSize={10} onChange={() => {}} />)

        const nextButtons = screen.getAllByRole('button').filter(btn =>
          btn.querySelector('[data-testid="chevron-right-icon"]')
        )
        expect(nextButtons[0]).toBeDisabled()
      })
    })

    describe('Upload', () => {
      test('should render upload component', () => {
        const { Upload, Button } = adapter
        render(
          <Upload onChange={() => {}}>
            <Button>Upload File</Button>
          </Upload>
        )

        expect(screen.getByRole('button', { name: 'Upload File' })).toBeInTheDocument()
      })

      test('should trigger file input when clicked', async () => {
        const handleChange = jest.fn()
        const { Upload, Button } = adapter
        render(
          <Upload onChange={handleChange}>
            <Button>Upload</Button>
          </Upload>
        )

        const file = new File(['content'], 'test.txt', { type: 'text/plain' })
        const input = document.querySelector('input[type="file"]')

        await userEvent.upload(input, file)

        expect(handleChange).toHaveBeenCalled()
      })
    })

    describe('Table', () => {
      const dataSource = [
        { id: 1, name: 'John', age: 30 },
        { id: 2, name: 'Jane', age: 25 }
      ]

      const columns = [
        { title: 'Name', dataIndex: 'name' },
        { title: 'Age', dataIndex: 'age' }
      ]

      test('should render table with data', () => {
        const { Table } = adapter
        render(<Table dataSource={dataSource} columns={columns} />)

        expect(screen.getByText('Name')).toBeInTheDocument()
        expect(screen.getByText('Age')).toBeInTheDocument()
        expect(screen.getByText('John')).toBeInTheDocument()
        expect(screen.getByText('Jane')).toBeInTheDocument()
      })

      test('should show empty state when no data', () => {
        const { Table } = adapter
        render(<Table dataSource={[]} columns={columns} />)

        expect(screen.getByText('No data')).toBeInTheDocument()
      })
    })
  })

  describe('Utility Methods', () => {
    test('should generate correct input classes', () => {
      const normalClasses = adapter.getInputClasses()
      expect(normalClasses).toContain('ring-gray-300')
      expect(normalClasses).toContain('focus:ring-indigo-600')

      const errorClasses = adapter.getInputClasses(true)
      expect(errorClasses).toContain('ring-red-300')
      expect(errorClasses).toContain('focus:ring-red-500')

      const disabledClasses = adapter.getInputClasses(false, true)
      expect(disabledClasses).toContain('bg-gray-50')
      expect(disabledClasses).toContain('cursor-not-allowed')
    })

    test('should generate correct button classes', () => {
      const primaryClasses = adapter.getButtonClasses('primary')
      expect(primaryClasses).toContain('bg-indigo-600')

      const defaultClasses = adapter.getButtonClasses('default')
      expect(defaultClasses).toContain('bg-white')

      const textClasses = adapter.getButtonClasses('text')
      expect(textClasses).toContain('bg-transparent')

      const dangerClasses = adapter.getButtonClasses('primary', false, true)
      expect(dangerClasses).toContain('bg-red-600')
    })
  })

  describe('Accessibility', () => {
    test('should support keyboard navigation for inputs', async () => {
      const { Input } = adapter
      const handleChange = jest.fn()
      render(<Input value="" onChange={handleChange} label="Test" />)

      const input = screen.getByLabelText('Test')
      input.focus()

      expect(input).toHaveFocus()
    })

    test('should have proper ARIA labels', () => {
      const { Input, Select } = adapter
      render(
        <React.Fragment>
          <Input label="Username" value="" onChange={() => {}} />
          <Select label="Country" value="" onChange={() => {}} options={[]} />
        </React.Fragment>
      )

      expect(screen.getByLabelText('Username')).toHaveAccessibleName()
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('should support screen reader text', () => {
      const { Badge, Button } = adapter
      render(
        <Badge count={5}>
          <Button>Notifications</Button>
        </Badge>
      )

      expect(screen.getByText('5')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    test('should handle missing onChange gracefully', () => {
      const { Input } = adapter
      expect(() => {
        render(<Input value="test" />)
      }).not.toThrow()
    })

    test('should handle empty options array', () => {
      const { Select } = adapter
      render(<Select value="" onChange={() => {}} options={[]} />)

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('should handle missing required props', () => {
      const { Table } = adapter
      expect(() => {
        render(<Table />)
      }).not.toThrow()
    })
  })
})
