import React, { useState } from 'react';
import { Button, Modal, Spin, Form, Table, InputNumber, Input, Space } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useAuth } from 'fennec-core';
import { Action } from 'fennec-core/components/Action';
import { Model } from 'fennec-core/components/Model';
import { Field } from 'fennec-core/components/Field';

const META = {
  name: 'demo',
  label: 'Документ со строками',
  properties: [
    { name: 'Title', type: 'string', label: 'Название' },
    { name: 'Amount', type: 'float', label: 'Сумма' },
    {
      name: 'Lines',
      label: 'Строки',
      type: 'object',
      relation: { type: 'one-many', reference: { object: 'orderLine' } },
    },
  ],
};

let nextLineId = 1;
function newLine() {
  return { id: `line_${nextLineId++}`, ProductName: '', Qty: 1, Price: 0 };
}

function LineModal({ open, title, initial, onOk, onCancel }) {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (open) {
      form.setFieldsValue(initial || { ProductName: '', Qty: 1, Price: 0 });
    }
  }, [open, initial, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onOk(values);
      form.resetFields();
      onCancel?.();
    });
  };

  return (
    <Modal
      title={title}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      destroyOnClose
      width={360}
      okText="Сохранить"
      cancelText="Отмена"
    >
      <Form form={form} layout="vertical">
        <Form.Item name="ProductName" label="Товар" rules={[{ required: true, message: 'Введите название' }]}>
          <Input placeholder="Название товара" />
        </Form.Item>
        <Form.Item name="Qty" label="Кол-во" rules={[{ required: true }]}>
          <InputNumber min={0.01} step={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="Price" label="Цена" rules={[{ required: true }]}>
          <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

function LinesTable({ value = [], onChange }) {
  const [lineModalOpen, setLineModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const lines = Array.isArray(value) ? value : [];

  const handleAdd = () => {
    setEditingIndex(null);
    setLineModalOpen(true);
  };

  const handleEdit = (record, index) => {
    setEditingIndex(index);
    setLineModalOpen(true);
  };

  const handleDelete = (index) => {
    Modal.confirm({
      title: 'Удалить строку?',
      okText: 'Да',
      okType: 'danger',
      cancelText: 'Нет',
      onOk: () => {
        const next = lines.filter((_, i) => i !== index);
        onChange(next);
      },
    });
  };

  const handleLineOk = (values) => {
    if (editingIndex !== null) {
      const next = [...lines];
      next[editingIndex] = { ...(lines[editingIndex] || {}), ...values };
      onChange(next);
    } else {
      onChange([...lines, { ...newLine(), ...values }]);
    }
    setLineModalOpen(false);
    setEditingIndex(null);
  };

  const editingLine = editingIndex !== null ? lines[editingIndex] : null;

  const columns = [
    { title: 'Товар', dataIndex: 'ProductName', key: 'ProductName', width: '40%' },
    { title: 'Кол-во', dataIndex: 'Qty', key: 'Qty', width: 100, render: (v) => (v != null ? Number(v) : '—') },
    { title: 'Цена', dataIndex: 'Price', key: 'Price', width: 100, render: (v) => (v != null ? Number(v) : '—') },
    {
      title: '',
      key: 'actions',
      width: 100,
      render: (_, __, index) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(lines[index], index)} />
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(index)} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 600, fontSize: 13 }}>Строки</span>
        <Button type="primary" size="small" icon={<PlusOutlined />} onClick={handleAdd}>
          Добавить
        </Button>
      </div>
      <Table
        size="small"
        rowKey={(r) => r.id ?? r.ID ?? Math.random()}
        columns={columns}
        dataSource={lines}
        pagination={false}
        locale={{ emptyText: 'Нет строк. Нажмите «Добавить».' }}
      />
      <LineModal
        open={lineModalOpen}
        title={editingIndex !== null ? 'Изменить строку' : 'Добавить строку'}
        initial={editingLine}
        onOk={handleLineOk}
        onCancel={() => {
          setLineModalOpen(false);
          setEditingIndex(null);
        }}
      />
    </div>
  );
}

function ModelFormWithRender(props) {
  const auth = useAuth();
  return (
    <Model
      {...props}
      auth={auth}
      render={(ctx) => {
        return (
        <Form
          form={ctx.form}
          onFinish={ctx.submit}
          onValuesChange={ctx.onValuesChange}
          initialValues={{ ...ctx.initialValues, Lines: ctx.initialValues?.Lines ?? [] }}
          {...ctx.options}
        >
          {ctx.getFormFields().map((item, idx) => {
            if (!item?.name && item.type === 'func' && item.render) {
              const args = ctx.getFuncRenderArgs(item, idx);
              return (
                <div key={'func_' + idx}>
                  {item.render(args.auth, args.item, args.context)}
                </div>
              );
            }
            const formItemProps = ctx.getFieldFormItemProps(item);
            const fieldProps = ctx.getFieldProps(item);
            const { key: _fiKey, ...formItemRest } = formItemProps;
            const { key: _fKey, ...fieldRest } = fieldProps;
            return (
              <Form.Item key={item?.name} {...formItemRest}>
                <Field key={item?.name} {...fieldRest} />
              </Form.Item>
            );
          })}
          {ctx.propertiesOneMany?.length > 0 && (
            <Form.Item
              name="Lines"
              label="Строки документа"
              style={{ marginTop: 16 }}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <LinesTable />
            </Form.Item>
          )}
        </Form>
      )}}
    />
  );
}

export default function DemoAction() {
  const auth = useAuth();

  return (
    <Action
      auth={auth}
      title="Демо Action — форма с подчинённой таблицей"
      trigger={(click) => (
        <Button type="primary" onClick={click}>
          Открыть форму
        </Button>
      )}
      form={ModelFormWithRender}
      name="demo"
      meta={META}
      object={{ Lines: [] }}
      okText="Отправить"
      dismissText="Закрыть"
      callback={() => {
        console.log('Submit callback');
      }}
      action={(values, unlock, close, context) => {
        console.log('Action submit:', values);
        close?.();
      }}
      render={(context) => {
        const footerButtons = context.footer();
        const footer =
          Array.isArray(footerButtons) &&
          footerButtons.map((btn) => {
            if (React.isValidElement(btn)) return btn;
            if (!btn) return null;
            const { key: _omit, ...opts } = btn.options || {};
            return (
              <Button key={btn.key} onClick={btn.onPress} {...opts}>
                {btn.text}
              </Button>
            );
          });
        return (
          <>
            {context.trigger()}
            <Modal
              title="Демо Action — форма с подчинённой таблицей"
              open={context.opened}
              onCancel={context.close}
              footer={footer}
              destroyOnClose
              width={640}
            >
              <div style={{ width: '100%', minHeight: 120 }}>
                <Spin spinning={context.loading}>
                  {context.opened && context.FormRenderer()}
                </Spin>
              </div>
            </Modal>
          </>
        );
      }}
    />
  );
}
