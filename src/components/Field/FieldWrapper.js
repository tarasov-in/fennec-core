import React, { useState } from 'react';
import { FieldLayout } from './FieldLayout';
import { ActionsSpace } from './ActionsSpace';

export function FieldWrapper({ wrapperProps, formItem, auth, item, value, onChange, children }) {
    const [loading, setLoading] = useState(false);
    return (
        <FieldLayout formItem={formItem} item={item} style={item?.fieldLayoutStyle || { width: "100%" }}>
            <ActionsSpace auth={auth} item={item} value={value} onChange={onChange} loading={loading} setLoading={setLoading} {...wrapperProps}>
                {children}
            </ActionsSpace>
        </FieldLayout>
    );
}
