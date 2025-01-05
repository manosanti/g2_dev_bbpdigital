import { infoBasica } from './../../../models/infobasica/infobasica.model';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { MenuNavigationComponent } from '../../../components/menu-navigation/menu-navigation.component';
import { HeaderComponent } from '../../../components/header/header.component';
import { CustomerFieldComponent } from '../../../components/customer-field/customer-field.component';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
// Models
import { Tip } from '../../../models/infobasica/tip.model';
import { defina_Grupo_Item } from './../../../models/defina_Grupo_Item/defina_Grupo_Item.model';
import { FormInfoService } from '../../../services/infobasica/form-info.service';

@Component({
  selector: 'app-grupo-itens',
  standalone: true,
  imports: [MenuNavigationComponent, CustomerFieldComponent, HeaderComponent, FormsModule, NgFor, NgIf, HttpClientModule, ReactiveFormsModule],
  templateUrl: './grupo-itens.component.html',
  styleUrl: './grupo-itens.component.css'
})

export class defina_Grupo_ItemComponent implements OnInit {

  isLoading: boolean = true;

  formGrupoItens: FormGroup;

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

    this.http.get<infoBasica[]>(`http://bbpdigital.g2tecnologia.com.br:8021/BBP/BBPID?bbpid=${bbP_id}`, httpOptions).subscribe(
      (data: infoBasica[]) => {
        this.infoBasica = data;
        this.rows = this.infoBasica[0]?.defina_Grupo_Item;
        this.formInfoService.patchInfoBasicaForm(this.formGrupoItens, this.infoBasica);
        console.log('dados recuperados onInit: ', this.infoBasica);
        this.isLoading = false;
      },
      (error) => {
        console.error('Erro ao recuperar dados', error);
        this.isLoading = false;
      }
    )
  }

  constructor(private http: HttpClient, private fb: FormBuilder, private formInfoService: FormInfoService) {
    this.formGrupoItens = this.fb.group({
      defina_Grupo_Itemid: ['', Validators.required],
      nome_grupo: ['', Validators.required],
      metodo_planjemento_padrao: ['', Validators.required],
      metodo_suprimento_padrao: ['', Validators.required],
      solicitar_nultiplos: ['', Validators.required],
      qtde_minima_total: ['', Validators.required],
      time_dias_padrao: ['', Validators.required],
      metodo_avalizacao_padrao: ['', Validators.required]
    });
  }

  rows: defina_Grupo_Item[] = [
    {
      defina_Grupo_Itemid: this.generateUniqueId(),
      nome_grupo: '',
      metodo_planjemento_padrao: '',
      metodo_suprimento_padrao: '',
      solicitar_nultiplos: '',
      qtde_minima_total: 0,
      time_dias_padrao: 0,
      metodo_avalizacao_padrao: '',
      selected: false,
    }
  ];

  addNovaRow: defina_Grupo_Item[] = [];
  addRow() {
    const newRow: defina_Grupo_Item = {
      defina_Grupo_Itemid: this.generateUniqueId(),
      nome_grupo: '',
      metodo_planjemento_padrao: '',
      metodo_suprimento_padrao: '',
      solicitar_nultiplos: '',
      qtde_minima_total: 0,
      time_dias_padrao: 0,
      metodo_avalizacao_padrao: '',
      selected: false,
    };
    this.rows = [...this.rows, newRow];
    this.addNovaRow.push(newRow);
  }

  removeSelectedRows() {
    this.rows = this.rows.filter((row, index) => index === 0 || !row.selected);
  }

  // Quando clicar no check do cabeçalho da tabela, irá selecionar todas as linhas
  toggleSelectAll(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.rows.forEach((row, index) => {
      if (index !== 0) { // Não seleciona a primeira linha
        row.selected = isChecked;
      }
    });
  }

  trackByFn(index: number, item: defina_Grupo_Item) {
    return item.defina_Grupo_Itemid;
  }

  // Dicas

  tipsObj: Tip[] = [
    {
      id: 1,
      nome: 'Método de Planejamento Padrão',
      dica: 'Método de planejamento Selecione uma das seguintes opções:<br><br>MRP – o item pode ser planejado pelo MRP.<br>Nenhum – o item não pode ser planejado pelo MRP.'
    },
    {
      id: 2,
      nome: 'Método de Suprimento Padrão',
      dica: 'Método de suprimento Selecione um dos seguintes métodos de suprimento para as recomendações do pedido no MRP:<br><br>Fabricar – o MRP gera recomendações de ordem de produção para o item<br><br>Comprar – o MRP gera recomendações de pedidos de compra para o item.'
    },
    {
      id: 3,
      nome: 'Solicitar Múltiplos',
      dica: 'Múltiplo de pedido Indique o valor numérico para definir o tamanho dos lotes para o MRP.<br><br>Exemplo:<br><br>Se o valor for 12, o pedido do item é efetuado em múltiplos de 12. Assim, se você precisar de 20 itens e o valor for 12, a recomendação do MRP é para 24 itens.'
    },
    {
      id: 4,
      nome: 'Qtde. Mínima Total',
      dica: 'Quantidade mínima do pedido Indique o valor para definir o tamanho mínimo do lote.<br><br>Exemplo:<br><br>Quando o valor é de 100 e você precisa de 80 para atender ao pedido de venda, o MRP recomendará o valor de 100 para satisfazer à demanda e à definição da quantidade mínima do pedido'
    },
    {
      id: 5,
      nome: 'Lead Time em dias Padrão',
      dica: 'Lead Time Indique o número de dias para calcular o intervalo de tempo desde o pedido de um produto até o momento em que o produto é recebido ou produzido.'
    },
    {
      id: 6,
      nome: 'Método Avaliação Padrão',
      dica: 'Avaliação de estoque por:<br><br>Selecione uma das seguintes opções:<br><br>Preço médio móvel:<br>método baseado no cálculo de um custo médio para o item em cada transação de venda e de compra.<br><br>Padrão:<br>o sistema de determinação do preço padrão permite a seleção de um preço fixo, que é depois utilizado para todas as transações.FIFO:<br>um método adicional de estoque permanente, em que a mercadoria comprada primeiro é a primeira a ser vendida, independentemente do fluxo real de mercadoria.'
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
    if (!clickedElement.closest('.thActive')) {
      this.activeTipId = null;
    }
  }

  // Botão de envio dos dados do formulário para o back-end
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

    const grupoItensPOST = this.rows.map(row => {
      if (this.addNovaRow.includes(row)) {
        return {
          ...row,
          defina_Grupo_Itemid: '0',
        }
      } else {
        return row;
      }
    });

    const apiData = { ...this.infoBasica[0],
      defina_Grupo_Item: grupoItensPOST,
     };

    // apiData.defina_Grupo_Item = this.rows;

    this.http.post('http://bbpdigital.g2tecnologia.com.br:8021/BBP', apiData, httpOptions).subscribe(
      response => {
        console.log('Dados enviados com sucesso', response);
        console.log('Dados enviados:', apiData);
        console.log('bbp>', bbP_id)
        this.isLoading = false;
      },
      error => {
        console.error('Erro ao enviar dados', error);
        this.isLoading = false;
      }
    );
  }

  deleteRow(row: defina_Grupo_Item) {
    const bbpid = sessionStorage.getItem('bbP_id'); // Supondo que bbP_DadosCTBID seja o valor de bbpid
    const vcode = row.defina_Grupo_Itemid; // Use o valor apropriado de vcode
    const vtabela = '%40G2_BBP_DEFGRITEM'; // ou algum valor dinâmico, caso necessário
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
          this.rows = this.rows.filter(r => r !== row);
        }
      },
      (error) => {
        console.error('Erro ao deletar a linha', error);
      }
    );
  }
}
