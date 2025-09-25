import { Categoria } from "./categorie";
import { User } from "./user.entity";

export interface Movimento {
  _id?: string;
  ContoCorrenteId: User;
  dataCreazione?: string; 
  importo: number;
  saldo?: number;
  CategoriaMovimentoid?: Categoria; 
  descrizione: string;
}
