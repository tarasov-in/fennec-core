import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import { Action } from '../Action'
import { unwrap, GET, errorCatch, QueryParam, GETWITH, READWITH, QueryFunc, JSX, GetMetaPropertyByPath, updateInArray, deleteInArray, QueryDetail, subscribe as _subscribe, unsubscribe, clean, JSXMap, getObjectDisplay, ContextFiltersToQueryFilters, contextFilterToObject, getLocator } from '../../core/utils'
import { Field } from '../Field';
import { Model } from '../Model';
import { useMetaContext } from '../../Context';
import { useUIOptional } from '../../adapters/UIContext';
import { Overlay } from '../../Overlay';
import { PopoverModal } from '../../PopoverModal';

export function SortingFieldsUI(props) {
    const { filters, value, onChange, ui } = props;
    const sortOptions = filters?.filter(f => f.sort) ?? [];
    const locator = (suffix, obj) => getLocator(props?.locator || suffix, obj);

    if (ui?.Divider && ui?.Select && ui?.Button && ui?.Tooltip && ui?.Icons) {
        const Divider = ui.Divider;
        const Select = ui.Select;
        const Button = ui.Button;
        const Tooltip = ui.Tooltip;
        const SortAsc = ui.Icons.SortAscending;
        const SortDesc = ui.Icons.SortDescending;
        return (
            <React.Fragment>
                <Divider type="horizontal" orientation="left" style={{ margin: "12px 0", fontSize: "13px", fontWeight: "600", padding: "0px 15px 0px 0px" }}>
                    Сортировка
                </Divider>
                <div data-locator={locator("sorting", props?.object)} style={{}}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Select
                            data-locator={locator("sortingselect", props?.object)}
                            allowClear={true}
                            value={value.name}
                            onChange={(v) => onChange({ name: v, order: value.order })}
                            options={sortOptions.map((item, idx) => ({ value: item.name, label: item.label }))}
                            style={{ width: "100%", marginRight: "5px" }}
                        />
                        <div>
                            {value.order === "ASC" && (
                                <Tooltip title="Восходящий">
                                    <Button icon={SortAsc ? <SortAsc /> : null} data-locator={locator("sortingasc", props?.object)} onClick={() => onChange({ name: value.name, order: "DESC" })} />
                                </Tooltip>
                            )}
                            {value.order === "DESC" && (
                                <Tooltip title="Нисходящий">
                                    <Button icon={SortDesc ? <SortDesc /> : null} data-locator={locator("sortingdesc", props?.object)} onClick={() => onChange({ name: value.name, order: "ASC" })} />
                                </Tooltip>
                            )}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <div style={{ margin: "12px 0", fontSize: "13px", fontWeight: "600" }}>Сортировка</div>
            <div data-locator={locator("sorting", props?.object)}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <select
                        data-locator={locator("sortingselect", props?.object)}
                        value={value.name || ''}
                        onChange={(e) => onChange({ name: e.target.value, order: value.order })}
                        style={{ flex: 1 }}
                    >
                        <option value="">—</option>
                        {sortOptions.map((item, idx) => (
                            <option key={idx} value={item.name}>{item.label}</option>
                        ))}
                    </select>
                    <button
                        type="button"
                        data-locator={value.order === "ASC" ? locator("sortingasc", props?.object) : locator("sortingdesc", props?.object)}
                        onClick={() => onChange({ name: value.name, order: value.order === "ASC" ? "DESC" : "ASC" })}
                        title={value.order === "ASC" ? "Восходящий" : "Нисходящий"}
                    >
                        {value.order === "ASC" ? "↑" : "↓"}
                    </button>
                </div>
            </div>
        </React.Fragment>
    );
}
export function FiltersFieldsUI(props) {
    const { auth, filters, funcs, value, onChange, ui } = props;

    const _onFilterChange = React.useMemo(() => (v, item) => {
        if ((!v && !item?.permanent) || (item?.permanent && (v === undefined || v === null)) || (_.isArray(v) && v.length == 0)) {
            let f = { ...value };
            delete f[item.name]
            onChange(f);
            return
        } else {
            let newFiltr = { ...value, [item.name]: v };
            onChange(newFiltr);
        }
    }, [value]);

    const DividerComp = ui?.Divider;
    const dividerProps = { type: "horizontal", orientation: "left", style: { margin: "12px 0", fontSize: "13px", fontWeight: "600", padding: "0px 15px 0px 0px" } };

    return (
        <React.Fragment>
            {DividerComp ? <DividerComp {...dividerProps}>Фильтры</DividerComp> : <div style={{ margin: "12px 0", fontSize: "13px", fontWeight: "600" }}>Фильтры</div>}
            <div data-locator={getLocator(props?.locator || "filters", props?.object)} style={{}}>
                <div>
                    {JSXMap(filters?.filter(i => i.filter), (item) => (
                        <div data-locator={getLocator(props?.locator || "filtersfield", props?.object)} key={item.name} style={{ marginBottom: "10px" }}>
                            {item.filter && (item.type !== "bool" && item.type !== "boolean") && <span>{item.label}</span>}
                            <Field
                                mode="filter"
                                formItem={true}
                                key={item.name}
                                auth={auth}
                                item={{ ...item, func: (funcs && funcs[item?.name?.toLowerCase()]) ? funcs[item.name.toLowerCase()] : {} }}
                                value={value[item.name]}
                                onChange={(value) => _onFilterChange(value, item)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </React.Fragment>
    )
}

export function collectionQueryParams(filters, contextFilters, filter, sorting, current, count, queryDetail) {
    let ctxFlt = ContextFiltersToQueryFilters(contextFilters)

    let flt = [];
    Object.keys(filter).forEach(key => {
        var item = filters?.find(e => e.name == key);
        var akey = item?.alias || key;

        if (item?.additionalFilter) {
            let additionalFlt = ContextFiltersToQueryFilters(item?.additionalFilter)
            flt.push(...additionalFlt)
        }

        if (item) {
            let filterByKey = filter[key];
            switch (item?.filterType) {
                case "group":
                    switch (item?.type) {
                        case "object":
                        case "document":
                            flt.push(QueryParam("w-in-" + akey, filterByKey))
                            break;
                        default:
                            flt.push(QueryParam("w-in-" + akey, filterByKey))
                            break;
                    }
                    break;
                case "range":
                    switch (item?.type) {
                        case "int":
                        case "uint":
                        case "integer":
                        case "int64":
                        case "int32":
                        case "uint64":
                        case "uint32":
                            if (_.isArray(filterByKey) && filterByKey.length >= 2) {
                                flt.push(QueryParam("w-lge-" + akey, filterByKey[0]))
                                flt.push(QueryParam("w-lwe-" + akey, filterByKey[1]))
                            }
                            break;
                        case "double":
                        case "float":
                        case "float64":
                        case "float32":
                            if (_.isArray(filterByKey) && filterByKey.length >= 2) {
                                flt.push(QueryParam("w-lge-" + akey, filterByKey[0]))
                                flt.push(QueryParam("w-lwe-" + akey, filterByKey[1]))
                            }
                            break;
                        case "time":
                            if (_.isArray(filterByKey) && filterByKey.length >= 2) {
                                flt.push(QueryParam("w-lge-" + akey, filterByKey[0].format("HH:mm:ss")))
                                flt.push(QueryParam("w-lwe-" + akey, filterByKey[1].format("HH:mm:ss")))
                            }
                            break;
                        case "date":
                            if (_.isArray(filterByKey) && filterByKey.length >= 2) {
                                flt.push(QueryParam("w-lge-" + akey, filterByKey[0].format("YYYY-MM-DD")))
                                flt.push(QueryParam("w-lwe-" + akey, filterByKey[1].format("YYYY-MM-DD")))
                            }
                            break;
                        case "datetime":
                        case "time.Time":
                            if (_.isArray(filterByKey) && filterByKey.length >= 2) {
                                flt.push(QueryParam("w-lge-" + akey, filterByKey[0].format("YYYY-MM-DD HH:mm")))
                                flt.push(QueryParam("w-lwe-" + akey, filterByKey[1].format("YYYY-MM-DD HH:mm")))
                            }
                            break;
                        default:
                            if (item?.queryComparer) {
                                if (_.isFunction(item?.queryComparer)) {
                                    flt.push(QueryParam(`w-${item?.queryComparer(filterByKey, item)}-` + akey, filterByKey))
                                } else {
                                    flt.push(QueryParam(`w-${item?.queryComparer}-` + akey, filterByKey))
                                }
                            } else {
                                flt.push(QueryParam("w-" + akey, filterByKey))
                            }
                            break;
                    }
                    break;
                default:
                    switch (item?.type) {
                        case "string":
                            // queryComparer:"sim", // wsim, swsim
                            if (_.isFunction(item?.queryComparer)) {
                                flt.push(QueryParam(`w-${item?.queryComparer(filterByKey, item) || "co"}-` + akey, filterByKey))
                            } else {
                                flt.push(QueryParam(`w-${item?.queryComparer || "co"}-` + akey, filterByKey))
                            }
                            break;
                        case "func":
                            if (_.isFunction(item?.queryPrefix)) {
                                flt.push(QueryParam(`${item?.queryPrefix(filterByKey, item) || ""}` + akey, filterByKey))
                            } else {
                                flt.push(QueryParam(`${item?.queryPrefix || ""}` + akey, filterByKey))
                            }
                            break;
                        default:
                            if (item?.queryRaw) {
                                if (_.isFunction(item?.queryRaw)) {
                                    flt.push(item?.queryRaw(filterByKey, item, akey))
                                } else {
                                    flt.push(item?.queryRaw)
                                }
                            } else
                                if (item?.queryComparer) {
                                    if (_.isFunction(item?.queryComparer)) {
                                        flt.push(QueryParam(`w-${item?.queryComparer(filterByKey, item)}-` + akey, filterByKey))
                                    } else {
                                        flt.push(QueryParam(`w-${item?.queryComparer}-` + akey, filterByKey))
                                    }
                                } else {
                                    flt.push(QueryParam("w-" + akey, filterByKey))
                                }
                            break;
                    }
                    break;
            }
        }
    });

    let func = [];
    filters?.forEach(item => {
        if (item.func && _.isArray(item.func)) {
            item.func.forEach(fu => {
                func.push(QueryFunc(fu, item.name))
            });
        }
    });
    let sort = []
    if (sorting && sorting?.name) {
        sort.push(QueryParam(`s-${sorting.name}`, sorting.order))
    }
    let params = [
        QueryDetail(queryDetail || "model"),
        QueryParam(`page`, current),
        QueryParam(`count`, count),
        ...sort,
        ...flt,
        ...func,
        ...ctxFlt
    ]
    return params;
}
function FilterButton(props) {
    const ref = useRef(null)
    const { setBounding, filtered, setFiltered, state, locator, object, name, fieldName, ui } = props;
    useEffect(() => {
        if (ref.current) {
            if (setBounding) {
                setBounding(ref.current.getBoundingClientRect())
            }
        }
    }, [ref])
    const hasActiveFilter = state && state.filter && Object.keys(state.filter)?.length > 0;
    const FilterIcon = ui?.Icons?.Filter;
    const BadgeComp = ui?.Badge;

    const trigger = FilterIcon ? <FilterIcon style={{}} /> : <span aria-label="filter">⚙</span>;

    return (
        <div
            className={`bg ${(filtered) ? "bg-altblue" : "bg-grey"} pointer`}
            style={{ minWidth: "28px", fontSize: "14px", lineHeight: "22px" }}
            ref={ref}
            data-locator={getLocator(locator || "collectionfilter-" + name || "collectionfilter-" + fieldName || "collectionfilter", object)}
            onClick={() => setFiltered(o => !o)}
        >
            {BadgeComp ? (
                <BadgeComp dot={hasActiveFilter}>{trigger}</BadgeComp>
            ) : (
                <span title={hasActiveFilter ? "Есть активные фильтры" : ""}>{trigger}{hasActiveFilter ? " •" : ""}</span>
            )}
        </div>
    );
}
function FilterContent({ auth, filters, sorting, setSorting, state, funcStat, filtered, locator, object, name, fieldName, _onFilterChange, applyFilter, clearFilter, ui }) {
    const ButtonComp = ui?.Button;
    const fl = filters?.filter(i => i.filter);
    const showFilterButtons = filtered && fl?.length > 0;

    return (
        <React.Fragment>
            {showFilterButtons && (
                <React.Fragment>
                    <div style={{}}>
                        {ButtonComp ? (
                            <ButtonComp
                                data-locator={getLocator(locator || "collectionfilterapply-" + name || "collectionfilterapply-" + fieldName || "collectionfilterapply", object)}
                                style={{ width: "100%" }}
                                disabled={!state.filterChanged}
                                type="primary"
                                onClick={applyFilter}
                            >
                                Применить
                            </ButtonComp>
                        ) : (
                            <button type="button" disabled={!state.filterChanged} onClick={applyFilter}>Применить</button>
                        )}
                    </div>
                    <div style={{ marginTop: "5px" }}>
                        {ButtonComp ? (
                            <ButtonComp
                                data-locator={getLocator(locator || "collectionfilterclear-" + name || "collectionfilterclear-" + fieldName || "collectionfilterclear", object)}
                                style={{ width: "100%" }}
                                disabled={_.isEmpty(state.filter)}
                                onClick={clearFilter}
                            >
                                Очистить
                            </ButtonComp>
                        ) : (
                            <button type="button" disabled={_.isEmpty(state.filter)} onClick={clearFilter}>Очистить</button>
                        )}
                    </div>
                </React.Fragment>
            )}
            <SortingFieldsUI ui={ui} value={sorting} onChange={setSorting} filters={filters} />
            <FiltersFieldsUI ui={ui} auth={auth} value={state.newFilter} onChange={_onFilterChange} filters={filters} funcs={funcStat} />
        </React.Fragment>
    );
}
export function Collection(props) {
    const ui = useUIOptional();
    const {
        auth,
        name,
        source,
        queryDetail,
        modelActions,
        collectionActions,

        linksModelActions,
        // linksCollectionActions,
        scheme,
        field,
        fieldName,
        contextObject,
        linksCompareFunction,

        selection, // undefined, "radio" или "checkbox"
        render,
        collectionRef,
        contextFilters,
        subscribe,

        onSetCollection,
        onCollectionChange,
        // Collection Only Events
        onChange,   // |
        value,      // | AntFrom Item Api
        getSelectedOnly,

        onChangeRequestParameters,
        onApplyFilter,
        floatingFilter,
        disableScrollTo,
        style,
        headerStyle,
        bodyStyle,
        contentStyle,
        footerStyle,
        filterPopoverStyle,
        allowFullscreen,
        pagination,
    } = props;

    const defFilters = (filters) => {
        var f = filters;
        if (f && f.length) {
            let filtr = {};
            for (let d = 0; d < f.length; d++) {
                const element = f[d];
                if (element.filtered) {
                    filtr = { ...filtr, [element.name]: element.filtered };
                }
            }
            return filtr;
        }
        return {};
    }
    const defSorting = (filters) => {
        let sorted = { name: "", order: "ASC" }
        var f = filters;
        if (f && f.length) {
            for (let s = 0; s < f.length; s++) {
                const element = f[s];
                if (element.sorted) {
                    sorted.name = element.name;
                    sorted.order = element.sorted;
                    break;
                }
            }
        }
        return sorted;
    }

    const fltrs = (props.filters) ? props.filters() : [];
    const meta = useMetaContext();
    const [loading, setLoading] = useState(false);
    const [collection, _setCollection] = useState([]);
    const [response, setResponse] = useState();
    const [funcStat, setFuncStat] = useState();
    const [lastFuncStat, setLastFuncStat] = useState();
    const [state, setState] = useState({
        filter: defFilters((props.filters) ? fltrs : []),
        newFilter: defFilters((props.filters) ? fltrs : []),
        filterChanged: false
    })
    const [filtered, setFiltered] = useState(false);
    const [filters, setFilters] = useState();
    const [mobject, setMObject] = useState();
    const [sorting, setSorting] = useState(defSorting((props.filters) ? fltrs : []));
    const [current, _setCurrent] = useState((props.page) ? (parseInt(props.page()) || 1) : 1);
    const [count, setCount] = useState((props.count) ? (parseInt(props.count()) || 20) : 20);
    const [total, setTotal] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        if (onChangeRequestParameters) {
            onChangeRequestParameters({
                filters,
                page: (parseInt(current) || 1),
                count,
                queryDetail,
                contextFilters,
                sorting,
                filter: state.filter,
                queryParams: collectionQueryParams(filters, contextFilters, state.filter, sorting, current, count, queryDetail)
            })
        }
    }, [filters, contextFilters, state.filter, sorting, current, count, queryDetail])

    const setCurrent = (value) => {
        _setCurrent(value);
        if (!disableScrollTo) {
            window.scrollTo(0, 0);
        }
    }
    const lock = () => {
        setLoading(true);
    };
    const unlock = () => {
        setLoading(false);
    };

    useEffect(() => {
        if (value) {
            if (selectionType === "radio") {
                setSelectedRowKeys(o => _.union(o, value.map(e => e?.ID)));
                setSelectedRows(o => _.unionBy(o, value, 'ID'));
            } else {
                setSelectedRowKeys(value.map(e => e?.ID));
                setSelectedRows(value);
            }
        } else {
            setSelectedRowKeys([]);
            setSelectedRows([]);
        }
    }, [value])
    useEffect(() => {
        if (name && meta) {
            let mo = meta[name] || meta[name.toLowerCase()];
            if (mo) {
                setMObject(mo);
                if (props.filters) {
                    let f = fltrs?.map(pf => {
                        let field = GetMetaPropertyByPath(meta, mo, pf.name);
                        return {
                            ...field,
                            ...pf
                        }

                    });
                    setFilters(f);
                }
            }
        } else {
            var f = (props.filters) ? fltrs : [];
            setFilters(f);
        }
    }, [name, meta]);

    const setCollection = React.useCallback((array) => {
        if (onSetCollection) {
            let collection = onSetCollection(array);
            _setCollection(collection);
            if (onCollectionChange) {
                onCollectionChange(collection);
            }
        } else {
            _setCollection(array);
            if (onCollectionChange) {
                onCollectionChange(array);
            }
        }
    }, [collection]);
    const setCollectionItem = React.useCallback((item) => {
        setCollection(updateInArray(collection, item));
    }, [collection]);
    const removeCollectionItem = React.useCallback((item) => {
        setCollection(deleteInArray(collection, item));
    }, [collection]);

    const clearFilter = React.useCallback(() => {
        setFuncStat(undefined);
        setLastFuncStat(undefined);
        setState({ ...state, filterChanged: false, newFilter: {}, filter: {} });
        setCurrent(1);
        if (onApplyFilter) {
            onApplyFilter({
                filters,
                page: current,
                count,
                queryDetail,
                contextFilters,
                sorting,
                filter: {},
                queryParams: []
            })
        }
    }, [current]);

    const applyFilter = React.useMemo(() => () => {
        let o = { ...state, filterChanged: false, filter: state.newFilter }
        setState(o);
        setCurrent(1);
        if (onApplyFilter) {
            onApplyFilter({
                filters,
                page: current,
                count,
                queryDetail,
                contextFilters,
                sorting,
                filter: o?.filter,
                queryParams: collectionQueryParams(filters, contextFilters, o?.filter, sorting, current, count, queryDetail)
            })
        }
    }, [current, state, filters, contextFilters, sorting, count, queryDetail]);

    const request = React.useMemo(() => (filter) => {
        // if (!filters || !filters.length) return;

        // NNU = "nnu"     // not-null
        // NU = "nu"      // null
        // EQ = "eq"      // equals
        // EQI = "eqi"     // equals ignore case
        // NEQ = "neq"     // not-equals
        // LG = "lg"      // larger
        // LW = "lw"      // lower
        // LGE = "lge"     // larger-or-equals
        // LWE = "lwe"     // lower-or-equals
        // EQORNU = "eqOrNu"  // equals or null
        // LGORNU = "lgOrNu"  // larger or null
        // LWORNU = "lwOrNu"  // lower or null
        // LGEORNU = "lgeOrNu" // larger-or-equals or null
        // LWEORNU = "lweOrNu" // lower-or-equals or null
        // SW = "sw"      // start-with
        // EW = "ew"      // end-with
        // CO = "co"      // contains
        // NCO = "nco"     // not-contains
        // IN = "in"      // in
        // NIN = "nin"     // not-in

        if (!meta || !filters) {
            return
        }

        let queryParams = collectionQueryParams(filters, contextFilters, filter, sorting, current, count, queryDetail);
        if (source && _.isFunction(source)) {
            // lock();
            source({
                lock,
                unlock,

                page: current,
                count: count,
                sorting,
                filter,
                // {stat, totalPages, size, totalElements, content}
                apply: (data) => {
                    // setResponse(data);
                    if (data?.stat) {
                        setLastFuncStat(data?.stat);
                    }
                    if (!funcStat) {
                        setFuncStat(data?.stat);
                    }
                    setCurrent(data?.number || current);
                    setTotalPages(data?.totalPages);
                    setCount(data?.size);
                    setTotal(data?.totalElements);
                    setCollection((data && data?.content) ? data?.content : []);
                    // unlock();
                }
            });
        } else if (source && !_.isFunction(source)) {
            lock();
            GETWITH(auth, source, queryParams, (resp) => {
                let { data } = resp
                setResponse(resp);
                if (data?.stat) {
                    setLastFuncStat(data?.stat);
                }
                if (!funcStat) {
                    setFuncStat(data?.stat);
                }
                setCurrent(data?.number || current);
                setTotalPages(data?.totalPages);
                setCount(data?.size);
                setTotal(data?.totalElements);
                setCollection((data && data?.content) ? data?.content : []);
                unlock();
            }, (err) => errorCatch(err, unlock));
        } else {
            lock();
            READWITH(auth, name, queryParams, (resp) => {
                let { data } = resp
                setResponse(resp);
                if (data?.stat) {
                    setLastFuncStat(data?.stat);
                }
                if (!funcStat) {
                    setFuncStat(data?.stat);
                }
                setCurrent(data?.number || current);
                setTotalPages(data?.totalPages);
                setCount(data?.size);
                setTotal(data?.totalElements);
                setCollection((data && data?.content) ? data?.content : []);
                unlock();
            }, (err) => errorCatch(err, unlock));
        }
    }, [source, current, count, sorting, funcStat, filters, contextFilters]);

    const update = React.useCallback(() => {
        request(state.filter);
    }, [request, state.filter]);

    useEffect(() => {
        request(state.filter);
    }, [source, name, state.filter, filters, sorting, current, contextFilters]);

    // Table Items Selection
    const [selectionType, setSelectionType] = useState(selection || 'checkbox'); // radio
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    useEffect(() => {
        setSelectionType(selection);
    }, [selection]);

    useEffect(() => {
        if (subscribe && subscribe.name && subscribe.func) {
            let token = _subscribe(subscribe.name, function (msg, data) {
                if (subscribe.filter && msg.startsWith(subscribe.filter)) {
                    return
                }
                return subscribe.func(data, {
                    msg,
                    collection,
                    setCollection,
                    collectionRef,
                    updateCollection: update,
                    setCollectionItem,
                    removeCollectionItem,
                    request: () => request(state.filter),
                    state,
                });
            });
            return () => {
                unsubscribe(token);
            };
        }
    }, [subscribe, collection, _setCollection, setCollectionItem, removeCollectionItem, request, state]);

    // ---- AntFrom Item Api ----
    const triggerChange = (value) => {
        if (onChange) {
            onChange(value);
        }
    };
    //---------------------------

    const defaultModelAction = React.useCallback((item) => (!name) ? [] : [
        {
            key: "update",
            title: "Изменить",
            action: {
                method: "POST",
                path: "/api/query-update/" + name.toLowerCase(),
                mutation: "update",
                onValues: (values) => {
                    let ctxFlt = contextFilterToObject(contextFilters);
                    return { ...values, ...ctxFlt, ID: item.ID }
                },
                onClose: ({ close }) => close()
            },
            contextFilters: contextFilters,
            form: Model,
            name: name,
            links: linksModelActions,
            scheme: scheme,
            linksCompareFunction: linksCompareFunction,
            contextObject: contextObject,
            queryDetail: queryDetail,
            modelActions: modelActions,
            collectionActions: collectionActions,

            modal: {
                width: "700px"
            },
            options: {
                initialValues: {
                    ...item
                },
            },
            meta: mobject,
            object: item,
        },
        {
            key: "delete",
            title: <span style={{ color: "red" }}>Удалить</span>,
            action: (values, unlock, close, { collection, setCollection }) => {
                const onOk = () => {
                    GET(auth, "/api/query-delete/" + name.toLowerCase() + '/' + item.ID,
                        () => setCollection(deleteInArray(collection, item)),
                        errorCatch
                    );
                };
                if (ui?.confirm) {
                    ui.confirm({
                        title: `Вы уверены что хотите удалить элемент?`,
                        content: (<div>
                            {(mobject) && <div style={{ fontSize: "12px", color: "grey" }}>
                                <div>{mobject?.label}</div>
                            </div>}
                            <div>{getObjectDisplay(item, name, meta)}</div>
                        </div>),
                        okText: "Да",
                        okType: 'danger',
                        cancelText: "Нет",
                        onOk,
                    });
                } else {
                    if (typeof window !== 'undefined' && window.confirm('Вы уверены что хотите удалить элемент?')) {
                        onOk();
                    }
                }
            },
        }
    ], [auth, collection, collectionActions, name, mobject, ui]);

    const defaultCollectionAction = React.useCallback(() => (!name) ? [] : [
        {
            key: "create",
            title: "Создать",
            action: {
                method: "POST",
                path: "/api/query-create/" + name.toLowerCase(),
                mutation: "update",
                onValues: (values) => {
                    let ctxFlt = contextFilterToObject(contextFilters);
                    return { ...values, ...ctxFlt }
                },
                onClose: ({ close }) => close(),
            },
            contextFilters: contextFilters,
            form: Model,
            name: name,
            links: linksModelActions,
            scheme: scheme,
            linksCompareFunction: linksCompareFunction,
            // field: field,
            // fieldName: fieldName,
            contextObject: contextObject,
            queryDetail: queryDetail,
            modelActions: modelActions,
            collectionActions: collectionActions,

            options: {
                initialValues: {},
            },
            meta: mobject,
        }
    ], [auth, collection, collectionActions, name, mobject]);
    const RenderOnCollectionActions = React.useCallback(() => {

        let defaultAction = defaultCollectionAction();
        if (!collectionActions) return <React.Fragment></React.Fragment>;
        let values = clean(unwrap(collectionActions({
            mobject,
            name,
            field,
            fieldName,
            contextObject,
            contextFilters,
            // collection,
            actions: defaultAction,

            collection,
            setCollection,
            collectionRef,
            updateCollection: update,
            setCollectionItem,
            removeCollectionItem,
            onSelection,
            isSelected,
            lock,
            unlock,
            loading,
            update
        })));
        if (!values || !values.length) return <React.Fragment></React.Fragment>;
        return values?.map((e, idx) => {
            if (_.isFunction(e)) {
                return (e({
                    collection,
                    setCollection,
                    collectionRef,
                    updateCollection: update,
                    setCollectionItem,
                    removeCollectionItem,
                    onSelection,
                    isSelected,
                    lock,
                    unlock,
                    loading,
                    update
                }, idx))
            }
            return (<Action
                key={e.key || idx}
                auth={auth}
                mode={"button"}

                locator={props?.locator || name || fieldName}
                collection={collection}
                setCollection={setCollection}
                collectionRef={collectionRef}
                updateCollection={update}
                contextFilters={contextFilters}
                links={linksModelActions}
                scheme={scheme}
                linksCompareFunction={linksCompareFunction}
                queryDetail={queryDetail}
                modelActions={modelActions}
                collectionActions={collectionActions}

                {...e}
            />)
        });
    }, [auth, collection, collectionActions, name, mobject, defaultCollectionAction]);

    const onSelection = (item) => {
        if (!selection || !item) return;
        if (selectionType === "radio") {
            setSelectedRowKeys([item.ID]);
            setSelectedRows([item]);
            triggerChange([item]);
        } else {
            let sr = selectedRows.filter(e => e?.ID !== item?.ID);
            let srk = selectedRowKeys.filter(e => e !== item?.ID);
            let vsr = value?.filter(e => e?.ID !== item?.ID) || [];
            if (sr.length !== selectedRows.length) {
                setSelectedRowKeys(srk);
                setSelectedRows(sr);
                if (!getSelectedOnly) {
                    triggerChange(_.unionBy([...vsr], sr, 'ID'));
                } else {
                    triggerChange(sr);
                }
            } else {
                let v = [...sr, item];
                setSelectedRowKeys([...srk, item?.ID]);
                setSelectedRows(v);
                if (!getSelectedOnly) {
                    triggerChange(_.unionBy([...vsr], v, 'ID'));
                } else {
                    triggerChange(v);
                }
            }
        }
    };
    const isSelected = (item) => {
        let v = selectedRows.find(e => e?.ID === item?.ID);
        return v !== undefined
    };

    const _onFilterChange = React.useMemo(() => (value) => {
        setState(o => ({ ...o, filterChanged: !_.isEqual(o.filter, value), newFilter: value }));
    }, [state]);

    React.useEffect(() => {
        if (collectionRef) {
            collectionRef.current = {
                collection,
                setCollection,
                setCollectionItem,
                removeCollectionItem,
                onSelection,
                isSelected,
                lock,
                unlock,
                loading,
                update,

                filter: state.filter,
                sorting: sorting,
                page: current,
                count
            }
        }
    }, [collection,
        setCollection,
        setCollectionItem,
        removeCollectionItem,
        loading,
        update,

        state.filter,
        sorting,
        current,
        count])

    const contextProps = {
        collection,
        setCollection,
        collectionRef,
        updateCollection: update,
        setCollectionItem,
        removeCollectionItem,
        collectionActions: () => (collectionActions) ? clean(unwrap(collectionActions({ mobject, name, field, fieldName, contextObject, collection, setCollection, actions: defaultCollectionAction() }))) : undefined,
        modelActions: (item, index) => (modelActions) ? clean(unwrap(modelActions(item, index, { mobject, name, field, fieldName, contextObject, collection, setCollection, actions: defaultModelAction(item, index) }))) : undefined,
        onSelection,
        isSelected,
        lock,
        unlock,
        loading,
        update,

        linksModelActions,
        mobject,
        name,
        field,
        fieldName,
        contextObject,
        defaultCollectionAction,
        defaultModelAction,

        funcStat,
        lastFuncStat,
        response
    }

    const [openOverlay, setOpenOverlay] = useState(false);
    const isFullscreen = openOverlay;
    const openFullscreen = () => { setOpenOverlay(true); };
    const closeFullscreen = () => { setOpenOverlay(false); };

    const collectionContext = {
        // data
        collection,
        loading,
        response,
        state,
        sorting,
        current,
        count,
        total,
        totalPages,
        filters,
        filter: state.filter,
        funcStat,
        lastFuncStat,
        selectedRowKeys,
        selectedRows,
        filtered,
        isFullscreen,
        // collection actions
        setCollection,
        setCollectionItem,
        removeCollectionItem,
        updateCollection: update,
        collectionRef,
        request,
        lock,
        unlock,
        // filter/sort
        applyFilter,
        clearFilter,
        onFilterChange: _onFilterChange,
        setSorting,
        setFiltered,
        renderFilterPanel: () => (
            <FilterContent
                ui={ui}
                auth={auth}
                filters={filters}
                sorting={sorting}
                setSorting={setSorting}
                state={state}
                funcStat={funcStat}
                filtered={filtered}
                locator={getLocator(props?.locator || ("collection-" + name) || ("collection-" + fieldName) || "collection", props?.object)}
                object={props?.object}
                name={name}
                fieldName={fieldName}
                _onFilterChange={_onFilterChange}
                applyFilter={applyFilter}
                clearFilter={clearFilter}
            />
        ),
        // pagination
        setCurrent,
        setCount,
        // selection
        onSelection,
        isSelected,
        selectionType,
        triggerChange,
        // fullscreen
        openFullscreen,
        closeFullscreen,
        // actions config (data for building toolbar)
        defaultModelAction,
        defaultCollectionAction,
        getCollectionActions: () => (collectionActions) ? clean(unwrap(collectionActions({
            mobject,
            name,
            field,
            fieldName,
            contextObject,
            collection,
            setCollection,
            actions: defaultCollectionAction(),
            updateCollection: update,
            setCollectionItem,
            removeCollectionItem,
            onSelection,
            isSelected,
            lock,
            unlock,
            loading,
            update
        }))) : undefined,
        getModelActions: (item, index) => (modelActions) ? clean(unwrap(modelActions(item, index, {
            mobject,
            name,
            field,
            fieldName,
            contextObject,
            collection,
            setCollection,
            actions: defaultModelAction(item, index)
        }))) : undefined,
        // meta & config
        auth,
        name,
        field,
        fieldName,
        contextObject,
        contextFilters,
        linksModelActions,
        scheme,
        mobject,
        meta,
        queryDetail,
        source,
        // props for getLocator / styling (user can ignore)
        locator: props?.locator,
        object: props?.object,
        style,
        headerStyle,
        bodyStyle,
        contentStyle,
        footerStyle,
        filterPopoverStyle,
        allowFullscreen,
        floatingFilter,
        disableScrollTo,
        // Form.Item API (when used as Form.Item)
        value,
        onChange,
        getSelectedOnly,
        // callbacks
        onChangeRequestParameters,
        onApplyFilter,
        pagination,
        // helpers
        getLocator: (loc, obj) => getLocator(loc || ("collection-" + name) || ("collection-" + fieldName) || "collection", obj || props?.object),
        getQueryParams: (filterOverride, currentOverride, countOverride) => collectionQueryParams(
            filters,
            contextFilters,
            filterOverride ?? state.filter,
            sorting,
            currentOverride ?? current,
            countOverride ?? count,
            queryDetail
        ),
        getPaginationParams: () => ({
            current: current,
            setCurrent: setCurrent,
            count: count,
            setCount: setCount,
            total: total,
            setTotal: setTotal,
            totalPages: totalPages,
            setTotalPages: setTotalPages,
            collection,
            setCollection: setCollection
        })
    };

    return render ? render(collectionContext) : null;
}
