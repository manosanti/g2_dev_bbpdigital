import { definicao_Despesas } from "./definicao_Despesas.model";
import { despesas_Adicionais } from "./despesas_Adicionais.model";

export interface listaDefinicaoDespesas {
    despesas_Adicionais: despesas_Adicionais[],
    definicao_Despesas: definicao_Despesas[],
}