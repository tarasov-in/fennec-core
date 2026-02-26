import React, { useState, useEffect } from 'react';
import { Slider } from 'antd';
import { getLocator } from '../../../core/utils';
import { FieldLayout } from '../FieldLayout';

export function FloatSlider({ wrapperProps, inputProps, formItem, auth, item, value, onChange, onAfterChange }) {
    const [val, setVal] = useState();
    useEffect(() => setVal(value), [value]);
    const xstep = item?.step || 1;
    const xmin = item?.min || item?.func?.min || 0;
    const xmax = item?.max || item?.func?.max || 100000;
    return (
        <FieldLayout formItem={formItem} item={item} style={item?.fieldLayoutStyle || { width: "100%" }}>
            <div {...wrapperProps}>
                <Slider
                    data-locator={getLocator(item?.name)}
                    disabled={item?.view?.disabled}
                    min={xmin}
                    max={xmax}
                    step={xstep}
                    value={item.realtime ? value : val}
                    onChange={item.realtime ? onChange : setVal}
                    onAfterChange={item.realtime ? onAfterChange : onChange}
                    {...inputProps}
                    {...item?.inputProps}
                />
            </div>
        </FieldLayout>
    );
}

export function IntegerSlider({ wrapperProps, inputProps, formItem, auth, item, value, onChange, onAfterChange }) {
    const [val, setVal] = useState();
    useEffect(() => setVal(value), [value]);
    const xstep = item?.step || 1;
    const xmin = item?.min || item?.func?.min || 0;
    const xmax = item?.max || item?.func?.max || 100000;
    return (
        <FieldLayout formItem={formItem} item={item} style={item?.fieldLayoutStyle || { width: "100%" }}>
            <div {...wrapperProps}>
                <Slider
                    data-locator={getLocator(item?.name)}
                    disabled={item?.view?.disabled}
                    min={xmin}
                    max={xmax}
                    step={xstep}
                    value={item.realtime ? value : val}
                    onChange={item.realtime ? onChange : setVal}
                    onAfterChange={item.realtime ? onAfterChange : onChange}
                    {...inputProps}
                    {...item?.inputProps}
                />
            </div>
        </FieldLayout>
    );
}
