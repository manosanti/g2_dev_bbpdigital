import { Component, HostListener, OnInit } from '@angular/core';
import { HeaderComponent } from "../../../components/header/header.component";
import { MenuNavigationComponent } from "../../../components/menu-navigation/menu-navigation.component";
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerFieldComponent } from '../../../components/customer-field/customer-field.component';

// Models
import { Tip } from '../../../models/configs-gerais/tip.model';
import { alerta_Atividade } from '../../../models/configs-gerais/alertaAtividade.model';
import { com_base_negocio_define_taxadecomiss } from '../../../models/configs-gerais/taxaComissao.model';
import { quantas_casas_decimais_utilizar } from '../../../models/configs-gerais/quantas_casas_decimais_utilizar.mode';
import { FormInfoService } from '../../../services/infobasica/form-info.service';
import { infoBasica } from '../../../models/infobasica/infobasica.model';

@Component({
  selector: 'app-configuracoes-gerais',
  standalone: true,
  imports: [HeaderComponent, MenuNavigationComponent, NgIf, ReactiveFormsModule, HttpClientModule, CustomerFieldComponent, NgFor, FormsModule, NgIf, CommonModule],
  templateUrl: './configuracoes-gerais.component.html',
  styleUrls: ['./configuracoes-gerais.component.css']
})
export class ConfiguracoesGeraisComponent implements OnInit {
  modals = [
    { id: 'alerta_Atividade', title: 'Alerta de Atividade', description: 'Preencher informações pendentes', isVisible: false, icon: 'fa-solid fa-address-card' },
    { id: 'taxaComissao', title: 'Taxa de Comissão', description: 'Preencher informações pendentes', isVisible: false, icon: 'fa-solid fa-address-card' },
    { id: 'casasDecimais', title: 'Casas Decimais', description: 'Preencher informações pendentes', isVisible: false, icon: 'fa-solid fa-address-card' },
  ]

  tipsObj: Tip[] = [
    {
      id: 1,
      nome: 'info limite credito',
      dica: 'Limite de crédito – verifica se a adição do documento de vendas para o cliente provoca um desvio do limite de crédito definido para o cliente.<br><br>Aparece uma mensagem de advertência se <o saldo da conta do cliente> + <o valor do documento atual> excederem a linha de crédito do cliente.'
    },
    {
      id: 2,
      nome: 'info limite compromisso',
      dica: 'Limite de compromisso – verifica se a adição do documento de vendas para o cliente provoca um desvio do limite de compromisso definido para o cliente.<br><br>Aparece uma mensagem de advertência se <o saldo da conta do cliente>+ <o valor total de cheques não depositados> + <o valor do documento atual> excederem o limite de compromisso do cliente.'
    },
    {
      id: 3,
      nome: 'info considerar saldo remessa',
      dica: 'Selecione para verificar o saldo da conta do cliente e também o saldo de suas entregas pendentes enquanto aplica as restrições selecionadas para a atividade do cliente.'
    },
    {
      id: 4,
      nome: 'condicao padrão pagamento cliente',
      dica: 'Qual condição de pagamento padrão você gostaria de utilizar para ordens de venda do cliente e NFs de saída?'
    },
    {
      id: 5,
      nome: 'Info. Cond. Fornecedor Padrão Pagamento',
      dica: 'Qual condição de pagamento padrão você gostaria de utilizar para ordens de compra do fornecedor e NFs de entrada?'
    },
    {
      id: 6,
      nome: 'info casas decimais',
      dica: 'Defina o número de casas decimais exibido para preços, taxas de câmbio, quantidades, porcentagens, unidades e valores calculados em consultas.<br><br>Para todas as configurações decimais, com exceção dos valores calculados em consultas, aplica-se o seguinte:<br><br>Se nenhum lançamento contábil manual foi lançado, você poderá aumentar ou reduzir o número de casas decimais.<br><br>Após um lançamento contábil manual ser lançado, você só poderá aumentar o número de casas decimais em até 6 dígitos. Esta modificação é irreversível. Não é possível reduzir o número de casas decimais depois que um lançamento contábil manual tiver sido lançado.<br><br>Nota:<br>A definição das casas decimais afeta os cálculos no SAP Business One e os valores que serão gravados no banco de dados. Por exemplo, se você selecionar 2 casas decimais para os valores, mas trabalhar com 6 casas decimais para preços e quantidades mínimas, os totais poderão não ser exatos.'
    },
    {
      id: 7,
      nome: 'método desejado',
      dica: 'Em todas as transações:<br>Você deve atribuir números de série ou de lote em todas as transações do estoque.<br><br>Apenas na liberação:<br>Você deve atribuir números de série ou de lote apenas a transações de liberação de estoque. É opcional para outras transações.'
    },
    {
      id: 8,
      nome: 'Info. Adição Autom. Itens',
      dica: 'Selecione se pretende adicionar todos os depósitos toda vez que criar um novo item ou adicionar automaticamente um novo depósito aos itens existentes.<br><br>Quando modificada, esta configuração é imediatamente atualizada por empresa, para todos os usuários.'
    },
    {
      id: 9,
      nome: 'Condições de Pagamento:',
      dica: 'Trata-se aqui apenas de uma proposta utilizada quando novos registros de clientes e fornecedores são criados.<br><br>Pode ser modificada no registro do cliente ou do fornecedor e nos documentos de venda e compra.'
    },
    {
      id: 10,
      nome: 'Opções de alerta da atividade do cliente',
      dica: 'Você pode restringir a criação de documentos de venda para clientes e solicitar a exibição de uma mensagem de advertência.'
    },
    {
      id: 11,
      nome: 'Com base em que seu negócio define a taxa de comissão, se aplicada?',
      dica: 'Defina como serão calculadas as comissões. Uma comissão pode ser concedida com base no vendedor, item ou cliente especificado no documento.<br><br>Selecione uma ou mais opções, dependendo de como você pretende que o SAP Business One calcule as comissões.<br><br>Esta configuração tem influência no local onde você pode especificar a porcentagem da comissão de vendas, mas não calcula automaticamente nenhumas transações de comissão. <br><br>Você pode modificar esta configuração a qualquer momento.'
    },
    {
      id: 12,
      nome: 'Adição automática de todos os depósitos a novos itens?',
      dica: 'Selecione se pretende adicionar todos os depósitos toda vez que criar um novo item ou adicionar automaticamente um novo depósito aos itens existentes.<br><br>Quando modificada, esta configuração é imediatamente atualizada por empresa, para todos os usuários.'
    }
  ];

  isLoading: boolean = true;

  formConfigsGerais: FormGroup;

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

  constructor(private http: HttpClient, private fb: FormBuilder, private formInfoService: FormInfoService) {
    this.formConfigsGerais = this.fb.group({
      qual_formato_hora_uitlizar_tela: ['', Validators.required],
      qual_formato_data_uitlizar_tela: ['', Validators.required],
      // Alerta Atividade (Objeto)
      bbP_Alerta_Atividadeid: ['', Validators.required],
      tipoAtividade_id: ['', Validators.required],
      descricaoAtividade: ['', Validators.required],
      ativaSN: ['', Validators.required],
      // Taxa de Comissão
      com_base_negocio_define_taxadecomissid: ['', Validators.required],
      tipo: ['', Validators.required],
      st_SN: ['', Validators.required],
      // quantas_casas_decimais_utilizar
      quantas_casas_decimais_utilizarid: ['', Validators.required],
      tipoCampo: ['', Validators.required],
      casas_decimais: ['', Validators.required],
    });
  }

  // Arrays de Tabelas
  alertaAtividadeRows: alerta_Atividade[] = [];
  taxaComissaoRows: com_base_negocio_define_taxadecomiss[] = [];
  quantas_casas_decimais_utilizarRows: quantas_casas_decimais_utilizar[] = [];

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

  trackByFnAlertaAtividade(index: number, item: alerta_Atividade) {
    return item.bbP_Alerta_Atividadeid;
  }

  trackByFnTaxaComissao(index: number, item: com_base_negocio_define_taxadecomiss) {
    return item.com_base_negocio_define_taxadecomissid;
  }

  trackByFnquantas_casas_decimais_utilizar(index: number, item: quantas_casas_decimais_utilizar) {
    return item.quantas_casas_decimais_utilizarid;
  }

  rowsAlertaAtividade: alerta_Atividade[] = [
    {
      bbP_Alerta_Atividadeid: this.generateUniqueId(),
      tipoAtividade_id: '',
      descricaoAtividade: '',
      ativaSN: '',
      selected: false
    }
  ];

  rowsTaxaComissao: com_base_negocio_define_taxadecomiss[] = [
    {
      com_base_negocio_define_taxadecomissid: this.generateUniqueId(),
      tipo: '',
      st_SN: '',
      selected: false
    }
  ];

  rowsquantas_casas_decimais_utilizar: quantas_casas_decimais_utilizar[] = [
    {
      quantas_casas_decimais_utilizarid: this.generateUniqueId(),
      tipoCampo: '',
      casas_decimais: '',
      selected: false,
    }
  ]

  addNovasAlertaAtividade: alerta_Atividade[] = [];
  addRowAlertaAtividade() {
    const newRow: alerta_Atividade = {
      bbP_Alerta_Atividadeid: this.generateUniqueId(),
      tipoAtividade_id: '',
      descricaoAtividade: '',
      ativaSN: '',
      selected: false
    };
    this.alertaAtividadeRows = [...this.alertaAtividadeRows, newRow];
    this.addNovasAlertaAtividade.push(newRow);
  }

  addNovasTaxaComissao: com_base_negocio_define_taxadecomiss[] = [];
  addRowTaxaComissao() {
    const newRow: com_base_negocio_define_taxadecomiss = {
      com_base_negocio_define_taxadecomissid: this.generateUniqueId(),
      tipo: '',
      st_SN: '',
      selected: false,
    };
    this.taxaComissaoRows = [...this.taxaComissaoRows, newRow];
    this.addNovasTaxaComissao.push(newRow);
  }

  addNovasCasasDecimais: quantas_casas_decimais_utilizar[] = [];
  addRowquantas_casas_decimais_utilizar() {
    const newRow: quantas_casas_decimais_utilizar = {
      quantas_casas_decimais_utilizarid: this.generateUniqueId(),
      tipoCampo: '',
      casas_decimais: '',
      selected: false,
    };
    this.quantas_casas_decimais_utilizarRows = [...this.quantas_casas_decimais_utilizarRows, newRow];
    this.addNovasCasasDecimais.push(newRow);
  }

  removeSelectedRowsTaxaComissao() {
    this.rowsTaxaComissao = this.rowsTaxaComissao.filter((row, index) => index === 0 || !row.selected);
  }

  removeSelectedRowsAlertaAtividade() {
    this.rowsAlertaAtividade = this.rowsAlertaAtividade.filter((row, index) => index === 0 || !row.selected);
  }

  removeSelectedRowsquantas_casas_decimais_utilizar() {
    this.rowsquantas_casas_decimais_utilizar = this.rowsquantas_casas_decimais_utilizar.filter((row, index) => index === 0 || !row.selected);
  }

  toggleSelectAllTaxaComissao(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.rowsTaxaComissao.forEach((row, index) => {
      if (index !== 0) { // Não seleciona a primeira linha
        row.selected = isChecked;
      }
    });
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

  toggleSelectAllquantas_casas_decimais_utilizar(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.rowsquantas_casas_decimais_utilizar.forEach((row, index) => {
      if (index !== 0) { // Não seleciona a primeira linha
        row.selected = isChecked;
      }
    });
  }

  // Méotdo GET
  infoBasica: infoBasica[] = [];

  alerta_Atividade: alerta_Atividade[] = [];
  com_base_negocio_define_taxadecomiss: com_base_negocio_define_taxadecomiss[] = [];
  quantas_casas_decimais_utilizar: quantas_casas_decimais_utilizar[] = [];

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
        this.alertaAtividadeRows = this.infoBasica[0]?.alerta_Atividade;
        this.taxaComissaoRows = this.infoBasica[0]?.com_base_negocio_define_taxadecomiss;
        this.quantas_casas_decimais_utilizarRows = this.infoBasica[0]?.quantas_casas_decimais_utilizar;
        this.formConfigsGerais.patchValue({
          qual_formato_hora_uitlizar_tela: this.infoBasica[0]?.qual_formato_hora_uitlizar_tela,
          qual_formato_data_uitlizar_tela: this.infoBasica[0]?.qual_formato_data_uitlizar_tela,
        });
        console.log(this.formConfigsGerais.value.qual_formato_hora_uitlizar_tela)
        this.formInfoService.patchInfoBasicaForm(this.formConfigsGerais, this.infoBasica);
        console.log('dados recuperados onInit: ', this.infoBasica);
        this.isLoading = false;
      },
      (error) => {
        console.error('Erro ao recuperar dados', error);
        this.isLoading = false;
      }
    );
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
      return; // Interrompe a execução se o bbP_id não estiver presente
    }

    const alerta_AtividadePOST = this.alertaAtividadeRows.map(row => {
      if (this.addNovasAlertaAtividade.includes(row)) {
        return {
          ...row,
          bbP_Alerta_Atividadeid: '0',
        }
      } else {
        return row;
      }
    });

    const taxaComissaoPOST = this.taxaComissaoRows.map(row => {
      if (this.addNovasTaxaComissao.includes(row)) {
        return {
          ...row,
          com_base_negocio_define_taxadecomissid: '0',
        }
      } else {
        return row;
      }
    });

    const casasDecimaisPOST = this.quantas_casas_decimais_utilizarRows.map(row => {
      if (this.addNovasCasasDecimais.includes(row)) {
        return {
          ...row,
          quantas_casas_decimais_utilizarid: '0',
        }
      } else {
        return row;
      }
    });

    // Clonar o objeto recuperado do GET
    const apiData = {
      ...this.infoBasica[0],
      alerta_Atividade: alerta_AtividadePOST,
      com_base_negocio_define_taxadecomiss: taxaComissaoPOST,
      quantas_casas_decimais_utilizar: casasDecimaisPOST
    };

    apiData.qual_formato_hora_uitlizar_tela = this.formConfigsGerais.value.qual_formato_hora_uitlizar_tela;
    apiData.qual_formato_data_uitlizar_tela = this.formConfigsGerais.value.qual_formato_data_uitlizar_tela;

    this.http.post('/api/BBP', apiData, httpOptions).subscribe(
      response => {
        console.log('Dados enviados com sucesso', response);
        console.log('Dados enviados:', apiData);
        this.isLoading = false;
      },
      error => {
        console.error('Erro ao enviar dados', error);
        console.log('Erro ao fazer o POST:', error);
        console.log('Status Code:', error.status);
        console.log('Mensagem de erro:', error.message);
        console.log('Erro completo:', error);
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

  deleteRow(row: alerta_Atividade) {
    const bbpid = sessionStorage.getItem('bbP_id'); // Supondo que bbP_DadosCTBID seja o valor de bbpid
    const vcode = row.bbP_Alerta_Atividadeid; // Use o valor apropriado de vcode
    const vtabela = '%40G2_BBP_ALERTAAT'; // ou algum valor dinâmico, caso necessário
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

  deleteRowTaxaComissao(row: com_base_negocio_define_taxadecomiss) {
    const bbpid = sessionStorage.getItem('bbP_id'); // Supondo que bbP_DadosCTBID seja o valor de bbpid
    const vcode = row.com_base_negocio_define_taxadecomissid; // Use o valor apropriado de vcode
    const vtabela = '%40G2_BBP_CBNDTAX'; // ou algum valor dinâmico, caso necessário
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
          this.taxaComissaoRows = this.taxaComissaoRows.filter(r => r !== row);
        }
      },
      (error) => {
        console.error('Erro ao deletar a linha', error);
      }
    );
  }

  deleteRowCasasDecimais(row: quantas_casas_decimais_utilizar) {
    const bbpid = sessionStorage.getItem('bbP_id');
    const vcode = row.quantas_casas_decimais_utilizarid;
    const vtabela = '%40G2_BBP_QCDU';
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
          this.quantas_casas_decimais_utilizarRows = this.quantas_casas_decimais_utilizarRows.filter(r => r !== row);
        }
      },
      (error) => {
        console.error('Erro ao deletar a linha', error);
      }
    );
  }
}