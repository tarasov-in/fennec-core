import React, { useState } from 'react';
import { Form, Button } from 'antd';
import { useAuth, GetMetaProperties, formItemRules, uncapitalize } from 'fennec-core';
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

  const properties = GetMetaProperties(META)?.filter(
    (e) => e.name && e.name.toUpperCase() !== 'ID'
  );

  return (
    <div>
      <Form
        form={form}
        onFinish={submit}
        layout="vertical"
        initialValues={{
          title: 'Пример',
          amount: 100,
          active: true,
          createdAt: undefined,
        }}
      >
        {properties?.map((item) => (
          <Form.Item
            key={item.name}
            name={uncapitalize(item.name)}
            label={item.type !== 'bool' && item.type !== 'boolean' ? item.label : undefined}
            rules={formItemRules(item)}
          >
            <Field
              mode="model"
              objectName="demo"
              auth={auth}
              formItem
              item={{ ...item, filterType: undefined }}
            />
          </Form.Item>
        ))}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Сохранить
          </Button>
        </Form.Item>
      </Form>
      {saved && (
        <pre style={{ marginTop: 16, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
          {JSON.stringify(saved, null, 2)}
        </pre>
      )}
    </div>
  );
}
