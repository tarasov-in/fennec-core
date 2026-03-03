import React, { useState } from 'react';
import { Tabs, Card, Typography } from 'antd';
import { FormOutlined, UnorderedListOutlined, ThunderboltOutlined, MobileOutlined } from '@ant-design/icons';
import DemoAction from './demos/DemoAction';
import DemoCollection from './demos/DemoCollection';
import DemoCollectionMobile from './demos/DemoCollectionMobile';
import DemoModelForm from './demos/DemoModelForm';

const { Title, Paragraph } = Typography;

export default function App() {
  
  React.useEffect(() => {
    window.addEventListener('popstate', function (e) {
      if (e.state && e.state.cb && window.historyCallbackFunctions && window.historyCallbackFunctions[e.state.cb]) {
        window.historyCallbackFunctions[e.state.cb].apply(this, arguments);
      }
    }, false);
  }, []);

  const [key, setKey] = useState('1');
  const items = [
    {
      key: '1',
      label: (
        <span>
          <FormOutlined /> Форма (Model + Field)
        </span>
      ),
      children: (
        <Card>
          <Title level={5}>Компоненты Model и Field</Title>
          <Paragraph type="secondary">
            Форма на основе мета-описания: поля строки, числа, даты, чекбокса.
          </Paragraph>
          <DemoModelForm />
        </Card>
      ),
    },
    {
      key: '2',
      label: (
        <span>
          <ThunderboltOutlined /> Action (модальное окно)
        </span>
      ),
      children: (
        <Card>
          <Title level={5}>Компонент Action</Title>
          <Paragraph type="secondary">
            Кнопка открывает модальное окно с формой (Model). Отправка через callback без бэкенда.
          </Paragraph>
          <DemoAction />
        </Card>
      ),
    },
    {
      key: '3',
      label: (
        <span>
          <UnorderedListOutlined /> Collection
        </span>
      ),
      children: (
        <Card>
          <Title level={5}>Компонент Collection</Title>
          <Paragraph type="secondary">
            Список с фильтрами, сортировкой и пагинацией. Данные из мок-API.
          </Paragraph>
          <DemoCollection />
        </Card>
      ),
    },
    {
      key: '4',
      label: (
        <span>
          <MobileOutlined /> Collection (antd-mobile)
        </span>
      ),
      children: (
        <Card>
          <Title level={5}>Collection с адаптером antd-mobile</Title>
          <Paragraph type="secondary">
            Тот же список, но через адаптер antd-mobile: List вместо таблицы, Popup для фильтра, мобильные компоненты.
          </Paragraph>
          <DemoCollectionMobile />
        </Card>
      ),
    },
  ];
  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <Title level={3} style={{ marginBottom: 8 }}>
        Fennec Core — демо компонентов
      </Title>
      <Paragraph type="secondary" style={{ marginBottom: 24 }}>
        Проверка работы компонентов из <code>src/components</code> перед публикацией библиотеки.
      </Paragraph>
      <Tabs activeKey={key} onChange={setKey} items={items} />
    </div>
  );
}
