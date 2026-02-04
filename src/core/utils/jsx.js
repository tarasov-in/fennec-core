/**
 * JSX utilities for core components
 * Used by CollectionRenderer and others
 */
import React from 'react'

export function JSXMap(array, render) {
  if (!array) return React.createElement(React.Fragment)
  return array.map((e, idx) => render(e, idx))
}
