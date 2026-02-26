import React, { useMemo } from 'react';
import { DatePicker, TimePicker } from 'antd';
import locale from 'antd/es/date-picker/locale/ru_RU';
import dayjs from 'dayjs';
import { getLocator } from '../../../core/utils';
import { FieldLayout } from '../FieldLayout';

export function RangeTime({ wrapperProps, inputProps, formItem, auth, item, value, onChange, onAfterChange }) {
    const rangeValue = useMemo(() => {
        if (value?.[0] && value?.[1]) return [dayjs(value[0]), dayjs(value[1])];
        return [];
    }, [value]);
    return (
        <FieldLayout formItem={formItem} item={item} style={item?.fieldLayoutStyle || { width: "100%" }}>
            <div {...wrapperProps}>
                <TimePicker.RangePicker
                    data-locator={getLocator(item?.name)}
                    changeOnBlur
                    value={rangeValue}
                    onChange={onChange}
                    type="time"
                    format="HH:mm:ss"
                    locale={locale}
                    style={{ width: "100%" }}
                    {...inputProps}
                    {...item?.inputProps}
                />
            </div>
        </FieldLayout>
    );
}

export function RangeDate({ wrapperProps, inputProps, formItem, auth, item, value, onChange, onAfterChange }) {
    const rangeValue = useMemo(() => {
        if (value?.[0] && value?.[1]) return [dayjs(value[0]), dayjs(value[1])];
        return [];
    }, [value]);
    return (
        <FieldLayout formItem={formItem} item={item} style={item?.fieldLayoutStyle || { width: "100%" }}>
            <div {...wrapperProps}>
                <DatePicker.RangePicker
                    data-locator={getLocator(item?.name)}
                    changeOnBlur
                    value={rangeValue}
                    onChange={onChange}
                    format="DD.MM.YYYY"
                    locale={locale}
                    style={{ width: "100%" }}
                    {...inputProps}
                    {...item?.inputProps}
                />
            </div>
        </FieldLayout>
    );
}

export function RangeDateTime({ wrapperProps, inputProps, formItem, auth, item, value, onChange, onAfterChange }) {
    const rangeValue = useMemo(() => {
        if (value?.[0] && value?.[1]) return [dayjs(value[0]), dayjs(value[1])];
        return [];
    }, [value]);
    return (
        <FieldLayout formItem={formItem} item={item} style={item?.fieldLayoutStyle || { width: "100%" }}>
            <div {...wrapperProps}>
                <DatePicker.RangePicker
                    data-locator={getLocator(item?.name)}
                    changeOnBlur
                    showTime={{ format: 'HH:mm' }}
                    value={rangeValue}
                    onChange={onChange}
                    format="DD.MM.YYYY HH:mm"
                    locale={locale}
                    style={{ width: "100%" }}
                    {...inputProps}
                    {...item?.inputProps}
                />
            </div>
        </FieldLayout>
    );
}

export function RangeFloat({ wrapperProps, inputProps, formItem, auth, item, value, onChange, onAfterChange }) {
    const [val, setVal] = React.useState();
    React.useEffect(() => setVal(value), [value]);
    const xstep = item?.step || 1;
    const xmin = item?.min ?? item?.func?.min ?? 0;
    const xmax = (item?.max ?? item?.func?.max ?? 100000) + xstep;
    const def = [(xmin - (xmin % xstep)), (xmax + (xstep - xmax % xstep))];
    return (
        <FieldLayout formItem={formItem} item={item} style={item?.fieldLayoutStyle || { width: "100%" }}>
            <div {...wrapperProps}>
                <Slider
                    data-locator={getLocator(item?.name)}
                    range
                    defaultValue={def}
                    min={xmin - (xmin % xstep)}
                    max={xmax + (xstep - xmax % xstep)}
                    step={xstep}
                    included
                    value={val || def}
                    onChange={setVal}
                    onAfterChange={item.realtime ? onAfterChange : onChange}
                    {...inputProps}
                    {...item?.inputProps}
                />
            </div>
        </FieldLayout>
    );
}

export function RangeInteger({ wrapperProps, inputProps, formItem, auth, item, value, onChange, onAfterChange }) {
    const [val, setVal] = React.useState();
    React.useEffect(() => setVal(value), [value]);
    const xstep = item?.step || 1;
    const xmin = item?.min ?? item?.func?.min ?? 0;
    const xmax = (item?.max ?? item?.func?.max ?? 100000) + xstep;
    const def = [(xmin - (xmin % xstep)), (xmax + (xstep - xmax % xstep))];
    return (
        <FieldLayout formItem={formItem} item={item} style={item?.fieldLayoutStyle || { width: "100%" }}>
            <div {...wrapperProps}>
                <Slider
                    data-locator={getLocator(item?.name)}
                    range
                    defaultValue={def}
                    min={xmin - (xmin % xstep)}
                    max={xmax + (xstep - xmax % xstep)}
                    step={xstep}
                    value={val}
                    included
                    onChange={item.realtime ? onChange : setVal}
                    onAfterChange={item.realtime ? onAfterChange : onChange}
                    {...inputProps}
                    {...item?.inputProps}
                />
            </div>
        </FieldLayout>
    );
}
