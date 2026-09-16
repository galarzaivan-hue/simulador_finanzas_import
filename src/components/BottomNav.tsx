import React from 'react';
import { BarChart3, TrendingUp, BookOpen } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const tabs = [
    {
      id: 'simulator' as TabType,
      label: 'Simulador Evaluador',
      shortLabel: 'Simulador',
      icon: BarChart3,
    },
    {
      id: 'sensitivity' as TabType,
      label: 'Sensibilidad del Tiempo',
      shortLabel: 'Sensibilidad',
      icon: TrendingUp,
    },
    {
      id: 'theory' as TabType,
      label: 'Fundamentos Teóricos',
      shortLabel: 'Fundamentos',
      icon: BookOpen,
    },
  ];

  return (
    <>
      {/* DESKTOP TABS (Shown above content on sm+ screens) */}
      <div className="hidden sm:block border-b border-slate-800 bg-slate-900/60 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex space-x-1" aria-label="Pestañas de Navegación">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`desktop-tab-${tab.id}`}
                  type="button"
                  onClick={() => onChangeTab(tab.id)}
                  className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                    isActive
                      ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR (Fixed at bottom on <sm screens) */}
      <nav
        id="mobile-bottom-nav"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 pb-[env(safe-area-inset-bottom)] shadow-2xl"
        aria-label="Navegación Móvil"
      >
        <div className="grid grid-cols-3 h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`mobile-tab-${tab.id}`}
                type="button"
                onClick={() => onChangeTab(tab.id)}
                className={`flex flex-col items-center justify-center gap-1 transition-all relative ${
                  isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200 font-medium'
                }`}
              >
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-emerald-500 rounded-b-full shadow-xs shadow-emerald-400/50" />
                )}
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400 scale-105' : 'text-slate-400'}`} />
                <span className="text-[11px] leading-tight text-center tracking-tight whitespace-nowrap">
                  {tab.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
