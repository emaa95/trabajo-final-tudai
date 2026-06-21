import {
  Car,
  Menu,
  LogOut,
  ShieldCheck,
  UserCog,
  X,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { navigation } from '@/routes/navigation';
import { useAuth } from '@/hooks/useAuth';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { currentUser, logout } = useAuth();

  const initials = currentUser?.empleado
    ? `${currentUser.empleado.nombre?.[0] ?? ''}${currentUser.empleado.apellido?.[0] ?? ''}`.toUpperCase()
    : '??';

  const closeSidebarMobile = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-slate-900 text-white rounded-xl shadow-lg"
      >
        {isOpen ? (
          <X className="size-5" />
        ) : (
          <Menu className="size-5" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          ${collapsed ? 'w-20' : 'w-64'}
          bg-slate-900 text-white flex flex-col
          transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand */}
        <div className="px-4 pt-6 pb-5 border-b border-slate-800">
          <div
            className={`flex items-center ${
              collapsed ? 'justify-center' : 'justify-between'
            }`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2 bg-blue-600 rounded-xl shrink-0">
                <Car className="size-5" />
              </div>

              {!collapsed && (
                <div>
                  <h1 className="font-bold text-base">
                    TallerPro
                  </h1>

                  <p className="text-xs text-slate-400">
                    Chapa, Pintura y Service
                  </p>
                </div>
              )}
            </div>

            {!collapsed && (
              <button
                onClick={() => setCollapsed(true)}
                className="hidden lg:flex p-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <PanelLeftClose className="size-4" />
              </button>
            )}
          </div>

          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              className="hidden lg:flex mt-4 mx-auto p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <PanelLeftOpen className="size-4" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                title={collapsed ? item.name : undefined}
                onClick={closeSidebarMobile}
                className={({ isActive }) =>
                  `
                    flex items-center
                    ${
                      collapsed
                        ? 'justify-center'
                        : 'gap-3'
                    }
                    px-3 py-2.5 rounded-xl
                    transition-all duration-150 group
                    ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }
                  `
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`
                        size-5 shrink-0
                        ${
                          isActive
                            ? 'text-white'
                            : 'text-slate-500 group-hover:text-white'
                        }
                      `}
                    />

                    {!collapsed && (
                      <span className="text-sm font-medium">
                        {item.name}
                      </span>
                    )}

                    {isActive && !collapsed && (
                      <span className="ml-auto size-1.5 rounded-full bg-white/60" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-3 pb-4 pt-3 border-t border-slate-800">
          {!collapsed &&
            userMenuOpen &&
            currentUser && (
              <div className="mb-2 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
                <div className="px-4 py-3 border-b border-slate-700">
                  <p className="text-xs text-slate-400">
                    Conectado como
                  </p>

                  <p className="text-sm font-semibold text-white truncate">
                    {currentUser.empleado.nombre}{' '}
                    {currentUser.empleado.apellido}
                  </p>

                  <p className="text-xs text-slate-400 truncate">
                    {currentUser.email}
                  </p>
                </div>

                <div className="p-1">
                  <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                    <UserCog className="size-4" />
                    Mi Perfil
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                  >
                    <LogOut className="size-4" />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}

          <button
            onClick={() =>
              !collapsed &&
              setUserMenuOpen((prev) => !prev)
            }
            className={`
              w-full flex items-center
              ${
                collapsed
                  ? 'justify-center'
                  : 'gap-3'
              }
              px-3 py-2.5 rounded-xl
              hover:bg-slate-800 transition-colors
            `}
          >
            <div className="size-9 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold ring-2 ring-blue-500/30">
              {initials}
            </div>

            {!collapsed && (
              <>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {currentUser
                      ? `${currentUser.empleado.nombre} ${currentUser.empleado.apellido}`
                      : 'Usuario'}
                  </p>

                  <div className="flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="size-3 text-emerald-400" />

                    <span className="text-xs text-emerald-400">
                      {currentUser?.empleado.cargo ?? ''}
                    </span>
                  </div>
                </div>

                <ChevronDown
                  className={`
                    size-4 text-slate-500 transition-transform
                    ${
                      userMenuOpen
                        ? 'rotate-180'
                        : ''
                    }
                  `}
                />
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}