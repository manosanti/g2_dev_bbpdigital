import { Routes } from '@angular/router';
// Componentes
import { SignInComponent } from './views/login/sign-in/sign-in.component';
import { ForgetPassword01Component } from './views/login/forget-password-01/forget-password-01.component';
import { ForgotPassword02Component } from './views/login/forgot-password-02/forgot-password-02.component';
import { ForgotPassword03Component } from './views/login/forgot-password-03/forgot-password-03.component';
import { InformacoesBancoComponent } from './views/informacoes-banco/informacoes-banco.component';
import { DepositosComponent } from './views/menu-opcoes/depositos/depositos.component';
import { defina_Grupo_ItemComponent } from './views/menu-opcoes/grupo-itens/grupo-itens.component';
import { CondicoesPagamentoComponent } from './views/menu-opcoes/condicoes-pagamento/condicoes-pagamento.component';
import { UsuariosSapComponent } from './views/menu-opcoes/usuarios-sap/usuarios-sap.component';
import { GrupoClientesComponent } from './views/menu-opcoes/grupo-clientes/grupo-clientes.component';
import { GrupoFornecedoresComponent } from './views/menu-opcoes/grupo-fornecedores/grupo-fornecedores.component';
import { TiposExpedicaoComponent } from './views/menu-opcoes/tipos-expedicao/tipos-expedicao.component';
import { ConfigInicialDocumentoComponent } from './views/menu-opcoes/config-inicial-documento/config-inicial-documento.component';
import { InformacoesBasicasComponent } from './views/menu-opcoes/informacoes-basicas/informacoes-basicas.component';
import { ConfiguracoesGeraisComponent } from './views/menu-opcoes/configuracoes-gerais/configuracoes-gerais.component';
import { LancamentosTransacaoComponent } from './views/menu-opcoes/lancamentos-transacao/lancamentos-transacao.component';
import { CentroCustosComponent } from './views/menu-opcoes/centro-custos/centro-custos.component';
import { DefinicaoDespesasComponent } from './views/menu-opcoes/definicao-despesas/definicao-despesas.component';
import { definir_informacoes_cartoesComponent } from './views/menu-opcoes/informacoes-cartoes/informacoes-cartoes.component';
import { TerritoriosComponent } from './views/menu-opcoes/territorios/territorios.component';
import { PlanoDeContasComponent } from './views/menu-opcoes/plano-de-contas/plano-de-contas.component';
import { ImpostosComponent } from './views/menu-opcoes/impostos/impostos.component';
import { authGuard } from './guards/auth.guard';

// Selecionar/Escolher Contrato =>
import { SearchContractComponent } from './views/search-contract/search-contract.component';

export const routes: Routes = [
    {
        path: 'search-contract',
        component: SearchContractComponent,
        canActivate: [authGuard]
    },
    {
        path: '',
        redirectTo: 'informacoes-basicas',
        pathMatch: 'full',
    },
    {
        path: 'sign-in',
        component: SignInComponent,
    },
    {
        path: 'forgot-password',
        component: ForgetPassword01Component,
    },
    {
        path: 'verify-email',
        component: ForgotPassword02Component,
    },
    {
        path: 'new-password',
        component: ForgotPassword03Component,
    },
    // 01. Informações Básicas
    {
        path: 'informacoes-basicas',
        component: InformacoesBasicasComponent,
        canActivate: [authGuard]
    },
    // 02. Configurações Gerais
    {
        path: 'configuracoes-gerais',
        component: ConfiguracoesGeraisComponent,
        canActivate: [authGuard]
    },
    // 03. Plano de Contas
    {
        path: 'plano-de-contas',
        component: PlanoDeContasComponent,
        canActivate: [authGuard]
    },
    // 04. Informações de Banco
    {
        path: 'informacoes-de-banco',
        component: InformacoesBancoComponent,
        canActivate: [authGuard]
    },
    // 05. Lançamentos de Transação
    {
        path: 'lancamentos-de-transacao',
        component: LancamentosTransacaoComponent,
        canActivate: [authGuard]
    },
    // 06. Centro de Custo
    {
        path: 'centro-de-custos',
        component: CentroCustosComponent,
        canActivate: [authGuard]
    },
    // 07. Definição de Despesas
    {
        path: 'definicao-de-despesas',
        component: DefinicaoDespesasComponent,
        canActivate: [authGuard]
    },
    // 08. Depósitos
    {
        path: 'depositos',
        component: DepositosComponent,
        canActivate: [authGuard]
    },
    // 09. Grupo de Itens
    {
        path: 'grupo-de-itens',
        component: defina_Grupo_ItemComponent,
        canActivate: [authGuard]
    },
    // 10. Imposto
    {
        path: 'imposto',
        component: ImpostosComponent,
        canActivate: [authGuard]
    },
    // 11. Condições de Pagamento
    {
        path: 'condicoes-de-pagamento',
        component: CondicoesPagamentoComponent,
        canActivate: [authGuard]
    },
    // 12. Informações de Cartões
    {
        path: 'informacoes-de-cartoes',
        component: definir_informacoes_cartoesComponent,
        canActivate: [authGuard]
    },
    // 13. Usuários SAP
    {
        path: 'usuarios-sap',
        component: UsuariosSapComponent,
        canActivate: [authGuard]
    },
    // 14. Territórios
    {
        path: 'territorios',
        component: TerritoriosComponent,
        canActivate: [authGuard]
    },
    // 15. Grupo de Clientes
    {
        path: 'grupo-de-clientes',
        component: GrupoClientesComponent,
        canActivate: [authGuard]
    },
    // 16. Grupo de Fornecedores
    {
        path: 'grupo-de-fornecedores',
        component: GrupoFornecedoresComponent,
        canActivate: [authGuard]
    },
    // 17. Tipos de Expedição
    {
        path: 'tipos-de-expedicao',
        component: TiposExpedicaoComponent,
        canActivate: [authGuard]
    },
    // 18. Config. Iniciais de Documento
    {
        path: 'configuracoes-iniciais-de-documento',
        component: ConfigInicialDocumentoComponent,
        canActivate: [authGuard]
    }
];