import React, { useState } from 'react';
import { Input, Checkbox, DatePicker, InputNumber, TimePicker, Upload } from 'antd';
import locale from 'antd/es/date-picker/locale/ru_RU';
import dayjs from 'dayjs';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { getLocator } from '../../../core/utils';
import { FieldLayout } from '../FieldLayout';
import { ActionsSpace } from '../ActionsSpace';

const { TextArea } = Input;

export function DateTime({ wrapperProps, inputProps, formItem, auth, item, value, onChange, onAfterChange }) {
    const [loading, setLoading] = useState(false);
    return (
        <FieldLayout formItem={formItem} item={item} style={item?.fieldLayoutStyle || { width: "100%" }}>
            <ActionsSpace auth={auth} item={item} value={value} onChange={onChange} loading={loading} setLoading={setLoading} {...wrapperProps}>
                <DatePicker
                    data-locator={getLocator(item?.name)}
                    changeOnBlur
                    value={value ? dayjs(value) : undefined}
                    onChange={onChange}
                    showTime
                    format="DD.MM.YYYY HH:mm"
                    locale={locale}
                    style={{ width: "100%" }}
                    disabled={item?.view?.disabled || loading}
                    {...inputProps}
                    {...item?.inputProps}
                />
            </ActionsSpace>
        </FieldLayout>
    );
}

export function Date({ wrapperProps, inputProps, formItem, auth, item, value, onChange, onAfterChange }) {
    const [loading, setLoading] = useState(false);
    return (
        <FieldLayout formItem={formItem} item={item} style={item?.fieldLayoutStyle || { width: "100%" }}>
            <ActionsSpace auth={auth} item={item} value={value} onChange={onChange} loading={loading} setLoading={setLoading} {...wrapperProps}>
                <DatePicker
                    data-locator={getLocator(item?.name)}
                    changeOnBlur
                    value={value ? dayjs(value) : undefined}
                    onChange={onChange}
                    format="DD.MM.YYYY"
                    locale={locale}
                    style={{ width: "100%" }}
                    disabled={item?.view?.disabled || loading}
                    {...inputProps}
                    {...item?.inputProps}
                />
            </ActionsSpace>
        </FieldLayout>
    );
}

export function Time({ wrapperProps, inputProps, formItem, auth, item, value, onChange, onAfterChange }) {
    const [loading, setLoading] = useState(false);
    return (
        <FieldLayout formItem={formItem} item={item} style={item?.fieldLayoutStyle || { width: "100%" }}>
            <ActionsSpace auth={auth} item={item} value={value} onChange={onChange} loading={loading} setLoading={setLoading} {...wrapperProps}>
                <TimePicker
                    data-locator={getLocator(item?.name)}
                    changeOnBlur
                    value={value ? dayjs(value) : undefined}
                    onChange={onChange}
                    format="HH:mm:ss"
                    locale={locale}
                    style={{ width: "100%" }}
                    disabled={item?.view?.disabled || loading}
                    {...inputProps}
                    {...item?.inputProps}
                />
            </ActionsSpace>
        </FieldLayout>
    );
}

export function Boolean({ wrapperProps, inputProps, formItem, auth, item, value, onChange, onAfterChange }) {
    const change = (e) => onChange(e.target.checked);
    return (
        <FieldLayout formItem={formItem} item={item}>
            <Checkbox
                data-locator={getLocator(item?.name)}
                checked={value}
                onChange={change}
                disabled={item?.view?.disabled ?? false}
                {...inputProps}
                {...item?.inputProps}
            >
                {item.label}
            </Checkbox>
        </FieldLayout>
    );
}

export function Float({ wrapperProps, inputProps, formItem, auth, item, value, onChange, onAfterChange }) {
    const [loading, setLoading] = useState(false);
    return (
        <FieldLayout formItem={formItem} item={item} style={item?.fieldLayoutStyle || { width: "100%" }}>
            <ActionsSpace auth={auth} item={item} value={value} onChange={onChange} loading={loading} setLoading={setLoading} {...wrapperProps}>
                <InputNumber
                    data-locator={getLocator(item?.name)}
                    value={value}
                    onChange={onChange}
                    style={{ width: "100%" }}
                    min={item?.min || item?.validators?.min}
                    max={item?.max || item?.validators?.max}
                    disabled={item?.view?.disabled || loading}
                    {...inputProps}
                    {...item?.inputProps}
                />
            </ActionsSpace>
        </FieldLayout>
    );
}

export function Integer({ wrapperProps, inputProps, formItem, auth, item, value, onChange, onAfterChange }) {
    const [loading, setLoading] = useState(false);
    return (
        <FieldLayout formItem={formItem} item={item} style={item?.fieldLayoutStyle || { width: "100%" }}>
            <ActionsSpace auth={auth} item={item} value={value} onChange={onChange} loading={loading} setLoading={setLoading} {...wrapperProps}>
                <InputNumber
                    data-locator={getLocator(item?.name)}
                    value={value}
                    onChange={onChange}
                    style={{ width: "100%" }}
                    min={item?.min || item?.validators?.min}
                    max={item?.max || item?.validators?.max}
                    disabled={item?.view?.disabled || loading}
                    {...inputProps}
                    {...item?.inputProps}
                />
            </ActionsSpace>
        </FieldLayout>
    );
}

export function String({ wrapperProps, inputProps, formItem, auth, item, value, onChange, onAfterChange }) {
    const [loading, setLoading] = useState(false);
    return (
        <FieldLayout formItem={formItem} item={item} style={item?.fieldLayoutStyle || { width: "100%" }}>
            <ActionsSpace auth={auth} item={item} value={value} onChange={onChange} loading={loading} setLoading={setLoading} {...wrapperProps}>
                <Input
                    data-locator={getLocator(item?.name)}
                    size={item?.size || "middle"}
                    allowClear
                    value={value}
                    onChange={(v) => onChange(v.target.value)}
                    style={{ width: "100%" }}
                    disabled={item?.view?.disabled || loading}
                    {...inputProps}
                    {...item?.inputProps}
                />
            </ActionsSpace>
        </FieldLayout>
    );
}

export function Password({ wrapperProps, inputProps, formItem, auth, item, value, onChange, onAfterChange }) {
    const [loading, setLoading] = useState(false);
    return (
        <FieldLayout formItem={formItem} item={item} style={item?.fieldLayoutStyle || { width: "100%" }}>
            <ActionsSpace auth={auth} item={item} value={value} onChange={onChange} loading={loading} setLoading={setLoading} {...wrapperProps}>
                <Input.Password
                    data-locator={getLocator(item?.name)}
                    allowClear
                    value={value}
                    onChange={(v) => onChange(v.target.value)}
                    style={{ width: "100%" }}
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    disabled={item?.view?.disabled || loading}
                    {...inputProps}
                    {...item?.inputProps}
                />
            </ActionsSpace>
        </FieldLayout>
    );
}

export function MultilineText({ wrapperProps, inputProps, formItem, auth, item, value, onChange, onAfterChange }) {
    const [loading, setLoading] = useState(false);
    return (
        <FieldLayout formItem={formItem} item={item} style={item?.fieldLayoutStyle || { width: "100%" }}>
            <ActionsSpace auth={auth} item={item} value={value} onChange={onChange} loading={loading} setLoading={setLoading} {...wrapperProps}>
                <TextArea
                    data-locator={getLocator(item?.name)}
                    rows={6}
                    allowClear
                    value={value}
                    onChange={(v) => onChange(v.target.value)}
                    style={{ width: "100%" }}
                    disabled={item?.view?.disabled || loading}
                    {...inputProps}
                    {...item?.inputProps}
                />
            </ActionsSpace>
        </FieldLayout>
    );
}

export function Image({ wrapperProps, inputProps, formItem, auth, item, value, onChange }) {
    return (
        <FieldLayout formItem={formItem} item={item} style={item?.fieldLayoutStyle || { width: "100%" }}>
            <div {...wrapperProps}>
                <Upload
                    maxCount={1}
                    accept="image/*"
                    listType="picture-card"
                    fileList={value ? [{ uid: '-1', name: 'image', status: 'done', url: typeof value === 'string' ? value : value?.url }] : []}
                    beforeUpload={(file) => { onChange?.(file); return false; }}
                    onRemove={() => onChange?.(undefined)}
                    data-locator={getLocator(item?.name)}
                    {...inputProps}
                    {...item?.inputProps}
                />
            </div>
        </FieldLayout>
    );
}

export function Unknown({ wrapperProps, inputProps, formItem, item }) {
    return (
        <FieldLayout formItem={formItem} item={item} style={item?.fieldLayoutStyle || { width: "100%" }}>
            <div key={item.name}>
                <div>{item.label} - {item.name}</div>
                <div>{item.uuid}</div>
            </div>
        </FieldLayout>
    );
}
