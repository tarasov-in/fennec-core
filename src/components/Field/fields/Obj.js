import React, { useCallback } from 'react';
import { Button, Select, Space } from 'antd';
import _ from 'lodash';
import { useMetaContext } from '../../../Context';
import { clean, deleteInArray, getLocator, unwrap, updateInArray } from '../../../core/utils';
import { useRelationData } from '../hooks/useRelationData';
import { useRelationDisplay } from '../hooks/useRelationDisplay';
import { Action } from '../../Action';
import { DropdownAction } from '../DropdownAction';
import { FieldLayout } from '../FieldLayout';
import { ActionsSpace } from '../ActionsSpace';

const { Option } = Select;

export function Obj({ wrapperProps, inputProps, formItem, auth, item, value, onChange, onAfterChange, changed, contextObject, objectName }) {
    const [loading, setLoading] = React.useState(false);
    const meta = useMetaContext();
    const { data, setData, by, defaultQueryParams } = useRelationData({ item, auth, changed });
    const { property, itemByProperty, label, labelString } = useRelationDisplay({ item, meta, data });

    const elements = useCallback((dataList) => {
        if (item.dependence?.mode !== "server" && item.dependence) {
            if (item.dependence.field && by(item)) {
                return dataList?.filter(e => _.get(e, item.dependence.field) === by(item))?.map(i => (
                    <Option
                        data-locator={getLocator(item?.name || objectName, i)}
                        key={property(item, i)}
                        value={property(item, i)}
                        label={labelString(item, i)}
                    >
                        {label(item, i)}
                    </Option>
                ));
            }
        } else {
            return dataList?.map(i => (
                <Option
                    data-locator={getLocator(item?.name || objectName, i)}
                    key={property(item, i)}
                    value={property(item, i)}
                    label={labelString(item, i)}
                >
                    {label(item, i)}
                </Option>
            ));
        }
    }, [value, changed, item, objectName, data, by, property, itemByProperty, label, labelString]);

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
                    setCollectionItem: (it, first) => setData(o => updateInArray(o, it, first)),
                    removeCollectionItem: (it) => setData(o => deleteInArray(o, it)),
                    lock: () => setLoading(true),
                    unlock: () => setLoading(false),
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
                    mode="button"
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
                    mode: "MenuItem",
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
                    ...e
                }))}
            />
        );
    }, [item, data, loading, value, meta, contextObject, objectName]);

    return (
        <FieldLayout formItem={formItem} item={item} style={item?.fieldLayoutStyle || { width: "100%" }}>
            <Space.Compact style={{ width: '100%' }} {...wrapperProps}>
                <Select
                    showSearch
                    data-locator={getLocator(item?.name || objectName, itemByProperty(item, value))}
                    size={item?.size || "middle"}
                    value={value}
                    onChange={(e) => onChange(e, item, itemByProperty(item, e))}
                    style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%" }}
                    allowClear
                    disabled={item?.view?.disabled}
                    filterOption={(input, option) => option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    {...inputProps}
                    {...item?.inputProps}
                >
                    {elements(data)}
                </Select>
                {item?.actions && <>{RenderActions()}</>}
                {item?.dropdownActions && <>{RenderDropdownActions()}</>}
            </Space.Compact>
        </FieldLayout>
    );
}
