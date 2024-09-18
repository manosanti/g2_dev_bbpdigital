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
import { configsGerais } from '../../models/configs-gerais/configsGerais.model';
import { definir_Informacoes_banco } from '../../models/info-banco/info-banco.model';
import { infoBasica } from '../../models/infobasica/infobasica.model';

@Component({
  selector: 'app-informacoes-banco',
  standalone: true,
  imports: [MenuNavigationComponent, CustomerFieldComponent, HeaderComponent, FormsModule, NgFor, NgIf, ReactiveFormsModule, HttpClientModule],
  templateUrl: './informacoes-banco.component.html',
  styleUrls: ['./informacoes-banco.component.css']
})
export class InformacoesBancoComponent implements OnInit {
  isLoading: boolean = true;

  formInfoBanco: FormGroup;

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

  constructor(private http: HttpClient, private fb: FormBuilder, private formInfoService: FormInfoService) {
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
      definir_Informacoes_bancoid: '1',
      codigobanco: '',
      pais: '',
      agenciafilial: '',
      digitoagencia: '',
      numerodaConta: '',
      contacontabil: '',
      contacontprovisoria: ''
    }
  ];

  nextId = 2;

  addRowAlertaAtividade() {
    const newRow: definir_Informacoes_banco = {
      definir_Informacoes_bancoid: '1',
      codigobanco: '',
      pais: '',
      agenciafilial: '',
      digitoagencia: '',
      numerodaConta: '',
      contacontabil: '',
      contacontprovisoria: ''
    };
    this.rowsAlertaAtividade = [...this.rowsAlertaAtividade, newRow];
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

  // Méotdo GET
  configsGerais: configsGerais[] = [];
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
        this.rowsAlertaAtividade = this.infoBasica[0]?.definir_Informacoes_banco;
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
    // Resgatar o bbP_id + cardCode do sessionStorage
    // const configsGerais = this.formInfoBanco.value;
    const bbP_id = sessionStorage.getItem('bbP_id');
    const cardCode = sessionStorage.getItem('cardCode');
    const token = sessionStorage.getItem('token');
    // const cardCode = sessionStorage.getItem('cardCode');

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

    const apiData = { ...this.infoBasica[0] };

    apiData.definir_Informacoes_banco = this.rowsAlertaAtividade;

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
}