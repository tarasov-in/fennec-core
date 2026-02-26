import React, { useCallback } from 'react';
import _ from 'lodash';
import { Button, Space } from 'antd';
import { useMetaContext } from '../../Context';
import { clean, deleteInArray, getDisplay, getLocator, getObjectValue, unwrap, updateInArray } from '../../core/utils';
import { Action } from '../Action';
import { DropdownAction } from './DropdownAction';

export function ActionsSpace(props) {
    const {
        className,
        children,
        item,
        data,
        setData,
        objectName,
        auth,
        contextObject,
        value,
        onChange,
        loading,
        setLoading,
        property: _property,
        label: _label,
        itemByProperty: _itemByProperty
    } = props;
    const meta = useMetaContext();

    const property = _property || ((item, value) => {
        if (item?.type === "object" || item?.type === "document") {
            if (item && _.get(item, "relation.reference.property") && value) {
                return value[item.relation.reference.property];
            }
            if (value) return value.ID;
        } else {
            return value;
        }
        return undefined;
    });

    const itemByProperty = _itemByProperty || ((item, value) => {
        if (item?.type === "object" || item?.type === "document") {
            if (_.get(item, "relation.reference.property")) {
                return data?.find(e => e[item.relation.reference.property] === value);
            }
            if (data?.length) return data.find(e => e.ID === value);
        } else {
            return value;
        }
    });

    const label = _label || ((item, value) => {
        if (item && value) {
            if (item.display && _.isFunction(item.display)) return item.display(value);
            if (item.relation?.display && _.isFunction(item.relation.display)) return item.relation.display(value);
            if (item?.type === "object" || item?.type === "document") {
                const fieldMeta = meta[getObjectValue(item, "relation.reference.object")];
                const _display = (item?.relation?.display?.fields ? item?.relation?.display : undefined)
                    || (fieldMeta?.display?.fields ? fieldMeta?.display : undefined);
                return getDisplay(value, _display, fieldMeta, meta);
            }
            return "" + value;
        }
        return "";
    });

    const labelString = (item, value) => {
        if (item && value) {
            if (item.displayString && _.isFunction(item.displayString)) return item.displayString(value);
            if (item.relation?.displayString && _.isFunction(item.relation.displayString)) return item.relation.displayString(value);
            if (item?.type === "object" || item?.type === "document") {
                const labeldisplay = label(item, value);
                if (_.isString(labeldisplay)) return labeldisplay;
                const fieldMeta = meta[getObjectValue(item, "relation.reference.object")];
                const _display = (item?.relation?.display?.fields ? item?.relation?.display : undefined)
                    || (fieldMeta?.display?.fields ? fieldMeta?.display : undefined);
                return getDisplay(value, _display, fieldMeta, meta);
            }
            return "" + value;
        }
        return "";
    };

    const RenderActions = useCallback(() => {
        if (!item?.actions) return null;
        const values = clean(unwrap(item?.actions(value, item, meta)));
        if (!values?.length) return null;
        return values?.map((e, idx) => {
            if (_.isFunction(e)) {
                return e({
                    collection: data,
                    setCollection: setData,
                    objectName,
                    contextObject,
                    setCollectionItem: (item, first) => setData?.(o => updateInArray(o, item, first)),
                    removeCollectionItem: (item) => setData?.(o => deleteInArray(o, item)),
                    lock: () => setLoading?.(true),
                    unlock: () => setLoading?.(false),
                    loading,
                    property: (obj) => property(item, obj),
                    label: (obj) => label(item, obj),
                    itemByProperty: (val) => itemByProperty(item, val),
                    apply: (obj) => onChange(value, item, itemByProperty(item, value)),
                }, idx);
            }
            return (
                <Action
                    key={e.key || idx}
                    auth={auth}
                    disabled={loading || item?.view?.disabled}
                    item={item}
                    locator={item?.name || objectName}
                    object={e.object || itemByProperty(item, value)}
                    objectName={objectName}
                    contextObject={contextObject}
                    collection={data}
                    setCollection={setData}
                    property={(obj) => property(item, obj)}
                    label={(obj) => label(item, obj)}
                    itemByProperty={(val) => itemByProperty(item, val)}
                    apply={(obj) => onChange(property(item, obj), item, obj)}
                    lock={() => setLoading?.(true)}
                    unlock={() => setLoading?.(false)}
                    {...e}
                />
            );
        });
    }, [item, data, loading, value, meta, contextObject, objectName]);

    const RenderDropdownActions = useCallback(() => {
        if (!item?.dropdownActions) return null;
        const values = clean(unwrap(item?.dropdownActions(value, item, meta)));
        if (!values?.length) return null;
        return (
            <DropdownAction
                button={() => (
                    <Button type="default" aria-label="Дополнительные действия">
                        <i className="fa fa-ellipsis-v" />
                    </Button>
                )}
                locator={item?.name || objectName}
                object={itemByProperty(item, value)}
                items={values?.map((e, idx) => ({
                    key: e.key || idx,
                    auth,
                    disabled: loading || item?.view?.disabled,
                    item,
                    locator: item?.name || objectName,
                    object: e.object || itemByProperty(item, value),
                    objectName,
                    contextObject,
                    collection: data,
                    setCollection: setData,
                    property: (obj) => property(item, obj),
                    label: (obj) => label(item, obj),
                    itemByProperty: (val) => itemByProperty(item, val),
                    apply: (obj) => onChange(property(item, obj), item, obj),
                    lock: () => setLoading?.(true),
                    unlock: () => setLoading?.(false),
                    ...e
                }))}
            />
        );
    }, [item, data, loading, value, meta, contextObject, objectName]);

    return (
        <Space.Compact className={className} style={{ width: '100%' }}>
            {children}
            {item?.actions && <>{RenderActions()}</>}
            {item?.dropdownActions && <>{RenderDropdownActions()}</>}
        </Space.Compact>
    );
}
