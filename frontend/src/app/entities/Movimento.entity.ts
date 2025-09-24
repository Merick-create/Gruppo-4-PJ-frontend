import { Categoria } from "./categorie";

export interface Movimento {
  _id?: string;
  ContoCorrenteId: string;
  dataCreazione?: string; 
  importo: number;
  saldo?: number;
  CategoriaMovimentoid?: Categoria; 
  descrizione: string;
}
