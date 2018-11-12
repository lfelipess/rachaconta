import { Integrantes } from "./integrantes";

export class Mesa{
    id:string;
    codigoMesa:string;
    ativa:boolean;
    integrantes:Array<Integrantes>;
    data:String;

    constructor(){
        this.id=null;
        this.codigoMesa=null;
        this.ativa=false;
        this.integrantes = new Array<Integrantes>();
        this.data = null;
    }
}