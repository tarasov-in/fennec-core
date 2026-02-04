/**
 * DropdownAction - обёртка действия в выпадающее меню.
 * Использует Action с теми же props (минимальная реализация).
 */
import React from 'react'
import { Action } from './Action/Action'

export function DropdownAction({ auth, object, action, setObject, remove, ...rest }) {
  return (
    <Action
      auth={auth}
      object={object}
      action={action}
      setObject={setObject}
      remove={remove}
      {...rest}
    />
  )
}

export default DropdownAction
