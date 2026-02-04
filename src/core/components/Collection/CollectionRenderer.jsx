/**
 * CollectionRenderer - UI rendering for Collection component using UIAdapter
 *
 * Renders collection as table/list with filtering, sorting, pagination,
 * and CRUD actions through adapter.
 */

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { CollectionCore } from './CollectionCore'
import { useUIAdapter } from '../../../adapters/UIProvider'
import { useMetaContext } from '../../../Components/Context'
import { Field } from '../../../Components/Desktop/Field/Field'
import { Action } from '../../../Components/Desktop/Action/Action'
import { Model } from '../../../Components/Desktop/Model/Model'
import { Overlay } from '../../../Components/Overlay'
import { PopoverModal } from '../../../Components/PopoverModal'
import {
  GET,
  GETWITH,
  READWITH,
  errorCatch,
  getLocator,
  clean,
  unwrap,
  JSXMap,
  subscribe as _subscribe,
  unsubscribe
} from '../../utils'
import _ from 'lodash'

// Neutral SVG icons (no UI-library dependency). Adapters may override via adapter.Icons.
const svgProps = { width: '1em', height: '1em', viewBox: '0 0 1024 1024', fill: 'currentColor', 'aria-hidden': true }
const IconFilter = (props) => (
  <svg {...svgProps} {...props}>
    <path d="M880.1 154H143.9c-24.5 0-39.8 26.7-27.5 48L349 597.4V838c0 17.7 14.2 32 31.8 32h262.4c17.6 0 31.8-14.3 31.8-32V597.4L907.7 202c12.2-21.3-3.1-48-27.6-48z" />
  </svg>
)
const IconSortAsc = (props) => (
  <svg {...svgProps} {...props}>
    <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z" />
  </svg>
)
const IconSortDesc = (props) => (
  <svg {...svgProps} {...props}>
    <path d="M884 768H140c-6.5 0-10.3-7.4-6.5-12.7l352.6-486.1c12.8-17.6 39-17.6 51.7 0l352.6 486.1c3.9 5.3-.1 12.7-6.4 12.7z" />
  </svg>
)
const IconFullscreen = (props) => (
  <svg {...svgProps} {...props}>
    <path d="M290 236.4l43.9-43.9a8 8 0 0 0 0-11.3l-50.7-50.7a8 8 0 0 0-11.3 0L237 173.3a8 8 0 0 0 0 11.3l43.9 43.9a8 8 0 0 0 11.3 0l50.7-50.7a8 8 0 0 0 0-11.3zM734 236.4l43.9-43.9a8 8 0 0 0 0-11.3l-50.7-50.7a8 8 0 0 0-11.3 0L681 173.3a8 8 0 0 0 0 11.3l43.9 43.9a8 8 0 0 0 11.3 0l50.7-50.7a8 8 0 0 0 0-11.3zM290 787.6l43.9 43.9a8 8 0 0 0 11.3 0l50.7-50.7a8 8 0 0 0 0-11.3L347 734.7a8 8 0 0 0-11.3 0l-50.7 50.7a8 8 0 0 0 0 11.3l43.9 43.9zM734 787.6l43.9 43.9a8 8 0 0 0 11.3 0l50.7-50.7a8 8 0 0 0 0-11.3L787 734.7a8 8 0 0 0-11.3 0l-50.7 50.7a8 8 0 0 0 0 11.3l43.9 43.9z" />
  </svg>
)
const IconFullscreenExit = (props) => (
  <svg {...svgProps} {...props}>
    <path d="M391 240c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h240c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H391zm0 288c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h240c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H391zm-64 96c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h304c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H327zm0-288c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h304c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H327z" />
  </svg>
)

/**
 * SortingFieldsUI - Sorting controls component
 */
function SortingFieldsUI(props) {
  const { filters, value, onChange, locator, object, dividerStyle, dividerClassName, contentStyle, contentClassName, sortRowStyle, selectStyle } = props
  const adapter = useUIAdapter()

  const Select = adapter.Select
  const Option = Select?.Option || adapter.Select
  const Button = adapter.Button
  const Tooltip = adapter.Tooltip
  const Divider = adapter.Divider
  const Icons = adapter.Icons || {}
  const SortAscIcon = Icons.SortAscending || IconSortAsc
  const SortDescIcon = Icons.SortDescending || IconSortDesc

  return (
    <>
      <Divider
        type="horizontal"
        orientation="left"
        style={dividerStyle}
        className={dividerClassName}
      >
        Сортировка
      </Divider>
      <div data-locator={getLocator(locator || 'sorting', object)} style={contentStyle} className={contentClassName}>
        <div style={sortRowStyle}>
          <Select
            data-locator={getLocator(locator || 'sortingselect', object)}
            allowClear={true}
            value={value.name}
            onChange={(v) => onChange({ name: v, order: value.order })}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            style={selectStyle}
          >
            {JSXMap(filters?.filter(f => f.sort), (item, idx) => (
              <Option data-locator={getLocator(locator || 'sortingitem', object || idx)} key={idx} value={item.name}>
                {item.label}
              </Option>
            ))}
          </Select>
          <div>
            {value.order === 'ASC' && (
              <Tooltip title="Восходящий">
                <Button
                  icon={<SortAscIcon />}
                  data-locator={getLocator(locator || 'sortingasc', object)}
                  onClick={() => onChange({ name: value.name, order: 'DESC' })}
                />
              </Tooltip>
            )}
            {value.order === 'DESC' && (
              <Tooltip title="Нисходящий">
                <Button
                  icon={<SortDescIcon />}
                  data-locator={getLocator(locator || 'sortingdesc', object)}
                  onClick={() => onChange({ name: value.name, order: 'ASC' })}
                />
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

/**
 * FiltersFieldsUI - Filters controls component
 */
function FiltersFieldsUI(props) {
  const { auth, filters, funcs, value, onChange, locator, object, dividerStyle, dividerClassName, contentStyle, contentClassName, fieldWrapperStyle } = props
  const adapter = useUIAdapter()
  const Divider = adapter.Divider
  const Text = adapter.Typography?.Text || 'span'

  const _onFilterChange = useMemo(() => (v, item) => {
    if ((!v && !item?.permanent) || (item?.permanent && (v === undefined || v === null)) || (_.isArray(v) && v.length == 0)) {
      let f = { ...value }
      delete f[item.name]
      onChange(f)
      return
    } else {
      let newFiltr = { ...value, [item.name]: v }
      onChange(newFiltr)
    }
  }, [value, onChange])

  return (
    <>
      <Divider
        type="horizontal"
        orientation="left"
        style={dividerStyle}
        className={dividerClassName}
      >
        Фильтры
      </Divider>
      <div data-locator={getLocator(locator || 'filters', object)} style={contentStyle} className={contentClassName}>
        <div>
          {JSXMap(filters?.filter(i => i.filter), (item, idx) => (
            <div data-locator={getLocator(locator || 'filtersfield', object)} key={item.name} style={fieldWrapperStyle}>
              {item.filter && (item.type !== 'bool' && item.type !== 'boolean') && <Text>{item.label}</Text>}
              <Field
                mode="filter"
                formItem={true}
                key={item.name}
                auth={auth}
                item={{ ...item, func: (funcs && funcs[item?.name?.toLowerCase()]) ? funcs[item.name.toLowerCase()] : {} }}
                value={value[item.name]}
                onChange={(value) => _onFilterChange(value, item)}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

/**
 * FilterButton - Filter toggle button component
 */
function FilterButton(props) {
  const ref = useRef(null)
  const { setBounding, filtered, setFiltered, state, locator, object, name, fieldName, className, style, iconStyle } = props
  const adapter = useUIAdapter()
  const Badge = adapter.Badge
  const FilterIcon = adapter.Icons?.Filter || IconFilter

  useEffect(() => {
    if (ref.current && setBounding) {
      setBounding(ref.current.getBoundingClientRect())
    }
  }, [ref, setBounding])

  return (
    <div
      className={className}
      style={style}
      ref={ref}
      data-locator={getLocator(locator || 'collectionfilter-' + name || 'collectionfilter-' + fieldName || 'collectionfilter', object)}
      onClick={e => setFiltered(o => !o)}
    >
      <Badge dot={(state && state.filter && Object.keys(state.filter)?.length > 0) ? true : false}>
        <FilterIcon style={iconStyle} />
      </Badge>
    </div>
  )
}

/**
 * FilterContent - Filter panel content component
 */
function FilterContent(props) {
  const {
    auth,
    filters,
    sorting,
    setSorting,
    state,
    funcStat,
    filtered,
    locator,
    object,
    name,
    fieldName,
    _onFilterChange,
    applyFilter,
    clearFilter,
    applyWrapperStyle,
    applyButtonStyle,
    clearWrapperStyle,
    clearButtonStyle,
    dividerStyle,
    dividerClassName,
    sortContentStyle,
    sortContentClassName,
    sortRowStyle,
    selectStyle,
    filtersContentStyle,
    filtersContentClassName,
    fieldWrapperStyle
  } = props

  const adapter = useUIAdapter()
  const Button = adapter.Button

  return (
    <>
      {(() => {
        const fl = filters?.filter(i => i.filter)
        if (filtered && fl.length > 0) {
          return (
            <>
              <div style={applyWrapperStyle}>
                <Button
                  data-locator={getLocator(locator || 'collectionfilterapply-' + name || 'collectionfilterapply-' + fieldName || 'collectionfilterapply', object)}
                  style={applyButtonStyle}
                  disabled={!state.filterChanged}
                  type="primary"
                  onClick={applyFilter}
                >
                  Применить
                </Button>
              </div>
              <div style={clearWrapperStyle}>
                <Button
                  data-locator={getLocator(locator || 'collectionfilterclear-' + name || 'collectionfilterclear-' + fieldName || 'collectionfilterclear', object)}
                  style={clearButtonStyle}
                  disabled={_.isEmpty(state.filter)}
                  onClick={clearFilter}
                >
                  Очистить
                </Button>
              </div>
            </>
          )
        }
        return null
      })()}
      <SortingFieldsUI value={sorting} onChange={setSorting} filters={filters} locator={locator} object={object} dividerStyle={dividerStyle} dividerClassName={dividerClassName} contentStyle={sortContentStyle} contentClassName={sortContentClassName} sortRowStyle={sortRowStyle} selectStyle={selectStyle} />
      <FiltersFieldsUI auth={auth} value={state.newFilter} onChange={_onFilterChange} filters={filters} funcs={funcStat} locator={locator} object={object} dividerStyle={dividerStyle} dividerClassName={dividerClassName} contentStyle={filtersContentStyle} contentClassName={filtersContentClassName} fieldWrapperStyle={fieldWrapperStyle} />
    </>
  )
}

/**
 * CollectionRenderer - Main collection component
 */
/**
 * When renderShell is provided, it receives { children, ...shellContext }.
 * User builds the entire layout; toolbar, filters, pagination, fullscreen are optional.
 * - children: React node from render(collection, renderContext)
 * - collection, setCollection, setCollectionItem, removeCollectionItem, collectionActions, modelActions, update, lastFuncStat, lock, unlock, loading
 * - hasFilters, filters, sorting, setSorting, state, filtered, setFiltered, _onFilterChange, applyFilter, clearFilter, setBounding, bounding
 * - pagination: { enabled, current, total, count, totalPages, setCurrent, setCount }
 * - fullscreen: { allowed, fullscreen, setFullscreen }
 * - adapter, getLocator, auth, locator, object, name, fieldName
 * - Default UI blocks (FilterButton, FilterContent, SortingFieldsUI, FiltersFieldsUI, etc.) are exported from this module for optional use.
 */
export function CollectionRenderer(props) {
  const {
    auth,
    name,
    fieldName,
    meta: propMeta,
    filters: propFilters,
    contextFilters,
    source,
    queryDetail,
    render,
    renderShell,
    collectionActions,
    modelActions,
    onCollectionChange,
    onSetCollection,
    locator,
    pagination: paginationProp = true,
    allowFullscreen = false,
    onApplyFilter,
    disableScrollTo,
    headerStyle,
    headerClassName,
    headerToolbarStyle,
    collectionActionsStyle,
    collectionActionsClassName,
    paginationWrapperStyle,
    paginationWrapperClassName,
    cardStyle,
    cardClassName,
    filterButtonClassName,
    filterButtonStyle,
    filterButtonIconStyle,
    filterContentApplyWrapperStyle,
    filterContentApplyButtonStyle,
    filterContentClearWrapperStyle,
    filterContentClearButtonStyle,
    filterContentDividerStyle,
    filterContentDividerClassName,
    filterContentSortContentStyle,
    filterContentSortContentClassName,
    filterContentSortRowStyle,
    filterContentSelectStyle,
    filterContentFiltersContentStyle,
    filterContentFiltersContentClassName,
    filterContentFieldWrapperStyle,
    overlayStyle: overlayStyleProp,
    overlayBackdropStyle,
    overlayContentStyle,
    overlayContentClassName
  } = props

  const adapter = useUIAdapter()
  const gmeta = useMetaContext()

  const Pagination = adapter.Pagination
  const Button = adapter.Button
  const Card = adapter.Card

  const collectionCore = useMemo(() => {
    return new CollectionCore({
      name,
      meta: propMeta,
      filters: propFilters,
      contextFilters,
      queryDetail
    })
  }, [name, propMeta, propFilters, contextFilters, queryDetail])

  // Get filters and metadata
  const fltrs = useMemo(() => (propFilters ? propFilters() : []), [propFilters])
  const meta = propMeta || gmeta

  // State management
  const [loading, setLoading] = useState(false)
  const [collection, _setCollection] = useState([])
  const [response, setResponse] = useState()
  const [funcStat, setFuncStat] = useState()
  const [filters, setFilters] = useState()
  const [mobject, setMObject] = useState()
  const [fullscreen, setFullscreen] = useState(false)

  const [state, setState] = useState({
    filter: collectionCore.getDefaultFilters(fltrs),
    newFilter: collectionCore.getDefaultFilters(fltrs),
    filterChanged: false
  })
  const [filtered, setFiltered] = useState(false)
  const [sorting, setSorting] = useState(collectionCore.getDefaultSorting(fltrs))
  const [current, _setCurrent] = useState(1)
  const [count, setCount] = useState(20)
  const [total, setTotal] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [bounding, setBounding] = useState()

  // Pagination wrapper
  const setCurrent = useCallback((value) => {
    _setCurrent(value)
    if (!disableScrollTo && typeof window !== 'undefined') {
      window.scrollTo(0, 0)
    }
  }, [disableScrollTo])

  // Lock/unlock loading
  const lock = () => setLoading(true)
  const unlock = () => setLoading(false)

  // Enrich filters with metadata
  useEffect(() => {
    if (name && meta) {
      let mo = meta[name] || meta[name.toLowerCase()]
      if (mo) {
        setMObject(mo)
        if (propFilters) {
          let f = collectionCore.enrichFiltersWithMetadata(fltrs, meta, mo)
          setFilters(f)
        }
      }
    } else {
      setFilters(fltrs)
    }
  }, [name, meta, fltrs, collectionCore, propFilters])

  // Collection management
  const setCollection = useCallback((array) => {
    if (onSetCollection) {
      let result = onSetCollection(array)
      _setCollection(result)
      if (onCollectionChange) {
        onCollectionChange(result)
      }
    } else {
      _setCollection(array)
      if (onCollectionChange) {
        onCollectionChange(array)
      }
    }
  }, [onSetCollection, onCollectionChange])

  const setCollectionItem = useCallback((item) => {
    setCollection(collectionCore.updateCollectionItem(collection, item))
  }, [collection, collectionCore, setCollection])

  const removeCollectionItem = useCallback((item) => {
    setCollection(collectionCore.removeCollectionItem(collection, item))
  }, [collection, collectionCore, setCollection])

  // Filter management
  const _onFilterChange = useCallback((newFilter) => {
    const filterChanged = collectionCore.hasFiltersChanged(state.filter, newFilter)
    setState({ ...state, newFilter, filterChanged })
  }, [state, collectionCore])

  const clearFilter = useCallback(() => {
    setFuncStat(undefined)
    setState({ filter: {}, newFilter: {}, filterChanged: false })
    setCurrent(1)
    if (onApplyFilter) {
      onApplyFilter({
        filters,
        page: 1,
        count,
        queryDetail,
        contextFilters,
        sorting,
        filter: {},
        queryParams: []
      })
    }
  }, [filters, count, queryDetail, contextFilters, sorting, onApplyFilter, setCurrent])

  const applyFilter = useCallback(() => {
    const newState = { ...state, filterChanged: false, filter: state.newFilter }
    setState(newState)
    setCurrent(1)
    if (onApplyFilter) {
      const queryParams = collectionCore.buildQueryParams(
        filters,
        contextFilters,
        newState.filter,
        sorting,
        1,
        count,
        queryDetail
      )
      onApplyFilter({
        filters,
        page: 1,
        count,
        queryDetail,
        contextFilters,
        sorting,
        filter: newState.filter,
        queryParams
      })
    }
  }, [state, filters, contextFilters, sorting, count, queryDetail, onApplyFilter, collectionCore, setCurrent])

  // Data loading
  const request = useCallback((filter) => {
    if (!meta || !filters) return

    const queryParams = collectionCore.buildQueryParams(
      filters,
      contextFilters,
      filter,
      sorting,
      current,
      count,
      queryDetail
    )

    if (source && _.isFunction(source)) {
      source({
        lock,
        unlock,
        page: current,
        count,
        sorting,
        filter,
        apply: (data) => {
          if (data?.stat) {
            setFuncStat(data?.stat)
          }
          setCurrent(data?.number || current)
          setTotalPages(data?.totalPages || 1)
          setCount(data?.size || count)
          setTotal(data?.totalElements || 0)
          setCollection(data?.content || [])
          setResponse(data)
          unlock()
        }
      })
    } else {
      const url = unwrap(source)
      if (!url) return

      lock()
      READWITH(
        auth,
        url,
        queryParams,
        (data) => {
          if (data?.stat) {
            setFuncStat(data?.stat)
          }
          setCurrent(data?.number || current)
          setTotalPages(data?.totalPages || 1)
          setCount(data?.size || count)
          setTotal(data?.totalElements || 0)
          setCollection(data?.content || [])
          setResponse(data)
          unlock()
        },
        (err) => {
          errorCatch(err)
          unlock()
        }
      )
    }
  }, [auth, source, meta, filters, contextFilters, sorting, current, count, queryDetail, collectionCore, setCollection])

  // Load data on state changes
  useEffect(() => {
    request(state.filter)
  }, [state.filter, sorting, current, count])

  // Context for user's render function
  const renderContext = useMemo(
    () => ({
      collection,
      setCollection,
      setCollectionItem,
      removeCollectionItem,
      collectionActions,
      modelActions,
      update: request,
      lastFuncStat: funcStat,
      lock,
      unlock,
      loading
    }),
    [
      collection,
      setCollection,
      setCollectionItem,
      removeCollectionItem,
      collectionActions,
      modelActions,
      request,
      funcStat,
      lock,
      unlock,
      loading
    ]
  )

  // Context for renderShell: full state/callbacks so user builds layout (toolbar, filters, pagination optional)
  const hasFilters = Boolean(filters && filters.some(f => f.filter || f.sort))
  const shellContext = useMemo(
    () => ({
      ...renderContext,
      hasFilters,
      filters,
      sorting,
      setSorting,
      state,
      filtered,
      setFiltered,
      _onFilterChange,
      applyFilter,
      clearFilter,
      setBounding,
      bounding,
      pagination: {
        enabled: paginationProp,
        current,
        total,
        count,
        totalPages,
        setCurrent,
        setCount
      },
      fullscreen: {
        allowed: allowFullscreen,
        fullscreen,
        setFullscreen
      },
      auth,
      locator,
      object: mobject,
      name,
      fieldName,
      getLocator,
      adapter
    }),
    [
      renderContext,
      hasFilters,
      filters,
      sorting,
      state,
      filtered,
      _onFilterChange,
      applyFilter,
      clearFilter,
      bounding,
      paginationProp,
      current,
      total,
      count,
      totalPages,
      setCurrent,
      allowFullscreen,
      fullscreen,
      auth,
      locator,
      mobject,
      name,
      fieldName,
      adapter
    ]
  )

  // Render filter panel
  const renderFilterPanel = () => {
    if (!filters || !filters.some(f => f.filter || f.sort)) return null

    return (
      <PopoverModal
        open={filtered}
        setOpen={setFiltered}
        bounding={bounding}
        content={
          <FilterContent
            auth={auth}
            filters={filters}
            sorting={sorting}
            setSorting={setSorting}
            state={state}
            funcStat={funcStat}
            filtered={filtered}
            locator={locator}
            object={mobject}
            name={name}
            fieldName={fieldName}
            _onFilterChange={_onFilterChange}
            applyFilter={applyFilter}
            clearFilter={clearFilter}
            applyWrapperStyle={filterContentApplyWrapperStyle}
            applyButtonStyle={filterContentApplyButtonStyle}
            clearWrapperStyle={filterContentClearWrapperStyle}
            clearButtonStyle={filterContentClearButtonStyle}
            dividerStyle={filterContentDividerStyle}
            dividerClassName={filterContentDividerClassName}
            sortContentStyle={filterContentSortContentStyle}
            sortContentClassName={filterContentSortContentClassName}
            sortRowStyle={filterContentSortRowStyle}
            selectStyle={filterContentSelectStyle}
            filtersContentStyle={filterContentFiltersContentStyle}
            filtersContentClassName={filterContentFiltersContentClassName}
            fieldWrapperStyle={filterContentFieldWrapperStyle}
          />
        }
      >
        <FilterButton
          setBounding={setBounding}
          filtered={filtered}
          setFiltered={setFiltered}
          state={state}
          locator={locator}
          object={mobject}
          name={name}
          fieldName={fieldName}
          className={filterButtonClassName}
          style={filterButtonStyle}
          iconStyle={filterButtonIconStyle}
        />
      </PopoverModal>
    )
  }

  // Render collection actions
  const renderCollectionActions = () => {
    if (!collectionActions || !collectionActions.length) return null

    return (
      <div style={collectionActionsStyle} className={collectionActionsClassName}>
        {collectionActions.map((action, idx) => (
          <Action
            key={idx}
            auth={auth}
            action={action}
            object={mobject}
          />
        ))}
      </div>
    )
  }

  // Render header
  const renderHeader = () => {
    return (
      <div style={headerStyle} className={headerClassName}>
        <div style={headerToolbarStyle}>
          {renderFilterPanel()}
          {renderCollectionActions()}
        </div>
        {allowFullscreen && (() => {
          const FullscreenIcon = fullscreen ? (adapter.Icons?.FullscreenExit || IconFullscreenExit) : (adapter.Icons?.Fullscreen || IconFullscreen)
          return (
            <Button
              icon={<FullscreenIcon />}
              onClick={() => setFullscreen(!fullscreen)}
            />
          )
        })()}
      </div>
    )
  }

  // Render pagination
  const renderPagination = () => {
    if (!paginationProp) return null

    return (
      <div style={paginationWrapperStyle} className={paginationWrapperClassName}>
        <Pagination
          current={current}
          total={total}
          pageSize={count}
          onChange={(page, pageSize) => {
            setCurrent(page)
            if (pageSize !== count) {
              setCount(pageSize)
            }
          }}
          showSizeChanger
          showTotal={(total) => `Всего ${total} записей`}
        />
      </div>
    )
  }

  // When renderShell is provided: user defines entire layout; toolbar, filters, pagination are optional
  if (typeof renderShell === 'function') {
    const children =
      typeof render === 'function' ? render(collection, renderContext) : null
    return renderShell({ children, ...shellContext })
  }

  // Default layout: header (filters/actions/fullscreen) + content + pagination; elements shown only when relevant
  const content = (
    <div data-locator={getLocator(locator || name || fieldName || 'collection', mobject)}>
      {renderHeader()}
      {typeof render === 'function'
        ? render(collection, renderContext)
        : null}
      {renderPagination()}
    </div>
  )

  if (fullscreen) {
    const defaultOverlayStyle = { position: 'fixed', inset: 0, zIndex: 100 }
    const defaultOverlayBackdropStyle = { padding: '5px', backgroundColor: 'rgba(0,0,0,0.4)', height: '100%', width: '100%' }
    const defaultOverlayContentStyle = { position: 'relative', width: '100%', height: '100%', overflowY: 'auto', overflowX: 'hidden', padding: '5px', backgroundColor: 'white', borderRadius: '4px' }
    return (
      <Overlay
        open={fullscreen}
        setOpen={() => setFullscreen(false)}
        overlayStyle={overlayStyleProp ?? defaultOverlayStyle}
        overlayBackdropStyle={overlayBackdropStyle ?? defaultOverlayBackdropStyle}
        contentStyle={overlayContentStyle ?? defaultOverlayContentStyle}
        contentClassName={overlayContentClassName}
      >
        <Card style={cardStyle} className={cardClassName}>
          {content}
        </Card>
      </Overlay>
    )
  }

  return content
}

export { SortingFieldsUI, FiltersFieldsUI, FilterButton, FilterContent }
