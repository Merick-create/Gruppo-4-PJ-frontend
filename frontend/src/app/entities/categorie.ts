import { Movimento } from "./Movimento.entity";

export interface Categoria {
  id: string;
  Nome: string;
  Tipologia: string;
}

export interface MovimentoConCategoria extends Movimento {
  NomeCategoria: string;
}