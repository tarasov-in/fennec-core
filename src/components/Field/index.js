import React, { useState, useEffect, useMemo, useCallback } from 'react';
import _ from 'lodash';
import { useMetaContext } from '../../Context';
import { InboxOutlined, MenuOutlined } from '@ant-design/icons';
import { EyeInvisibleOutlined, EyeTwoTone, UploadOutlined } from '@ant-design/icons';
import { clean, deleteInArray, errorCatch, getDisplay, getLocator, getObjectValue, GETWITH, JSXMap, QueryDetail, READWITH, unwrap, updateInArray } from '../../core/utils';
import { QueryOrder, QueryParam } from '../../core/query';
import { publish } from '../../core/pubsub';
import {
    Input,
    Select,
    Checkbox,
    DatePicker,
    InputNumber,
    TimePicker,
    Slider,
    Upload,
    Button,
    Space,
    Spin,
    Dropdown,
    Menu,
} from 'antd';
import locale from 'antd/es/date-picker/locale/ru_RU';
import { Model } from '../Model';
import { Action } from '../Action';
import { Collection } from '../Collection';

import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import weekday from "dayjs/plugin/weekday"
import localeData from "dayjs/plugin/localeData"
import { useAuth } from '../../Auth';
import uuid from 'react-uuid';
// import { DropdownAction } from '../DropdownAction';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('ru');
dayjs.extend(weekday);
dayjs.extend(localeData);
const { Dragger } = Upload;
const { TextArea } = Input;
const { Option } = Select;

export function DropdownAction(props) {
    const { button, menuOptions, items, style, icon } = props;
    const auth = useAuth();
    const [actions, setActions] = useState([]);
    useEffect(() => {
        if (items) {
            setActions(items?.filter(e => !!e)?.map(e => ({ ...e, uuid: uuid() })))
        }
    }, [items])

    const btn = () => {
        if (button) {
            return button();
        } else {
            return (<Button size={"small"} style={{ padding: "0 6px" }} type="default" data-locator={getLocator(props?.locator || "menu", props?.object)}>
                {icon || <MenuOutlined />}
            </Button>);
        }
    };

    return (
        <div data-locator={getLocator(props?.locator || "dropdownaction", props?.object)}
            // onClick={(e) => {
            //     // e.preventDefault();
            // }}
            style={style}>
            {JSXMap(actions?.filter(e => (!!e.action || !!e.document)), (e, idx) => {
                return (<div key={idx}>
                    <Action
                        key={e.key || idx}
                        auth={auth}
                        // mode={"MenuItem"}
                        object={e}
                        {...e}
                    />
                </div>)
            })}
            <Dropdown placement="bottomRight" trigger={['click']} {...props} overlay={
                <Menu
                    {...menuOptions}
                    selectable={false}
                    items={(actions && actions.length) ? actions?.map((e, idx) => {
                        if (e.type === 'divider') {
                            return e
                        } else {
                            return {
                                key: e.uuid,
                                label: e.title || ((e.modal) ? e.modal.title : ""),
                                danger: e.danger || false
                            }
                        }
                    }) : []}
                    onClick={(e) => {
                        // e.stopPropagation();
                        if (e.key) {
                            publish(`action.${e.key}.click`, e.key);
                        }
                    }}>
                </Menu>}>
                {btn()}
            </Dropdown>
        </div>
    );
};


function FieldLayout({ formItem, auth, item, children, style }) {
    return (<div style={style}>
        <div>
            {(item?.label && !formItem) && <div style={{}}>{item?.label}</div>}
            {(item?.description && item?.description !== item?.label) && <div style={{ color: "rgb(140, 152, 164)", fontSize: "12px" }}>
                {item?.description}
            </div>}
        </div>
        {children}
    </div>)
}
function ActionsSpace(props) {
    const { className, children, item, data, setData, objectName, auth, contextObject, value, onChange, loading, setLoading,
        property: _property,
        label: _label,
        itemByProperty: _itemByProperty
    } = props;
    const meta = useMetaContext();

    const property = _property || ((item, value) => {
        if (item?.type == "object" || item?.type == "document") {
            if (item && _.get(item, "relation.reference.property") && value) {
                return value[item.relation.reference.property];
            }
            if (value) {
                return value.ID;
            }
        } else {
            return value;
        }
        return undefined;
    });
    const itemByProperty = _itemByProperty || ((item, value) => {
        if (item?.type == "object" || item?.type == "document") {
            if (_.get(item, "relation.reference.property")) {
                return data.find(e => e[item.relation.reference.property] === value);
            }
            if (data?.length) {
                return data.find(e => e.ID === value);
            }
        } else {
            return value;
        }
    });
    const label = _label || ((item, value) => {
        if (item && value) {
            if (item.display && _.isFunction(item.display)) {
                return item.display(value)
            } else if (item.relation && item.relation.display && _.isFunction(item.relation.display)) {
                return item.relation.display(value)
            } else if (item?.type == "object" || item?.type == "document") {
                let fieldMeta = meta[getObjectValue(item, "relation.reference.object")];
                let _display = ((item?.relation?.display?.fields) ? item?.relation?.display : undefined) || ((fieldMeta?.display?.fields) ? fieldMeta?.display : undefined)
                return getDisplay(value, _display, fieldMeta, meta)
            } else {
                return "" + value;
            }
        }
        return "";
    });
    const labelString = (item, value) => {
        if (item && value) {
            if (item.displayString && _.isFunction(item.displayString)) {
                return item.displayString(value)
            } else if (item.relation && item.relation.displayString && _.isFunction(item.relation.displayString)) {
                return item.relation.displayString(value)
            } else if (item?.type == "object" || item?.type == "document") {
                let labeldisplay = label(item, value);
                if (_.isString(labeldisplay)) {
                    return labeldisplay;
                }
                let fieldMeta = meta[getObjectValue(item, "relation.reference.object")];
                let _display = ((item?.relation?.display?.fields) ? item?.relation?.display : undefined) || ((fieldMeta?.display?.fields) ? fieldMeta?.display : undefined)
                return getDisplay(value, _display, fieldMeta, meta)
            } else {
                return "" + value;
            }
        }
        return "";
    };

    const RendeActions = React.useCallback(() => {
        if (!item?.actions) return <React.Fragment></React.Fragment>;
        let values = clean(unwrap(item?.actions(value, item, meta)));
        if (!values || !values.length) return <React.Fragment></React.Fragment>;
        return values?.map((e, idx) => {
            if (_.isFunction(e)) {
                return (e({
                    collection: data,
                    setCollection: setData,
                    objectName: objectName,
                    contextObject: contextObject,
                    setCollectionItem: (item, first) => (!setData) ? undefined : setData(o => updateInArray(o, item, first)),
                    removeCollectionItem: (item) => (!setData) ? undefined : setData(o => deleteInArray(o, item)),
                    // onSelection,
                    // isSelected,
                    lock: () => (!setLoading) ? undefined : setLoading(true),
                    unlock: () => (!setLoading) ? undefined : setLoading(false),
                    loading,
                    property: (obj) => property(item, obj),
                    label: (obj) => label(item, obj),
                    itemByProperty: (value) => itemByProperty(item, value),
                    apply: (obj) => onChange(value, item, itemByProperty(item, value)),
                    // update
                }, idx))
            }

            return (<Action
                key={e.key || idx}
                auth={auth}
                // mode={"button"}
                disabled={loading || (item && item.view && item.view.disabled) ? item.view.disabled : false}
                item={item}
                locator={item?.name || objectName}
                object={e.object || itemByProperty(item, value)}
                objectName={objectName}
                contextObject={contextObject}
                collection={data}
                setCollection={setData}
                property={(obj) => property(item, obj)}
                label={(obj) => label(item, obj)}
                itemByProperty={(value) => itemByProperty(item, value)}
                apply={(obj) => onChange(property(item, obj), item, obj)}
                lock={() => (!setLoading) ? undefined : setLoading(true)}
                unlock={() => (!setLoading) ? undefined : setLoading(false)}

                {...e}
            />)
        });
    }, [item, data, loading, value, meta, contextObject, objectName]);

    const RenderDropdownActions = React.useCallback(() => {
        if (!item?.dropdownActions) return <React.Fragment></React.Fragment>;
        let values = clean(unwrap(item?.dropdownActions(value, item, meta)));
        if (!values || !values.length) return <React.Fragment></React.Fragment>;
        return <DropdownAction
            button={() => (<Button type="default">
                <i className="fa fa-ellipsis-v"></i>
            </Button>)}
            locator={item?.name || objectName}
            object={itemByProperty(item, value)}
            items={values?.map((e, idx) => ({
                key: e.key || idx,
                auth: auth,
                // mode: "MenuItem",
                disabled: loading || (item && item.view && item.view.disabled) ? item.view.disabled : false,
                item: item,
                locator: item?.name || objectName,
                object: e.object || itemByProperty(item, value),
                objectName: objectName,
                contextObject: contextObject,
                collection: data,
                setCollection: setData,
                property: (obj) => property(item, obj),
                label: (obj) => label(item, obj),
                itemByProperty: (value) => itemByProperty(item, value),
                apply: (obj) => onChange(property(item, obj), item, obj),
                lock: () => (!setLoading) ? undefined : setLoading(true),
                unlock: () => (!setLoading) ? undefined : setLoading(false),
                ...e
            }))} />
    }, [item, data, loading, value, meta, contextObject, objectName]);

    return (<Space.Compact className={className} style={{ width: '100%' }}>
        {children}
        {item?.actions && <React.Fragment>
            {RendeActions()}
        </React.Fragment>}
        {item?.dropdownActions && <React.Fragment>
            {RenderDropdownActions()}
        </React.Fragment>}
    </Space.Compact>)
}
function UploadItems({ wrapperProps, inputProps, formItem, auth, item, value, onChange, changed }) {
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);
    useEffect(() => {
        triggerChange(files);
    }, [files]);
    const triggerChange = (changedValue) => {
        if (onChange) {
            onChange([
                ...changedValue,
            ]);
        }
    };
    const uploadingProps = {
        maxCount: 10,
        name: 'files',
        multiple: true,
        showUploadList: item.showUploadList,
        accept: item.accept,
        onRemove: file => {
            const index = files.indexOf(file);
            const newFiles = files.slice();
            newFiles.splice(index, 1);
            setFiles(newFiles);
        },
        beforeUpload: (file, fileList) => {
            setFiles(o => [...o, file]);
            return false;
        },
        fileList: files,
    };
    return (<Upload
        {...uploadingProps}
        data-locator={getLocator(item?.name)}
        {...inputProps}  {...item?.inputProps}
    >
        {!item.trigger && <Button data-locator={getLocator(item?.name, "upload")} icon={<UploadOutlined />}>Загрузить файлы</Button>}
        {item?.trigger && item?.trigger()}
    </Upload>)
}
function UploadItem({ wrapperProps, inputProps, formItem, auth, item, value, onChange, changed }) {
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);
    useEffect(() => {
        triggerChange(files);
    }, [files]);
    const triggerChange = (changedValue) => {
        if (onChange) {
            onChange([
                ...changedValue,
            ]);
        }
    };
    const uploadingProps = {
        maxCount: 1,
        name: 'file',
        multiple: false,
        showUploadList: item.showUploadList,
        accept: item.accept,
        onRemove: file => {
            const index = files.indexOf(file);
            const newFiles = files.slice();
            newFiles.splice(index, 1);
            setFiles(newFiles);
        },
        beforeUpload: file => {
            setFiles([file]);
            return false;
        },
        fileList: files,
    };
    const content = (item) => (
        <div style={{ padding: "15px" }}>
            <p className="ant-upload-drag-icon" style={{ marginBottom: "12px" }}>
                <InboxOutlined />
            </p>
            <p className="ant-upload-text" style={{ fontSize: "14px" }}>Нажмите для выбора или перетащите файл <br />в выделенную область</p>
            <p className="ant-upload-hint" style={{ fontSize: "13px" }}>
                {(item.accept) ? "Поддерживается загрузка файлов " + item.accept : "Поддерживается загрузка любых типов файлов"}
            </p>
        </div>
    );
    return (
        <Dragger {...uploadingProps} data-locator={getLocator(item?.name)} {...inputProps}  {...item?.inputProps}>
            {(item.trigger) && <div>
                {item.trigger()}
                {(!item.nocontent) && <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgb(240 248 255 / 82%)",
                        display: (!value) ? "flex" : "none",
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                    }}
                >
                    <div style={{ padding: "15px", borderRadius: "4px", backgroundColor: "rgb(255 255 255 / 67%)" }}>
                        {content(item)}
                    </div>
                </div>}
            </div>}
            {!item.trigger && content(item)}
        </Dragger >
    );
}
function GroupObj({ wrapperProps, inputProps, formItem, auth, item, value, onChange, onAfterChange, changed, contextObject, objectName }) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const meta = useMetaContext();

    const dataOrContent = (data) => {
        return (data && data.content) ? data.content : (_.has(data, 'content')) ? [] : data
    }
    const by = (item) => {
        if (!!item?.dependence && !!item?.dependence?.field) {
            if (changed) {
                if (!!changed[item.dependence.by] && !!item.dependence.eq) {
                    return changed[item.dependence.by][item.dependence.eq]
                } else if (!!item.dependence.eq) {
                    return changed[item.dependence.eq]
                }
                return null
            }
            return null
        }
    };
    const dependenceValue = by(item);
    const defaultQueryParams = useCallback((filter) => {
        var _dependence = (item.dependence?.mode === "server" && item.dependence?.field && by(item)) ? [QueryParam(`w-${item.dependence?.field}`, by(item))] : []
        if (!filter) {
            return [
                QueryDetail("none"),
                QueryOrder("ID", "ASC"),
                ..._dependence
            ]
        } else if (_.isArray(filter)) {
            return [
                ...filter,
                ..._dependence
            ]
        }
        return [
            ..._dependence
        ]
    }, [item.dependence, changed])
    useEffect(() => {
        if (item.source || item.url || (item && _.get(item, "relation.reference.url")) || (item && _.get(item, "relation.reference.source"))) {
            let filter = item.queryFilter || _.get(item, "relation.reference.queryFilter") || _.get(item, "relation.reference.filter");
            let url = item.source || item.relation.reference.url || item.relation.reference.source;
            GETWITH(auth, url, [
                ...defaultQueryParams(filter),
            ], ({ data }) => {
                setData(dataOrContent(data));
            }, (err) => errorCatch(err, () => { }));
        } else if (item && _.get(item, "relation.reference.data")) {
            setData(item.relation.reference.data);
        } else if (item && _.get(item, "relation.reference.object")) {
            let object = getObjectValue(item, "relation.reference.object");
            if (object) {
                let filter = item.queryFilter || _.get(item, "relation.reference.queryFilter") || _.get(item, "relation.reference.filter");
                READWITH(auth, object, [
                    ...defaultQueryParams(filter),
                ], ({ data }) => {
                    setData(dataOrContent(data));
                }, (err) => errorCatch(err, () => { }));
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
    const property = (item, value) => {
        if (item && _.get(item, "relation.reference.property") && value) {
            return value[item.relation.reference.property];
        }
        if (value) {
            return value.ID;
        }
        return undefined;
    };
    const itemByProperty = (item, value) => {
        if (_.get(item, "relation.reference.property")) {
            return data.find(e => e[item.relation.reference.property] === value);
        }
        return data.find(e => e.ID === value);
    };
    const labelString = (item, value) => {
        if (item && value) {
            if (item.displayString && _.isFunction(item.displayString)) {
                return item.displayString(value)
            } else if (item.relation && item.relation.displayString && _.isFunction(item.relation.displayString)) {
                return item.relation.displayString(value)
            } else {
                let labeldisplay = label(item, value);
                if (_.isString(labeldisplay)) {
                    return labeldisplay;
                }
                let fieldMeta = meta[getObjectValue(item, "relation.reference.object")];
                let _display = ((item?.relation?.display?.fields) ? item?.relation?.display : undefined) || ((fieldMeta?.display?.fields) ? fieldMeta?.display : undefined)
                return getDisplay(value, _display, fieldMeta, meta)
            }
        }
        return "";
    };
    const label = (item, value) => {
        if (item && value) {
            if (item.display && _.isFunction(item.display)) {
                return item.display(value)
            } else if (item.relation && item.relation.display && _.isFunction(item.relation.display)) {
                return item.relation.display(value)
            } else {
                let fieldMeta = meta[getObjectValue(item, "relation.reference.object")];
                let _display = ((item?.relation?.display?.fields) ? item?.relation?.display : undefined) || ((fieldMeta?.display?.fields) ? fieldMeta?.display : undefined)
                return getDisplay(value, _display, fieldMeta, meta)
            }
        }
        return "";
    };
    const elements = useCallback((data) => {
        if (item.dependence?.mode !== "server" && item.dependence) {
            if (item.dependence.field && by(item)) {
                return data?.filter(e => _.get(e, item.dependence.field) === by(item))?.map(i => (
                    <Option data-locator={getLocator(item?.name || objectName, i)} key={property(item, i)} value={property(item, i)} label={labelString(item, i)}>{label(item, i)}</Option>
                ));
            }
        } else {
            return data?.map(i => (
                <Option data-locator={getLocator(item?.name || objectName, i)} key={property(item, i)} value={property(item, i)} label={labelString(item, i)}>{label(item, i)}</Option>
            ));
        }
    }, [value, changed]);

    return (<FieldLayout formItem={formItem} item={item} style={(item?.fieldLayoutStyle) ? item.fieldLayoutStyle : { width: "100%" }}>
        <div {...wrapperProps}>
            <Select
                data-locator={getLocator(item?.name || objectName, itemByProperty(item, value))}
                size={(item.size) ? item.size : "middle"}
                mode="multiple"
                showSearch
                value={value}
                onChange={e => onChange(e, item, itemByProperty(item, e))}
                style={{ width: "100%" }}
                allowClear={true}
                disabled={(item && item.view && item.view.disabled) ? item.view.disabled : false}
                filterOption={(input, option) => {
                    return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }}
                {...inputProps}  {...item?.inputProps}
            >
                {elements(data)}
            </Select>
        </div>
    </FieldLayout>
    )
}
function RangeTime({ wrapperProps, inputProps, formItem, auth, item, value, onChange, onAfterChange }) {
    const [loading, setLoading] = useState(false);
    const a = useMemo(() => {
        if (value && value[0] && value[1]) {
            return [dayjs(value[0]), dayjs(value[1])]
        }
        return []
    }, [value])
    return (<FieldLayout formItem={formItem} item={item} style={(item?.fieldLayoutStyle) ? item.fieldLayoutStyle : { width: "100%" }}>
        <div {...wrapperProps}>
            <TimePicker.RangePicker data-locator={getLocator(item?.name)} changeOnBlur={true} value={a} onChange={onChange} type="time" format="HH:mm:ss" locale={locale} style={{ width: "100%" }}
                {...inputProps}  {...item?.inputProps} />
        </div>
    </FieldLayout>)
}
function RangeDate({ wrapperProps, inputProps, formItem, auth, item, value, onChange, onAfterChange }) {
    const [loading, setLoading] = useState(false);
    const a = useMemo(() => {
        if (value && value[0] && value[1]) {
            return [dayjs(value[0]), dayjs(value[1])]
        }
        return []
    }, [value])
    return (<FieldLayout formItem={formItem} item={item} style={(item?.fieldLayoutStyle) ? item.fieldLayoutStyle : { width: "100%" }}>
        <div {...wrapperProps}>
            <DatePicker.RangePicker data-locator={getLocator(item?.name)} changeOnBlur={true} value={a} onChange={onChange} format="DD.MM.YYYY" locale={locale} style={{ width: "100%" }}
                {...inputProps}  {...item?.inputProps} />
        </div>
    </FieldLayout>)
}
function RangeDateTime({ wrapperProps, inputProps, formItem, auth, item, value, onChange, onAfterChange }) {
    const [loading, setLoading] = useState(false);
    const a = useMemo(() => {
        if (value && value[0] && value[1]) {
            return [dayjs(value[0]), dayjs(value[1])]
        }
        return []
    }, [value])
    return (<FieldLayout formItem={formItem} item={item} style={(item?.fieldLayoutStyle) ? item.fieldLayoutStyle : { width: "100%" }}>
        <div {...wrapperProps}>
            <DatePicker.RangePicker data-locator={getLocator(item?.name)} changeOnBlur={true} showTime={{ format: 'HH:mm' }} value={a} onChange={onChange} format="DD.MM.YYYY HH:mm" locale={locale} style={{ width: "100%" }}
                {...inputProps}  {...item?.inputProps} />
        </div>
    </FieldLayout>)
}
function RangeFloat({ wrapperProps, inputProps, formItem, auth, item, value, onChange, onAfterChange }) {
    const [loading, setLoading] = useState(false);
    const [val, setVal] = useState();
    useEffect(() => {
        setVal(value);
    }, [value]);
    const xstep = item.step || 1;
    const xmin = item.min || item.func.min || 0;
    const xmax = item.max + xstep || item.func.max + xstep || 100000;
    const def = [(xmin - (xmin % xstep)), (xmax + (xstep - xmax % xstep))];
    return (<FieldLayout formItem={formItem} item={item} style={(item?.fieldLayoutStyle) ? item.fieldLayoutStyle : { width: "100%" }}>
        <div {...wrapperProps}>
            <Slider
                data-locator={getLocator(item?.name)}
                range
                defaultValue={def}
                min={(xmin - (xmin % xstep))}
                max={(xmax + (xstep - xmax % xstep))}
                step={xstep}
                included={true}
                value={val || def}
                onChange={setVal}
                onAfterChange={(item.realtime) ? onAfterChange : onChange}
                {...inputProps}  {...item?.inputProps} />
        </div>
    </FieldLayout>
    )
}
function FloatSlider({ wrapperProps, inputProps, formItem, auth, item, value, onChange, onAfterChange }) {
    const [loading, setLoading] = useState(false);
    const [val, setVal] = useState();
    useEffect(() => {
        setVal(value);
    }, [value]);
    const xstep = item?.step || 1;
    const xmin = item?.min || item?.func?.min || 0;
    const xmax = item?.max || item?.func?.max || 100000;
    return (<FieldLayout formItem={formItem} item={item} style={(item?.fieldLayoutStyle) ? item.fieldLayoutStyle : { width: "100%" }}>
        <div {...wrapperProps}>
            <Slider
                data-locator={getLocator(item?.name)}
                disabled={(item && item.view && item.view.disabled) ? item.view.disabled : false}
                min={xmin}
                max={xmax}
                step={xstep}
                value={(item.realtime) ? value : val}
                onChange={(item.realtime) ? onChange : setVal}
                onAfterChange={(item.realtime) ? onAfterChange : onChange}
                {...inputProps}  {...item?.inputProps} />
        </div>
    </FieldLayout>
    )
}
function RangeInteger({ wrapperProps, inputProps, formItem, auth, item, value, onChange, onAfterChange }) {
    const [loading, setLoading] = useState(false);
    const [val, setVal] = useState();
    useEffect(() => {
        setVal(value);
    }, [value]);
    const xstep = item?.step || 1;
    const xmin = item?.min || item?.func?.min || 0;
    const xmax = item?.max + xstep || item?.func?.max + xstep || 100000;
    const def = [(xmin - (xmin % xstep)), (xmax + (xstep - xmax % xstep))];
    return (<FieldLayout formItem={formItem} item={item} style={(item?.fieldLayoutStyle) ? item.fieldLayoutStyle : { width: "100%" }}>
        <div {...wrapperProps}>
            <Slider
                data-locator={getLocator(item?.name)}
                range
                defaultValue={def}
                min={(xmin - (xmin % xstep))}
                max={(xmax + (xstep - xmax % xstep))}
                step={xstep}
                value={val}
                included={true}
                // onChange={setVal}
                onChange={(item.realtime) ? onChange : setVal}
                onAfterChange={(item.realtime) ? onAfterChange : onChange}
                {...inputProps}  {...item?.inputProps} />
        </div>
    </FieldLayout>
    )
}
function IntegerSlider({ wrapperProps, inputProps, formItem, auth, item, value, onChange, onAfterChange }) {
    const [loading, setLoading] = useState(false);
    const [val, setVal] = useState();
    useEffect(() => {
        setVal(value);
    }, [value]);
    const xstep = item?.step || 1;
    const xmin = item?.min || item?.func?.min || 0;
    const xmax = item?.max || item?.func?.max || 100000;

    return (<FieldLayout formItem={formItem} item={item} style={(item?.fieldLayoutStyle) ? item.fieldLayoutStyle : { width: "100%" }}>
        <div {...wrapperProps}>
            <Slider
                data-locator={getLocator(item?.name)}
                disabled={(item && item.view && item.view.disabled) ? item.view.disabled : false}
                min={xmin}
                max={xmax}
                step={xstep}
                value={(item.realtime) ? value : val}
                onChange={(item.realtime) ? onChange : setVal}
                onAfterChange={(item.realtime) ? onAfterChange : onChange}
                {...inputProps}  {...item?.inputProps} />
        </div>
    </FieldLayout>
    )
}
function Obj({ wrapperProps, inputProps, formItem, auth, item, value, onChange, onAfterChange, changed, contextObject, objectName }) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const meta = useMetaContext();

    const dataOrContent = (data) => {
        return (data && data.content) ? data.content : (_.has(data, 'content')) ? [] : data
    }
    const by = (item) => {
        if (!!item?.dependence && !!item?.dependence?.field) {
            if (changed) {
                if (!!changed[item.dependence.by] && !!item.dependence.eq) {
                    return changed[item.dependence.by][item.dependence.eq]
                } else if (!!item.dependence.eq) {
                    return changed[item.dependence.eq]
                }
                return null
            }
            return null
        }
    };
    const dependenceValue = by(item);
    const defaultQueryParams = useCallback((filter) => {
        var _dependence = (item.dependence?.mode === "server" && item.dependence?.field && by(item)) ? [QueryParam(`w-${item.dependence?.field}`, by(item))] : []
        if (!filter) {
            return [
                QueryDetail("none"),
                QueryOrder("ID", "ASC"),
                ..._dependence
            ]
        } else if (_.isArray(filter)) {
            return [
                ...filter,
                ..._dependence
            ]
        }
        return [
            ..._dependence
        ]
    }, [item.dependence, changed])
    useEffect(() => {
        if (item.source || item.url || (item && _.get(item, "relation.reference.url")) || (item && _.get(item, "relation.reference.source"))) {
            let filter = item.queryFilter || _.get(item, "relation.reference.queryFilter") || _.get(item, "relation.reference.filter");
            let url = item.source || item.relation.reference.url || item.relation.reference.source;
            GETWITH(auth, url, [
                ...defaultQueryParams(filter),
            ], ({ data }) => {
                setData(dataOrContent(data));
            }, (err) => errorCatch(err, () => { }));
        } else if (item && _.get(item, "relation.reference.data")) {
            setData(item.relation.reference.data);
        } else if (item && _.get(item, "relation.reference.object")) {
            let object = getObjectValue(item, "relation.reference.object");
            if (object) {
                let filter = item.queryFilter || _.get(item, "relation.reference.queryFilter") || _.get(item, "relation.reference.filter");
                READWITH(auth, object, [
                    ...defaultQueryParams(filter),
                ], ({ data }) => {
                    setData(dataOrContent(data));
                }, (err) => errorCatch(err, () => { }));
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
    const property = (item, value) => {
        if (item && _.get(item, "relation.reference.property") && value) {
            return value[item.relation.reference.property];
        }
        if (value) {
            return value.ID;
        }
        return undefined;
    };
    const itemByProperty = (item, value) => {
        if (_.get(item, "relation.reference.property")) {
            return data.find(e => e[item.relation.reference.property] === value);
        }
        return data.find(e => e.ID === value);
    };
    const labelString = (item, value) => {
        if (item && value) {
            if (item.displayString && _.isFunction(item.displayString)) {
                return item.displayString(value)
            } else if (item.relation && item.relation.displayString && _.isFunction(item.relation.displayString)) {
                return item.relation.displayString(value)
            } else {
                let labeldisplay = label(item, value);
                if (_.isString(labeldisplay)) {
                    return labeldisplay;
                }
                let fieldMeta = meta[getObjectValue(item, "relation.reference.object")];
                let _display = ((item?.relation?.display?.fields) ? item?.relation?.display : undefined) || ((fieldMeta?.display?.fields) ? fieldMeta?.display : undefined)
                return getDisplay(value, _display, fieldMeta, meta)
            }
        }
        return "";
    };
    const label = (item, value) => {
        if (item && value) {
            if (item.display && _.isFunction(item.display)) {
                return item.display(value)
            } else if (item.relation && item.relation.display && _.isFunction(item.relation.display)) {
                return item.relation.display(value)
            } else {
                let fieldMeta = meta[getObjectValue(item, "relation.reference.object")];
                let _display = ((item?.relation?.display?.fields) ? item?.relation?.display : undefined) || ((fieldMeta?.display?.fields) ? fieldMeta?.display : undefined)
                return getDisplay(value, _display, fieldMeta, meta)
            }
        }
        return "";
    };

    const elements = useCallback((data) => {
        if (item.dependence?.mode !== "server" && item.dependence) {
            if (item.dependence.field && by(item)) {
                return data?.filter(e => _.get(e, item.dependence.field) === by(item))?.map(i => (
                    <Option data-locator={getLocator(item?.name || objectName, i)} key={property(item, i)} value={property(item, i)} label={labelString(item, i)}>{label(item, i)}</Option>
                ));
            }
        } else {
            return data?.map(i => (
                <Option data-locator={getLocator(item?.name || objectName, i)} key={property(item, i)} value={property(item, i)} label={labelString(item, i)}>{label(item, i)}</Option>
            ));
        }
    }, [value, changed]);

    const RendeActions = React.useCallback(() => {
        if (!item?.actions) return <React.Fragment></React.Fragment>;
        let values = clean(unwrap(item?.actions(value, item, meta)));
        if (!values || !values.length) return <React.Fragment></React.Fragment>;
        return values?.map((e, idx) => {
            if (_.isFunction(e)) {
                return (e({
                    collection: data,
                    setCollection: setData,
                    objectName: objectName,
                    contextObject: contextObject,
                    setCollectionItem: (item, first) => setData(o => updateInArray(o, item, first)),
                    removeCollectionItem: (item) => setData(o => deleteInArray(o, item)),
                    // onSelection,
                    // isSelected,
                    lock: () => setLoading(true),
                    unlock: () => setLoading(false),
                    loading,
                    property: (obj) => property(item, obj),
                    label: (obj) => label(item, obj),
                    itemByProperty: (value) => itemByProperty(item, value),
                    apply: (obj) => onChange(value, item, itemByProperty(item, value)),
                    // update
                }, idx))
            }
            return (<Action
                key={e.key || idx}
                auth={auth}
                mode={"button"}
                disabled={loading || (item && item.view && item.view.disabled) ? item.view.disabled : false}
                item={item}
                locator={item?.name || objectName}
                object={e.object || itemByProperty(item, value)}
                objectName={objectName}
                contextObject={contextObject}
                collection={data}
                setCollection={setData}
                property={(obj) => property(item, obj)}
                label={(obj) => label(item, obj)}
                itemByProperty={(value) => itemByProperty(item, value)}
                apply={(obj) => onChange(property(item, obj), item, obj)}
                {...e}
            />)
        });
    }, [item, data, loading, value, meta, contextObject, objectName]);

    const RenderDropdownActions = React.useCallback(() => {
        if (!item?.dropdownActions) return <React.Fragment></React.Fragment>;
        let values = clean(unwrap(item?.dropdownActions(value, item, meta)));
        if (!values || !values.length) return <React.Fragment></React.Fragment>;
        return <DropdownAction
            button={() => (<Button type="default">
                <i className="fa fa-ellipsis-v"></i>
            </Button>)}
            locator={item?.name || objectName}
            object={itemByProperty(item, value)}
            items={values?.map((e, idx) => ({
                key: e.key || idx,
                auth: auth,
                mode: "MenuItem",
                disabled: loading || (item && item.view && item.view.disabled) ? item.view.disabled : false,
                item: item,
                locator: item?.name || objectName,
                object: e.object || itemByProperty(item, value),
                objectName: objectName,
                contextObject: contextObject,
                collection: data,
                setCollection: setData,
                property: (obj) => property(item, obj),
                label: (obj) => label(item, obj),
                itemByProperty: (value) => itemByProperty(item, value),
                apply: (obj) => onChange(property(item, obj), item, obj),
                ...e
            }))} />
    }, [item, data, loading, value, meta, contextObject, objectName]);

    return (<FieldLayout formItem={formItem} item={item} style={(item?.fieldLayoutStyle) ? item.fieldLayoutStyle : { width: "100%" }}>
        <Space.Compact
            style={{
                width: '100%',
            }}
            {...wrapperProps}
        >
            <Select showSearch
                data-locator={getLocator(item?.name || objectName, itemByProperty(item, value))}
                size={(item.size) ? item.size : "middle"}
                value={value}
                onChange={e => onChange(e, item, itemByProperty(item, e))}
                style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    width: "100%"
                }}
                allowClear={true}
                disabled={(item && item.view && item.view.disabled) ? item.view.disabled : false}
                filterOption={(input, option) => {
                    return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }}
                {...inputProps}  {...item?.inputProps}
            >
                {elements(data)}
            </Select>
            {item?.actions && <React.Fragment>
                {RendeActions()}
            </React.Fragment>}
            {item?.dropdownActions && <React.Fragment>
                {RenderDropdownActions()}
            </React.Fragment>}
        </Space.Compact>
    </FieldLayout>
    )
}
function ObjCollection({ wrapperProps, inputProps, formItem, auth, item, value, onChange, onAfterChange, changed, contextObject, objectName }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const meta = useMetaContext();

    const dataOrContent = (data) => {
        return (data && data.content) ? data.content : (_.has(data, 'content')) ? [] : data
    }
    const by = (item) => {
        if (!!item?.dependence && !!item?.dependence?.field) {
            if (changed) {
                if (!!changed[item.dependence.by] && !!item.dependence.eq) {
                    return changed[item.dependence.by][item.dependence.eq]
                } else if (!!item.dependence.eq) {
                    return changed[item.dependence.eq]
                }
                return null
            }
            return null
        }
    };
    const dependenceValue = by(item);
    const defaultQueryParams = useCallback((filter) => {
        var _dependence = (item.dependence?.mode === "server" && item.dependence?.field && by(item)) ? [QueryParam(`w-${item.dependence?.field}`, by(item))] : []
        if (!filter) {
            return [
                QueryDetail("none"),
                QueryOrder("ID", "ASC"),
                ..._dependence
            ]
        } else if (_.isArray(filter)) {
            return [
                ...filter,
                ..._dependence
            ]
        }
        return [
            ..._dependence
        ]
    }, [item.dependence, changed])

    const property = (item, value) => {
        if (item && _.get(item, "relation.reference.property") && value) {
            return value[item.relation.reference.property];
        }
        if (value) {
            return value.ID;
        }
        return undefined;
    };
    const itemByProperty = useCallback((item, value) => {
        if (_.get(item, "relation.reference.property")) {
            return data.find(e => e[item.relation.reference.property] === value);
        }
        return data.find(e => e.ID === value);
    }, [data]);

    const display = useCallback((item, value) => {
        if (item && value) {
            if (item.display && _.isFunction(item.display)) {
                return item.display(value)
            } else if (item.relation && item.relation.display && _.isFunction(item.relation.display)) {
                return item.relation.display(value)
            } else {
                let fieldMeta = meta[getObjectValue(item, "relation.reference.object")];
                let _display = ((item?.relation?.display?.fields) ? item?.relation?.display : undefined) || ((fieldMeta?.display?.fields) ? fieldMeta?.display : undefined)
                return getDisplay(value, _display, fieldMeta, meta)
            }
        }
        return "";
    }, [meta]);
    const displayString = useCallback((item, value) => {
        if (item && value) {
            if (item.displayString && _.isFunction(item.displayString)) {
                return item.displayString(value)
            } else if (item.relation && item.relation.displayString && _.isFunction(item.relation.displayString)) {
                return item.relation.displayString(value)
            } else {
                let labeldisplay = display(item, value);
                if (_.isString(labeldisplay)) {
                    return labeldisplay;
                }
                let fieldMeta = meta[getObjectValue(item, "relation.reference.object")];
                let _display = ((item?.relation?.display?.fields) ? item?.relation?.display : undefined) || ((fieldMeta?.display?.fields) ? fieldMeta?.display : undefined)
                return getDisplay(value, _display, fieldMeta, meta)
            }
        }
        return "";
    }, [meta]);
    const suffix = useCallback((item, value) => {
        if (item && value) {
            if (item.suffix && _.isFunction(item.suffix)) {
                return item.suffix(value)
            } else if (item.relation && item.relation.suffix && _.isFunction(item.relation.suffix)) {
                return item.relation.suffix(value)
            }
        }
        return undefined;
    }, [meta]);

    const cAction = (values, unlock, close) => {
        const { selected } = values;
        if (selected) {
            onChange(selected, item)
        }
        close()
    }
    const cTrigger = useCallback((click) => (
        <Button
            style={{
                borderLeft: "none"
                // 1px solid #4096ff
            }}
            onClick={click}
            type="default"
            size={(item.size) ? item.size : "middle"}
            disabled={(item && item.view && item.view.disabled) ? item.view.disabled : (loading) ? loading : false}
        >
            <i className="fa fa-search" style={{ fontSize: "12px" }}></i>
        </Button>
    ), [item, loading])

    const cName = useCallback((item && _.get(item, "relation.reference.object")) ? getObjectValue(item, "relation.reference.object") : undefined, [item]);
    const cSource = useCallback(item?.source || item?.relation?.reference?.url || item?.relation?.reference?.source, [item]);
    const cContextFilters = useCallback(() => defaultQueryParams(item.queryFilter || _.get(item, "relation.reference.queryFilter") || _.get(item, "relation.reference.filter")), [item]);
    const cFilters = useCallback(() => {
        var uif = _.get(item, "relation.uiFilter");
        if (uif) {
            return uif()
        }
        return meta[getObjectValue(item, "relation.reference.object")]?.properties?.map(e => ({ ...e, sort: true, filter: true }));
    }, [meta, item]);

    const cRender = (auth, _item, value, onChange) => {
        return (<Collection
            count={_item?.count}
            floatingFilter={item?.floatingFilter || item?.relation?.floatingFilter}
            selection={"multiselect"}
            value={value}
            onChange={onChange}
            auth={auth}
            objectName={objectName}
            contextObject={contextObject}
            name={cName}
            source={cSource}
            contextFilters={cContextFilters}
            filters={cFilters}
            customRender={(items, {
                objectName,
                contextObject,
                collection,
                setCollection,
                setCollectionItem,
                removeCollectionItem,
                collectionActions,
                modelActions,
                onSelection,
                isSelected,
                lock,
                unlock,
                loading,
                update
            }) => {
                // console.log(value, items);
                return (
                    <div>
                        {(value && value.filter(e => !!e && items.filter(c => c.ID === e.ID) <= 0).length > 0) && <div>
                            <div style={{ fontWeight: "lighter" }}>Сейчас выбрано</div>
                            {JSXMap(value, (i, idx) => <div key={idx}>{display(item, i)}</div>)}
                            <div style={{ fontWeight: "lighter", paddingTop: "10px" }}>Можно выбрать из</div>
                        </div>}
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <Spin spinning={loading} style={{ paddingTop: "15px", paddingBottom: "15px" }} />
                            {JSXMap(items, (o, oidx) => {
                                return (<div key={oidx} onClick={(e) => { e.stopPropagation(); onSelection(o); }}
                                    className={`bg ${(isSelected(o)) ? "bg-blue dark-3" : "bg-grey-hover light"} pointer`} style={{ textAlign: "left" }}>
                                    {display(item, o)}
                                </div>)
                            })}
                        </div>
                    </div>
                )
            }}
            size={"small"}
        />)
    }
    const clear = (str) => {
        if (!str) {
            onChange(undefined, item, undefined)
        }
    }

    return (<FieldLayout formItem={formItem} item={item} style={(item?.fieldLayoutStyle) ? item.fieldLayoutStyle : { width: "100%" }}>
        <Space.Compact
            style={{
                width: '100%',
            }}
            {...wrapperProps}
        >
            <div style={{
                width: "100%",
                border: "1px solid #d9d9d9",
                borderRadius: "6px 0 0 6px",
            }}>
                {JSXMap(value, (i, idx) => <div key={idx}>{display(item, i)}</div>)}
            </div>
            <Action
                title={<div>
                    <div style={{ fontSize: "12px", fontStyle: "italic", color: "rgba(0, 0, 0, 0.45)" }}>Выберите элементы</div>
                    {(item?.label) && <div>{item?.label}</div>}
                </div>}
                auth={auth}
                action={cAction}
                okText="Выбрать"
                locator={item?.name || objectName}
                object={{ selected: value }}
                modal={(item.modal) ? item.modal : { width: "600px" }}
                form={Model}
                meta={[{
                    type: "func",
                    name: "selected",
                    count: item?.count,
                    render: cRender
                }]}
                mode={"func"}
                trigger={cTrigger}
            />
        </Space.Compact>
    </FieldLayout>
    )
}
function BigObj({ wrapperProps, inputProps, formItem, auth, item, value, onChange, onAfterChange, changed, contextObject, objectName }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const meta = useMetaContext();

    const dataOrContent = (data) => {
        return (data && data.content) ? data.content : (_.has(data, 'content')) ? [] : data
    }
    const by = (item) => {
        if (!!item?.dependence && !!item?.dependence?.field) {
            if (changed) {
                if (!!changed[item.dependence.by] && !!item.dependence.eq) {
                    return changed[item.dependence.by][item.dependence.eq]
                } else if (!!item.dependence.eq) {
                    return changed[item.dependence.eq]
                }
                return null
            }
            return null
        }
    };
    const dependenceValue = by(item);
    const defaultQueryParams = useCallback((filter) => {
        var _dependence = (item.dependence?.mode === "server" && item.dependence?.field && by(item)) ? [QueryParam(`w-${item.dependence?.field}`, by(item))] : []
        if (!filter) {
            return [
                QueryDetail("none"),
                QueryOrder("ID", "ASC"),
                ..._dependence
            ]
        } else if (_.isArray(filter)) {
            return [
                ...filter,
                ..._dependence
            ]
        }
        return [
            ..._dependence
        ]
    }, [item.dependence, changed])
    useEffect(() => {
        if (value) {
            if (item.source || item.url || (item && _.get(item, "relation.reference.url")) || (item && _.get(item, "relation.reference.source"))) {
                let filter = item.queryFilter || _.get(item, "relation.reference.queryFilter") || _.get(item, "relation.reference.filter");
                let url = item.source || item.relation.reference.url || item.relation.reference.source;
                setLoading(true)
                GETWITH(auth, url, [
                    ...defaultQueryParams(filter),
                    QueryParam("w-ID", value)
                ], ({ data }) => {
                    setData(dataOrContent(data));
                    setLoading(false)
                }, (err) => errorCatch(err, () => setLoading(false)));
            } else if (item && _.get(item, "relation.reference.object")) {
                let object = getObjectValue(item, "relation.reference.object");
                if (object) {
                    let filter = item.queryFilter || _.get(item, "relation.reference.queryFilter") || _.get(item, "relation.reference.filter");
                    setLoading(true)
                    READWITH(auth, object, [
                        ...defaultQueryParams(filter),
                        QueryParam("w-ID", value)
                    ], ({ data }) => {
                        setData(dataOrContent(data));
                        setLoading(false)
                    }, (err) => errorCatch(err, () => setLoading(false)));
                }
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
    const property = (item, value) => {
        if (item && _.get(item, "relation.reference.property") && value) {
            return value[item.relation.reference.property];
        }
        if (value) {
            return value.ID;
        }
        return undefined;
    };
    const itemByProperty = useCallback((item, value) => {
        if (_.get(item, "relation.reference.property")) {
            return data.find(e => e[item.relation.reference.property] === value);
        }
        return data.find(e => e.ID === value);
    }, [data]);

    const display = useCallback((item, value) => {
        if (item && value) {
            if (item.display && _.isFunction(item.display)) {
                return item.display(value)
            } else if (item.relation && item.relation.display && _.isFunction(item.relation.display)) {
                return item.relation.display(value)
            } else {
                let fieldMeta = meta[getObjectValue(item, "relation.reference.object")];
                let _display = ((item?.relation?.display?.fields) ? item?.relation?.display : undefined) || ((fieldMeta?.display?.fields) ? fieldMeta?.display : undefined)
                return getDisplay(value, _display, fieldMeta, meta)
            }
        }
        return "";
    }, [meta]);
    const displayString = useCallback((item, value) => {
        if (item && value) {
            if (item.displayString && _.isFunction(item.displayString)) {
                return item.displayString(value)
            } else if (item.relation && item.relation.displayString && _.isFunction(item.relation.displayString)) {
                return item.relation.displayString(value)
            } else {
                let labeldisplay = display(item, value);
                if (_.isString(labeldisplay)) {
                    return labeldisplay;
                }
                let fieldMeta = meta[getObjectValue(item, "relation.reference.object")];
                let _display = ((item?.relation?.display?.fields) ? item?.relation?.display : undefined) || ((fieldMeta?.display?.fields) ? fieldMeta?.display : undefined)
                return getDisplay(value, _display, fieldMeta, meta)
            }
        }
        return "";
    }, [meta]);
    const suffix = useCallback((item, value) => {
        if (item && value) {
            if (item.suffix && _.isFunction(item.suffix)) {
                return item.suffix(value)
            } else if (item.relation && item.relation.suffix && _.isFunction(item.relation.suffix)) {
                return item.relation.suffix(value)
            }
        }
        return undefined;
    }, [meta]);

    const cAction = (values, unlock, close) => {
        const { selected } = values;
        if (selected) {
            var h = _.head(selected)
            onChange(property(item, h), item, h)
        }
        close()
    }
    const cTrigger = useCallback((click) => (
        <Button
            onClick={click}
            type="default"
            size={(item.size) ? item.size : "middle"}
            disabled={(item && item.view && item.view.disabled) ? item.view.disabled : (loading) ? loading : false}
        >
            <i className="fa fa-search" style={{ fontSize: "12px" }}></i>
        </Button>
    ), [item, loading])

    const cName = useCallback((item && _.get(item, "relation.reference.object")) ? getObjectValue(item, "relation.reference.object") : undefined, [item]);
    const cSource = useCallback(item?.source || item?.relation?.reference?.url || item?.relation?.reference?.source, [item]);
    const cContextFilters = useCallback(() => defaultQueryParams(item.queryFilter || _.get(item, "relation.reference.queryFilter") || _.get(item, "relation.reference.filter")), [item]);
    const cFilters = useCallback(() => {
        var uif = _.get(item, "relation.uiFilter");
        if (uif) {
            return uif()
        }
        return meta[getObjectValue(item, "relation.reference.object")]?.properties?.map(e => ({ ...e, sort: true, filter: true }));
    }, [meta, item]);

    const cRender = (auth, _item, value, onChange) => {
        return (<Collection
            count={_item?.count}
            floatingFilter={item?.floatingFilter || item?.relation?.floatingFilter}
            selection={"radio"}
            value={value}
            onChange={onChange}
            auth={auth}
            objectName={objectName}
            contextObject={contextObject}
            name={cName}
            source={cSource}
            contextFilters={cContextFilters}
            filters={cFilters}
            customRender={(items, {
                objectName,
                contextObject,
                collection,
                setCollection,
                setCollectionItem,
                removeCollectionItem,
                collectionActions,
                modelActions,
                onSelection,
                isSelected,
                lock,
                unlock,
                loading,
                update
            }) => {
                return (
                    <div>
                        {(value && value.filter(e => !!e && items.filter(c => c.ID === e.ID) <= 0).length > 0) && <div>
                            <div style={{ fontWeight: "lighter" }}>Сейчас выбрано</div>
                            {JSXMap(value, (i, idx) => <div key={idx}>{display(item, i)}</div>)}
                            <div style={{ fontWeight: "lighter", paddingTop: "10px" }}>Можно выбрать из</div>
                        </div>}
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <Spin spinning={loading} style={{ paddingTop: "15px", paddingBottom: "15px" }} />
                            {JSXMap(items, (o, oidx) => {
                                return (<div key={oidx} onClick={(e) => { e.stopPropagation(); onSelection(o); }}
                                    className={`bg ${(isSelected(o)) ? "bg-blue dark-3" : "bg-grey-hover light"} pointer`} style={{ textAlign: "left" }}>
                                    {display(item, o)}
                                </div>)
                            })}
                        </div>
                    </div>
                )
            }}
            size={"small"}
        />)
    }
    const clear = (str) => {
        if (!str) {
            onChange(undefined, item, undefined)
        }
    }

    const RendeActions = React.useCallback(() => {
        if (!item?.actions) return <React.Fragment></React.Fragment>;
        let values = clean(unwrap(item?.actions(value, item, meta, contextObject)));
        if (!values || !values.length) return <React.Fragment></React.Fragment>;
        return values?.map((e, idx) => {
            if (_.isFunction(e)) {
                return (e({
                    collection: data,
                    setCollection: setData,
                    objectName: objectName,
                    contextObject: contextObject,
                    setCollectionItem: (item, first) => setData(o => updateInArray(o, item, first)),
                    removeCollectionItem: (item) => setData(o => deleteInArray(o, item)),
                    // onSelection,
                    // isSelected,
                    lock: () => setLoading(true),
                    unlock: () => setLoading(false),
                    loading,
                    property: (obj) => property(item, obj),
                    label: (obj) => display(item, obj),
                    itemByProperty: (value) => itemByProperty(item, value),
                    apply: (obj) => onChange(value, item, itemByProperty(item, value)),
                    // update
                }, idx))
            }
            return (<Action
                key={e.key || idx}
                auth={auth}
                mode={"button"}
                disabled={loading || (item && item.view && item.view.disabled) ? item.view.disabled : false}
                item={item}
                locator={item?.name || objectName}
                object={e.object || itemByProperty(item, value)}
                objectName={objectName}
                contextObject={contextObject}
                collection={data}
                setCollection={setData}
                property={(obj) => property(item, obj)}
                label={(obj) => display(item, obj)}
                itemByProperty={(value) => itemByProperty(item, value)}
                apply={(obj) => onChange(property(item, obj), item, obj)}
                {...e}
            />)
        });
    }, [item, data, loading, value, meta, contextObject, objectName]);

    const RenderDropdownActions = React.useCallback(() => {
        if (!item?.dropdownActions) return <React.Fragment></React.Fragment>;
        let values = clean(unwrap(item?.dropdownActions(value, item, meta, contextObject)));
        if (!values || !values.length) return <React.Fragment></React.Fragment>;
        return <DropdownAction
            button={() => (<Button type="default">
                <i className="fa fa-ellipsis-v"></i>
            </Button>)}
            locator={item?.name || objectName}
            object={itemByProperty(item, value)}
            items={values?.map((e, idx) => ({
                key: e.key || idx,
                auth: auth,
                mode: "MenuItem",
                disabled: loading || (item && item.view && item.view.disabled) ? item.view.disabled : false,
                item: item,
                locator: item?.name || objectName,
                object: e.object || itemByProperty(item, value),
                objectName: objectName,
                contextObject: contextObject,
                collection: data,
                setCollection: setData,
                property: (obj) => property(item, obj),
                label: (obj) => display(item, obj),
                itemByProperty: (value) => itemByProperty(item, value),
                apply: (obj) => onChange(property(item, obj), item, obj),
                ...e
            }))} />
    }, [item, data, loading, value, meta, contextObject, objectName]);

    return (<FieldLayout formItem={formItem} item={item} style={(item?.fieldLayoutStyle) ? item.fieldLayoutStyle : { width: "100%" }}>
        <Space.Compact
            style={{
                width: '100%',
            }}
            {...wrapperProps}
        >
            <Input
                data-locator={getLocator(item?.name || objectName, itemByProperty(item, value))}
                suffix={(loading) ? <Spin size="small" /> : suffix(item, itemByProperty(item, value))}
                size={(item.size) ? item.size : "middle"}
                allowClear={true}
                style={{ width: "100%" }}
                // readOnly
                onChange={e => clear(e.target.value)}
                value={displayString(item, itemByProperty(item, value))}
                disabled={(item && item.view && item.view.disabled) ? item.view.disabled : (loading) ? loading : false}
                {...inputProps}  {...item?.inputProps}
            />
            <Action
                title={<div>
                    <div style={{ fontSize: "12px", fontStyle: "italic", color: "rgba(0, 0, 0, 0.45)" }}>Выберите элемент</div>
                    {(item?.label) && <div>{item?.label}</div>}
                </div>}
                auth={auth}
                action={cAction}
                okText="Выбрать"
                locator={item?.name || objectName}
                object={{ selected: [itemByProperty(item, value)] }}
                modal={(item.modal) ? item.modal : { width: "600px" }}
                form={Model}
                meta={[{
                    type: "func",
                    name: "selected",
                    count: item?.count,
                    render: cRender
                }]}
                mode={"func"}
                trigger={cTrigger}
            />
            {item?.actions && <React.Fragment>
                {RendeActions()}
            </React.Fragment>}
            {item?.dropdownActions && <React.Fragment>
                {RenderDropdownActions()}
            </React.Fragment>}
        </Space.Compact>
    </FieldLayout>
    )
}
function DateTime({ wrapperProps, inputProps, formItem, auth, item, value, onChange, onAfterChange }) {
    const [loading, setLoading] = useState(false);
    return (<FieldLayout formItem={formItem} item={item} style={(item?.fieldLayoutStyle) ? item.fieldLayoutStyle : { width: "100%" }}>
        <ActionsSpace auth={auth} item={item} value={value} onChange={onChange} loading={loading} setLoading={setLoading} {...wrapperProps}>
            <DatePicker
                data-locator={getLocator(item?.name)}
                changeOnBlur={true} value={(value) ? dayjs(value) : undefined} onChange={onChange} showTime format="DD.MM.YYYY HH:mm" locale={locale} style={{ width: "100%" }}
                disabled={(item && item.view && item.view.disabled) ? item.view.disabled : (loading) ? loading : false}
                {...inputProps}  {...item?.inputProps}
            />
        </ActionsSpace>
    </FieldLayout>
    )
}
function Date({ wrapperProps, inputProps, formItem, auth, item, value, onChange, onAfterChange }) {
    const [loading, setLoading] = useState(false);
    return (<FieldLayout formItem={formItem} item={item} style={(item?.fieldLayoutStyle) ? item.fieldLayoutStyle : { width: "100%" }}>
        <ActionsSpace auth={auth} item={item} value={value} onChange={onChange} loading={loading} setLoading={setLoading} {...wrapperProps}>
            <DatePicker
                data-locator={getLocator(item?.name)}
                changeOnBlur={true} value={(value) ? dayjs(value) : undefined} onChange={onChange} format="DD.MM.YYYY" locale={locale} style={{ width: "100%" }}
                disabled={(item && item.view && item.view.disabled) ? item.view.disabled : (loading) ? loading : false}
                {...inputProps}  {...item?.inputProps}
            />
        </ActionsSpace>
    </FieldLayout>
    )
}
function Time({ wrapperProps, inputProps, formItem, auth, item, value, onChange, onAfterChange }) {
    const [loading, setLoading] = useState(false);
    return (<FieldLayout formItem={formItem} item={item} style={(item?.fieldLayoutStyle) ? item.fieldLayoutStyle : { width: "100%" }}>
        <ActionsSpace auth={auth} item={item} value={value} onChange={onChange} loading={loading} setLoading={setLoading} {...wrapperProps}>
            <DatePicker
                data-locator={getLocator(item?.name)}
                changeOnBlur={true} value={(value) ? dayjs(value) : undefined} onChange={onChange} type="time" format="HH:mm:ss" locale={locale} style={{ width: "100%" }}
                disabled={(item && item.view && item.view.disabled) ? item.view.disabled : (loading) ? loading : false}
                {...inputProps}  {...item?.inputProps}
            />
        </ActionsSpace>
    </FieldLayout>
    )
}
function Boolean({ wrapperProps, inputProps, formItem, auth, item, value, onChange, onAfterChange }) {
    const [loading, setLoading] = useState(false);
    const change = (e) => {
        onChange(e.target.checked);
    }
    return (<FieldLayout formItem={true} item={item}>
        <Checkbox
            data-locator={getLocator(item?.name)}
            checked={value} onChange={change}
            disabled={(item && item.view && item.view.disabled) ? item.view.disabled : (loading) ? loading : false}
            {...inputProps}  {...item?.inputProps}
        >
            {item.label}
        </Checkbox>
    </FieldLayout>
    )
}
function Float({ wrapperProps, inputProps, formItem, auth, item, value, onChange, onAfterChange }) {
    const [loading, setLoading] = useState(false);
    return (<FieldLayout formItem={formItem} item={item} style={(item?.fieldLayoutStyle) ? item.fieldLayoutStyle : { width: "100%" }}>
        <ActionsSpace auth={auth} item={item} value={value} onChange={onChange} loading={loading} setLoading={setLoading} {...wrapperProps}>
            <InputNumber
                data-locator={getLocator(item?.name)}
                value={value} onChange={onChange} style={{ width: "100%" }} min={item?.min || item?.validators?.min} max={item?.max || item?.validators?.max}
                disabled={(item && item.view && item.view.disabled) ? item.view.disabled : (loading) ? loading : false}
                {...inputProps}  {...item?.inputProps}
            />
        </ActionsSpace>
    </FieldLayout>
    )
}
function Integer({ wrapperProps, inputProps, formItem, auth, item, value, onChange, onAfterChange }) {
    const [loading, setLoading] = useState(false);
    return (<FieldLayout formItem={formItem} item={item} style={(item?.fieldLayoutStyle) ? item.fieldLayoutStyle : { width: "100%" }}>
        <ActionsSpace auth={auth} item={item} value={value} onChange={onChange} loading={loading} setLoading={setLoading} {...wrapperProps}>
            <InputNumber
                data-locator={getLocator(item?.name)}
                value={value} onChange={onChange} style={{ width: "100%" }} min={item?.min || item?.validators?.min} max={item?.max || item?.validators?.max}
                disabled={(item && item.view && item.view.disabled) ? item.view.disabled : (loading) ? loading : false}
                {...inputProps}  {...item?.inputProps}
            />
        </ActionsSpace>
    </FieldLayout>
    )
}
function String({ wrapperProps, inputProps, formItem, auth, item, value, onChange, onAfterChange }) {
    const [loading, setLoading] = useState(false);
    return (<FieldLayout formItem={formItem} item={item} style={(item?.fieldLayoutStyle) ? item.fieldLayoutStyle : { width: "100%" }}>
        <ActionsSpace auth={auth} item={item} value={value} onChange={onChange} loading={loading} setLoading={setLoading} {...wrapperProps}>
            <Input
                data-locator={getLocator(item?.name)}
                size={(item.size) ? item.size : "middle"} allowClear value={value} onChange={(v) => onChange(v.target.value)} style={{ width: "100%" }}
                disabled={(item && item.view && item.view.disabled) ? item.view.disabled : (loading) ? loading : false}
                {...inputProps}  {...item?.inputProps}
            />
        </ActionsSpace>
    </FieldLayout>
    )
}
function Password({ wrapperProps, inputProps, formItem, auth, item, value, onChange, onAfterChange }) {
    const [loading, setLoading] = useState(false);
    return (<FieldLayout formItem={formItem} item={item} style={(item?.fieldLayoutStyle) ? item.fieldLayoutStyle : { width: "100%" }}>
        <ActionsSpace auth={auth} item={item} value={value} onChange={onChange} loading={loading} setLoading={setLoading} {...wrapperProps}>
            <Input.Password
                data-locator={getLocator(item?.name)}
                allowClear value={value} onChange={(v) => onChange(v.target.value)} style={{ width: "100%" }}
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                disabled={(item && item.view && item.view.disabled) ? item.view.disabled : (loading) ? loading : false}
                {...inputProps}  {...item?.inputProps}
            />
        </ActionsSpace>
    </FieldLayout>
    )
}
function MultilineText({ wrapperProps, inputProps, formItem, auth, item, value, onChange, onAfterChange }) {
    const [loading, setLoading] = useState(false);
    return (<FieldLayout formItem={formItem} item={item} style={(item?.fieldLayoutStyle) ? item.fieldLayoutStyle : { width: "100%" }}>
        <ActionsSpace auth={auth} item={item} value={value} onChange={onChange} loading={loading} setLoading={setLoading} {...wrapperProps}>
            <TextArea
                data-locator={getLocator(item?.name)}
                rows={6} allowClear value={value} onChange={(v) => onChange(v.target.value)} style={{ width: "100%" }}
                disabled={(item && item.view && item.view.disabled) ? item.view.disabled : (loading) ? loading : false}
                {...inputProps}  {...item?.inputProps}
            />
        </ActionsSpace>
    </FieldLayout>
    )
}
function Image({ wrapperProps, inputProps, formItem, auth, item, value, onChange }) {
    return (
        <FieldLayout formItem={formItem} item={item} style={(item?.fieldLayoutStyle) ? item.fieldLayoutStyle : { width: "100%" }}>
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

function Unknown({ wrapperProps, inputProps, formItem, item }) {
    return (<FieldLayout formItem={formItem} item={item} style={(item?.fieldLayoutStyle) ? item.fieldLayoutStyle : { width: "100%" }}>
        <div key={item.name}>
            <div>{item.label} - {item.name}</div>
            <div>{item.uuid}</div>
        </div>
    </FieldLayout>
    )
}

export function FieldWrapper({ wrapperProps, formItem, auth, item, value, onChange, children }) {
    const [loading, setLoading] = useState(false);
    return (<FieldLayout formItem={formItem} item={item} style={(item?.fieldLayoutStyle) ? item.fieldLayoutStyle : { width: "100%" }}>
        <ActionsSpace auth={auth} item={item} value={value} onChange={onChange} loading={loading} setLoading={setLoading} {...wrapperProps}>
            {children}
        </ActionsSpace>
    </FieldLayout>
    )
}

// item: {
//     label: 'Сумма',
//     name: "obshchayaSumma",
//     filterType: "group", // range
//     type: "float",
//     source: "/api/query/name"
// }

export function Field(props) {
    const { auth, item, value, onChange, onAfterChange, changed, isChanged,
        contextObject, objectName, formItem, data, wrapperProps, inputProps } = props;
    let type = ((item.view) ? item.view.type : undefined) || item.type;

    const context = {
        wrapperProps,
        inputProps,
        auth,
        formItem,
        contextObject,
        objectName,
        item,
        value,
        onChange,
        onAfterChange,
        isChanged,
        changed,
        data
    }

    switch (item.filterType) {
        case "group":
            switch (type) {
                case "func":
                    return (props?.item?.render) ? props?.item?.render(auth, item, value, onChange, onAfterChange, isChanged, { contextObject, objectName, formItem, data, inputProps, wrapperProps }) : undefined;
                case "object":
                case "document":
                    return (<GroupObj {...context}></GroupObj>)
                default:
                    return (<Unknown {...context}></Unknown>)
            }
        case "range":
            switch (type) {
                case "func":
                    return (props?.item?.render) ? props?.item?.render(auth, item, value, onChange, onAfterChange, isChanged, { contextObject, objectName, formItem, data, inputProps, wrapperProps }) : undefined;
                case "int":
                case "uint":
                case "integer":
                case "int64":
                case "int32":
                case "uint64":
                case "uint32":
                    return (<RangeInteger {...context}></RangeInteger>)
                case "double":
                case "float":
                case "float64":
                case "float32":
                    return (<RangeFloat {...context}></RangeFloat>)
                case "time":
                    return (<RangeTime {...context}></RangeTime>)
                case "date":
                    return (<RangeDate {...context}></RangeDate>)
                case "datetime":
                case "time.Time":
                    return (<RangeDateTime {...context}></RangeDateTime>)
                default:
                    return (<Unknown {...context}></Unknown>)
            }
        case "slider":
            switch (type) {
                case "func":
                    return (props?.item?.render) ? props?.item?.render(auth, item, value, onChange, onAfterChange, isChanged, { contextObject, objectName, formItem, data, inputProps, wrapperProps }) : undefined;
                case "int":
                case "uint":
                case "integer":
                case "int64":
                case "int32":
                case "uint64":
                case "uint32":
                    return (<IntegerSlider {...context}></IntegerSlider>)
                case "double":
                case "float":
                case "float64":
                case "float32":
                    return (<FloatSlider {...context}></FloatSlider>)
                default:
                    return (<Unknown {...context}></Unknown>)
            }
        default:
            switch (type) {
                case "func":
                    return (props?.item?.render) ? props?.item?.render(auth, item, value, onChange, onAfterChange, isChanged, contextObject, objectName, data, inputProps, wrapperProps) : undefined;
                case "text":
                    return (<MultilineText {...context}></MultilineText>)
                case "string":
                    return (<String {...context}></String>)
                case "password":
                    return (<Password {...context}></Password>)
                case "int":
                case "uint":
                case "integer":
                case "int64":
                case "int32":
                case "uint64":
                case "uint32":
                    return (<Integer {...context}></Integer>)
                case "double":
                case "float":
                case "float64":
                case "float32":
                    return (<Float {...context}></Float>)
                case "boolean":
                case "bool":
                    return (<Boolean {...context}></Boolean>)
                case "time":
                    return (<Time {...context}></Time>)
                case "date":
                    return (<Date {...context}></Date>)
                case "datetime":
                case "time.Time":
                    return (<DateTime {...context}></DateTime>)
                case "collection":
                    if (item.SubType) { }
                    switch (item.SubType) {
                        default:
                            return (<ObjCollection {...context}></ObjCollection>)
                    }
                case "object":
                case "document":
                    if (item.mode === "dialog") {
                        return (<BigObj {...context}></BigObj>)
                    } else
                        return (<Obj {...context}></Obj>)
                case "file":
                    return (<UploadItem {...context}></UploadItem>)
                case "files":
                    return (<UploadItems {...context}></UploadItems>)
                case "image":
                    return (<Image {...context}></Image>)
                default:
                    return (<Unknown {...context}></Unknown>);
            }

    }
}