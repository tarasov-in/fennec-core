import React, { useState } from 'react';
import { useAuth, useUIOptional } from 'fennec-core';
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

/**
 * Держит экземпляр формы от адаптера (createFormInstance — хук, вызывается только при наличии ui).
 */
function LineFormHolder({ ui, children }) {
  const [lineForm] = ui?.createFormInstance?.() ?? [null];
  return children(lineForm);
}

function LineModal({ open, title, initial, onOk, onCancel, ui, lineForm }) {
  const FormComponent = ui?.Form;
  const FormItemComponent = ui?.FormItem ?? ui?.Form?.Item;
  const InputComponent = ui?.Input;
  const InputNumberComponent = ui?.InputNumber;
  const ModalComponent = ui?.Modal;
  const ButtonComponent = ui?.Button;

  React.useEffect(() => {
    if (open && lineForm?.setFieldsValue) {
      lineForm.setFieldsValue(initial || { ProductName: '', Qty: 1, Price: 0 });
    }
  }, [open, initial, lineForm]);

  const handleOk = () => {
    if (!lineForm?.validateFields) {
      onOk(initial || { ProductName: '', Qty: 1, Price: 0 });
      onCancel?.();
      return;
    }
    lineForm.validateFields().then((values) => {
      onOk(values);
      lineForm.resetFields?.();
      onCancel?.();
    });
  };

  if (!ModalComponent) {
    return null;
  }

  const formContent = FormComponent && lineForm ? (
    <FormComponent form={lineForm} layout="vertical">
      {FormItemComponent && InputComponent && (
        <FormItemComponent name="ProductName" label="Товар" rules={[{ required: true, message: 'Введите название' }]}>
          <InputComponent placeholder="Название товара" />
        </FormItemComponent>
      )}
      {FormItemComponent && InputNumberComponent && (
        <FormItemComponent name="Qty" label="Кол-во" rules={[{ required: true }]}>
          <InputNumberComponent min={0.01} step={1} style={{ width: '100%' }} />
        </FormItemComponent>
      )}
      {FormItemComponent && InputNumberComponent && (
        <FormItemComponent name="Price" label="Цена" rules={[{ required: true }]}>
          <InputNumberComponent min={0} step={0.01} style={{ width: '100%' }} />
        </FormItemComponent>
      )}
    </FormComponent>
  ) : (
    <div>Форма недоступна (адаптер не предоставляет Form/FormItem)</div>
  );

  const isMobile = typeof ui?.isMobile === 'function' && ui.isMobile();
  const footer = isMobile
    ? [
        { key: 'cancel', text: 'Отмена', onClick: onCancel },
        { key: 'ok', text: 'Сохранить', primary: true, onClick: handleOk },
      ]
    : ButtonComponent
      ? [
          <ButtonComponent key="cancel" onClick={onCancel}>
            Отмена
          </ButtonComponent>,
          <ButtonComponent key="ok" type="primary" onClick={handleOk}>
            Сохранить
          </ButtonComponent>,
        ]
      : undefined;

  return (
    <ModalComponent
      title={title}
      visible={open}
      onClose={onCancel}
      onOk={handleOk}
      onCancel={onCancel}
      destroyOnClose
      width={360}
      okText="Сохранить"
      cancelText="Отмена"
      footer={footer}
    >
      {formContent}
    </ModalComponent>
  );
}

function LinesTable({ value = [], onChange, ui, lineForm }) {
  const [lineModalOpen, setLineModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const lines = Array.isArray(value) ? value : [];

  const Button = ui?.Button;
  const TableComponent = ui?.Table;
  const confirmFn = ui?.confirm;

  const handleAdd = () => {
    setEditingIndex(null);
    setLineModalOpen(true);
  };

  const handleEdit = (record, index) => {
    setEditingIndex(index);
    setLineModalOpen(true);
  };

  const handleDelete = (index) => {
    if (confirmFn) {
      confirmFn({
        title: 'Удалить строку?',
        okText: 'Да',
        okType: 'danger',
        cancelText: 'Нет',
        onOk: () => {
          const next = lines.filter((_, i) => i !== index);
          onChange(next);
        },
      });
    } else {
      if (typeof window !== 'undefined' && window.confirm('Удалить строку?')) {
        onChange(lines.filter((_, i) => i !== index));
      }
    }
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
      render: (_, __, index) =>
        Button ? (
          <span style={{ display: 'inline-flex', gap: 4 }}>
            <Button type="link" size="small" onClick={() => handleEdit(lines[index], index)}>
              Изменить
            </Button>
            <Button type="link" size="small" danger onClick={() => handleDelete(index)}>
              Удалить
            </Button>
          </span>
        ) : (
          <>
            <button type="button" onClick={() => handleEdit(lines[index], index)}>Изменить</button>
            <button type="button" onClick={() => handleDelete(index)}>Удалить</button>
          </>
        ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 600, fontSize: 13 }}>Строки</span>
        {Button && (
          <Button type="primary" size="small" onClick={handleAdd}>
            Добавить
          </Button>
        )}
      </div>
      {TableComponent ? (
        <TableComponent
          size="small"
          rowKey={(r) => r.id ?? r.ID ?? Math.random()}
          columns={columns}
          dataSource={lines}
          pagination={false}
          locale={{ emptyText: 'Нет строк. Нажмите «Добавить».' }}
        />
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} style={{ textAlign: 'left', padding: '8px 6px', borderBottom: '1px solid #e5e5e5' }}>
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lines.map((row, idx) => (
              <tr key={row.id ?? row.ID ?? idx}>
                {columns.map((col) => (
                  <td key={col.key} style={{ padding: '6px', borderBottom: '1px solid #f0f0f0' }}>
                    {col.render ? col.render(row[col.dataIndex], row, idx) : row[col.dataIndex]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <LineModal
        open={lineModalOpen}
        title={editingIndex !== null ? 'Изменить строку' : 'Добавить строку'}
        initial={editingLine}
        onOk={handleLineOk}
        onCancel={() => {
          setLineModalOpen(false);
          setEditingIndex(null);
        }}
        ui={ui}
        lineForm={lineForm}
      />
    </div>
  );
}

function ModelFormWithRender(props) {
  const auth = useAuth();
  const ui = useUIOptional();
  const FormComponent = ui?.Form;
  const FormItemComponent = ui?.FormItem ?? ui?.Form?.Item;
  const ButtonComponent = ui?.Button;
  const SpinComponent = ui?.Spin;

  if (!FormComponent || !FormItemComponent) {
    return (
      <div style={{ padding: 16 }}>
        Адаптер не предоставляет Form/FormItem. Используйте UIProvider с AntdAdapter или AntdMobileAdapter.
      </div>
    );
  }

  return (
    <Model
      {...props}
      auth={auth}
      render={(ctx) => (
        <FormComponent
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
              <FormItemComponent key={item?.name} {...formItemRest}>
                <Field key={item?.name} {...fieldRest} />
              </FormItemComponent>
            );
          })}
          {ctx.propertiesOneMany?.length > 0 && (
            <FormItemComponent
              name="Lines"
              label="Строки документа"
              style={{ marginTop: 16 }}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              {ui ? (
                <LineFormHolder ui={ui}>
                  {(lineForm) => <LinesTable ui={ui} lineForm={lineForm} />}
                </LineFormHolder>
              ) : (
                <LinesTable ui={ui} lineForm={null} />
              )}
            </FormItemComponent>
          )}
        </FormComponent>
      )}
    />
  );
}

export default function DemoAction() {
  const auth = useAuth();
  const ui = useUIOptional();
  const ButtonComponent = ui?.Button;
  const ModalComponent = ui?.Modal;
  const SpinComponent = ui?.Spin;

  return (
    <Action
      auth={auth}
      title="Демо Action — форма с подчинённой таблицей (адаптер)"
      trigger={(click) =>
        ButtonComponent ? (
          <ButtonComponent type="primary" onClick={click}>
            Открыть форму
          </ButtonComponent>
        ) : (
          <button type="button" onClick={click}>
            Открыть форму
          </button>
        )
      }
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
        const isMobileUI = typeof ui?.isMobile === 'function' && ui.isMobile();
        const footer =
          Array.isArray(footerButtons) && isMobileUI
            ? footerButtons
                .filter(Boolean)
                .map((btn) =>
                  typeof btn === 'object' && btn !== null && !React.isValidElement(btn)
                    ? {
                        key: btn.key,
                        text: btn.text,
                        onClick: btn.onPress,
                        primary: btn.options?.type === 'primary',
                      }
                    : null
                )
                .filter(Boolean)
            : Array.isArray(footerButtons) &&
              footerButtons.map((btn) => {
                if (React.isValidElement(btn)) return btn;
                if (!btn) return null;
                const { key: _omit, ...opts } = btn.options || {};
                return ButtonComponent ? (
                  <ButtonComponent key={btn.key} onClick={btn.onPress} {...opts}>
                    {btn.text}
                  </ButtonComponent>
                ) : (
                  <button key={btn.key} type="button" onClick={btn.onPress}>
                    {btn.text}
                  </button>
                );
              });
        const ModalWrap = ModalComponent || 'div';
        const spinProps = SpinComponent ? { spinning: context.loading } : {};
        return (
          <React.Fragment>
            {context.trigger()}
            <ModalWrap
              title="Демо Action — форма с подчинённой таблицей (адаптер)"
              visible={context.opened}
              open={context.opened}
              onClose={context.close}
              onCancel={context.close}
              footer={footer}
              destroyOnClose
              width={640}
            >
              <div style={{ width: '100%', minHeight: 120 }}>
                {SpinComponent ? (
                  <SpinComponent {...spinProps}>
                    {context.opened && context.FormRenderer()}
                  </SpinComponent>
                ) : (
                  context.opened && context.FormRenderer()
                )}
              </div>
            </ModalWrap>
          </React.Fragment>
        );
      }}
    />
  );
}
