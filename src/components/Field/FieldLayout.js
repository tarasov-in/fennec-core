import React from 'react';

export function FieldLayout({ formItem, item, children, style }) {
    return (
        <div style={style}>
            <div>
                {(item?.label && !formItem) && <div style={{}}>{item?.label}</div>}
                {(item?.description && item?.description !== item?.label) && (
                    <div style={{ color: "rgb(140, 152, 164)", fontSize: "12px" }}>
                        {item?.description}
                    </div>
                )}
            </div>
            {children}
        </div>
    );
}
