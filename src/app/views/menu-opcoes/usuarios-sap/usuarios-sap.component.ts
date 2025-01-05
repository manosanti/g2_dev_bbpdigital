import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { MenuNavigationComponent } from '../../../components/menu-navigation/menu-navigation.component';
import { HeaderComponent } from '../../../components/header/header.component';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CustomerFieldComponent } from '../../../components/customer-field/customer-field.component';
// Models
import { Tip } from '../../../models/infobasica/tip.model';
import { definir_usuario_senhas } from '../../../models/usuarios-SAP/definir_usuario_senhas.model';
import { api_objects } from '../../../models/api_objects.model';
import { infoBasica } from '../../../models/infobasica/infobasica.model';
import { FormInfoService } from '../../../services/infobasica/form-info.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-usuarios-sap',
  standalone: true,
  imports: [MenuNavigationComponent, CustomerFieldComponent, HeaderComponent, FormsModule, NgFor, NgIf, HttpClientModule, ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './usuarios-sap.component.html',
  styleUrl: './usuarios-sap.component.css',
  providers: [provideNgxMask({})],
})
export class UsuariosSapComponent implements OnInit {

  isLoading: boolean = false;
  formUsuariosSenhas: FormGroup;

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
    this.formUsuariosSenhas = this.fb.group({
      super_usuario: ['', Validators.required],
      // codusuario: ['', Validators.required],
      nome_usuario: ['', Validators.required],
      email: ['', Validators.required],
      celular: ['', Validators.required],
      filial_departamento: ['', Validators.required],
      senha: ['', Validators.required],
    });
  }

  infoBasica: infoBasica[] = [];

  // Tabela de Dados
  rowsUsuariosSenhas: definir_usuario_senhas[] = [
    {
      definir_usuario_senhasid: this.generateUniqueId(),
      super_usuario: '',
      // codusuario: '',
      nome_usuario: '',
      email: '',
      celular: '',
      filial_departamento: '',
      senha: '',
      selected: false,
    }
  ]

  addNovaRowUsuariosSenhas: definir_usuario_senhas[] = [];
  addRowsUsuariosSenhas() {
    const newRow: definir_usuario_senhas = {
      definir_usuario_senhasid: this.generateUniqueId(),
      super_usuario: '',
      // codusuario: '',
      nome_usuario: '',
      email: '',
      celular: '',
      filial_departamento: '',
      senha: '',
      selected: false,
    };
    this.rowsUsuariosSenhas = [...this.rowsUsuariosSenhas, newRow];
    this.addNovaRowUsuariosSenhas.push(newRow)
  }

  removeSelectedRowUsuariosSenhas() {
    this.rowsUsuariosSenhas = this.rowsUsuariosSenhas.filter(row => !row.selected);
  }

  toggleSelectAllUsuariosSenhas(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.rowsUsuariosSenhas.forEach((row, index) => {
      if (index !== 0) {
        row.selected = isChecked;
      }
    });
  }

  trackByFnUsuariosSenhas(index: number, item: definir_usuario_senhas) {
    return item.definir_usuario_senhasid;
  }

  // Dicas
  tipsObj: Tip[] = [
    {
      id: 1,
      nome: 'Super Usuário',
      dica: 'Superusuário:<br>Selecione esta opção para especificar o usuário como superusuário.<br><br>Um superusuário:<br>pode acessar todas as janelas e executar todas as funções no SAP Business One pode limitar as autorizações dos usuários que não são superusuários.'
    },
    {
      id: 2,
      nome: 'Código Usuário',
      dica: 'Código do usuário:<br>Especifique um código unívoco, até 8 caracteres, para o usuário efetuar logon no SAP Business One.<br>O código é dependente de minúsculas/maiúsculas e, assim que for gravado, não pode ser modificado.<br><br>Nota:<br>O código não deve conter um asterisco (*).'
    },
    {
      id: 3,
      nome: 'Nome',
      dica: 'Nome do usuário Especifique um nome do usuário até 155 caracteres. O nome aparece na parte superior do menu principal e é editável.'
    },
    {
      id: 4,
      nome: 'Senha',
      dica: 'Senha: Mínimo de 4 caracteres'
    },
  ]

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
    if (!clickedElement.closest('.thActive')) {
      this.activeTipId = null;
    }
  }

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
        this.rowsUsuariosSenhas = this.infoBasica[0]?.definir_usuario_senhas;
        this.formInfoService.patchInfoBasicaForm(this.formUsuariosSenhas, this.infoBasica);
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

    const usuariosSAPPOST = this.rowsUsuariosSenhas.map(row => {
      if(this.addNovaRowUsuariosSenhas.includes(row)) {
        return {
          ...row,
          definir_usuario_senhasid: '0',
        }
      } else {
        return row;
      }
    })

    const apiData = { ...this.infoBasica[0],
      definir_usuario_senhas: usuariosSAPPOST,
     };

    this.http.post('http://bbpdigital.g2tecnologia.com.br:8021/BBP', apiData, httpOptions).subscribe(
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

  deleteRow(row: definir_usuario_senhas) {
    const bbpid = sessionStorage.getItem('bbP_id'); // Supondo que bbP_DadosCTBID seja o valor de bbpid
    const vcode = row.definir_usuario_senhasid;
    const vtabela = '%40G2_BBP_DEFUSUSENHA';
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
        console.log('Resposta da API:', response);
        if (response) {
          this.rowsUsuariosSenhas = this.rowsUsuariosSenhas.filter(r => r !== row);
        }
      },
      (error) => {
        console.error('Erro ao deletar a linha', error);
      }
    );
  }
}