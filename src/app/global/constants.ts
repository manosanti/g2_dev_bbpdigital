import { HttpHeaders } from "@angular/common/http";

export const cardCode = sessionStorage.getItem('cardCode');
export const bbP_id = sessionStorage.getItem('bbP_id');
export const token = sessionStorage.getItem('token');
export const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, }), }