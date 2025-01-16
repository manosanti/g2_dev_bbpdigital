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
    this.formGrupoFornecedores = this.fb.group({
      definir_grupos_fornecedoresid: [''],
      codgrupo: [''],
      nome_grupo: [''],
    });
  }

  formGrupoFornecedores: FormGroup;

  rowsGrupoFornecedores: definir_grupos_fornecedores[] = [
    {
      definir_grupos_fornecedoresid: this.generateUniqueId(),
      codgrupo: '',
      nome_grupo: '',
      selected: false
    }
  ]

  nextId = 2;

  addNovaRowGrupoFornecedores: definir_grupos_fornecedores[] = [];
  addRowGrupoFornecedores() {
    const newRow: definir_grupos_fornecedores = {
      definir_grupos_fornecedoresid: this.generateUniqueId(),
      codgrupo: '',
      nome_grupo: '',
      selected: false
    };
    this.rowsGrupoFornecedores = [...this.rowsGrupoFornecedores, newRow];
    this.addNovaRowGrupoFornecedores.push(newRow);
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
    const token = localStorage.getItem('token');
    const bbP_id = localStorage.getItem('bbP_id');

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

    this.http.get<infoBasica[]>(`http://bbpdigital.g2tecnologia.com.br:8021/BBP/BBPID?bbpid=${bbP_id}`, httpOptions).subscribe(
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
    const bbP_id = localStorage.getItem('bbP_id');
    const token = localStorage.getItem('token');

    if (!bbP_id) {
      console.error('bbP_id não encontrado no localStorage. Por favor, verifique se o valor está sendo armazenado corretamente.');
      return; // Interrompe a execução se o bbP_id não estiver presente
    }

    const grupoFornecedoresPOST = this.rowsGrupoFornecedores.map(row => {
      if (this.addNovaRowGrupoFornecedores.includes(row)) {
        return {
          ...row,
          definir_grupos_fornecedoresid: '0',
        }
      } else {
        return row;
      }
    });

    // Clonar o objeto recuperado do GET
    const apiData = { ...this.infoBasica[0],
      definir_grupos_fornecedores: grupoFornecedoresPOST
     };

    this.isLoading = true;

    console.log(this.rowsGrupoFornecedores);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    };

    // Método POST para enviar os dados para o back-end
    this.http.post('http://bbpdigital.g2tecnologia.com.br:8021/BBP', apiData, httpOptions).subscribe(response => {
      console.log('Dados enviados com sucesso', response);
      console.log('APIDATA:', apiData);
      this.isLoading = false;
    }, error => {
      console.error('Erro ao enviar dados', error);
      this.isLoading = false;
    });
  }
  
  token = localStorage.getItem('token')
  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}`}),};

  deleteRowGrupoFornecedores(row: definir_grupos_fornecedores) {
    const bbpid = localStorage.getItem('bbP_id'); // Supondo que bbP_DadosCTBID seja o valor de bbpid
    const vcode = row.definir_grupos_fornecedoresid; // Use o valor apropriado de vcode
    const vtabela = '%40G2_BBP_DEFGRFOR';

    
    const deleteUrl = `http://bbpdigital.g2tecnologia.com.br:8021/BBP/BBP_DEL_SUBTAB?bbpid=${bbpid}&vcode=${vcode}&vtabela=${vtabela}`;

    this.http.delete(deleteUrl, this.httpOptions).subscribe(
      (response) => {
        console.log('Resposta da API:', response); // Verifique o que a API está retornando
        if (response) {
          this.rowsGrupoFornecedores = this.rowsGrupoFornecedores.filter(r => r !== row);
        }
      },
      (error) => {
        console.error('Erro ao deletar a linha', error);
      }
    );
  }

  postGrupo(row: definir_grupos_fornecedores) {
    // Estrutura do objeto de acordo com a solicitação
    const payload = {
      name: row.nome_grupo, // O nome do grupo vindo da linha
      type: 'C'             // Tipo sempre "C"
    };

    // URL de teste (você pode substituir pela URL correta)
    const postUrl = 'http://bbpdigital.g2tecnologia.com.br:8021/SAPSDK/GrupoClientes'; // Substitua pela URL real

    this.http.post(postUrl, payload, this.httpOptions).subscribe(
      (response) => {
        console.log('POST bem-sucedido para o grupo:', row.nome_grupo, response);
      },
      (error) => {
        console.error('Erro ao fazer POST para o grupo:', row.nome_grupo, error);
      }
    );
  }
}
