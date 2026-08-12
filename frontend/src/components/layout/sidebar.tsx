'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import {
  LayoutDashboard,
  Building2,
  Zap,
  Plug,
  Wallet,
  BarChart3,
  Users,
  DollarSign,
  Car,
  Settings,
  CreditCard,
  Radio,
  LogOut,
  Menu,
  X,
  User,
  Shield,
} from 'lucide-react';
import { useState } from 'react';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'OPERATOR'] },
  { href: '/companies', label: 'Empresas', icon: Building2, roles: ['SUPER_ADMIN'] },
  { href: '/users', label: 'Usuarios', icon: Users, roles: ['SUPER_ADMIN'] },
  { href: '/stations', label: 'Postos', icon: Zap, roles: ['SUPER_ADMIN', 'OPERATOR'] },
  { href: '/chargers', label: 'Carregadores', icon: Plug, roles: ['SUPER_ADMIN', 'OPERATOR'] },
  { href: '/tariffs', label: 'Tarifas', icon: DollarSign, roles: ['SUPER_ADMIN', 'OPERATOR'] },
  { href: '/vehicles', label: 'Veiculos', icon: Car, roles: ['SUPER_ADMIN', 'OPERATOR', 'CUSTOMER'] },
  { href: '/financial', label: 'Financeiro', icon: Wallet, roles: ['SUPER_ADMIN', 'OPERATOR'] },
  { href: '/reports', label: 'Relatorios', icon: BarChart3, roles: ['SUPER_ADMIN'] },
  { href: '/settings', label: 'Configuracoes', icon: Settings, roles: ['SUPER_ADMIN'] },
  { href: '/audit', label: 'Auditoria', icon: Shield, roles: ['SUPER_ADMIN'] },
  { href: '/billing', label: 'Planos', icon: CreditCard, roles: ['SUPER_ADMIN', 'OPERATOR'] },
  { href: '/ocpp', label: 'Conexao OCPP', icon: Radio, roles: ['SUPER_ADMIN', 'OPERATOR'] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const visibleItems = menuItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  return (
    <>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-slate-800 text-white p-2 rounded-md"
      >
        {collapsed ? <Menu size={20} /> : <X size={20} />}
      </button>

      <aside
        className={`fixed top-0 left-0 h-full bg-slate-900 text-white transition-all duration-300 z-40 overflow-y-auto
          ${collapsed ? '-translate-x-full' : 'translate-x-0'}
          lg:translate-x-0 lg:w-64`}
      >
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Zap className="text-emerald-400" size={24} />
            ConectoVolt
          </h1>
        </div>

        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
              <User size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.role === 'SUPER_ADMIN' ? 'Super Admin' : user?.role === 'OPERATOR' ? 'Operador' : 'Cliente'}</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setCollapsed(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                  ${isActive
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm text-slate-300 hover:bg-red-900/50 hover:text-red-400 transition-colors"
          >
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}
    </>
  );
}
