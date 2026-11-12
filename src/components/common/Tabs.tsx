import type { KeyboardEvent } from 'react';

export interface TabItem {
  id: string;
  label: string;
}

interface Props {
  tabs: TabItem[];
  active: string;
  onChange: (id: string) => void;
  idPrefix: string;
  label: string;
}

/** Accessible segmented tabs (arrow keys, Home, End). Panels are rendered by the caller. */
export default function Tabs({ tabs, active, onChange, idPrefix, label }: Props) {
  const focusTab = (id: string) => {
    onChange(id);
    document.getElementById(`${idPrefix}-tab-${id}`)?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (e.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = tabs.length - 1;
    else return;
    e.preventDefault();
    focusTab(tabs[next].id);
  };

  return (
    <div role="tablist" aria-label={label} className="flex flex-wrap border border-ink">
      {tabs.map((t, i) => {
        const selected = t.id === active;
        return (
          <button
            key={t.id}
            id={`${idPrefix}-tab-${t.id}`}
            role="tab"
            type="button"
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel-${t.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(t.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={`min-h-[44px] flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              selected ? 'bg-ink text-paper' : 'bg-paper text-ink hover:bg-line'
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
