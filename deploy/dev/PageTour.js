//========= Helper Utilities ===========

function intersection(x, y) {
        x.sort();
        y.sort();
        var i = j = 0;
        var ret = [];
        while (i < x.length && j < y.length) {
            if (x[i] < y[j]) i++;
            else if (y[j] < x[i]) j++;
            else {
                ret.push(i);
                i++, j++;
            }
        }
        return ret;
}

/**
 * Set/UnSet Visiblity:hidden 
 * */
(function($) {
    $.fn.invisible = function() {
        return this.each(function() {
            $(this).css("visibility", "hidden");
        });
    };
    $.fn.visible = function() {
        return this.each(function() {
            $(this).css("visibility", "visible");
        });
    };
}(jQuery));

/**
 * Rotate Div
 */
$.fn.rotate = function(degrees) {
    var self = $(this);
    self.css({
        '-webkit-transform' : 'rotate(' + degrees + 'deg)',
        '-moz-transform' : 'rotate(' + degrees + 'deg)',
        '-ms-transform' : 'rotate(' + degrees + 'deg)',
        'transform' : 'rotate(' + degrees + 'deg)'
    });
};

/**
 * Get hidden elements width and height with jQuery 
 * */
/*! Copyright 2012, Ben Lin (http://dreamerslab.com/)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version: 1.0.15
 *
 * Requires: jQuery >= 1.2.3
 */
;( function ( $ ){
  $.fn.addBack = $.fn.addBack || $.fn.andSelf;

  $.fn.extend({

    actual : function ( method, options ){
      // check if the jQuery method exist
      if( !this[ method ]){
        throw '$.actual => The jQuery method "' + method + '" you called does not exist';
      }

      var defaults = {
        absolute      : false,
        clone         : false,
        includeMargin : false
      };

      var configs = $.extend( defaults, options );

      var $target = this.eq( 0 );
      var fix, restore;

      if( configs.clone === true ){
        fix = function (){
          var style = 'position: absolute !important; top: -1000 !important; ';

          // this is useful with css3pie
          $target = $target.
            clone().
            attr( 'style', style ).
            appendTo( 'body' );
        };

        restore = function (){
          // remove DOM element after getting the width
          $target.remove();
        };
      }else{
        var tmp   = [];
        var style = '';
        var $hidden;

        fix = function (){
          // get all hidden parents
          $hidden = $target.parents().addBack().filter( ':hidden' );
          style   += 'visibility: hidden !important; display: block !important; ';

          if( configs.absolute === true ) style += 'position: absolute !important; ';

          // save the origin style props
          // set the hidden el css to be got the actual value later
          $hidden.each( function (){
            var $this = $( this );

            // Save original style. If no style was set, attr() returns undefined
            tmp.push( $this.attr( 'style' ));
            $this.attr( 'style', style );
          });
        };

        restore = function (){
          // restore origin style values
          $hidden.each( function ( i ){
            var $this = $( this );
            var _tmp  = tmp[ i ];

            if( _tmp === undefined ){
              $this.removeAttr( 'style' );
            }else{
              $this.attr( 'style', _tmp );
            }
          });
        };
      }

      fix();
      // get the actual value with user specific methed
      // it can be 'width', 'height', 'outerWidth', 'innerWidth'... etc
      // configs.includeMargin only works for 'outerWidth' and 'outerHeight'
      var actual = /(outer)/.test( method ) ?
        $target[ method ]( configs.includeMargin ) :
        $target[ method ]();

      restore();
      // IMPORTANT, this plugin only return the value of the first element
      return actual;
    }
  });
})( jQuery );

//========= Helper Utilities ===========
/**
 * InstructionLink
 * Holds instruction Block instance in the chain of Instruction Blocks
 */
function InstructionLink(instructionObject) {
	"use strict";
    this.constructor(instructionObject);
}

InstructionLink.prototype.constructor = function (instructionObject) {
	"use strict";
	this.InstructionObject = instructionObject;
	this.ID = instructionObject.getID();
	this.nextInstruction = null;
	this.previousInstruction = null;
	this.index = null;  // TODO: implement sequence numbers for adhoc insertion based on sequence. to check possiblities
};
/**
 * InstructionList
 * Holds a collection (linked list) of all the Instruction Blocks in a single Page Tour
 * 
 */
function InstructionsList() {
    "use strict";
	this.constructor();
}
InstructionsList.prototype.constructor = function () {
	"use strict";
	this.firstInstruction = null;
	this.lastInstruction = null;
	this.size = 0;
};

InstructionsList.prototype.getFirstInstruction = function () {
	"use strict";
	return this.firstInstruction;
};

InstructionsList.prototype.getLastInstruction = function () {
	"use strict";
	return this.lastInstruction;
};

InstructionsList.prototype.getSize = function () {
	"use strict";
	return this.size;
};

InstructionsList.prototype.add = function (instructionObject) {
    "use strict";
	var newInstruction = new InstructionLink(instructionObject);
	newInstruction.InstructionObject = instructionObject;

	if (this.firstInstruction === null) {
		this.firstInstruction = newInstruction;
		this.lastInstruction = newInstruction;
	} else {
		this.lastInstruction.nextInstruction = newInstruction;
		newInstruction.previousInstruction = this.lastInstruction;
		this.lastInstruction = newInstruction;
	}
	this.size = this.size + 1;   // increment the size
};

InstructionsList.prototype.addAfter = function (ID, instructionObject) {
	"use strict";
	//TODO : implement inserting of instructions in-between sequence
};

InstructionsList.prototype.remove =  function (ID) {
	"use strict";
	var currentInstruction = this.firstInstruction;

	if (this.size === 0) {
		return;
	}

	var wasDeleted = false;

	/* Are we deleting the first node? */
	if (ID === currentInstruction.ID) {

		/* Only one node in list, be careful! */
		if (currentInstruction.nextInstruction === null) {
			this.firstInstruction.InstructionObject = null;
			this.firstInstruction = null;
			this.lastInstruction = null;
			this.size = this.size - 1;
			return;
		}

		currentInstruction.InstructionObject = null;
		currentInstruction = currentInstruction.nextInstruction;
		currentInstruction.previousInstruction = null;
		this.firstInstruction = currentInstruction;
		this.size = this.size - 1;
		return;
	}

	while (true) {
		/* If end of list, stop */
		if (currentInstruction === null) {
			wasDeleted = false;
			break;
		}

		/* Check if the data of the next is what we're looking for */
		var nextInstruction = currentInstruction.nextInstruction;
		if (nextInstruction !== null) {
			if (ID === nextInstruction.ID) {

				/* Found the right one, loop around the node */
				var nextNextInstruction = nextInstruction.nextInstruction;
				currentInstruction.nextInstruction = nextNextInstruction;
				nextNextInstruction.previousInstruction = currentInstruction.nextInstruction;

				nextInstruction = null;
				wasDeleted = true;
				break;
			}
		}

		currentInstruction = currentInstruction.nextInstruction;
	}

	if (wasDeleted) {
		this.size = this.size - 1;
	}
};

InstructionsList.prototype.find =  function (ID) {
	"use strict";
	var currentInstruction = this.firstInstruction;

	if (this.size === 0) {
		return null;
	}
// check first node
	if (ID === currentInstruction.ID) {
		return currentInstruction;
	}

	while (true) {
		/* If end of list, stop */
		if (currentInstruction === null) {
			return null;
		}

		/* Check if the data of the next is what we're looking for */
		var nextInstruction = currentInstruction.nextInstruction;
		if (nextInstruction !== null) {
			if (ID === nextInstruction.ID) {
				/* Found the right one, loop around the node */
				return nextInstruction;
			}
		}

		currentInstruction = currentInstruction.nextInstruction;
	}
};
/**
 * Target Element 
 * maintains properties and methods related to Target element of Overlay instructions
 */
function TargetElement(elementID) {
    "use strict";
	this.constructor(elementID);
}
TargetElement.prototype.ID = "";
TargetElement.prototype.Widget = "";
TargetElement.prototype.constructor = function (elementID) {
	"use strict";
	if (elementID) {
		this.ID = elementID;
		this.Widget = $('#' + this.ID);
		if (this.Widget.length <= 0) {
			alert("Target element with ID='" + elementID + "' not found on page");
		}
	} else {
		alert("Target Cannot be Empty");
	}
};
TargetElement.prototype.getPositionX1 = function () {
	"use strict";
	var targetElementPosition = this.Widget.offset();
	return targetElementPosition.left;
};
TargetElement.prototype.getPositionX2 = function () {
	"use strict";
	return (this.getPositionX1() + this.getWidth());
};
TargetElement.prototype.getPositionY1 = function () {
	"use strict";
	var targetElementPosition = this.Widget.offset();
	return targetElementPosition.top;
};
TargetElement.prototype.getPositionY2 = function () {
	"use strict";
	return this.getPositionY1() + this.getHeight();
};
TargetElement.prototype.getWidth = function () {
	"use strict";
	return this.Widget.actual('width');
};
TargetElement.prototype.getHeight = function () {
	"use strict";
	return this.Widget.actual('height');
};


/**
 * OverlayInstructions
 * Overlay instructions class
 * @params: {ID: desired ID of the OverlayInstruction Block,
 *           InstructionString: Instruction Title Text to be rendered,
 *           InstructionDetailsString: Instruction Detail Text to be rendered,
 *           targetID: "ID" of the target HTML element for which the Instruction is displayed,
 *           arrowImagePosition: [Primary position]String indication the direction that the arrow should point. Possible values [E,W,S,N,NE,NW,SE,SW],
 *           arrowImageURL: URL of a custom image that should be rendered instead of default arrow image,
 *           posX: default X-coordinate of the Instruction Block,
 *           posY: default Y-coordinate of the Instruction Block,
 *           arrowImageRotationAngle: Rotation angle for the arrow image,
 *           expandDetails: show details expanded by default
 *           additionalArrows: Array[] , show multiple arrows.  Possible values ["E","W","S","N","NE","NW","SE","SW"] }
 */

function OverlayInstructions(params) {
	"use strict";
	this.constructor(params);
	this.fireEvent("onInitialized");
}
OverlayInstructions.prototype.ControlID = "";
OverlayInstructions.prototype.targetElement = "";
OverlayInstructions.prototype.InstructionPositionFixed = false;  // if the x,y co-ordinates are defaulted by user
OverlayInstructions.prototype.InstructionPositionX = "";
OverlayInstructions.prototype.InstructionPositionY = "";
OverlayInstructions.prototype.deltaX = 5;  // 5px offset horizontal , so that the arrow does not stick to the element
OverlayInstructions.prototype.deltaY = 5;  // 5px vertical offset.
OverlayInstructions.prototype.InstructionBlockElment = null;
OverlayInstructions.prototype.InstructionOverlay = null;
OverlayInstructions.prototype.arrowPositionFixed = false;
OverlayInstructions.prototype.arrowPosition = "W";  // Primary arrow position{"E","W","S","N","NE","NW","SE","SW"}
OverlayInstructions.prototype.arrowsActive = {		// Secondary arrows that are active via. showArrow# i.e "additionalArrows" config
		"E" : false,
		"W" : false,
		"S" : false,
		"N"  : false,
		"NE" : false,
		"NW" : false,
		"SE" : false,
		"SW" : false
	};
OverlayInstructions.prototype.arrowImage = "";
OverlayInstructions.prototype.horizontalArrowImageHeight = 100;  
OverlayInstructions.prototype.horizontalArrowImageWidth = 100;  
OverlayInstructions.prototype.verticalArrowImageHeight = 100;  
OverlayInstructions.prototype.verticalArrowImageWidth = 100;  
OverlayInstructions.prototype.imageDimentionUnit = "%";  // px / %
OverlayInstructions.prototype.arrowImageRotationAngle = 0;
OverlayInstructions.prototype.arrowImageRotationFixed = false; // if the rotation angle is defaulted by the user
OverlayInstructions.prototype.instructionBlockTheme = "ChalkBoard";
OverlayInstructions.prototype.__Is_Rendered_Within_Tour__ = false;
OverlayInstructions.prototype.__Is_Active__ = false;
// arrowStyles keeps track of custom arrow image urls. Default is Current theme Css -> background-image property.
OverlayInstructions.prototype.arrowStyles = {
	"E" : "arrowImages/arrow-E.png",
	"W" : "arrowImages/arrow-W.png",
	"S" : "arrowImages/arrow-S.png",
	"N"  : "arrowImages/arrow-N.png",
	"NE" : "arrowImages/arrow-NE.png",
	"NW" : "arrowImages/arrow-NW.png",
	"SE" : "arrowImages/arrow-SE.png",
	"SW" : "arrowImages/arrow-SW.png"
};
OverlayInstructions.prototype.InstructionText = "";
OverlayInstructions.prototype.InstructionDetailsText = "";
OverlayInstructions.prototype.events = { };

OverlayInstructions.prototype.constructor = function (params) {
	"use strict";
	if (this.validateArguments(params.ID, params.InstructionString, params.InstructionDetailsString, params.targetID, params.arrowImagePosition, params.arrowImageURL, params.posX, params.posY)) {
		this.ControlID = params.ID;
		this.targetElement = (params.targetID) ? new TargetElement(params.targetID) : "";
		this.InstructionText = params.InstructionString;
		this.InstructionDetailsText = params.InstructionDetailsString;
		//	Create Instruction Block
		this.createInstructionBlockElement();
		this.createOverlay();

		if (params.arrowImagePosition && this.isValidArrowPosition(params.arrowImagePosition)) {
			this.setArrowPosition(params.arrowImagePosition);
			this.arrowPositionFixed = true;
			if (params.arrowImageURL) {
				this.setArrowImage(params.arrowImageURL);
			}
		} else {
			this.autoSetArrowPosition();
		}

		if (params.posX && params.posY) {
			this.InstructionPositionFixed = true;
			this.InstructionPositionX = params.posX;
			this.InstructionPositionY = params.posY;
			//this.setPosition(params.posX, params.posY);
		} else {
			this.InstructionPositionFixed = false;
		}
		
		if(params.arrowImageRotationAngle) {
			this.arrowImageRotationFixed = true;
			this.arrowImageRotationAngle = params.arrowImageRotationAngle;
		} else {
			this.arrowImageRotationFixed = false;
		}

	    this.showArrow(this.getArrowPosition(), false);
	    var eventData = { OverlayInstructionObj : this };
	    $("#InstructionOKButton_" + this.ControlID).on("click", eventData, this.OnInstructionOKButtonClick);

	    $("#MoreDetailButton_" + this.ControlID).on("click", eventData, this.ToggleMoreDetail);
	
	    if(params.expandDetails) {
		   this.ToggleMoreDetail({data:eventData});
	    }
	    
	    if(params.additionalArrows) {
	    	for (var i=0 ; i < params.additionalArrows.length ; i++) {
	    		if (this.isValidArrowPosition(params.additionalArrows[i])) {
	    			this.showArrow(params.additionalArrows[i],true);
	    		}
	    	}
	    }
	    
	    
	}
	this.events = {
			"__on_show_next_instruction__": true,  // @private :used for PageTour
			"onOkClick": true,
			"onInitialized": true,
			"onShow": true,
			"onHide": true
		};
	// Re-position on window re-size
	this.__Is_Active__ = false;
	var me = this;
	$(window).on('resize',function() { if(me.__Is_Active__) { me.refreshInstructionBlockPosition(); } });
	
};

OverlayInstructions.prototype.ToggleMoreDetail = function (eventData) {
	"use strict";
	var OverlayInstructionObj = eventData.data.OverlayInstructionObj;

	if (($("#MoreInstructionDetail_" + OverlayInstructionObj.ControlID).is(':visible'))) {
		$("#MoreDetailButton_" + OverlayInstructionObj.ControlID).text("more...");
		//$("#MoreInstructionDetail_" + OverlayInstructionObj.ControlID).css("display","block");
		//$("#MoreInstructionDetail_" + OverlayInstructionObj.ControlID).hide({duration:"fast",easing:"swing",done:function() { OverlayInstructionObj.refreshInstructionBlockPosition(); }});
		$("#MoreInstructionDetail_" + OverlayInstructionObj.ControlID).animate({    
            height: "0px",
            overflow: "hidden"
        },
        {
             duration: 300,
             easing: "swing",
             done: function() {              	  
             	$("#MoreInstructionDetail_" + OverlayInstructionObj.ControlID).css("display","none");
             	OverlayInstructionObj.refreshInstructionBlockPosition();
             }
         });
	} else {
		$("#MoreDetailButton_" + OverlayInstructionObj.ControlID).text("less...");
		$("#MoreInstructionDetail_" + OverlayInstructionObj.ControlID).css("display","block");
		//$("#MoreInstructionDetail_" + OverlayInstructionObj.ControlID).show({duration:"fast",easing:"swing",done:function() { OverlayInstructionObj.refreshInstructionBlockPosition(); }});
		$("#MoreInstructionDetail_" + OverlayInstructionObj.ControlID).animate({    
            height: "100px",
            overflow : "scroll"
        },
        {
             duration: 300,
             easing: "swing",
             done: function() { 
             	          OverlayInstructionObj.refreshInstructionBlockPosition();
             	          }
         });
	}
	return false; // To prevent reset of scroll position on link click
};

OverlayInstructions.prototype.OnInstructionOKButtonClick = function (eventData) {
	"use strict";
	var OverlayInstructionObj = eventData.data.OverlayInstructionObj;
	OverlayInstructionObj.hide();
	OverlayInstructionObj.fireEvent("onOkClick");
};

OverlayInstructions.prototype.addEventListener = function (event, handler) {
	"use strict";
	if (this.events[event]) {
		this.events[event] = handler;
	}
};

OverlayInstructions.prototype.removeEventListener = function (event) {
	"use strict";
	if (this.events[event]) {
		this.events[event] = true;
	}
};

OverlayInstructions.prototype.fireEvent = function (event, eventData) {
	"use strict";
	if (typeof this.events[event] === 'function') {
		this.events[event].apply(this, eventData);
	}
};


OverlayInstructions.prototype.hideOverlay = function () {
	"use strict";
	var overlay = this.getOverlay();
	overlay.css("display","none");;
};

OverlayInstructions.prototype.showOverlay = function () {
	"use strict";
	var overlay = this.getOverlay();
	overlay.css("display","block");
};

OverlayInstructions.prototype.getID = function () {
	"use strict";
	return this.ControlID;
};

OverlayInstructions.prototype.getOverlay = function () {
	"use strict";
	var overlay;
	if (!this.InstructionOverlay) {
		overlay = this.createOverlay();
	} else {
		overlay = this.InstructionOverlay;
	}
	return overlay;
};

OverlayInstructions.prototype.resizeOverlay = function () {
	var overlay=this.getOverlay();
	overlay.height($(document).height()-1);
	overlay.width($(document).width()-1);
};

OverlayInstructions.prototype.__reducePageTourOverlayOpacity = function () {
	
};


OverlayInstructions.prototype.createOverlay = function () {
	"use strict";
	var overlay = $('#InstructionsOverlay_' + this.ControlID);
	if (overlay.length <= 0) {
		overlay = $('<div class="InstructionsOverlay" id="InstructionsOverlay_' + this.ControlID + '" style="display:none; height:' + $(document).height() + 'px; width:' + $(document).width() + 'px;"></div>');
		$("body").append(overlay);
	}
	this.InstructionOverlay = overlay;
	return overlay;
};
OverlayInstructions.prototype.getInstructionBlockElement = function () {
	"use strict";
	if (!this.InstructionBlockElment) {
		this.createInstructionBlockElement();
	}
	return this.InstructionBlockElment;
};


OverlayInstructions.prototype.getHorizontalArrowImageHeight = function () {
    "use strict";
	// used by : ArrowImage_W_Div , ArrowImage_E_Div
	var arrowImage_W_Div_Element = $('#' + 'ArrowImage_W_Div_' + this.ControlID);
	return(arrowImage_W_Div_Element.height());
		
};
OverlayInstructions.prototype.getHorizontalArrowImageWidth = function () {
    "use strict";
	// used by : ArrowImage_SE_Div , ArrowImage_SW_Div , ArrowImage_E_Div , ArrowImage_W_Div , ArrowImage_NE_Div , ArrowImage_NW_Div
	var arrowImage_SE_Div_Element = $('#' + 'ArrowImage_SE_Div_' + this.ControlID);
	return(arrowImage_SE_Div_Element.width());
};
OverlayInstructions.prototype.getVerticalArrowImageHeight = function () {
    "use strict";
	// used by : ArrowImage_S_Div , ArrowImage_SE_Div , ArrowImage_SW_Div , ArrowImage_NE_Div , ArrowImage_N_Div , ArrowImage_NW_Div
	var arrowImage_S_Div_Element = $('#' + 'ArrowImage_S_Div_' + this.ControlID);
	return(arrowImage_S_Div_Element.height());
	
};
OverlayInstructions.prototype.getVerticalArrowImageWidth = function () {
    "use strict";
	// used by : ArrowImage_S_Div , ArrowImage_N_Div
	var arrowImage_S_Div_Element = $('#' + 'ArrowImage_S_Div_' + this.ControlID);
	return(arrowImage_S_Div_Element.width());
};


OverlayInstructions.prototype.autoSetArrowPosition = function () {
    "use strict";
	var targetElementPositionX1, targetElementPositionX2, targetElementPositionY1, targetElementPositionY2, targetElementWidth, targetElementHeight, screenHeight, screenWidth, instructionContentHeight, instructionContentWidth;
	var arrowToTargetPadding = 30; // spacing between arrow and target element. 

	if (this.targetElement) {

		// Target element dimensions
		targetElementPositionX1 = this.targetElement.getPositionX1();
		targetElementPositionY1 = this.targetElement.getPositionY1();
		targetElementWidth = this.targetElement.getWidth();
		targetElementHeight = this.targetElement.getHeight();
		targetElementPositionX2 = this.targetElement.getPositionX2();
		targetElementPositionY2 = this.targetElement.getPositionY2();

		// screen dimensions
		screenHeight = $(window).height();
		screenWidth = $(window).width();


		// instruction block dimensions
		var instructionContenElement = $('#' + 'Cell-C_' + this.ControlID);
		instructionContentHeight = instructionContenElement.actual('height');
		instructionContentWidth = instructionContenElement.actual('width');

		// resultant Horizontal & Vertical height-width of instruction block
		var horizontal_InstructionBlockHeight, horizontal_InstructionBlockWidth;
		horizontal_InstructionBlockHeight = (this.getHorizontalArrowImageHeight() > instructionContentHeight) ? this.getHorizontalArrowImageHeight() : instructionContentHeight;
		horizontal_InstructionBlockWidth = this.getHorizontalArrowImageWidth() + instructionContentWidth;

		var vertical_InstructionBlockHeight, vertical_InstructionBlockWidth;
		vertical_InstructionBlockHeight = this.getVerticalArrowImageHeight() + instructionContentHeight;
		vertical_InstructionBlockWidth = (this.getVerticalArrowImageWidth() > instructionContentWidth) ? this.getVerticalArrowImageWidth() : instructionContentWidth;

		// Determine the appropriate arrow position based on target dimensions & screen dimensions

		// determine instruction block position left/right of target element
		if ((targetElementPositionX2 + horizontal_InstructionBlockWidth) < screenWidth) {  // if right possible
			// RIGHT
			// possible positions
			// W, NW,SW
			if (targetElementPositionY2 > horizontal_InstructionBlockHeight) {
				//position = SW
				this.setArrowPosition("SW");

			} else if (targetElementPositionY2 > (horizontal_InstructionBlockHeight / 2)) {  // if space above target is greater than 1/2 of inst_block height
				// position = W
				this.setArrowPosition("W");
			} else {
				//position = NW
				this.setArrowPosition("NW");
			}

		} else if ((horizontal_InstructionBlockWidth + arrowToTargetPadding) <= targetElementPositionX1) {   // if left possible
			// LEFT
			// possible positions
			// E,NE,SE
			if (targetElementPositionY1 > horizontal_InstructionBlockHeight) {
				//position = SE
				this.setArrowPosition("SE");

			} else if (targetElementPositionY1 > (horizontal_InstructionBlockHeight / 2)) {  // if space above target is greater than 1/2 of inst_block height
				// position = E
				this.setArrowPosition("E");
			} else {
				//position = NE	
				this.setArrowPosition("NE");
			}

		} else if ((vertical_InstructionBlockHeight + arrowToTargetPadding) <= targetElementPositionY1) { //determine block above or below target element

			// ABOVE
			// possible positions
			// S,SW,SE
			if (targetElementPositionX1 > vertical_InstructionBlockWidth) {
				//position = SE
				this.setArrowPosition("SE");

			} else if (targetElementPositionX1 > (vertical_InstructionBlockWidth / 2)) {  // if space above target is greater than 1/2 of inst_block height
				// position = S
				this.setArrowPosition("S");
			} else {
				//position = SW				
				this.setArrowPosition("SW");
			}

		} else if ((targetElementPositionY2 + vertical_InstructionBlockHeight) < screenHeight) {
			// BELOW
			// possible positions
			// N,NE,NW
			if (targetElementPositionX1 > vertical_InstructionBlockWidth) {
				//position = NE
				this.setArrowPosition("NE");

			} else if (targetElementPositionX1 > (vertical_InstructionBlockWidth / 2)) {  // if space below target is greater than 1/2 of inst_block height
				// position = N
				this.setArrowPosition("N");
			} else {
				//position = NW		
				this.setArrowPosition("NW");
			}
		}

	} else {
		//	target element not found/defined , then take defaults
		this.setArrowPosition("NW");
	}
};

OverlayInstructions.prototype.setArrowPosition = function(arrowPosition) {
	this.arrowPosition = arrowPosition;
	this.arrowsActive[arrowPosition] = true;
};

OverlayInstructions.prototype.getArrowPosition = function() {
	return this.arrowPosition;
};

OverlayInstructions.prototype.calculateInstructionBlockCoOrdinates = function (arrowPosition) {
    "use strict";
	var instructionBlockX, instructionBlockY, arrowImageRotationAngle;
	if (this.isValidArrowPosition(arrowPosition)) {
		var targetElementPositionX1, targetElementPositionX2, targetElementPositionY1, targetElementPositionY2, targetElementWidth, targetElementHeight;
		// Target element dimensions
		targetElementPositionX1 = this.targetElement.getPositionX1();
		targetElementPositionY1 = this.targetElement.getPositionY1();
		targetElementWidth = this.targetElement.getWidth();
		targetElementHeight = this.targetElement.getHeight();
		targetElementPositionX2 = this.targetElement.getPositionX2();
		targetElementPositionY2 = this.targetElement.getPositionY2();

		// instruction block dimensions
		var instructionContenElement = $('#' + 'Cell-C_' + this.ControlID);
		var instructionContentHeight = instructionContenElement.actual('height');
		var instructionContentWidth = instructionContenElement.actual('width');
		
		// resultant Horizontal & Vertical height-width of instruction block
		var horizontal_InstructionBlockHeight, horizontal_InstructionBlockWidth;
		horizontal_InstructionBlockHeight = (this.getHorizontalArrowImageHeight() > instructionContentHeight) ? this.getHorizontalArrowImageHeight() : instructionContentHeight;
		horizontal_InstructionBlockWidth = this.getHorizontalArrowImageWidth() + instructionContentWidth;

		var vertical_InstructionBlockHeight, vertical_InstructionBlockWidth;
		vertical_InstructionBlockHeight = this.getVerticalArrowImageHeight() + instructionContentHeight;
		vertical_InstructionBlockWidth = (this.getVerticalArrowImageWidth() > instructionContentWidth) ? this.getVerticalArrowImageWidth() : instructionContentWidth;
		
		var correctionFactor; // This value is introduced to add correction to height of Instruction Block
		
		switch (arrowPosition) {
		case "NW":
			instructionBlockX = targetElementPositionX2 + this.deltaX;
			instructionBlockY = targetElementPositionY2 + this.deltaY;
			arrowImageRotationAngle = 0;//30;
			break;//done

		case "N":
			instructionBlockX = ((targetElementPositionX1 + (targetElementWidth / 2)) + this.deltaX) - (vertical_InstructionBlockWidth / 2);
			instructionBlockY = targetElementPositionY2 + this.deltaY;
			arrowImageRotationAngle = 0;//90;
			break;

		case "NE":
			correctionFactor = this.getHorizontalArrowImageWidth();
			instructionBlockX = targetElementPositionX1 - (horizontal_InstructionBlockWidth + this.deltaX) + correctionFactor;
			instructionBlockY = targetElementPositionY1  + this.deltaY;
			arrowImageRotationAngle = 0;//140;
			break;//done

		case "E":
			instructionBlockX = targetElementPositionX1 - (horizontal_InstructionBlockWidth + this.deltaX);
			correctionFactor = (($('#' + 'TopRow_' + this.ControlID)).height()) + (($('#' + 'Cell-E_' + this.ControlID)).height())/2;
			instructionBlockY = ((targetElementPositionY1 + (targetElementHeight / 2)) - this.deltaY) - ((horizontal_InstructionBlockHeight + correctionFactor) / 2);
			arrowImageRotationAngle = 0;//180;
			break; //done


		case "SE":
			correctionFactor = this.getVerticalArrowImageWidth();
			instructionBlockX = targetElementPositionX1 - (targetElementWidth / 2) - (vertical_InstructionBlockWidth + this.deltaX) + correctionFactor;
			correctionFactor = ($('#' + 'TopRow_' + this.ControlID)).height();
			instructionBlockY = targetElementPositionY1 - (vertical_InstructionBlockHeight + this.deltaY + correctionFactor);
			arrowImageRotationAngle = 0;//220;
			break;//done

		case "S":
			instructionBlockX = (targetElementPositionX1 + (targetElementWidth / 2)) - ((vertical_InstructionBlockWidth / 2) + this.deltaX);
			correctionFactor = ($('#' + 'TopRow_' + this.ControlID)).height();
			instructionBlockY = targetElementPositionY1 - (vertical_InstructionBlockHeight + correctionFactor + targetElementHeight + this.deltaY);
			arrowImageRotationAngle = 0;//270;
			break;//done


		case "SW":
			instructionBlockX = targetElementPositionX2 + this.deltaX;
			correctionFactor = ($('#' + 'TopRow_' + this.ControlID)).height();
			instructionBlockY = (targetElementPositionY1 + this.deltaY) - (vertical_InstructionBlockHeight + correctionFactor);
			arrowImageRotationAngle = 0;//330;
			break;//done

		case "W":
			instructionBlockX = targetElementPositionX2 + this.deltaX;
			correctionFactor = (($('#' + 'TopRow_' + this.ControlID)).height()) + (($('#' + 'Cell-W_' + this.ControlID)).height())/2;
			instructionBlockY = ((targetElementPositionY1) + this.deltaY) - ((horizontal_InstructionBlockHeight + correctionFactor) / 2);
			arrowImageRotationAngle = 0;
			break;//done

		default:
			instructionBlockX = 0;
		    instructionBlockY = 0;
		    arrowImageRotationAngle = 0;

		}
	} else {
		instructionBlockX = 0;
		instructionBlockY = 0;
		arrowImageRotationAngle = 0;
	}

	this.InstructionPositionX = (instructionBlockX < 0) ? 0 : instructionBlockX;
	this.InstructionPositionY = (instructionBlockY < 0) ? 0 : instructionBlockY;
	this.setArrowImageRotationAngle(arrowImageRotationAngle); //TODO: set Rotation angle & rotate the images instead of using separate images

};


OverlayInstructions.prototype.refreshInstructionBlockPosition = function () {
	"use strict";
	if(!this.InstructionPositionFixed && this.targetElement) {
		this.calculateInstructionBlockCoOrdinates(this.getArrowPosition());
	} else {
		// Default always centered position
		this.InstructionPositionX = (($(window).width()/2) - ($('#' + 'InstructionBlock_' + this.ControlID).width()/2));
		this.InstructionPositionY = (($(window).height()/2) - ($('#' + 'InstructionBlock_' + this.ControlID).height()/2));
	}
	this.setPosition(this.InstructionPositionX, this.InstructionPositionY);
	this.resizeOverlay();
	this.scrollToInstruction();
};


OverlayInstructions.prototype.getObsoleteArrowPositions =function (arrowPosition) {
	var unWantedArrowPositions = [];
	switch(arrowPosition) {
	case "NW":
		unWantedArrowPositions = ["N","NE","E","SE","S","SW","W"];
		break;

	case "N":
		unWantedArrowPositions = ["NW","NE","E","SE","S","SW","W"];
		break;

	case "NE":
		unWantedArrowPositions = ["N","NW","E","SE","S","SW","W"];
		break;

	case "E":
		unWantedArrowPositions = ["NW","N","NE","SE","S","SW","W"];
		break;

	case "SE":
		unWantedArrowPositions = ["NW","N","NE","E","S","SW","W"];
		break;

	case "S":
		unWantedArrowPositions = ["NW","N","NE","E","SE","SW","W"];
		break;

	case "SW":
		unWantedArrowPositions = ["NW","N","NE","E","SE","S","W"];
		break;

	case "W":
		unWantedArrowPositions = ["NW","N","NE","E","SE","S","SW"];
		break;

	default:
		unWantedArrowPositions = ["NW","N","NE","E","SE","S","SW","W"];

	}
	
	return unWantedArrowPositions;
};

OverlayInstructions.prototype.getAllObsoleteArrowPositions = function () {
	var position,arrowPositionsToHide;
	for (position in this.arrowsActive) {
		if (this.arrowsActive.hasOwnProperty(position)) {
		    if(this.arrowsActive[position] === true) {
		    	if(arrowPositionsToHide){
		    		arrowPositionsToHide = intersection(arrowPositionsToHide,this.getObsoleteArrowPositions(position));
		    	} else {
		    		arrowPositionsToHide = this.getObsoleteArrowPositions(position);
		    	}
		    }
		}
	}
	return arrowPositionsToHide;
};

OverlayInstructions.prototype.hideArrowCells = function (arrowPositionsToHide) {
	var i;
	for (i=0 ; i < arrowPositionsToHide.length ; i++) {
			$('#Cell-' + arrowPositionsToHide[i] + '_' + this.ControlID).css("display","none");
	}
};

OverlayInstructions.prototype.hideUnWantedCells = function () {
	"use strict";
	var position,arrowPositionsToHide;
	if(!this.InstructionPositionFixed) {
		// reset the display of all arrow cells
		for (position in this.arrowsActive) {
			if (this.arrowsActive.hasOwnProperty(position)) {
				$('#Cell-' + position + '_' + this.ControlID).css("display","table-cell");
			}
		}
		// hide the unwanted cells
		arrowPositionsToHide = this.getAllObsoleteArrowPositions();
		this.hideArrowCells(arrowPositionsToHide);
		/*if ((this.getArrowPosition().indexOf("S") !== -1) || this.getArrowPosition() === "W" || this.getArrowPosition() === "E") {
			// hide 1st row TopRow_
			$('#TopRow_'+ this.ControlID).hide();
			//$('#Cell-NW_' + this.ControlID).hide();
			//$('#Cell-N_' + this.ControlID).hide();
			//$('#Cell-NE_' + this.ControlID).hide();
		}
		if (arrowposition.indexOf("E") !== -1) {
			//hide 1st column Cell-NW_inst1,Cell-W_inst1,Cell-SW_inst1
			$('#Cell-NW_' + this.ControlID).hide();
			$('#Cell-W_' + this.ControlID).hide();
			$('#Cell-SW_' + this.ControlID).hide();
		}*/
	}
	
	
};

OverlayInstructions.prototype.setPosition = function (positionX, positionY) {
	"use strict";
	//$('#InstructionBlock_' + this.ControlID).offset({top: positionY, left: positionX});  
	// $.offset has issues determining current offset of hidden element, hence misplaces the co-ordinates
	//using the old css way :)
	$('#InstructionBlock_' + this.ControlID).css('top', positionY);
	$('#InstructionBlock_' + this.ControlID).css('left', positionX);
};

OverlayInstructions.prototype.show = function (_Is_Rendered_Within_Tour_) {
	"use strict";
	if(!this.__Is_Active__) {
		this.showOverlay();
		this.setArrowImageRotationAngle();  //TODO : Re-Check the implementation, is this necessary ?? 	
		var me = this;
		$('#InstructionBlock_' + this.ControlID).show({duration:"fast",easing:"swing",start:function() { me.refreshInstructionBlockPosition(); }});
		this.__Is_Active__ = true;
		if(_Is_Rendered_Within_Tour_) {
			this.__Is_Rendered_Within_Tour__ = (_Is_Rendered_Within_Tour_ === true) ? true : false;
		}
		//this.resizeOverlay();
		//this.refreshInstructionBlockPosition();
		this.fireEvent("onShow");
	}
};

OverlayInstructions.prototype.scrollToInstruction = function() {
	var instructionBlockID = this.getID();
    topPadding = 100;
	var currentScrollPosition = $("#InstructionBlock_" + instructionBlockID).scrollTop(); // $(document).scrollTop();
    var moveTo = $("#InstructionBlock_" + instructionBlockID).offset().top - topPadding;
	//alert("currentScrollPosition=" + currentScrollPosition + "  moveTo=" + moveTo + "   (currentScrollPosition + topPadding) = " + (currentScrollPosition + topPadding));
	//if(moveTo > (currentScrollPosition + topPadding)) {
		$('html, body').stop().animate({
		    scrollTop: moveTo
		    },1000);
    //}
};

OverlayInstructions.prototype.destroy = function () {
	"use strict";
	$("#InstructionOKButton_" + this.ControlID).off("click");
	$("#MoreDetailButton_" + this.ControlID).off("click");
	$('#InstructionBlock_' + this.ControlID).remove();
	this.getOverlay().remove();
	this.removeEventListener("onOkClick");
	this.removeEventListener("onInitialized");
	this.removeEventListener("onShow");
	this.removeEventListener("onHide");
};

OverlayInstructions.prototype.hide = function () {
	"use strict";
	if(this.__Is_Active__) {
		this.hideOverlay();
		$('#InstructionBlock_' + this.ControlID).hide();
		this.__Is_Active__ = false;
		this.fireEvent("onHide");
		// if rendered by TourManager, then trigger next instruction event
		if(this.__Is_Rendered_Within_Tour__) {
			this.fireEvent("__on_show_next_instruction__");	
		}
		this.__Is_Rendered_Within_Tour__ = false;
	}
};

OverlayInstructions.prototype.setTheme = function (theme) {
	"use strict";
	if (this.instructionBlockTheme) {
		$('#InstructionBlock_' + this.ControlID).removeClass(this.instructionBlockTheme);
	}
	if (theme) {
		$('#InstructionBlock_' + this.ControlID).addClass(theme);
	}

};

OverlayInstructions.prototype.hideAllArrows = function () {
	"use strict";
	var position;
	for (position in this.arrowStyles) {
		if (this.arrowStyles.hasOwnProperty(position)) {
			this.arrowsActive[position] = false;
		    $('#Cell-' + position + '_' + this.ControlID).invisible();
		}
	}
	//TODO: decide if to clear the this.arrowPosition too.
};

OverlayInstructions.prototype.showArrow = function (newArrowPosition, keepCurrentArrow) {
	"use strict";
	var arrowPosition = this.getArrowPosition();
	if (newArrowPosition && this.isValidArrowPosition(newArrowPosition)) {
		if (!keepCurrentArrow) {
			this.hideAllArrows();
			this.setArrowPosition(newArrowPosition);
		} /*else {
			// Adjust the hidden cells , so the width is compensated and arrow appears in right cell
			if ((arrowPosition.indexOf("S") !== -1) || arrowPosition === "W" || arrowPosition === "E") {
				$('#Cell-NW_' + this.ControlID).css("display","table-cell");
				$('#Cell-N_' + this.ControlID).css("display","table-cell");
				$('#Cell-NE_' + this.ControlID).css("display","table-cell");
			}
			if (arrowPosition.indexOf("E") !== -1) {
				$('#Cell-NW_' + this.ControlID).css("display","table-cell");
				$('#Cell-W_' + this.ControlID).css("display","table-cell");
				$('#Cell-SW_' + this.ControlID).css("display","table-cell");
			}
		}*/
		$('#Cell-' + newArrowPosition + '_' + this.ControlID).visible();
		this.arrowsActive[newArrowPosition] = true;
		this.hideUnWantedCells();
	}
};

OverlayInstructions.prototype.setArrowImageRotationAngle = function (arrowImageRotationAngle,arrowImagePosition) {
	"use strict";
	if (arrowImageRotationAngle && !this.arrowImageRotationFixed) {
		this.arrowImageRotationAngle = arrowImageRotationAngle;
	}
	if(arrowImagePosition && this.isValidArrowPosition(arrowImagePosition)) {
		this.rotateArrowImage(this.arrowImageRotationAngle, arrowImagePosition);
	} else {
		this.rotateArrowImage(this.arrowImageRotationAngle, this.getArrowPosition());
	}
};

OverlayInstructions.prototype.rotateArrowImage = function (arrowImageRotationAngle, arrowImagePosition) {
	"use strict";
	if (arrowImageRotationAngle && arrowImagePosition) {
		$('#ArrowImage_' + arrowImagePosition + '_Div_' + this.ControlID).rotate(arrowImageRotationAngle);
	}

};

OverlayInstructions.prototype.setArrowImage = function (arrowImageURL, arrowImagePosition) {
	"use strict";
	if (arrowImagePosition && this.isValidArrowPosition(arrowImagePosition) && arrowImageURL) {
		// change the url in respective src of the image tag corresponding to the position
		$('#ArrowImage_' + arrowImagePosition + '_Div_' + this.ControlID).css('background-image', arrowImageURL);
		this.arrowStyles[arrowImagePosition] = arrowImageURL;
	} else {
		if (arrowImageURL) {
			// change the url in respective src of the image tag corresponding to the current position of arrow , i.e this.arrowPosition
			$('#ArrowImage_' + this.getArrowPosition() + '_Div_' + this.ControlID).css('background-image', arrowImageURL);
			this.arrowStyles[this.getArrowPosition()] = arrowImageURL;
		}
	}
};

OverlayInstructions.prototype.validateArguments = function (ID, InstructionString, InstructionDetailsString, targetID, arrowImagePosition, arrowImageURL, posX, posY) {
	"use strict";
	if (!ID) {
		console.log("Error : ID cannot be Empty");
		return false;
	}
	if (!InstructionString && !InstructionDetailsString) {
		console.log("Warning : Instruction text is empty, no content to render");
	}
	if (targetID && arrowImagePosition && posX && posY && arrowImageURL) {
		console.log("Warning : Positioning arguments defaultes, Target element position will be ignored.");
	}
	if (!targetID) {
		if (!posX && !posY) {
			console.log("Warning : (X,Y) is empty, defaults(0,0) will be applied.");
		}
		if (!arrowImagePosition) {
			console.log("Warning : Default arrow position of 'NW' will be applied");
		}
	}
	if (arrowImageURL) {
		if (!arrowImagePosition) {
			console.log("Error : Arrow position is required for applying custom arrow image.");
			return false;
		}
	}
	return true;
};

OverlayInstructions.prototype.isValidArrowPosition = function (arrowPosition) {
	"use strict";
	var isValid;
	if (!arrowPosition || arrowPosition === "E" || arrowPosition === "W" || arrowPosition === "S" || arrowPosition === "N" || arrowPosition === "NE" || arrowPosition === "NW" || arrowPosition === "SE" || arrowPosition === "SW") {
		isValid = true;
	} else {
		alert("Incorrect arrow position. Shoud be one of [ E,W,S,N,NE,NW,SE,SW ]");
		isValid = false;
	}
	return isValid;
};

OverlayInstructions.prototype.createInstructionBlockElement = function () {
	"use strict";
	var InstructionBlock = $('<table id="InstructionBlock_' + this.ControlID + '" class="InstructionBlock ' + this.instructionBlockTheme + '" style="display:none"></table></div>');
	var InstructionBlockTopRow = $('<tr class="TopRow" id="TopRow_' + this.ControlID + '"></tr>');
	var InstructionBlockMiddleRow = $('<tr class="MiddleRow" id="MiddleRow_' + this.ControlID + '"></tr>');
	var InstructionBlockBottomRow = $('<tr class="BottomRow" id="BottomRow_' + this.ControlID + '"></tr>');

	//Arrow Images
	var InstructionArrowImageNW = $('<td id="Cell-NW_' + this.ControlID + '" class="ArrowImageCell ArrowImageCell_NW" style="visibility:hidden"><div class="ArrowImage ArrowImage_NW" id="ArrowImage_NW_Div_' + this.ControlID + '" style="height:' + this.verticalArrowImageHeight + this.imageDimentionUnit + ';width:' + this.horizontalArrowImageWidth + this.imageDimentionUnit + ';"></div></td>');
	var InstructionArrowImageN = $('<td id="Cell-N_' + this.ControlID + '" class="ArrowImageCell ArrowImageCell_N" style="visibility:hidden"><div class="ArrowImage ArrowImage_N" id="ArrowImage_N_Div_' + this.ControlID + '" style="height:' + this.verticalArrowImageHeight + this.imageDimentionUnit + ';width:' + this.verticalArrowImageWidth + this.imageDimentionUnit + ';"></div></td>');
	var InstructionArrowImageNE = $('<td id="Cell-NE_' + this.ControlID + '" class="ArrowImageCell ArrowImageCell_NE" style="visibility:hidden"><div class="ArrowImage ArrowImage_NE" id="ArrowImage_NE_Div_' + this.ControlID + '" style="height:' + this.verticalArrowImageHeight + this.imageDimentionUnit + ';width:' + this.horizontalArrowImageWidth + this.imageDimentionUnit + ';"></div></td>');
	var InstructionArrowImageW = $('<td id="Cell-W_' + this.ControlID + '" class="ArrowImageCell ArrowImageCell_W" style="visibility:hidden"><div class="ArrowImage ArrowImage_W" id="ArrowImage_W_Div_' + this.ControlID + '" style="height:' + this.horizontalArrowImageHeight + this.imageDimentionUnit + ';width:' + this.horizontalArrowImageWidth + this.imageDimentionUnit + ';"></div></td>');
	var InstructionArrowImageE = $('<td id="Cell-E_' + this.ControlID + '" class="ArrowImageCell ArrowImageCell_E" style="visibility:hidden"><div class="ArrowImage ArrowImage_E" id="ArrowImage_E_Div_' + this.ControlID + '" style="height:' + this.horizontalArrowImageHeight + this.imageDimentionUnit + ';width:' + this.horizontalArrowImageWidth + this.imageDimentionUnit + ';"></div></td>');
	var InstructionArrowImageSW = $('<td id="Cell-SW_' + this.ControlID + '" class="ArrowImageCell ArrowImageCell_SW" style="visibility:hidden"><div class="ArrowImage ArrowImage_SW" id="ArrowImage_SW_Div_' + this.ControlID + '" style="height:' + this.verticalArrowImageHeight + this.imageDimentionUnit + ';width:' + this.horizontalArrowImageWidth + this.imageDimentionUnit + ';"></div></td>');
	var InstructionArrowImageSE = $('<td id="Cell-SE_' + this.ControlID + '" class="ArrowImageCell ArrowImageCell_SE" style="visibility:hidden"><div class="ArrowImage ArrowImage_SE" id="ArrowImage_SE_Div_' + this.ControlID + '" style="height:' + this.verticalArrowImageHeight + this.imageDimentionUnit + ';width:' + this.horizontalArrowImageWidth + this.imageDimentionUnit + ';"></div></td>');
	var InstructionArrowImageS = $('<td id="Cell-S_' + this.ControlID + '" class="ArrowImageCell ArrowImageCell_S" style="visibility:hidden"><div class="ArrowImage ArrowImage_S" id="ArrowImage_S_Div_' + this.ControlID + '" style="height:' + this.verticalArrowImageHeight + this.imageDimentionUnit + ';width:' + this.verticalArrowImageWidth + this.imageDimentionUnit + ';"></div></td>');

	// text content
	var InstructionContentCell = $('<td id="Cell-C_' + this.ControlID + '"></td>');
	var InstructionContent = $('<div class="InstructionContent" id="InstructionContent_' + this.ControlID + '"></div>');
	var InstructionTextBlock = $('<div class="InstructionText" id="InstructionText_' + this.ControlID + '"> <span>' + this.InstructionText + '</span> </div>');
	var InstructionsOKButton = $('<div class="InstructionOKButtonHolder" id="InstructionOKButtonHolder_' + this.ControlID + '"><a class="InstructionOKButton" id="InstructionOKButton_' + this.ControlID + '">OK</a></div>');
	//InstructionBlock.append(this.InstructionArrowImage);
	InstructionContent.append(InstructionTextBlock);
	if (this.InstructionDetailsText) {
		var MoreButton = $('<br/><a class="MoreDetailButton" id="MoreDetailButton_' + this.ControlID + '" href="#" title="Click to expand & collapse">more...</a>');
		var MoreDetailsText = $('<div class="InstructionDetailText" id="InstructionDetailText_' + this.ControlID + '">' + this.InstructionDetailsText + '</div>');
		var MoreTextBlock = $('<div class="MoreInstructionDetail" id="MoreInstructionDetail_' + this.ControlID + '" style="height:0px; display:none"></div>');
		InstructionContent.append(MoreButton);
		MoreTextBlock.append(MoreDetailsText);
		InstructionContent.append(MoreTextBlock);
	}
	//InstructionContent.append(InstructionsOKButton);
	InstructionContentCell.append(InstructionContent);
	InstructionContentCell.append(InstructionsOKButton);

	// assemble Images
	// top row
	InstructionBlockTopRow.append(InstructionArrowImageNW);
	InstructionBlockTopRow.append(InstructionArrowImageN);
	InstructionBlockTopRow.append(InstructionArrowImageNE);
	//middle row
	InstructionBlockMiddleRow.append(InstructionArrowImageW);
	InstructionBlockMiddleRow.append(InstructionContentCell);
	InstructionBlockMiddleRow.append(InstructionArrowImageE);
	//bottom row
	InstructionBlockBottomRow.append(InstructionArrowImageSW);
	InstructionBlockBottomRow.append(InstructionArrowImageS);
	InstructionBlockBottomRow.append(InstructionArrowImageSE);

	//assemble table
	InstructionBlock.append(InstructionBlockTopRow);
	InstructionBlock.append(InstructionBlockMiddleRow);
	InstructionBlock.append(InstructionBlockBottomRow);


	this.InstructionBlockElment = InstructionBlock;
	$("body").append(InstructionBlock);
	return InstructionBlock;
};
/**
 * PageTour
 * Page Tour consisting of instruction blocks list along with sequential Navigation 
 */
function PageTour(name) {
	"use strict";
    this.constructor(name);
}
PageTour.prototype.constructor = function (name) {
	"use strict";
	if(!name) {
		alert("Page Tour name cannot be empty!!");
	} else {
		this.name = name;
	    this.instructionTargets = {};
	    this.createOverlay();
	    this.createNavigationButtons();
	    var me = this;
		$(window).on('resize',function() { if(me.__Is_Active__) { me.refreshPageTourLayout(); } });
	}

};
PageTour.prototype.name = "";
PageTour.prototype.instructionBlockTheme = "ChalkBoard";
PageTour.prototype.instructionTargets = null;
PageTour.prototype.tourNavigationButtons = null;
PageTour.prototype.pageTourOverlay = null;
PageTour.prototype.pageInstructionsList = null;
PageTour.prototype.currentActiveInstruction = null;
PageTour.prototype.__blockNextInstruction = false;
PageTour.prototype.__Is_Active__ = false;

/**
 * getPageInstructionsList
 * @public
 * @return {InstructionsList} associated with this PageTour
 */
PageTour.prototype.getPageInstructionsList = function () {
	"use strict";
	if (!this.pageInstructionsList) {
		this.pageInstructionsList = new InstructionsList();
	}
	return this.pageInstructionsList;
};

/**
 * play
 * @public
 * Starts the Instruction Tour
 */
PageTour.prototype.play = function () {
	"use strict";
	if (this.currentActiveInstruction) {
		this.currentActiveInstruction.InstructionObject.show(true);
	} else {
		var firstInstruction = this.getPageInstructionsList().getFirstInstruction();
		if (firstInstruction) {
			this.currentActiveInstruction = firstInstruction;
			firstInstruction.InstructionObject.show(true);
			this.disableButton("PreviousButton");
			this.enableButton("NextButton");
		}
	}
};

/**
 * __blockNavigationToNextInstruction
 * @private
 * blocks the auto navigation to next instruction
 */
PageTour.prototype.__blockNavigationToNextInstruction = function () {
	this.__blockNextInstruction = true;
};

/**
 * __unBlockNavigationToNextInstruction
 * @private
 * un-blocks the auto navigation to next instruction
 */
PageTour.prototype.__unBlockNavigationToNextInstruction = function () {
	this.__blockNextInstruction = false;
};

/**
 * __isNavigationToNextInstructionAllowed
 * @private
 * @return bool indicating if the auto navigation to next instruction is blocked
 */
PageTour.prototype.__isNavigationToNextInstructionAllowed = function () {
	return this.__blockNextInstruction;
};

/**
 * pause
 * @public
 * pause the instruction Tour playback
 */
PageTour.prototype.pause = function () {
	"use strict";
	if (this.currentActiveInstruction) {
		this.__blockNavigationToNextInstruction();
		this.currentActiveInstruction.InstructionObject.hide();
		this.__unBlockNavigationToNextInstruction();
	}
	//this.hide();
};

/**
 * stop
 * @public
 * stops the instruction Tour playback
 */
PageTour.prototype.stop = function () {
	"use strict";
	if (this.currentActiveInstruction) {
		this.__blockNavigationToNextInstruction();
		this.currentActiveInstruction.InstructionObject.hide();
		var firstInstruction = this.getPageInstructionsList().getFirstInstruction();
		this.currentActiveInstruction = firstInstruction;
		this.enableButton("NextButton");
		this.disableButton("PreviousButton");
	}
	this.hide();
};

/**
 * showInstruction
 * @public
 * @instructionID : ID of the Instruction to be shown
 * Shows a particular instruction within the Page Tour
 */
PageTour.prototype.showInstruction = function (instructionID) {
	"use strict";
	var overlayInstructionObject = this.getPageInstructionsList().find(instructionID);
	if(overlayInstructionObject) {
		overlayInstructionObject.show();
	}
};

/**
 * getInstruction
 * @public
 * @instructionID : ID of the Instruction to retrive
 * Retrives a particular instruction within the Page Tour
 * @return : {OverlayInstructions} object
 */
PageTour.prototype.getInstruction = function (instructionID) {
	"use strict";
	var overlayInstructionObject = this.getPageInstructionsList().find(instructionID);
	return overlayInstructionObject;
};

/**
 * showNextInstruction
 * @private
 * Navigates to next instruction within the Page Tour [internal use]
 */
PageTour.prototype.showNextInstruction = function () {
	"use strict";
	if (this.currentActiveInstruction && !this.__isNavigationToNextInstructionAllowed()) {
		var nextInstruction = this.currentActiveInstruction.nextInstruction;
		if (nextInstruction) {
			nextInstruction.InstructionObject.show(true);
			this.enableButton("PreviousButton");
			this.currentActiveInstruction = nextInstruction;
		} else {
			this.showPlayButton();
			this.currentActiveInstruction = null;
			this.disableButton("PreviousButton");
			this.disableButton("NextButton");
		}

	}
};

/**
 * jumpToNextInstruction
 * @public
 * Navigates to next instruction within the Page Tour
 */
 PageTour.prototype.jumpToNextInstruction = function () {
	"use strict";
	if (this.currentActiveInstruction) {
		this.__blockNavigationToNextInstruction();
		this.currentActiveInstruction.InstructionObject.hide();
		var nextInstruction = this.currentActiveInstruction.nextInstruction;
		if (nextInstruction) {						
			nextInstruction.InstructionObject.show(true);
			this.enableButton("PreviousButton");
			this.currentActiveInstruction = nextInstruction;
		} else {
			this.showPlayButton();
			this.currentActiveInstruction = null;
			this.disableButton("PreviousButton");
			this.disableButton("NextButton");
		}
		this.__unBlockNavigationToNextInstruction();
	}
};

/**
 * jumpToPreviousInstruction
 * @public
 * Navigates to previous instruction within the Page Tour
 */
PageTour.prototype.jumpToPreviousInstruction = function () {
	"use strict";
	if (this.currentActiveInstruction) {
		var previousInstruction = this.currentActiveInstruction.previousInstruction;
		if (previousInstruction) {
			//this.currentActiveInstruction.InstructionObject.__Is_Rendered_Within_Tour__ = false;  // hack to prevent next instruction trigger
			this.__blockNavigationToNextInstruction();
			this.currentActiveInstruction.InstructionObject.hide();
			previousInstruction.InstructionObject.show(true);
			this.enableButton("NextButton");
			this.currentActiveInstruction = previousInstruction;
			this.__unBlockNavigationToNextInstruction();
		}  else {
			this.disableButton("PreviousButton");
		}

	}
};

/**
 * __add
 * @private
 * @overlayInstructionObject : {OverlayInstructions} object
 * Adds a instruction to the instruction list associated with Page Tour
 */
PageTour.prototype.__add = function (overlayInstructionObject) {
	"use strict";
	var me = this;
	overlayInstructionObject.addEventListener("__on_show_next_instruction__", function () { me.showNextInstruction(); });
	this.getPageInstructionsList().add(overlayInstructionObject);
};

/**
 * removeInstruction
 * @public
 * @instructionID : ID id instruction to be removed
 * Removes a instruction from the instruction list associated with Page Tour
 */
PageTour.prototype.removeInstruction = function (instructionID) {
	"use strict";
	var overlayInstructionObject = this.getPageInstructionsList().find(instructionID);
	if(overlayInstructionObject) {
		overlayInstructionObject.removeEventListener("__on_show_next_instruction__");
		this.getPageInstructionsList().remove(overlayInstructionObject.ID);
	}
};

/**
 * addInstruction
 * @public
 * * @params: {ID: desired ID of the OverlayInstruction Block,
 *           InstructionString: Instruction Title Text to be rendered,
 *           InstructionDetailsString: Instruction Detail Text to be rendered,
 *           targetID: "ID" of the target HTML element for which the Instruction is displayed,
 *           arrowImagePosition: [Primary position]String indication the direction that the arrow should point. Possible values [E,W,S,N,NE,NW,SE,SW],
 *           arrowImageURL: URL of a custom image that should be rendered instead of default arrow image,
 *           posX: default X-coordinate of the Instruction Block,
 *           posY: default Y-coordinate of the Instruction Block,
 *           arrowImageRotationAngle: Rotation angle for the arrow image,
 *           expandDetails: show details expanded by default
 *           additionalArrows: Array[] , show multiple arrows.  Possible values ["E","W","S","N","NE","NW","SE","SW"] }
 * Adds a new instruction to the instruction list associated with Page Tour
 */
PageTour.prototype.addInstruction = function(params) {
	var overlayInstruction,targetID;
	if(params instanceof OverlayInstructions) {
		overlayInstruction = params;
		targetID = (overlayInstruction.targetElement)?overlayInstruction.targetElement.ID:"";
	} else {
		overlayInstruction = new OverlayInstructions(params);
		targetID = params.targetID;
	}
	
	this.__add(overlayInstruction);
	if(targetID) {
		this.addTarget(targetID,overlayInstruction);
	}
};

/**
 * addTarget
 * @private
 * @targetElementID : ID of Target element of the instruction
 * @overlayInstruction : {OverlayInstructions} object
 * Removes a instruction from the instruction list associated with Page Tour
 */
PageTour.prototype.addTarget = function (targetElementID,overlayInstruction) {
	//check if widget exists
	var targetElemet = $('#' + targetElementID), overlay, InstructionHelpButton;
	if (targetElemet.length <= 0) {
		alert("Target Element with ID=" + targetElementID + " not found !!");
	} else {
	    InstructionHelpButton = $('<a class="InstructionTriggerButton" style="position:absolute;" id="PageTour_' + this.name + '_InstructionTrigger_' + targetElementID + '"></a>');
		overlay =  this.getOverlay();
		this.instructionTargets[targetElementID] = InstructionHelpButton;
		overlay.append(InstructionHelpButton);
		this.rePositionInstructionTarget(targetElementID);
		// bind click handler for 
		var eventData = { OverlayInstructionObj : overlayInstruction,
					      PageTourObj : this };
		$('#PageTour_' + this.name + '_InstructionTrigger_' + targetElementID).on("click", eventData, this.OnInstructionTriggerButtonClick);
	}	
};

/**
 * OnInstructionTriggerButtonClick
 * @private
 * @eventData : {Object} Event data
 * OnClick handler for the trigger button
 */
PageTour.prototype.OnInstructionTriggerButtonClick = function (eventData) {
	"use strict";
	var OverlayInstructionObj = eventData.data.OverlayInstructionObj;
	var PageTourObj = eventData.data.PageTourObj;
	var PageTourInstruction = PageTourObj.getPageInstructionsList().find(OverlayInstructionObj.getID());
	PageTourObj.currentActiveInstruction = PageTourInstruction;
	OverlayInstructionObj.show(true);
	PageTourObj.showPauseButton();
};

/**
 * rePositionInstructionTarget
 * @private
 * @targetElementID : Id Of the Target Element
 * Refreshes the Trigger button position for Target Element
 */
PageTour.prototype.rePositionInstructionTarget = function (targetElementID) {

		var targetWidgetInstructionTrigger = this.instructionTargets[targetElementID];  //$('#' + targetElementID);
		var targetElementPosition = $('#' + targetElementID).offset();
		var targetWidgetX1 = targetElementPosition.left;
		var targetWidgetY1 = targetElementPosition.top;
		targetWidgetInstructionTrigger.css("left", targetWidgetX1);
		targetWidgetInstructionTrigger.css("top", targetWidgetY1);
};

/**
 * rePositionAllInstructionTargets
 * @private
 * Refreshes the Trigger button position for all Target elements
 */
PageTour.prototype.rePositionAllInstructionTargets = function () {
	// loop through all targets and update each positions
	var instructionTarget;
	for (instructionTarget in this.instructionTargets) {
		if (this.instructionTargets.hasOwnProperty(instructionTarget)) {
			this.rePositionInstructionTarget(instructionTarget);
		}
	}
};

/**
 * refreshPageTourLayout
 * @private
 * Refreshes & repositions the entire layout of the pagetour
 */
PageTour.prototype.refreshPageTourLayout = function () {
	this.resizeOverlay();
	this.rePositionAllInstructionTargets();
	
};

/**
 * getOverlay
 * @private
 * gets the Overlay of the pagetour
 * @return : ${Object} of the Overlay
 */
PageTour.prototype.getOverlay = function () {
	"use strict";
	var overlay;
	if (!this.pageTourOverlay) {
		overlay = this.createOverlay();
	} else {
		overlay = this.pageTourOverlay;
	}
	return overlay;
};

/**
 * resizeOverlay
 * @private
 * Resize the Overlay dimensions as per Document dimensions
 */
PageTour.prototype.resizeOverlay = function () {
	var overlay=this.getOverlay();
	overlay.height($(document).height()-1);
	overlay.width($(document).width()-1);
};

/**
 * createOverlay
 * @private
 * Create the Overlay element
 * @return : ${Object} of the Overlay
 */
PageTour.prototype.createOverlay = function () {
	"use strict";
	var overlay = $('#PageTour_' + this.name + '_Overlay');
	if (overlay.length <= 0) {
		overlay = $('<div class="PageTourOverlay '+ this.instructionBlockTheme +'" id="PageTour_' + this.name + '_Overlay" style="display:none; height:' + $(document).height() + 'px; width:' + $(document).width() + 'px;"></div>');
		$("body").append(overlay);
	}
	this.pageTourOverlay = overlay;
	return overlay;
};

/**
 * getNavigationButtons
 * @private
 * gets the Navigation Buttons
 * @return : ${Object} of the Navigation Buttons
 */
PageTour.prototype.getNavigationButtons = function () {
	"use strict";
	var tourNavigationButtons;
	if (!this.tourNavigationButtons) {
		tourNavigationButtons = this.createNavigationButtons();
	} else {
		tourNavigationButtons = this.tourNavigationButtons;
	}
	return tourNavigationButtons;
};

/**
 * createNavigationButtons
 * @private
 * creates the Navigation Buttons
 * @return : ${Object} of the Navigation Buttons
 */
PageTour.prototype.createNavigationButtons = function () {
	var PageTourPlayButton = $('<a class="PageTourNavigationButton PageTourPlayButton" style="display:block;float:left;" id="PageTour_' + this.name + '_PlayButton"></a>');
	var PageTourPauseButton = $('<a class="PageTourNavigationButton PageTourPauseButton" style="display:none;float:left;" id="PageTour_' + this.name + '_PauseButton"></a>');
	var PageTourStopButton = $('<a class="PageTourNavigationButton PageTourStopButton" style="display:block;float:left;" id="PageTour_' + this.name + '_StopButton"></a>');
	var PageTourNextButton = $('<a class="PageTourNavigationButton PageTourNextButton" style="display:none;float:left;" id="PageTour_' + this.name + '_NextButton"></a>');
	var PageTourPreviousButton = $('<a class="PageTourNavigationButton PageTourPreviousButton" style="display:none;float:left;" id="PageTour_' + this.name + '_PreviousButton"></a>');
	var PageNavigationButtonsHolder = $('<div class="PageTourNavigationButtons ' + this.instructionBlockTheme + '" style="display:none; position:fixed; bottom: 0; width: 280px;" id="PageTour_' + this.name + '_NavigationButtons"></div>');
	PageNavigationButtonsHolder.append(PageTourStopButton);
	PageNavigationButtonsHolder.append(PageTourPlayButton);
	PageNavigationButtonsHolder.append(PageTourPauseButton);
	PageNavigationButtonsHolder.append(PageTourPreviousButton);
	PageNavigationButtonsHolder.append(PageTourNextButton);
	
	$("body").append(PageNavigationButtonsHolder);
	this.tourNavigationButtons = PageNavigationButtonsHolder;
	// bind events to navigation buttons
	var eventData = { PageTourObj : this };
	$('#PageTour_' + this.name + '_PlayButton').on("click", eventData, this.onPlayButtonClick);
	$('#PageTour_' + this.name + '_PauseButton').on("click", eventData, this.onPauseButtonClick);
	$('#PageTour_' + this.name + '_StopButton').on("click", eventData, this.onStopButtonClick);
	$('#PageTour_' + this.name + '_NextButton').on("click", eventData, this.onNextButtonClick);
	$('#PageTour_' + this.name + '_PreviousButton').on("click", eventData, this.onPreviousButtonClick);
	
};

/**
 * onPlayButtonClick
 * @private
 * @eventData : {Object} event data
 * Play button click handler
 */
PageTour.prototype.onPlayButtonClick = function (eventData) {
	var PageTourObj = eventData.data.PageTourObj;
	PageTourObj.showPauseButton();
	PageTourObj.showNextPreviousButtons();
	PageTourObj.play();
};

/**
 * onPauseButtonClick
 * @private
 * @eventData : {Object} event data
 * Pause button click handler
 */
PageTour.prototype.onPauseButtonClick = function (eventData) {
	var PageTourObj = eventData.data.PageTourObj;
	PageTourObj.showPlayButton();
	PageTourObj.pause();
};

/**
 * onStopButtonClick
 * @private
 * @eventData : {Object} event data
 * Stop button click handler
 */
PageTour.prototype.onStopButtonClick = function (eventData) {
	var PageTourObj = eventData.data.PageTourObj;
	PageTourObj.stop();
	PageTourObj.showPlayButton();
	PageTourObj.hideNextPreviousButtons();
};

/**
 * onNextButtonClick
 * @private
 * @eventData : {Object} event data
 * Next button click handler
 */
PageTour.prototype.onNextButtonClick = function (eventData) {
	var PageTourObj = eventData.data.PageTourObj;
	PageTourObj.showPauseButton();
	PageTourObj.jumpToNextInstruction();
};

/**
 * onPreviousButtonClick
 * @private
 * @eventData : {Object} event data
 * Previous button click handler
 */
PageTour.prototype.onPreviousButtonClick = function (eventData) {
	var PageTourObj = eventData.data.PageTourObj;
	PageTourObj.showPauseButton();
	PageTourObj.jumpToPreviousInstruction();
};

/**
 * showPlayButton
 * @private
 * Shows the Play button
 */
PageTour.prototype.showPlayButton = function () {
	$('#PageTour_' + this.name + '_PlayButton').css("display","block");
	$('#PageTour_' + this.name + '_PauseButton').css("display","none");
};

/**
 * showPauseButton
 * @private
 * Shows the Pause button
 */
PageTour.prototype.showPauseButton = function () {
	$('#PageTour_' + this.name + '_PlayButton').css("display","none");
	$('#PageTour_' + this.name + '_PauseButton').css("display","block");
};

/**
 * showNextPreviousButtons
 * @private
 * Shows the Next Previous Buttons
 */
PageTour.prototype.showNextPreviousButtons = function () {
	$('#PageTour_' + this.name + '_NextButton').css("display","block");
	$('#PageTour_' + this.name + '_PreviousButton').css("display","block");
};

/**
 * hideNextPreviousButtons
 * @private
 * Hides the Next Previous Buttons
 */
PageTour.prototype.hideNextPreviousButtons = function () {
	$('#PageTour_' + this.name + '_NextButton').css("display","none");
	$('#PageTour_' + this.name + '_PreviousButton').css("display","none");
};

/**
 * disableNextPreviousButtons
 * @private
 * Disables the Next Previous Buttons
 */
PageTour.prototype.disableNextPreviousButtons = function () {
	this.disableButton("NextButton");
	this.disableButton("PreviousButton");
};

/**
 * enableNextPreviousButtons
 * @private
 * Enables the Next Previous Buttons
 */
PageTour.prototype.enableNextPreviousButtons = function () {
	this.enableButton("NextButton");
	this.enableButton("PreviousButton");
};

/**
 * disableButton
 * @private
 * @button : button to disable
 * Disables a Button
 */
PageTour.prototype.disableButton = function (button) {
	$('#PageTour_' + this.name + '_'+ button).addClass('disabled');
};

/**
 * enableButton
 * @private
 * @button : button to disable
 * Enable a Button
 */
PageTour.prototype.enableButton = function(button) {
	$('#PageTour_' + this.name + '_'+ button).removeClass('disabled');
};

/**
 * show
 * @public
 * Show the Page Tour on screen
 */
PageTour.prototype.show = function () {
	this.refreshPageTourLayout();
	var overlay=this.getOverlay();
	var navigationButtons = this.getNavigationButtons();
	overlay.css("display","block");
	navigationButtons.css("display","block");
	this.__Is_Active__ = true;
};

/**
 * hide
 * @public
 * Hide the Pahe Tour 
 */
PageTour.prototype.hide = function () {
	var overlay=this.getOverlay();
	var navigationButtons = this.getNavigationButtons();
	overlay.css("display","none");
	navigationButtons.css("display","none");
	this.__unBlockNavigationToNextInstruction();
	this.__Is_Active__ = false;
};



