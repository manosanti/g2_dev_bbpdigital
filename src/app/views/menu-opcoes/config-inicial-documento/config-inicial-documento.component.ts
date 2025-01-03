import { Component, HostListener, OnInit } from '@angular/core';
import { MenuNavigationComponent } from "../../../components/menu-navigation/menu-navigation.component";
import { CustomerFieldComponent } from "../../../components/customer-field/customer-field.component";
import { HeaderComponent } from "../../../components/header/header.component";
import { NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
// Models
import { Tip } from '../../../models/infobasica/tip.model';
import { definir_configuracoes_iniciais_documento } from '../../../models/definir_configuracoes_iniciais_documento/definir_configuracoes_iniciais_documento.model';
import { FormInfoService } from '../../../services/infobasica/form-info.service';
import { infoBasica } from '../../../models/infobasica/infobasica.model';
// Variáveis Globais
import { bbP_id, token, httpOptions } from '../../../global/constants';

@Component({
  selector: 'app-config-inicial-documento',
  standalone: true,
  imports: [MenuNavigationComponent, CustomerFieldComponent, HeaderComponent, NgIf, HttpClientModule, ReactiveFormsModule, NgFor, FormsModule, NgClass],
  templateUrl: './config-inicial-documento.component.html',
  styleUrl: './config-inicial-documento.component.css'
})
export class ConfigInicialDocumentoComponent implements OnInit {
  className: string = 'w-full';
  isLoading: boolean = true;
  infoBasica: infoBasica[] = [];
  formConfigInicial: FormGroup;

  private generatedIds: Set<string> = new Set();

  private generateUniqueId(): string {
    let newId: string;
    do {
      newId = Math.random().toString(36).substring(2, 15);
    } while (this.generatedIds.has(newId));
    this.generatedIds.add(newId);
    console.log('Novo ID gerado:', newId);
    return newId;
  }

  constructor(private http: HttpClient, private fb: FormBuilder, private formInfoService: FormInfoService) {
    this.formConfigInicial = this.fb.group({
      definir_configuracoes_iniciais_documentoid: ['', Validators.required],
      calcular_lucro_bruto: ['', Validators.required],
      observacoes_documento_compreendem: ['', Validators.required],
      para_ema_EP_vendas_documentos: ['', Validators.required],
      resposta_liberacao_entrada_estoque_abaixo_nivel: ['', Validators.required],
      bloquear_estoque_negativo: ['', Validators.required],
      bloquear_estoque_negativo_por: ['', Validators.required],
      metodo_arredondamento: ['', Validators.required],
      data_base_taxa_cambio: ['', Validators.required],
      arredondar_valor_imposto_linhas: ['', Validators.required],
      exibir_observacao_arredondamento: ['', Validators.required],
      bloquear_documentos_data_lancamento: ['', Validators.required],
      permitir_data_lancamento_futuro: ['', Validators.required],
    })
  }

  rowsConfigInicial: definir_configuracoes_iniciais_documento[] = [
    {
      definir_configuracoes_iniciais_documentoid: this.generateUniqueId(),
      calcular_lucro_bruto: '',
      observacoes_documento_compreendem: '',
      para_ema_EP_vendas_documentos: '',
      resposta_liberacao_entrada_estoque_abaixo_nivel: '',
      bloquear_estoque_negativo: '',
      bloquear_estoque_negativo_por: '',
      metodo_arredondamento: '',
      data_base_taxa_cambio: '',
      arredondar_valor_imposto_linhas: '',
      exibir_observacao_arredondamento: '',
      bloquear_documentos_data_lancamento: '',
      permitir_data_lancamento_futuro: '',
    }
  ];

  novasRowsConfigInicial: definir_configuracoes_iniciais_documento[] = [];
  addRowConfigInicial() {
    const newRow: definir_configuracoes_iniciais_documento = {
      definir_configuracoes_iniciais_documentoid: this.generateUniqueId(),
      calcular_lucro_bruto: '',
      observacoes_documento_compreendem: '',
      para_ema_EP_vendas_documentos: '',
      resposta_liberacao_entrada_estoque_abaixo_nivel: '',
      bloquear_estoque_negativo: '',
      bloquear_estoque_negativo_por: '',
      metodo_arredondamento: '',
      data_base_taxa_cambio: '',
      arredondar_valor_imposto_linhas: '',
      exibir_observacao_arredondamento: '',
      bloquear_documentos_data_lancamento: '',
      permitir_data_lancamento_futuro: '',
    };
    this.rowsConfigInicial = [...this.rowsConfigInicial, newRow];
    this.novasRowsConfigInicial.push(newRow);
    console.log(newRow)
  }

  trackByFnConfigInicial(index: number, item: definir_configuracoes_iniciais_documento) {
    return item.definir_configuracoes_iniciais_documentoid; // Garantir que sempre retorna algo
  }  

  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, }), }

  ngOnInit(): void {
    this.updateClass();
    setTimeout(() => {
      if (!token || !bbP_id) {
        window.location.reload();
      }
    }, 2000);

    this.isLoading = true;

    this.http.get<infoBasica[]>(`/api/BBP/BBPID?bbpid=${bbP_id}`, httpOptions).subscribe(
      (data: infoBasica[]) => {
        this.infoBasica = data;
        console.log('DATA:', this.infoBasica[0]?.definir_configuracoes_iniciais_documento[0]?.definir_configuracoes_iniciais_documentoid);
        this.rowsConfigInicial = this.infoBasica[0]?.definir_configuracoes_iniciais_documento || [];
        this.formInfoService.patchInfoBasicaForm(this.formConfigInicial, this.infoBasica);
        console.log('dados recuperados onInit: ', this.infoBasica);
        this.isLoading = false;
      },
      (error) => {
        console.error('Erro ao recuperar dados', error);
        this.isLoading = false;
      }
    );
  }

  updateClass() {
    const menuStatus = sessionStorage.getItem('menuStatus');

    // Verifica o status do menu e define a classe apropriada
    this.className = menuStatus === 'open' ? 'custom-width' : 'w-full';
  }

  onMenuStatusChanged(isOpen: boolean) {
    this.className = isOpen ? 'custom-width' : 'w-full'; // Atualiza a classe baseada no estado recebido
  }

  // Dicas
  tipsObj: Tip[] = [
    {
      id: 1,
      nome: 'Calcular lucro bruto',
      dica: 'Calcular lucro bruto.<br>Marque o campo de seleção Calcular lucro bruto para ativar o cálculo de lucro bruto em documentos de vendas de tipos de item e serviço.'
    },
    {
      id: 2,
      nome: 'Observações de documento compreendem',
      dica: 'Observações do documento compreendem: Selecione se as observações nos documentos de marketing incluem o número do documento base, ou o número de referência do cliente ou do fornecedor.<br><br>Entrando um documento de vendas com referência a um documento base, aparece o número do documento base. O número exibido pode ser um número interno atribuído ao documento pelo SAP Business One ou o número de referência do cliente/fornecedor do documento base.<br><br>Se você optar por exibir o número de referência do cliente/fornecedor e nenhum número deste tipo for entrado no documento base, o respectivo campo permanecerá em branco no documento em que foi criado com referência ao documento base.'
    },
    {
      id: 3,
      nome: 'Para uma E.P. de vendas nos documentos, exibir',
      dica: 'Para uma estrutura do produto de vendas nos documentos, exibir: Selecione Preço e Total apenas para item superior, se quiser exibir apenas o preço total do produto vendido. Selecione Preço por componente para exibir os preços dos componentes. Neste caso, o preço total é calculado como sendo o total dos preços dos componentes.<br>Se for definida uma estrutura de produto de vendas para um produto, essa estrutura será exibida no documento de vendas. O documento de vendas exibe o produto vendido e os componentes que contribuem para este produto. Quando você selecionar este botão de rádio, você deverá determinar se o preço de vendas do item deve ser exibido ao nível do produto vendido ou ao nível dos componentes no documento de vendas.'
    },
    {
      id: 4,
      nome: 'Resposta para liberação/entrada de estoque  abaixo ou acima do nível definido',
      dica: 'Resposta à liberação/Recebimento de estoque fora do intervalo definido: Define a resposta do sistema quando o nível de estoque de um item se situa abaixo da quantidade mínima como resultado de um documento de vendas/saída de mercadorias, ou excede a quantidade máxima como resultado de um recebimento de mercadorias.<br><br>Nota:<br>Os níveis de estoque mínimo e máximo são definidos na janela Cadastro de item, na ficha Dados do estoque. Se você não definir um nível de estoque mínimo para um item, o SAP Business One trata o item como se o seu nível de estoque mínimo fosse zero. Se você não definir um nível de estoque máximo para um item, o SAP Business One não avalia o nível máximo em quantidades de mercadorias recebidas.<br><br>Selecione uma das seguintes opções:<br><br>Sem advertência – impede qualquer notificação do SAP Business One.<br><br>Apenas advertência— uma mensagem de advertência aparece. O usuário pode optar por continuar (e ficar abaixo do nível mínimo ou exceder o nível máximo), ou fazer os ajustes necessários primeiro, como emite/recebe apenas uma quantidade parcial, procurar por itens alternativos, e assim por diante.<br><br>Bloquear liberação — uma mensagem de erro aparece. O usuário é impedido de completar o documento e se situar abaixo do nível mínimo/exceder o nível máximo definido para o item.'
    },
    {
      id: 5,
      nome: 'Bloquear estoque negativo',
      dica: 'Bloquear inventário negativo. Selecione para bloquear documentos que fariam com que o nível de estoque caísse abaixo de zero. Desmarque o campo de seleção para permitir estoque negativo. Se você desmarcar o campo de seleção, a seguinte mensagem aparece:<br><br>A utilização de estoque negativo não está de acordo com regras de contabilidade. Tem certeza que pretende permitir a utilização do estoque negativo?<br><br>Quando você marca o campo de seleção Bloquear estoque negativo por, você tem as 3 opções seguintes para definição de estoque negativo no SAP Business One:Empresa<br><br>Quando você especificar Bloquear estoque negativo por empresa, o SAP Business One bloqueia apenas um item da quantidade de estoque acumulada em todos os depósitos em sua empresa que forem inferior a 0Exemplo<br><br>Item01 tem duas localizações: Dep01 e Dep02. Isto também implica que um depósito específico pode ter uma quantidade negativa enquanto o total de todos os depósitos está positivo. Por exemplo, você armazena o item 1 em ambos Dep01 e Dep02. Agora Dep01 tem 150 em estoque, e Dep02 tem -20 em estoque. Esta situação é permitida se a quantidade de estoque acumulado for 130, que é positivoDepósito<br><br>Quando você especificar Bloquear estoque negativo por depósito, o SAP Business One bloqueia um item do seu estoque que for inferior a 0 em qualquer depósito para o qual foi atribuídoConfiguração do item<br><br>Quando você especificar Bloquear estoque negativo por configuração do item, o SAP Business One bloqueia o estoque negativo no nível da empresa ou para cada depósito, dependendo do status do campo de seleção Administrar estoque por depósito no cadastro do item.'
    },
    {
      id: 6,
      nome: 'Método de arredondamento',
      dica: 'Método de arredondamento: Selecione se os valores e os preços que aparecem nos documentos de marketing devem ser arredondados por moeda ou por documento.'
    },
    {
      id: 7,
      nome: 'Data base taxa de câmbio (documentos C/P)',
      dica: 'Data base da taxa de câmbio (documentos de contas a pagar) Seleciona a data em que o sistema calcula a taxa de câmbio:<br>Data de lançamento<br>Data do documento'
    },
    {
      id: 8,
      nome: 'Arredondar valor de imposto nas linhas',
      dica: 'Método de arredondamento: Selecione se os valores e os preços que aparecem nos documentos de marketing devem ser arredondados por moeda ou por documento.'
    },
    {
      id: 9,
      nome: 'Exibir observação de arredondamento',
      dica: 'Exibir observação de arredondamento: Selecione para determinar se será exibida uma observação no campo Observações do documento de vendas depois que um valor tiver sido arredondado. Se você selecionar o campo de seleção, uma observação em uma nota fiscal de moeda estrangeira para um cliente é exibida, indicando que o valor de desconto é diferente da porcentagem de desconto, devido ao arredondamento.'
    },
    {
      id: 10,
      nome: 'Bloquear documentos com data de lançamento anterior',
      dica: 'Bloquear documentos com data de lançamento anterior:<br>Selecione para bloquear o processo de lançamento dos documentos que criam lançamentos contábeis manuais automáticos (nota fiscal, nota de crédito, depósito e documentos de pagamento).'
    },
    {
      id: 11,
      nome: 'Permitir data lançamento futuro',
      dica: 'Permitir data lançamento futuro:<br>Selecione para poder criar documentos com datas de lançamento futuras. As empresas podem criar documentos com datas de lançamento futuras no nível da empresa, e depois decidir se pretendem aplicar esta opção para todos os documentos ou apenas para os selecionados.'
    },
  ]

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

  // Botão de envio dos dados do formulário para o back-end
  onSubmit(): void {
    this.isLoading = true;

    if (!bbP_id) {
      console.error('bbP_id não encontrado no sessionStorage. Por favor, verifique se o valor está sendo armazenado corretamente.');
      return;
    }

    const configInicialPOST = this.rowsConfigInicial;    

    const apiData = {
      ...this.infoBasica[0],
      definir_configuracoes_iniciais_documento: configInicialPOST,
    };

    // Método POST
    this.http.post(`/api/BBP`, apiData, httpOptions).subscribe(response => {
      console.log('Dados enviados com sucesso', response);
      console.log('Dados enviados:', apiData);
      console.log('Rows antes do POST:', configInicialPOST);
      console.log('dados rows',apiData.definir_configuracoes_iniciais_documento)
      this.isLoading = false;
    }, error => {
      console.error('Erro ao enviar dados', error);
    });
  }

  deleteRow(row: definir_configuracoes_iniciais_documento) {
    const vcode = row.definir_configuracoes_iniciais_documentoid;
    const vtabela = '%40G2_BBP_CONFINI';

    const deleteUrl = `/api/BBP/BBP_DEL_SUBTAB?bbpid=${bbP_id}&vcode=${vcode}&vtabela=${vtabela}`;

    this.http.delete(deleteUrl, httpOptions).subscribe(
      (response) => {
        console.log('Resposta da API:', response); // Verifique o que a API está retornando
        if (response) {
          this.rowsConfigInicial = this.rowsConfigInicial.filter(r => r !== row);
        }
      },
      (error) => {
        console.error('Erro ao deletar a linha', error);
      }
    );
  }

  postSDK(row: definir_configuracoes_iniciais_documento) {
    // Estrutura do objeto de acordo com a solicitação
    const payload = {
      metodo_arredondamento: row.metodo_arredondamento, // O nome do grupo vindo da linha
    };

    // URL de teste (você pode substituir pela URL correta)
    const postUrl = '/api/SAPSDK/GrupoClientes'; // Substitua pela URL real

    this.http.post(postUrl, payload, this.httpOptions).subscribe(
      (response) => {
        console.log('POST bem-sucedido para o grupo:', row.metodo_arredondamento, response);
      },
      (error) => {
        console.error('Erro ao fazer POST para o grupo:', row.metodo_arredondamento, error);
      }
    );
  }
}