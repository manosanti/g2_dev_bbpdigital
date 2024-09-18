import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = sessionStorage.getItem('token');
    if (token) {
      // Se o token existir, permitir o acesso
      return true;
    } else {
      // Se não houver token, redirecionar para a página de login
      this.router.navigate(['/sign-in']);
      return false;
    }
  }
}