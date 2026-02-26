import { useCallback } from 'react';
import _ from 'lodash';
import { getDisplay, getObjectValue } from '../../../core/utils';

/**
 * Hook for relation field display helpers: property, itemByProperty, label, labelString, suffix.
 * @param {{ item: object, meta: object, data: array }} params
 */
export function useRelationDisplay({ item, meta, data }) {
    const property = useCallback((it, val) => {
        if (it && _.get(it, "relation.reference.property") && val) {
            return val[it.relation.reference.property];
        }
        if (val) return val.ID;
        return undefined;
    }, []);

    const itemByProperty = useCallback((it, val) => {
        if (!data) return undefined;
        if (_.get(it, "relation.reference.property")) {
            return data.find(e => e[it.relation.reference.property] === val);
        }
        return data.find(e => e.ID === val);
    }, [data]);

    const label = useCallback((it, val) => {
        if (!it || !val) return "";
        if (it.display && _.isFunction(it.display)) return it.display(val);
        if (it.relation?.display && _.isFunction(it.relation.display)) return it.relation.display(val);
        const fieldMeta = meta[getObjectValue(it, "relation.reference.object")];
        const _display = (it?.relation?.display?.fields ? it?.relation?.display : undefined)
            || (fieldMeta?.display?.fields ? fieldMeta?.display : undefined);
        return getDisplay(val, _display, fieldMeta, meta);
    }, [meta]);

    const labelString = useCallback((it, val) => {
        if (!it || !val) return "";
        if (it.displayString && _.isFunction(it.displayString)) return it.displayString(val);
        if (it.relation?.displayString && _.isFunction(it.relation.displayString)) return it.relation.displayString(val);
        const labelDisplay = label(it, val);
        if (_.isString(labelDisplay)) return labelDisplay;
        const fieldMeta = meta[getObjectValue(it, "relation.reference.object")];
        const _display = (it?.relation?.display?.fields ? it?.relation?.display : undefined)
            || (fieldMeta?.display?.fields ? fieldMeta?.display : undefined);
        return getDisplay(val, _display, fieldMeta, meta);
    }, [meta, label]);

    const suffix = useCallback((it, val) => {
        if (!it || !val) return undefined;
        if (it.suffix && _.isFunction(it.suffix)) return it.suffix(val);
        if (it.relation?.suffix && _.isFunction(it.relation.suffix)) return it.relation.suffix(val);
        return undefined;
    }, []);

    return { property, itemByProperty, label, labelString, suffix };
}
