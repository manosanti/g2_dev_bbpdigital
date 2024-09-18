import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { MenuNavigationComponent } from '../../../components/menu-navigation/menu-navigation.component';
import { HeaderComponent } from '../../../components/header/header.component';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { CustomerFieldComponent } from '../../../components/customer-field/customer-field.component';
import { FormBuilder } from '@angular/forms';
// Models
import { definir_tipos_expedicao } from '../../../models/definir_tipos_expedicao/definir_tipos_expedicao.model';
import { infoBasica } from '../../../models/infobasica/infobasica.model';
import { FormInfoService } from '../../../services/infobasica/form-info.service';

@Component({
  selector: 'app-tipos-expedicao',
  standalone: true,
  imports: [MenuNavigationComponent, HeaderComponent, FormsModule, NgFor, HttpClientModule, CustomerFieldComponent, ReactiveFormsModule, NgIf],
  templateUrl: './tipos-expedicao.component.html',
  styleUrl: './tipos-expedicao.component.css'
})
export class TiposExpedicaoComponent implements OnInit {

  isLoading: boolean = true;

  constructor(private http: HttpClient, private fb: FormBuilder, private formInfoService: FormInfoService) {
    this.formTiposExpedicao = this.fb.group({
      definir_tipos_expedicaoid: [''],
      tipo_expedicao: [''],
      web_site_expedicao: [''],
    });
  }

  formTiposExpedicao: FormGroup;

  rowsTipoExpedicao: definir_tipos_expedicao[] = [
    {
      definir_tipos_expedicaoid: '1',
      tipo_expedicao: '',
      web_site_expedicao: '',
      selected: false
    }
  ];

  nextId = 2;



  addRowTiposExpedicao() {
    const newRow: definir_tipos_expedicao = {
      definir_tipos_expedicaoid: String(this.nextId++),
      tipo_expedicao: '',
      web_site_expedicao: '',
      selected: false
    };
    this.rowsTipoExpedicao = [...this.rowsTipoExpedicao, newRow];
  }

  removeSelectedRowsTipoExpedicao() {
    this.rowsTipoExpedicao = this.rowsTipoExpedicao.filter((row, index) => index === 0 || !row.selected);
  }

  toggleSelectAllTipoExpedicao(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.rowsTipoExpedicao.forEach((row, index) => {
      if (index !== 0) { // Não seleciona a primeira linha
        row.selected = isChecked;
      }
    });
  }

  trackByFnTipoExpedicao(index: number, item: definir_tipos_expedicao) {
    return item.definir_tipos_expedicaoid;
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
        this.rowsTipoExpedicao = this.infoBasica[0]?.definir_tipos_expedicao || [];
        // GET (isolado) dos campos a serem resgatados
        this.formInfoService.patchInfoBasicaForm(this.formTiposExpedicao, this.infoBasica);
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
    const tiposExpedicao = this.formTiposExpedicao.value;
    const bbP_id = sessionStorage.getItem('bbP_id');
    const cardCode = sessionStorage.getItem('cardCode');
    const token = sessionStorage.getItem('token');

    // Dados enviados para o back-end
    // const newTiposExpedicao = {
    //   bbP_id: bbP_id,
    //   cardCode: cardCode,
    //   definir_tipos_expedicao: this.rowsTipoExpedicao
    // }

    // Clonar o objeto recuperado do GET
    const apiData = { ...this.infoBasica[0] };

    // Atualizar valor das tabelas
    apiData.definir_tipos_expedicao = this.rowsTipoExpedicao;

    console.log(this.rowsTipoExpedicao)

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    this.http.post('/api/BBP', apiData, httpOptions).subscribe(response => {
      console.log('Dados enviados com sucesso', response);
      console.log('Dados enviados:', apiData);
    }, error => {
      console.error('Erro ao enviar dados', error);
    });
  }
}
