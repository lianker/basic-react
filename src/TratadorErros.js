import PubSub from "pubsub-js";

export default class TratadorErros{
    static publicaErros(err){
        err.errors.forEach(erro => {
            PubSub.publish("erro-validacao",erro);            
        });
    }
}