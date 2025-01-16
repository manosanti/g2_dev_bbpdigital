import { HttpHeaders } from "@angular/common/http";

export const cardCode = localStorage.getItem('cardCode');
export const bbP_id = localStorage.getItem('bbP_id');
export const token = localStorage.getItem('token');
export const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, }), }

// Nome de Tabelas para DELETE
export const deleteCentroCustoDim = 'G2_BBP_DIMCC';
export const deleteCentroCusto = 'G2_BBP_DEFCC';