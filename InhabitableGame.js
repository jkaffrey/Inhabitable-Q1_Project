window.onload = function() {
  //start crafty
  Crafty.init(1136, 1024);
  Crafty.canvas();

  //turn the sprite map into usable components
  Crafty.sprite(16, "images/textmap.png", {
    grass1: [0,0],
    grass2: [1,0],
    flower: [0,5],
    player: [0,3]
  });

  //method to randomy generate the map
  function generateWorld() {
    //generate the grass along the x-axis
    for(var i = 0; i < 2048 / 16; i++) {
      //generate the grass along the y-axis
      for(var j = 0; j < 2048 / 16; j++) {
        grassType = ((i % 2 === 0 && j % 2 === 0) || (i % 2 !== 0 && j % 2 !== 0)) ? 1 : 2;
        Crafty.e("2D, Canvas, grass"+grassType)
        .attr({x: i * 16, y: j * 16})
        .bind('Click', function (event) {
          console.log(e);
        });
        //Crafty.viewport.scale(2);
        //1/50 chance of drawing a flower and only within the bushes
        if(i > 0 && i < 2048/16 && j > 0 && j < 2048/16 && Crafty.randRange(0, 50) > 49) {
          Crafty.e("2D, DOM, flower, Animate")
          .attr({x: i * 16, y: j * 16})
          .animate("wind", 0, 1, 3)
          .bind("enterframe", function() {
            if(!this.isPlaying())
            this.animate("wind", 80);
          });
        }
      }
    }

    //create the bushes along the x-axis which will form the boundaries
    // for(var i = 0; i < 25; i++) {
    //   Crafty.e("2D, Canvas, wall_top, bush"+Crafty.randRange(1,2))
    //   .attr({x: i * 16, y: 0, z: 2});
    //   Crafty.e("2D, DOM, wall_bottom, bush"+Crafty.randRange(1,2))
    //   .attr({x: i * 16, y: 304, z: 2});
    // }

    //create the bushes along the y-axis
    //we need to start one more and one less to not overlap the previous bushes
    //   for(var i = 1; i < 19; i++) {
    //     Crafty.e("2D, DOM, wall_left, bush"+Crafty.randRange(1,2))
    //     .attr({x: 0, y: i * 16, z: 2});
    //     Crafty.e("2D, Canvas, wall_right, bush"+Crafty.randRange(1,2))
    //     .attr({x: 384, y: i * 16, z: 2});
    //   }
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
    .text("Loading")
    .css({"text-align": "center"});
  });

  //automatically play the loading scene
  Crafty.scene("loading");

  Crafty.scene("main", function() {
    generateWorld();

    Crafty.c('CustomControls', {
      __move: {left: false, right: false, up: false, down: false},
      _speed: 3,

      CustomControls: function(speed) {
        if(speed) this._speed = speed;
        var move = this.__move;

        this.bind('enterframe', function() {
          //move the player in a direction depending on the booleans
          //only move the player in one direction at a time (up/down/left/right)
          if(this.isDown("RIGHT_ARROW")) this.x += this._speed;
          else if(this.isDown("LEFT_ARROW")) this.x -= this._speed;
          else if(this.isDown("UP_ARROW")) this.y -= this._speed;
          else if(this.isDown("DOWN_ARROW")) this.y += this._speed;
        });

        return this;
      }
    });

    //create our player entity with some premade components
    player = Crafty.e("2D, Canvas, player, Controls, CustomControls, Animate, Collision, Fourway")
    .attr({x: 160, y: 144, z: 1})
    .CustomControls(1)
    .animate("walk_left", 6, 3, 8)
    .animate("walk_right", 9, 3, 11)
    .animate("walk_up", 3, 3, 5)
    .animate("walk_down", 0, 3, 2)
    .bind("enterframe", function(e) {
      if (this.isDown("SPACE")) {
        console.log(player.x, player.y);
      }
    }).bind("keyup", function(e) {
      this.stop();
    })
    .collision()
    .onHit("wall_left", function() {
      this.x += this._speed;
      this.stop();
    }).onHit("wall_right", function() {
      this.x -= this._speed;
      this.stop();
    }).onHit("wall_bottom", function() {
      this.y -= this._speed;
      this.stop();
    }).onHit("wall_top", function() {
      this.y += this._speed;
      this.stop();
    })
    .fourway(.25);
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

  // $(function () {
  //
  //   $('body').mousemove(function (e) {
  //
  //     var x, y;
  //
  //     x = e.pageX - this.offsetLeft;
  //     y = e.pageY - this.offsetTop;
  //
  //     //$('#x').html(x);
  //     //$('#y').html(y);
  //     console.log(x, y);
  //   });
  // });
};
