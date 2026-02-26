import React, { useCallback } from 'react';
import _ from 'lodash';
import { Select } from 'antd';
import { useMetaContext } from '../../../Context';
import { getLocator, getObjectValue } from '../../../core/utils';
import { useRelationData } from '../hooks/useRelationData';
import { useRelationDisplay } from '../hooks/useRelationDisplay';
import { FieldLayout } from '../FieldLayout';

const { Option } = Select;

export function GroupObj({ wrapperProps, inputProps, formItem, auth, item, value, onChange, onAfterChange, changed, contextObject, objectName }) {
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

    return (
        <FieldLayout formItem={formItem} item={item} style={item?.fieldLayoutStyle || { width: "100%" }}>
            <div {...wrapperProps}>
                <Select
                    data-locator={getLocator(item?.name || objectName, itemByProperty(item, value))}
                    size={item?.size || "middle"}
                    mode="multiple"
                    showSearch
                    value={value}
                    onChange={(e) => onChange(e, item, itemByProperty(item, e))}
                    style={{ width: "100%" }}
                    allowClear
                    disabled={item?.view?.disabled}
                    filterOption={(input, option) => option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    {...inputProps}
                    {...item?.inputProps}
                >
                    {elements(data)}
                </Select>
            </div>
        </FieldLayout>
    );
}
