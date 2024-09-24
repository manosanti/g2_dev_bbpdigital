import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../../components/header/header.component";
import { CustomerFieldComponent } from "../../../components/customer-field/customer-field.component";
import { MenuNavigationComponent } from "../../../components/menu-navigation/menu-navigation.component";
import { NgIf, NgFor, NgClass, NgSwitchDefault, NgSwitchCase, NgSwitch } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
// Models
import { definicao_Despesas } from './../../../models/definicao-despesas/definicao_Despesas.model';
import { despesas_Adicionais } from '../../../models/definicao-despesas/despesas_Adicionais.model';
import { listaDefinicaoDespesas } from '../../../models/definicao-despesas/listaDefinicaoDespesas.model';
import { infoBasica } from '../../../models/infobasica/infobasica.model';

@Component({
  selector: 'app-definicao-despesas',
  standalone: true,
  imports: [HeaderComponent, CustomerFieldComponent, MenuNavigationComponent, NgIf, NgFor, NgClass, NgSwitchDefault, NgSwitchCase, NgSwitch, FormsModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './definicao-despesas.component.html',
  styleUrl: './definicao-despesas.component.css'
})
export class DefinicaoDespesasComponent implements OnInit {
  isLoading: boolean = true;

  formDefinicaoDespesas: FormGroup;

  private generatedIds: Set<string> = new Set();

  private generateUniqueId(): string {
    let newId: string;
    do {
      // Gera um ID aleatório
      newId = Math.random().toString(36).substring(2, 15);
    } while (this.generatedIds.has(newId)); // Verifica se o ID já foi gerado

    // Adiciona o novo ID ao conjunto
    this.generatedIds.add(newId);
    return newId;
  }

  // Array de Tabelas
  definicao_DespesasRows: definicao_Despesas[] = [];
  despesas_AdicionaisRows: despesas_Adicionais[] = [];

  modals = [
    { id: 'definicao_Despesas', title: 'definicao_Despesas', description: 'Preencher informações pendentes', isVisible: false, icon: 'fa-solid fa-money-bill-transfer' },
    { id: 'despesas_Adicionais', title: 'despesas_Adicionais', description: 'Preencher Dados Contábeis', isVisible: false, icon: 'fa-solid fa-money-bill-transfer' },
  ];

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.formDefinicaoDespesas = this.fb.group({
      despesas_Adicionaisid: ['', Validators.required],
      nome_despesa: ['', Validators.required],
      conta_receita: ['', Validators.required],
      conta_despesa: ['', Validators.required],
      valor_fixo_receitas: ['', Validators.required],
      valor_fixo_despesas: ['', Validators.required],
      sujetio_irf: ['', Validators.required],
      metodo_distribuicao: ['', Validators.required],
      metodo_transferencia: ['', Validators.required],
      estoque: ['', Validators.required],
      ultimo_preco_compra: ['', Validators.required],
      tipo_despesas_adicionais: ['', Validators.required],
      // definicao_Despesas
      definicao_Despesasid: ['', Validators.required],
      nome: ['', Validators.required],
      alocacao_por: ['', Validators.required],
      conta_alocacao_despesas_importacao: ['', Validators.required],
    })
  }

  addNovasRowsAdicionais: despesas_Adicionais[] = [];
  addRowDespesasAdicionais() {
    const newRow: despesas_Adicionais = {
      despesas_Adicionaisid: this.generateUniqueId(),
      nome_despesa: '',
      conta_receita: '',
      conta_despesa: '',
      valor_fixo_receitas: 0,
      valor_fixo_despesas: 0,
      sujetio_irf: '',
      metodo_distribuicao: '',
      metodo_transferencia: '',
      estoque: '',
      ultimo_preco_compra: '',
      tipo_despesas_adicionais: '',
      selected: false,
    }
    this.despesas_AdicionaisRows = [...this.despesas_AdicionaisRows, newRow];
    this.addNovasRowsAdicionais.push(newRow);
  }

  addNovasRowsDespesas: definicao_Despesas[] = [];
  addRowDefinicaoDespesas() {
    const newRow: definicao_Despesas = {
      definicao_Despesasid: this.generateUniqueId(),
      nome: '',
      alocacao_por: '',
      conta_alocacao_despesas_importacao: '',
      selected: false,
    }
    this.definicao_DespesasRows = [...this.definicao_DespesasRows, newRow];
    this.addNovasRowsDespesas.push(newRow);
  }

  removeSelectedDespesasAdicionais() {
    this.despesas_AdicionaisRows = this.despesas_AdicionaisRows.filter(row => !row.selected);
  }

  removeSelectedDefinicaoDespesas() {
    this.definicao_DespesasRows = this.definicao_DespesasRows.filter(row => !row.selected);
  }

  toggleSelectAllDespesasAdicionais(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.despesas_AdicionaisRows.forEach(row => {
      row.selected = isChecked;
    });
  }

  toggleSelectAllDefinicaoDespesas(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.definicao_DespesasRows.forEach(row => {
      row.selected = isChecked;
    });
  }

  trackByFnDespesasAdicionais(index: number, item: despesas_Adicionais) {
    return item.despesas_Adicionaisid;
  }

  trackByFnDefinicaoDespesas(index: number, item: definicao_Despesas) {
    return item.definicao_Despesasid;
  }

  nextId = 1;

  listaDefinicaoDespesas: listaDefinicaoDespesas[] = [];

  infoBasica: infoBasica[] = [];

  ngOnInit(): void {
    const token = sessionStorage.getItem('token');
    const bbP_id = sessionStorage.getItem('bbP_id');

    setTimeout(() => {
      if (!token || !bbP_id) {
        // Se token ou bbP_id não estão disponíveis, recarregar a página
        window.location.reload();
      }
    }, 2000);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    };

    this.isLoading = true;

    this.http.get<infoBasica[]>(`/api/BBP/BBPID?bbpid=${bbP_id}`, httpOptions).subscribe(
      (data: infoBasica[]) => {
        this.infoBasica = data;
        this.isLoading = false;
        this.definicao_DespesasRows = this.infoBasica[0]?.definicao_Despesas;
        this.despesas_AdicionaisRows = this.infoBasica[0]?.despesas_Adicionais;
        console.log('lucas', this.infoBasica)
      },
      (error) => {
        console.error('Erro ao recuperar dados', error);
        this.isLoading = false;
      }
    );
  };

  onSubmit() {
    this.isLoading = true;
    const token = sessionStorage.getItem('token');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    };

    const despesasPOST = this.addNovasRowsDespesas.map(row => ({
      ...row,
      definicao_Despesasid: '0',
    }));

    const adicionaisPOST = this.addNovasRowsAdicionais.map(row => ({
      ...row,
      despesas_Adicionaisid: '0',
    }));

    const apiData = { ...this.infoBasica[0],
      definicao_Despesas: despesasPOST,
      despesas_Adicionais: adicionaisPOST,
     };

    // apiData.definicao_Despesas = this.definicao_DespesasRows;
    // apiData.despesas_Adicionais = this.despesas_AdicionaisRows;

    this.http.post('/api/BBP', apiData, httpOptions).subscribe(
      response => {
        console.log('Dados atualizados com sucesso:', response);
        console.log('Dados a serem enviados:', apiData);
        this.isLoading = false;
      },
      error => {
        console.error('Erro ao atualizar dados:', error);
        this.isLoading = false;
      }
    );
  }

  openModal(modalId: string) {
    this.modals.forEach(modal => {
      if (modal.id === modalId) {
        modal.isVisible = true;
      }
    });
  }

  closeModal(modalId: string) {
    this.modals.forEach(modal => {
      if (modal.id === modalId) {
        modal.isVisible = false;
      }
    });
  }

  onClickOutside(event: Event, modalId: string) {
    if ((event.target as Element).classList.contains('modal')) {
      this.closeModal(modalId);
    }
  }
}
