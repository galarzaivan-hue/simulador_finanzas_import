import React from 'react';
import {
  X,
  Sliders,
  Landmark,
  Coins,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { AnalysisMode, Currency, FinanceInputs } from '../types';

interface ConfigDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: FinanceInputs;
  onUpdateInputs: (updated: Partial<FinanceInputs>) => void;
  onApplyPreset: (presetKey: 'inmobiliario' | 'importacion' | 'prestamo_puro') => void;
}

export const ConfigDrawer: React.FC<ConfigDrawerProps> = ({
  isOpen,
  onClose,
  inputs,
  onUpdateInputs,
  onApplyPreset,
}) => {
  if (!isOpen) return null;

  const modesList: {
    id: AnalysisMode;
    title: string;
    description: string;
    badge: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'mode1',
      title: 'Modo 1: Detallado con Préstamo Bancario',
      description: 'Pide Aporte, Costos Totales del Proyecto y Ventas Totales. Calcula Ganancia Socio al 50%.',
      badge: 'Completo',
      icon: <Landmark className="w-5 h-5 text-emerald-400" />,
    },
    {
      id: 'mode2',
      title: 'Modo 2: Ganancia Directa con Préstamo Bancario',
      description: 'Pide Aporte y Ganancia Prometida fija, deduciendo el costo financiero del banco.',
      badge: 'Rápido + Banco',
      icon: <Coins className="w-5 h-5 text-blue-400" />,
    },
    {
      id: 'mode3',
      title: 'Modo 3: Inversión Pura (Sin Préstamo)',
      description: 'Oculta parámetros del banco. Evalúa la rentabilidad limpia y TEM de tu capital aportado.',
      badge: 'Sin Deuda',
      icon: <ShieldCheck className="w-5 h-5 text-purple-400" />,
    },
  ];

  return (
    <div
      id="config-drawer-overlay"
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-xs transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        id="config-drawer-content"
        className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 text-slate-100 flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Configuración Global</h2>
              <p className="text-xs text-slate-400">Modo de evaluación y divisas</p>
            </div>
          </div>
          <button
            id="close-config-drawer-btn"
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* SECTION: Modo de Análisis */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                1. Modo de Análisis
              </label>
              <span className="text-[11px] text-emerald-400 font-medium">Requerido</span>
            </div>

            <div className="space-y-2.5">
              {modesList.map((m) => {
                const isSelected = inputs.mode === m.id;
                return (
                  <div
                    key={m.id}
                    id={`mode-option-${m.id}`}
                    onClick={() => onUpdateInputs({ mode: m.id })}
                    className={`relative p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-800/90 border-emerald-500 shadow-md shadow-emerald-950/20'
                        : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/50 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">{m.icon}</div>
                      <div className="flex-1 min-w-0 pr-6">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-white leading-tight">
                            {m.title}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {m.description}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute top-3.5 right-3.5" />
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* SECTION: Divisa y Tipo de Cambio */}
          <section className="space-y-3 pt-2 border-t border-slate-800">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              2. Selector de Moneda y Tipo de Cambio
            </label>

            {/* Currency Segmented Control */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                id="currency-select-usd"
                type="button"
                onClick={() => onUpdateInputs({ currency: 'USD' })}
                className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                  inputs.currency === 'USD'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Dólares (USD $)</span>
              </button>
              <button
                id="currency-select-bob"
                type="button"
                onClick={() => onUpdateInputs({ currency: 'BOB' })}
                className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                  inputs.currency === 'BOB'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Bolivianos (BOB Bs)</span>
              </button>
            </div>

            {/* Exchange Rate Input */}
            <div className="bg-slate-800/50 rounded-xl p-3.5 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">
                  Tipo de Cambio (BOB / USD)
                </span>
                <span className="text-[11px] text-slate-400">Default: 6.96</span>
              </div>
              <div className="relative">
                <input
                  id="input-exchange-rate"
                  type="number"
                  step="0.01"
                  min="0.1"
                  value={inputs.exchangeRate}
                  onChange={(e) =>
                    onUpdateInputs({
                      exchangeRate: Math.max(0.01, parseFloat(e.target.value) || 6.96),
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-hidden focus:border-emerald-500"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">
                  Bs por 1 $
                </span>
              </div>
            </div>
          </section>

          {/* SECTION: Casos de Estudio Rápidos (Presets) */}
          <section className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                3. Cargar Casos de Estudio
              </label>
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <button
                id="preset-inmobiliario-btn"
                type="button"
                onClick={() => {
                  onApplyPreset('inmobiliario');
                  onClose();
                }}
                className="text-left p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="text-xs font-semibold text-white">
                  🏢 Venta Inmobiliaria Rápida (90 días)
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Aporte $20,000 + Préstamo $15,000 al 1.5% mensual.
                </div>
              </button>

              <button
                id="preset-importacion-btn"
                type="button"
                onClick={() => {
                  onApplyPreset('importacion');
                  onClose();
                }}
                className="text-left p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="text-xs font-semibold text-white">
                  🚢 Importación de Mercadería (60 días)
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Aporte $10,000, Ganancia prometida $2,200 con banco $8,000.
                </div>
              </button>

              <button
                id="preset-prestamo-puro-btn"
                type="button"
                onClick={() => {
                  onApplyPreset('prestamo_puro');
                  onClose();
                }}
                className="text-left p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="text-xs font-semibold text-white">
                  💎 Inversión de Capital Privado Puro (120 días)
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Aporte $15,000, Ganancia $2,700 directa sin banco.
                </div>
              </button>
            </div>
          </section>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Moneda activa: <span className="text-white font-semibold">{inputs.currency}</span>
          </div>
          <button
            id="apply-config-btn"
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-md"
          >
            Listo / Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};
