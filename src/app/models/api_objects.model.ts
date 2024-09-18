import { tableDadosCTB } from "./infobasica/tableDadosCTB.model";
import { moedas } from "./infobasica/moedas.model";
import { definir_usuario_senhas } from "./usuarios-SAP/definir_usuario_senhas.model";

export interface api_objects {
    dadosCTB: tableDadosCTB[];
    moedas: moedas[];
    definir_usuario_senhas: definir_usuario_senhas[]
}