import React from 'react';
import { Table } from 'antd';
import { useAuth } from 'fennec-core';
import { Collection } from 'fennec-core/components/Collection';

export default function DemoCollection() {
  const auth = useAuth();

  const columns = [
    { title: 'ID', dataIndex: 'ID', key: 'ID', width: 80 },
    { title: 'Название', dataIndex: 'Title', key: 'Title' },
    { title: 'Цена', dataIndex: 'Price', key: 'Price', width: 120 },
  ];

  return (
    <Collection
      auth={auth}
      name="product"
      filters={() => [
        { name: 'Title', label: 'Название', type: 'string', filter: true, sort: true },
        { name: 'Price', label: 'Цена', type: 'float', filter: true, sort: true },
      ]}
      floatingFilter
      allowFullscreen
      render={(collection, contextProps) => (
        <Table
          rowKey="ID"
          size="small"
          columns={columns}
          dataSource={collection}
          pagination={false}
        />
      )}
    />
  );
}
