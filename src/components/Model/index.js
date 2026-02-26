import React, { useState, useEffect, useMemo, useCallback } from 'react';
import _ from 'lodash';
import { getDisplay, getObjectValue, GetMeta, GetMetaProperties, formItemRules, getObjectDisplay, uncapitalize, contextFilterToObject, getLocator } from '../../core/utils';
import { useFormObserverContext, useMetaContext } from '../../Context';
import { Collection } from '../Collection';
import { QueryFiltersToContextFilters } from '../../core/query';

export function CollectionByProperty(props) {
    const { auth, item, object, linksCompareFunction, linksModelActions, scheme, queryDetail, modelActions, collectionActions } = props;

    const uif = useMemo(() => _.get(item, "relation.uiFilter"), [item]);
    const count = useMemo(() => item?.count || _.get(item, "relation.reference.count") || (() => (20)), [item]);
    const url = useMemo(() => item?.source || getObjectValue(item, "relation.reference.url") || getObjectValue(item, "relation.reference.source"), [item]);
    const n = useMemo(() => getObjectValue(item, "relation.reference.object"), [item]);
    const f = useMemo(() => getObjectValue(item, "name"), [item]);
    const p = useMemo(() => getObjectValue(item, "relation.reference.property"), [item]);
    const queryFilter = useMemo(() => item?.queryFilter || _.get(item, "relation.reference.queryFilter") || _.get(item, "relation.reference.filter"), [item]);

    const floatingFilter = useMemo(() => item?.floatingFilter || _.get(item, "relation.floatingFilter"), [item]);

    const gmeta = useMetaContext();
    const filtersFromMeta = React.useCallback((name) => {
        let prop = [];
        let p = _.get(gmeta[name], "properties");
        if (p) {
            prop = p?.filter(e => _.get(e, "relation.type") !== "one-many")?.map(e => ({ ...e, sort: true, filter: true, func: (e.filterType == "range") ? ["min", "max"] : undefined }))
        }
        return prop;
    }, [gmeta]);
    const schemeProcessing = (scheme) => {
        let tailScheme = undefined
        if (scheme?.length) {
            let headScheme = {}
            tailScheme = []
            for (let i = 0; i < scheme.length; i++) {
                const element = scheme[i].toLowerCase();
                let arr = element.split(".")

                if (arr && arr.length && arr[0]) {
                    headScheme[arr[0]] = true
                    arr.splice(0, 1);
                    if (arr && arr.length) {
                        let c = arr.join(".")
                        tailScheme.push(c)
                    }
                }
            }
            return tailScheme
        }
    }
    const display = useCallback((item, value) => {
        if (item && value) {
            if (item.display && _.isFunction(item.display)) {
                return item.display(value)
            } else if (item.relation && item.relation.display && _.isFunction(item.relation.display)) {
                return item.relation.display(value)
            } else {
                let fieldMeta = gmeta[getObjectValue(item, "relation.reference.object")];
                let _display = ((item?.relation?.display?.fields) ? item?.relation?.display : undefined) || ((fieldMeta?.display?.fields) ? fieldMeta?.display : undefined)
                return getDisplay(value, _display, fieldMeta, gmeta)
            }
        }
        return "";
    }, [gmeta]);

    const queryFiltersToContextFilters = useMemo(() => QueryFiltersToContextFilters(queryFilter), [queryFilter]);
    const FilterFromContextFilter = React.useCallback(() => [
        ((object) ? {
            // action: true,
            // method: "eq",
            name: p,
            value: object.ID
        } : {}),
        ...queryFiltersToContextFilters

    ], [object, p, queryFiltersToContextFilters]);

    const collectionRender = useCallback((context) => (props?.render ? props.render(context) : null), [props?.render]);

    if (!n) return null;
    return (<Collection
        auth={auth}
        name={n}
        source={url}
        count={count}
        field={item}
        fieldName={f}
        contextObject={object}
        contextFilters={FilterFromContextFilter}
        filters={() => (uif) ? uif() : filtersFromMeta(n)}
        floatingFilter={floatingFilter}
        mode="list"
        render={collectionRender}

        linksCompareFunction={linksCompareFunction}
        linksModelActions={linksModelActions}
        scheme={schemeProcessing(scheme)}
        queryDetail={queryDetail || item?.queryDetail}
        modelActions={modelActions}
        collectionActions={collectionActions}
    />)
}

function Frm(props) {
    const { auth, form: formInstance, name, meta, options, object, data, locator, submit, funcStat, contextFilters, links, scheme, linksCompareFunction, contextObject,
        queryDetail,
        modelActions,
        collectionActions,
        render
    } = props;

    const [visible, setVisible] = useState(false);
    const [excludeFields, setExcludeFields] = useState();

    useEffect(() => {
        if (!formInstance) return;
        try {
            formInstance.resetFields();
            if (object && typeof formInstance.setFieldsValue === 'function') formInstance.setFieldsValue(object);
        } catch (_) {
            // form instance may not be connected yet
        }
    }, [object, formInstance])

    useEffect(() => {
        let ctxFlt = contextFilterToObject(contextFilters);
        setExcludeFields(ctxFlt);
    }, [contextFilters]);

    const gmeta = useMetaContext();

    const properties = GetMetaProperties(meta);
    if (!properties) return null;

    const propertiesFiltered = properties?.filter(e => (!e.name || (e.name && e.name.toUpperCase() !== "ID")))?.filter(e => (!e.relation || (e.relation && e.relation.type !== "one-many")));
    let propertiesOneMany = properties?.filter(e => e.relation && e.relation.type === "one-many");
    let tailScheme = undefined;
    if (scheme && !scheme.length) {
        propertiesOneMany = [];
    }
    if (scheme?.length) {
        const headScheme = {};
        tailScheme = [];
        for (let i = 0; i < scheme.length; i++) {
            const element = scheme[i].toLowerCase();
            const arr = element.split(".");
            if (arr && arr.length && arr[0]) {
                headScheme[arr[0]] = true;
                arr.splice(0, 1);
                if (arr && arr.length) {
                    tailScheme.push(arr.join("."));
                }
            }
        }
        const func = linksCompareFunction ? linksCompareFunction : (e) => _.get(e, "name");
        propertiesOneMany = propertiesOneMany?.filter(e => func(e) && (headScheme[func(e)?.toLowerCase()]));
    }

    const [isChangedForm, isChangedField, onValuesChange] = useFormObserverContext();

    const getFormFields = useCallback(() => {
        if (!excludeFields) return [];
        return propertiesFiltered?.filter(e => !(e.name && (excludeFields[e.name?.toLowerCase()] || excludeFields[e.name?.toLowerCase() + "ID"]))) ?? [];
    }, [excludeFields, propertiesFiltered]);

    const getFieldFormItemProps = useCallback((item) => ({
        preserve: (item.hidden) ? "true" : "false",
        hidden: item.hidden,
        name: (item.type !== "object" && item.type !== "document") ? uncapitalize(item?.name) : uncapitalize(item?.name) + "ID",
        label: (item.type !== "bool" && item.type !== "boolean") ? item.label : undefined,
        rules: formItemRules(item),
        "data-locator": getLocator(props?.locator || name || "model", props?.object)
    }), [name, props?.locator, props?.object]);

    const getFieldProps = useCallback((item) => ({
        mode: "model",
        objectName: name,
        contextObject,
        auth,
        formItem: true,
        data,
        item: { ...item, filterType: undefined, func: (funcStat && funcStat[item?.name?.toLowerCase()]) ? funcStat[item?.name?.toLowerCase()] : {} },
        isChanged: isChangedField ? isChangedField((item.type !== "object" && item.type !== "document") ? uncapitalize(item?.name) : uncapitalize(item?.name) + "ID") : undefined
    }), [name, contextObject, auth, data, funcStat, isChangedField]);

    const getFuncRenderArgs = useCallback((item, idx) => ({
        auth,
        item,
        context: { data, object, contextObject, funcStat }
    }), [auth, data, object, contextObject, funcStat]);

    const getCollectionTabProps = useCallback((e, idx) => ({
        auth,
        item: e,
        object,
        linksCompareFunction,
        linksModelActions: links,
        scheme,
        queryDetail,
        modelActions,
        collectionActions
    }), [auth, object, linksCompareFunction, links, scheme, queryDetail, modelActions, collectionActions]);

    const getObjectDisplayValue = useCallback(() => (meta?.name && object ? getObjectDisplay(object, meta.name, gmeta) : ""), [meta?.name, object, gmeta]);

    const getLocatorForModel = useCallback((l, o) => getLocator(l || name || "model", o || object), [name, object]);

    if (!excludeFields) return null;

    const modelContext = {
        form: formInstance || undefined,
        submit,
        initialValues: { ...object },
        options: { ...options, labelAlign: "left", layout: "vertical" },
        propertiesFiltered,
        propertiesOneMany,
        getFormFields,
        getFieldFormItemProps,
        getFieldProps,
        getFuncRenderArgs,
        getCollectionTabProps,
        getObjectDisplayValue,
        getLocator: getLocatorForModel,
        formItemRules,
        uncapitalize,
        meta,
        name,
        auth,
        data,
        contextObject,
        object,
        locator,
        funcStat,
        excludeFields,
        visible,
        setVisible,
        links,
        scheme,
        linksCompareFunction,
        queryDetail,
        modelActions,
        collectionActions,
        isChangedForm,
        isChangedField,
        onValuesChange,
        showHeaderBlock: !!(object && links && links !== "inline" && propertiesOneMany?.length > 0),
        showTabsBlock: !!(object?.ID && propertiesOneMany?.length > 0 && links)
    };

    return render ? render(modelContext) : null;
}

export function Model(props) {
    const { auth, name, meta, options, object, data, locator, form, submit, funcStat, contextFilters, links, scheme, linksCompareFunction, contextObject,
        queryDetail,
        modelActions,
        collectionActions,
        render
    } = props;

    const xmeta = GetMeta(meta);
    if (!xmeta) return null;
    return (
        <React.Fragment>
            {(props?.subheader) ? props?.subheader : null}
            <Frm
                auth={auth}
                form={form}
                links={links}
                contextObject={contextObject}
                queryDetail={queryDetail}
                modelActions={modelActions}
                collectionActions={collectionActions}
                scheme={scheme}
                linksCompareFunction={linksCompareFunction}
                contextFilters={contextFilters}
                submit={submit}
                name={name}
                meta={meta}
                options={options}
                object={object}
                data={data}
                locator={locator}
                funcStat={funcStat}
                render={render}
            />
        </React.Fragment>
    );
}