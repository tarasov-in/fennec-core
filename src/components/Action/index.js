import React, { useState, useEffect, useCallback } from 'react';
import _ from 'lodash';
import { useMediaQuery } from 'react-responsive';
import { IfElse, Request, makeFormData, unpackFormFields, pushStateHistoryModal, unsubscribe, subscribe, getLocator, errorCatch, eventExecution } from '../../core/utils';
// import { DeviceUUID } from "device-uuid";
import { useUIOptional } from '../../adapters/UIContext';

const CurrentForm = (props) => {
    const { current, steps, object, action, setSubmit, Form: FormComponent } = props;
    const [frm] = FormComponent ? FormComponent.useForm() : [null];
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
    const btn = { key: key, text: name, onPress: callback, options: { ...options, key: getLocator(locator || key, object) } };
    return (btn);
};

function ActionWithFormInstance({ ui, ...props }) {
    const [form] = ui.createFormInstance();
    return <ActionContent formInstance={form} ui={ui} {...props} />;
}

export function Action(props) {
    const ui = useUIOptional();
    if ((props.steps || props.form) && ui?.Form && ui.createFormInstance) {
        return <ActionWithFormInstance ui={ui} {...props} />;
    }
    return <ActionContent form={null} ui={null} {...props} />;
}

function ActionContent(incomingProps) {
    const { formInstance, ui, ...rest } = incomingProps;
    const props = { ...rest, formInstance, ui };
    // let isMobile = false;
    // try {
    //     isMobile = new DeviceUUID().parse()?.isMobile
    // } catch (error) {
    //     console.error(error)
    // }

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

        render
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

    // Internal States
    const [loading, setLoading] = useState(false);
    const [opened, setOpened] = useState(false);

    const [stepObject, setStepObject] = useState({});
    const [currentStep, setCurrentStep] = useState(0);

    const closePopup = useCallback(() => {
        if (formInstance?.resetFields) formInstance.resetFields();
        close();
    }, [formInstance]);
    const ContentForm = props.form;

    const stack = [];
    const getStack = useCallback(() => {
        return stack;
    }, []);

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

    let submitCache = React.useMemo(() => ({}), []);
    const execStep = React.useCallback((current) => {
        if (submitCache[current]) {
            submitCache[current]();
        }
    }, [submitCache]);
    const setSubmit = (submit, current) => {
        submitCache[current] = submit;
    };

    const lock = React.useCallback(() => {
        setLoading(true);
    }, []);
    const unlock = React.useCallback(() => {
        setLoading(false);
    }, []);
    const close = React.useCallback(() => {
        setCurrentStep(0);
        setLoading(false);
        if (props.onClose) {
            props.onClose();
        }
        window.history.back();
    }, [props.onClose]);

    const action = React.useCallback((_values) => {

        let values = eventExecution(modify, _values, {});

        values = IfElse(formInstance, unpackFormFields(formInstance, values), values);
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
    }, [modify, formInstance, isFormData, callback, props.action, props.document, props.collection, props.collectionRef, props.updateCollection, props.setCollection, props.contextFilters, props.auth]);

    const click = React.useCallback((e) => {
        if (excludeKeyPressed && excludeKeyPressed(e)) {
            return;
        }
        if ((!steps && ContentForm) || steps) {
            pushStateHistoryModal(setOpened, getStack);
            setOpened(true);
        } else {
            action({});
        }
        if (hideMenu) {
            hideMenu();
        }
    }, [action, steps, excludeKeyPressed, hideMenu, props.collection])

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

    const FooterDismissFunction = () => {
        if (steps && currentStep > 0) {
            return prev;
        } else {
            return closePopup
        }
    }
    const FooterOkFunction = () => {
        if (steps) {
            return () => {
                execStep(currentStep);
            }
        } else {
            return formInstance.submit
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
                    isDesktopOrLaptop: isDesktopOrLaptop 
                })
            ];
        } else {
            return [
                FooterButton({
                    key: "dismiss",
                    name: dismissText || 'Закрыть',
                    callback: FooterDismissFunction(),
                    options: {
                        type: "ghost"
                    },
                    isDesktopOrLaptop: isDesktopOrLaptop 
                })
            ]
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
                        isDesktopOrLaptop: isDesktopOrLaptop 
                    }),
                    FooterButton({
                        key: "ok",
                        name: steps[currentStep]?.okText || okText || 'Отправить',
                        callback: FooterOkFunction(),
                        options: {
                            type: "primary",
                            disabled: disabledOkOnUncahngedForm && !isChangedForm
                        },
                        isDesktopOrLaptop: isDesktopOrLaptop 
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
                    isDesktopOrLaptop: isDesktopOrLaptop 
                })
            ]
        }
    }, [isChangedForm, disabledOkOnUncahngedForm, currentStep, steps, FooterOkFunction])
    const FooterExtendedButtons = (parameters) => {
        if (props.footerExtendedButtons) {
            let btns = props.footerExtendedButtons(parameters);
            if (btns) {
                return btns?.map(e => FooterButton({ isDesktopOrLaptop: isDesktopOrLaptop, ...e }))
            }
        }
        return []
    }
    const footer = React.useCallback(() => {
        let ctx = {
            DismissFunction: FooterDismissFunction(),
            OkFunction: FooterOkFunction(),
            form: formInstance,
            object,
            lock,
            unlock,
            close,
            readonly,
            loading,
            isChangedForm
        };
        if (props.footer) {
            let btns = props.footer(ctx);
            if (btns) {
                let a = btns?.map(e => FooterButton({ isDesktopOrLaptop: isDesktopOrLaptop, ...e }))
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
    }, [isChangedForm, props.footer, isDesktopOrLaptop, currentStep, formInstance, object, unlock, close, readonly, loading]);

    const trigger = React.useCallback(() => {
        return (props.trigger) ? props.trigger(click) : <React.Fragment></React.Fragment>;
    }, [object, props.action, isDesktopOrLaptop, props.title, props.trigger, loading, disabled, triggerOptions, triggerStyle, props.closable]);

    const FormRenderer = React.useCallback(() => {
        return <React.Fragment>
            {steps && ui?.Form && <React.Fragment>
                <CurrentForm
                    Form={ui.Form}
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
                    subheader={(props.titles && props.titles.subheader) ? props.titles.subheader : ""}
                    submit={action}
                    // form={form}
                    form={formInstance}
                />
            }
        </React.Fragment>
    }, [steps, stepObject, currentStep, props.form, props.auth, props.object, props.locator, props.titles, formInstance, ui]);

    const content = React.useCallback(() => {
        // const width = props.width;
        // const title = props.title;

        return props?.render ? props.render({
            title,
            FormRenderer,
            footer,
            trigger,
            opened,
            loading,
            // title,
            // width,
            // form,
            object,
            close,
            readonly,
            disabled,
            // formWraperStyle,
            // triggerStyle,
            // triggerOptions,
            // titles,
            // currentStep,
            // steps,
            // setSubmit,
            isChangedField,
            isChangedForm,
            onValuesChange,
            DismissFunction: FooterDismissFunction(),
            OkFunction: FooterOkFunction(),
            formInstance,
            lock,
            unlock
        }) : undefined;

        // return (<React.Fragment>
        //     <Modal
        //         afterClose={props.afterClose}
        //         width={width}
        //         title={title}
        //         open={opened || visible}
        //         closable={true}
        //         destroyOnHidden={true}
        //         onCancel={closePopup}
        //         footer={footer()}

        //         keyboard={false}
        //         styles={{
        //             body: (props.modal && props.modal.bodyStyle) ? props.modal.bodyStyle : {}
        //         }}
        //         {...props.modal}
        //     >
        //         <div style={{ width: "100%", height: "100%", resize: "none" }}>
        //             <Spin spinning={loading}>
        //                 {FormRenderer()}
        //             </Spin>
        //         </div>
        //     </Modal>
        //     {trigger && trigger()}
        // </React.Fragment>)

    }, [props.render, isChangedForm, isChangedField, onValuesChange, props.action, steps, stepObject, currentStep, stepObject, props.auth, loading, titles, opened, visible, formWraperStyle, next, action, formInstance]);
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
