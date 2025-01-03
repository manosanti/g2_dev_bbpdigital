import { infoBasica } from './../../../models/infobasica/infobasica.model';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { MenuNavigationComponent } from '../../../components/menu-navigation/menu-navigation.component';
import { CustomerFieldComponent } from '../../../components/customer-field/customer-field.component';
import { HeaderComponent } from '../../../components/header/header.component';
// Models
import { Tip } from '../../../models/infobasica/tip.model';
import { configuracao_Imposto_Retido_Fonte } from '../../../models/configuracao_Imposto_Retido_Fonte/configuracao_Imposto_Retido_Fonte.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormInfoService } from '../../../services/infobasica/form-info.service';

@Component({
  selector: 'app-impostos',
  standalone: true,
  imports: [MenuNavigationComponent, CustomerFieldComponent, HeaderComponent, FormsModule, NgFor, NgIf, ReactiveFormsModule],
  templateUrl: './impostos.component.html',
  styleUrl: './impostos.component.css'
})
export class ImpostosComponent implements OnInit {
  isLoading: boolean = true;
  formImpostos: FormGroup;
  infoBasica: infoBasica[] = [];

  impostosRows: configuracao_Imposto_Retido_Fonte[] = [];

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
    this.formImpostos = this.fb.group({
      configuracao_Imposto_Retido_Fonteid: ['', Validators.required],
      nome_imposto: ['', Validators.required],
      categoria: ['', Validators.required],
      taxa: 0,
      tipo_basico: ['', Validators.required],
      perc_valor_base: 0,
      codigo_oficial: ['', Validators.required],
      conta: ['', Validators.required],
      tipo: ['', Validators.required],
    });
  }

  rowsImpostos: configuracao_Imposto_Retido_Fonte[] = [
    {
      configuracao_Imposto_Retido_Fonteid: this.generateUniqueId(),
      nome_imposto: '',
      categoria: '',
      taxa: 0,
      tipo_basico: '',
      perc_valor_base: 0,
      codigo_oficial: '',
      conta: '',
      tipo: '',
      selected: false,
    }
  ];

  addRowConfigImposto: configuracao_Imposto_Retido_Fonte[] = [];
  addRow() {
    const newRow: configuracao_Imposto_Retido_Fonte = {
      configuracao_Imposto_Retido_Fonteid: this.generateUniqueId(),
      nome_imposto: '',
      categoria: '',
      taxa: 0,
      tipo_basico: '',
      perc_valor_base: 0,
      codigo_oficial: '',
      conta: '',
      tipo: '',
      selected: false,
    };
    this.rowsImpostos = [...this.rowsImpostos, newRow];
    this.addRowConfigImposto.push(newRow);
    console.log('Nova linha adicionada em Moedas:', newRow); // Log para conferir

  }

  removeSelectedRows() {
    // Mantém a primeira linha e remove as demais selecionadas
    this.rowsImpostos = this.rowsImpostos.filter((row, index) => index === 0 || !row.selected);
  }

  toggleSelectAll(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.rowsImpostos.forEach((row, index) => {
      if (index !== 0) { // Não seleciona a primeira linha
        row.selected = isChecked;
      }
    });
  }

  trackByFn(index: number, item: configuracao_Imposto_Retido_Fonte) {
    return item.configuracao_Imposto_Retido_Fonteid;
  }

  // Dicas

  tipsObj: Tip[] = [
    {
      id: 1,
      nome: 'Nome do Imposto',
      dica: 'Entre uma descrição para o nome do imposto retido na fonte.'
    },
    {
      id: 2,
      nome: 'Categoria',
      dica: 'Selecione uma das seguintes opções na lista suspensa:<br><br>Nota fiscal: o cálculo do imposto retido na fonte é exibido na nota fiscal e registrado no lançamento contábil manual quando a nota fiscal é adicionada.<br><br>Pagamento: o cálculo do imposto retido na fonte é exibido na nota fiscal, mas registrado no lançamento contábil manual quando é criado por contas a receber com base nesta nota fiscal.'
    },
    {
      id: 3,
      nome: 'Taxa',
      dica: 'Entre a taxa do imposto a ser calculada'
    },
    {
      id: 4,
      nome: 'Tipo Básico',
      dica: 'Selecione:<br><br>Bruto (inclui IVA) ou Líquido.<br>Determina a partir de que valor o imposto retido na fonte será calculado.'
    },
    {
      id: 5,
      nome: '% valor Base',
      dica: 'Especifique a porcentagem do valor base que está sujeito ao imposto retido na fonte. O valor padrão é 100%.'
    },
    {
      id: 6,
      nome: 'Código Oficial',
      dica: 'Especifica o código oficial a ser reportado no relatório do imposto retido na fonte.'
    },
    {
      id: 7,
      nome: 'Conta',
      dica: 'Informe o código da conta contábil a ser registrado em lançamentos contábeis manuais relevantes para este código do imposto retido na fonte.'
    },
    {
      id: 8,
      nome: 'Tipo',
      dica: 'Especifique o tipo apropriado de imposto retido na fonte.'
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
        this.rowsImpostos = this.infoBasica[0]?.configuracao_Imposto_Retido_Fonte;
        this.formInfoService.patchInfoBasicaForm(this.formImpostos, this.infoBasica);
        console.log('dados recuperados onInit: ', this.infoBasica);
        this.isLoading = false;
      },
      (error) => {
        console.error('Erro ao recuperar dados', error);
        this.isLoading = false;
      }
    )
  }

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

    const configImpostoPOST = this.rowsImpostos.map(row => {
      if (this.addRowConfigImposto.includes(row)) {
        return {
          ...row,
          configuracao_Imposto_Retido_Fonteid: '0',
        }
      } else {
        return row;
      }
    });

    const apiData = {
      ...this.infoBasica[0],
      configuracao_Imposto_Retido_Fonte: configImpostoPOST,
    };

    this.http.post('/api/BBP', apiData, httpOptions).subscribe(
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

  deleteRow(row: configuracao_Imposto_Retido_Fonte) {
    const bbpid = sessionStorage.getItem('bbP_id'); // Supondo que bbP_DadosCTBID seja o valor de bbpid
    const vcode = row.configuracao_Imposto_Retido_Fonteid; // Use o valor apropriado de vcode
    const vtabela = '%40G2_BBP_CONFIMPREF'; // ou algum valor dinâmico, caso necessário
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
          this.rowsImpostos = this.rowsImpostos.filter(r => r !== row);
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

  postSDK(row: configuracao_Imposto_Retido_Fonte) {
    const payload = {
      nfTaxId: row.codigo_oficial,
      name: row.nome_imposto,
      vat: row.taxa,
      taxCreditControl: row.tipo
    };

    // URL de teste (você pode substituir pela URL correta)
    const postUrl = '/api/SAPSDK/TipodeImposto';

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