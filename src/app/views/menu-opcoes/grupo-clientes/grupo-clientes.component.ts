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
    this.formGrupoClientes = this.fb.group({
      definir_grupos_clientesid: [''],
      codgrupo: [''],
      nome_grupo: [''],
    });
  };

  // Linhas da Tabela
  rowsGrupoClientes: definir_grupos_clientes[] = [
    {
      definir_grupos_clientesid: this.generateUniqueId(),
      codgrupo: '',
      nome_grupo: '',
      selected: false
    }
  ];

  addNovaRowGrupoClientes: definir_grupos_clientes[] = [];
  addRowGrupoClientes() {
    const newRow: definir_grupos_clientes = {
      definir_grupos_clientesid: this.generateUniqueId(),
      codgrupo: '',
      nome_grupo: '',
      selected: false
    };
    this.rowsGrupoClientes = [...this.rowsGrupoClientes, newRow];
    this.addNovaRowGrupoClientes.push(newRow)
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

    const grupoClientesPOST = this.rowsGrupoClientes.map(row => {
      if (this.addNovaRowGrupoClientes.includes(row)) {
        return {
          ...row,
          definir_grupos_clientesid: '0'
        };
      } else {
        return row;
      }
    });

    const apiData = {
      ...this.infoBasica[0],
      definir_grupos_clientes: grupoClientesPOST,
    };

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
  deleteRowGrupoClientes(row: definir_grupos_clientes) {
    const bbpid = sessionStorage.getItem('bbP_id'); // Supondo que bbP_DadosCTBID seja o valor de bbpid
    const vcode = row.definir_grupos_clientesid; // Use o valor apropriado de vcode
    const vtabela = '%40G2_BBP_DEFGRCLI'; // ou algum valor dinâmico, caso necessário
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
          this.rowsGrupoClientes = this.rowsGrupoClientes.filter(r => r !== row);
        }
      },
      (error) => {
        console.error('Erro ao deletar a linha', error);
      }
    );
  }

  // Função para fazer o POST individual por linha
  postGrupo(row: definir_grupos_clientes) {
    const bbP_id = sessionStorage.getItem('bbP_id');
    const token = sessionStorage.getItem('token');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }),
    };

    // Estrutura do objeto de acordo com a solicitação
    const payload = {
      name: row.nome_grupo, // O nome do grupo vindo da linha
      type: 'C'             // Tipo sempre "C"
    };

    // URL de teste (você pode substituir pela URL correta)
    const postUrl = '/api/SAPSDK/GrupoClientes'; // Substitua pela URL real

    this.http.post(postUrl, payload, httpOptions).subscribe(
      (response) => {
        console.log('POST bem-sucedido para o grupo:', row.nome_grupo, response);
      },
      (error) => {
        console.error('Erro ao fazer POST para o grupo:', row.nome_grupo, error);
      }
    );
  }
}