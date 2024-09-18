import { definir_condicoes_pagamentos } from './../../models/condic-pagamento/condic-pagamento.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { infoBasica } from '../../models/infobasica/infobasica.model';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormInfoService {
  // Método para preencher o formulário com os valores da API
  patchInfoBasicaForm(form: FormGroup, infoBasica: infoBasica[]): void {
    const dados = infoBasica[0] || {};

    form.patchValue({
      cardName: dados.cardName || '',
      site: dados.site || '',
      email: dados.email || '',
      telefone: dados.telefone || '',
      telefone2: dados.telefone2 || '',
      caminho_Pasta_Word: dados.caminho_Pasta_Word || '',
      caminho_Pasta_Excel: dados.caminho_Pasta_Excel || '',
      caminho_Pasta_Imagens: dados.caminho_Pasta_Imagens || '',
      caminho_Pasta_XML: dados.caminho_Pasta_XML || '',
      caminho_Pasta_Licencas: dados.caminho_Pasta_Licencas || '',
      // Dados Contábeis
      dadosCTB: dados.dadosCTB || [],
      // Campos de Localização
      campos_Loca_Registro_Comercial: dados.campos_Loca_Registro_Comercial || '',
      campos_Loca_Data_Incorporacao: dados.campos_Loca_Data_Incorporacao || '',
      campos_Loca_Perfil_Sped: dados.campos_Loca_Perfil_Sped || '',
      // Moedas
      moeda_Corrente: dados.moeda_Corrente || '',
      moeda_Sistema: dados.moeda_Sistema || '',
      // Listar Moedas
      moedas: dados.moedas || [],
      // Grupo Clientes
      definir_grupos_clientes: dados.definir_grupos_clientes || [],
      definir_condicoes_pagamentos: dados.definir_condicoes_pagamentos || [],
    });
  }

  constructor() { }
}
