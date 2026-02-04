import React from 'react'
import { Table as AntTable, List as AntList } from 'antd'

/**
 * Table компонент - обертка над Ant Design Table
 */
export function Table({
  dataSource,
  columns,
  loading,
  pagination,
  onChange,
  rowKey = 'ID',
  rowSelection,
  ...rest
}) {
  return (
    <AntTable
      dataSource={dataSource}
      columns={columns}
      loading={loading}
      pagination={pagination}
      onChange={onChange}
      rowKey={rowKey}
      rowSelection={rowSelection}
      {...rest}
    />
  )
}

/**
 * List компонент - обертка над Ant Design List
 */
export function List({
  dataSource,
  renderItem,
  loading,
  pagination,
  ...rest
}) {
  return (
    <AntList
      dataSource={dataSource}
      renderItem={renderItem}
      loading={loading}
      pagination={pagination}
      {...rest}
    />
  )
}
