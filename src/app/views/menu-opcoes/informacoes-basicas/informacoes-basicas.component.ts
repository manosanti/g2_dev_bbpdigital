import { Component, HostListener, OnInit } from '@angular/core';
import { HeaderComponent } from "../../../components/header/header.component";
import { CustomerFieldComponent } from "../../../components/customer-field/customer-field.component";
import { MenuNavigationComponent } from "../../../components/menu-navigation/menu-navigation.component";
import { CommonModule, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { debounceTime } from 'rxjs';
// Services
// import { MetodosHttpService } from '../../../services/infobasica/metodos-http.service';
import { FormInfoService } from '../../../services/infobasica/form-info.service';
// Modelos de dados
import { infoBasica } from '../../../models/infobasica/infobasica.model';
import { tableDadosCTB } from './../../../models/infobasica/tableDadosCTB.model';
import { Tip } from '../../../models/infobasica/tip.model';
import { moedas } from '../../../models/infobasica/moedas.model';

@Component({
  selector: 'app-informacoes-basicas',
  standalone: true,
  imports: [HeaderComponent, CustomerFieldComponent, MenuNavigationComponent, CommonModule, FormsModule, HttpClientModule, ReactiveFormsModule, NgIf],
  templateUrl: './informacoes-basicas.component.html',
  styleUrls: ['./informacoes-basicas.component.css']
})
export class InformacoesBasicasComponent implements OnInit {
  isLoading: boolean = true;

  formInfoBasica: FormGroup;

  // Arrays de Tabelas
  dadosCTBRows: tableDadosCTB[] = [];
  moedasRows: moedas[] = [];
  currencies: any[] = [];

  modals = [
    { id: 'nomeEmpresa', title: 'Nome da Empresa', description: 'Preencher informações pendentes', isVisible: false, icon: 'fa-solid fa-address-card' },
    { id: 'dadosContabeis', title: 'Dados Contábeis', description: 'Preencher Dados Contábeis', isVisible: false, icon: 'fa-solid fa-money-check-dollar' },
    // { id: 'endereco', title: 'Endereço', description: 'Preencha o Endereço Completo', isVisible: false, icon: 'fa-solid fa-location-dot' },
    { id: 'camposLocalizacao', title: 'Campos de Localização', description: 'Preencha os Campos de Localização', isVisible: false, icon: 'fa-solid fa-map-location-dot' },
    { id: 'web', title: 'Web', description: 'Preencha os Campos de Web', isVisible: false, icon: 'fa-solid fa-earth-americas' },
    { id: 'caminhoPastas', title: 'Caminho Para Pastas', description: 'Preencha o Caminho para Pastas', isVisible: false, icon: 'fa-solid fa-folder-tree' },
    { id: 'telefone', title: 'Telefone', description: 'Preencha as Informações de Contato', isVisible: false, icon: 'fa-solid fa-phone-flip' },
    { id: 'moedas', title: 'Moedas', description: 'Preencha as Informações Financeiras', isVisible: false, icon: 'fa-solid fa-dollar-sign' },
    { id: 'listarMoedas', title: 'Lista de Moedas', description: 'Preencha as Informações Financeiras', isVisible: false, icon: 'fa-solid fa-dollar-sign' }
  ]

  tipsObj: Tip[] = [
    {
      id: 1,
      nome: 'Inscrição Estadual',
      dica: 'Caso não possua Inscrição Estadual preencher com ISENTO'
    },
    {
      id: 2,
      nome: 'Valor acumulado do imposto retido na fonte: Contas a Receber',
      dica: 'Especifique em moeda local, o limite mínimo para lançamento de contas a receber do IRF, como definido pelo governo.'
    },
    {
      id: 3,
      nome: 'Valor acumulado do imposto retido na fonte: Contas a Pagar',
      dica: 'Especifique em moeda local, o limite mínimo para lançamento de contas a receber do IRF, como definido pelo governo.'
    },
    {
      id: 4,
      nome: 'Arquivos do Microsoft Word',
      dica: 'Pasta onde pretende gravar modelos do MS Word para exportar dados para o Microsoft Word.<br><br>Quando modificada, esta configuração é imediatamente atualizada por empresa, para todos os usuários.'
    },
    {
      id: 5,
      nome: 'Arquivos do Microsoft Excel',
      dica: 'Pasta onde pretende gravar do MS Excel para exportar dados para o Microsoft Excel.<br><br>Quando modificada, esta configuração é atualizada por empresa, para todos os usuários.'
    },
    {
      id: 6,
      nome: 'Arquivos de imagens',
      dica: 'Pasta onde pretende gravar imagens, tais como logotipos de empresas, para integração em campos do usuário.<br><br>Quando modificada, esta configuração é atualizada por empresa, para todos os usuários.'
    },
    {
      id: 7,
      nome: 'Pasta de anexos',
      dica: 'Pasta onde pretende gravar anexos, tais como páginas da Web do cliente, para integração em campos do usuário.<br><br>Quando atualizada, esta configuração é atualizada por empresa, para todos os usuários.'
    },
    {
      id: 8,
      nome: 'Pasta p/ licenças dos add-ons (ampliações)',
      dica: 'Pasta onde são gravadas as imagens seguras.<br><br>As imagens seguras incluem carimbos oficiais e, devido a requisitos legais, só podem ser gravadas em seu computador como arquivos *.dll e não em formatos normais de imagem.<br><br>Quando modificada, esta configuração é atualizada por empresa, para todos os usuários.'
    },
    {
      id: 9,
      nome: 'Pasta arquivo XML',
      dica: 'Pasta onde deseja armazenar o arquivo XML criado de uma das duas seguintes maneiras: selecione o botão Criar arquivo em diversas janelas de relatório, ou utilize a função Exportar formulário para XML.<br><br>Quando modificada, esta configuração é atualizada por empresa, para todos os usuários.'
    }
  ];

  activeTipId: number | null = null;

  private generatedIds: Set<string> = new Set();

  constructor(private http: HttpClient, private fb: FormBuilder, private formInfoService: FormInfoService) {
    this.formInfoBasica = this.fb.group({
      cardName: ['', Validators.required],
      site: ['', Validators.required],
      email: ['', Validators.required],
      telefone: ['', Validators.required],
      telefone2: ['', Validators.required],
      // Dados Contábeis || Objeto
      codigoCNAE: ['', Validators.required],
      cnpj: ['', Validators.required],
      inscricaoEstadual: ['', Validators.required],
      inscricaoEstadual_Sub_Tributario: ['', Validators.required],
      inscricaoMunicipal: ['', Validators.required],
      indicador_natureza_pessoa_juridicial: ['', Validators.required],
      indicador_Tipo_Atividade_Preponderante: ['', Validators.required],
      ind_Apuracao_Contribuicoes_Creditos: ['', Validators.required],
      indicador_Apuracao_IPI: ['', Validators.required],
      indicador_Tipo_Sociedade_Cooperativa: ['', Validators.required],
      tributacao_lucro: ['', Validators.required],
      qualificacao_Empresa: ['', Validators.required],
      tipo_declarante: ['', Validators.required],
      valor_Acumulado_Imposto_Retido_Fonte_CR: ['', Validators.required],
      valor_Acumulado_Imposto_Retido_Fonte_CP: ['', Validators.required],
      // 
      campos_Loca_Registro_Comercial: ['', Validators.required],
      campos_Loca_Data_Incorporacao: ['', Validators.required],
      campos_Loca_Perfil_Sped: ['', Validators.required],
      caminho_Pasta_Word: ['', Validators.required],
      caminho_Pasta_Excel: ['', Validators.required],
      caminho_Pasta_Imagens: ['', Validators.required],
      caminho_Pasta_Licencas: ['', Validators.required],
      caminho_Pasta_XML: ['', Validators.required],

      // Endereço
      cep: ['', Validators.required],
      logradouro: ['', Validators.required],
      bairro: ['', Validators.required],
      municipio: ['', Validators.required],
      uf: ['', Validators.required],

      // Moedas
      moeda_Corrente: ['', Validators.required],
      moeda_Sistema: ['', Validators.required],
      seu_Negocio_necessita_sup_mult: ['', Validators.required],
      qual_conta_corrente_negocio_padrao_sistema: ['', Validators.required],

      // Listar Moedas
      numero: ['', Validators.required],
      nomeMoeda: ['', Validators.required],
      codigoInternacional: ['', Validators.required],
    });
  }

  // Tabela tableDadosCTB
  rowsDadosCTB: tableDadosCTB[] = [
    {
      bbP_DadosCTBID: this.generateUniqueId(),
      tipoFJ: '',
      cnpj: '',
      cpf: '',
      codigoCNAE: '',
      inscricaoEstadual: '',
      inscricaoEstadual_Sub_Tributario: '',
      inscricaoMunicipal: '',
      indicador_natureza_pessoa_juridicial: '',
      indicador_Tipo_Atividade_Preponderante: '',
      ind_Apuracao_Contribuicoes_Creditos: '',
      indicador_Apuracao_IPI: '',
      indicador_Tipo_Sociedade_Cooperativa: '',
      tributacao_lucro: '',
      qualificacao_Empresa: '',
      tipo_declarante: '',
      valor_Acumulado_Imposto_Retido_Fonte_CR: '',
      valor_Acumulado_Imposto_Retido_Fonte_CP: '',
      selected: false
    }
  ];

  addNovaDadosCTB: tableDadosCTB[] = [];
  addRowDadosCTB() {
    const newRow: tableDadosCTB = {
      bbP_DadosCTBID: this.generateUniqueId(),
      tipoFJ: '',
      cnpj: '',
      cpf: '',
      codigoCNAE: '',
      inscricaoEstadual: '',
      inscricaoEstadual_Sub_Tributario: '',
      inscricaoMunicipal: '',
      indicador_natureza_pessoa_juridicial: '',
      indicador_Tipo_Atividade_Preponderante: '',
      ind_Apuracao_Contribuicoes_Creditos: '',
      indicador_Apuracao_IPI: '',
      indicador_Tipo_Sociedade_Cooperativa: '',
      tributacao_lucro: '',
      qualificacao_Empresa: '',
      tipo_declarante: '',
      valor_Acumulado_Imposto_Retido_Fonte_CR: '',
      valor_Acumulado_Imposto_Retido_Fonte_CP: '',
      selected: false,
    };

    this.dadosCTBRows = [...this.dadosCTBRows, newRow];
    this.addNovaDadosCTB.push(newRow)
    console.log(newRow);
  }

  deleteRow(row: tableDadosCTB) {
    const bbpid = sessionStorage.getItem('bbP_id'); // Supondo que bbP_DadosCTBID seja o valor de bbpid
    const vcode = row.bbP_DadosCTBID; // Use o valor apropriado de vcode
    const vtabela = '%40G2_BBPCTB'; // ou algum valor dinâmico, caso necessário
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
          this.dadosCTBRows = this.dadosCTBRows.filter(r => r !== row);
        }
      },
      (error) => {
        console.error('Erro ao deletar a linha', error);
      }
    );
  }

  // selectCurrency() {
  //   this.http.get('https://openexchangerates.org/api/currencies.json').subscribe(
  //     (data: any) => {
  //       this.currency = Object.entries(data); // Transformar o objeto retornado em um array de pares [key, value]
  //       console.log('resultado:', this.currency);
  //     },
  //     (error) => {
  //       console.error('Erro ao buscar moedas:', error);
  //     }
  //   );
  // }

  deleteRowMoedas(row: moedas) {
    const bbpid = sessionStorage.getItem('bbP_id');
    const vcode = row.bbP_MoedasID;
    const vtabela = '%40G2_BBP_MOEDAS';
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
          this.moedasRows = this.moedasRows.filter(r => r !== row);
        }
      },
      (error) => {
        console.error('Erro ao deletar a linha', error);
      }
    );
  }

  toggleSelectAllDadosCTB(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.rowsDadosCTB.forEach((row, index) => {
      if (index !== 0) { // Não seleciona a primeira linha
        row.selected = isChecked;
      }
    });
  }

  trackByFnDadosCTB(index: number, item: tableDadosCTB) {
    return item.bbP_DadosCTBID;
  }

  // Tabela moedas
  rowsMoedas: moedas[] = [
    {
      bbP_MoedasID: this.generateUniqueId(),
      numero: '',
      nomeMoeda: '',
      codigoInternacional: '',
      selected: false,
    }
  ];

  addNovaMoedas: moedas[] = [];
  addRowMoeda() {
    const newRow: moedas = {
      bbP_MoedasID: this.generateUniqueId(), // Incrementa o ID
      numero: '',
      nomeMoeda: '',
      codigoInternacional: '',
      selected: false
    };

    this.moedasRows = [...this.moedasRows, newRow]; // Atualiza a lista com nova linha
    this.addNovaMoedas.push(newRow);
    console.log('Nova linha adicionada em Moedas:', newRow); // Log para conferir
  }

  removeSelectedRowMoeda() {
    this.rowsMoedas = this.rowsMoedas.filter(row => !row.selected);
  }

  toggleSelectAllMoeda(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.rowsMoedas.forEach((row, index) => {
      if (index !== 0) { // Não seleciona a primeira linha
        row.selected = isChecked;
      }
    });
  }

  trackByFnMoeda(index: number, item: moedas) {
    return item.bbP_MoedasID;
  }

  infoBasica: infoBasica[] = [];

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

  ngOnInit(): void {
    const token = sessionStorage.getItem('token');
    const bbP_id = sessionStorage.getItem('bbP_id');

    this.http.get<any[]>('currency.json').subscribe(data => {
      this.currencies = data;
    });

    setTimeout(() => {
      if (!token || !bbP_id) {
        // Se token ou bbP_id não estão disponíveis, recarregar a página
        window.location.reload();
      }
    }, 2000);

    // Monitorar mudanças no campo 'cep' e chamar viaCEP quando o valor mudar
    this.formInfoBasica.get('cep')?.valueChanges
      .pipe(debounceTime(300)) // Aguarda 300ms após o usuário parar de digitar
      .subscribe((cep) => {
        if (cep && cep.length === 8) { // Verifica se o CEP tem 8 dígitos
          this.viaCEP(cep);
        }
      });

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
        this.dadosCTBRows = this.infoBasica[0]?.dadosCTB || [];
        this.moedasRows = this.infoBasica[0]?.moedas || [];

        // GET (isolado) dos campos a serem resgatados
        this.formInfoService.patchInfoBasicaForm(this.formInfoBasica, this.infoBasica);
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
    const bbP_id = sessionStorage.getItem('bbP_id');
    const token = sessionStorage.getItem('token');

    if (!bbP_id) {
      console.error('bbP_id não encontrado no sessionStorage. Por favor, verifique se o valor está sendo armazenado corretamente.');
      return;
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    };

    const dadosCTBPOST = this.dadosCTBRows.map(row => {
      if (this.addNovaDadosCTB.includes(row)) {
        return {
          ...row,
          bbP_DadosCTBID: '0',
        }
      } else {
        return row;
      }
    });

    const moedasPOST = this.moedasRows.map(row => {
      if (this.addNovaMoedas.includes(row)) {
        return {
          ...row,
          bbP_MoedasID: '0',
        }
      } else {
        return row;
      }
    })

    const apiData = {
      ...this.infoBasica[0],
      dadosCTB: dadosCTBPOST,
      moedas: moedasPOST,
    }

    apiData.cardName = this.formInfoBasica.value.cardName;
    apiData.campos_Loca_Registro_Comercial = this.formInfoBasica.value.campos_Loca_Registro_Comercial;
    apiData.campos_Loca_Data_Incorporacao = this.formInfoBasica.value.campos_Loca_Data_Incorporacao;
    apiData.campos_Loca_Perfil_Sped = this.formInfoBasica.value.campos_Loca_Perfil_Sped;
    apiData.caminho_Pasta_Word = this.formInfoBasica.value.caminho_Pasta_Word;
    apiData.caminho_Pasta_Excel = this.formInfoBasica.value.caminho_Pasta_Excel;
    apiData.caminho_Pasta_Imagens = this.formInfoBasica.value.caminho_Pasta_Imagens;
    apiData.caminho_Pasta_Licencas = this.formInfoBasica.value.caminho_Pasta_Licencas;
    apiData.caminho_Pasta_XML = this.formInfoBasica.value.caminho_Pasta_XML;
    apiData.moeda_Corrente = this.formInfoBasica.value.moeda_Corrente;
    apiData.moeda_Sistema = this.formInfoBasica.value.moeda_Sistema;
    apiData.seu_Negocio_necessita_sup_mult = this.formInfoBasica.value.seu_Negocio_necessita_sup_mult;
    apiData.qual_conta_corrente_negocio_padrao_sistema = this.formInfoBasica.value.qual_conta_corrente_negocio_padrao_sistema;
    apiData.site = this.formInfoBasica.value.site;
    apiData.email = this.formInfoBasica.value.email;
    apiData.telefone = this.formInfoBasica.value.telefone;
    apiData.telefone2 = this.formInfoBasica.value.telefone2;

    console.log('Dados enviados:', apiData);

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

  viaCEP(cep: string) {

    this.http.get(`https://viacep.com.br/ws/${cep}/json/`).subscribe(
      (response: any) => {
        const addressData = {
          bairro: response.bairro,
          logradouro: response.logradouro,
          municipio: response.localidade,
          uf: response.uf,
        };

        // Atualiza o formulário com os dados recebidos
        for (const key in addressData) {
          if (this.formInfoBasica.controls[key as keyof typeof addressData]) { // Use type assertion aqui
            this.formInfoBasica.controls[key].setValue(addressData[key as keyof typeof addressData]);
          }
        }

        console.log('Dados recebidos da API ViaCEP:', response);
      }, (error) => {
        console.error('Erro ao buscar CEP:', error);
      });
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

  getTip(id: number): string {
    const tip = this.tipsObj.find(t => t.id === id);
    return tip ? tip.dica : 'Dica não encontrada';
  }

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
}