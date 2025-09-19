export interface Movimento {
  _Id: string;
  data: string;
  importo: number;
  conto: string;
  CategoriaMovimentoid: { 
    _id: string;
    NomeCategoria: string;
    Tipologia: string;
  };
  descrizione: string;
}
