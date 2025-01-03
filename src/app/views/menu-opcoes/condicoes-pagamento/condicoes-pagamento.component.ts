import { FormInfoService } from './../../../services/infobasica/form-info.service';
import { infoBasica } from './../../../models/infobasica/infobasica.model';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { MenuNavigationComponent } from '../../../components/menu-navigation/menu-navigation.component';
import { CustomerFieldComponent } from '../../../components/customer-field/customer-field.component';
import { HeaderComponent } from '../../../components/header/header.component';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
// Models
import { Tip } from '../../../models/infobasica/tip.model';
import { definir_condicoes_pagamentos } from '../../../models/condic-pagamento/condic-pagamento.model';

@Component({
  selector: 'app-condicoes-pagamento',
  standalone: true,
  imports: [MenuNavigationComponent, CustomerFieldComponent, HeaderComponent, FormsModule, NgFor, NgIf, HttpClientModule, ReactiveFormsModule],
  templateUrl: './condicoes-pagamento.component.html',
  styleUrl: './condicoes-pagamento.component.css'
})
export class CondicoesPagamentoComponent implements OnInit {
  isLoading: boolean = true;

  formCondicPagamento: FormGroup;

  // Arrays de Tabelas
  alertaAtividadeRows: definir_condicoes_pagamentos[] = [];

  private generatedIds: Set<string> = new Set();

  private generateUniqueId(): string {
    let newId: string;
    do {
      newId = Math.random().toString(36).substring(2, 15);
    } while (this.generatedIds.has(newId)); // Verifica se o ID já foi gerado

    // Adiciona o novo ID ao conjunto
    this.generatedIds.add(newId);
    return newId;
  }

  tipsObj: Tip[] = [
    {
      id: 1,
      nome: 'Conta Contábil',
      dica: 'Conta contábil Especifique a conta contábil que reflete esta conta bancária em seus livros.'
    },
    {
      id: 2,
      nome: 'Conta Cont. Provisória',
      dica: 'Conta contábil provisória Você pode entrar uma conta contábil a ser utilizada como conta provisória quando é executado um pagamento.'
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
    if (!clickedElement.closest('.title')) {
      this.activeTipId = null;
    }
  }

  trackByFnAlertaAtividade(index: number, item: definir_condicoes_pagamentos) {
    return item.definir_condicoes_pagamentosid;
  }

  constructor(private http: HttpClient, private fb: FormBuilder, private formInfoService: FormInfoService) {
    this.formCondicPagamento = this.fb.group({
      definir_definir_condicoes_pagamentossid: ['', Validators.required],
      codigo_condicao: ['', Validators.required],
      data_vencimento_baseada: ['', Validators.required],
      prestacao: ['', Validators.required],
      dias_vencimento_prestacao: ['', Validators.required],
      abrir_contas_receber: ['', Validators.required],
      perc_total_desconto: ['', Validators.required],
    });
  }

  rowsAlertaAtividade: definir_condicoes_pagamentos[] = [
    {
      definir_condicoes_pagamentosid: this.generateUniqueId(),
      codigo_condicao: '',
      data_vencimento_baseada: '',
      prestacao: '',
      dias_vencimento_prestacao: '',
      abrir_contas_receber: '',
      perc_total_desconto: 0,
    }
  ];

  addNovaCondicoesPagamento: definir_condicoes_pagamentos[] = [];
  addRowAlertaAtividade() {
    const newRow: definir_condicoes_pagamentos = {
      definir_condicoes_pagamentosid: this.generateUniqueId(),
      codigo_condicao: '',
      data_vencimento_baseada: '',
      prestacao: '',
      dias_vencimento_prestacao: '',
      abrir_contas_receber: '',
      perc_total_desconto: 0,
      selected: false,
    };
    this.alertaAtividadeRows = [...this.alertaAtividadeRows, newRow];
    this.addNovaCondicoesPagamento.push(newRow);
  }

  // ToggleSelectAll
  toggleSelectAllAlertaAtividade(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.rowsAlertaAtividade.forEach((row, index) => {
      if (index !== 0) { // Não seleciona a primeira linha
        row.selected = isChecked;
      }
    });
  }

  // Méotdo GET
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
        this.alertaAtividadeRows = this.infoBasica[0]?.definir_condicoes_pagamentos;
        this.formInfoService.patchInfoBasicaForm(this.formCondicPagamento, this.infoBasica);
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
    const token = sessionStorage.getItem('token');

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

    const condicoesPagamentoPOST = this.alertaAtividadeRows.map(row => {
      if (this.addNovaCondicoesPagamento.includes(row)) {
        return {
          ...row,
          definir_condicoes_pagamentosid: '0',
        }
      } else {
        return row;
      }
    });

    const apiData = {
      ...this.infoBasica[0],
      definir_condicoes_pagamentos: condicoesPagamentoPOST,
    };

    this.http.post('/api/BBP', apiData, httpOptions).subscribe(
      response => {
        console.log('novo', apiData.definir_condicoes_pagamentos)
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

  deleteRow(row: definir_condicoes_pagamentos) {
    const bbpid = sessionStorage.getItem('bbP_id'); // Supondo que bbP_DadosCTBID seja o valor de bbpid
    const vcode = row.definir_condicoes_pagamentosid; // Use o valor apropriado de vcode
    const vtabela = '%40G2_BBP_DEFCONDPAG'; // ou algum valor dinâmico, caso necessário
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
          // Remover a linha da tabela localmente após sucesso
          this.alertaAtividadeRows = this.alertaAtividadeRows.filter(r => r !== row);
        }
      },
      (error) => {
        console.error('Erro ao deletar a linha', error);
      }
    );
  }
  
  token = sessionStorage.getItem('token')
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    }),
  };

  postSDK(row: definir_condicoes_pagamentos) {
    // Estrutura do objeto de acordo com a solicitação
    const payload = {
      groupNumber: row.codigo_condicao,
      paymentTermsGroupName: row.prestacao,
    };

    // URL de teste (você pode substituir pela URL correta)
    const postUrl = '/api/SAPSDK/CondicaoPagamento';

    this.http.post(postUrl, payload, this.httpOptions).subscribe(
      (response) => {
        console.log('POST bem-sucedido:', response);
      },
      (error) => {
        console.error('Erro ao fazer POST...', error);
      }
    );
  }
}
