var naturalWorldMap = [];

function objectWithinRange(x, y, range) {

  for (var i = x - range; i < x + range; i++) {
    if (naturalWorldMap[i] != null) {
      for (var j = y - range; j < y + range; j++) {
        if (naturalWorldMap[i] != null && naturalWorldMap[i][j] != null) {
          return true;
        }
      }
    }
  }

  return false;
}

window.onload = function() {

  //start crafty
  Crafty.init(1136, 1024);
  Crafty.canvas();

  //turn the sprite map into usable components
  Crafty.sprite(16, "images/textmap.png", {
    grass1: [0,0],
    grass2: [1,0],
    player: [0,4],
    forest: [3, 1, 4, 3], //produce wood
    waterpool: [7, 1, 3, 3], //produce water
    drypatch: [10, 1, 3, 3] // produce sand
  });

  //method to randomy generate the map
  var z = 0;
  function generateWorld() {

    for(var i = 0; i < 2048 / 16; i++) {
      for(var j = 0; j < 2048 / 16; j++) {
        grassType = 1; //((i % 2 === 0 && j % 2 === 0) || (i % 2 !== 0 && j % 2 !== 0)) ? 1 : 2;
        Crafty.e("2D, Canvas, grass"+grassType)
        .attr({x: i * 16, y: j * 16});

        //1 : 50 chance of create a forest at the current location
        if(i > 0 && i < 2032/16 && j > 0 && j < 2032/16 && Crafty.randRange(0, 50) > 49 && !objectWithinRange(i, j, 4)) {
          Crafty.e("2D, DOM, forest")
          .attr({x: i * 16, y: j * 16, z: z});
          z++;

          naturalWorldMap[i] = [];
          naturalWorldMap[i][j] = {
            type: 'tree',
            product: Crafty.randRange(50, 150),
            location: [i, j],
            size: [64, 48]
          };
        }

        //1 : 10 change of a waterpool at the current location
        if(i > 0 && i < 2032/16 && j > 0 && j < 2032/16 && Crafty.randRange(0, 95) > 94 && !objectWithinRange(i, j, 10)) {

          Crafty.e("2D, DOM, waterpool")
          .attr({ x: i * 16, y: j * 16 });

          naturalWorldMap[i] = [];
          naturalWorldMap[i][j] = {
            type: 'lake',
            product: Crafty.randRange(200, 800),
            location: [i, j],
            size: [48, 48]
          }
        }

        //1 : 15 change of a drypatch at the current location
        if(i > 0 && i < 2032/16 && j > 0 && j < 2032/16 && Crafty.randRange(0, 95) > 94 && !objectWithinRange(i, j, 10)) {

          Crafty.e("2D, DOM, wall_top, drypatch")
          .attr({ x: i * 16, y: j * 16 });

          naturalWorldMap[i] = [];
          naturalWorldMap[i][j] = {
            type: 'drypatch',
            product: Crafty.randRange(75, 125),
            location: [i, j],
            size: [48, 48]
          }
        }
      }
    }

    //console.log(naturalWorldMap);
    //create the bushes along the x-axis which will form the boundaries
    // for(var i = 0; i < 25; i++) {
    //   Crafty.e("2D, Canvas, wall_top, bush"+Crafty.randRange(1,2))
    //   .attr({x: i * 16, y: 0, z: 2});
    //   Crafty.e("2D, DOM, wall_bottom, bush"+Crafty.randRange(1,2))
    //   .attr({x: i * 16, y: 304, z: 2});
    // }
    //
    // //create the bushes along the y-axis
    // //we need to start one more and one less to not overlap the previous bushes
    // for(var i = 1; i < 19; i++) {
    //   Crafty.e("2D, DOM, wall_left, bush"+Crafty.randRange(1,2))
    //   .attr({x: 0, y: i * 16, z: 2});
    //   Crafty.e("2D, Canvas, wall_right, bush"+Crafty.randRange(1,2))
    //   .attr({x: 384, y: i * 16, z: 2});
    // }
  }

  //the loading screen that will display while our assets load
  Crafty.scene("loading", function() {
    //load takes an array of assets and a callback when complete
    Crafty.load(["images/textmap.png"], function() {
      Crafty.scene("main"); //when everything is loaded, run the main scene
    });

    //black background with some loading text
    Crafty.background("#000");
    Crafty.e("2D, DOM, Text").attr({w: 100, h: 20, x: 150, y: 120})
    .text("Loading...")
    .css({"text-align": "center"});
  });

  //automatically play the loading scene
  Crafty.scene("loading");

  Crafty.scene("main", function() {
    generateWorld();

    //create our player entity with some premade components
    player = Crafty.e("2D, Canvas, player, Controls, Animate, Collision, Fourway")
    .attr({x: 160, y: 144, z: 1})
    .animate("walk_left", 6, 4, 8)
    .animate("walk_right", 9, 4, 11)
    .animate("walk_up", 3, 4, 5)
    .animate("walk_down", 0, 4, 2)
    .bind("enterframe", function(e) {
      if (this.isDown("SPACE")) {
        console.log(player.x, player.y);
      }
    }).bind("keyup", function(e) {
      this.stop();
    })
    .collision()
    .onHit("wall_left", function() {
      this.x = 0;//this._speed;
      this.stop();
    }).onHit("wall_right", function() {
      this.x = 0;//this._speed;
      this.stop();
    }).onHit("wall_bottom", function() {
      this.y = 0;//this._speed;
      this.stop();
    }).onHit("wall_top", function() {
      this.y = 0;//this._speed;
      this.stop();
    })
    .fourway(.5);
  });

  //Crafty.viewport.clampToEntities = false;
  //Crafty.viewport.follow(player, -60, 0);

  Crafty.addEvent(this, Crafty.stage.elem, "mousedown", function(e) {
    if(e.button > 1) return;
    var base = {x: e.clientX, y: e.clientY};

    function scroll(e) {
      var dx = base.x - e.clientX,
      dy = base.y - e.clientY;
      base = {x: e.clientX, y: e.clientY};
      Crafty.viewport.x -= dx;
      Crafty.viewport.y -= dy;

      console.log(e.realX, e.realY);
    };

    Crafty.addEvent(this, Crafty.stage.elem, "mousemove", scroll);
    Crafty.addEvent(this, Crafty.stage.elem, "mouseup", function() {
      Crafty.removeEvent(this, Crafty.stage.elem, "mousemove", scroll);
    });
  });
};
