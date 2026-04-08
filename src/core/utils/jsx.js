/**
 * JSX utilities for core components
 * Used by CollectionRenderer and others
 */
import React from 'react'
import _ from 'lodash';

export function JSX(render) {
    return render();
}
export function JSXMap(array, render) {
    if (!array) return <React.Fragment></React.Fragment>;
    return array?.map((e, idx) => render(e, idx));
}
export function JSXPathMap(object, path, render) {
    let array = _.get(object, path);
    return JSXMap(array, render);
}
export function JSXIndex(array, index, render) {
    if (!array) return <React.Fragment></React.Fragment>;
    if (!_.isArray(index)) {
        if (array.length < index) return <React.Fragment></React.Fragment>;
        return render(array[index], index);
    } else {
        return index?.map((i, idx) => JSXIndex(array, i, render));
    }
}