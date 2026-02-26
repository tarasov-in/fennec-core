import React, { useState } from 'react';
import { Form, Button } from 'antd';
import { useAuth } from 'fennec-core';
import { Model } from 'fennec-core/components/Model';
import { Field } from 'fennec-core/components/Field';

const META = {
  name: 'demo',
  label: 'Демо-форма',
  properties: [
    { name: 'Title', type: 'string', label: 'Название' },
    { name: 'Amount', type: 'float', label: 'Сумма' },
    { name: 'Active', type: 'boolean', label: 'Активно' },
    { name: 'CreatedAt', type: 'date', label: 'Дата' },
  ],
};

export default function DemoModelForm() {
  const auth = useAuth();
  const [form] = Form.useForm();
  const [saved, setSaved] = useState(null);

  const submit = (values) => {
    setSaved(values);
  };

  const initialObject = {
    title: 'Пример',
    amount: 100,
    active: true,
    createdAt: undefined,
  };

  return (
    <div>
      <Model
        auth={auth}
        name="demo"
        meta={META}
        options={{ labelAlign: 'left', layout: 'vertical' }}
        object={initialObject}
        data={{}}
        form={form}
        submit={submit}
        render={(ctx) => (
          <Form
            form={ctx.form}
            onFinish={ctx.submit}
            onValuesChange={ctx.onValuesChange}
            initialValues={ctx.initialValues}
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
              return (
                <Form.Item key={item?.name} {...ctx.getFieldFormItemProps(item)}>
                  <Field {...ctx.getFieldProps(item)} />
                </Form.Item>
              );
            })}
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Сохранить
              </Button>
            </Form.Item>
          </Form>
        )}
      />
      {saved && (
        <pre style={{ marginTop: 16, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
          {JSON.stringify(saved, null, 2)}
        </pre>
      )}
    </div>
  );
}
