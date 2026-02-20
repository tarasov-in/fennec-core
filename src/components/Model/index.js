import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { Form, Tooltip, Tag, Tabs} from 'antd';
import { GetMeta, GetMetaProperties, formItemRules, getObjectDisplay, uncapitalize, contextFilterToObject, getLocator } from '../../core/utils';
import { Field } from '../Field';
import { useFormObserverContext, useMetaContext } from '../../Context';
// import { CollectionByProperty } from '../CollectionByProperty';
const { CheckableTag } = Tag;
const { TabPane } = Tabs;

function Frm(props) {
    const { auth, form, name, meta, options, object, data, locator, submit, funcStat, contextFilters, links, scheme, linksCompareFunction, contextObject,
        queryDetail,
        modelActions,
        collectionActions
    } = props;

    const [visible, setVisible] = useState(false);
    const [excludeFields, setExcludeFields] = useState();

    useEffect(() => {
        form.resetFields();
        if (object) {
            form.setFieldsValue(object);
        }
    }, [object])

    useEffect(() => {
        let ctxFlt = contextFilterToObject(contextFilters);
        setExcludeFields(ctxFlt);
    }, [contextFilters]);

    const gmeta = useMetaContext();

    var properties = GetMetaProperties(meta);
    if (!properties) return <React.Fragment></React.Fragment>;
    const propertiesFiltered = properties?.filter(e => (!e.name || (e.name && e.name.toUpperCase() !== "ID")))?.filter(e => (!e.relation || (e.relation && e.relation.type !== "one-many")));
    let propertiesOneMany = properties?.filter(e => e.relation && e.relation.type === "one-many");
    let tailScheme = undefined
    if (scheme && !scheme.length) {
        propertiesOneMany = []
    }
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
        let func = (linksCompareFunction) ? linksCompareFunction : (e) => _.get(e, "name");
        propertiesOneMany = propertiesOneMany?.filter(e => {
            return (func(e) && (headScheme[func(e)?.toLowerCase()]))
        })
    }

    const [isChangedForm, isChangedField, onValuesChange] = useFormObserverContext()

    if (!excludeFields) return (<React.Fragment></React.Fragment>)

    return (
        <div data-locator={getLocator(props?.locator || name || "model", props?.object)} className='model default-model'>
            {(object && links && links !== "inline" && propertiesOneMany && propertiesOneMany.length > 0) &&
                <div className='bg bg-grey' style={{ textAlign: "left", marginBottom: "5px", padding: "3px 5px", display: "flex", justifyContent: "space-between", gap: "5px" }}>
                    <div style={{ flex: "1 1 auto" }}>
                        {(meta.name && visible == true) && <div style={{ fontSize: "12px", color: "grey" }}>
                            <div>{meta?.label}</div>
                        </div>}
                        <div>{(meta.name && visible == true) && getObjectDisplay(object, meta.name, gmeta)}</div>
                    </div>
                    <div style={{ flex: "0 0" }}>
                        <Tooltip title="Связи">
                            <CheckableTag

                                style={{ margin: "0px", marginInlineEnd: "0px" }}
                                checked={visible}
                                onChange={checked => setVisible(checked)}
                            >
                                <i className="fa fa-link"></i>
                            </CheckableTag>
                        </Tooltip>
                    </div>
                </div>}
            <div style={{ display: (!visible) ? "block" : "none" }}>
                <Form form={form}
                    onFinish={submit}
                    onValuesChange={onValuesChange}
                    initialValues={{
                        ...object
                    }}
                    {...options}
                    labelAlign={"left"}
                    layout={"vertical"}>
                    {propertiesFiltered?.filter(e => (e.name && (excludeFields[e.name?.toLowerCase()] || excludeFields[e.name?.toLowerCase() + "ID"])) ? false : true)?.map((item, idx) => {
                        if (!item?.name && item.type === "func" && item.render) {
                            return <div key={"func_" + idx}>
                                {item.render(auth, item, { data, object, contextObject, funcStat })}
                            </div>
                        }
                        return (<Form.Item
                            preserve={(item.hidden) ? "true" : "false"}
                            hidden={item.hidden}
                            key={item?.name}
                            name={(item.type !== "object" && item.type !== "document") ? uncapitalize(item?.name) : uncapitalize(item?.name) + "ID"}
                            label={(item.type !== "bool" && item.type !== "boolean") ? item.label : undefined}
                            rules={formItemRules(item)}
                            data-locator={getLocator(props?.locator || name || "model", props?.object)}
                        >
                            <Field
                                mode="model"
                                key={item?.name}
                                objectName={name}
                                contextObject={contextObject}
                                auth={auth}
                                formItem={true}
                                data={data}
                                item={{ ...item, filterType: undefined, func: (funcStat && funcStat[item?.name?.toLowerCase()]) ? funcStat[item?.name?.toLowerCase()] : {} }}

                                isChanged={(isChangedField) ? isChangedField((item.type !== "object" && item.type !== "document") ? uncapitalize(item?.name) : uncapitalize(item?.name) + "ID") : undefined}
                            />
                        </Form.Item>);
                    })}
                </Form>
            </div>
            {/* <div>
                {(object && object?.ID && propertiesOneMany && propertiesOneMany?.length > 0 && links) && <div style={{ display: (visible || links === "inline") ? "block" : "none" }}>
                    <Tabs>
                        {propertiesOneMany.map((e, idx) => {
                            let n = getObjectValue(e, "relation.reference.object");
                            if (!n) return;
                            return (<TabPane data-locator={getLocator(locator || "model-collection" + name || "model-collection", object)} tab={e.label} key={idx}>
                                <CollectionByProperty auth={auth} item={e} object={object}
                                    linksCompareFunction={linksCompareFunction}
                                    linksModelActions={links}
                                    scheme={scheme}
                                    queryDetail={queryDetail}
                                    modelActions={modelActions}
                                    collectionActions={collectionActions}
                                />
                            </TabPane>
                            )
                        })}
                    </Tabs>
                </div>}
            </div> */}
        </div>
    )
}

export function Model(props) {
    const { auth, name, meta, options, object, data, locator, form, submit, funcStat, contextFilters, links, scheme, linksCompareFunction, contextObject,
        queryDetail,
        modelActions,
        collectionActions
    } = props;

    var xmeta = GetMeta(meta);
    if (!xmeta) return <React.Fragment></React.Fragment>;
    return (
        <React.Fragment>
            {(props?.subheader) ? props?.subheader : <React.Fragment></React.Fragment>}
            {<Frm
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
                funcStat={funcStat}></Frm>}
        </React.Fragment>
    )
};