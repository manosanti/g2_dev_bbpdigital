import { infoBasica } from './../../../models/infobasica/infobasica.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { MenuNavigationComponent } from '../../../components/menu-navigation/menu-navigation.component';
import { HeaderComponent } from '../../../components/header/header.component';
import { CustomerFieldComponent } from '../../../components/customer-field/customer-field.component';
import { NgFor, NgIf } from '@angular/common';
// Models
import { plano_Contas_Empresa_anexo } from '../../plano_Contas_Empresa_anexo/plano_Contas_Empresa_anexo.model';
import { FormInfoService } from '../../../services/infobasica/form-info.service';
// Excel Reader
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-plano-de-contas',
  standalone: true,
  imports: [MenuNavigationComponent, HeaderComponent, CustomerFieldComponent, HttpClientModule, ReactiveFormsModule, NgIf, FormsModule, NgFor],
  templateUrl: './plano-de-contas.component.html',
  styleUrls: ['./plano-de-contas.component.css']
})
export class PlanoDeContasComponent implements OnInit {

  downloadLink: string | null = null;

  // Função para manipular a seleção do arquivo e gerar o link de download
  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      // Fazendo a requisição POST para o backend
      this.http.post<{ filePath: string }>('http://localhost:9032', formData).subscribe(
        (response) => {
          this.downloadLink = response.filePath; // Link para download
          console.log('Arquivo salvo com sucesso:', this.downloadLink);
          this.rowsPlanoContas[0].arquivo = this.downloadLink;
        },
        (error) => {
          console.error('Erro ao enviar o arquivo:', error);
        }
      );
    }
  }

  isLoading: boolean = true;

  infoBasica: infoBasica[] = [];

  formPlanoContas: FormGroup;

  // Inicialmente, a tabela tem apenas uma linha
  rowsPlanoContas: plano_Contas_Empresa_anexo[] = [
    {
      plano_Contas_Empresa_anexoid: '1',
      descricao: '',
      arquivo: '', // Aqui será armazenado o link de download
      selected: false
    }
  ];

  // Função para adicionar uma linha à tabela, mas travando para ter apenas uma linha
  addRowPlanoContas() {
    if (this.rowsPlanoContas.length < 1) {
      const newRow: plano_Contas_Empresa_anexo = {
        plano_Contas_Empresa_anexoid: '0',
        descricao: '',
        arquivo: '',
        selected: false,
      };
      this.rowsPlanoContas = [...this.rowsPlanoContas, newRow];
    } else {
      alert("Apenas uma linha é permitida.");
    }
  }

  // Função para remover as linhas selecionadas, mantendo pelo menos uma
  removeRowPlanoContas() {
    if (this.rowsPlanoContas.length > 1) {
      this.rowsPlanoContas = this.rowsPlanoContas.filter((row, index) => index === 0 || !row.selected);
    } else {
      alert("Você precisa ter pelo menos uma linha.");
    }
  }

  toggleSelectAll(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.rowsPlanoContas.forEach((row, index) => {
      if (index !== 0) {
        row.selected = isChecked;
      }
    });
  }

  trackByFn(index: number, item: plano_Contas_Empresa_anexo) {
    return item.plano_Contas_Empresa_anexoid;
  }

  constructor(private http: HttpClient, private fb: FormBuilder, private formInfoService: FormInfoService) {
    this.formPlanoContas = this.fb.group({
      descricao: ['', Validators.required],
      arquivo: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    const bbP_id = localStorage.getItem('bbP_id');
    const token = localStorage.getItem('token');

    setTimeout(() => {
      if (!token || !bbP_id) {
        // Se token ou bbP_id não estão disponíveis, recarregar a página
        window.location.reload();
      }
    }, 2000);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }),
    }

    this.http.get<infoBasica[]>(`http://bbpdigital.g2tecnologia.com.br:8021/BBP/BBPID?bbpid=${bbP_id}`, httpOptions).subscribe(
      (data: infoBasica[]) => {
        this.infoBasica = data;
        this.rowsPlanoContas = this.infoBasica[0]?.plano_Contas_Empresa_anexo || [];
        this.formInfoService.patchInfoBasicaForm(this.formPlanoContas, this.infoBasica);
        console.log('dados recuperados onInit: ', this.infoBasica);
        this.isLoading = false;
      },
      (error) => {
        console.error('Erro ao recuperar dados', error);
        this.isLoading = false;
      }
    )
  }

  deleteRow(row: plano_Contas_Empresa_anexo) {
    const bbpid = localStorage.getItem('bbP_id'); // Supondo que bbP_DadosCTBID seja o valor de bbpid
    const vcode = row.plano_Contas_Empresa_anexoid; // Use o valor apropriado de vcode
    const vtabela = '%40G2_BBP_PLANCEMPAN'; // ou algum valor dinâmico, caso necessário
    const token = localStorage.getItem('token')

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    };

    const deleteUrl = `http://bbpdigital.g2tecnologia.com.br:8021/BBP/BBP_DEL_SUBTAB?bbpid=${bbpid}&vcode=${vcode}&vtabela=${vtabela}`;

    this.http.delete(deleteUrl, httpOptions).subscribe(
      (response) => {
        console.log('Resposta da API:', response); // Verifique o que a API está retornando
        if (response) {
          // Remover a linha da tabela localmente após sucesso
          this.rowsPlanoContas = this.rowsPlanoContas.filter(r => r !== row);
        }
      },
      (error) => {
        console.error('Erro ao deletar a linha', error);
      }
    );
  }

  onSubmit(): void {
    const bbP_id = localStorage.getItem('bbP_id');
    const cardCode = localStorage.getItem('cardCode');
    const token = localStorage.getItem('token');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    };

    if (!bbP_id) {
      console.error('bbP_id não encontrado no localStorage. Por favor, verifique se o valor está sendo armazenado corretamente.');
      return; // Interrompe a execução se o bbP_id não estiver presente
    }

    const apiData = { ...this.infoBasica[0] };

    apiData.plano_Contas_Empresa_anexo = this.rowsPlanoContas;

    this.http.post('http://bbpdigital.g2tecnologia.com.br:8021/BBP', apiData, httpOptions).subscribe(
      response => {
        console.log('Dados enviados com sucesso', response);
        console.log('Dados enviados:', apiData);
        this.isLoading = false;
      },
      error => {
        console.error('Erro ao enviar dados', error);
        this.isLoading = false;
      }
    );
  }
}
