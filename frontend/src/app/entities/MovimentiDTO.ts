import { User } from "./user.entity";

export interface MovimentiDTO {
  ContoCorrenteId: User|string; 
  numeroTelefono?: string; 
  operatore?: string;    
  importo: number;              
  descrizione: string;          
  CategoriaMovimentoid: string; 
}

