import React, { useMemo, useCallback, useState } from 'react';
import { useAuth, useUIOptional, UIProvider } from 'fennec-core';
import { AntdMobileAdapter } from 'fennec-core/adapters/antd-mobile';
import { Collection } from 'fennec-core/components/Collection';
import { Action } from 'fennec-core/components/Action';
import { Field } from 'fennec-core/components/Field';

const columns = [
  { title: 'ID', dataIndex: 'ID', key: 'ID', width: 80 },
  { title: 'Название', dataIndex: 'Title', key: 'Title' },
  { title: 'Цена', dataIndex: 'Price', key: 'Price', width: 120 },
];

const DEMO_PRODUCTS = [
  { ID: 1, Title: 'Товар А', Price: 100 },
  { ID: 2, Title: 'Товар Б', Price: 250 },
  { ID: 3, Title: 'Товар В', Price: 75 },
  { ID: 4, Title: 'Услуга Г', Price: 500 },
  { ID: 5, Title: 'Услуга Д', Price: 120 },
  { ID: 6, Title: 'Товар Е', Price: 99 },
  { ID: 7, Title: 'Акция Ж', Price: 50 },
  { ID: 8, Title: 'Акция З', Price: 199 },
];

function demoSource(opts) {
  const { filter = {}, sorting, page = 1, count = 20, apply } = opts;
  let list = [...DEMO_PRODUCTS];

  Object.keys(filter).forEach((key) => {
    const v = filter[key];
    if (v === undefined || v === null || v === '') return;
    list = list.filter((row) => {
      const val = row[key];
      if (typeof val === 'string') {
        return String(val).toLowerCase().includes(String(v).toLowerCase());
      }
      if (typeof val === 'number') {
        const n = Number(v);
        if (Number.isNaN(n)) return true;
        return (
          val === n ||
          (Array.isArray(v) && v.length >= 2 && val >= Number(v[0]) && val <= Number(v[1]))
        );
      }
      return true;
    });
  });

  if (sorting?.name) {
    const dir = sorting.order === 'DESC' ? -1 : 1;
    const name = sorting.name;
    list.sort((a, b) => {
      const va = a[name];
      const vb = b[name];
      if (va === vb) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      return (va < vb ? -1 : 1) * dir;
    });
  }

  const total = list.length;
  const start = (page - 1) * count;
  const content = list.slice(start, start + count);
  const totalPages = Math.max(1, Math.ceil(total / count));

  apply({
    content,
    totalElements: total,
    totalPages,
    number: page,
    size: count,
  });
}

// Мобильная панель фильтров: сортировка (Picker) + поля фильтров (Field из адаптера) + кнопки.
// Реализация в примере — образец для пользователей; в своих приложениях можно делать свою вёрстку.
function MobileFilterPanel({ ctx, ui, getLocator, onClose }) {
  const { state, sorting, setSorting, filters, applyFilter, clearFilter, onFilterChange, auth, funcStat } = ctx;
  const Button = ui?.Button;
  const Picker = ui?.Picker;
  const List = ui?.List;
  const Input = ui?.Input;

  const [sortPickerVisible, setSortPickerVisible] = useState(false);

  const sortOptions = useMemo(
    () => filters?.filter((f) => f.sort).map((f) => ({ label: f.label, value: f.name })) ?? [],
    [filters]
  );
  const currentSortLabel = useMemo(
    () => sortOptions.find((o) => o.value === sorting?.name)?.label ?? '—',
    [sortOptions, sorting?.name]
  );
  const toggleSortOrder = useCallback(() => {
    setSorting({ name: sorting?.name, order: sorting?.order === 'ASC' ? 'DESC' : 'ASC' });
  }, [sorting, setSorting]);

  const filterList = filters?.filter((i) => i.filter) ?? [];
  const hasFilterValues = state?.filter && Object.keys(state.filter).length > 0;

  // Нормализация: адаптер antd-mobile передаёт в onChange объект { target: { value } }, как antd
  const normalizeInputValue = useCallback((v) => {
    if (v == null) return v;
    if (typeof v === 'object' && v?.target && 'value' in v.target) return v.target.value;
    return v;
  }, []);

  const handleFilterChange = useCallback(
    (v, item) => {
      const raw = normalizeInputValue(v);
      const current = state?.newFilter || {};
      let next;

      if (raw === undefined || raw === null || raw === '') {
        next = { ...current };
        delete next[item.name];
      } else {
        next = { ...current, [item.name]: raw };
      }

      onFilterChange(next);
    },
    [state, onFilterChange, normalizeInputValue]
  );

  return (
    <div style={{ padding: 16, paddingBottom: 32 }}>
      <div style={{ marginBottom: 12, fontWeight: 600 }}>Фильтр</div>

      {/* Сортировка: Picker (antd-mobile) + кнопка направления */}
      {sortOptions.length > 0 && (
        <>
          <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>
            Сортировка
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
            {Picker ? (
              <>
                <Picker
                  columns={[sortOptions]}
                  value={sorting?.name ? [sorting.name] : []}
                  visible={sortPickerVisible}
                  onClose={() => setSortPickerVisible(false)}
                  onConfirm={(v) => {
                    if (v?.length) setSorting({ name: v[0], order: sorting?.order ?? 'ASC' });
                    setSortPickerVisible(false);
                  }}
                  onCancel={() => setSortPickerVisible(false)}
                  cancelText="Отмена"
                  confirmText="Выбрать"
                  data-locator={getLocator('sortingselect')}
                />
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setSortPickerVisible(true)}
                  onKeyDown={(e) => e.key === 'Enter' && setSortPickerVisible(true)}
                  style={{
                    flex: 1,
                    minHeight: 32,
                    border: '1px solid #e5e5e5',
                    borderRadius: 6,
                    padding: '6px 10px',
                    fontSize: 14,
                  }}
                >
                  {currentSortLabel}
                </div>
              </>
            ) : (
              <select
                data-locator={getLocator('sortingselect')}
                value={sorting?.name ?? ''}
                onChange={(e) => setSorting({ name: e.target.value, order: sorting?.order ?? 'ASC' })}
                style={{ flex: 1, minHeight: 32, padding: '4px 8px', fontSize: 14 }}
              >
                <option value="">—</option>
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            )}
            {Button && (
              <Button
                size="small"
                color="default"
                onClick={toggleSortOrder}
                data-locator={getLocator('sortingorder')}
                title={sorting?.order === 'ASC' ? 'Восходящий' : 'Нисходящий'}
              >
                {sorting?.order === 'ASC' ? '↑' : '↓'}
              </Button>
            )}
          </div>
        </>
      )}

      {/* Поля фильтров: Field использует компоненты адаптера (Input, Select и т.д.) */}
      {filterList.length > 0 && (
        <>
          <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>
            Фильтры
          </div>
          {List ? (
            <List style={{ marginBottom: 16 }}>
              {filterList.map((item) => (
                <List.Item key={item.name} style={{ paddingLeft: 0, paddingRight: 0 }}>
                  <div style={{ marginBottom: 8 }}>
                    {item.type !== 'bool' && item.type !== 'boolean' && (
                      <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>{item.label}</div>
                    )}
                    {Input ? (
                      <Input
                        value={state?.newFilter?.[item.name] ?? ''}
                        onChange={(v) => handleFilterChange(v, item)}
                        placeholder={item.label}
                      />
                    ) : (
                      <input
                        type="text"
                        value={state?.newFilter?.[item.name] ?? ''}
                        onChange={(e) => handleFilterChange(e.target.value, item)}
                        placeholder={item.label}
                        style={{ width: '100%', padding: '6px 8px', fontSize: 14 }}
                      />
                    )}
                  </div>
                </List.Item>
              ))}
            </List>
          ) : (
            <div style={{ marginBottom: 16 }}>
              {filterList.map((item) => (
                <div key={item.name} style={{ marginBottom: 10 }} data-locator={getLocator('filtersfield')}>
                  {item.type !== 'bool' && item.type !== 'boolean' && (
                    <span style={{ display: 'block', fontSize: 12, color: '#666', marginBottom: 4 }}>{item.label}</span>
                  )}
                  {Input ? (
                    <Input
                      value={state?.newFilter?.[item.name] ?? ''}
                      onChange={(v) => handleFilterChange(v, item)}
                      placeholder={item.label}
                    />
                  ) : (
                    <input
                      type="text"
                      value={state?.newFilter?.[item.name] ?? ''}
                      onChange={(e) => handleFilterChange(e.target.value, item)}
                      placeholder={item.label}
                      style={{ width: '100%', padding: '6px 8px', fontSize: 14 }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Кнопки применить / очистить */}
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        {Button ? (
          <>
            <Button
              block
              color="primary"
              disabled={!state?.filterChanged}
              onClick={() => { applyFilter(); onClose?.(); }}
              data-locator={getLocator('collectionfilterapply')}
            >
              Применить
            </Button>
            <Button
              block
              color="default"
              disabled={!hasFilterValues}
              onClick={clearFilter}
              data-locator={getLocator('collectionfilterclear')}
            >
              Очистить
            </Button>
          </>
        ) : (
          <>
            <button
              type="button"
              disabled={!state?.filterChanged}
              onClick={() => { applyFilter(); onClose?.(); }}
              data-locator={getLocator('collectionfilterapply')}
            >
              Применить
            </button>
            <button
              type="button"
              disabled={!hasFilterValues}
              onClick={clearFilter}
              data-locator={getLocator('collectionfilterclear')}
            >
              Очистить
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function DemoCollectionMobileContent() {
  const auth = useAuth();
  const ui = useUIOptional();

  const Button = ui?.Button;
  const Popup = ui?.Popup;
  const TableList = ui?.Table;

  return (
    <Collection
      auth={auth}
      name="product"
      source={demoSource}
      filters={() => [
        { name: 'Title', label: 'Название', type: 'string', filter: true, sort: true },
        { name: 'Price', label: 'Цена', type: 'float', filter: true, sort: true },
      ]}
      render={(ctx) => {
        const {
          collection,
          loading,
          filtered,
          setFiltered,
          filters,
          current,
          setCurrent,
          count,
          total,
          totalPages,
          getCollectionActions,
          getLocator,
          state,
          sorting,
          setSorting,
          applyFilter,
          clearFilter,
          onFilterChange,
          funcStat,
        } = ctx;

        const actions = getCollectionActions() || [];

        const collectionContent = (
          <React.Fragment>
            <div
              className="filtered-header"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: filters?.length > 0 ? 10 : 0,
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              <div
                style={{
                  flex: '1 1 auto',
                  display: 'flex',
                  gap: 8,
                  flexWrap: 'wrap',
                }}
              >
                {actions.map((actionConfig, idx) =>
                  typeof actionConfig === 'function' ? (
                    actionConfig(ctx, idx)
                  ) : (
                    <Action
                      key={actionConfig.key ?? idx}
                      auth={auth}
                      mode="button"
                      locator={ctx.locator || 'collection-product'}
                      collection={collection}
                      setCollection={ctx.setCollection}
                      updateCollection={ctx.updateCollection}
                      contextFilters={ctx.contextFilters}
                      {...actionConfig}
                    />
                  )
                )}
              </div>
              {filters?.length > 0 && (
                <div style={{ display: 'flex', gap: 8 }}>
                  {Popup ? (
                    <>
                      <Button
                        color={filtered ? 'primary' : 'default'}
                        onClick={() => setFiltered(true)}
                        data-locator={getLocator('collectionfilter')}
                      >
                        Фильтр
                      </Button>
                      <Popup
                        visible={filtered}
                        onMaskClick={() => setFiltered(false)}
                        position="bottom"
                        bodyStyle={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                      >
                        <MobileFilterPanel
                          ctx={ctx}
                          ui={ui}
                          getLocator={getLocator}
                          onClose={() => setFiltered(false)}
                        />
                      </Popup>
                    </>
                  ) : (
                    <Button
                      color={filtered ? 'primary' : 'default'}
                      onClick={() => setFiltered(!filtered)}
                      data-locator={getLocator('collectionfilter')}
                    >
                      Фильтр {filtered ? '▲' : '▼'}
                    </Button>
                  )}
                </div>
              )}
            </div>

            {filtered && !Popup && (
              <div style={{ marginBottom: 12, minWidth: 280 }}>
                <MobileFilterPanel ctx={ctx} ui={ui} getLocator={getLocator} />
              </div>
            )}

            <div
              className="filtered-body"
              style={{ width: '100%', marginBottom: 0 }}
            >
              {loading && (
                <div style={{ marginBottom: 8, fontSize: 14 }}>Загрузка данных...</div>
              )}
              {TableList ? (
                <TableList
                  dataSource={collection ?? []}
                  columns={columns}
                  loading={loading}
                  renderItem={(item) => (
                    <div style={{ padding: '4px 0' }}>
                      <div style={{ fontWeight: 500 }}>{item.Title}</div>
                      <div style={{ fontSize: 12, color: '#666' }}>
                        ID: {item.ID} · Цена: {item.Price}
                      </div>
                    </div>
                  )}
                />
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                    <thead>
                      <tr>
                        {columns.map((col) => (
                          <th
                            key={col.key}
                            style={{
                              textAlign: 'left',
                              padding: '8px 6px',
                              borderBottom: '1px solid #e5e5e5',
                              width: col.width,
                            }}
                          >
                            {col.title}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(collection ?? []).map((row) => (
                        <tr key={row.ID}>
                          {columns.map((col) => (
                            <td
                              key={col.key}
                              style={{
                                padding: '6px 6px',
                                borderBottom: '1px solid #f0f0f0',
                              }}
                            >
                              {row[col.dataIndex]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {(!collection || collection.length === 0) && !loading && (
                <div style={{ padding: 12 }}>Нет данных</div>
              )}
            </div>

            {count && total && totalPages > 1 && (
              <div
                className="filtered-footer"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                <div style={{ fontSize: 14, lineHeight: '24px' }}>
                  Элементов: {collection?.length ?? 0} из {total}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setCurrent(current - 1)}
                    disabled={current <= 1}
                  >
                    Назад
                  </button>
                  <span style={{ fontSize: 14 }}>
                    Страница {current} из {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrent(current + 1)}
                    disabled={current >= totalPages}
                  >
                    Вперёд
                  </button>
                </div>
              </div>
            )}
          </React.Fragment>
        );

        return (
          <div
            style={{ minHeight: 200 }}
            data-locator={getLocator('collection-product')}
            className="collection collection-mobile filtered"
          >
            {collectionContent}
          </div>
        );
      }}
    />
  );
}

const mobileAdapter = new AntdMobileAdapter();

export default function DemoCollectionMobile() {
  return (
    <UIProvider adapter={mobileAdapter}>
      <DemoCollectionMobileContent />
    </UIProvider>
  );
}
