import { useMemo } from 'react';
import {
  FinanceInputs,
  FinanceResults,
  SensitivityDataPoint,
} from '../types';

export function calculateDaysBetween(startDateStr: string, endDateStr: string): number {
  if (!startDateStr || !endDateStr) return 30;
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays); // Mínimo 1 día para prevenir divisiones por 0
}

export function computeFinanceMetrics(inputs: FinanceInputs): FinanceResults {
  const {
    mode,
    capitalAporte,
    fechaInicio,
    fechaFin,
    costosTotales,
    ventasTotales,
    gananciaPrometida,
    montoPrestamo,
    tasaMensualBanco,
    tipoPago,
  } = inputs;

  // 1. Cálculo de Tiempo
  const diasTotales = calculateDaysBetween(fechaInicio, fechaFin);
  const mesesComerciales = diasTotales / 30.0;

  // 2. Rendimiento Nominal Global (R)
  let gananciaBrutaProyecto = 0;
  let gananciaSocio = 0;

  if (mode === 'mode1') {
    gananciaBrutaProyecto = ventasTotales - costosTotales;
    gananciaSocio = gananciaBrutaProyecto * 0.50; // 50% según especificación
  } else {
    gananciaSocio = gananciaPrometida;
  }

  const safeAporte = Math.max(1, capitalAporte);
  const rendimientoNominal = gananciaSocio / safeAporte;
  const rendimientoNominalPct = rendimientoNominal * 100;

  // 3. Tasa Efectiva Mensual Real (TEM)
  // Fórmula: TEM (%) = [ (1 + R)^(30 / D) - 1 ] * 100
  let temReal = 0;
  if (1 + rendimientoNominal > 0 && diasTotales > 0) {
    temReal = (Math.pow(1 + rendimientoNominal, 30.0 / diasTotales) - 1) * 100;
  } else {
    temReal = -100;
  }

  // 4. Costo Bancario (Solo Modos 1 y 2)
  let costoBanco = 0;
  let cuotaMensualBanco = 0;

  if (mode !== 'mode3' && montoPrestamo > 0) {
    const r = tasaMensualBanco / 100.0;
    if (tipoPago === 'interest_only') {
      costoBanco = montoPrestamo * r * mesesComerciales;
      cuotaMensualBanco = montoPrestamo * r; // Cuota periódica de solo interés
    } else {
      // Cuota Fija (Amortizable - Sistema Francés)
      // Cuota = Monto * [ r * (1 + r)^M ] / [ ((1 + r)^M) - 1 ]
      if (r > 0 && mesesComerciales > 0) {
        const factor = Math.pow(1 + r, mesesComerciales);
        cuotaMensualBanco = (montoPrestamo * (r * factor)) / (factor - 1);
        costoBanco = (cuotaMensualBanco * mesesComerciales) - montoPrestamo;
      } else {
        cuotaMensualBanco = montoPrestamo / Math.max(1, mesesComerciales);
        costoBanco = 0;
      }
    }
  }

  // 5. Ganancia Limpia Final
  const gananciaLimpia = gananciaSocio - costoBanco;
  const rentabilidadLimpiaPct = (gananciaLimpia / safeAporte) * 100;

  // TEM Neta tras descontar costo del banco
  const rNet = gananciaLimpia / safeAporte;
  let temNetaReal = 0;
  if (1 + rNet > 0 && diasTotales > 0) {
    temNetaReal = (Math.pow(1 + rNet, 30.0 / diasTotales) - 1) * 100;
  } else {
    temNetaReal = -100;
  }

  // Diagnóstico
  let diagnosticStatus: FinanceResults['diagnosticStatus'] = 'viable';
  let diagnosticTitle = '';
  let diagnosticMessage = '';
  let diagnosticTip = '';

  if (mode === 'mode3') {
    if (temReal >= 2.5) {
      diagnosticStatus = 'pure_high';
      diagnosticTitle = 'Rentabilidad Pura Excepcional';
      diagnosticMessage = `La operación rinde un ${temReal.toFixed(2)}% mensual efectivo real (${(temReal * 12).toFixed(1)}% anualizado simple). Es un rendimiento muy por encima de tasas de referencia bancarias o bonos.`;
      diagnosticTip = 'Asegura que las garantías de cumplimiento contractual cubran el plazo acordado para no degradar esta tasa.';
    } else if (temReal >= 1.0) {
      diagnosticStatus = 'pure_medium';
      diagnosticTitle = 'Rentabilidad Pura Atractiva';
      diagnosticMessage = `Rendimiento mensual del ${temReal.toFixed(2)}% mensual. Es un retorno saludable para una inversión de capital sin apalancamiento de deuda.`;
      diagnosticTip = 'Supervisa el calendario de pagos: cualquier retraso de semanas disminuirá tu tasa mensual efectiva.';
    } else {
      diagnosticStatus = 'pure_low';
      diagnosticTitle = 'Rentabilidad Baja o Sensible';
      diagnosticMessage = `Con un ${temReal.toFixed(2)}% mensual, el retorno puede resultar insuficiente considerando la inflación, costo de oportunidad o riesgo operativo.`;
      diagnosticTip = 'Negocia un mayor porcentaje de participación o una penalidad por demora para elevar el retorno efectivo.';
    }
  } else {
    const spread = temReal - tasaMensualBanco;
    if (spread > 1.0) {
      diagnosticStatus = 'viable';
      diagnosticTitle = 'Estructura Financiera Viable (Spread Positivo)';
      diagnosticMessage = `Tu TEM (${temReal.toFixed(2)}%) supera con holgura la tasa del banco (${tasaMensualBanco.toFixed(2)}%) por un margen de +${spread.toFixed(2)}% mensual. El apalancamiento bancario juega a tu favor y deja una ganancia limpia de ${gananciaLimpia.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`;
      diagnosticTip = 'Excelente configuración. Asegúrate de que el plazo de pago del proyecto no supere el horizonte bancario.';
    } else if (spread >= 0) {
      diagnosticStatus = 'warning';
      diagnosticTitle = 'Zona de Riesgo (Margen Estrecho con el Banco)';
      diagnosticMessage = `Tu TEM (${temReal.toFixed(2)}%) está muy cerca de la tasa bancaria (${tasaMensualBanco.toFixed(2)}%). El spread es de solo +${spread.toFixed(2)}% mensual. Cualquier imprevisto o demora en la devolución convertirá la operación en una pérdida financiera.`;
      diagnosticTip = 'Alerta: Exige penalidades por mora al socio o acorta el plazo para evitar que el banco absorba toda la utilidad.';
    } else {
      diagnosticStatus = 'danger';
      diagnosticTitle = '¡Estructura Inviable! Le estás trabajando al banco';
      diagnosticMessage = `La TEM (${temReal.toFixed(2)}%) es inferior a la tasa que te cobra el banco (${tasaMensualBanco.toFixed(2)}% mensual). El costo financiero devora tu rentabilidad e incurres en un diferencial negativo de ${spread.toFixed(2)}% mensual.`;
      diagnosticTip = 'Reestructura el acuerdo: debes aumentar la ganancia acordada, reducir la tasa bancaria o eliminar el préstamo.';
    }
  }

  // Estimación de Breakeven en días (cuándo TEM cae por debajo de la tasa del banco o ganancia limpia <= 0)
  let breakevenDays: number | null = null;
  if (mode !== 'mode3' && tasaMensualBanco > 0 && rendimientoNominal > 0) {
    // TEM = [ (1 + R)^(30/D) - 1 ] * 100 = tasaBanco
    // (1 + R)^(30/D) = 1 + tasaBanco/100
    // (30/D) * ln(1 + R) = ln(1 + tasaBanco/100)
    // D = 30 * ln(1 + R) / ln(1 + tasaBanco/100)
    const targetR = tasaMensualBanco / 100.0;
    if (targetR > 0) {
      const calculatedDays = (30 * Math.log(1 + rendimientoNominal)) / Math.log(1 + targetR);
      if (calculatedDays > 0 && isFinite(calculatedDays)) {
        breakevenDays = Math.round(calculatedDays);
      }
    }
  }

  return {
    diasTotales,
    mesesComerciales,
    gananciaBrutaProyecto,
    gananciaSocio,
    rendimientoNominal,
    rendimientoNominalPct,
    temReal,
    cuotaMensualBanco,
    costoBanco,
    gananciaLimpia,
    rentabilidadLimpiaPct,
    temNetaReal,
    diagnosticStatus,
    diagnosticTitle,
    diagnosticMessage,
    diagnosticTip,
    breakevenDays,
  };
}

export function generateSensitivityCurve(
  inputs: FinanceInputs,
  additionalDelayDays: number = 0
): SensitivityDataPoint[] {
  const baseDays = [30, 45, 60, 75, 90, 120, 150, 180, 210, 240, 300, 360];
  const { mode, capitalAporte, gananciaPrometida, ventasTotales, costosTotales, montoPrestamo, tasaMensualBanco, tipoPago } = inputs;

  let gananciaSocio = 0;
  if (mode === 'mode1') {
    gananciaSocio = (ventasTotales - costosTotales) * 0.5;
  } else {
    gananciaSocio = gananciaPrometida;
  }

  const safeAporte = Math.max(1, capitalAporte);
  const R = gananciaSocio / safeAporte;

  return baseDays.map((diasBase) => {
    const dias = diasBase + additionalDelayDays;
    const meses = dias / 30.0;

    // TEM Real
    let temReal = 0;
    if (1 + R > 0 && dias > 0) {
      temReal = (Math.pow(1 + R, 30.0 / dias) - 1) * 100;
    }

    // Costo del Banco a este plazo
    let costoBanco = 0;
    if (mode !== 'mode3' && montoPrestamo > 0) {
      const r = tasaMensualBanco / 100.0;
      if (tipoPago === 'interest_only') {
        costoBanco = montoPrestamo * r * meses;
      } else {
        if (r > 0 && meses > 0) {
          const factor = Math.pow(1 + r, meses);
          const cuota = (montoPrestamo * (r * factor)) / (factor - 1);
          costoBanco = (cuota * meses) - montoPrestamo;
        }
      }
    }

    const gananciaLimpia = gananciaSocio - costoBanco;
    const tasaBanco = mode === 'mode3' ? 0 : tasaMensualBanco;

    let viable = true;
    let status: SensitivityDataPoint['status'] = 'viable';
    if (mode !== 'mode3') {
      if (temReal > tasaBanco + 1.0 && gananciaLimpia > 0) {
        status = 'viable';
        viable = true;
      } else if (temReal >= tasaBanco && gananciaLimpia >= 0) {
        status = 'warning';
        viable = true;
      } else {
        status = 'danger';
        viable = false;
      }
    } else {
      status = temReal >= 1.0 ? 'viable' : temReal > 0 ? 'warning' : 'danger';
      viable = temReal > 0;
    }

    return {
      dias,
      meses: Number(meses.toFixed(2)),
      temReal: Number(temReal.toFixed(2)),
      tasaBanco: Number(tasaBanco.toFixed(2)),
      costoBanco: Number(costoBanco.toFixed(2)),
      gananciaLimpia: Number(gananciaLimpia.toFixed(2)),
      viable,
      status,
    };
  });
}

export function useFinanceCalculator(inputs: FinanceInputs) {
  const results = useMemo(() => computeFinanceMetrics(inputs), [inputs]);
  return results;
}
