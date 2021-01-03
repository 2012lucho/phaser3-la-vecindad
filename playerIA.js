
const INTERACTION_CHARLA = 10;

class PlayerIA {
    constructor() {
        this.relacionesSociales = [];
        this.tareas             = [];
        this.actor              = null;
    }

    setActor( actor ){
      this.actor = actor;
    }

    addRelacionSocial( ){

    }

    update(){
    }

    create(){
      let interactiveOp = new Interaction( this.actor, { type:INTERACTION_CHARLA, descript:'Hablar.' } );
      this.actor.addInteractiveOps( interactiveOp );
    }
}

class RelacionSocial {
    constructor() {
      this.playerB     = null;
      this.compromisos = [];
      this.valor       = 0;
      this.recuerdos   = [];
    }
}

class Compromiso {
    constructor() {

    }
}
