import { FormInfoService } from './../../../services/infobasica/form-info.service';
import { infoBasica } from './../../../models/infobasica/infobasica.model';
import { Component, HostListener, OnInit } from '@angular/core';
import { HeaderComponent } from "../../../components/header/header.component";
import { MenuNavigationComponent } from "../../../components/menu-navigation/menu-navigation.component";
import { NgIf, NgFor, NgClass, NgSwitchDefault, NgSwitchCase, NgSwitch } from '@angular/common';
import { CustomerFieldComponent } from '../../../components/customer-field/customer-field.component';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Models
import { determinacao_contacontabil_vendas } from '../../../models/lancamento-transacao/determinacao_contacontabil_vendas.model';
import { determinacao_contacontabil_compras } from '../../../models/lancamento-transacao/determinacao_contacontabil_compras.model';
import { determinacao_contacontabil_estoque } from '../../../models/lancamento-transacao/determinacao_contacontabil_estoque.model';
import { determinacao_contacontabil_geral } from '../../../models/lancamento-transacao/determinacao_contacontabil_geral.model';
import { lancamentoTransacao } from '../../../models/lancamento-transacao/lancamento-transacao.model';

@Component({
  selector: 'app-lancamentos-transacao',
  standalone: true,
  imports: [HeaderComponent, MenuNavigationComponent, NgIf, NgFor, NgClass, NgSwitchDefault, NgSwitchCase, NgSwitch, CustomerFieldComponent, HttpClientModule, ReactiveFormsModule, FormsModule],
  templateUrl: './lancamentos-transacao.component.html',
  styleUrl: './lancamentos-transacao.component.css'
})
export class LancamentosTransacaoComponent implements OnInit {
  isLoading: boolean = true;

  formLancTransacao: FormGroup;

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

  // Tabelas
  novasRowsDeterminacaoContabil: determinacao_contacontabil_vendas[] = [];
  determinacao_contacontabil_vendasRows: determinacao_contacontabil_vendas[] = [
    {
      determinacao_contacontabil_vendasid: this.generateUniqueId(),
      tipodeconta_vendas: '',
      contacontabil_vendas: '',
      selected: false,
    }
  ];

  novasRowsGeral: determinacao_contacontabil_geral[] = [];
  determinacao_contacontabil_geralRows: determinacao_contacontabil_geral[] = [
    {
      determinacao_contacontabil_geralid: this.generateUniqueId(),
      tipodeconta_geral: '',
      contacontabil_geral: '',
      selected: false,
    }
  ]

  novasRowsEstoque: determinacao_contacontabil_estoque[] = [];
  determinacao_contacontabil_estoqueRows: determinacao_contacontabil_estoque[] = [
    {
      determinacao_contacontabil_estoqueid: this.generateUniqueId(),
      tipodeconta_estoque: '',
      contacontabil_estoque: '',
      selected: false,
    }
  ];

  novasRowsCompras: determinacao_contacontabil_compras[] = [];
  determinacao_contacontabil_comprasRows: determinacao_contacontabil_compras[] = [
    {
      determinacao_contacontabil_comprasid: this.generateUniqueId(),
      tipodeconta_compras: '',
      contacontabil_compras: '',
      selected: false,
    }
  ];

  modals = [
    { id: 'determinacao_contacontabil_vendas', title: 'Determinação Contábil Vendas', description: 'Preencher informações pendentes', isVisible: false, icon: 'fa-solid fa-address-card' },
    { id: 'determinacao_contacontabil_geral', title: 'Determinação Contábil Geral', description: 'Preencher Dados Contábeis', isVisible: false, icon: 'fa-solid fa-money-check-dollar' },
    { id: 'determinacao_contacontabil_estoque', title: 'Determinação Contábil Estoque', description: 'Preencha o Endereço Completo', isVisible: false, icon: 'fa-solid fa-location-dot' },
    { id: 'determinacao_contacontabil_compras', title: 'Determinação Contábil Compras', description: 'Preencha os Campos de Localização', isVisible: false, icon: 'fa-solid fa-map-location-dot' },
  ]

  activeTipId: number | null = null;

  constructor(private http: HttpClient, private fb: FormBuilder, private formInfoService: FormInfoService) {
    this.formLancTransacao = this.fb.group({
      // determinacao_contacontabil_vendas
      determinacao_contacontabil_vendasid: ['', Validators.required],
      tipodeconta_vendas: ['', Validators.required],
      contacontabil_vendas: ['', Validators.required],
      // determinacao_contacontabil_compras
      determinacao_contacontabil_comprasid: ['', Validators.required],
      tipodeconta_compras: ['', Validators.required],
      contacontabil_compras: ['', Validators.required],
      // determinacao_contacontabil_geral
      determinacao_contacontabil_geralid: ['', Validators.required],
      tipodeconta_geral: ['', Validators.required],
      contacontabil_geral: ['', Validators.required],
      // determinacao_contacontabil_estoque
      determinacao_contacontabil_estoqueid: ['', Validators.required],
      tipodeconta_estoque: ['', Validators.required],
      contacontabil_estoque: ['', Validators.required],
    });
  }

  // Funções para determinacao_contacontabil_vendas
  addRowVendas() {
    const newRow: determinacao_contacontabil_vendas = {
      determinacao_contacontabil_vendasid: this.generateUniqueId(),
      tipodeconta_vendas: '',
      contacontabil_vendas: '',
      selected: false
    };
    this.determinacao_contacontabil_vendasRows = [...this.determinacao_contacontabil_vendasRows, newRow];
    this.novasRowsDeterminacaoContabil.push(newRow);
  }

  removeSelectedVendas() {
    this.determinacao_contacontabil_vendasRows = this.determinacao_contacontabil_vendasRows.filter(row => !row.selected);
  }

  toggleSelectAllVendas(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.determinacao_contacontabil_vendasRows.forEach(row => row.selected = isChecked);
  }

  trackByFnVendas(index: number, item: determinacao_contacontabil_vendas) {
    return item.determinacao_contacontabil_vendasid;
  }

  // Funções para determinacao_contacontabil_compras
  addRowCompras() {
    const newRow: determinacao_contacontabil_compras = {
      determinacao_contacontabil_comprasid: this.generateUniqueId(),
      tipodeconta_compras: '',
      contacontabil_compras: '',
      selected: false
    };
    this.determinacao_contacontabil_comprasRows = [...this.determinacao_contacontabil_comprasRows, newRow];
    this.novasRowsCompras.push(newRow)
  }

  removeSelectedCompras() {
    this.determinacao_contacontabil_comprasRows = this.determinacao_contacontabil_comprasRows.filter(row => !row.selected);
  }

  toggleSelectAllCompras(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.determinacao_contacontabil_comprasRows.forEach(row => row.selected = isChecked);
  }

  trackByFnCompras(index: number, item: determinacao_contacontabil_compras) {
    return item.determinacao_contacontabil_comprasid;
  }

  // Funções para determinacao_contacontabil_estoque
  addRowEstoque() {
    const newRow: determinacao_contacontabil_estoque = {
      determinacao_contacontabil_estoqueid: this.generateUniqueId(),
      tipodeconta_estoque: '',
      contacontabil_estoque: '',
      selected: false
    };
    this.determinacao_contacontabil_estoqueRows = [...this.determinacao_contacontabil_estoqueRows, newRow];
    this.novasRowsEstoque.push(newRow);
  }

  removeSelectedEstoque() {
    this.determinacao_contacontabil_estoqueRows = this.determinacao_contacontabil_estoqueRows.filter(row => !row.selected);
  }

  toggleSelectAllEstoque(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.determinacao_contacontabil_estoqueRows.forEach(row => row.selected = isChecked);
  }

  trackByFnEstoque(index: number, item: determinacao_contacontabil_estoque) {
    return item.determinacao_contacontabil_estoqueid;
  }

  // Funções para determinacao_contacontabil_geral

  addRowGeral() {
    const newRow: determinacao_contacontabil_geral = {
      determinacao_contacontabil_geralid: this.generateUniqueId(),
      tipodeconta_geral: '',
      contacontabil_geral: '',
      selected: false
    };
    this.determinacao_contacontabil_geralRows = [...this.determinacao_contacontabil_geralRows, newRow];
    this.novasRowsGeral.push(newRow)
  }

  removeSelectedGeral() {
    this.determinacao_contacontabil_geralRows = this.determinacao_contacontabil_geralRows.filter(row => !row.selected);
  }

  toggleSelectAllGeral(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.determinacao_contacontabil_geralRows.forEach(row => row.selected = isChecked);
  }

  trackByFnGeral(index: number, item: determinacao_contacontabil_geral) {
    return item.determinacao_contacontabil_geralid;
  }

  lancamentoTransacao: lancamentoTransacao[] = [];

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

    this.http.get<infoBasica[]>(`http://bbpdigital.g2tecnologia.com.br:8021/BBP/BBPID?bbpid=${bbP_id}`, httpOptions).subscribe(
      (data: infoBasica[]) => {
        this.infoBasica = data;
        this.determinacao_contacontabil_comprasRows = this.infoBasica[0]?.determinacao_contacontabil_compras || [];
        this.determinacao_contacontabil_estoqueRows = this.infoBasica[0]?.determinacao_contacontabil_estoque || [];
        this.determinacao_contacontabil_geralRows = this.infoBasica[0]?.determinacao_contacontabil_geral || [];
        this.determinacao_contacontabil_vendasRows = this.infoBasica[0]?.determinacao_contacontabil_vendas || [];
        // GET (isolado) dos campos a serem resgatados
        this.formInfoService.patchInfoBasicaForm(this.formLancTransacao, this.infoBasica);
        this.isLoading = false;
        console.log('dados recuperados onInit: ', this.infoBasica);
      },
      (error) => {
        console.error('Erro ao recuperar dados', error);
        this.isLoading = false;
      }
    );
  };

  onSubmit(): void {
    this.isLoading = true;
    const token = sessionStorage.getItem('token');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    };

    const determinacaoGeralPOST = this.determinacao_contacontabil_geralRows.map(row => {
      if (this.novasRowsGeral.includes(row)) {
        return {
          ...row,
          determinacao_contacontabil_geralid: '0',
        }
      } else {
        return row;
      }
    });

    const determinacaoVendasPOST = this.determinacao_contacontabil_vendasRows.map(row => {
      if (this.novasRowsDeterminacaoContabil.includes(row)) {
        return {
          ...row,
          determinacao_contacontabil_vendasid: '0',
        }
      } else {
        return row;
      }
    });

    const determinacaoComprasPOST = this.determinacao_contacontabil_comprasRows.map(row => {
      if (this.novasRowsCompras.includes(row)) {
        return {
          ...row,
          determinacao_contacontabil_comprasid: '0',
        }
      } else {
        return row;
      }
    });

    const determinacaoEstoquePOST = this.determinacao_contacontabil_estoqueRows.map(row => {
      if (this.novasRowsEstoque.includes(row)) {
        return {
          ...row,
          determinacao_contacontabil_estoqueid: '0',
        }
      } else {
        return row;
      }
    });

    const apiData = {
      ...this.infoBasica[0],
      determinacao_contacontabil_geral: determinacaoGeralPOST,
      determinacao_contacontabil_estoque: determinacaoEstoquePOST,
      determinacao_contacontabil_compras: determinacaoComprasPOST,
      determinacao_contacontabil_vendas: determinacaoVendasPOST,
    };

    // apiData.determinacao_contacontabil_geral = this.determinacao_contacontabil_geralRows;
    // apiData.determinacao_contacontabil_vendas = this.determinacao_contacontabil_vendasRows;
    // apiData.determinacao_contacontabil_estoque = this.determinacao_contacontabil_estoqueRows;
    // apiData.determinacao_contacontabil_compras = this.determinacao_contacontabil_comprasRows;

    this.http.post('http://bbpdigital.g2tecnologia.com.br:8021/BBP', apiData, httpOptions).subscribe(
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

  toggleTip(id: number) {
    this.activeTipId = this.activeTipId === id ? null : id;
  }

  // getTip(id: number): string {
  //   const tip = this.tipsObj.find(t => t.id === id);
  //   return tip ? tip.dica : 'Dica não encontrada';
  // }

  closeTip() {
    this.activeTipId = null;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    const clickedElement = event.target as HTMLElement;
    if (!clickedElement.closest('.thActive')) {
      this.activeTipId = null;
    }
  }

  deleteRowVendas(row: determinacao_contacontabil_vendas) {
    const bbpid = sessionStorage.getItem('bbP_id');
    const vcode = row.determinacao_contacontabil_vendasid;
    const vtabela = '%40G2_BBP_DETCTBV';
    const token = sessionStorage.getItem('token')

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
          this.determinacao_contacontabil_vendasRows = this.determinacao_contacontabil_vendasRows.filter(r => r !== row);
        }
      },
      (error) => {
        console.error('Erro ao deletar a linha', error);
      }
    );
  }

  deleteRowEstoque(row: determinacao_contacontabil_estoque) {
    const bbpid = sessionStorage.getItem('bbP_id');
    const vcode = row.determinacao_contacontabil_estoqueid;
    const vtabela = '%40G2_BBP_DETCTBE';
    const token = sessionStorage.getItem('token')

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
          this.determinacao_contacontabil_estoqueRows = this.determinacao_contacontabil_estoqueRows.filter(r => r !== row);
        }
      },
      (error) => {
        console.error('Erro ao deletar a linha', error);
      }
    );
  }

  deleteRowGeral(row: determinacao_contacontabil_geral) {
    const bbpid = sessionStorage.getItem('bbP_id');
    const vcode = row.determinacao_contacontabil_geralid;
    const vtabela = '%40G2_BBP_DETCTBG';
    const token = sessionStorage.getItem('token')

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
          this.determinacao_contacontabil_geralRows = this.determinacao_contacontabil_geralRows.filter(r => r !== row);
        }
      },
      (error) => {
        console.error('Erro ao deletar a linha', error);
      }
    );
  }

  deleteRowCompras(row: determinacao_contacontabil_compras) {
    const bbpid = sessionStorage.getItem('bbP_id');
    const vcode = row.determinacao_contacontabil_comprasid;
    const vtabela = '%40G2_BBP_DETCTBC';
    const token = sessionStorage.getItem('token')

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
          this.determinacao_contacontabil_comprasRows = this.determinacao_contacontabil_comprasRows.filter(r => r !== row);
        }
      },
      (error) => {
        console.error('Erro ao deletar a linha', error);
      }
    );
  }
}
