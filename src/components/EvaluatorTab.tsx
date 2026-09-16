import React, { useState } from 'react';
import {
  Calendar,
  DollarSign,
  Landmark,
  Briefcase,
  AlertTriangle,
  CheckCircle,
  XCircle,
  HelpCircle,
  Percent,
  PiggyBank,
  Clock,
  Sparkles,
} from 'lucide-react';
import { FinanceInputs, FinanceResults, BankPaymentType } from '../types';
import { MetricCard } from './MetricCard';
import { formatCurrency, formatConvertedCurrency, formatPercent, formatDays, formatMonths } from '../utils/formatters';

interface EvaluatorTabProps {
  inputs: FinanceInputs;
  results: FinanceResults;
  onUpdateInputs: (updated: Partial<FinanceInputs>) => void;
  onOpenConfig: () => void;
}

export const EvaluatorTab: React.FC<EvaluatorTabProps> = ({
  inputs,
  results,
  onUpdateInputs,
  onOpenConfig,
}) => {
  const { currency, exchangeRate, mode } = inputs;
  const [openSection, setOpenSection] = useState<'project' | 'time' | 'bank' | 'all'>('all');

  // Helper para sumar días a la fecha de inicio
  const handleQuickAddDays = (daysToAdd: number) => {
    if (!inputs.fechaInicio) return;
    const start = new Date(inputs.fechaInicio);
    start.setDate(start.getDate() + daysToAdd);
    const newEndStr = start.toISOString().split('T')[0];
    onUpdateInputs({ fechaFin: newEndStr });
  };

  return (
    <div id="evaluator-tab-container" className="space-y-6">
      {/* Quick Mode Indicator Banner */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {mode === 'mode1'
                  ? 'Modo 1: Detallado + Préstamo'
                  : mode === 'mode2'
                  ? 'Modo 2: Ganancia Directa + Préstamo'
                  : 'Modo 3: Inversión Pura (Sin Deuda)'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {mode === 'mode1'
                ? 'Calcula la ganancia del proyecto y deduce la cuota o interés bancario.'
                : mode === 'mode2'
                ? 'Evalúa tu ganancia fija prometida contra el costo financiero del crédito.'
                : 'Analiza tu retorno efectivo libre de deuda bancaria.'}
            </p>
          </div>
        </div>

        <button
          id="change-mode-fast-btn"
          type="button"
          onClick={onOpenConfig}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors self-start sm:self-center shrink-0"
        >
          Cambiar Modo
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TARJETAS DE KPIS (RESUMEN VISUAL FINTECH) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1: Capital Invertido */}
        <MetricCard
          id="kpi-capital-invertido"
          title="Capital Invertido"
          value={formatCurrency(inputs.capitalAporte, currency)}
          secondaryValue={formatConvertedCurrency(inputs.capitalAporte, currency, exchangeRate)}
          sublabel="Aporte propio"
          icon={<PiggyBank className="w-4 h-4" />}
        />

        {/* KPI 2: Ganancia Bruta / Nominal */}
        <MetricCard
          id="kpi-ganancia-bruta"
          title="Ganancia Nominal"
          value={formatCurrency(results.gananciaSocio, currency)}
          badge={formatPercent(results.rendimientoNominalPct)}
          badgeVariant="blue"
          sublabel={mode === 'mode1' ? '50% utilidad proyecto' : 'Ganancia prometida'}
          icon={<DollarSign className="w-4 h-4" />}
        />

        {/* KPI 3: Costo del Banco */}
        {mode !== 'mode3' ? (
          <MetricCard
            id="kpi-costo-banco"
            title="Costo Banco (Interés)"
            value={formatCurrency(results.costoBanco, currency)}
            badge={inputs.tasaMensualBanco > 0 ? `${inputs.tasaMensualBanco.toFixed(1)}% mes` : '0%'}
            badgeVariant="red"
            secondaryValue={formatConvertedCurrency(results.costoBanco, currency, exchangeRate)}
            sublabel={
              inputs.tipoPago === 'interest_only'
                ? 'Solo Interés Mensual'
                : 'Cuota Fija Amortizable'
            }
            icon={<Landmark className="w-4 h-4" />}
          />
        ) : (
          <MetricCard
            id="kpi-costo-banco-na"
            title="Costo Banco"
            value="Sin Deuda"
            badge="0.0%"
            badgeVariant="slate"
            sublabel="Inversión 100% fondos propios"
            icon={<Landmark className="w-4 h-4" />}
          />
        )}

        {/* KPI 4: Ganancia Limpia & TEM (Destacada) */}
        <MetricCard
          id="kpi-ganancia-limpia-tem"
          title="Ganancia Limpia Final"
          value={formatCurrency(results.gananciaLimpia, currency)}
          badge={`TEM ${results.temReal.toFixed(2)}%`}
          badgeVariant={
            results.diagnosticStatus === 'viable' || results.diagnosticStatus === 'pure_high'
              ? 'emerald'
              : results.diagnosticStatus === 'warning' || results.diagnosticStatus === 'pure_medium'
              ? 'yellow'
              : 'red'
          }
          sublabel={`Plazo: ${formatDays(results.diasTotales)} (${formatMonths(results.mesesComerciales)})`}
          highlighted={true}
          icon={<Percent className="w-4 h-4 text-emerald-400" />}
        />
      </div>

      {/* ========================================================================= */}
      {/* DIAGNÓSTICO DINÁMICO (ALERT BOX ADAPTATIVO) */}
      {/* ========================================================================= */}
      <div
        id="dynamic-diagnostic-alert"
        className={`rounded-2xl p-5 border transition-all ${
          results.diagnosticStatus === 'viable' || results.diagnosticStatus === 'pure_high'
            ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
            : results.diagnosticStatus === 'warning' || results.diagnosticStatus === 'pure_medium'
            ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
            : 'bg-red-950/20 border-red-500/40 text-red-200'
        }`}
      >
        <div className="flex items-start gap-3.5">
          <div className="mt-0.5 shrink-0">
            {results.diagnosticStatus === 'viable' || results.diagnosticStatus === 'pure_high' ? (
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            ) : results.diagnosticStatus === 'warning' || results.diagnosticStatus === 'pure_medium' ? (
              <AlertTriangle className="w-6 h-6 text-amber-400" />
            ) : (
              <XCircle className="w-6 h-6 text-red-400" />
            )}
          </div>

          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                {results.diagnosticTitle}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-slate-200">
                  TEM Real: {results.temReal.toFixed(2)}% / mes
                </span>
                {mode !== 'mode3' && (
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-slate-200">
                    Tasa Banco: {inputs.tasaMensualBanco.toFixed(2)}% / mes
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {results.diagnosticMessage}
            </p>

            {/* Tip y Breakeven */}
            <div className="pt-2 mt-2 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="font-semibold text-slate-300">Recomendación Clave:</span>
                <span>{results.diagnosticTip}</span>
              </div>
              {results.breakevenDays !== null && mode !== 'mode3' && (
                <div className="shrink-0 bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-700/80 font-mono text-[11px] text-slate-300">
                  Días de quiebre (TEM = Banco): <span className="text-amber-400 font-bold">{results.breakevenDays} días</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INPUTS INTERACTIVOS ORGANIZADOS EN CARDS / ACORDEONES */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        {/* CARD 1: SECCIÓN PROYECTO (INPUTS SEGÚN MODO) */}
        <div id="section-project-inputs" className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <Briefcase className="w-5 h-5 text-emerald-400" />
              <h2 className="text-sm sm:text-base font-bold text-white">
                1. Parámetros del Proyecto
              </h2>
            </div>
            <span className="text-xs font-medium text-slate-400">
              {currency === 'USD' ? 'En Dólares ($)' : 'En Bolivianos (Bs)'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Aporte de Capital */}
            <div className="space-y-1.5">
              <label htmlFor="input-capital-aporte" className="text-xs font-semibold text-slate-300">
                Aporte Capital Propio ({currency})
              </label>
              <div className="relative">
                <input
                  id="input-capital-aporte"
                  type="number"
                  min="1"
                  step="100"
                  value={inputs.capitalAporte}
                  onChange={(e) =>
                    onUpdateInputs({ capitalAporte: Math.max(0, parseFloat(e.target.value) || 0) })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-hidden focus:border-emerald-500"
                  placeholder="Ej. 10000"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400">
                  {currency === 'USD' ? '$' : 'Bs'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {formatConvertedCurrency(inputs.capitalAporte, currency, exchangeRate)}
              </p>
            </div>

            {/* MODO 1: Costos y Ventas */}
            {mode === 'mode1' && (
              <>
                <div className="space-y-1.5">
                  <label htmlFor="input-costos-totales" className="text-xs font-semibold text-slate-300">
                    Costos Totales del Proyecto ({currency})
                  </label>
                  <div className="relative">
                    <input
                      id="input-costos-totales"
                      type="number"
                      min="0"
                      step="100"
                      value={inputs.costosTotales}
                      onChange={(e) =>
                        onUpdateInputs({ costosTotales: Math.max(0, parseFloat(e.target.value) || 0) })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-hidden focus:border-emerald-500"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400">
                      {currency === 'USD' ? '$' : 'Bs'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Total inversión requerida</p>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="input-ventas-totales" className="text-xs font-semibold text-slate-300">
                    Ventas Totales Esperadas ({currency})
                  </label>
                  <div className="relative">
                    <input
                      id="input-ventas-totales"
                      type="number"
                      min="0"
                      step="100"
                      value={inputs.ventasTotales}
                      onChange={(e) =>
                        onUpdateInputs({ ventasTotales: Math.max(0, parseFloat(e.target.value) || 0) })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-hidden focus:border-emerald-500"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400">
                      {currency === 'USD' ? '$' : 'Bs'}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-400 font-mono">
                    Utilidad Bruta: {formatCurrency(results.gananciaBrutaProyecto, currency)} (Socio: 50%)
                  </p>
                </div>
              </>
            )}

            {/* MODOS 2 y 3: Ganancia Prometida */}
            {mode !== 'mode1' && (
              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="input-ganancia-prometida" className="text-xs font-semibold text-slate-300">
                  Ganancia Prometida / Recibida ({currency})
                </label>
                <div className="relative">
                  <input
                    id="input-ganancia-prometida"
                    type="number"
                    min="0"
                    step="50"
                    value={inputs.gananciaPrometida}
                    onChange={(e) =>
                      onUpdateInputs({ gananciaPrometida: Math.max(0, parseFloat(e.target.value) || 0) })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-hidden focus:border-emerald-500"
                    placeholder="Ej. 2000"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400">
                    {currency === 'USD' ? '$' : 'Bs'}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-400 font-mono">
                  Rendimiento Nominal: +{results.rendimientoNominalPct.toFixed(2)}% sobre tu capital
                </p>
              </div>
            )}
          </div>
        </div>

        {/* CARD 2: SECCIÓN TIEMPOS (FECHAS Y PLAZOS DINÁMICOS) */}
        <div id="section-time-inputs" className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <h2 className="text-sm sm:text-base font-bold text-white">
                2. Calendario y Horizonte Temporal
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {formatDays(results.diasTotales)} = {formatMonths(results.mesesComerciales)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="input-fecha-inicio" className="text-xs font-semibold text-slate-300">
                Fecha Aporte (Inicio)
              </label>
              <input
                id="input-fecha-inicio"
                type="date"
                value={inputs.fechaInicio}
                onChange={(e) => onUpdateInputs({ fechaInicio: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="input-fecha-fin" className="text-xs font-semibold text-slate-300">
                Fecha Devolución (Fin)
              </label>
              <input
                id="input-fecha-fin"
                type="date"
                value={inputs.fechaFin}
                onChange={(e) => onUpdateInputs({ fechaFin: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Quick Date Presets Chips */}
          <div className="pt-2 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400">Atajos rápidos:</span>
            {[30, 45, 60, 90, 120, 180].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => handleQuickAddDays(d)}
                className={`text-xs font-mono px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                  results.diasTotales === d
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
              >
                +{d}d
              </button>
            ))}
          </div>
        </div>

        {/* CARD 3: SECCIÓN BANCO (OCULTA EN MODO 3) */}
        {mode !== 'mode3' ? (
          <div id="section-bank-inputs" className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <Landmark className="w-5 h-5 text-emerald-400" />
                <h2 className="text-sm sm:text-base font-bold text-white">
                  3. Parámetros del Préstamo Bancario
                </h2>
              </div>
              <span className="text-xs font-mono text-red-400 bg-red-500/10 px-2.5 py-1 rounded-lg border border-red-500/20">
                Interés total: {formatCurrency(results.costoBanco, currency)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Monto Prestado */}
              <div className="space-y-1.5">
                <label htmlFor="input-monto-prestamo" className="text-xs font-semibold text-slate-300">
                  Monto Prestado por el Banco ({currency})
                </label>
                <div className="relative">
                  <input
                    id="input-monto-prestamo"
                    type="number"
                    min="0"
                    step="500"
                    value={inputs.montoPrestamo}
                    onChange={(e) =>
                      onUpdateInputs({ montoPrestamo: Math.max(0, parseFloat(e.target.value) || 0) })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-hidden focus:border-emerald-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400">
                    {currency === 'USD' ? '$' : 'Bs'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Capital adeudado al banco</p>
              </div>

              {/* Tasa Mensual del Banco */}
              <div className="space-y-1.5">
                <label htmlFor="input-tasa-banco" className="text-xs font-semibold text-slate-300">
                  Tasa Mensual del Banco (%)
                </label>
                <div className="relative">
                  <input
                    id="input-tasa-banco"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={inputs.tasaMensualBanco}
                    onChange={(e) =>
                      onUpdateInputs({
                        tasaMensualBanco: Math.max(0, parseFloat(e.target.value) || 0),
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-hidden focus:border-emerald-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400">% mes</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Equivalente anual: {(inputs.tasaMensualBanco * 12).toFixed(1)}% TNA
                </p>
              </div>

              {/* Tipo de Pago Dropdown */}
              <div className="space-y-1.5">
                <label htmlFor="select-tipo-pago" className="text-xs font-semibold text-slate-300">
                  Modalidad de Amortización
                </label>
                <select
                  id="select-tipo-pago"
                  value={inputs.tipoPago}
                  onChange={(e) =>
                    onUpdateInputs({ tipoPago: e.target.value as BankPaymentType })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-emerald-500"
                >
                  <option value="interest_only">Solo Interés Mensual</option>
                  <option value="french_amortization">Cuota Fija (Amortizable - Francés)</option>
                </select>
                <p className="text-[11px] text-slate-400">
                  {inputs.tipoPago === 'interest_only'
                    ? 'Cuota interés: ' + formatCurrency(results.cuotaMensualBanco, currency) + '/mes'
                    : 'Cuota mensual fija: ' + formatCurrency(results.cuotaMensualBanco, currency) + '/mes'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/40 rounded-2xl p-4 border border-dashed border-slate-800 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <HelpCircle className="w-4 h-4 text-purple-400" />
            <span>
              Parámetros de banco desactivados en <strong>Modo 3 (Inversión Pura)</strong>. Puedes activarlos cambiando a Modo 1 o 2 en Configuración.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
