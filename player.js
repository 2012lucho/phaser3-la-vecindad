const ACTION_WALK = 10;

class Player {

  constructor( gameObj ){
    this.sprite        = null;
    this.spriteOffsetY = 0;
    this.scale         = 1;
    this.gameObj       = gameObj;
    this.onControl     = false;
    this.vel           = ( 109 / 15 ) / 64;
    this.vel_x         = 0;
    this.id            = pjCount;
    this.name          = 'NPC-'+this.id;
    pjCount ++;
    this.vel_y         = 0;

    this.animation_seted = '';
    this.cursors         = null;
    this.direction       = '';
    this.IA              = null;

    this.textures = {
      w:[]
    };
    this.sounds = [];

    //acciones
    this.action         = '';
    this.actionList     = [];
    this.actionNow      = null;
    this.actionCounter  = 0;
    this.interactiveOps = [];

    //animaciones
    this.animations = {};

    //posicion
    this.x                 = 10;
    this.zone              = null;
    this.y                 = 10;
    this.route             = [];
    this.onFinishRoute     = undefined;
    this.routeCounter      = 0;
    this.routePointReached = false;
    this.routePoint        = { x:0, y:0, v:0 };
    this.interactDistance  = 3;

    this.keyAction1;
  }

  preload(){
    //se cargan las texturas
    this.textures.w[0] = this.gameObj.load.spritesheet('pj1w0', './assets/pj1/w0.png', { frameWidth: 109, frameHeight: 124 });
    this.textures.w[5] = this.gameObj.load.spritesheet('pj1w5', './assets/pj1/w5.png', { frameWidth: 114, frameHeight: 124 });
    this.textures.w[3] = this.gameObj.load.spritesheet('pj1w3', './assets/pj1/w3.png', { frameWidth: 99,  frameHeight: 137 });
    this.textures.w[7] = this.gameObj.load.spritesheet('pj1w7', './assets/pj1/w7.png', { frameWidth: 101,  frameHeight: 136 });
    this.textures.w[6] = this.gameObj.load.spritesheet('pj1w6', './assets/pj1/w6.png', { frameWidth: 108,  frameHeight: 133 });
    this.textures.w[4] = this.gameObj.load.spritesheet('pj1w4', './assets/pj1/w4.png', { frameWidth: 109,  frameHeight: 134 });
    this.textures.w[1] = this.gameObj.load.spritesheet('pj1w1', './assets/pj1/w1.png', { frameWidth: 107,  frameHeight: 133 });
    this.textures.w[2] = this.gameObj.load.spritesheet('pj1w2', './assets/pj1/w2.png', { frameWidth: 105,  frameHeight: 135 });

    this.gameObj.load.audio('step-grass1', [ './assets/sound/step-grass1.mp3' ]);
  }

  getName(){
    return this.name;
  }

  setName( name ){
    this.name = name;
  }

  getPosX(){
    return ( this.x - this.y ) * ( ( config.tile_W ) / 2 );
  }

  getPosY(){
    return ( this.x + this.y ) * ( ( config.tile_H )/3.555 ) - this.spriteOffsetY;
  }

  create(){
    this.cursors       = this.gameObj.input.keyboard.createCursorKeys();
    this.sprite        = this.gameObj.add.sprite( this.getPosX(), this.getPosY(), 'pj1w0').setScale( this.scale );
    this.spriteOffsetY = this.sprite.displayHeight / 2;

    //se configuran las animaciones
    this.loadAnimation( 'walkr', 'pj1w0' );
    this.loadAnimation( 'walkl', 'pj1w5' );
    this.loadAnimation( 'walku', 'pj1w3' );
    this.loadAnimation( 'walkd', 'pj1w7' );
    this.loadAnimation( 'walkdl', 'pj1w6' );
    this.loadAnimation( 'walkul', 'pj1w4' );
    this.loadAnimation( 'walkdr', 'pj1w1' );
    this.loadAnimation( 'walkur', 'pj1w2' );

    this.animations[ACTION_WALK] = {};
    this.animations[ ACTION_WALK ][ DIRECTION_RIGHT ]  = 'walkr';
    this.animations[ ACTION_WALK ][ DIRECTION_LEFT ]   = 'walkl';
    this.animations[ ACTION_WALK ][ DIRECTION_UP ]     = 'walku';
    this.animations[ ACTION_WALK ][ DIRECTION_DOWN ]   = 'walkd';
    this.animations[ ACTION_WALK ][ DIRECTION_R_UP ]   = 'walkur';
    this.animations[ ACTION_WALK ][ DIRECTION_L_UP ]   = 'walkul';
    this.animations[ ACTION_WALK ][ DIRECTION_R_DOWN ] = 'walkdr';
    this.animations[ ACTION_WALK ][ DIRECTION_L_DOWN ] = 'walkdl';

    this.keyAction1 = this.gameObj.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    this.sounds[ ACTION_WALK ] = this.gameObj.sound.add( 'step-grass1' );

    if ( this.IA !== null ){
      this.IA.create();
    }
  }

// Rutas
// rp = { x:dest, y:dest, vel: }
//
  getAngle( x1, y1, x2, y2 ){
    return Math.atan2( y1 - y2, x1 - x2 ) * 180 / Math.PI + 180;
  }

  getDistance( x2, y2 ){
    let dif1 = this.x - x2;
    let dif2 = this.y - y2;
    return Math.sqrt( dif1*dif1 + dif2*dif2 );
  }

  isInteractuable( actor ){
    return this.getDistance( actor.x, actor.y ) <= this.interactDistance;
  }

  setDirection( d ){
    this.direction = d;
  }

  addRoutePoint( rp ){
    world.changeVoxel( rp, 24 );
    this.route = rp;
  }

  setRoute( r, callback=()=>{} ){
    this.route             = r;
    this.routeCounter      = 0;
    this.routePointReached = false;
    this.onFinishRoute     = callback;
  }

  processRoute(){

    if ( this.route.length > 0 ){
      //Se obtiene un valor que representa la direccion (8 posibles)
      this.routePoint = this.route[ this.routeCounter ];

      this.setDirection( Math.floor( this.getAngle( this.x, this.y, this.routePoint.x, this.routePoint.y ) / 8 ) );
      let v = this.routePoint.v;

      this.routePointReached = false;
      if ( this.x > this.routePoint.x ){ this.x -= v; }
      if ( this.x < this.routePoint.x ){ this.x += v; }
      if ( this.y > this.routePoint.y ){ this.y -= v; }
      if ( this.y < this.routePoint.y ){ this.y += v; }

      if ( Math.abs( this.x - this.routePoint.x ) <= v && Math.abs( this.y - this.routePoint.y ) <= v ){
        this.routePointReached = true;
      }

      if ( this.routePointReached ){
        this.onFinishRoute();
        this.routeCounter ++;

        if ( this.routeCounter >= this.route.length ){
          this.setRoute( [] );
        }
      }

    }
  }

// Animaciones
  loadAnimation( key, map ){
    let config = {
            key: key,
            frames: this.gameObj.anims.generateFrameNumbers( map ),
            frameRate: 15,
            yoyo: false,
            repeat: -1
    };
    let anim = this.gameObj.anims.create( config );
    this.sprite.anims.load( key );
  }

  animate( animationParams ){
    if ( this.animation_seted != animationParams[ this.direction ] ){
      this.sprite.anims.play( animationParams[ this.direction ] );
      this.animation_seted = animationParams[ this.direction ];
    } else {

      if ( this.sprite.anims != undefined ){
        let frame = this.sprite.anims.currentFrame;
        this.sprite.anims.play( { key:  animationParams[ this.direction ], startFrame:frame.index - 1 });
      }
    }
  }

  unSetAnimation(){
    this.sprite.anims.stop();
  }

//control
  setUserControler(){
    this.onControl = true;
    this.gameObj.cameras.main.startFollow( this.sprite );
  }

  setIA( IA ){
    this.IA = IA;
    this.IA.setActor( this );
  }

  controlKeys(){
    //movimiento
    let routePoint  = { x: this.x, y: this.y, v:this.vel };
    let key_pressed = false;
    if ( this.cursors.left.isDown ) {
        routePoint = { x: (routePoint.x - 1), y: (routePoint.y + 1), v:this.vel }; key_pressed = true;
    }

    if ( this.cursors.right.isDown ){
        routePoint = { x: routePoint.x + 1, y: (routePoint.y - 1), v:this.vel }; key_pressed = true;
    }

    if ( this.cursors.up.isDown )  {
        routePoint = { x: (routePoint.x - 1), y: (routePoint.y - 1), v:this.vel }; key_pressed = true;
    }

    if ( this.cursors.down.isDown ){
        routePoint = { x: (routePoint.x + 1), y: (routePoint.y + 1), v:this.vel }; key_pressed = true;
    }

    if ( this.route.length == 0 && key_pressed){
      this.setDirection( Math.floor( this.getAngle( this.x, this.y, routePoint.x, routePoint.y ) / 8 ) );
      this.actionList.push( new Action( ACTION_WALK, this, { animation: this.animations[ ACTION_WALK ], sound:this.sounds[ ACTION_WALK ], route:[ routePoint ] } ) );
    } else if (!key_pressed){
      this.unSetAnimation();
    }

    //interaccion
    if (Phaser.Input.Keyboard.JustDown( this.keyAction1 ) ) {
      dialogBox.presentOptionsFInteractiveActors( this, this.zone.getInteractiveActors( this ), ( interaction, toActor )=>{ this.interactionSelected( interaction, toActor );  } );
    }
  }

  processActionList(){
    if ( this.actionList.length > 0 ){
      this.actionNow = this.actionList[ this.actionCounter ];
      this.actionNow.start();
    }
  }

  actionFinalized( action ){
    this.actionCounter ++;
    if ( this.actionCounter >= this.actionList.length ){
      this.actionCounter = 0;
      this.actionList    = [];
    }
  }

  //interaccion
  interactionSelected( interaction, toActor ){
    console.log( interaction );
  }

  getInteraction( interaction ){

  }

  addInteractiveOps( interaction ){
    this.interactiveOps.push( interaction );
  }

/////

  update(){
    this.direction = '';
    if ( this.onControl ){
      this.controlKeys();
    }

    this.processRoute();
    this.processActionList();
    this.processPosition();
    if ( this.IA !== null ){
      this.IA.update();
    }
  }

  blockControls(){
    this.onControl = false;
  }

  unBlockControls(){
    this.onControl = true;
  }

  processPosition(){
    this.sprite.x = this.getPosX();
    this.sprite.y = this.getPosY();
  }

}

class Action{
  constructor (id, entity, p={}){ //prestar atencion al parametro p
    this.id         = id;
    this.animation  = p.animation;
    this.entity     = entity;
    this.route      = p.route;
  }

  start(){
    if ( this.route != undefined) {
      this.entity.setRoute( this.route, this.finish() );
    }
    this.entity.animate( this.animation );
  }

  stop(){

  }

  update(){

  }

  finish(){
    this.entity.actionFinalized( this );
    this.entity.unSetAnimation();
  }
}
