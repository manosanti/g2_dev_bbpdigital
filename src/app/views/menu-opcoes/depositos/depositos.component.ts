import { infoBasica } from './../../../models/infobasica/infobasica.model';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { MenuNavigationComponent } from '../../../components/menu-navigation/menu-navigation.component';
import { CustomerFieldComponent } from '../../../components/customer-field/customer-field.component';
import { HeaderComponent } from '../../../components/header/header.component';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
// Models
import { Tip } from './../../../models/infobasica/tip.model';
import { defina_Depositos } from '../../../models/depositos/depositos.model';
// Services
import { FormInfoService } from './../../../services/infobasica/form-info.service';

@Component({
  selector: 'app-depositos',
  standalone: true,
  imports: [MenuNavigationComponent, CustomerFieldComponent, HeaderComponent, FormsModule, NgFor, NgIf, ReactiveFormsModule, FormsModule, HttpClientModule, NgFor],
  templateUrl: './depositos.component.html',
  styleUrl: './depositos.component.css'
})
export class DepositosComponent implements OnInit {
  isLoading: boolean = true;

  infoBasica: infoBasica[] = [];

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

  rows: defina_Depositos[] = [
    {
      defina_Depositosid: this.generateUniqueId(),
      codigodeposito: '',
      nome: '',
      conta_despesa: '',
      propriet: '',
      local: '',
      utilizado_mrp: '',
      selected: false,
    }
  ];

  addNovaRow: defina_Depositos[] = [];
  addRow() {
    const newRow: defina_Depositos = {
      defina_Depositosid: this.generateUniqueId(),
      codigodeposito: '',
      nome: '',
      conta_despesa: '',
      propriet: '',
      local: '',
      utilizado_mrp: '',
    };
    this.rows = [...this.rows, newRow];
    this.addNovaRow.push(newRow);
  }

  removeSelectedRows() {
    this.rows = this.rows.filter((row, index) => index === 0 || !row.selected);
  }

  toggleSelectAll(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.rows.forEach((row, index) => {
      if (index !== 0) { // Não seleciona a primeira linha
        row.selected = isChecked;
      }
    });
  }

  trackByFn(index: number, item: defina_Depositos) {
    return item.defina_Depositosid;
  }

  formDepositos: FormGroup;

  constructor(private http: HttpClient, private fb: FormBuilder, private formInfoService: FormInfoService) {
    this.formDepositos = this.fb.group({
      defina_Depositosid: ['', Validators.required],
      codigodeposito: ['', Validators.required],
      nome: ['', Validators.required],
      conta_despesa: ['', Validators.required],
      propriet: ['', Validators.required],
      local: ['', Validators.required],
      utilizado_mrp: ['', Validators.required]
    });
  }

  // Dicas

  tipsObj: Tip[] = [
    {
      id: 1,
      nome: 'Proprietário',
      dica: 'Especifique o código de proprietário. O SAP Business One oferece três opções:<br><br>Propriedade do item da empresa (valor padrão) – propriedade do item da empresa no seu próprio depósito<br><br>Depósito de terceiros – propriedade do item da empresa no depósito de terceiros<br><br>Itens de terceiros na minha propriedade – propriedade do item de terceiros no depósito da empresa'
    },
    {
      id: 2,
      nome: 'Local',
      dica: 'Vários depósitos podem ser agrupados por local'
    },
    {
      id: 3,
      nome: 'Utilizado no MRP',
      dica: 'Permite que o depósito seja automaticamente envolvido no processo de MRP. Se você desmarcar este campo de seleção e o campo de seleção Envio direto, este depósito se tornará um depósito não liquidável. Quando você executa o assistente MRP, a aplicação não seleciona por padrão os depósitos não liquidáveis, mas você pode incluir um depósito não liquidável manualmente à execução MRP.'
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

  ngOnInit(): void {
    const bbP_id = localStorage.getItem('bbP_id');
    const token = localStorage.getItem('token');

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
        this.rows = this.infoBasica[0]?.defina_Depositos || [];
        this.formInfoService.patchInfoBasicaForm(this.formDepositos, this.infoBasica);
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

    const bbP_id = localStorage.getItem('bbP_id');
    const token = localStorage.getItem('token');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    };

    if (!bbP_id) {
      console.error('bbP_id não encontrado no localStorage. Por favor, verifique se o valor está sendo armazenado corretamente.');
      return; // Interrompe a execução se o bbP_id não estiver presente
    }

    const depositosPOST = this.rows.map(row => {
      if (this.addNovaRow.includes(row)) {
        return {
          ...row,
          defina_Depositosid: '0',
        }
      } else {
        return row;
      }
    });

    const apiData = { ...this.infoBasica[0],
      defina_depositos: depositosPOST,
     };

    // apiData.defina_Depositos = this.rows;

    this.http.post('http://bbpdigital.g2tecnologia.com.br:8021/BBP', apiData, httpOptions).subscribe(
      response => {
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

  deleteRowDepositos(row: defina_Depositos) {
    const bbpid = localStorage.getItem('bbP_id'); // Supondo que bbP_DadosCTBID seja o valor de bbpid
    const vcode = row.defina_Depositosid; // Use o valor apropriado de vcode
    const vtabela = '%40G2_BBP_DEFDEP'; // ou algum valor dinâmico, caso necessário
    const token = localStorage.getItem('token')

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
