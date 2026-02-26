import React, { useState, useEffect } from 'react';
import { Button, Dropdown, Menu } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { getLocator } from '../../core/utils';
import { publish } from '../../core/pubsub';
import { useAuth } from '../../Auth';
import { Action } from '../Action';
import { JSXMap } from '../../core/utils';

export function DropdownAction(props) {
    const { button, menuOptions, items, style, icon } = props;
    const auth = useAuth();
    const [actions, setActions] = useState([]);
    useEffect(() => {
        if (items) {
            setActions(items?.filter(e => !!e)?.map((e, idx) => ({ ...e, _menuKey: e.key ?? `action-${idx}` })) ?? []);
        }
    }, [items]);

    const renderTrigger = () => {
        if (button) {
            return button();
        }
        return (
            <Button
                size="small"
                style={{ padding: "0 6px" }}
                type="default"
                aria-label="Меню действий"
                data-locator={getLocator(props?.locator || "menu", props?.object)}
            >
                {icon || <MenuOutlined />}
            </Button>
        );
    };

    return (
        <div data-locator={getLocator(props?.locator || "dropdownaction", props?.object)} style={style}>
            {JSXMap(actions?.filter(e => (!!e.action || !!e.document)), (e, idx) => {
                const key = e._menuKey ?? e.key ?? idx;
                return (
                    <div key={key}>
                        <Action key={key} auth={auth} object={e} {...e} />
                    </div>
                );
            })}
            <Dropdown
                placement="bottomRight"
                trigger={['click']}
                {...props}
                overlay={
                    <Menu
                        {...menuOptions}
                        selectable={false}
                        items={(actions?.length) ? actions?.map((e) => {
                            if (e.type === 'divider') return e;
                            return {
                                key: e._menuKey ?? e.key,
                                label: e.title || (e.modal ? e.modal.title : ""),
                                danger: e.danger || false
                            };
                        }) : []}
                        onClick={(e) => {
                            if (e.key) publish(`action.${e.key}.click`, e.key);
                        }}
                    />
                }
            >
                {renderTrigger()}
            </Dropdown>
        </div>
    );
}
