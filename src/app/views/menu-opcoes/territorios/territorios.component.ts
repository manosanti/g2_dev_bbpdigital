import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { MenuNavigationComponent } from '../../../components/menu-navigation/menu-navigation.component';
import { HeaderComponent } from '../../../components/header/header.component';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { CustomerFieldComponent } from '../../../components/customer-field/customer-field.component';
// Models
import { definir_Territorios } from '../../../models/definir_Territorios/definir_Territorios.model';
import { infoBasica } from '../../../models/infobasica/infobasica.model';
import { FormInfoService } from '../../../services/infobasica/form-info.service';

@Component({
  selector: 'app-territorios',
  standalone: true,
  imports: [MenuNavigationComponent, HeaderComponent, FormsModule, NgFor, HttpClientModule, CustomerFieldComponent, ReactiveFormsModule, NgIf],
  templateUrl: './territorios.component.html',
  styleUrl: './territorios.component.css'
})
export class TerritoriosComponent implements OnInit {

  isLoading: boolean = true;

  formTerritorios: FormGroup;

  constructor(private http: HttpClient, private fb: FormBuilder, private formInfoService: FormInfoService) {
    this.formTerritorios = this.fb.group({
      definir_Territoriosid: ['', Validators.required],
      posicao: ['', Validators.required],
      nome_territorio: ['', Validators.required],
    });
  }

  // Linhas da Tabela
  rowsTerritorios: definir_Territorios[] = [
    {
      definir_Territoriosid: '1',
      posicao: '',
      nome_territorio: '',
      selected: false,
    }
  ];

  addRowsTerritorios() {
    const newRow: definir_Territorios = {
      definir_Territoriosid: String(this.nextId),
      posicao: '',
      nome_territorio: '',
      selected: false,
    }
    this.rowsTerritorios = [...this.rowsTerritorios, newRow];
    this.nextId++;
  }

  removeSelectedRowsTerritorios() {
    this.rowsTerritorios = this.rowsTerritorios.filter(row => !row.selected);
  }

  toggleSelectedAllTerritorios(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.rowsTerritorios.forEach((row, index) => {
      if (index !== 0) {
        row.selected = isChecked;
      }
    });
  }

  trackByFnTerritorios(index: number, item: definir_Territorios) {
    return item.definir_Territoriosid;
  }

  nextId = 2;

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
        this.rowsTerritorios = this.infoBasica[0]?.definir_Territorios;
        this.formInfoService.patchInfoBasicaForm(this.formTerritorios, this.infoBasica);
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
    const bbP_id = sessionStorage.getItem('bbP_id');
    const cardCode = sessionStorage.getItem('cardCode');
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

    const apiData = { ...this.infoBasica[0] };

    apiData.definir_Territorios = this.rowsTerritorios;

    this.http.post('/api/BBP', apiData, httpOptions).subscribe(
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
}