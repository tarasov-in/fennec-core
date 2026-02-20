import React, { useState, useEffect, useCallback } from 'react';
import _ from 'lodash';
// import ScrollLocker from 'rc-util/lib/Dom/scrollLocker';
import { Form } from 'antd';
import { useMediaQuery } from 'react-responsive'
import { IfElse, Request, makeFormData, unpackFormFields, pushStateHistoryModal, unsubscribe, subscribe, getLocator, errorCatch } from '../../core/utils';
import { Spin, Button, Modal } from 'antd';
// import {
//     Popup,
//     SpinLoading
// } from 'antd-mobile';
import { DeviceUUID } from "device-uuid"
// import { FormObserverContext } from '../Context';

const CurrentForm = (props) => {
    const { current, steps, object, action, setSubmit } = props;
    const [frm] = Form.useForm();
    const item = React.useMemo(() => steps[current], [steps, current]);
    const F = React.useMemo(() => item.form, [item]);
    useEffect(() => {
        if (setSubmit) {
            if (item.noAntForm) {
                setSubmit(action, current);
            } else {
                setSubmit(frm.submit, current);
            }
        }
    }, [item, setSubmit, action, current, frm]);
    const newData = React.useMemo(() => ({ ...item.object, ...object[steps[current].key] }), [item, object, steps, current]);
    const cstep = React.useMemo(() => item.steps || steps, [item, steps]);
    const csubheader = React.useMemo(() => (item.titles && item.titles.subheader) ? item.titles.subheader : "", [item]);
    return <F
        idx={current}
        submit={action}
        object={newData}
        data={object}

        auth={props.auth}
        meta={item.meta}
        options={item.options}
        steps={cstep}
        subheader={csubheader}
        form={frm}
    />
};

export const FooterButton = ({ key, name, callback, options, isDesktopOrLaptop, locator, object }) => {
    if (isDesktopOrLaptop) {
        return (<Button
            data-locator={getLocator(locator || key, object)}
            key={key} onClick={callback} {...options}>{name}</Button>);
    } else {
        const btn = { key: key, text: name, onPress: callback, options: { ...options, key: getLocator(locator || key, object) } };
        return (btn);
    }
}
export function Action(props) {
    let isMobile = false;
    try {
        isMobile = new DeviceUUID().parse()?.isMobile
    } catch (error) {
        console.error(error)
    }

    const isDesktopOrLaptop = useMediaQuery({ minWidth: 1224 })

    const {
        callback,
        excludeKeyPressed,
        hideMenu,
        isFormData,
        steps,
        modify,

        visible,
        // mode,
        readonly,
        disabled,
        formWraperStyle,
        triggerStyle,
        triggerOptions,
        titles,
        object,
        okText,
        dismissText,
        nextText,
        backText,
        noAntForm,
        uuid,
        actionRef,
        disabledOkOnUncahngedForm,
        contextFilters,

    } = props;

    //----FormObserver-----------------
    const [values, setValues] = useState({});
    useEffect(() => {
        setValues(object);
    }, [object]);
    const isChangedField = React.useCallback((name) => {
        return (_.get(values, name) !== _.get(object, name))
    }, [values, object]);
    const isChangedForm = React.useMemo(() => {
        let f = false;
        for (const key in values) {
            if (_.get(values, key) !== _.get(object, key)) {
                f = true;
                break
            }
        }
        return f;
    }, [values, object]);
    const onValuesChange = React.useCallback((changed, all) => {
        setValues(all)
    }, [values, setValues])
    //---------------------------------

    // Helpers
    // const scrollLocker = new ScrollLocker();

    // Internal States
    const [loading, setLoading] = useState(false);
    const [opened, setOpened] = useState(false);

    // ---------------------------------
    const [stepObject, setStepObject] = useState({});
    const [currentStep, setCurrentStep] = useState(0);

    const [form] = Form.useForm();
    const closePopup = useCallback(() => {
        form.resetFields();
        close();
    }, [form]);
    const ContentForm = props.form;
    // ---------------------------------
    const stack = [];
    const getStack = useCallback(() => {
        return stack;
    }, []);
    // ---------------------------------
    useEffect(() => {
        if (uuid) {
            var token_click = subscribe(`action.${uuid}.click`, function (msg, data) {
                click();
            });
        }
        return () => {
            if (uuid) {
                unsubscribe(`action.${uuid}`);
            }
        };
    }, [uuid])
    // ---------------------------------        
    // var available = true;
    // useEffect(
    //     () => {
    //         available = true;
    //         return () => {
    //             available = false;
    //         };
    //     },
    //     [ /* TODO: memoization parameters here */]
    // );
    // ---------------------------------
    let submitCache = React.useMemo(() => ({}), []);
    const execStep = React.useCallback((current) => {
        if (submitCache[current]) {
            submitCache[current]();
        }
    }, [submitCache]);
    const setSubmit = (submit, current) => {
        submitCache[current] = submit;
    };
    // ---------------------------------
    const lock = React.useCallback(() => {
        setLoading(true);
    }, []);
    const unlock = React.useCallback(() => {
        setLoading(false);
    }, []);
    const close = React.useCallback(() => {
        setCurrentStep(0);
        setLoading(false);
        // if (mode !== "inline") {
        if (props.onClose) {
            props.onClose();
        }
        window.history.back();
        // }
    }, [/*mode,*/ props.onClose]);
    // ---------------------------------
    const action = React.useCallback((_values) => {

        let values = eventExecution(modify, _values, {});

        values = IfElse(form, unpackFormFields(form, values), values);
        values = IfElse(isFormData, makeFormData(values), values);

        setLoading(true);
        Request(values,
            IfElse(
                !!props.action,
                props,
                {
                    action: {
                        method: (!isFormData) ? "POST" : "POSTFormData",
                        path: `/api/` + props.document,
                        onClose: ({ unlock, close }, context) => close(),
                        onDispatch: (values, context) => () => callback,
                        onError: (err, { unlock, close }) => {
                            unlock();
                            errorCatch(err);
                        },
                    }
                }
            ),
            {
                auth: props.auth,
                collection: props.collection || [],
                collectionRef: props?.collectionRef,
                updateCollection: props?.updateCollection,
                setCollection: props.setCollection || (() => { }),
                contextFilters,
                property: props.property || (() => { }),
                label: props.label || (() => { }),
                itemByProperty: props.itemByProperty || (() => { }),
                apply: props.apply || (() => { }),
                plock: props?.lock || (() => { }),
                punlock: props?.unlock || (() => { }),

                onData: (values, context) => values.data,
                lock,
                unlock,
                close,
            }
        );
    }, [modify, form, isFormData, callback, props.action, props.document, props.collection, props.collectionRef, props.updateCollection, props.setCollection, props.contextFilters, props.auth]);

    const click = React.useCallback((e) => {
        if (excludeKeyPressed && excludeKeyPressed(e)) {
            return;
        }
        if ((!steps && ContentForm) || steps) {
            // if (available == true) {
            pushStateHistoryModal(setOpened, getStack);
            setOpened(true);
            // };
        } else {
            action({});
        }
        if (hideMenu) {
            hideMenu();
        }
    }, [action, steps, excludeKeyPressed, hideMenu, props.collection])

    // ---------------------------------
    const prev = React.useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        } else {
            closePopup();
        }
    }, [currentStep, closePopup]);

    const next = React.useCallback((values, item, currentStep) => {
        if (currentStep < steps.length - 1) {
            if (item && item.action) {
                setLoading(true);
                item.action(values,
                    (v) => {
                        if (v) {
                            setStepObject(x => ({ ...x, [steps[currentStep].key]: { ...steps[currentStep].object, ...v } }));
                        }
                        setLoading(false);
                    },
                    (v) => {
                        setStepObject(x => ({ ...x, [steps[currentStep].key]: { ...steps[currentStep].object, ...v } }));
                        setCurrentStep(currentStep + 1);
                        setLoading(false);
                    }, { state: stepObject });
            } else {
                setStepObject(values);
                setCurrentStep(currentStep + 1);
            }
        } else {
            let o = {
                ...stepObject,
                [steps[currentStep].key]: { ...steps[currentStep].object, ...values }
            };
            action(o);
        }
    }, [steps, stepObject]);
    // ---------------------------------
    const FooterDismissFunction = () => {
        if (steps && currentStep > 0) {
            return prev;
        } else {
            // if (mode !== "inline") {
                return closePopup
            // } else return undefined
        }
    }
    const FooterOkFunction = () => {
        if (steps) {
            return () => {
                execStep(currentStep);
            }
        } else {
            return form.submit
        }
    }
    const FooterDismissButtons = () => {
        if (steps && currentStep > 0) {
            return [
                FooterButton({
                    key: "dismiss",
                    name: steps[currentStep]?.dismissText || backText || 'Назад',
                    callback: FooterDismissFunction(),
                    options: {
                        type: "ghost"
                    },
                    isDesktopOrLaptop: isDesktopOrLaptop || !isMobile
                })
            ];
        } else {
            // if (mode !== "inline") {
                return [
                    FooterButton({
                        key: "dismiss",
                        name: dismissText || 'Закрыть',
                        callback: FooterDismissFunction(),
                        options: {
                            type: "ghost"
                        },
                        isDesktopOrLaptop: isDesktopOrLaptop || !isMobile
                    })
                ]
            // } else return []
        }
    }
    const FooterOkButtons = useCallback(() => {
        if (steps) {
            return [
                IfElse(currentStep < steps.length - 1,
                    FooterButton({
                        key: "next",
                        name: steps[currentStep]?.okText || nextText || 'Далее',
                        callback: FooterOkFunction(),
                        options: {
                            type: "primary",
                            disabled: disabledOkOnUncahngedForm && !isChangedForm
                        },
                        isDesktopOrLaptop: isDesktopOrLaptop || !isMobile
                    }),
                    FooterButton({
                        key: "ok",
                        name: steps[currentStep]?.okText || okText || 'Отправить',
                        callback: FooterOkFunction(),
                        options: {
                            type: "primary",
                            disabled: disabledOkOnUncahngedForm && !isChangedForm
                        },
                        isDesktopOrLaptop: isDesktopOrLaptop || !isMobile
                    }))
            ]
        } else {
            return [
                FooterButton({
                    key: "ok",
                    name: okText || 'Отправить',
                    callback: FooterOkFunction(),
                    options: {
                        type: "primary",
                        disabled: disabledOkOnUncahngedForm && !isChangedForm
                    },
                    isDesktopOrLaptop: isDesktopOrLaptop || !isMobile
                })
            ]
        }
    }, [isChangedForm, disabledOkOnUncahngedForm, currentStep, steps, FooterOkFunction])
    const FooterExtendedButtons = (parameters) => {
        if (props.footerExtendedButtons) {
            let btns = props.footerExtendedButtons(parameters);
            if (btns) {
                return btns?.map(e => FooterButton({ isDesktopOrLaptop: isDesktopOrLaptop || !isMobile, ...e }))
            }
        }
        return []
    }
    const footer = React.useCallback(() => {
        let ctx = {
            DismissFunction: FooterDismissFunction(),
            OkFunction: FooterOkFunction(),
            form,
            object,
            lock,
            unlock,
            close,
            // mode,
            readonly,
            loading,
            isChangedForm
        };
        if (props.footer) {
            let btns = props.footer(ctx);
            if (btns) {
                let a = btns?.map(e => FooterButton({ isDesktopOrLaptop: isDesktopOrLaptop || !isMobile, ...e }))
                return a
            }
        }
        if (readonly || loading) {
            return [
                ...FooterExtendedButtons(ctx),
                ...FooterDismissButtons(),
            ]
        }
        return [
            ...FooterExtendedButtons(ctx),
            ...FooterDismissButtons(),
            ...FooterOkButtons()
        ]
    }, [isChangedForm, props.footer, isDesktopOrLaptop, currentStep, form, object, unlock, close, /*mode,*/ readonly, loading]);

    const trigger = React.useCallback(() => {
        return (props.trigger) ? props.trigger(click) : <React.Fragment></React.Fragment>;
    }, [object, props.action, isDesktopOrLaptop, /*mode,*/ props.title, props.trigger, loading, disabled, triggerOptions, triggerStyle, props.closable]);
    const content = React.useCallback(() => {
        // if (isDesktopOrLaptop || !isMobile) {
        const width = props.width;
        const title = props.title;
        // if (mode == "inline") {
        //     return (<div data-locator={getLocator(props?.locator || "actioncontent", props?.object)} style={{ width: "100%", height: "100%", resize: "none" }} className='action-content'>
        //         <Spin spinning={loading}>
        //             {steps && <React.Fragment>
        //                 <CurrentForm
        //                     setSubmit={setSubmit}
        //                     auth={props.auth}
        //                     current={currentStep}
        //                     steps={steps}
        //                     object={stepObject}
        //                     action={(values) => {
        //                         let o = {
        //                             ...stepObject,
        //                             [steps[currentStep].key]: { ...steps[currentStep].object, ...values }
        //                         };
        //                         next(values, steps[currentStep], currentStep);
        //                     }}
        //                 />
        //             </React.Fragment>}
        //             {(!steps && props.form) &&
        //                 <FormObserverContext.Provider value={[isChangedForm, isChangedField, onValuesChange]}>
        //                     <ContentForm
        //                         {...props}
        //                         submit={action}
        //                         form={(!noAntForm) ? form : undefined}

        //                         isChangedForm={isChangedForm}
        //                         isChangedField={isChangedField}
        //                         onValuesChange={onValuesChange}
        //                     />
        //                 </FormObserverContext.Provider>
        //             }
        //             <div>
        //                 <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }} className='action-footer'>
        //                     {footer()}
        //                 </div>
        //             </div>
        //         </Spin>
        //     </div>)
        // } else {
        return (<React.Fragment>
            <Modal
                afterClose={props.afterClose}
                width={width}
                title={title}
                open={opened || visible}
                closable={true}
                destroyOnHidden={true}
                onCancel={closePopup}
                footer={footer()}

                keyboard={false}
                styles={{
                    body: (props.modal && props.modal.bodyStyle) ? props.modal.bodyStyle : {}
                }}
                {...props.modal}
            >
                <div style={{ width: "100%", height: "100%", resize: "none" }}>
                    <Spin spinning={loading}>
                        {steps && <React.Fragment>
                            <CurrentForm
                                data-locator={getLocator(props?.locator || "actionform", stepObject)}
                                setSubmit={setSubmit}
                                auth={props.auth}
                                current={currentStep}
                                steps={steps}
                                object={stepObject}
                                action={(values) => {
                                    let o = {
                                        ...stepObject,
                                        [steps[currentStep].key]: { ...steps[currentStep].object, ...values }
                                    };
                                    next(values, steps[currentStep], currentStep);
                                }}
                            />
                        </React.Fragment>}
                        {(!steps && props.form) &&
                            <ContentForm
                                {...props}
                                data-locator={getLocator(props?.locator || "actionform", props?.object)}
                                subheader={(titles && titles.subheader) ? titles.subheader : ""}
                                submit={action}
                                form={form}
                            />
                        }
                    </Spin>
                </div>
            </Modal>
            {trigger && trigger()}
        </React.Fragment>)
        // }
        // } else {
        //     if (mode == "inline") {
        //         return (<React.Fragment>
        //             <div style={{
        //                 display: "flex",
        //                 flexDirection: "column",
        //                 height: "100%",
        //             }}>
        //                 <div style={{ textAlign: "center", fontWeight: "600", fontSize: "14px", minHeight: ((titles && titles.header)) ? "47px" : "0px" }}>{(titles && titles.subheader) ? titles.subheader : ""}</div>
        //                 {!loading && <div style={{ height: "100%", padding: "0px", ...formWraperStyle }}>
        //                     {steps && <React.Fragment>
        //                         <CurrentForm
        //                             setSubmit={setSubmit}
        //                             auth={props.auth}
        //                             current={currentStep}
        //                             steps={steps}
        //                             object={stepObject}
        //                             data-locator={getLocator(props?.locator || "actionform", stepObject)}
        //                             action={(values) => {
        //                                 let o = {
        //                                     ...stepObject,
        //                                     [steps[currentStep].key]: { ...steps[currentStep].object, ...values }
        //                                 };
        //                                 next(values, steps[currentStep], currentStep);
        //                             }}
        //                         />
        //                     </React.Fragment>}
        //                     {(!steps && props.form) &&
        //                         <ContentForm
        //                             {...props}
        //                             data-locator={getLocator(props?.locator || "actionform", props?.object)}
        //                             subheader={(titles && titles.subheader) ? titles.subheader : ""}
        //                             submit={action}
        //                             form={form}
        //                         />
        //                     }
        //                 </div>}
        //                 {loading && <div className="loading" style={{ height: "100%" }}>
        //                     <div className="align" style={{ textAlign: "center" }}>
        //                         <div style={{ display: "flex", justifyContent: "center" }}>
        //                             <SpinLoading style={{ '--size': '48px' }} />
        //                         </div>
        //                         <span style={{ marginTop: 8 }}>Отправка ...</span>
        //                     </div>
        //                 </div>}
        //                 <div style={{
        //                     padding: "8px",
        //                     width: "100%",
        //                     zIndex: "1",
        //                     backgroundColor: "white"
        //                 }}>
        //                     <div style={{ display: "flex", justifyContent: "space-between" }}>
        //                         {footer()?.map((e, idx) => {
        //                             return (<Button key={idx} style={{ flex: "auto" }} type="ghost" {...e.options} onClick={e.onPress}>{e.text}</Button>)
        //                         })}
        //                     </div>
        //                 </div>
        //             </div>
        //         </React.Fragment>);
        //     } else {
        //         return (<React.Fragment>
        //             <Popup
        //                 visible={opened || visible}
        //                 showCloseButton
        //                 bodyStyle={{ height: "100%" }}
        //                 onClose={closePopup}
        //             >
        //                 <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        //                     <div style={{ flex: "0", padding: "0 10px" }}>
        //                         {(titles && titles.header) ?
        //                             <div style={{ display: "flex", justifyContent: "center", padding: "10px 30px 10px 15px", fontSize: "16px" }}>
        //                                 {titles.header}
        //                             </div> : undefined
        //                         }
        //                     </div>
        //                     <div style={{ overflowY: 'scroll', flex: "1", height: "100%" }}>
        //                         <div style={{ padding: "0 10px", textAlign: "center", fontWeight: "600", fontSize: "14px", minHeight: (!(titles && titles.header)) ? "47px" : "0px" }}>{(titles && titles.subheader) ? titles.subheader : ""}</div>
        //                         {!loading && <div style={{ height: "100%", padding: "0px" }}>
        //                             {steps && <React.Fragment>
        //                                 <CurrentForm
        //                                     setSubmit={setSubmit}
        //                                     auth={props.auth}
        //                                     current={currentStep}
        //                                     steps={steps}
        //                                     object={stepObject}
        //                                     data-locator={getLocator(props?.locator || "actionform", stepObject)}
        //                                     action={(values) => {
        //                                         let o = {
        //                                             ...stepObject,
        //                                             [steps[currentStep].key]: { ...steps[currentStep].object, ...values }
        //                                         };
        //                                         next(values, steps[currentStep], currentStep);
        //                                     }}
        //                                 />
        //                             </React.Fragment>}
        //                             {(!steps && props.form) &&
        //                                 <ContentForm
        //                                     {...props}
        //                                     data-locator={getLocator(props?.locator || "actionform", props?.object)}
        //                                     subheader={(titles && titles.subheader) ? titles.subheader : ""}
        //                                     submit={action}
        //                                     form={form}
        //                                 />
        //                             }
        //                         </div>}
        //                         {loading && <div className="loading">
        //                             <div className="align" style={{ textAlign: "center" }}>
        //                                 <div style={{ display: "flex", justifyContent: "center" }}>
        //                                     <SpinLoading style={{ '--size': '48px' }} />
        //                                 </div>
        //                                 <span style={{ marginTop: 8 }}>Отправка ...</span>
        //                             </div>
        //                         </div>}
        //                     </div>
        //                     <div style={{ flex: "0" }}>
        //                         <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", padding: "10px" }}>
        //                             {footer()?.map((e, idx) => <Button style={{ flex: "auto" }} type="ghost" {...e.options} key={idx} onClick={e.onPress}>{e.text}</Button>)}
        //                         </div>
        //                     </div>
        //                 </div>
        //             </Popup>
        //             {trigger && trigger()}
        //         </React.Fragment>);
        //     }
        // }
    }, [isChangedForm, isChangedField, onValuesChange, props.action, /*mode,*/ steps, stepObject, currentStep, stepObject, props.auth, loading, titles, opened, visible, formWraperStyle, next, action, form]);
    React.useEffect(() => {
        if (actionRef) {
            actionRef.current = {
                click,
                opened,
                loading
            }
        }
    }, [actionRef, opened, visible, loading])
    return (<React.Fragment>
        {content && content()}
    </React.Fragment>);
}
