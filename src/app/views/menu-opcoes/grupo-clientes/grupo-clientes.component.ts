import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { MenuNavigationComponent } from '../../../components/menu-navigation/menu-navigation.component';
import { HeaderComponent } from '../../../components/header/header.component';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { CustomerFieldComponent } from '../../../components/customer-field/customer-field.component';
import { FormInfoService } from '../../../services/infobasica/form-info.service';
import { infoBasica } from '../../../models/infobasica/infobasica.model';
// Models
import { definir_grupos_clientes } from '../../../models/grupo-clientes/definir_grupos_clientes.model';

@Component({
  selector: 'app-grupo-clientes',
  standalone: true,
  imports: [MenuNavigationComponent, HeaderComponent, FormsModule, NgFor, NgIf, HttpClientModule, CustomerFieldComponent, ReactiveFormsModule],
  templateUrl: './grupo-clientes.component.html',
  styleUrls: ['./grupo-clientes.component.css']
})
export class GrupoClientesComponent implements OnInit {

  isLoading: boolean = true;

  formGrupoClientes: FormGroup;

  constructor(private http: HttpClient, private fb: FormBuilder, private formInfoService: FormInfoService) {
    this.formGrupoClientes = this.fb.group({
      definir_grupos_clientesid: [''],
      codgrupo: [''],
      nome_grupo: [''],
    });
  };

  // Linhas da Tabela
  rowsGrupoClientes: definir_grupos_clientes[] = [
    {
      definir_grupos_clientesid: '1',
      codgrupo: '',
      nome_grupo: '',
      selected: false
    }
  ];

  nextId = 2;

  addRowGrupoClientes() {
    const newRow: definir_grupos_clientes = {
      definir_grupos_clientesid: String(this.nextId++),
      codgrupo: '',
      nome_grupo: '',
      selected: false
    };
    this.rowsGrupoClientes = [...this.rowsGrupoClientes, newRow];
  }

  removeSelectedRowsGrupoClientes() {
    this.rowsGrupoClientes = this.rowsGrupoClientes.filter((row, index) => index === 0 || !row.selected);
  }

  toggleSelectAllGrupoClientes(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.rowsGrupoClientes.forEach((row, index) => {
      if (index !== 0) { // Não seleciona a primeira linha
        row.selected = isChecked;
      }
    });
  }

  trackByFnGrupoClientes(index: number, item: definir_grupos_clientes) {
    return item.definir_grupos_clientesid;
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
        this.rowsGrupoClientes = this.infoBasica[0]?.definir_grupos_clientes;
        this.formInfoService.patchInfoBasicaForm(this.formGrupoClientes, this.infoBasica);
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

    apiData.definir_grupos_clientes = this.rowsGrupoClientes;

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