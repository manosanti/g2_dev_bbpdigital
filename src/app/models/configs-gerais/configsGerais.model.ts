import { quantas_casas_decimais_utilizar } from './quantas_casas_decimais_utilizar.mode';
import { alerta_Atividade } from './alertaAtividade.model';
import { definir_Informacoes_banco } from '../info-banco/info-banco.model';
import { definir_condicoes_pagamentos } from '../condic-pagamento/condic-pagamento.model';
import { com_base_negocio_define_taxadecomiss } from './taxaComissao.model';

export interface configsGerais {
    qual_formato_hora_uitlizar_tela: string;
    qual_formato_data_uitlizar_tela: string;
    // Alerta de Atividades
    alerta_Atividade: alerta_Atividade[];
    com_base_negocio_define_taxadecomiss: com_base_negocio_define_taxadecomiss[];
    definir_Informacoes_banco: definir_Informacoes_banco[];
    definir_condicoes_pagamentos: definir_condicoes_pagamentos[];
    quantas_casas_decimais_utilizar: quantas_casas_decimais_utilizar[];
}