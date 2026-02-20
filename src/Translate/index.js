import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { useAuth } from '../Auth';
import { TranslateContext, useUserConfigContext } from '../Context';
import { QueryDetail } from '../core/query';
import { READWITH } from '../core/crud';
import { errorCatch } from '../core/error';

//-------------------------------------------------------------------------------------
const dict = {};
export const t = (value, translate, config) => {
    let translateFunc = translate.bind({ translate, config });
    return translateFunc(value);
};
export function translate(value) {
    if (!_.isString(value)) return "";
    dict[value.toLowerCase().replaceAll(' ', '')] = value;

    if (this.config && this.translate && value) {
        let key = value.toLowerCase().replaceAll(' ', '');
        if (this.translate[key]) {
            let v = this.translate[key][(this.config.lang) ? this.config.lang : "ru"];
            if (!v || v === "") {
                return value;
            }
            return v
        }
    }
    return value;
}

export function TranslateProvider({ children }) {
    const auth = useAuth();
    const [translates, setTranslates] = useState({});
    const [userConfig, setUserConfig] = useUserConfigContext();

    const t = React.useMemo(() => _.bind(translate, {
		translate: translates,
		config: userConfig
	}), [translates, userConfig]);
	// const t = useTranslateContext();
	// console.log(t("да"));

    useEffect(() => {
        // if(!auth.loggedIn()) return;
        READWITH(auth, 'Translate', [
			QueryDetail("model")
		], ({ data }) => {
			if (data.length > 0) {
				let o = Object.fromEntries(data.map(i => {
					return [
						i.key,
						{
							ru: i.ru,
							en: i.en,
							es: i.es
						},
					]
				}));
				setTranslates(o);
			}
		}, errorCatch)
    }, [])

    return <TranslateContext.Provider value={t}>{children}</TranslateContext.Provider>;
}
//-------------------------------------------------------------------------------------
