class DialogBox{
    constructor( gameObj ){
      this.gameObj             = gameObj;
      this.opsSelectedCallback = ()=>{};
      this.fromActor           = null;
      this.opsSelected         = null;
      this.opsConfirmed;

      this.texts = [];
      this.x = 0;
      this.y = 0;
      this.scale = 0.15;

      this.spriteSelect;
    }

    preload(){
      this.gameObj.load.image('menuselect1','./assets/menu-select1.png');
    }

    create(){
      this.spriteSelect = this.gameObj.add.sprite( 0, 0, 'menuselect1').setScale( this.scale );
    }

    update(){

    }

    presentOptionsFInteractiveActors( fromActor, interactActors, callback ){
      this.opsSelectedCallback = callback;
      let hasNewActor = false;
      if ( this.fromActor != null ){
        this.fromActor.id == fromActor.id;
      }
      this.fromActor  = fromActor;

      this.clearTexts();

      this.x = fromActor.getPosX();
      this.y = fromActor.getPosY();

      if ( interactActors.length == 0 ){
        return false;
      }

      //Si solo hay una entidad con la que interactuar se pasa directamente a la interaccion
      if ( interactActors.length == 1 ){
        this.opsSelectedCallback( interactActors[ 0 ].interactiveOps, interactActors[ 0 ] );
        return false;
      }

      //como se esta en el menu de seleccion se bloquean los controles
      this.fromActor.blockControls();
      this.opsSelected = 0;

      this.texts.push( this.gameObj.add.text( this.x, this.y, 'Interactuar con:', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }) );
      for ( let c=0; c < interactActors.length; c++ ){
        this.texts.push( this.gameObj.add.text( this.x+20, this.y+(c+1)*20, interactActors[ c ].getName(), { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }) );
      }

      //se situa el marcador de seleccion de opciones
      this.spriteSelect.x = this.x+10;
      this.spriteSelect.y = this.y+(this.opsSelected+1)*20+10;
    }

    clearTexts(){
      for ( let c=0; c<this.texts.length; c++ ){
        this.texts[ c ].destroy();
      }
    }
}
