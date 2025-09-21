export interface Movimento {
  ContoCorrenteId: string;
  dataCreazione?: string; // o Date, se vuoi gestire direttamente Date
  importo: number;
  saldo?: number;
  CategoriaMovimentoid?: string; // rimane l’ID se serve
  NomeCategoria?: string;       // campo aggiunto dal backend
  descrizione: string;
}
