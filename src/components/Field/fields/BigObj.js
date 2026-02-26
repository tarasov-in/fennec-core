import React, { useCallback } from 'react';
import _ from 'lodash';
import { Button, Input, Space, Spin } from 'antd';
import { useMetaContext } from '../../../Context';
import { getLocator, getObjectValue, JSXMap } from '../../../core/utils';
import { clean, deleteInArray, unwrap, updateInArray } from '../../../core/utils';
import { useRelationDataByValue } from '../hooks/useRelationData';
import { useRelationDisplay } from '../hooks/useRelationDisplay';
import { Model } from '../../Model';
import { Action } from '../../Action';
import { DropdownAction } from '../DropdownAction';
import { Collection } from '../../Collection';
import { FieldLayout } from '../FieldLayout';
import { ActionsSpace } from '../ActionsSpace';

export function BigObj({ wrapperProps, inputProps, formItem, auth, item, value, onChange, onAfterChange, changed, contextObject, objectName }) {
    const meta = useMetaContext();
    const { data, setData, loading, setLoading, by, defaultQueryParams } = useRelationDataByValue({ item, auth, changed, value });
    const { property, itemByProperty, label: display, labelString: displayString, suffix } = useRelationDisplay({ item, meta, data });

    const cAction = (values, unlock, close) => {
        const { selected } = values;
        if (selected) {
            const h = _.head(selected);
            onChange(property(item, h), item, h);
        }
        close();
    };

    const cTrigger = useCallback((click) => (
        <Button
            onClick={click}
            type="default"
            size={item?.size || "middle"}
            disabled={item?.view?.disabled || loading}
        >
            <i className="fa fa-search" style={{ fontSize: "12px" }} />
        </Button>
    ), [item, loading]);

    const cName = (item && _.get(item, "relation.reference.object")) ? getObjectValue(item, "relation.reference.object") : undefined;
    const cSource = item?.source || item?.relation?.reference?.url || item?.relation?.reference?.source;
    const cContextFilters = useCallback(
        () => defaultQueryParams(item.queryFilter || _.get(item, "relation.reference.queryFilter") || _.get(item, "relation.reference.filter")),
        [item, defaultQueryParams]
    );
    const cFilters = useCallback(() => {
        const uif = _.get(item, "relation.uiFilter");
        if (uif) return uif();
        return meta[getObjectValue(item, "relation.reference.object")]?.properties?.map(e => ({ ...e, sort: true, filter: true }));
    }, [meta, item]);

    const cRender = useCallback((auth, _item, value, onChange) => (
        <Collection
            count={_item?.count}
            floatingFilter={item?.floatingFilter || item?.relation?.floatingFilter}
            selection="radio"
            value={value}
            onChange={onChange}
            auth={auth}
            objectName={objectName}
            contextObject={contextObject}
            name={cName}
            source={cSource}
            contextFilters={cContextFilters}
            filters={cFilters}
            render={(items, { onSelection, isSelected, loading }) => (
                <div>
                    {(value?.filter(e => !!e && items.filter(c => c.ID === e.ID).length === 0).length > 0) && (
                        <div>
                            <div style={{ fontWeight: "lighter" }}>Сейчас выбрано</div>
                            {JSXMap(value, (i, idx) => <div key={i?.ID ?? idx}>{display(item, i)}</div>)}
                            <div style={{ fontWeight: "lighter", paddingTop: "10px" }}>Можно выбрать из</div>
                        </div>
                    )}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <Spin spinning={loading} style={{ paddingTop: "15px", paddingBottom: "15px" }} />
                        {JSXMap(items, (o, oidx) => (
                            <div
                                key={o?.ID ?? oidx}
                                onClick={(e) => { e.stopPropagation(); onSelection(o); }}
                                className={`bg ${isSelected(o) ? "bg-blue dark-3" : "bg-grey-hover light"} pointer`}
                                style={{ textAlign: "left" }}
                            >
                                {display(item, o)}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            size="small"
        />
    ), [item, objectName, contextObject, cName, cSource, cContextFilters, cFilters, display]);

    const RenderActions = useCallback(() => {
        if (!item?.actions) return null;
        const values = clean(unwrap(item?.actions(value, item, meta, contextObject)));
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
                    label: (obj) => display(item, obj),
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
                    label={(obj) => display(item, obj)}
                    itemByProperty={(val) => itemByProperty(item, val)}
                    apply={(obj) => onChange(property(item, obj), item, obj)}
                    {...e}
                />
            );
        });
    }, [item, data, loading, value, meta, contextObject, objectName]);

    const RenderDropdownActions = useCallback(() => {
        if (!item?.dropdownActions) return null;
        const values = clean(unwrap(item?.dropdownActions(value, item, meta, contextObject)));
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
                    label: (obj) => display(item, obj),
                    itemByProperty: (val) => itemByProperty(item, val),
                    apply: (obj) => onChange(property(item, obj), item, obj),
                    ...e
                }))}
            />
        );
    }, [item, data, loading, value, meta, contextObject, objectName]);

    const clear = (str) => {
        if (!str) onChange(undefined, item, undefined);
    };

    return (
        <FieldLayout formItem={formItem} item={item} style={item?.fieldLayoutStyle || { width: "100%" }}>
            <Space.Compact style={{ width: '100%' }} {...wrapperProps}>
                <Input
                    data-locator={getLocator(item?.name || objectName, itemByProperty(item, value))}
                    suffix={loading ? <Spin size="small" /> : suffix(item, itemByProperty(item, value))}
                    size={item?.size || "middle"}
                    allowClear
                    style={{ width: "100%" }}
                    onChange={(e) => clear(e.target.value)}
                    value={displayString(item, itemByProperty(item, value))}
                    disabled={item?.view?.disabled || loading}
                    {...inputProps}
                    {...item?.inputProps}
                />
                <Action
                    title={
                        <div>
                            <div style={{ fontSize: "12px", fontStyle: "italic", color: "rgba(0, 0, 0, 0.45)" }}>Выберите элемент</div>
                            {item?.label && <div>{item?.label}</div>}
                        </div>
                    }
                    auth={auth}
                    action={cAction}
                    okText="Выбрать"
                    locator={item?.name || objectName}
                    object={{ selected: [itemByProperty(item, value)] }}
                    modal={item.modal || { width: "600px" }}
                    form={Model}
                    meta={[{ type: "func", name: "selected", count: item?.count, render: cRender }]}
                    mode="func"
                    trigger={cTrigger}
                />
                {item?.actions && <>{RenderActions()}</>}
                {item?.dropdownActions && <>{RenderDropdownActions()}</>}
            </Space.Compact>
        </FieldLayout>
    );
}
