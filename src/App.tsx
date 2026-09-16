/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { ConfigDrawer } from './components/ConfigDrawer';
import { BottomNav } from './components/BottomNav';
import { EvaluatorTab } from './components/EvaluatorTab';
import { SensitivityTab } from './components/SensitivityTab';
import { TheoryTab } from './components/TheoryTab';
import { useFinanceCalculator } from './hooks/useFinanceCalculator';
import { FinanceInputs, TabType } from './types';

export default function App() {
  // Helper to format ISO date
  const getTodayISO = () => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  };

  const getFutureISO = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split('T')[0];
  };

  // State principal de la aplicación
  const [activeTab, setActiveTab] = useState<TabType>('simulator');
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);

  const [inputs, setInputs] = useState<FinanceInputs>({
    mode: 'mode1',
    currency: 'USD',
    exchangeRate: 6.96,
    capitalAporte: 10000,
    fechaInicio: getTodayISO(),
    fechaFin: getFutureISO(60), // 60 días default
    costosTotales: 25000,
    ventasTotales: 31000, // Ganancia bruta 6000 -> 50% = 3000
    gananciaPrometida: 2000,
    montoPrestamo: 7500,
    tasaMensualBanco: 1.5, // 1.5% mensual
    tipoPago: 'interest_only',
  });

  // Ejecución de cálculos centralizados
  const results = useFinanceCalculator(inputs);

  // Handlers para actualizar configuración
  const handleUpdateInputs = (updated: Partial<FinanceInputs>) => {
    setInputs((prev) => ({ ...prev, ...updated }));
  };

  const handleToggleCurrency = () => {
    setInputs((prev) => ({
      ...prev,
      currency: prev.currency === 'USD' ? 'BOB' : 'USD',
    }));
  };

  const handleApplyPreset = (presetKey: 'inmobiliario' | 'importacion' | 'prestamo_puro') => {
    const today = getTodayISO();
    if (presetKey === 'inmobiliario') {
      setInputs((prev) => ({
        ...prev,
        mode: 'mode1',
        capitalAporte: 20000,
        fechaInicio: today,
        fechaFin: getFutureISO(90),
        costosTotales: 50000,
        ventasTotales: 62000,
        montoPrestamo: 15000,
        tasaMensualBanco: 1.5,
        tipoPago: 'interest_only',
      }));
    } else if (presetKey === 'importacion') {
      setInputs((prev) => ({
        ...prev,
        mode: 'mode2',
        capitalAporte: 10000,
        fechaInicio: today,
        fechaFin: getFutureISO(60),
        gananciaPrometida: 2200,
        montoPrestamo: 8000,
        tasaMensualBanco: 1.6,
        tipoPago: 'french_amortization',
      }));
    } else if (presetKey === 'prestamo_puro') {
      setInputs((prev) => ({
        ...prev,
        mode: 'mode3',
        capitalAporte: 15000,
        fechaInicio: today,
        fechaFin: getFutureISO(120),
        gananciaPrometida: 2700,
        montoPrestamo: 0,
        tasaMensualBanco: 0,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* 1. Header Global */}
      <Header
        mode={inputs.mode}
        currency={inputs.currency}
        exchangeRate={inputs.exchangeRate}
        onOpenConfig={() => setIsConfigOpen(true)}
        onToggleCurrency={handleToggleCurrency}
      />

      {/* 2. Barra de Navegación de Escritorio */}
      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />

      {/* 3. Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 sm:pb-12">
        {activeTab === 'simulator' && (
          <EvaluatorTab
            inputs={inputs}
            results={results}
            onUpdateInputs={handleUpdateInputs}
            onOpenConfig={() => setIsConfigOpen(true)}
          />
        )}

        {activeTab === 'sensitivity' && (
          <SensitivityTab inputs={inputs} results={results} />
        )}

        {activeTab === 'theory' && <TheoryTab />}
      </main>

      {/* 4. Drawer de Configuración Global */}
      <ConfigDrawer
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        inputs={inputs}
        onUpdateInputs={handleUpdateInputs}
        onApplyPreset={handleApplyPreset}
      />
    </div>
  );
}
