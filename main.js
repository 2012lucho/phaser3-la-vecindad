var config = {
    //type: Phaser.WEBGL,
    width: 1200,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    pixelArt: true,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    tile_W: 64,
    tile_H: 64
};

var controls;

var game = new Phaser.Game(config);

var p1, p2;
var world;
var zId;
var pjId;
var pjCount = 0;
var dialogBox;

function preload ()
{
    this.load.image('tiles', './assets/iso-64x64-outside.png');
    this.load.image('tiles2', './assets/iso-64x64-building.png');
    this.load.tilemapTiledJSON('map', './assets/isorpg.json');

    p1 = new Player( this );
    p1.preload();

    p2 = new Player( this );
    p2.setIA( new PlayerIA() );
    p2.x = 20;
    p2.y = 20;
    p2.preload();

    dialogBox = new DialogBox( this );
    dialogBox.preload();
}

function create ()
{
    var map = this.add.tilemap('map');

    var tileset1 = map.addTilesetImage('iso-64x64-outside', 'tiles');
    var tileset2 = map.addTilesetImage('iso-64x64-building', 'tiles2');

    var layer1 = map.createLayer('Tile Layer 1', [ tileset1, tileset2 ]);
    //var layer2 = map.createLayer('Tile Layer 2', [ tileset1, tileset2 ]);
    //var layer3 = map.createLayer('Tile Layer 3', [ tileset1, tileset2 ]);
    //var layer4 = map.createLayer('Tile Layer 4', [ tileset1, tileset2 ]);
    //var layer5 = map.createLayer('Tile Layer 5', [ tileset1, tileset2 ]);

    var cursors = this.input.keyboard.createCursorKeys();

    this.cameras.main.setZoom(1);

    p1.create();
    p1.setUserControler();

    p2.create();

    world     = new World( this, map  );
    let zone  = new Zone();
    zone.registerPj( p1 );
    zone.registerPj( p2 );
    zId       = world.addZone( zone );
    pjId      = p1.id;

    dialogBox.create();
}

function update (time, delta)
{
    p1.update();
    p2.update();
    dialogBox.update();
}
