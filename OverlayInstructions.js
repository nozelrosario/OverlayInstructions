
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
 *           arrowImagePosition: String indication the direction that the arrow should point. Possible values [E,W,S,N,NE,NW,SE,SW],
 *           arrowImageURL: URL of a custom image that should be rendered instead of default arrow image,
 *           posX: default X-coordinate of the Instruction Block,
 *           posY: default Y-coordinate of the Instruction Block,
 *           arrowImageRotationAngle: Rotation angle for the arrow image }
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
OverlayInstructions.prototype.arrowPosition = "W"; // {"E","W","S","N","NE","NW","SE","SW"}
OverlayInstructions.prototype.arrowImage = "";
OverlayInstructions.prototype.horizontalArrowImageHeight = 75;  //px
OverlayInstructions.prototype.horizontalArrowImageWidth = 150;  //px
OverlayInstructions.prototype.verticalArrowImageHeight = 140;  //px
OverlayInstructions.prototype.verticalArrowImageWidth = 75;  //px
OverlayInstructions.prototype.arrowImageRotationAngle = 0;
OverlayInstructions.prototype.arrowImageRotationFixed = false; // if the rotation angle is defaulted by the user
OverlayInstructions.prototype.instructionBlockTheme = "ChalkBoard";
OverlayInstructions.prototype.__Is_Rendered_Within_Tour__ = false;
OverlayInstructions.prototype.__Is_Active__ = false;
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
			this.arrowPosition = params.arrowImagePosition;
			this.arrowPositionFixed = true;
			if (params.arrowImageURL) {
				this.setArrowImage(params.arrowImageURL);
			}
		} else {
			this.autoSetArrowPosition();
		}

		this.hideUnWantedCells();

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
			this.arrowImageRotationAngle = param.arrowImageRotationAngl;
		} else {
			this.arrowImageRotationFixed = false;
		}
		

	}
	this.showArrow(this.arrowPosition, false);
	var eventData = { OverlayInstructionObj : this };
	$("#InstructionOKButton_" + this.ControlID).on("click", eventData, this.OnInstructionOKButtonClick);

	$("#MoreDetailButton_" + this.ControlID).on("click", eventData, this.ToggleMoreDetail);
	
	if(params.expandDetails) {
		this.ToggleMoreDetail({data:eventData});
	}
	
	this.events = {
			"__on_show_next_instruction__": true,  // @private :used for PageTour
			"onOkClick": true,
			"onInitialized": true,
			"onShow": true,
			"onHide": true
		};
	this.__Is_Active__ = false;
	var me = this;
	$(window).on('resize',function() { if(me.__Is_Active__) { me.refreshInstructionBlockPosition(); } });
};

OverlayInstructions.prototype.ToggleMoreDetail = function (eventData) {
	"use strict";
	var OverlayInstructionObj = eventData.data.OverlayInstructionObj;

	if (($("#MoreInstructionDetail_" + OverlayInstructionObj.ControlID).is(':visible'))) {
		$("#MoreDetailButton_" + OverlayInstructionObj.ControlID).text("more...");
		$("#MoreInstructionDetail_" + OverlayInstructionObj.ControlID).css("display","none");
	} else {
		$("#MoreDetailButton_" + OverlayInstructionObj.ControlID).text("less...");
		$("#MoreInstructionDetail_" + OverlayInstructionObj.ControlID).css("display","block");
	}
	OverlayInstructionObj.refreshInstructionBlockPosition();

};

OverlayInstructions.prototype.OnInstructionOKButtonClick = function (eventData) {
	"use strict";
	var OverlayInstructionObj = eventData.data.OverlayInstructionObj;
	OverlayInstructionObj.hide();
	OverlayInstructionObj.fireEvent("onOkClick");
};

OverlayInstructions.prototype.addListener = function (event, handler) {
	"use strict";
	if (this.events[event]) {
		this.events[event] = handler;
	}
};

OverlayInstructions.prototype.removeListener = function (event) {
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
	overlay.height($(document).height()-3);
	overlay.width($(document).width()-3);
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
		horizontal_InstructionBlockHeight = (this.horizontalArrowImageHeight > instructionContentHeight) ? this.horizontalArrowImageHeight : instructionContentHeight;
		horizontal_InstructionBlockWidth = this.arrowImageWidth + instructionContentWidth;

		var vertical_InstructionBlockHeight, vertical_InstructionBlockWidth;
		vertical_InstructionBlockHeight = this.verticalArrowImageHeight + instructionContentHeight;
		vertical_InstructionBlockWidth = (this.verticalArrowImageWidth > instructionContentWidth) ? this.verticalArrowImageWidth : instructionContentWidth;

		// Determine the appropriate arrow position based on target dimensions & screen dimensions

		// determine instruction block position left/right of target element
		if ((targetElementPositionX2 + horizontal_InstructionBlockWidth) < screenWidth) {  // if right possible
			// RIGHT
			// possible positions
			// W, NW,SW
			if (targetElementPositionY2 > horizontal_InstructionBlockHeight) {
				//position = SW
				this.arrowPosition = "SW";

			} else if (targetElementPositionY2 > (horizontal_InstructionBlockHeight / 2)) {  // if space above target is greater than 1/2 of inst_block height
				// position = W
				this.arrowPosition = "W";
			} else {
				//position = NW
				this.arrowPosition = "NW";
			}

		} else if ((horizontal_InstructionBlockWidth + arrowToTargetPadding) <= targetElementPositionX1) {   // if left possible
			// LEFT
			// possible positions
			// E,NE,SE
			if (targetElementPositionY1 > horizontal_InstructionBlockHeight) {
				//position = SE
				this.arrowPosition = "SE";

			} else if (targetElementPositionY1 > (horizontal_InstructionBlockHeight / 2)) {  // if space above target is greater than 1/2 of inst_block height
				// position = E
				this.arrowPosition = "E";
			} else {
				//position = NE	
				this.arrowPosition = "NE";
			}

		} else if ((vertical_InstructionBlockHeight + arrowToTargetPadding) <= targetElementPositionY1) { //determine block above or below target element

			// ABOVE
			// possible positions
			// S,SW,SE
			if (targetElementPositionX1 > vertical_InstructionBlockWidth) {
				//position = SE
				this.arrowPosition = "SE";

			} else if (targetElementPositionX1 > (vertical_InstructionBlockWidth / 2)) {  // if space above target is greater than 1/2 of inst_block height
				// position = S
				this.arrowPosition = "S";
			} else {
				//position = SW				
				this.arrowPosition = "SW";
			}

		} else if ((targetElementPositionY2 + vertical_InstructionBlockHeight) < screenHeight) {
			// BELOW
			// possible positions
			// N,NE,NW
			if (targetElementPositionX1 > vertical_InstructionBlockWidth) {
				//position = NE
				this.arrowPosition = "NE";

			} else if (targetElementPositionX1 > (vertical_InstructionBlockWidth / 2)) {  // if space below target is greater than 1/2 of inst_block height
				// position = N
				this.arrowPosition = "N";
			} else {
				//position = NW		
				this.arrowPosition = "NW";
			}
		}

	} else {
		//	target element not found/defined , then take defaults
		this.arrowPosition = "NW";
	}
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
		horizontal_InstructionBlockHeight = (this.horizontalArrowImageHeight > instructionContentHeight) ? this.horizontalArrowImageHeight : instructionContentHeight;
		horizontal_InstructionBlockWidth = this.horizontalArrowImageWidth + instructionContentWidth;

		var vertical_InstructionBlockHeight, vertical_InstructionBlockWidth;
		vertical_InstructionBlockHeight = this.verticalArrowImageHeight + instructionContentHeight;
		vertical_InstructionBlockWidth = (this.verticalArrowImageWidth > instructionContentWidth) ? this.verticalArrowImageWidth : instructionContentWidth;


		switch (arrowPosition) {
		case "NW":
			instructionBlockX = targetElementPositionX2 + this.deltaX;
			instructionBlockY = targetElementPositionY2 + this.deltaY;
			arrowImageRotationAngle = 0;//30;
			break;//done

		case "N":
			instructionBlockX = ((targetElementPositionX1 + ((targetElementPositionX2 - targetElementPositionX1) / 2)) + this.deltaX) - (vertical_InstructionBlockWidth / 2);
			instructionBlockY = targetElementPositionY2 + this.deltaY;
			arrowImageRotationAngle = 0;//90;
			break;

		case "NE":
			instructionBlockX = targetElementPositionX1 - (horizontal_InstructionBlockWidth + this.deltaX);
			instructionBlockY = targetElementPositionY1  + this.deltaY;
			arrowImageRotationAngle = 0;//140;
			break;//done

		case "E":
			instructionBlockX = targetElementPositionX1 - (horizontal_InstructionBlockWidth + this.deltaX);
			instructionBlockY = ((targetElementPositionY1 + ((targetElementPositionY2 - targetElementPositionY1) / 2)) - this.deltaY) - ((horizontal_InstructionBlockHeight - (this.deltaX * 2)) / 2);
			arrowImageRotationAngle = 0;//180;
			break; //done


		case "SE":
			instructionBlockX = targetElementPositionX1 - (targetElementWidth / 2) - (vertical_InstructionBlockWidth + this.deltaX);
			instructionBlockY = targetElementPositionY1 - (vertical_InstructionBlockHeight + this.deltaY);
			arrowImageRotationAngle = 0;//220;
			break;//done

		case "S":
			instructionBlockX = (targetElementPositionX1 + ((targetElementPositionX2 - targetElementPositionX1) / 2)) - ((vertical_InstructionBlockWidth / 2) + this.deltaX);
			instructionBlockY = targetElementPositionY1 - (vertical_InstructionBlockHeight + targetElementHeight + this.deltaY);
			arrowImageRotationAngle = 0;//270;
			break;//done


		case "SW":
			instructionBlockX = targetElementPositionX2 + this.deltaX;
			instructionBlockY = (targetElementPositionY1 + this.deltaY) - (vertical_InstructionBlockHeight);
			arrowImageRotationAngle = 0;//330;
			break;//done

		case "W":
			instructionBlockX = targetElementPositionX2 + this.deltaX;
			instructionBlockY = ((targetElementPositionY1) + this.deltaY) - ((horizontal_InstructionBlockHeight - (this.deltaX * 2)) / 2);
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
	this.setArrowImageRotationAngle(arrowImageRotationAngle);

};

OverlayInstructions.prototype.refreshInstructionBlockPosition = function () {
	"use strict";
	if(!this.InstructionPositionFixed && this.targetElement) {
		this.calculateInstructionBlockCoOrdinates(this.arrowPosition);
	}
	this.setPosition(this.InstructionPositionX, this.InstructionPositionY);
	this.resizeOverlay();
};

OverlayInstructions.prototype.hideUnWantedCells = function () {
	"use strict";
	if(!this.InstructionPositionFixed) {
		if ((this.arrowPosition.indexOf("S") !== -1) || this.arrowPosition === "W" || this.arrowPosition === "E") {
			// hide 1st row TopRow_
			//$('#TopRow_'+ this.ControlID).hide();
			$('#Cell-NW_' + this.ControlID).hide();
			$('#Cell-N_' + this.ControlID).hide();
			$('#Cell-NE_' + this.ControlID).hide();
		}
		if (this.arrowPosition.indexOf("E") !== -1) {
			//hide 1st column Cell-NW_inst1,Cell-W_inst1,Cell-SW_inst1
			$('#Cell-NW_' + this.ControlID).hide();
			$('#Cell-W_' + this.ControlID).hide();
			$('#Cell-SW_' + this.ControlID).hide();
		}
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
	this.showOverlay();
	this.setArrowImageRotationAngle();
	this.refreshInstructionBlockPosition();
	$('#InstructionBlock_' + this.ControlID).show();
	this.__Is_Active__ = true;
	if(_Is_Rendered_Within_Tour_) {
		this.__Is_Rendered_Within_Tour__ = (_Is_Rendered_Within_Tour_ === true) ? true : false;
	}
	this.resizeOverlay();
	this.fireEvent("onShow");
};

OverlayInstructions.prototype.destroy = function () {
	"use strict";
	$("#InstructionOKButton_" + this.ControlID).off("click");
	$("#MoreDetailButton_" + this.ControlID).off("click");
	$('#InstructionBlock_' + this.ControlID).remove();
	this.getOverlay().remove();
	this.removeListener("onOkClick");
	this.removeListener("onInitialized");
	this.removeListener("onShow");
	this.removeListener("onHide");
};

OverlayInstructions.prototype.hide = function () {
	"use strict";
	this.hideOverlay();
	$('#InstructionBlock_' + this.ControlID).hide();
	this.__Is_Active__ = false;
	this.fireEvent("onHide");
	// if rendered by TourManager, then trigger next instruction event
	if(this.__Is_Rendered_Within_Tour__) {
		this.fireEvent("__on_show_next_instruction__");	
	}
	this.__Is_Rendered_Within_Tour__ = false;
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
		    $('#Cell-' + position + '_' + this.ControlID).invisible();
		}
	}
	//TODO: decide if to clear the this.arrowPosition too.
};

OverlayInstructions.prototype.showArrow = function (newArrowPosition, keepCurrentArrow) {
	"use strict";
	if (newArrowPosition && this.isValidArrowPosition(newArrowPosition)) {
		if (!keepCurrentArrow) {
			this.hideAllArrows();
		} else {
			// Adjust the hidden cells , so the width is compensated and arrow appears in right cell
			if ((this.arrowPosition.indexOf("S") !== -1) || this.arrowPosition === "W" || this.arrowPosition === "E") {
				$('#Cell-NW_' + this.ControlID).css("display","table-cell");
				$('#Cell-N_' + this.ControlID).css("display","table-cell");
				$('#Cell-NE_' + this.ControlID).css("display","table-cell");
			}
			if (this.arrowPosition.indexOf("E") !== -1) {
				$('#Cell-NW_' + this.ControlID).css("display","table-cell");
				$('#Cell-W_' + this.ControlID).css("display","table-cell");
				$('#Cell-SW_' + this.ControlID).css("display","table-cell");
			}
		}
		this.arrowPosition = newArrowPosition;
		$('#Cell-' + newArrowPosition + '_' + this.ControlID).visible();		
	}
};

OverlayInstructions.prototype.setArrowImageRotationAngle = function (arrowImageRotationAngle) {
	"use strict";
	if (arrowImageRotationAngle && !this.arrowImageRotationFixed) {
		this.arrowImageRotationAngle = arrowImageRotationAngle;
	}
	this.rotateArrowImage(this.arrowImageRotationAngle, this.arrowPosition);
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
			$('#ArrowImage_' + this.arrowPosition + '_Div_' + this.ControlID).css('background-image', arrowImageURL);
			this.arrowStyles[this.arrowPosition] = arrowImageURL;
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
	var InstructionBlock = $('<table id="InstructionBlock_' + this.ControlID + '" class="InstructionBlock ' + this.instructionBlockTheme + '" style="display:none"></table>');
	var InstructionBlockTopRow = $('<tr id="TopRow_' + this.ControlID + '"></tr>');
	var InstructionBlockMiddleRow = $('<tr id="MiddleRow_' + this.ControlID + '"></tr>');
	var InstructionBlockBottomRow = $('<tr id="BottomRow_' + this.ControlID + '"></tr>');

	//Arrow Images
	var InstructionArrowImageNW = $('<td id="Cell-NW_' + this.ControlID + '" class="ArrowImageCell ArrowImageCell_NW" style="visibility:hidden"><div class="ArrowImage ArrowImage_NW" id="ArrowImage_NW_Div_' + this.ControlID + '" style="height:' + this.verticalArrowImageHeight + 'px;width:' + this.horizontalArrowImageWidth + 'px;"></div></td>');
	var InstructionArrowImageN = $('<td id="Cell-N_' + this.ControlID + '" class="ArrowImageCell ArrowImageCell_N" style="visibility:hidden"><div class="ArrowImage ArrowImage_N" id="ArrowImage_N_Div_' + this.ControlID + '" style="height:' + this.verticalArrowImageHeight + 'px;width:' + this.verticalArrowImageWidth + 'px;"></div></td>');
	var InstructionArrowImageNE = $('<td id="Cell-NE_' + this.ControlID + '" class="ArrowImageCell ArrowImageCell_NE" style="visibility:hidden"><div class="ArrowImage ArrowImage_NE" id="ArrowImage_NE_Div_' + this.ControlID + '" style="height:' + this.verticalArrowImageHeight + 'px;width:' + this.horizontalArrowImageWidth + 'px;"></div></td>');
	var InstructionArrowImageW = $('<td id="Cell-W_' + this.ControlID + '" class="ArrowImageCell ArrowImageCell_W" style="visibility:hidden"><div class="ArrowImage ArrowImage_W" id="ArrowImage_W_Div_' + this.ControlID + '" style="height:' + this.horizontalArrowImageHeight + 'px;width:' + this.horizontalArrowImageWidth + 'px;"></div></td>');
	var InstructionArrowImageE = $('<td id="Cell-E_' + this.ControlID + '" class="ArrowImageCell ArrowImageCell_E" style="visibility:hidden"><div class="ArrowImage ArrowImage_E" id="ArrowImage_E_Div_' + this.ControlID + '" style="height:' + this.horizontalArrowImageHeight + 'px;width:' + this.horizontalArrowImageWidth + 'px;"></div></td>');
	var InstructionArrowImageSW = $('<td id="Cell-SW_' + this.ControlID + '" class="ArrowImageCell ArrowImageCell_SW" style="visibility:hidden"><div class="ArrowImage ArrowImage_SW" id="ArrowImage_SW_Div_' + this.ControlID + '" style="height:' + this.verticalArrowImageHeight + 'px;width:' + this.horizontalArrowImageWidth + 'px;"></div></td>');
	var InstructionArrowImageSE = $('<td id="Cell-SE_' + this.ControlID + '" class="ArrowImageCell ArrowImageCell_SE" style="visibility:hidden"><div class="ArrowImage ArrowImage_SE" id="ArrowImage_SE_Div_' + this.ControlID + '" style="height:' + this.verticalArrowImageHeight + 'px;width:' + this.horizontalArrowImageWidth + 'px;"></div></td>');
	var InstructionArrowImageS = $('<td id="Cell-S_' + this.ControlID + '" class="ArrowImageCell ArrowImageCell_S" style="visibility:hidden"><div class="ArrowImage ArrowImage_S" id="ArrowImage_S_Div_' + this.ControlID + '" style="height:' + this.verticalArrowImageHeight + 'px;width:' + this.verticalArrowImageWidth + 'px;"></div></td>');

	// text content
	var InstructionContentCell = $('<td id="Cell-C_' + this.ControlID + '"></td>');
	var InstructionContent = $('<div class="InstructionContent" id="InstructionContent_' + this.ControlID + '"></div>');
	var InstructionTextBlock = $('<div class="InstructionText" id="InstructionText_' + this.ControlID + '"> <span>' + this.InstructionText + '</span> </div>');
	var InstructionsOKButton = $('<div class="InstructionOKButtonHolder" id="InstructionOKButtonHolder_' + this.ControlID + '"><a class="InstructionOKButton" id="InstructionOKButton_' + this.ControlID + '">OK</a></div>');
	//InstructionBlock.append(this.InstructionArrowImage);
	InstructionContent.append(InstructionTextBlock);
	if (this.InstructionDetailsText) {
		var MoreButton = $('<br/><a class="MoreDetailButton" id="MoreDetailButton_' + this.ControlID + '" href="#">more...</a>');
		var MoreDetailsText = $('<div class="InstructionDetailText" id="InstructionDetailText_' + this.ControlID + '">' + this.InstructionDetailsText + '</div>');
		var MoreTextBlock = $('<div class="MoreInstructionDetail" id="MoreInstructionDetail_' + this.ControlID + '" style="display:none"></div>');
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

/**
 * PageTour
 * Page Tour consisting of instruction blocks along with sequential Navigation 
 */
function PageTour(name) {
	"use strict";
    this.constructor(name);
}
PageTour.prototype.constructor = function (name) {
	"use strict";
	this.name = name;
};
PageTour.prototype.name = "";
PageTour.prototype.pageInstructionsList = null;
PageTour.prototype.currentActiveInstruction = null;
PageTour.prototype.getPageInstructionsList = function () {
	"use strict";
	if (!this.pageInstructionsList) {
		this.pageInstructionsList = new InstructionsList();
	}
	return this.pageInstructionsList;
};
PageTour.prototype.start = function () {
	"use strict";
	var firstInstruction = this.getPageInstructionsList().getFirstInstruction();
	if (firstInstruction) {
		this.currentActiveInstruction = firstInstruction;
		firstInstruction.InstructionObject.show(true);
	}
};
PageTour.prototype.resume = function () {
	"use strict";
	if (this.currentActiveInstruction) {
		this.currentActiveInstruction.InstructionObject.show(true);
	}
};

PageTour.prototype.suspend = function () {
	"use strict";
	if (this.currentActiveInstruction) {
		this.currentActiveInstruction.InstructionObject.hide();
	}
};

PageTour.prototype.stop = function () {
	"use strict";
	if (this.currentActiveInstruction) {
		this.currentActiveInstruction.InstructionObject.hide();
		var firstInstruction = this.getPageInstructionsList().getFirstInstruction();
		this.currentActiveInstruction = firstInstruction;
	}
};
PageTour.prototype.showNextInstruction = function () {
	"use strict";
	if (this.currentActiveInstruction) {
		var nextInstruction = this.currentActiveInstruction.nextInstruction;
		if (nextInstruction) {
			nextInstruction.InstructionObject.show(true);
			this.currentActiveInstruction = nextInstruction;
		}

	}
};
PageTour.prototype.add = function (overlayInstructionObject) {
	"use strict";
	var me = this;
	overlayInstructionObject.addListener("__on_show_next_instruction__", function () { me.showNextInstruction(); });
	this.getPageInstructionsList().add(overlayInstructionObject);
};

