import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private refreshTokenSub: Subscription | null = null;
  private refreshInterval = 5 * 60 * 1000; // 5 minutos (300.000 milissegundos)
  private endTime = Date.now() + 8 * 60 * 60 * 1000; // 8 horas

  constructor(private http: HttpClient, private router: Router) {}

  startTokenRefresh(credentials: { nomeUsuario: string; senha: string }) {
    if (this.refreshTokenSub) {
      console.warn('Token refresh já está ativo.');
      return; // Evita múltiplos intervalos
    }

    console.log('Iniciando refresh do token...');

    this.refreshTokenSub = interval(this.refreshInterval).subscribe(() => {
      if (Date.now() > this.endTime) {
        console.log('Sessão expirada após 8 horas.');
        this.stopTokenRefresh();
        this.handleSessionExpired();
        return;
      }

      this.http.post('http://portal360.g2tecnologia.com.br:8022/Seguranca', credentials).subscribe(
        (response: any) => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            console.log('Token atualizado:', response.token); // Verifique se o token está sendo atualizado no console
          } else {
            console.error('Erro ao atualizar o token: Resposta inválida.');
          }
        },
        (error: HttpErrorResponse) => {
          if (error.status === 401) {
            console.error('Erro 401 detectado. Sessão expirou.');
            this.stopTokenRefresh();
            this.handleSessionExpired();
          } else {
            console.error('Erro ao atualizar o token:', error);
          }
        }
      );
    });

    console.log('Token refresh iniciado.');
  }

  stopTokenRefresh() {
    if (this.refreshTokenSub) {
      this.refreshTokenSub.unsubscribe();
      this.refreshTokenSub = null;
      console.log('Token refresh parado.');
    }
  }

  private handleSessionExpired() {
    alert('Sua sessão expirou. Por favor, faça login novamente.');
    this.router.navigate(['/sign-in']);
  }
}
