import React from 'react';
import { Settings2, DollarSign } from 'lucide-react';
import { AnalysisMode, Currency } from '../types';

interface HeaderProps {
  mode: AnalysisMode;
  currency: Currency;
  exchangeRate: number;
  onOpenConfig: () => void;
  onToggleCurrency: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  currency,
  exchangeRate,
  onOpenConfig,
  onToggleCurrency,
}) => {
  const getModeLabel = (m: AnalysisMode) => {
    switch (m) {
      case 'mode1':
        return 'Modo 1: Detallado + Banco';
      case 'mode2':
        return 'Modo 2: Ganancia Directa + Banco';
      case 'mode3':
        return 'Modo 3: Inversión Pura';
    }
  };

  return (
    <header
      id="app-header"
      className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
        {/* Brand & App Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-950/40 shrink-0">
            <span className="font-bold text-white text-base tracking-wider">TEM</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white truncate">
                Simulador Financiero
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-full">
                Inversionistas
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate">
              {getModeLabel(mode)}
            </p>
          </div>
        </div>

        {/* Right actions: Currency quick toggle & Config Drawer */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Currency Toggle Pill */}
          <button
            id="currency-toggle-btn"
            type="button"
            onClick={onToggleCurrency}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors shadow-sm"
            title={`Moneda activa: ${currency} (TC: ${exchangeRate}) - Clic para alternar`}
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>{currency}</span>
            <span className="text-[10px] text-slate-400">({currency === 'USD' ? '$' : 'Bs'})</span>
          </button>

          {/* Config Drawer Trigger */}
          <button
            id="open-config-drawer-btn"
            type="button"
            onClick={onOpenConfig}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/30 transition-colors"
          >
            <Settings2 className="w-4 h-4" />
            <span className="hidden sm:inline">Configuración</span>
          </button>
        </div>
      </div>
    </header>
  );
};
