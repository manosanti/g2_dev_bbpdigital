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
      bbP_DadosCTBID: '1',
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

  currentId: number = 0;

  addRowDadosCTB() {
    const newRow: tableDadosCTB = {
      bbP_DadosCTBID: (this.currentId++).toString(),
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
    this.rowsDadosCTB = [...this.rowsDadosCTB, newRow];
    console.log(newRow)
  }

  removeSelectedRowDadosCTB() {
    this.rowsDadosCTB = this.rowsDadosCTB.filter(row => !row.selected);
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
      bbP_MoedasID: '1',
      numero: '',
      nomeMoeda: '',
      codigoInternacional: '',
      selected: false,
    }
  ];

  addRowMoeda() {
    const newRow: moedas = {
      bbP_MoedasID: '1', // Incrementa o ID
      numero: '',
      nomeMoeda: '',
      codigoInternacional: '',
      selected: false
    };

    this.rowsMoedas = [...this.rowsMoedas, newRow]; // Atualiza a lista com nova linha
    this.nextId++; // Incrementa o ID para a próxima linha
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

  // Variável de controle de ID
  nextId = 2;

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
        this.rowsDadosCTB = this.infoBasica[0]?.dadosCTB || [];
        this.rowsMoedas = this.infoBasica[0]?.moedas || [];
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

    const infoBasica = this.formInfoBasica.value;
    const bbP_id = sessionStorage.getItem('bbP_id');
    const cardCode = sessionStorage.getItem('cardCode');
    const token = sessionStorage.getItem('token');

    const dadosCTB = this.rowsDadosCTB.map(row => ({
      ...row,
      bbP_DadosCTBID: '0',  // Converte para '0'
    }));

    const newInfoBasica = {
      bbP_id: bbP_id,
      cardCode: cardCode,

      cardName: infoBasica.cardName,
      // Web
      site: infoBasica.site,
      email: infoBasica.email,
      // Telefone
      telefone: infoBasica.telefone,
      telefone2: infoBasica.telefone2,
      // Dados Contábeis
      dadosCTB: dadosCTB,
      // Campos de Localização
      campos_Loca_Registro_Comercial: infoBasica.campos_Loca_Registro_Comercial,
      campos_Loca_Data_Incorporacao: infoBasica.campos_Loca_Data_Incorporacao,
      campos_Loca_Perfil_Sped: infoBasica.campos_Loca_Perfil_Sped,
      // Caminho para Pastas
      caminho_Pasta_Word: infoBasica.caminho_Pasta_Word,
      caminho_Pasta_Excel: infoBasica.caminho_Pasta_Excel,
      caminho_Pasta_Imagens: infoBasica.caminho_Pasta_Imagens,
      caminho_Pasta_Licencas: infoBasica.caminho_Pasta_Licencas,
      caminho_Pasta_XML: infoBasica.caminho_Pasta_XML,
      // Moedas
      moeda_Corrente: infoBasica.moeda_Corrente,
      moeda_Sistema: infoBasica.moeda_Sistema,
      // Moedas
      moedas: this.rowsMoedas,
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    };

    console.log('Dados enviados:', newInfoBasica);

    this.http.post('/api/BBP', newInfoBasica, httpOptions).subscribe(
      response => {
        // console.log('Dados atualizados com sucesso:', response);
        console.log('Dados a serem enviados:', newInfoBasica);
        this.isLoading = false;
      },
      error => {
        console.error('Erro ao atualizar dados:', error);
        this.isLoading = false;
      }
    );
  }

  // 
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