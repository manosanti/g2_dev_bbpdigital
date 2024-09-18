export interface definir_condicoes_pagamentos{
    definir_condicoes_pagamentosid: string,
    codigo_condicao: string,
    data_vencimento_baseada: string,
    prestacao: string,
    dias_vencimento_prestacao: string,
    abrir_contas_receber: string,
    perc_total_desconto: number,
    selected?: boolean;
}