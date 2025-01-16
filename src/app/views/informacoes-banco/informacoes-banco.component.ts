import { FormInfoService } from './../../services/infobasica/form-info.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { MenuNavigationComponent } from "../../components/menu-navigation/menu-navigation.component";
import { HeaderComponent } from "../../components/header/header.component";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CustomerFieldComponent } from '../../components/customer-field/customer-field.component';

// Models
import { Tip } from '../../models/infobasica/tip.model';
import { definir_Informacoes_banco } from '../../models/info-banco/info-banco.model';
import { infoBasica } from '../../models/infobasica/infobasica.model';
// Services
import { AllowOnlyNumbersService } from '../../services/allowNumbers.service';

@Component({
  selector: 'app-informacoes-banco',
  standalone: true,
  imports: [MenuNavigationComponent, CustomerFieldComponent, HeaderComponent, FormsModule, NgFor, NgIf, ReactiveFormsModule, HttpClientModule],
  templateUrl: './informacoes-banco.component.html',
  styleUrls: ['./informacoes-banco.component.css']
})
export class InformacoesBancoComponent implements OnInit {
  allowOnlyNumbers(event: KeyboardEvent): void {
    this.AllowOnlyNumbers.allowOnlyNumbers(event);
  }

  isLoading: boolean = true;

  formInfoBanco: FormGroup;

  private generatedIds: Set<string> = new Set();

  private generateUniqueId(): string {
    let newId: string;
    do {
      // Gera um ID aleatório
      newId = Math.random().toString(36).substring(2, 15);
    } while (this.generatedIds.has(newId)); // Verifica se o ID já foi gerado

    this.generatedIds.add(newId);
    return newId;
  }

  // Arrays de Tabelas
  alertaAtividadeRows: definir_Informacoes_banco[] = [];

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

  trackByFnAlertaAtividade(index: number, item: definir_Informacoes_banco) {
    return item.definir_Informacoes_bancoid;
  }

  constructor(private http: HttpClient, private fb: FormBuilder, private formInfoService: FormInfoService, private AllowOnlyNumbers: AllowOnlyNumbersService) {
    this.formInfoBanco = this.fb.group({
      // definir_Informacoes_bancoid: ['', Validators.required],
      codigobanco: ['', Validators.required],
      pais: ['', Validators.required],
      agenciafilial: ['', Validators.required],
      digitoagencia: ['', Validators.required],
      numerodaConta: ['', Validators.required],
      contacontabil: ['', Validators.required],
      contacontprovisoria: ['', Validators.required]
    });
  }

  rowsAlertaAtividade: definir_Informacoes_banco[] = [
    {
      // definir_Informacoes_banco
      definir_Informacoes_bancoid: '',
      codigobanco: '',
      pais: '',
      agenciafilial: '',
      digitoagencia: '',
      numerodaConta: '',
      contacontabil: '',
      contacontprovisoria: ''
    }
  ];

  novasRowsAlertaAtividade: definir_Informacoes_banco[] = [];
  addRowAlertaAtividade() {
    const newRow: definir_Informacoes_banco = {
      definir_Informacoes_bancoid: this.generateUniqueId(),
      codigobanco: '',
      pais: '',
      agenciafilial: '',
      digitoagencia: '',
      numerodaConta: '',
      contacontabil: '',
      contacontprovisoria: ''
    };
    this.alertaAtividadeRows = [...this.alertaAtividadeRows, newRow]
    this.novasRowsAlertaAtividade.push(newRow);
    console.log(newRow);
  }

  removeSelectedRowsAlertaAtividade() {
    this.rowsAlertaAtividade = this.rowsAlertaAtividade.filter((row, index) => index === 0 || !row.selected);
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

  infoBasica: infoBasica[] = [];

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
        this.alertaAtividadeRows = this.infoBasica[0]?.definir_Informacoes_banco;
        this.formInfoService.patchInfoBasicaForm(this.formInfoBanco, this.infoBasica);
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
      return;
    }

    // Prepare apenas as novas linhas para envio
    const definir_Informacoes_bancoPOST = this.alertaAtividadeRows.map(row => {
      if (this.novasRowsAlertaAtividade.includes(row)) {
        return {
          ...row,
          definir_Informacoes_bancoid: '0',
        }
      } else {
        return row;
      }
    });
    // const definir_Informacoes_bancoPOST = this.novasRowsAlertaAtividade.map(row => ({
    //   ...row,
    //   definir_Informacoes_bancoid: '0',
    // }));

    const apiData = { ...this.infoBasica[0], definir_Informacoes_banco: definir_Informacoes_bancoPOST };

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

  deleteRow(row: definir_Informacoes_banco) {
    const bbpid = localStorage.getItem('bbP_id');
    const vcode = row.definir_Informacoes_bancoid;
    const vtabela = '%40G2_BBP_DINFB';
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
          this.alertaAtividadeRows = this.alertaAtividadeRows.filter(r => r !== row);
        }
      },
      (error) => {
        console.error('Erro ao deletar a linha', error);
      }
    );
  }
}