import { determinacao_contacontabil_compras } from "./determinacao_contacontabil_compras.model";
import { determinacao_contacontabil_estoque } from "./determinacao_contacontabil_estoque.model";
import { determinacao_contacontabil_geral } from "./determinacao_contacontabil_geral.model";
import { determinacao_contacontabil_vendas } from "./determinacao_contacontabil_vendas.model";

export interface lancamentoTransacao {
    determinacao_contacontabil_compras: determinacao_contacontabil_compras[],
    determinacao_contacontabil_vendas: determinacao_contacontabil_vendas[],
    determinacao_contacontabil_estoque: determinacao_contacontabil_estoque[],
    determinacao_contacontabil_geral: determinacao_contacontabil_geral[],
}