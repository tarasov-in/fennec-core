import { useState, useEffect, useCallback } from 'react';
import _ from 'lodash';
import { errorCatch, getObjectValue, GETWITH, READWITH } from '../../../core/utils';
import { QueryDetail, QueryOrder, QueryParam } from '../../../core/query';

export function dataOrContent(data) {
    return (data && data.content) ? data.content : (_.has(data, 'content')) ? [] : data;
}

export function useDependenceBy(changed) {
    return useCallback((item) => {
        if (!item?.dependence?.field) return null;
        if (!changed) return null;
        if (changed[item.dependence.by] && item.dependence.eq) {
            return changed[item.dependence.by][item.dependence.eq];
        }
        if (item.dependence.eq) {
            return changed[item.dependence.eq];
        }
        return null;
    }, [changed]);
}

/**
 * Hook for loading relation data (list) from source/url/object.
 * @param {{ item: object, auth: object, changed: object }} params
 * @returns {{ data: array, setData: function, loading: boolean, setLoading: function, by: function, defaultQueryParams: function }}
 */
export function useRelationData({ item, auth, changed }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const by = useDependenceBy(changed);
    const dependenceValue = by(item);

    const defaultQueryParams = useCallback((filter) => {
        const _dependence = (item.dependence?.mode === "server" && item.dependence?.field && by(item))
            ? [QueryParam(`w-${item.dependence?.field}`, by(item))]
            : [];
        if (!filter) {
            return [QueryDetail("none"), QueryOrder("ID", "ASC"), ..._dependence];
        }
        if (_.isArray(filter)) {
            return [...filter, ..._dependence];
        }
        return [..._dependence];
    }, [item?.dependence, changed]);

    useEffect(() => {
        if (item?.source || item?.url || _.get(item, "relation.reference.url") || _.get(item, "relation.reference.source")) {
            const filter = item.queryFilter || _.get(item, "relation.reference.queryFilter") || _.get(item, "relation.reference.filter");
            const url = item.source || _.get(item, "relation.reference.url") || _.get(item, "relation.reference.source");
            GETWITH(auth, url, [...defaultQueryParams(filter)], ({ data }) => {
                setData(dataOrContent(data));
            }, (err) => errorCatch(err, (e) => { console.error(e); }));
        } else if (_.get(item, "relation.reference.data")) {
            setData(item.relation.reference.data);
        } else if (_.get(item, "relation.reference.object")) {
            const object = getObjectValue(item, "relation.reference.object");
            if (object) {
                const filter = item.queryFilter || _.get(item, "relation.reference.queryFilter") || _.get(item, "relation.reference.filter");
                READWITH(auth, object, [...defaultQueryParams(filter)], ({ data }) => {
                    setData(dataOrContent(data));
                }, (err) => errorCatch(err, (e) => { console.error(e); }));
            }
        }
    }, [
        auth,
        item?.source,
        item?.url,
        item?.queryFilter,
        item?.relation?.reference?.data,
        item?.relation?.reference?.url,
        item?.relation?.reference?.source,
        item?.relation?.reference?.queryFilter,
        item?.relation?.reference?.filter,
        dependenceValue
    ]);

    return { data, setData, loading, setLoading, by, defaultQueryParams };
}

/**
 * Hook for loading single relation by value (e.g. BigObj when value is set).
 */
export function useRelationDataByValue({ item, auth, changed, value }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const by = useDependenceBy(changed);
    const dependenceValue = by(item);

    const defaultQueryParams = useCallback((filter) => {
        const _dependence = (item.dependence?.mode === "server" && item.dependence?.field && by(item))
            ? [QueryParam(`w-${item.dependence?.field}`, by(item))]
            : [];
        if (!filter) {
            return [QueryDetail("none"), QueryOrder("ID", "ASC"), ..._dependence];
        }
        if (_.isArray(filter)) {
            return [...filter, ..._dependence];
        }
        return [..._dependence];
    }, [item?.dependence, changed]);

    useEffect(() => {
        if (!value) return;
        if (item?.source || item?.url || _.get(item, "relation.reference.url") || _.get(item, "relation.reference.source")) {
            const filter = item.queryFilter || _.get(item, "relation.reference.queryFilter") || _.get(item, "relation.reference.filter");
            const url = item.source || _.get(item, "relation.reference.url") || _.get(item, "relation.reference.source");
            setLoading(true);
            GETWITH(auth, url, [...defaultQueryParams(filter), QueryParam("w-ID", value)], ({ data }) => {
                setData(dataOrContent(data));
                setLoading(false);
            }, (err) => errorCatch(err, () => setLoading(false)));
        } else if (_.get(item, "relation.reference.object")) {
            const object = getObjectValue(item, "relation.reference.object");
            if (object) {
                const filter = item.queryFilter || _.get(item, "relation.reference.queryFilter") || _.get(item, "relation.reference.filter");
                setLoading(true);
                READWITH(auth, object, [...defaultQueryParams(filter), QueryParam("w-ID", value)], ({ data }) => {
                    setData(dataOrContent(data));
                    setLoading(false);
                }, (err) => errorCatch(err, () => setLoading(false)));
            }
        }
    }, [
        auth,
        value,
        item?.source,
        item?.url,
        item?.queryFilter,
        item?.relation?.reference?.data,
        item?.relation?.reference?.url,
        item?.relation?.reference?.source,
        item?.relation?.reference?.queryFilter,
        item?.relation?.reference?.filter,
        dependenceValue
    ]);

    return { data, setData, loading, setLoading, by, defaultQueryParams };
}
