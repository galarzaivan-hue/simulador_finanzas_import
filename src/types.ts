export type AnalysisMode = 'mode1' | 'mode2' | 'mode3';

export type BankPaymentType = 'interest_only' | 'french_amortization';

export type Currency = 'USD' | 'BOB';

export type TabType = 'simulator' | 'sensitivity' | 'theory';

export interface FinanceInputs {
  mode: AnalysisMode;
  currency: Currency;
  exchangeRate: number; // e.g. 6.96 BOB per 1 USD
  capitalAporte: number;
  fechaInicio: string; // YYYY-MM-DD
  fechaFin: string; // YYYY-MM-DD
  
  // Modo 1
  costosTotales: number;
  ventasTotales: number;

  // Modos 2 y 3
  gananciaPrometida: number;

  // Parámetros Banco (Modos 1 y 2)
  montoPrestamo: number;
  tasaMensualBanco: number; // en porcentaje mensual, ej. 1.5%
  tipoPago: BankPaymentType;
}

export interface FinanceResults {
  diasTotales: number;
  mesesComerciales: number;
  gananciaBrutaProyecto: number;
  gananciaSocio: number;
  rendimientoNominal: number; // R (decimal)
  rendimientoNominalPct: number; // R * 100
  temReal: number; // Tasa Efectiva Mensual (%)
  cuotaMensualBanco: number;
  costoBanco: number;
  gananciaLimpia: number;
  rentabilidadLimpiaPct: number;
  temNetaReal: number; // TEM tras descontar costo del banco
  diagnosticStatus: 'viable' | 'warning' | 'danger' | 'pure_high' | 'pure_medium' | 'pure_low';
  diagnosticTitle: string;
  diagnosticMessage: string;
  diagnosticTip: string;
  breakevenDays: number | null;
}

export interface SensitivityDataPoint {
  dias: number;
  meses: number;
  temReal: number;
  tasaBanco: number;
  costoBanco: number;
  gananciaLimpia: number;
  viable: boolean;
  status: 'viable' | 'warning' | 'danger';
}
