/*
 * infocircle.js - by Dan Duke (retrobadger.net)
 *
 * This plugin create an infographic animation which has a continous rotation effect
 *
 * The math to calculate icon positions: http://stackoverflow.com/questions/14096138/find-the-point-on-a-circle-with-given-center-point-radius-and-degree
 */


(function ( $ ) {


  $.fn.infoCircle = function( options ){    

    // Setup starting canvas (some of the classes are required below)
    this.wrap("<div class='infographic_rotate_container'>").after("<div class='infographic_rotate_content'>");
    this.addClass("infographic_rotate_enable"); //Adds an enable class, allowing for styling only if js is available

    // Give last dt a class of selected (required for variable setup)
    this.find('dt:last').addClass("selected");

    // General settings that can be altered when plugin is called
    var settings = $.extend({
      initSpeed: 4.5, // Speed of load animation (0.1-10)
      frameLength: 1000/24, // How many milliseconds for each frame (1000/24 for 24fps is common)
      continuousSpeed: 0.5, // Speed of continuous animation (0.1-10)
      iconRadius: this.find('dt').width()/2, // Radius of span - do not use a css border as can break things (plugin should calculate this itself using your css)
      iconZoomRadius: this.find('dt.selected').width()/2, // Radius of zoomed item (plugin should calculate this itself using your css)
      circleRadius: 200 // Radius of the circle path to use (in pixels)
    }, options );

    // Remove .selected
    this.find('dt.selected').removeClass("selected");

    // Setup static variables  
    iconZoomDiff = settings.iconZoomRadius - settings.iconRadius;
    canvasRadius = settings.circleRadius + settings.iconZoomRadius; //The expanded size of the radius to include the spinning dt items    
    totalItems = this.find("dt").length; // The number of rotating elements
    pageLoaded = false;
    paused = false;    
    selectedItem = 0;
    delay = 10/totalItems;
    loadInfographic(this, settings);

    // Setup starting canvas (with variables)
    this.height(canvasRadius*2).width(canvasRadius*2);
    $('div.infographic_rotate_content').height(canvasRadius-iconZoomDiff).width(canvasRadius-iconZoomDiff).css("margin", (canvasRadius/2)+(iconZoomDiff/2));
    this.find("dt").css("top", (settings.circleRadius*2)).css("left", settings.circleRadius);
    

    // Listener to pause animation
    this.hover(
      function(){
        paused = true;
      },
      function(){
        if(selectedItem === 0){
          paused = false;
        }
      }
    );


    // Click listener for items
    this.find("dt").click(function(){
      // zoom in icon graphic
      if($(this).hasClass('selected')){
        removeInfo();
      }else{
        removeInfo();
        $(this).addClass('selected', 500);
      
        // Setup info area in center
        infographicTitle = '<h3>'+$(this).text()+'</h3>';
        infographicDetail = '<p>'+$(this).next("dd").text()+'</p>';
        infographicDetailClose = '<a href="#" class="infographic_detail_close">close</a>';
        selectedItem = 1;
        $(this).parent().siblings("div.infographic_rotate_content").html(infographicTitle + infographicDetail + infographicDetailClose);
      }
    })


    // Click listener for information 'close'
    $("div.infographic_rotate_container").on("click", "a.infographic_detail_close", function(event){
      removeInfo();      
      return false;
    });


    // Return this (so plugin is chainable)
    return this;

  };


  function removeInfo(){
    $('.selected').removeClass('selected', 500);
    $("div.infographic_rotate_content").html("");
    selectedItem = 0;
  }



  /*
   * Starts off the proces of loading the infographic in a visual manner
   */
  function loadInfographic(theList, settings){

    // If degrees variable (used for incrementation) is unset, then create it now
    if(typeof degrees === 'undefined'){
      degrees = 1;
    }

    // Work out whether to increment again, or confirm page is loaded
    if(degrees >= 360){

      // If whole page is now loaded, than disable this loop
      pageLoaded=true;
      degrees = 0;
      initToContinuousTransition(theList, settings)
          
    }else{

      $(theList).find("dt").each(function(i){

        // Calculate at what degree this item should start animating
        startAt = i*(360/totalItems);

        // Confirm whether this item should animate yet (allows for staggering)
        if(degrees > startAt){

          //Sets offset due to staggering
          offset = degrees - startAt;

          newPositions = calculatePosition(offset, settings);

          // Move this item to it's now locations
          $(theList).find("dt:eq("+i+")").css("top",newPositions[1]).css("left",newPositions[0]);
        }

      });

      // Increment degrees of start item by 1;
      degrees = degrees + settings.initSpeed;
    }


    // every x seconds, animate the display (until pageLoaded=true)
    if(!pageLoaded){
      setTimeout(function(){
        loadInfographic(theList, settings);
      }, settings.frameLength);
    }
        
  }


  /*
   * Transition function for moving from the initialization to continous animations
   */
  function initToContinuousTransition(theList, settings){

    console.log('===transition===');

    // Setup initial variables for transition
    if(typeof transitionCycle === 'undefined'){
      transitionState = true;
      transitionTime = 2; // Seconds to complete the transition
      transitionCycle = 0; // Which cycle are we currently on
      transitionTimeCounter = 0;
      transitionSpeed = settings.initSpeed;
    }
    

    // How many seconds have already cyce through of the transition?
    if((settings.frameLength*transitionCycle)%1000 === 0){
      transitionTimeCounter++;
    }




    // The variables for calculating the speed change

    //Difference between the init and continous cycle lengths
    speedDifference = settings.initSpeed - settings.continuousSpeed;

    // Total expected cycles
    totalExpectedCycles = (transitionTime*1000)/settings.frameLength;

    // Difference between every cycle (total expected cycles / transitionTime)
    speedIncrement = speedDifference/totalExpectedCycles;

    // Slowly alter the speed
    transitionSpeed = transitionSpeed - speedIncrement;

    // Reset degrees variable if too high    
    if (degrees >= 360){
      degrees = 0;
      //paused = true;
    }
          

    if(!paused){

      $(theList).find("dt").each(function(i){

        startAt = i*(360/totalItems);

        offset = degrees - startAt;

        //console.log("running");
        newPositions = calculatePosition(offset, settings);

        $(theList).find("dt:eq("+i+")").css("top",newPositions[1]).css("left",newPositions[0]);

      });
      degrees = degrees + transitionSpeed;
    }
      

    transitionCycle++;

    if(transitionTimeCounter <= transitionTime){
      setTimeout(function(){
        initToContinuousTransition(theList, settings, transitionState);        
      }, settings.frameLength);
    }else{
      transitionState = false;
      infinitePlayInfographic(theList, settings, transitionState);
    }

    
  }



  /*
   * Duplicate of init method so it works on a continous loop once page is loaded
   */
  function infinitePlayInfographic(theList, settings, transitionState){

    // Reset degrees variable if too high
    if (degrees >= 360){
      degrees = 0;
      //paused = true;
    }
        

    if(!paused){

      $(theList).find("dt").each(function(i){

        startAt = i*(360/totalItems);

        offset = degrees - startAt;

        //console.log("running");
        newPositions = calculatePosition(offset, settings);

        $(theList).find("dt:eq("+i+")").css("top",newPositions[1]).css("left",newPositions[0]);

      });
      degrees = degrees + settings.continuousSpeed;
    }

    if(!transitionState){
      setTimeout(function(){
        infinitePlayInfographic(theList, settings, transitionState);
      }, settings.frameLength);
    }

  }



  /*
   * The functionality to calculate where a current icon should be placed using:
   *   iconRadius = how big are the icons icon
   *   circleRadius = how big is the circle path
   *   offset = what is the offset of this specific icon (so they are all equal space apart) - this has already had degrees and time applied to it
   */
  function calculatePosition(offset, settings){
    // Convert the degrees and offset into radians
    radian = offset * (Math.PI/180);

    // Offset the center of the circle, this is needed due to the padding set above with iconRadius
    circleCenter = settings.circleRadius+settings.iconZoomRadius;

    //Calculate the new x/y positions
    x = Math.round(circleCenter + (settings.circleRadius * Math.sin(radian)))-settings.iconRadius, //circles parametric function
    y = Math.round(circleCenter + (settings.circleRadius * Math.cos(radian)))-settings.iconRadius; //circles parametric function

    return Array(x, y);
  }


}( jQuery ));