import { infoBasica } from './../../../models/infobasica/infobasica.model';
import { listaCentroCusto } from './../../../models/centro-custos/listaCentroCusto.model';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { HeaderComponent } from "../../../components/header/header.component";
import { MenuNavigationComponent } from "../../../components/menu-navigation/menu-navigation.component";
import { NgIf, NgFor, NgClass, NgSwitchDefault, NgSwitchCase, NgSwitch } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerFieldComponent } from '../../../components/customer-field/customer-field.component';
// Models
import { Tip } from '../../../models/infobasica/tip.model';
import { definir_Dimensoes_Centros_Custo } from '../../../models/centro-custos/definir_Dimensoes_Centros_Custo.model';
import { definir_Centros_Custo } from '../../../models/centro-custos/definir_Centros_Custo.model';
import { FormInfoService } from '../../../services/infobasica/form-info.service';

@Component({
  selector: 'app-centro-custos',
  standalone: true,
  imports: [HeaderComponent, CustomerFieldComponent, MenuNavigationComponent, NgIf, NgFor, NgClass, NgSwitchDefault, NgSwitchCase, NgSwitch, FormsModule, NgFor, NgIf, HttpClientModule, FormsModule, ReactiveFormsModule],
  templateUrl: './centro-custos.component.html',
  styleUrl: './centro-custos.component.css'
})
export class CentroCustosComponent implements OnInit {
  isLoading: boolean = true;

  formCentroCusto: FormGroup;

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
  definir_Dimensoes_Centros_CustoRows: definir_Dimensoes_Centros_Custo[] = [
    {
      definir_Dimensoes_Centros_Custoid: this.generateUniqueId(),
      nome_Definir_Dimensoes_Centros_Custo: '',
      dimensao: '',
      ativo: '',
      descricao: '',
      ck: '',
      selected: false,
    }
  ];
  definir_Centros_CustoRows: definir_Centros_Custo[] = [];

  modals = [
    { id: 'definir_Dimensoes_Centros_Custo', title: 'Definir Dimensões Centro de Custo', description: 'Preencher informações pendentes', isVisible: false, icon: 'fa-solid fa-location-pin' },
    { id: 'definir_Centros_Custos', title: 'Definir Centro de Custo', description: 'Preencher informações pendentes', isVisible: false, icon: 'fa-solid fa-location-pin' },
  ];

  constructor(private http: HttpClient, private fb: FormBuilder, private formInfoService: FormInfoService) {
    this.formCentroCusto = this.fb.group({
      definir_Centros_Custoid: ['', Validators.required],
      codigocentrocusto: ['', Validators.required],
      nome_Definir_Dimensoes_Centros_Custo: ['', Validators.required],
      codigoordenacao: ['', Validators.required],
      dimensao: ['', Validators.required],
      ck: ['', Validators.required],
      // Definição Despesas
      definicao_Despesasid: ['', Validators.required],
      nome_Definir_Centros_Custo: ['', Validators.required],
      alocacao_por: ['', Validators.required],
      conta_alocacao_despesas_importacao: ['', Validators.required],
    })
  }

  novasRowsDimensoesCentroCusto: definir_Dimensoes_Centros_Custo[] = [];
  addRowDimensaoCentroCustos() {
    const newRow: definir_Dimensoes_Centros_Custo = {
      definir_Dimensoes_Centros_Custoid: this.generateUniqueId(),
      nome_Definir_Dimensoes_Centros_Custo: '',
      dimensao: '',
      ativo: '',
      descricao: '',
      ck: '',
      selected: false,
    }
    this.definir_Dimensoes_Centros_CustoRows = [...this.definir_Dimensoes_Centros_CustoRows, newRow];
    this.novasRowsDimensoesCentroCusto.push(newRow);
  }

  novasRowsDefinirCentroCustos: definir_Centros_Custo[] = [];
  addRowCentroCustos() {
    const newRow: definir_Centros_Custo = {
      definir_Centros_Custoid: this.generateUniqueId(),
      codigocentrocusto: '',
      nome_Definir_Centros_Custo: '',
      codigoordenacao: '',
      dimensao: '',
      selected: false,
    }
    this.definir_Centros_CustoRows = [...this.definir_Centros_CustoRows, newRow];
    this.novasRowsDefinirCentroCustos.push(newRow);
  }

  removeSelectedDimensaoCentroCustos() {
    this.definir_Dimensoes_Centros_CustoRows = this.definir_Dimensoes_Centros_CustoRows.filter(row => !row.selected);
  }

  removeSelectedCentroCustos() {
    this.definir_Centros_CustoRows = this.definir_Centros_CustoRows.filter(row => !row.selected);
  }

  toggleSelectAllDimensaoCentroCustos(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.definir_Dimensoes_Centros_CustoRows.forEach(row => {
      row.selected = isChecked;
    });
  }

  toggleSelectAllCentroCustos(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.definir_Centros_CustoRows.forEach(row => {
      row.selected = isChecked;
    });
  }

  trackByFnDimensoes(index: number, item: definir_Dimensoes_Centros_Custo) {
    return item.definir_Dimensoes_Centros_Custoid;
  }

  trackByFnCentroCustos(index: number, item: definir_Centros_Custo) {
    return item.definir_Centros_Custoid;
  }

  nextId = 1;

  listaCentroCusto: listaCentroCusto[] = [];

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

    // Defina isLoading como true antes de fazer a requisição
    this.isLoading = true;

    this.http.get<infoBasica[]>(`/api/BBP/BBPID?bbpid=${bbP_id}`, httpOptions).subscribe(
      (data: infoBasica[]) => {
        this.infoBasica = data;
        this.isLoading = false;
        this.definir_Centros_CustoRows = this.infoBasica[0]?.definir_Centros_Custo;
        this.definir_Dimensoes_Centros_CustoRows = this.infoBasica[0]?.definir_Dimensoes_Centros_Custo;
        this.formInfoService.patchInfoBasicaForm(this.formCentroCusto, this.infoBasica);
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
    const bbP_id = sessionStorage.getItem('bbP_id');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    };

    if (!bbP_id) {
      console.error('bbP_id não encontrado no sessionStorage. Por favor, verifique se o valor está sendo armazenado corretamente.');
      return;
    }
    
    const centroCustosPOST = this.novasRowsDefinirCentroCustos.map(row => ({
      ...row,
      definir_Centros_Custoid: '0',
    }));

    const dimensoesPOST = this.novasRowsDimensoesCentroCusto.map(row => ({
      ...row,
      definir_Dimensoes_Centros_Custoid: '0',
    }));

    const apiData = { ...this.infoBasica[0],
      definir_Centros_Custo: centroCustosPOST,
      definir_Dimensoes_Centros_Custo: dimensoesPOST,
     };

    // apiData.definir_Centros_Custo = this.definir_Centros_CustoRows;
    // apiData. = this.definir_Dimensoes_Centros_CustoRows;

    this.http.post('/api/BBP', apiData, httpOptions).subscribe(
      response => {
        console.log('Dados atualizados com sucesso:', response);
        console.log('Dados a serem enviados:', apiData);
        this.isLoading = false;
        window.location.reload();
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

  tipsObj: Tip[] = [
    {
      id: 1,
      nome: 'Especifique um código para o centro de custo',
      dica: 'Especifique um código para o centro de custo.'
    },
    {
      id: 2,
      nome: 'Nome',
      dica: 'Se necessário, especifique um nome ou uma descrição breve para o centro de custo.'
    },
    {
      id: 3,
      nome: 'Cód. Ordenação',
      dica: 'Se necessário, especifique um código de classificação para o centro de custo, que será utilizado em análises e relatórios futuros.<br><br>Exemplo:<br>Uma empresa fabrica 10 produtos diferentes e para cada um deles foi definido um centro de custo. Os produtos estão divididos em três categorias diferentes e a administração da empresa quer saber qual é a mais lucrativa. Você pode atribuir um código de classificação a cada centro de custo que representa a categoria de produto relevante. Ao gerar o relatório de centro de custo resumido por código de classificação, você terá a resposta.'
    },
    {
      id: 4,
      nome: 'Dimensão',
      dica: 'selecione a dimensão para relacioná-la ao centro de custo.'
    },

  ];

  activeTipId: number | null = null;

  toggleTip(id: number) {
    this.activeTipId = this.activeTipId === id ? null : id;
  }

  getTip(id: number): string {
    const tip = this.tipsObj.find(t => t.id === id);
    return tip ? tip.dica : 'Dica não encontrada';
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    const clickedElement = event.target as HTMLElement;
    if (!clickedElement.closest('.thActive')) {
      this.activeTipId = null;
    }
  }

  deleteRowDimCC(row: definir_Dimensoes_Centros_Custo) {
    const bbpid = sessionStorage.getItem('bbP_id'); // Supondo que bbP_DadosCTBID seja o valor de bbpid
    const vcode = row.definir_Dimensoes_Centros_Custoid; // Use o valor apropriado de vcode
    const vtabela = '%40G2_BBP_DIMCC'; // ou algum valor dinâmico, caso necessário
    const token = sessionStorage.getItem('token')

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    };

    const deleteUrl = `/api/BBP/BBP_DEL_SUBTAB?bbpid=${bbpid}&vcode=${vcode}&vtabela=${vtabela}`;

    this.http.delete(deleteUrl, httpOptions).subscribe(
      (response) => {
        console.log('Resposta da API:', response); // Verifique o que a API está retornando
        if (response) {
          this.definir_Dimensoes_Centros_CustoRows = this.definir_Dimensoes_Centros_CustoRows.filter(r => r !== row);
        }
      },
      (error) => {
        console.error('Erro ao deletar a linha', error);
      }
    );
  }

  deleteRowCentroCusto(row: definir_Centros_Custo) {
    const bbpid = sessionStorage.getItem('bbP_id'); // Supondo que bbP_DadosCTBID seja o valor de bbpid
    const vcode = row.definir_Centros_Custoid; // Use o valor apropriado de vcode
    const vtabela = '%40G2_BBP_DEFCC'; // ou algum valor dinâmico, caso necessário
    const token = sessionStorage.getItem('token')

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    };

    const deleteUrl = `/api/BBP/BBP_DEL_SUBTAB?bbpid=${bbpid}&vcode=${vcode}&vtabela=${vtabela}`;

    this.http.delete(deleteUrl, httpOptions).subscribe(
      (response) => {
        console.log('Resposta da API:', response); // Verifique o que a API está retornando
        if (response) {
          this.definir_Centros_CustoRows = this.definir_Centros_CustoRows.filter(r => r !== row);
        }
      },
      (error) => {
        console.error('Erro ao deletar a linha', error);
      }
    );
  }
}
