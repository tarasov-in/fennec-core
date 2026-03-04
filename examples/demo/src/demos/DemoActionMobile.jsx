import React from 'react';
import { UIProvider } from 'fennec-core';
import { AntdMobileAdapter } from 'fennec-core/adapters/antd-mobile';
import DemoAction from './DemoAction';

const mobileAdapter = new AntdMobileAdapter();

/**
 * Демо Action с адаптером antd-mobile.
 * Та же сцена (форма с подчинённой таблицей/списком строк), что и DemoAction,
 * но через AntdMobileAdapter: Field строит поля через ui.renderField(),
 * confirm/Modal/Button/Form/List — из мобильного адаптера.
 * Переключение десктоп/мобиле — только замена провайдера адаптера.
 */
export default function DemoActionMobile() {
  return (
    <UIProvider adapter={mobileAdapter}>
      <DemoAction />
    </UIProvider>
  );
}
