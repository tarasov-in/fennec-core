import React from 'react';
import { useAuth, useUIOptional } from 'fennec-core';
import { Collection } from 'fennec-core/components/Collection';
import { Action } from 'fennec-core/components/Action';

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

export default function DemoCollection() {
  const auth = useAuth();
  const ui = useUIOptional();

  const Button = ui?.Button;
  const Popover = ui?.Popover;
  const Icons = ui?.Icons;
  const FilterIcon = Icons?.Filter;
  const FullscreenIcon = Icons?.Fullscreen;
  const FullscreenExitIcon = Icons?.FullscreenExit;

  return (
    <Collection
      auth={auth}
      name="product"
      source={demoSource}
      filters={() => [
        { name: 'Title', label: 'Название', type: 'string', filter: true, sort: true },
        { name: 'Price', label: 'Цена', type: 'float', filter: true, sort: true },
      ]}
      // floatingFilter
      // allowFullscreen
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
          openFullscreen,
          closeFullscreen,
          isFullscreen,
          getLocator,
          renderFilterPanel,
        } = ctx;

        const actions = getCollectionActions() || [];

        const collectionContent = (
          <>
            <div
              className="filtered-header"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: filters?.length > 0 ? 10 : 0,
              }}
            >
              <div
                style={{
                  flex: '1 1 auto',
                  paddingRight: 15,
                  display: 'flex',
                  gap: 5,
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
                <div style={{ flex: '0 0 auto', display: 'flex', gap: 8 }}>
                  {ctx.allowFullscreen &&
                    (Button && (FullscreenIcon || FullscreenExitIcon) ? (
                      <Button
                        type={isFullscreen ? 'primary' : 'default'}
                        icon={
                          isFullscreen && FullscreenExitIcon ? (
                            <FullscreenExitIcon />
                          ) : FullscreenIcon ? (
                            <FullscreenIcon />
                          ) : null
                        }
                        onClick={() =>
                          isFullscreen ? closeFullscreen() : openFullscreen()
                        }
                        data-locator={getLocator('collectionfullscreen')}
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => (isFullscreen ? closeFullscreen() : openFullscreen())}
                        data-locator={getLocator('collectionfullscreen')}
                      >
                        {isFullscreen ? 'Выйти из полноэкранного режима' : 'Во весь экран'}
                      </button>
                    ))}

                  {Button && Popover ? (
                    <Popover
                      content={
                        typeof renderFilterPanel === 'function' ? (
                          <div style={{ minWidth: 280 }}>{renderFilterPanel()}</div>
                        ) : null
                      }
                      title="Фильтр"
                      trigger="click"
                      open={filtered}
                      onOpenChange={(open) => setFiltered(open)}
                    >
                      <Button
                        type={filtered ? 'primary' : 'default'}
                        icon={FilterIcon ? <FilterIcon /> : null}
                        data-locator={getLocator('collectionfilter')}
                      />
                    </Popover>
                  ) : Button ? (
                    <Button
                      type={filtered ? 'primary' : 'default'}
                      icon={FilterIcon ? <FilterIcon /> : null}
                      onClick={() => setFiltered(!filtered)}
                      data-locator={getLocator('collectionfilter')}
                    >
                      Фильтр
                    </Button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setFiltered(!filtered)}
                      data-locator={getLocator('collectionfilter')}
                    >
                      Фильтр {filtered ? '▲' : '▼'}
                    </button>
                  )}
                </div>
              )}
            </div>

            {filtered && typeof renderFilterPanel === 'function' && !Popover && (
              <div style={{ marginBottom: 12, minWidth: 280 }}>{renderFilterPanel()}</div>
            )}

            <div
              className="filtered-body"
              style={{
                width: '100%',
                marginBottom: 0,
                ...(isFullscreen ? { overflow: 'auto' } : {}),
              }}
            >
              {loading && (
                <div style={{ marginBottom: 8, fontSize: 14 }}>Загрузка данных...</div>
              )}
              <div style={{ overflowX: 'auto' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: 14,
                  }}
                >
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
                {(!collection || collection.length === 0) && !loading && (
                  <div style={{ padding: 12 }}>Нет данных</div>
                )}
              </div>
            </div>

            {count && total && totalPages > 1 && (
              <div
                className="filtered-footer"
                style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}
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
          </>
        );

        return isFullscreen ? (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              background: '#fff',
              overflow: 'auto',
              padding: 24,
            }}
            data-locator={getLocator('collection-product')}
            className="collection default-collection filtered fullscreen-overlay"
          >
            {collectionContent}
          </div>
        ) : (
          <div
            style={{ minHeight: 200 }}
            data-locator={getLocator('collection-product')}
            className="collection default-collection filtered"
          >
            {collectionContent}
          </div>
        );
      }}
    />
  );
}
