import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-search-contract',
  standalone: true,
  imports: [NgIf, HttpClientModule, NgFor, ReactiveFormsModule],
  templateUrl: './search-contract.component.html',
  styleUrl: './search-contract.component.css'
})
export class SearchContractComponent implements OnInit {
  public formSearchContract: FormGroup;
  public errorMessage: string | null = null;
  public contractList: any[] = [];
  public showModal: boolean = false;

  constructor(private http: HttpClient, private fb: FormBuilder, private router: Router) {
    this.formSearchContract = this.fb.group({
      cardCode: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const cardCode = localStorage.getItem('cardCode');
    if (cardCode) {
      this.fetchContracts(cardCode).subscribe({
        next: (response) => {
          this.contractList = response || [];
          this.errorMessage = null;
        },
        error: (err) => {
          console.error('API Error:', err);
          this.errorMessage = 'Erro ao buscar os contratos.';
        }
      });
    }

    this.formSearchContract.get('cardCode')?.valueChanges
      .pipe(
        debounceTime(2000),
        distinctUntilChanged(),
        switchMap(value => this.fetchContracts(value))
      )
      .subscribe({
        next: (response) => {
          this.contractList = response || [];
          this.errorMessage = null;
        },
        error: (err) => {
          console.error('API Error:', err);
          this.errorMessage = 'Erro ao buscar os contratos.';
        }
      });
  }

  fetchContracts(cardCode: string) {
    if (!cardCode) {
      return of([]);
    }

    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    };

    return this.http.get<any[]>(`http://bbpdigital.g2tecnologia.com.br:8021/BBP/BBPCardCode?cardcode=${cardCode}`, httpOptions);
  }

  fetchBBPDetails(bbP_id: number) {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    };

    // Faz a requisição GET para o ID específico
    return this.http.get(`http://bbpdigital.g2tecnologia.com.br:8021/BBP/BBPID?bbpid=${bbP_id}`, httpOptions);
  }

  onRowClick(bbP_id: number): void {
    // Salva o bbP_id no localStorage
    localStorage.setItem('bbP_id', bbP_id.toString());
  
    // Faz a requisição para buscar os detalhes do BBP com o ID
    this.fetchBBPDetails(bbP_id).subscribe({
      next: (response) => {
        console.log('Detalhes do BBP:', response);
        // Exemplo: navegação ou outra ação com o bbP_id salvo
        this.router.navigate(['/informacoes-basicas']);
      },
      error: (err) => {
        console.error('Erro ao buscar detalhes do BBP:', err);
      }
    });
  }
  

  backToLogin(): void {
    this.router.navigate(['/sign-in']);
    localStorage.clear();
  }

  showList(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  onSubmit(): void {
    const cardCode = this.formSearchContract.get('cardCode')?.value;

    if (!cardCode) {
      this.errorMessage = 'Código é obrigatório.';
      return;
    }

    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    };

    this.http.get<any[]>(`http://bbpdigital.g2tecnologia.com.br:8021/BBP/BBPCardCode?cardcode=${cardCode}`, httpOptions).subscribe({
      next: (response: any[]) => {
        if (response && response.length > 0) {
          localStorage.setItem('cardCode', cardCode);
          this.contractList = response;
          this.errorMessage = null;
        } else {
          this.errorMessage = 'Código incorreto ou não permitido para este usuário.';
        }
      },
      error: (err) => {
        this.errorMessage = 'Erro ao verificar o código.';
      }
    });
  }
}