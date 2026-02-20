import React from 'react';
import { Button } from 'antd';
import { useAuth } from 'fennec-core';
import { Action } from 'fennec-core/components/Action';
import { Model } from 'fennec-core/components/Model';

const META = {
  name: 'demo',
  label: 'Создание записи',
  properties: [
    { name: 'Title', type: 'string', label: 'Название' },
    { name: 'Amount', type: 'float', label: 'Сумма' },
  ],
};

export default function DemoAction() {
  const auth = useAuth();

  return (
    <Action
      auth={auth}
      title="Демо Action — форма в модальном окне"
      trigger={(click) => (
        <Button type="primary" onClick={click}>
          Открыть форму
        </Button>
      )}
      form={Model}
      meta={META}
      object={{}}
      okText="Отправить"
      dismissText="Закрыть"
      callback={() => {
        console.log('Submit callback');
      }}
      action={(values, unlock, close, context) => {
        console.log('Action submit:', values);
        close?.();
        // setTimeout(() => {
        //   unlock?.();
        //   close?.();
        // }, 300);
      }}
    />
  );
}
