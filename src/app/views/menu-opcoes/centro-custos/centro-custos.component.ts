import { infoBasica } from './../../../models/infobasica/infobasica.model';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../../components/header/header.component";
import { MenuNavigationComponent } from "../../../components/menu-navigation/menu-navigation.component";
import { NgIf, NgFor, NgClass, NgSwitchDefault, NgSwitchCase, NgSwitch } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerFieldComponent } from '../../../components/customer-field/customer-field.component';
// Importar Modelos
import { definir_Dimensoes_Centros_Custo } from '../../../models/centro-custos/definir_Dimensoes_Centros_Custo.model';
import { definir_Centros_Custo } from '../../../models/centro-custos/definir_Centros_Custo.model';
import { FormInfoService } from '../../../services/infobasica/form-info.service';
// Importar Variáveis Globais
import { bbP_id, token, httpOptions, deleteCentroCusto, deleteCentroCustoDim } from '../../../global/constants';
// Importar Funções Globais
import { generateUniqueId } from '../../../global/functions';

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

  generateId() {
    const randomID = generateUniqueId();
    this.definir_Dimensoes_Centros_CustoRows[0].definir_Dimensoes_Centros_Custoid = randomID;
    this.definir_Centros_CustoRows[0].definir_Centros_Custoid = randomID;
}

  // Array de Tabelas
  definir_Dimensoes_Centros_CustoRows: definir_Dimensoes_Centros_Custo[] = [
    {
      definir_Dimensoes_Centros_Custoid: '',
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
    { id: 'definir_Dimensoes_Centros_Custo', title: 'Definir Dimensões Centro de Custo', description: 'Preencher informações pendentes', isVisible: false, icon: 'fa-solid fa-gear' },
    { id: 'definir_Centros_Custos', title: 'Definir Centro de Custo', description: 'Preencher informações pendentes', isVisible: false, icon: 'fa-solid fa-file-invoice-dollar' },
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
      definir_Dimensoes_Centros_Custoid: '',
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
      definir_Centros_Custoid: '',
      codigocentrocusto: '',
      nome_Definir_Centros_Custo: '',
      codigoordenacao: '',
      dimensao: '',
      selected: false,
    }
    this.definir_Centros_CustoRows = [...this.definir_Centros_CustoRows, newRow];
    this.novasRowsDefinirCentroCustos.push(newRow);
  }

  trackByFnDimensoes(index: number, item: definir_Dimensoes_Centros_Custo) {
    return item.definir_Dimensoes_Centros_Custoid;
  }

  trackByFnCentroCustos(index: number, item: definir_Centros_Custo) {
    return item.definir_Centros_Custoid;
  }

  infoBasica: infoBasica[] = [];

  ngOnInit(): void {

    setTimeout(() => {
      if (!token || !bbP_id) {
        window.location.reload();
      }
    }, 2000);

    this.isLoading = true;

    this.http.get<infoBasica[]>(`http://bbpdigital.g2tecnologia.com.br:8021/BBP/BBPID?bbpid=${bbP_id}`, httpOptions).subscribe(
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

    if (!bbP_id) {
      console.error('bbP_id não encontrado no localStorage. Por favor, verifique se o valor está sendo armazenado corretamente.');
      return;
    }
    
    const centroCustosPOST = this.definir_Centros_CustoRows.map(row => {
      if (this.novasRowsDefinirCentroCustos.includes(row)) {
        return {
          ...row,
          definir_Centros_Custoid: '0',
        }
      } else {
        return row;
      }
    });

    const dimensoesPOST = this.definir_Dimensoes_Centros_CustoRows.map(row => {
      if (this.novasRowsDimensoesCentroCusto.includes(row)) {
        return {
          ...row,
          definir_Dimensoes_Centros_Custoid: '0',
        }
      } else {
        return row;
      }
    });

    const apiData = { ...this.infoBasica[0],
      definir_Centros_Custo: centroCustosPOST,
      definir_Dimensoes_Centros_Custo: dimensoesPOST,
     };

    this.http.post('http://bbpdigital.g2tecnologia.com.br:8021/BBP', apiData, httpOptions).subscribe(
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

  deleteRowDimCC(row: definir_Dimensoes_Centros_Custo) {
    this.http.delete(`http://bbpdigital.g2tecnologia.com.br:8021/BBP/BBP_DEL_SUBTAB?bbpid=${bbP_id}&vcode=${row.definir_Dimensoes_Centros_Custoid}&vtabela=%40${deleteCentroCustoDim}`, httpOptions).subscribe(
      (response) => {
        console.log('Resposta da API:', response);
        if (response) {
          this.definir_Dimensoes_Centros_CustoRows = this.definir_Dimensoes_Centros_CustoRows.filter(r => r !== row);
        }
      }, (error) => {
        console.error('Erro ao deletar a linha', error);
      }
    );
  };

  deleteRowCentroCusto(row: definir_Centros_Custo) {
    this.http.delete(`http://bbpdigital.g2tecnologia.com.br:8021/BBP/BBP_DEL_SUBTAB?bbpid=${bbP_id}&vcode=${row.definir_Centros_Custoid}&vtabela=%40${deleteCentroCusto}`, httpOptions).subscribe(
      (response) => {
        console.log('Resposta da API:', response);
        if (response) {
          this.definir_Centros_CustoRows = this.definir_Centros_CustoRows.filter(r => r !== row);
        }
      },
      (error) => {
        console.error('Erro ao deletar a linha', error);
      }
    );
  }
};