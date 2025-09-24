import { Categoria } from "./categorie";

export interface Movimento {
  ContoCorrenteId: string;
  dataCreazione?: string; // o Date, se vuoi gestire direttamente Date
  importo: number;
  saldo?: number;
  CategoriaMovimentoid?: Categoria; // rimane l’ID se serve
  descrizione: string;
}
