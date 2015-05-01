// import "bower_components/jquery/dist/jquery";
// import "app/controllers/paper";
// // import "lib/paper";
// import "lib/stats";
  
// var beerpaper = {
  function initialize() {
    self.stats           = initStats(),
    self.beerGroup       = new Group(),
    self.bubbleGroup     = new Group(),
    self.pagebottom          = [ view.size.width/2, 0],
    self.pagetop             = [view.size.width/2, view.size.height],
    // self.pagesize            = view.size * [1.2, 1],
    self.mouseLocation   = view.size.height * .5,
    self.cursorBelowBeer = false,
    self.restLength      = Math.floor(window.innerHeight*.8),
    self.beerColor       = '#603813',
    self.foamColor       = '#ece8cd',
    self.bubbleCount     = 20,
    self.bubbleOpacity   = 0.5,
    self.values          = {
                          amount: 23,
                          dampeningFactor: 0.00025,
                          spread: .01,
                          k: .025 // tension
                        },
                     
    self.path,
    self.springs;

    // Initialize is fired on page refresh, if path exists destroy and rebuild
    if (self.path)
      self.path.remove();

    pagesize = view.bounds.size * [2, 1];

    self.path = createPath();
    project.activeLayer.insertChild(0, path);

    // console.log(self.bubblePath);
    if (!self.bubblePath) {
      self.bubblePath = makeBubbles();
    }

    $('#orange').click(function(){
      self.beerColor = '#f7941e';
      $('.beer-btn').removeClass('active');
      $('#orange').addClass('active');
    });

    $('#red').click(function(){
      self.beerColor = '#be4f18';
      $('.beer-btn').removeClass('active');
      $('#red').addClass('active');
    });

    $('#brown').click(function(){
      self.beerColor = '#603813';
      $('.beer-btn').removeClass('active');
      $('#brown').addClass('active');    
    });

    $('#yellow').click(function(){
      self.beerColor = '#fff45f';
      $('.beer-btn').removeClass('active');
      $('#yellow').addClass('active');    
    });

   $('#gold').click(function(){
      self.beerColor = '#fcb040';
      $('.beer-btn').removeClass('active');
      $('#gold').addClass('active');    
    });    
  }



  // =======================================================================================

                  // Beer Surface Path drawing / updating

  // =======================================================================================


  // Spring characteristics
  var Spring = function(point, velocity) {
    this.restLength = self.restLength;
    this.k = self.values.k;
    this.currentHeight = this.restLength;
    this.point = point;
    this.velocity = velocity ? velocity : 0;
  };

  // Spring update function
  Spring.prototype.update = function() {
    var x = this.currentHeight - this.restLength;
    // speed += accel, accel = -k*x - dampeningFactor * velocity (Hooks law + dampening) -- integrate using Eulers
    this.velocity += -this.k * x - values.dampeningFactor * this.velocity; 
    // Euler Integration again for position from speed
    this.point.y += this.velocity;
  };


  // Create Path for Beer surfice (Collection of springs)
  function createPath() {
    var path = new Path({
      top: self.pagetop,
      bottom: self.pagebottom,
      fillColor: self.beerColor,
      strokeColor: self.foamColor,
      strokeWidth: 70
    });
    self.beerGroup.addChild(path);
    self.springs = [];
    for (var i = 0; i <= values.amount; i++) {
      var segment = path.add(new Point(i / values.amount, 0.5) * pagesize);
      var point = segment.point;
      if (i === 0 || i === values.amount)
        point.y += pagesize.height;
      point.px = point.x;
      point.py = point.y;
      // The first two and last two points are fixed:
      point.fixed = i < 2 || i > values.amount - 2;
      if (i > 0) {
        point.springIndex = i;
        var spring = new Spring(point, 0);
        springs.push(spring);
      }
    }
    path.position.x -= pagesize.width / 4;
    return path;
  }

  // =====================================================================
  // Bubble Drawing
  // =====================================================================
  function makeBubbles() {
    // Create a symbol, which we will use to place instances of later:
    var bubblePath = new Path.Circle({
      center: [0, 0],
      radius: 15,
      strokeWidth: 6,
      strokeColor: self.foamColor,
      opacity: self.bubbleOpacity
    });

    var symbol = new Symbol(bubblePath); 

    for (var i = 0; i < self.bubbleCount; i++) {
      // position is random within the view, y is random within half of the page
      var center = Point.random() * [view.size.width, view.size.height*.5];
      // move random y points from top half the screen to bottom half
      center.y += view.size.height * .5;
      var placedSymbol = symbol.place(center);
    }
    return bubblePath;
  }
  // ==================================================================
  // Mouse Events
  // ==================================================================
  function onMouseMove(event) {
    var location         = self.path.getNearestLocation(event.point),
        segment          = location.segment,
        point            = segment.point,
        mousePlungeSpeed = event.delta.y,
        wasBelow         = cursorBelowBeer;

    mouseLocation = event.point.y;
    if (!point.fixed) {
      mouseLocation > location.point.y ? self.cursorBelowBeer = false :  self.cursorBelowBeer = true;
      if(cursorBelowBeer != wasBelow && wasBelow && cursorBelowBeer == false) { 
        splash(point, mousePlungeSpeed);
      } else if (cursorBelowBeer != wasBelow && wasBelow == false && cursorBelowBeer) {
        splashUp(point, mousePlungeSpeed);
      }
    }
  }

  // Show path points if space key is entered
  // ******Probably change this for production??*****
  function onKeyDown(event) {
    if (event.key == 'space') {
      path.fullySelected = !path.fullySelected;
      path.fillColor = path.fullySelected ? null : '#FFD93F';
    }
  }

  // On mouse going down from the top through surface of fluid
  function splash(point, mousePlungeSpeed) {
    if(mousePlungeSpeed < 10)  { mousePlungeSpeed = 10; }
    if(mousePlungeSpeed > 200) { mousePlungeSpeed = 200; }
    point.y += mousePlungeSpeed;
  }

  // On mouse going from bottom through surface of fluid
  function splashUp(point, mousePlungeSpeed) {
    if(Math.abs(mousePlungeSpeed) < 10)  { mousePlungeSpeed = -10; }
    if(Math.abs(mousePlungeSpeed) > 200) { mousePlungeSpeed = -200; }
    point.y += mousePlungeSpeed;
  }

  function surfaceLevel(springs, spring) {
    if( cursorBelowBeer ) {
      // Raise Surface
      if(springs[2].point.y > view.size.height*.35) {
        spring.point.y += -.25;
      }
    } else {
      // Lower Surface
      if(springs[2].point.y < view.size.height*.6) {
        spring.point.y += .25;
      }
    }
  }  

  // ========================================================================
  // Update Function and animation actions
  // ========================================================================

  // This is the animation loops, runs 60 times per second -- ideally
  function onFrame(event) {
    updateWave(self.path);
    moveBubbles();
    upDateColor(self.path);
    stats.update();
  }

  // Update beer color
  function upDateColor(path){
    var finalColor = new Color(self.beerColor);
    if (path.fillColor && path.fillColor.hue != finalColor.hue) {
      path.fillColor = finalColor;
    }
  }

  function updateWave(path) {
    for (var i = 4; i <= values.amount -4; i++ ) {
      springs[i].update();
      if( i == values.amount -4 ) {
        propagateWave(path);
      }
    }
    path.smooth();
  }

  // Move bubbles up and "pop" them on fluid surface 
  // -- "pop" means reuse symbol by moving to bottom with random x location
  function moveBubbles() {
    project.activeLayer.children.slice(1)
    for (var i = 0; i <= bubbleCount+2; i++) {
      var bubble = project.activeLayer.children[i];
      if(bubble.symbol) {
        // larger bubbles move faster than smaller circles:
        bubble.position.y += -bubble.bounds.height/10 ;
        fluidPercentOfScreen = springs[2].point.y/view.size.height;
        if ( bubble.position.y < view.viewSize.height * (fluidPercentOfScreen) ) {
          var nearestPointOnBeerLayer = path.getNearestLocation(bubble.position).point.y
          if( bubble.position.y < nearestPointOnBeerLayer - 40) {
            bubble.position.y = view.size.height + bubble.bounds.height + Math.random()*20;
            bubble.position.x = view.size.width * Math.random();
          }            
        }
      }
    }
  }

  function propagateWave(path) {
    var leftDeltas  = [],
        rightDeltas = [];
    for (var j = 0; j < 3; j++ ) {
      for (var i = 3; i < springs.length - 3; i++ ) {
        if(!springs[i].point.fixed && !springs[i+1].point.fixed && !springs[i-1].point.fixed) {
          if ( i > 0) {
            leftDeltas[i] = values.spread * (springs[i].point.y - springs[i - 1].point.y);
            springs[i - 1].velocity += leftDeltas[i]
          }
          if ( i < springs.length - 1) {
            rightDeltas[i] = values.spread * (springs[i].point.y - springs [i + 1].point.y);
            springs[i + 1].velocity += rightDeltas[i];
          }
        }
      }
      for (var i = 3; i <  springs.length - 3; i++) {
        if(!springs[i].point.fixed && !springs[i+1].point.fixed && !springs[i-1].point.fixed) {
          if (i > 0) {
            springs[i - 1].point.y += leftDeltas[i];
          }
          if (i < springs.Length - 1) {
            springs[i + 1].point.y += rightDeltas[i];
          }
          surfaceLevel(springs, springs[i]);
        }
      }
    }
  }

  function onResize() {
    initialize();
  }
  // Dislays Frames per Second -- REMOVE FOR PRODUCTION
  function initStats() {
    var stats = new Stats();
    stats.setMode(0); // 0: fps, 1: ms
    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left     = '0px';
    stats.domElement.style.top      = '0px';
    document.getElementById("Stats-output").appendChild(stats.domElement);
    return stats;
  }
// };

// export default beerpaper;



// $(window).load(function() {
//   beerpaper.initialize();
// });



// Window resize
// $(window).resize($.debounce( 100, function() {
  // beerpaper.on();

// }));

