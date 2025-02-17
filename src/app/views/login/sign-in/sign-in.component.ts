import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FooterLoginComponent } from '../../../components/footer-login/footer-login.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [RouterModule, FooterLoginComponent, ReactiveFormsModule, HttpClientModule, NgIf],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  isLoading: boolean = false;
  loginForm: FormGroup;
  isDarkTheme = localStorage.getItem('isDarkTheme')! === 'true';

  constructor(private fb: FormBuilder, private router: Router, private renderer: Renderer2, private http: HttpClient) {
    this.loginForm = this.fb.group({
      vemail: ['', Validators.required],
      senha: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.isDarkTheme = localStorage.getItem('isDarkTheme') === 'true';
    document.body.classList.toggle('dark', this.isDarkTheme);
  }

  onSubmit() {
    const loginData = {
      "nomeUsuario": "G2",
      "senha": "1234"
    };
  
    this.http.post('http://bbpdigital.g2tecnologia.com.br:8021/Seguranca', loginData).pipe(
      switchMap((response: any) => {
        console.log('Login bem-sucedido!', response);
        localStorage.setItem('token', response.token);
  
        const email = this.loginForm.get('vemail')?.value;
        const emailEncoded = email.replace('@', '%40');
        const senha = this.loginForm.get('senha')?.value;
        const getToken = localStorage.getItem('token');
        const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'bearer ' + getToken })
        };
  
        return this.http.get(`http://bbpdigital.g2tecnologia.com.br:8021/UsuarioPortal/UsuarioPortalLogin?vemail=${emailEncoded}&senha=${senha}`, httpOptions);
      })
    ).subscribe(
      (response: any) => {
        if (response.ativo === 'Ativo' || response.status === 200) {
          console.log('Usuário ativo, redirecionando...');
          this.hideLoginFailedMessage();  // Esconde a mensagem de erro caso exista
          this.router.navigate(['/search-contract']);
          localStorage.setItem('cardCode', response.cardCode);
          localStorage.setItem('userRole', response.ativo);
        } else {
          console.error('Usuário inativo ou credenciais inválidas');
          this.showLoginFailedMessage();  // Mostra a mensagem de erro
        }
      },
      (error: HttpErrorResponse) => {
        console.error('Erro ao fazer login', error);
        this.showLoginFailedMessage();  // Mostra a mensagem de erro
      }
    );
  }
  
  showLoginFailedMessage() {
    const loginFailedElement = document.getElementById('loginFailed');
    if (loginFailedElement) {
      this.renderer.setStyle(loginFailedElement, 'display', 'block'); // Mostra a mensagem
    }
  }
  
  hideLoginFailedMessage() {
    const loginFailedElement = document.getElementById('loginFailed');
    if (loginFailedElement) {
      this.renderer.setStyle(loginFailedElement, 'display', 'none'); // Esconde a mensagem
    }
  }
  
}
