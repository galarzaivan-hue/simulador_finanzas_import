import React from 'react';
import {
  BookOpen,
  Clock,
  TrendingDown,
  Calculator,
  Scale,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const TheoryTab: React.FC = () => {
  return (
    <div id="theory-tab-container" className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-sm flex items-start gap-4">
        <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Fundamento Teórico y Matemático para Inversionistas
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
            La guía definitiva sobre el Valor del Dinero en el Tiempo (TVM), la Tasa Efectiva Mensual Real (TEM), y cómo defender tu rentabilidad frente a demoras y costos bancarios.
          </p>
        </div>
      </div>

      {/* SECCIÓN 1: TVM (VALOR DEL DINERO EN EL TIEMPO) */}
      <section className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2.5">
          <Clock className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white">
            1. El Valor del Dinero en el Tiempo (Time Value of Money - TVM)
          </h3>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          Un dólar recibido hoy vale más que un dólar recibido en el futuro. Este principio elemental es frecuentemente ignorado por inversionistas cuando pactan una ganancia fija nominal sin cláusula de tiempo estricta.
        </p>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Caso A: Retorno en 30 días
            </span>
            <p className="text-xs text-slate-300">
              Ganas $1,500 sobre $10,000 en 30 días. Tu rendimiento mensual es del{' '}
              <strong className="text-white font-mono">15.00% TEM</strong>.
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Caso B: Mismo monto en 90 días
            </span>
            <p className="text-xs text-slate-300">
              Ganas los mismos $1,500 pero en 90 días. Tu rendimiento mensual efectivo colapsa a{' '}
              <strong className="text-white font-mono">4.77% TEM</strong>.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed italic">
          Conclusión: Para la misma ganancia en dinero absoluto, <strong>cada día de demora destruye exponencialmente la tasa de retorno de tu capital</strong>.
        </p>
      </section>

      {/* SECCIÓN 2: TASA NOMINAL VS TASA EFECTIVA COMPUESTA (TEM) */}
      <section className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2.5">
          <TrendingDown className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white">
            2. Tasa Nominal Simple vs. Tasa Efectiva Mensual (TEM) Compuesta
          </h3>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          El error más común entre socios comerciales es dividir linealmente la ganancia entre los meses transcurridos (Tasa Nominal Simple). La tasa real es <strong>exponencial compuesta</strong>:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-red-400">
              ❌ Tasa Nominal Simple (Engañosa):
            </span>
            <div className="font-mono text-sm text-slate-200 bg-slate-900 p-2 rounded-lg">
              Tasa_Simple = R / (D / 30)
            </div>
            <p className="text-xs text-slate-400">
              Ignora la capitalización de intereses y el costo de oportunidad reinvertible en cada mes comercial.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
            <span className="text-xs font-bold text-emerald-400">
              ✅ Tasa Efectiva Mensual (TEM Real):
            </span>
            <div className="font-mono text-sm text-emerald-300 bg-slate-900 p-2 rounded-lg">
              TEM = [ (1 + R)^(30 / D) - 1 ] × 100
            </div>
            <p className="text-xs text-slate-400">
              Mide con precisión matemática la velocidad a la que se multiplica tu dinero en ciclos de 30 días.
            </p>
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: CAJA DE FÓRMULAS MATEMÁTICAS */}
      <section className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2.5">
          <Calculator className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white">
            3. Ecuaciones del Simulador
          </h3>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {/* Formula 1 */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] font-sans font-semibold text-slate-400 block mb-1">
              A) Rendimiento Nominal Global (R):
            </span>
            <div className="text-sm font-bold text-slate-200">
              R = Ganancia_Socio / Aporte_Capital
            </div>
            <span className="text-[10px] text-slate-500 font-sans mt-1 block">
              En Modo 1: Ganancia_Socio = (Ventas - Costos) × 0.50
            </span>
          </div>

          {/* Formula 2 */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] font-sans font-semibold text-slate-400 block mb-1">
              B) Tasa Efectiva Mensual Real (TEM):
            </span>
            <div className="text-sm font-bold text-emerald-400">
              TEM (%) = [ (1 + R)^(30 / Días_Totales) - 1 ] × 100
            </div>
          </div>

          {/* Formula 3 */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] font-sans font-semibold text-slate-400 block mb-1">
              C) Costo Financiero Bancario:
            </span>
            <div className="text-slate-200 space-y-1">
              <div>
                • Solo Interés: <span className="text-red-400">Costo = Monto × r × (D / 30)</span>
              </div>
              <div>
                • Cuota Fija (Francés):{' '}
                <span className="text-red-400">
                  Cuota = Monto × [r(1+r)^M] / [(1+r)^M - 1]
                </span>
              </div>
              <div>
                • Costo Total Francés:{' '}
                <span className="text-red-400">Costo = (Cuota × M) - Monto</span>
              </div>
            </div>
          </div>

          {/* Formula 4 */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] font-sans font-semibold text-slate-400 block mb-1">
              D) Ganancia Limpia Final:
            </span>
            <div className="text-sm font-bold text-white">
              Ganancia_Limpia = Ganancia_Socio - Costo_Bancario
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 4: COMPARATIVA MODALIDADES DE PRÉSTAMO */}
      <section className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2.5">
          <Scale className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white">
            4. Modalidades de Préstamo: Interés Puro vs. Cuota Fija Amortizable
          </h3>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          ¿Por qué la Cuota Fija Amortizable (Sistema Francés) ahorra intereses en comparación con pagar únicamente el interés mensual?
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              Solo Interés Mensual (Bullet)
            </h4>
            <p className="text-slate-400 leading-relaxed">
              El capital principal prestado permanece <strong>100% intacto</strong> durante todo el período. Pagas la misma cantidad de interés mes a mes hasta el día final donde debes devolver el monto íntegro.
            </p>
            <div className="p-2 rounded bg-slate-900 font-mono text-[11px] text-amber-300">
              Máximo interés acumulado pagado al banco.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Cuota Fija Amortizable (Francés)
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Cada cuota mensual pagada se compone de <strong>Interés + Amortización de Capital</strong>. Al reducirse progresivamente la deuda viva, el banco cobra intereses sobre una base menor cada mes.
            </p>
            <div className="p-2 rounded bg-slate-900 font-mono text-[11px] text-emerald-300">
              Ahorro significativo en el costo financiero total.
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 5: ARGUMENTARIO DE NEGOCIACIÓN PARA INVERSIONISTAS */}
      <section className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white">
            5. Argumentario Listo para Negociar con Socios
          </h3>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          Utiliza estas 4 reglas innegociables para blindar tu capital en contratos privados o acuerdos de inversión:
        </p>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold shrink-0">
              1
            </span>
            <div>
              <strong className="text-white font-semibold">
                Cláusula de Penalidad TEM por Demora:
              </strong>
              <p className="text-slate-400 mt-0.5">
                "Si la devolución excede la fecha pactada, el socio o proyecto compensará un interés moratorio diario equivalente a la TEM acordada originalmente, para evitar que la dilución temporal destruya el retorno."
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold shrink-0">
              2
            </span>
            <div>
              <strong className="text-white font-semibold">
                Spread Mínimo de Apalancamiento (+1.0% mensual):
              </strong>
              <p className="text-slate-400 mt-0.5">
                Nunca tomes un crédito bancario si la TEM esperada no supera en al menos 100 puntos básicos (1.0% mensual) la tasa de interés del banco. Trabajar al límite del costo financiero es asumir riesgo de capital sin prima de ganancia.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold shrink-0">
              3
            </span>
            <div>
              <strong className="text-white font-semibold">
                Prioridad de Cobro para Cancelar Deuda Bancaria:
              </strong>
              <p className="text-slate-400 mt-0.5">
                Los primeros cobros o liquidaciones de inventario deben destinarse directamente a cancelar el crédito bancario para detener el reloj de intereses de inmediato.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold shrink-0">
              4
            </span>
            <div>
              <strong className="text-white font-semibold">
                Moneda de Devolución e Indexación:
              </strong>
              <p className="text-slate-400 mt-0.5">
                Si inviertes en USD pero operas en BOB (o viceversa), fija el tipo de cambio pactado o indexa la ganancia al costo de reposición de divisas para protegerte de devaluaciones imprevistas.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
