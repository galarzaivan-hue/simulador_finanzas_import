import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  Clock,
  AlertCircle,
  ShieldAlert,
  Sliders,
  Calendar,
} from 'lucide-react';
import { FinanceInputs, FinanceResults } from '../types';
import { generateSensitivityCurve } from '../hooks/useFinanceCalculator';
import { formatCurrency, formatDays, formatMonths } from '../utils/formatters';

interface SensitivityTabProps {
  inputs: FinanceInputs;
  results: FinanceResults;
}

export const SensitivityTab: React.FC<SensitivityTabProps> = ({ inputs, results }) => {
  const { currency, mode, tasaMensualBanco } = inputs;
  const [additionalDelay, setAdditionalDelay] = useState<number>(0);

  // Generar curva de sensibilidad con el retraso simulado
  const sensitivityData = useMemo(() => {
    return generateSensitivityCurve(inputs, additionalDelay);
  }, [inputs, additionalDelay]);

  // Identificar el punto más cercano al plazo actual del usuario
  const currentDays = results.diasTotales + additionalDelay;

  // Custom Tooltip para el gráfico de Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1.5 font-mono">
          <div className="font-bold text-slate-200 border-b border-slate-800 pb-1 flex items-center justify-between gap-4">
            <span>Plazo: {data.dias} días</span>
            <span className="text-slate-400">({data.meses} meses)</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-emerald-400 font-semibold">
            <span>TEM Real:</span>
            <span>+{data.temReal.toFixed(2)}% / mes</span>
          </div>
          {mode !== 'mode3' && (
            <div className="flex items-center justify-between gap-4 text-red-400">
              <span>Tasa Banco:</span>
              <span>{data.tasaBanco.toFixed(2)}% / mes</span>
            </div>
          )}
          <div className="flex items-center justify-between gap-4 text-slate-300 pt-1 border-t border-slate-800">
            <span>Ganancia Limpia:</span>
            <span className="font-bold text-white">
              {formatCurrency(data.gananciaLimpia, currency)}
            </span>
          </div>
          {mode !== 'mode3' && (
            <div className="flex items-center justify-between gap-4 text-slate-400">
              <span>Costo Financiero:</span>
              <span>{formatCurrency(data.costoBanco, currency)}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div id="sensitivity-tab-container" className="space-y-6">
      {/* Header explicativo */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Curva de Sensibilidad Temporal & Erosión de Rentabilidad
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Descubre matemáticamente cómo cada día de retraso en la devolución degrada la Tasa Efectiva Mensual (TEM) y eleva el costo financiero del banco.
            </p>
          </div>
        </div>

        {results.breakevenDays !== null && mode !== 'mode3' && (
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-3 shrink-0">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Límite Crítico (Breakeven)
              </div>
              <div className="text-sm font-bold text-amber-300 font-mono">
                {results.breakevenDays} días de plazo
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Control interactivo de simulación de demora */}
      <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <span className="text-xs font-bold text-slate-200">
              Simulador de Demora en Devolución:
            </span>
            <span className="text-xs text-slate-400 ml-1">
              ¿Qué pasa si el socio se retrasa?
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-1 max-w-xs">
          <input
            id="slider-additional-delay"
            type="range"
            min="0"
            max="120"
            step="15"
            value={additionalDelay}
            onChange={(e) => setAdditionalDelay(parseInt(e.target.value, 10))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <span className="text-xs font-mono font-bold text-emerald-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 shrink-0">
            +{additionalDelay} días
          </span>
        </div>
      </div>

      {/* GRÁFICO INTERACTIVO RECHARTS */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              Curva TEM vs Plazo de Retorno (Días)
            </h3>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-3 h-1 bg-emerald-500 rounded-full" />
              TEM Real (%)
            </span>
            {mode !== 'mode3' && (
              <span className="flex items-center gap-1.5 text-red-400">
                <span className="w-3 h-0.5 border-b-2 border-dashed border-red-500" />
                Tasa Banco ({tasaMensualBanco.toFixed(2)}%)
              </span>
            )}
          </div>
        </div>

        <div className="h-72 sm:h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={sensitivityData}
              margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis
                dataKey="dias"
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickFormatter={(val) => `${val}d`}
              />
              <YAxis
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickFormatter={(val) => `${val.toFixed(1)}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />

              {/* Curva TEM Real */}
              <Line
                type="monotone"
                dataKey="temReal"
                name="Tasa Efectiva Mensual (TEM %)"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 4 }}
                activeDot={{ r: 7, fill: '#34d399' }}
              />

              {/* Línea Constante Tasa Banco (Modos 1 y 2) */}
              {mode !== 'mode3' && (
                <Line
                  type="monotone"
                  dataKey="tasaBanco"
                  name="Tasa Mensual Banco (%)"
                  stroke="#ef4444"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              )}

              {/* Referencia vertical al plazo actual */}
              <ReferenceLine
                x={currentDays}
                stroke="#38bdf8"
                strokeDasharray="4 4"
                label={{
                  value: `Tu Plazo (${currentDays}d)`,
                  fill: '#38bdf8',
                  fontSize: 10,
                  position: 'top',
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <p className="text-[11px] text-slate-400 text-center italic">
          Nota: En finanzas, la Tasa Efectiva se contrae exponencialmente a medida que el plazo se dilata para una misma ganancia nominal.
        </p>
      </div>

      {/* TABLA DE DATOS RESPONSIVA */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-sm overflow-hidden space-y-3 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              Matriz Detallada de Sensibilidad y Ganancia Limpia
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {sensitivityData.length} horizontes
          </span>
        </div>

        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Plazo</th>
                <th className="py-2.5 px-3">Meses</th>
                <th className="py-2.5 px-3">TEM Real</th>
                {mode !== 'mode3' && <th className="py-2.5 px-3">Tasa Banco</th>}
                {mode !== 'mode3' && <th className="py-2.5 px-3">Costo Interés</th>}
                <th className="py-2.5 px-3">Ganancia Limpia</th>
                <th className="py-2.5 px-3 text-right">Diagnóstico</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sensitivityData.map((pt) => {
                const isCurrent = Math.abs(pt.dias - currentDays) <= 7;
                return (
                  <tr
                    key={pt.dias}
                    className={`transition-colors ${
                      isCurrent
                        ? 'bg-emerald-950/30 font-bold text-white'
                        : 'hover:bg-slate-800/40 text-slate-300'
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span>{formatDays(pt.dias)}</span>
                        {isCurrent && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Actual
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-400">{pt.meses} m</td>
                    <td className="py-3 px-3 font-semibold text-emerald-400">
                      +{pt.temReal.toFixed(2)}%
                    </td>
                    {mode !== 'mode3' && (
                      <td className="py-3 px-3 text-red-400">{pt.tasaBanco.toFixed(2)}%</td>
                    )}
                    {mode !== 'mode3' && (
                      <td className="py-3 px-3 text-slate-400">
                        {formatCurrency(pt.costoBanco, currency)}
                      </td>
                    )}
                    <td className="py-3 px-3 font-bold text-white">
                      {formatCurrency(pt.gananciaLimpia, currency)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {pt.status === 'viable' ? (
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          Viable
                        </span>
                      ) : pt.status === 'warning' ? (
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          Riesgo
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/30">
                          Inviable
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
