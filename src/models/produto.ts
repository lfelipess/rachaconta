import { Integrantes } from "./integrantes";

export class Produto{
    id:string;
    descricao:string;
    valor:number;
    idMesa:string;
    integrantes:Array<Integrantes>;

    constructor(){
        this.id= null;
        this.descricao= "";
        this.valor= null;
        this.idMesa= null;
        this.integrantes = [];
    }

}