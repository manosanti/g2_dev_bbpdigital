import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ControlUserInfoService {
  private userRole: string = '';

  constructor() { }

  // Definir Tipo Usuário
  setUserRole(type: string) {
    this.userRole = type;
  }

  // Ler Tipo Usuário
  getUserRole(): string {
    return this.userRole;
  }

  // Verificar se o Usuário é "Consultor"
  isConsultant(): boolean {
    return this.userRole === 'Consultor';
  }

  // Verificar se o Usuário é "Cliente"
  isUserClient(): boolean {
    return this.userRole === 'Cliente';
  }
}
