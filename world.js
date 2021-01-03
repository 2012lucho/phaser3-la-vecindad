const DIRECTION_RIGHT  = 39;
const DIRECTION_LEFT   = 16;
const DIRECTION_UP     = 28;
const DIRECTION_DOWN   = 5;
const DIRECTION_R_UP   = 33;
const DIRECTION_L_UP   = 22;
const DIRECTION_R_DOWN = 45;
const DIRECTION_L_DOWN = 11;


class World {
    constructor( gameObj, mapObj ){
      this.gameObj = gameObj;
      this.mapObj  = mapObj;
      this.zones   = [];
    }

    changeVoxel( position, value ){
      if ( position.x < 0 || position.y < 0 ){
        return false;
      }
      this.mapObj.putTileAt( value, position.x, position.y );
    }

    addZone( z ){
      this.zones.push( z );
      return this.zones.length - 1;
    }

    getZone( id ){
      return this.zones[ id ];
    }
}

class Zone{
  constructor(){
    this.zones = [];
    this.pjs   = [];
  }

  addZone( z ){
    this.zones.push( z );
    return this.zones.length - 1;
  }

  registerPj( pj ){
    this.pjs.push( pj );
    pj.zone = this;
    return this.pjs.length - 1;
  }

  getInteractiveActors( actor ){
    let interactuable = [];
    for ( let c=0; c<this.pjs.length; c++ ){
      if ( this.pjs[ c ].isInteractuable( actor ) && actor.id != this.pjs[ c ].id && this.pjs[ c ].interactiveOps.length > 0 ){
        interactuable.push( this.pjs[ c ] );
      }
    }
    return interactuable;
  }

}


class Interaction{
  constructor( actor, config ){
    this.actor    = actor;
    this.type     = config.type;
    this.descript = config.descript;
  }
}
