import { plano_Contas_Empresa_anexo } from './../../views/plano_Contas_Empresa_anexo/plano_Contas_Empresa_anexo.model';
import { configuracao_Imposto_Retido_Fonte } from './../configuracao_Imposto_Retido_Fonte/configuracao_Imposto_Retido_Fonte.model';
import { defina_Grupo_Item } from './../defina_Grupo_Item/defina_Grupo_Item.model';
import { despesas_Adicionais } from './../definicao-despesas/despesas_Adicionais.model';
import { definicao_Despesas } from './../definicao-despesas/definicao_Despesas.model';
import { definir_Informacoes_banco } from './../info-banco/info-banco.model';
import { definir_grupos_fornecedores } from './../grupo-fornecedores/definir_grupos_fornecedores.model';
import { definir_grupos_clientes } from './../grupo-clientes/definir_grupos_clientes.model';
import { tableDadosCTB } from './tableDadosCTB.model';
import { moedas } from './moedas.model';
import { definir_usuario_senhas } from '../usuarios-SAP/definir_usuario_senhas.model';
import { definir_tipos_expedicao } from '../definir_tipos_expedicao/definir_tipos_expedicao.model';
import { definir_configuracoes_iniciais_documento } from '../definir_configuracoes_iniciais_documento/definir_configuracoes_iniciais_documento.model';
import { alerta_Atividade } from '../configs-gerais/alertaAtividade.model';
import { com_base_negocio_define_taxadecomiss } from '../configs-gerais/taxaComissao.model';
import { quantas_casas_decimais_utilizar } from '../configs-gerais/quantas_casas_decimais_utilizar.mode';
import { determinacao_contacontabil_compras } from '../lancamento-transacao/determinacao_contacontabil_compras.model';
import { determinacao_contacontabil_vendas } from '../lancamento-transacao/determinacao_contacontabil_vendas.model';
import { determinacao_contacontabil_estoque } from '../lancamento-transacao/determinacao_contacontabil_estoque.model';
import { determinacao_contacontabil_geral } from '../lancamento-transacao/determinacao_contacontabil_geral.model';
import { definir_Dimensoes_Centros_Custo } from '../centro-custos/definir_Dimensoes_Centros_Custo.model';
import { definir_Centros_Custo } from '../centro-custos/definir_Centros_Custo.model';
import { defina_Depositos } from '../depositos/depositos.model';
import { definir_condicoes_pagamentos } from '../condic-pagamento/condic-pagamento.model';
import { definir_informacoes_cartoes } from '../definir_informacoes_cartoes/definir_informacoes_cartoes.model';
import { definir_Territorios } from './../definir_Territorios/definir_Territorios.model';

export interface infoBasica {
    cardName: string;
    // Web
    site: string;
    email: string;
    // Telefone
    telefone: string;
    telefone2: string;
    // Dados Contábeis
    dadosCTB: tableDadosCTB[];
    // Campos de Localização
    campos_Loca_Registro_Comercial: string;
    campos_Loca_Data_Incorporacao: string;
    campos_Loca_Perfil_Sped: string;
    // Caminho Para Pastas
    caminho_Pasta_Word: string;
    caminho_Pasta_Excel: string;
    caminho_Pasta_Imagens: string;
    caminho_Pasta_Licencas: string;
    caminho_Pasta_XML: string;
    // Endereço
    cep: string;
    // Moedas
    moeda_Corrente: string,
    moeda_Sistema: string,
    seu_Negocio_necessita_sup_mult: string,
    qual_conta_corrente_negocio_padrao_sistema: string,

    qual_formato_hora_uitlizar_tela: string,
    qual_formato_data_uitlizar_tela: string,
    // moedas
    moedas: moedas[];
    definir_grupos_clientes: definir_grupos_clientes[];
    definir_grupos_fornecedores: definir_grupos_fornecedores[];
    definir_tipos_expedicao: definir_tipos_expedicao[];
    definir_configuracoes_iniciais_documento: definir_configuracoes_iniciais_documento[];
    alerta_Atividade: alerta_Atividade[];
    com_base_negocio_define_taxadecomiss: com_base_negocio_define_taxadecomiss[];
    quantas_casas_decimais_utilizar: quantas_casas_decimais_utilizar[];
    definir_Informacoes_banco: definir_Informacoes_banco[];
    determinacao_contacontabil_compras: determinacao_contacontabil_compras[];
    determinacao_contacontabil_vendas: determinacao_contacontabil_vendas[];
    determinacao_contacontabil_estoque: determinacao_contacontabil_estoque[];
    determinacao_contacontabil_geral: determinacao_contacontabil_geral[];
    definir_Dimensoes_Centros_Custo: definir_Dimensoes_Centros_Custo[];
    definir_Centros_Custo: definir_Centros_Custo[];
    definicao_Despesas: definicao_Despesas[];
    despesas_Adicionais: despesas_Adicionais[];
    defina_Depositos: defina_Depositos[];
    defina_Grupo_Item: defina_Grupo_Item[];
    configuracao_Imposto_Retido_Fonte: configuracao_Imposto_Retido_Fonte[];
    definir_condicoes_pagamentos: definir_condicoes_pagamentos[];
    definir_informacoes_cartoes: definir_informacoes_cartoes[];
    definir_usuario_senhas: definir_usuario_senhas[];
    definir_Territorios: definir_Territorios[];
    plano_Contas_Empresa_anexo: plano_Contas_Empresa_anexo[];
}