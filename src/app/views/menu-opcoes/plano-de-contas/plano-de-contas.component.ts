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
      const reader = new FileReader();

      reader.onload = () => {
        const blob = new Blob([reader.result as ArrayBuffer], { type: file.type });
        this.downloadLink = URL.createObjectURL(blob);

        // Atualizar a coluna "arquivo" com o link gerado
        this.rowsPlanoContas[0].arquivo = this.downloadLink;
      };

      reader.readAsArrayBuffer(file);
    }
  }

  // readExcelFile(event: any) {
  //   // Certifique-se de que há um arquivo no evento
  //   if (event.target.files.length === 0) {
  //     console.log("Nenhum arquivo selecionado!");
  //     return;
  //   }
  
  //   var file = event.target.files[0]; // Obtém o primeiro arquivo
  
  //   // Instancia um novo FileReader
  //   const fileReader = new FileReader();
  
  //   // Quando o arquivo for carregado
  //   fileReader.onload = (e) => {
  //     // Supondo que XLSX esteja devidamente importado e disponível
  //     const data = new Uint8Array(fileReader.result as ArrayBuffer);
  //     const workbook = XLSX.read(data, { type: 'array' });
  //     const sheetName = workbook.SheetNames[0];
  //     const worksheet = workbook.Sheets[sheetName];
  
  //     // Defina o cabeçalho conforme desejado
  //     const headers = ['id', 'teste col', 'teste coluna']; // Nomes dos headers
  //     const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Obtém todas as linhas
  
  //     // Formate os dados
  //     const formattedData = excelData.slice(1).map((row: any, index: number) => {
  //       return {
  //         id: row[0],                // Atribui a primeira coluna a 'id'
  //         'teste col': row[1],        // Atribui a segunda coluna a 'teste col'
  //         'teste coluna': row[2]      // Atribui a terceira coluna a 'teste coluna'
  //       };
  //     });
  
  //     console.log("Dados formatados", formattedData);
  //   };
  
  //   // Lê o arquivo como ArrayBuffer
  //   fileReader.readAsArrayBuffer(file);
  // }
  
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
        plano_Contas_Empresa_anexoid: '1',
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
    const bbP_id = sessionStorage.getItem('bbP_id');
    const token = sessionStorage.getItem('token');

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

    this.http.get<infoBasica[]>(`/api/BBP/BBPID?bbpid=${bbP_id}`, httpOptions).subscribe(
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

  onSubmit(): void {
    const bbP_id = sessionStorage.getItem('bbP_id');
    const cardCode = sessionStorage.getItem('cardCode');
    const token = sessionStorage.getItem('token');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    };

    if (!bbP_id) {
      console.error('bbP_id não encontrado no sessionStorage. Por favor, verifique se o valor está sendo armazenado corretamente.');
      return; // Interrompe a execução se o bbP_id não estiver presente
    }

    const apiData = { ...this.infoBasica[0] };

    apiData.plano_Contas_Empresa_anexo = this.rowsPlanoContas;

    this.http.post('/api/BBP', apiData, httpOptions).subscribe(
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
