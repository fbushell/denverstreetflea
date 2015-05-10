import "bower_components/jquery/dist/jquery";
import "lib/jquery.ba-throttle-debounce.min";
//import "bower_components/ScrollMagic/scrollmagic/minified/ScrollMagic.min";
//import "bower_components/ScrollMagic/scrollmagic/minified/plugins/debug.addIndicators.min";
import "lib/jquery.scrollmagic.min";
import "lib/jquery.scrollmagic.debug";
import "lib/jquery.ba-bbq-plugin.min";
// import "lib/jquery.bttrlazyloading.min";
import "lib/hammer.min";
//import "bower_components/bigtext/dist/bigtext";


var conductor = {

  init: function() {
    var self = this;

    self.$window = $(window);
    self.$html = $('html');
    self.body = $('body');

    // Window dimensions ~~~~~~~~~~~~~~~~~~~~~~~~
    self.wW = '';
    self.wH = '';
    self.updateWindowDimensions();

    // Loader ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    self.$loader = $('.page-loader');

    // Scroll Magic ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    self.sceneKeys = {};
    self.activeSection = '';
    self.mobileLayoutCheck();
    self.initialLoad = null;
    self.isScroll = false;
    self.isScrollingPage = $('.collection-type-scrollingpage');
    // self.eventContent = ($('.event-content').height()) - 2000;
    self.eventContentHeight();
    self.updateSceneDuration();
    self.eventWrap = $('.event-content');
    self.navButton = $('.nav-button');
    // self.eventNav = $('.event-navigation');
    //self.eventOffset = ((self.eventWrap.height()) - (self.eventNav.height()));

    // Scroll position ~~~~~~~~~~~~~~~~~~~~~~~~~~
    self.scrollPosition = '';
    self.eventNav = $('.event-navigation');
    self.eventMenuBindings();
   //  self.btt = $('.back-to-top');

    self.navButton.on('click', function() {
      self.body.toggleClass('menu-active');
    });

    

   // // Back to Top
   //  self.btt.on('click', function(){
   //    $("html, body").animate({
   //      scrollTop: 0
   //    }, 800);
   //  });


    // Menu
    self.menuBindings();

    //Event Nav
    conductor.eventContentHeight();
    //self.eventPageOffset = (self.$prodPhotoWrap.height()) - (self.$prodDeetsWrap.height());

  },


  updateWindowDimensions: function() {
    var self = this;
    self.wW = self.$window.width();
    self.wH = self.$window.height();
  },

  menuBindings: function() {
    var $menuBtn = $('.menu-btn'),
        $menuCloseBtn = $('.main-nav-close');
        //menuArea = document.getElementById('menu-area');

    //if (menuArea === 'undefined') {return;}

    $menuBtn.on('click', function() {
      $('body').toggleClass('show-menu');
    });

    $menuCloseBtn.on('click', function() {
      $('body').toggleClass('show-menu');
    });

    // var mc = new Hammer(menuArea);
    // mc.on("panleft", function() {
    //   $('body').removeClass('show-menu');
    // });

  },

  eventMenuBindings: function() {
    var eventMenu = $('.event-hamburger-container');
    var eventContent = document.getElementById('event-wrap');

    Hammer.defaults.touchAction = 'pan-y';

    if (eventContent === null) {return;}

    eventMenu.on('click', function() {
      $('body').toggleClass('show-event-menu');
    });

    var mc = new Hammer(eventContent);
    mc.on("panleft", function() {
      $('body').removeClass('show-event-menu');
    });

    mc.on("panright", function() {
      $('body').addClass('show-event-menu');
    });
  },

  mobileLayoutCheck: function() {
    var self = this;

      if (self.controller === undefined) {
        self.findAndInitScenes();
      }
      self.controller.enabled(true);
    
  },

  // updateProductOffset: function() {
  //   //if(self.scene.enabled() === false) {return;}
  //   $(window).scrollTop(0);
  //   conductor.eventOffset = (conductor.eventContent.height()) - (conductor.eventNav.height());
  //   conductor.navScene.duration(conductor.eventOffset);
  // },

  // productDeetController: function() {
  //   var self = this;

  //   if (self.wW < 850 || self.eventOffset < 0) {
  //     if(self.navScene.enabled() === false) {return;}
  //     self.navScene.enabled(false);
  //   } else {
  //     if(self.navScene.enabled() === true) {return;}
  //     self.navScene.enabled(true);
  //   }
  // },


  findAndInitScenes: function() {
    var self = this,
        scenes = $('section.scroll-section');

    self.controller = new ScrollMagic();
    self.controller.scrollTo(function(target) {
       TweenMax.to(window, 0.5, {
        scrollTo : {
          y : target, // scroll position of the target along y axis
          autoKill : true // allows user to kill scroll action smoothly
        },
        ease : Cubic.easeInOut
      });
    });
        
    scenes.each( function(key) {
      var sectionId = $(this).attr('id'),
          keyVar = 'scene' + key;   

      // var splitUrl = sectionId.split("/");    
      // var splitLength = (splitUrl.length) - 1;
      // var lastSeg = splitUrl[splitLength];

      conductor.sceneKeys[keyVar] = sectionId;

      //var section = '#'+sectionId+'-img';

      // console.log(sectionId);

      conductor[keyVar] = new ScrollScene({
        triggerElement: $('#'+sectionId),
        duration: $('#'+sectionId).outerHeight(),
        triggerHook: 0.5,
        reverse: true,
      }).addTo(self.controller);

      self.sceneTriggers(conductor[keyVar], this);

      // Indicators for debugging
      //conductor[keyVar].addIndicators();
      
    });

    // var tween = TweenMax.fromTo(
    //     "#thumbnail", 
    //     1, 
    //     {scale: "1", y: 0}, 
    //     {scale: "1.2", y: 150} 
    //   );
  
    var tween = TweenMax.fromTo(
      "#thumbnail", 
      1, 
      {y: 0}, 
      {y: 150} 
    );

    self.headerScene = new ScrollScene({
      triggerElement: ".header-sticky",
      triggerHook: 0,
      reverse: true
    }).setPin('.header-sticky').addTo(self.controller);

    self.headerScene.on('enter', function(){
      $('body').addClass('sticky');
    });

    self.headerScene.on('leave', function(){
      $('body').removeClass('sticky');
    });

    //conductor.headerScene.addIndicators();

    self.introScene = new ScrollScene({
      triggerElement: "body",
      //triggerHook: "onEnter",
      triggerHook: 0,
      duration: self.wH,
      reverse: true
    }).setTween(tween).addTo(self.controller);

    //conductor.introScene.addIndicators();

    self.navScene = new ScrollScene({
      triggerElement: ".content-wrap",
      //duration: conductor.eventOffset,
      duration: self.eventContent,
      triggerHook: 0.02,
      reverse: true
    }).setPin(".event-navigation nav").addTo(self.controller);

    // self.navScene.on("progress", function (event) {
    //   console.log("Scene progress changed to " + event.progress);
    // });

    // Indicators for debugging
    //conductor.navScene.addIndicators();
  },

  sceneTriggers: function(scene, element) {
    var self = this;
    scene.on('enter', function() {
      self.isScroll = true;
      self.updateActiveSection(element);
    });
  },

  updateSceneDuration: function() {
    for(var scene in conductor.sceneKeys) {
      if (scene) {        
        var value = conductor.sceneKeys[scene];
        var newHeight = $('#'+value).outerHeight();
        conductor[scene].duration(newHeight);
      }
    }

    conductor.introScene.duration(conductor.wH);
    conductor.navScene.duration(conductor.eventContent);
  },

  updateActiveSection: function(element) {
    var self = this,
        sectionId = $(element).data('hash');
        //hash = window.location.hash;

    if (self.initialLoad || self.initialLoad === undefined) {
      self.isScroll = false;
      self.initialLoad = false;
      return;
    }

    $('.event-navigation h1').removeClass('active');
    $('h1.'+sectionId).addClass('active');

    //console.log('SECTION ID ' + sectionId);

    if (self.isScroll){
      window.location.hash = sectionId+'-';
      return;
    }

    // if(self.$html === undefined) {return;}

    // self.$html.animate({
    //   scrollTop: $(hash).offset().top
    // }, 500);
  },

  eventContentHeight: function() {
    var self = this;

    self.eventContent = ($('.event-content').height()) - 620;
  },

  hideLoader: function() {
    var self = this;

    self.$loader.addClass('loaded').delay(700).fadeOut();
  },

  // showScrollTop: function() {
  //   var self = this;
  //   var btt = $('.back-to-top');

  //   if (self.scrollPos > 1000) {
  //     btt.addClass('visible');
  //   } else {
  //     btt.removeClass('visible');
  //   }
  // }

};




export default conductor;



$(window).load(function() {
  document.body.scrollTop = document.documentElement.scrollTop = 0;
  conductor.hideLoader();

});


// Bind scroll to anchor links
$('.event-navigation').on("click", "h3", function(e) {
  var id = $(this).data("section");

  if(id.length > 0) {
    e.preventDefault();
    // trigger scroll
    if (conductor.controller !== undefined) {
      if (conductor.controller.enabled()) {
        var location = "#"+id;
        conductor.controller.scrollTo(location);
      }
    }

    // If supported by the browser we can also update the URL
    if (window.history && window.history.pushState) {
      history.pushState("", document.title);
    }
  }

});

// $(window).scroll(function() {
//   conductor.showScrollTop();
// });

// Window resize
$(window).resize($.debounce( 100, function() {
  conductor.updateWindowDimensions();
  conductor.mobileLayoutCheck();
  conductor.updateSceneDuration();
  conductor.eventContentHeight();
  // conductor.eventOffset();
}));

