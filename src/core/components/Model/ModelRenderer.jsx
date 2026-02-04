/**
 * ModelRenderer - UI rendering for Model component using UIAdapter
 *
 * Renders model form fields and one-to-many relations through adapter.
 * Handles all UI concerns while delegating business logic to ModelCore.
 */

import React, { useState, useEffect, useCallback } from 'react'
import { ModelCore } from './ModelCore'
import { useUIAdapter } from '../../../adapters/UIProvider'
import { useFormObserverContext, useMetaContext } from '../../../Components/Context'
import { Field } from '../../../Components/Desktop/Field/Field'
import { getObjectDisplay, getLocator } from '../../utils'
import _ from 'lodash'

export function ModelRenderer(props) {
  const {
    auth,
    form,
    name,
    meta,
    options,
    object,
    data,
    locator,
    submit,
    funcStat,
    contextFilters,
    links,
    scheme,
    linksCompareFunction,
    contextObject,
    queryDetail,
    modelActions,
    collectionActions,
    relationTabsWrapperStyle,
    relationTabsWrapperClassName,
    headerStyle,
    headerClassName,
    headerLabelStyle,
    headerContentStyle,
    headerActionsStyle,
    headerTagStyle,
    formWrapperStyle,
    formWrapperClassName,
    rootClassName,
    rootStyle
  } = props

  const adapter = useUIAdapter()
  const gmeta = useMetaContext()

  const [visible, setVisible] = useState(false)
  const [isChangedForm, isChangedField, onValuesChange] = useFormObserverContext()

  // Create ModelCore instance
  const modelCore = React.useMemo(() => {
    return new ModelCore({
      meta,
      object,
      contextFilters,
      scheme,
      linksCompareFunction
    })
  }, [meta, object, contextFilters, scheme, linksCompareFunction])

  // Get properties from ModelCore
  const properties = modelCore.getProperties()
  const propertiesForRendering = modelCore.getPropertiesForRendering()
  const propertiesOneMany = modelCore.getOneToManyRelations()
  const tailScheme = modelCore.getTailScheme()
  const hasRelations = modelCore.hasOneToManyRelations()
  const initialValues = modelCore.getInitialValues()

  // Reset form when object changes
  useEffect(() => {
    form.resetFields()
    if (object) {
      form.setFieldsValue(object)
    }
  }, [object, form])

  // UI Components from adapter
  const AntForm = adapter.Form
  const FormItem = adapter.FormItem
  const Tooltip = adapter.Tooltip
  const Tag = adapter.Tag
  const CheckableTag = Tag?.CheckableTag || Tag // Fallback
  const Tabs = adapter.Tabs
  const TabPane = adapter.TabPane || Tabs?.TabPane // Fallback

  if (!properties) return null

  // Render functional fields (type: 'func')
  const renderFunctionalField = (property, idx) => {
    if (!property.render) return null
    return (
      <div key={'func_' + idx}>
        {property.render(auth, property, { data, object, contextObject, funcStat })}
      </div>
    )
  }

  // Render regular form field
  const renderFormField = (property) => {
    return (
      <FormItem
        preserve={property.hidden ? 'true' : 'false'}
        hidden={property.hidden}
        key={property.name}
        name={modelCore.getFieldName(property)}
        label={modelCore.getPropertyLabel(property)}
        rules={modelCore.getValidationRules(property)}
        data-locator={getLocator(locator || name || 'model', object)}
      >
        <Field
          mode="model"
          key={property.name}
          objectName={name}
          contextObject={contextObject}
          auth={auth}
          formItem={true}
          data={data}
          item={{
            ...property,
            filterType: undefined,
            func: (funcStat && funcStat[property.name?.toLowerCase()])
              ? funcStat[property.name.toLowerCase()]
              : {}
          }}
          isChanged={
            isChangedField
              ? isChangedField(modelCore.getFieldName(property))
              : undefined
          }
        />
      </FormItem>
    )
  }

  // Render one-to-many relations as tabs
  const renderRelationTabs = () => {
    if (!hasRelations || !links) return null

    return (
      <div style={{ display: (visible || links === 'inline') ? 'block' : 'none', ...(relationTabsWrapperStyle || {}) }} className={relationTabsWrapperClassName}>
        <Tabs>
          {propertiesOneMany.map((property, idx) => {
            const relationName = _.get(property, 'relation.reference.object')

            if (!relationName) return null

            return (
              <TabPane
                data-locator={getLocator(
                  locator || 'model-collection' + name || 'model-collection',
                  object
                )}
                tab={property.label}
                key={idx}
              >
                {/* <CollectionByProperty
                  auth={auth}
                  item={property}
                  object={object}
                  linksCompareFunction={linksCompareFunction}
                  linksModelActions={links}
                  scheme={scheme}
                  queryDetail={queryDetail}
                  modelActions={modelActions}
                  collectionActions={collectionActions}
                /> */}
              </TabPane>
            )
          })}
        </Tabs>
      </div>
    )
  }

  // Render header with links toggle
  const renderHeader = () => {
    if (!object || !links || links === 'inline' || !hasRelations) return null

    return (
      <div
        className={headerClassName}
        style={headerStyle}
      >
        <div style={headerContentStyle}>
          {meta.name && visible && (
            <div style={headerLabelStyle}>
              <div>{meta.label}</div>
            </div>
          )}
          <div>
            {meta.name && visible && getObjectDisplay(object, meta.name, gmeta)}
          </div>
        </div>
        <div style={headerActionsStyle}>
          <Tooltip title="Связи">
            <CheckableTag
              style={headerTagStyle}
              checked={visible}
              onChange={checked => setVisible(checked)}
            >
              <i className="fa fa-link"></i>
            </CheckableTag>
          </Tooltip>
        </div>
      </div>
    )
  }

  return (
    <div
      data-locator={getLocator(locator || name || 'model', object)}
      className={rootClassName}
      style={rootStyle}
    >
      {renderHeader()}

      <div style={{ display: !visible ? 'block' : 'none', ...(formWrapperStyle || {}) }} className={formWrapperClassName}>
        <AntForm
          form={form}
          onFinish={submit}
          onValuesChange={onValuesChange}
          initialValues={initialValues}
          {...options}
          labelAlign="left"
          layout="vertical"
        >
          {propertiesForRendering.map((property, idx) => {
            // Functional fields
            if (modelCore.isFunctionalProperty(property)) {
              return renderFunctionalField(property, idx)
            }

            // Regular form fields
            return renderFormField(property)
          })}
        </AntForm>
      </div>

      {renderRelationTabs()}
    </div>
  )
}
