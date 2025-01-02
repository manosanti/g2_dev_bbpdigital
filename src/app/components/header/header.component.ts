import { NgIf } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component, AfterViewInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, NgIf, ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements AfterViewInit {
  public formSearchContract: FormGroup;
  public errorMessage: string | null = null;

  isDarkTheme = localStorage.getItem('isDarkTheme')! === 'true'

  constructor(private renderer: Renderer2, private router: Router, private http: HttpClient, private fb: FormBuilder) {
    this.formSearchContract = this.fb.group({
      cardCode: ['', Validators.required],
    });
  }

  logout(){
    sessionStorage.clear();
    this.router.navigate(['/sign-in']);
    window.location.reload();
  }

  ngAfterViewInit(): void {
    // Aplica o tema armazenado no localStorage ao carregar a página
    document.body.classList.toggle('dark', this.isDarkTheme);

    const modalCard = this.renderer.selectRootElement('#modalCard', true)
    this.renderer.setStyle(modalCard, 'display', 'none')
  }

  // Função para alternar o tema
  toggleTheme(): void {
    // Alterna o valor do tema
    this.isDarkTheme = !this.isDarkTheme;

    // Salva o estado no localStorage
    localStorage.setItem('isDarkTheme', String(this.isDarkTheme));

    // Adiciona ou remove a classe 'dark' no body
    document.body.classList.toggle('dark', this.isDarkTheme);
  }

  showSearch(): void {
    const modalCard = this.renderer.selectRootElement('#modalCard', true);
    this.renderer.setStyle(modalCard, 'display', 'flex');
  }

  toCloseModal(): void {
    const modalCard = this.renderer.selectRootElement('#modalCard', true);
    this.renderer.setStyle(modalCard, 'display', 'none')
  }

  onSubmit() {
    const cardCode = this.formSearchContract.get('cardCode')?.value;

    if (!cardCode) {
      this.errorMessage = 'Código é obrigatório.';
      return;
    }

    const token = sessionStorage.getItem('token');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    };

    console.log('Making GET request to /api/BBP/BBPCardCode?cardcode=', cardCode);
    this.http.get<any[]>(`/api/BBP/BBPCardCode?cardcode=${cardCode}`, httpOptions).subscribe({
      next: (response: any[]) => {
        console.log('API Response:', response);
        if (response && response.length > 0) {
          sessionStorage.setItem('cardCode', cardCode)
          this.router.navigate(['/informacoes-basicas']);
          this.errorMessage = null;
          window.location.reload();
        } else {
          console.log('Código incorreto ou não permitido');
          this.errorMessage = 'Código incorreto ou não permitido para este usuário.';
        }
      },
      error: (err) => {
        console.error('API Error:', err);
        this.errorMessage = 'Erro ao verificar o código.';
      }
    });    
  }
}