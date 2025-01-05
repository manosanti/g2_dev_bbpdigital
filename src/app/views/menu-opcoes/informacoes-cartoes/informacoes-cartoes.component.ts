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
  rowsInfoCartao: definir_informacoes_cartoes[] = [];
  isLoading: boolean = false;

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

  formdefinir_informacoes_cartoes: FormGroup;

  rows: definir_informacoes_cartoes[] = [
    {
      definir_informacoes_cartoesid: this.generateUniqueId(),
      nome_cartao: '',
      tipo_cartao: '',
      conta_contabil_cartao: '',
      identificacao_empresa: '',
      telefone_cartao: '',
      selected: false
    }
  ];

  addNovaRow: definir_informacoes_cartoes[] = [];
  addRow() {
    const newRow: definir_informacoes_cartoes = {
      definir_informacoes_cartoesid: this.generateUniqueId(),
      nome_cartao: '',
      tipo_cartao: '',
      conta_contabil_cartao: '',
      identificacao_empresa: '',
      telefone_cartao: '',
      selected: false
    };
    this.rows = [...this.rows, newRow];
    this.addNovaRow.push(newRow)
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

    this.http.get<infoBasica[]>(`http://bbpdigital.g2tecnologia.com.br:8021/BBP/BBPID?bbpid=${bbP_id}`, httpOptions).subscribe(
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

    const infoCartoesPOST = this.rows.map(row => {
      if (this.addNovaRow.includes(row)) {
        return {
          ...row,
          definir_informacoes_cartoesid: '0',
        }
      } else {
        return row;
      }
    })

    const apiData = {
      ...this.infoBasica[0],
      definir_informacoes_cartoes: infoCartoesPOST,
    };

    // apiData.definir_informacoes_cartoes = this.rows;

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

  deleteRow(row: definir_informacoes_cartoes) {
    const bbpid = sessionStorage.getItem('bbP_id'); // Supondo que bbP_DadosCTBID seja o valor de bbpid
    const vcode = row.definir_informacoes_cartoesid; // Use o valor apropriado de vcode
    const vtabela = '%40G2_BBP_DEFINFCARTA'; // ou algum valor dinâmico, caso necessário
    const token = sessionStorage.getItem('token')

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
