import { infoBasica } from './../../../models/infobasica/infobasica.model';
import { FormInfoService } from './../../../services/infobasica/form-info.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { MenuNavigationComponent } from '../../../components/menu-navigation/menu-navigation.component';
import { HeaderComponent } from '../../../components/header/header.component';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { CustomerFieldComponent } from '../../../components/customer-field/customer-field.component';
// Models
import { definir_grupos_fornecedores } from './../../../models/grupo-fornecedores/definir_grupos_fornecedores.model';

@Component({
  selector: 'app-grupo-fornecedores',
  standalone: true,
  imports: [MenuNavigationComponent, HeaderComponent, FormsModule, NgFor, HttpClientModule, CustomerFieldComponent, NgIf, ReactiveFormsModule],
  templateUrl: './grupo-fornecedores.component.html',
  styleUrl: './grupo-fornecedores.component.css'
})
export class GrupoFornecedoresComponent implements OnInit {

  isLoading: boolean = true;

  constructor(private http: HttpClient, private fb: FormBuilder, private formInfoService: FormInfoService) {
    this.formGrupoFornecedores = this.fb.group({
      definir_grupos_fornecedoresid: [''],
      codgrupo: [''],
      nome_grupo: [''],
    });
  }

  formGrupoFornecedores: FormGroup;

  rowsGrupoFornecedores: definir_grupos_fornecedores[] = [
    {
      definir_grupos_fornecedoresid: '1',
      codgrupo: '',
      nome_grupo: '',
      selected: false
    }
  ]

  nextId = 2;

  addRowGrupoFornecedores() {
    const newRow: definir_grupos_fornecedores = {
      definir_grupos_fornecedoresid: String(this.nextId++),
      codgrupo: '',
      nome_grupo: '',
      selected: false
    };
    this.rowsGrupoFornecedores = [...this.rowsGrupoFornecedores, newRow];
  }

  removeSelectedRowsGrupoFornecedores() {
    this.rowsGrupoFornecedores = this.rowsGrupoFornecedores.filter((row, index) => index === 0 || !row.selected);
  }

  toggleSelectAllGrupoFornecedores(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.rowsGrupoFornecedores.forEach((row, index) => {
      if (index !== 0) {
        row.selected = isChecked;
      }
    });
  }

  trackByFnGrupoFornecedores(index: number, item: definir_grupos_fornecedores) {
    return item.definir_grupos_fornecedoresid;
  }

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

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    };

    this.isLoading = true;

    this.http.get<infoBasica[]>(`/api/BBP/BBPID?bbpid=${bbP_id}`, httpOptions).subscribe(
      (data: infoBasica[]) => {
        this.infoBasica = data;
        this.rowsGrupoFornecedores = this.infoBasica[0]?.definir_grupos_fornecedores || [];
        // GET (isolado) dos campos a serem resgatados
        this.formInfoService.patchInfoBasicaForm(this.formGrupoFornecedores, this.infoBasica);
        this.isLoading = false;
        console.log('dados recuperados onInit: ', this.infoBasica);
      },
      (error) => {
        console.error('Erro ao recuperar dados', error);
        this.isLoading = false;
      }
    );
  }

  // Botão de envio dos dados do formulário para o back-end
  onSubmit(): void {
    // Obter Valores do Formulário + Valores do SessionStorage
    const grupoFornecedores = this.formGrupoFornecedores.value;
    const bbP_id = sessionStorage.getItem('bbP_id');
    const cardCode = sessionStorage.getItem('cardCode');
    const token = sessionStorage.getItem('token');

    // Clonar o objeto recuperado do GET
    const apiData = { ...this.infoBasica[0] };

    // Atualizar apenas o campo 'rowsGrupoFornecedores' com os novos valores
    apiData.definir_grupos_fornecedores = this.rowsGrupoFornecedores;

    // Dados enviados para o back-end
    const newGrupoFornecedores = {

    }

    console.log(this.rowsGrupoFornecedores);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    };

    // Método POST para enviar os dados para o back-end
    this.http.post('/api/BBP', apiData, httpOptions).subscribe(response => {
      console.log('Dados enviados com sucesso', response);
      console.log('APIDATA:', apiData);
    }, error => {
      console.error('Erro ao enviar dados', error);
    });
  }
}
