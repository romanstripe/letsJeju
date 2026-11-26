import { useEffect, useMemo, useState } from 'react';
import { loadPlaces } from '../data/loadPlaces.js';
import HeaderButtons from '../components/HeaderButtons.jsx';
import MapView from '../components/MapView.jsx';
import PlacePanel from '../components/PlacePanel.jsx';

const FILTERS = ['all', 'c1', 'c4', 'c2', 'c5', 'c6'];

export default function MapScreen({ t, theme, onToggleTheme, onChangeLanguage }) {
  const [places, setPlaces] = useState(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [filter, setFilter] = useState('c1');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let cancelled = false;
    loadPlaces()
      .then((list) => !cancelled && setPlaces(list))
      .catch((err) => {
        console.error(err.message);
        if (!cancelled) setLoadFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const shown = useMemo(
    () => (places ?? []).filter((p) => filter === 'all' || p.category === filter),
    [places, filter],
  );

  function chooseFilter(id) {
    setFilter(id);
    setSelected(null);
  }

  const m = t.map;
  const status = loadFailed ? m.loadError : !places ? m.loading : null;

  return (
    <>
      <header className="topbar">
        <h1 className="screen-title">{m.title}</h1>
        <div className="filters">
          {FILTERS.map((id) => (
            <button
              key={id}
              type="button"
              className="filter-button"
              aria-pressed={filter === id}
              onClick={() => chooseFilter(id)}
            >
              {m.categories[id]}
            </button>
          ))}
        </div>
        <HeaderButtons t={t} onToggleTheme={onToggleTheme} onChangeLanguage={onChangeLanguage} />
      </header>
      <main className="content map-screen">
        <section className="card map-area">
          <MapView
            places={shown}
            selected={selected}
            onSelect={setSelected}
            theme={theme}
            errorText={m.mapError}
          />
          <div className="map-legend">
            <span className="legend-chip" role="status">
              {status ?? m.count.replace('{n}', shown.length.toLocaleString())}
            </span>
            {selected && (
              <span className="legend-chip">
                <span className="legend-dot" />
                {m.selected}
              </span>
            )}
          </div>
        </section>
        <PlacePanel place={selected} t={t} />
      </main>
    </>
  );
}
