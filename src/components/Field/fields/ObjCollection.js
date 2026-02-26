import React, { useCallback, useState } from 'react';
import _ from 'lodash';
import { Button, Space, Spin } from 'antd';
import { useMetaContext } from '../../../Context';
import { getObjectValue, JSXMap } from '../../../core/utils';
import { QueryDetail, QueryOrder, QueryParam } from '../../../core/query';
import { useDependenceBy } from '../hooks/useRelationData';
import { useRelationDisplay } from '../hooks/useRelationDisplay';
import { Model } from '../../Model';
import { Action } from '../../Action';
import { Collection } from '../../Collection';
import { FieldLayout } from '../FieldLayout';

export function ObjCollection({ wrapperProps, inputProps, formItem, auth, item, value, onChange, onAfterChange, changed, contextObject, objectName }) {
    const [loading, setLoading] = useState(false);
    const meta = useMetaContext();
    const by = useDependenceBy(changed);
    const defaultQueryParams = useCallback((filter) => {
        const _dependence = (item.dependence?.mode === "server" && item.dependence?.field && by(item))
            ? [QueryParam(`w-${item.dependence?.field}`, by(item))]
            : [];
        if (!filter) return [QueryDetail("none"), QueryOrder("ID", "ASC"), ..._dependence];
        if (_.isArray(filter)) return [...filter, ..._dependence];
        return [..._dependence];
    }, [item?.dependence, changed, by]);

    const { label: display, labelString: displayString, suffix } = useRelationDisplay({ item, meta, data: [] });

    const cAction = (values, unlock, close) => {
        const { selected } = values;
        if (selected) onChange(selected, item);
        close();
    };

    const cTrigger = useCallback((click) => (
        <Button
            style={{ borderLeft: "none" }}
            onClick={click}
            type="default"
            size={item?.size || "middle"}
            disabled={item?.view?.disabled || loading}
            aria-label="Выбрать"
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
            selection="multiselect"
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

    return (
        <FieldLayout formItem={formItem} item={item} style={item?.fieldLayoutStyle || { width: "100%" }}>
            <Space.Compact style={{ width: '100%' }} {...wrapperProps}>
                <div style={{ width: "100%", border: "1px solid #d9d9d9", borderRadius: "6px 0 0 6px" }}>
                    {JSXMap(value, (i, idx) => <div key={i?.ID ?? idx}>{display(item, i)}</div>)}
                </div>
                <Action
                    title={
                        <div>
                            <div style={{ fontSize: "12px", fontStyle: "italic", color: "rgba(0, 0, 0, 0.45)" }}>Выберите элементы</div>
                            {item?.label && <div>{item?.label}</div>}
                        </div>
                    }
                    auth={auth}
                    action={cAction}
                    okText="Выбрать"
                    locator={item?.name || objectName}
                    object={{ selected: value }}
                    modal={item.modal || { width: "600px" }}
                    form={Model}
                    meta={[{ type: "func", name: "selected", count: item?.count, render: cRender }]}
                    mode="func"
                    trigger={cTrigger}
                />
            </Space.Compact>
        </FieldLayout>
    );
}
