import uuid from 'react-uuid';
import _ from 'lodash'
//--------------------------------------------------------------
export const Request = (values, item, props) => {
    const {
        auth,
        collection,
        setCollection,
        collectionRef,
        updateCollection,
        contextFilters,
        property,
        label,
        itemByProperty,
        apply,

        index,
        lock,
        unlock,
        plock,
        punlock,
        close,
        onValues,
        onData,
        onClose,
        onError,
        onDispatch,
    } = props;

    if (item.action) {
        let properties = {
            item,
            index,
            collection,
            setCollection,
            collectionRef,
            updateCollection,
            contextFilters,
            property,
            label,
            itemByProperty,
            apply,
            plock,
            punlock,
            lock,
            unlock,
        };
        if (_.isFunction(item.action)) {
            // Свойство action может быть функцией или объектом
            // action: (values, unlock, close, {item, index})=>{}
            // если функция после того как отработает вернет в качестве результата ещё одну функцию,
            // то она (_dispatch) будет вызванаивнеё передан объект сбольшимчислом параметров
            let v = eventExecution(onValues, values, properties);
            let _dispatch = item.action(v, unlock, close, properties);
            // console.log(_dispatch, item, item.action, v);
            if (_.isFunction(_dispatch)) {
                _dispatch(properties);
            }
        } else if (_.isObject(item.action)) {
            let config = item.action;
            // {
            //    ! method: "POST",
            //    ! path: "/api/request",
            //    ! mutation: "update", - может быть строкой "create", "update" или "delete", а так же функцией createInArray(array, item), updateInArray(array, item), deleteInArray(array, item) из модуля Tool или новой функцией
            //     onValues: (values, context) => {},
            //     onData: (values, context) => {},
            //     onClose: ({unlock, close}, context) => {},
            //     onError: (err, {unlock, close}) => {},
            //     onDispatch: (values, context) => {}, - может так же возвращать функцию, которая будет выполнена сразу после выполнения onDispatch с теми же параметрами, 
            //                                                           если не вернет функцию то будет выполнен метод setCollection (должен быть передан как props) в которо будет передана коллекция
            //                                                           полученная методом мутации заданной полем в объекте action (если мутация не задана то используется updateInArray)
            // }
            let _REQUEST_ = (auth, url, object, callback, error) => {
                if (config.method === "POSTFormData") {
                    return POSTFormData(auth, url, object, callback, error);
                } else if (config.method === "POST") {
                    return POST(auth, url, object, callback, error);
                }
                return GET(auth, url, callback, error);
            };
            let errFunc = config.onError || onError;
            let payload = eventExecution(config.onValues || onValues, values, properties);
            if (lock) lock();
            _REQUEST_(
                auth,
                config.path,
                payload,
                (x) => {
                    let onDispatchFunc = config.onDispatch || onDispatch;
                    let mutation = detectMutation(config.mutation);
                    let v = mutation(
                        collection,
                        eventExecution(config.onData || onData, x, properties)
                    );
                    // console.log("collection",collection);
                    // console.log("x",x);
                    if (onDispatchFunc) {
                        let _dispatch = onDispatchFunc(v, properties);
                        if (_.isFunction(_dispatch)) {
                            // _dispatch(v, x, unlock, close, properties);
                            _dispatch(v);
                        } else {
                            setCollection(v);
                        }
                    } else {
                        setCollection(v);
                    }
                    eventExecution(config.onClose || onClose, { unlock, close }, properties);
                },
                (err) => (errFunc) ? errFunc(err, { unlock, close }) : errorCatch(err, unlock)
            );
        }
    } else {
        console.error("Не задано свойство action для указанного действия")
    }
}
//-------------------------------------------------------------------
//По событию перехода на предыдущую страницу браузера (history.back())
//закрывает текущую модаль, предотвращая полное обновление страницы
const historyCallbackFunctions = {};
export const pushStateHistoryModal = (setVisible, getStack) => {
    if (typeof window === 'undefined') return;
    //История браузера
    //https://developer.mozilla.org/ru/docs/Web/API/History_API
    var cbFuncName = 'modal_' + uuid();
    window.history.replaceState({ ...window.history.state, cb: cbFuncName }, '');
    window.history.pushState(null, null, '');
    if (typeof window.historyCallbackFunctions === 'undefined') window.historyCallbackFunctions = historyCallbackFunctions;
    window.historyCallbackFunctions[cbFuncName] = function (e) {
        delete window.historyCallbackFunctions[cbFuncName];
        setVisible(false);

        window.history.replaceState({ ...window.history.state, cb: undefined }, '');
        if (getStack) {
            var stack = getStack();
            while (stack.length > 0) {
                var fun = stack.pop();
                if (fun) {
                    fun();
                }
            }
        }
    };
}
//-------------------------------------------------------------------
export function ycStorage(auth) {
    return "https://storage.yandexcloud.net/"
}
export function ycBucket(auth) {
    var bucketName = "federation"
    if (auth.appProfile != "prod") {
        bucketName = "federation-dev"
    }
    return bucketName;
}
//-------------------------------------------------------------------
export const updateInPropertiesUUID = (properties, item, first) => {
    let key = "uuid"
    if (!properties) properties = [];
    if (!item || !item[key]) return properties;
    if (_.findIndex(properties, { [key]: item[key] }) >= 0) {
        return properties?.map(e => IfElse(e[key] === item[key], { ...e, ...item }, e));
    } else {
        return (first) ? [item, ...properties] : [...properties, item];
    }
}
export const updateInProperties = (properties, item, first) => {
    let key = "name"
    if (!properties) properties = [];
    if (!item || !item[key]) return properties;
    if (_.findIndex(properties, { [key]: item[key] }) >= 0) {
        return properties?.map(e => IfElse(e[key] === item[key], { ...e, ...item }, e));
    } else {
        return (first) ? [item, ...properties] : [...properties, item];
    }
}
export const deleteInPropertiesUUID = (properties, item) => {
    let key = "uuid"
    if (!properties) properties = [];
    if (!item || (!_.isArray(item) && _.isObject(item) && !item[key])) return properties;
    let i = unwrap(item);
    if (_.isArray(i)) {
        return properties?.filter(e => And(i.map(c => e[key] !== ((_.isObject(c)) ? c[key] : c))))
    }
    return properties?.filter(e => e[key] !== item[key]);
}
export const deleteInProperties = (properties, item) => {
    let key = "name"
    if (!properties) properties = [];
    if (!item || (!_.isArray(item) && _.isObject(item) && !item[key])) return properties;
    let i = unwrap(item);
    if (_.isArray(i)) {
        return properties?.filter(e => And(i.map(c => e[key] !== ((_.isObject(c)) ? c[key] : c))))
    }
    return properties?.filter(e => e[key] !== item[key]);
}
export const triggerInPropertiesUUID = (properties, item) => {
    let key = "uuid"
    if (properties.find(x => x[key] === item[key]) !== undefined) {
        return deleteInArray(properties, item);
    } else {
        return updateInArray(properties, item);
    }
}
export const triggerInProperties = (properties, item) => {
    let key = "name"
    if (properties.find(x => x[key] === item[key]) !== undefined) {
        return deleteInArray(properties, item);
    } else {
        return updateInArray(properties, item);
    }
}
export const foreachInProperties = (properties, func, item) => {
    if (!properties) properties = [];
    if (!item) return properties;
    return properties.map(n => And(func(n)) ? { ...n, ...((_.isFunction(item)) ? item(n) : item) } : n)
}
export const updatePropertiesInProperties = (properties, items) => {
    if (!properties) properties = [];
    if (_.isArray(items)) {
        let tmp = [...properties];
        for (let i = 0; i < items.length; i++) {
            const it = items[i];
            tmp = updateInProperties(tmp, it);
        }
        return tmp;
    } else {
        return updateInProperties(properties, items);
    }
}
export const deletePropertiesInProperties = (properties, items) => {
    if (!properties) properties = [];
    if (_.isArray(items)) {
        let tmp = [...properties];
        for (let i = 0; i < items.length; i++) {
            const it = items[i];
            tmp = deleteInProperties(tmp, it);
        }
        return tmp;
    } else {
        return deleteInProperties(properties, items);
    }
}
export const triggerPropertiesInProperties = (properties, items) => {
    if (!properties) properties = [];
    if (_.isArray(items)) {
        let tmp = [...properties];
        for (let i = 0; i < items.length; i++) {
            const it = items[i];
            tmp = triggerInProperties(tmp, it);
        }
        return tmp;
    } else {
        return triggerInProperties(properties, items);
    }
}
