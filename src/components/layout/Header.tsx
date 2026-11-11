import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../../config/navigation';
import Wordmark from '../common/Wordmark';

export default function Header() {
  const [open, setOpen] = useState(false);
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block border-b-2 py-2 text-sm md:py-1 ${
      isActive ? 'border-accent text-ink' : 'border-transparent text-muted hover:text-ink'
    }`;

  return (
    <header className="border-b border-line bg-paper">
      <div className="container-page flex min-h-[64px] items-center justify-between gap-6">
        <Link to="/" aria-label="RunZones Lab, home" onClick={() => setOpen(false)}>
          <Wordmark />
        </Link>

        <button
          type="button"
          className="btn btn-secondary md:hidden"
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Close' : 'Menu'}
        </button>

        <nav
          id="primary-nav"
          aria-label="Primary"
          className={`${open ? 'absolute left-0 right-0 top-[65px] z-40 border-b border-line bg-paper px-5 pb-4' : 'hidden'} md:static md:block md:border-0 md:p-0`}
        >
          <ul className="flex flex-col gap-1 md:flex-row md:gap-7">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className={linkClass} onClick={() => setOpen(false)}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
