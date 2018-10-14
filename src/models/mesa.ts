import { Integrantes } from "./integrantes";

export class Mesa{
    id:string;
    ativa:boolean;
    integrantes:Array<Integrantes>;

    constructor(){
        this.id=null;
        this.ativa=false;
        this.integrantes = [];
    }
}