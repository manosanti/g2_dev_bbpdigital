import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { MenuNavigationComponent } from '../../../components/menu-navigation/menu-navigation.component';
import { HeaderComponent } from '../../../components/header/header.component';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { CustomerFieldComponent } from '../../../components/customer-field/customer-field.component';
// Models
import { infoBasica } from '../../../models/infobasica/infobasica.model';
import { FormInfoService } from '../../../services/infobasica/form-info.service';
import { definir_Territorios } from '../../../models/Territorios/definir_Territorios.model';
import { definir_grupo_comissoes } from '../../../models/Territorios/definir_grupo_comissoes.model';
import { definir_controle_vendedor } from '../../../models/Territorios/definir_controle_vendedor.model';
import { definir_Estagios_Niveis_Vendas } from '../../../models/Territorios/definir_Estagios_Niveis_Vendas.model';

@Component({
  selector: 'app-territorios',
  standalone: true,
  imports: [MenuNavigationComponent, HeaderComponent, FormsModule, NgFor, HttpClientModule, CustomerFieldComponent, ReactiveFormsModule, NgIf, NgSwitch, NgSwitchCase, NgClass],
  templateUrl: './territorios.component.html',
  styleUrl: './territorios.component.css'
})
export class TerritoriosComponent implements OnInit {

  modals = [
    { id: 'definir_Territorios', title: 'Territórios (Gerenciar)', description: '', isVisible: false, icon: 'fa-solid fa-address-card' },
    { id: 'definir_grupo_comissoes', title: 'Percentual de Comissão', description: '', isVisible: false, icon: 'fa-solid fa-address-card' },
    { id: 'definir_controle_vendedor', title: 'Controlar Vendas (Vendedor)', description: '', isVisible: false, icon: 'fa-solid fa-address-card' },
    { id: 'definir_Estagios_Niveis_Vendas', title: 'Estágios (Níveis de Vendas)', description: '', isVisible: false, icon: 'fa-solid fa-address-card' },
  ]

  isLoading: boolean = true;

  formTerritorios: FormGroup;

  constructor(private http: HttpClient, private fb: FormBuilder, private formInfoService: FormInfoService) {
    this.formTerritorios = this.fb.group({
      definir_Territoriosid: ['', Validators.required],
      posicao: ['', Validators.required],
      nome_territorio: ['', Validators.required],
      // definir_controle_vendedor
      nome_vendedor: ['', Validators.required],
      observacoes: ['', Validators.required],
      grupo_comissoes: ['', Validators.required],
      // definir_grupo_comissoes
      definir_grupo_comissoesid: ['', Validators.required],
      nome_grupo: ['', Validators.required],
      perc_comissao: ['', Validators.required],
      // definir_Estagios_Niveis_Vendas
      definir_Estagios_Niveis_Vendasid: ['', Validators.required],
      nivel: ['', Validators.required],
      nome: ['', Validators.required],
      perc_final: ['', Validators.required],
    });
  }

  // Linhas da Tabela
  rowsTerritorios: definir_Territorios[] = [
    {
      definir_Territoriosid: '1',
      posicao: '',
      nome_territorio: '',
      selected: false,
    }
  ];

  rowsdefinir_grupo_comissoes: definir_grupo_comissoes[] = [
    {
      definir_grupo_comissoesid: '1',
      nome_grupo: '',
      perc_comissao: 0,
      selected: false,
    }
  ]

  rowsdefinir_controle_vendedor: definir_controle_vendedor[] = [
    {
      definir_controle_vendedorid: '1',
      nome_vendedor: '',
      observacoes: '',
      grupo_comissoes: 0,
    }
  ]

  rowsdefinir_Estagios_Niveis_Vendas: definir_Estagios_Niveis_Vendas[] = [
    {
      definir_Estagios_Niveis_Vendasid: '1',
      nivel: '',
      nome: '',
      perc_final: 0,
      selected: false,
    }
  ]

  addRowsTerritorios() {
    const newRow: definir_Territorios = {
      definir_Territoriosid: String(this.nextId),
      posicao: '',
      nome_territorio: '',
      selected: false,
    }
    this.rowsTerritorios = [...this.rowsTerritorios, newRow];
    this.nextId++;
  }

  addRowsdefinir_grupo_comissoes() {
    const newRow: definir_grupo_comissoes = {
      definir_grupo_comissoesid: '1',
      nome_grupo: '',
      perc_comissao: 0,
    }
    this.rowsdefinir_grupo_comissoes = [...this.rowsdefinir_grupo_comissoes, newRow];
  }

  addRowsdefinir_controle_vendedor() {
    const newRow: definir_controle_vendedor = {
      definir_controle_vendedorid: '1',
      nome_vendedor: '',
      observacoes: '',
      grupo_comissoes: 0,
    }
    this.rowsdefinir_controle_vendedor = [...this.rowsdefinir_controle_vendedor, newRow]
  }

  addRowsdefinir_Estagios_Niveis_Vendas() {
    const newRow: definir_Estagios_Niveis_Vendas = {
      definir_Estagios_Niveis_Vendasid: '1',
      nivel: '',
      nome: '',
      perc_final: 0,
    }
    this.rowsdefinir_Estagios_Niveis_Vendas = [...this.rowsdefinir_Estagios_Niveis_Vendas, newRow]
  }

  removeSelectedRowsTerritorios() {
    this.rowsTerritorios = this.rowsTerritorios.filter(row => !row.selected);
  }

  removeSelectedRowsTerritoriosdefinir_grupo_comissoes() {
    this.rowsdefinir_grupo_comissoes = this.rowsdefinir_grupo_comissoes.filter(row => !row.selected);
  }

  removeSelectedRowsdefinir_controle_vendedor() {
    this.rowsdefinir_controle_vendedor = this.rowsdefinir_controle_vendedor.filter(row => !row.selected);
  }

  removeSelectedRowsdefinir_Estagios_Niveis_Vendas() {
    this.rowsdefinir_Estagios_Niveis_Vendas = this.rowsdefinir_Estagios_Niveis_Vendas.filter(row => !row.selected);
  }

  toggleSelectedAllTerritorios(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.rowsTerritorios.forEach((row, index) => {
      if (index !== 0) {
        row.selected = isChecked;
      }
    });
  }

  toggleSelectedAlldefinir_grupo_comissoes(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.rowsdefinir_grupo_comissoes.forEach((row, index) => {
      if (index !== 0) {
        row.selected = isChecked;
      }
    });
  }

  toggleSelectedAlldefinir_controle_vendedor(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.rowsdefinir_controle_vendedor.forEach((row, index) => {
      if (index !== 0) {
        row.selected = isChecked;
      }
    });
  }

  toggleSelectedAlldefinir_Estagios_Niveis_Vendas(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.rowsdefinir_Estagios_Niveis_Vendas.forEach((row, index) => {
      if (index !== 0) {
        row.selected = isChecked;
      }
    });
  }

  trackByFnTerritorios(index: number, item: definir_Territorios) {
    return item.definir_Territoriosid;
  }

  trackByFndefinir_grupo_comissoes(index: number, item: definir_grupo_comissoes) {
    return item.definir_grupo_comissoesid;
  }

  trackByFndefinir_controle_vendedor(index: number, item: definir_controle_vendedor) {
    return item.definir_controle_vendedorid;
  }

  trackByFndefinir_Estagios_Niveis_Vendas(index: number, item: definir_Estagios_Niveis_Vendas) {
    return item.definir_Estagios_Niveis_Vendasid;
  }

  nextId = 2;

  infoBasica: infoBasica[] = [];

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
        this.rowsTerritorios = this.infoBasica[0]?.definir_Territorios;
        this.rowsdefinir_grupo_comissoes = this.infoBasica[0]?.definir_grupo_comissoes;
        this.rowsdefinir_controle_vendedor = this.infoBasica[0]?.definir_controle_vendedor;
        this.rowsdefinir_Estagios_Niveis_Vendas = this.infoBasica[0]?.definir_Estagios_Niveis_Vendas;
        this.formInfoService.patchInfoBasicaForm(this.formTerritorios, this.infoBasica);
        console.log('dados recuperados onInit: ', this.infoBasica);
        this.isLoading = false;
      },
      (error) => {
        console.error('Erro ao recuperar dados', error);
        this.isLoading = false;
      }
    )
  };

  onSubmit(): void {
    this.isLoading = true;
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

    apiData.definir_Territorios = this.rowsTerritorios;
    apiData.definir_grupo_comissoes = this.rowsdefinir_grupo_comissoes;
    apiData.definir_controle_vendedor = this.rowsdefinir_controle_vendedor;
    apiData.definir_Estagios_Niveis_Vendas = this.rowsdefinir_Estagios_Niveis_Vendas;

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