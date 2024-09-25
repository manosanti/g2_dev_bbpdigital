import { FormInfoService } from './../../../services/infobasica/form-info.service';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../../components/header/header.component";
import { MenuNavigationComponent } from "../../../components/menu-navigation/menu-navigation.component";
import { NgIf, NgFor, NgClass, NgSwitchDefault, NgSwitchCase, NgSwitch } from '@angular/common';
import { CustomerFieldComponent } from '../../../components/customer-field/customer-field.component';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
// Models
import { definir_informacoes_cartoes } from './../../../models/definir_informacoes_cartoes/definir_informacoes_cartoes.model';
import { infoBasica } from '../../../models/infobasica/infobasica.model';

@Component({
  selector: 'app-informacoes-cartoes',
  standalone: true,
  imports: [HeaderComponent, CustomerFieldComponent, MenuNavigationComponent, NgIf, NgFor, NgClass, NgSwitchDefault, NgSwitchCase, NgSwitch, ReactiveFormsModule, HttpClientModule, FormsModule],
  templateUrl: './informacoes-cartoes.component.html',
  styleUrl: './informacoes-cartoes.component.css'
})
export class definir_informacoes_cartoesComponent implements OnInit {

  isLoading: boolean = false;

  constructor(private http: HttpClient, private fb: FormBuilder, private FormInfoService: FormInfoService) {
    this.formdefinir_informacoes_cartoes = this.fb.group({
      definir_informacoes_cartoesid: [''],
      nome_cartao: [''],
      tipo_cartao: [''],
      conta_contabil_cartao: [''],
      identificacao_empresa: [''],
      telefone_cartao: ['']
    });
  }

  public formdefinir_informacoes_cartoes: FormGroup;

  rows: definir_informacoes_cartoes[] = [
    {
      definir_informacoes_cartoesid: '1',
      nome_cartao: '',
      tipo_cartao: '',
      conta_contabil_cartao: '',
      identificacao_empresa: '',
      telefone_cartao: '',
      selected: false
    }
  ];

  nextId = 2;

  addRow() {
    const newRow: definir_informacoes_cartoes = {
      definir_informacoes_cartoesid: String(this.nextId++),
      nome_cartao: '',
      tipo_cartao: '',
      conta_contabil_cartao: '',
      identificacao_empresa: '',
      telefone_cartao: '',
      selected: false
    };
    this.rows = [...this.rows, newRow];
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

  trackByFn(index: number, item: definir_informacoes_cartoes) {
    return item.definir_informacoes_cartoesid;
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

    this.http.get<infoBasica[]>(`/api/BBP/BBPID?bbpid=${bbP_id}`, httpOptions).subscribe(
      (data: infoBasica[]) => {
        this.infoBasica = data;
        this.rows = this.infoBasica[0]?.definir_informacoes_cartoes;
        this.FormInfoService.patchInfoBasicaForm(this.formdefinir_informacoes_cartoes, this.infoBasica);
        console.log('dados recuperados onInit: ', this.infoBasica);
        this.isLoading = false;
      },
      (error) => {
        console.error('Erro ao recuperar dados', error);
        this.isLoading = false;
      }
    )
  };

  // Botão de envio dos dados do formulário para o back-end
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

    apiData.definir_informacoes_cartoes = this.rows;

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
