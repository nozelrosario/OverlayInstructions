OverlayInstructions = function (ID,InstructionString,InstructionDetailsString,targetID,arrowImagePosition,arrowImageURL,posX,posY,arrowImageRotationAngle) {
	if(this.validateArguments(ID,InstructionString,InstructionDetailsString,targetID,arrowImagePosition,arrowImageURL,posX,posY)){
		this.ControlID = ID;
		this.targetElement = (targetID)? new TargetElement(targetID): "";
		this.InstructionText = InstructionString;
		this.InstructionDetailsText= InstructionDetailsString;
//		Create Instruction Block
		this.createOverlay();
		this.createInstructionBlockElement();
		if(arrowImagePosition && this.isValidArrowPosition(arrowImagePosition)){
			this.arrowPosition = arrowImagePosition;
			if(arrowImageURL){
				this.setArrowImage(arrowImageURL);
			}
		} else {
			this.autoSetArrowPosition();
		}
		if(posX && posY){
			this.setPosition(posX,posY);
		} else {
			this.calculateInstructionBlockCoOrdinates(this.arrowPosition);
			this.setPosition(this.posX,this.posY);
			this.setArrowImageRotationAngle(arrowImageRotationAngle);
		}

	}
	this.showArrow(this.arrowPosition,false);

	var eventData = { OverlayInstructionObj : this };
	$("#InstructionOKButton_" + this.ControlID).click(eventData,this.OnInstructionOKButtonClick);

	$("#MoreDetailButton_" + this.ControlID).click(eventData,this.ToggleMoreDetail);
};
OverlayInstructions.prototype.ControlID="";
OverlayInstructions.prototype.targetElement="";
OverlayInstructions.prototype.InstructionPositionX="";
OverlayInstructions.prototype.InstructionPositionY="";
OverlayInstructions.prototype.deltaX = 5;   // 50 px offset horizontal , so that the arrow does not stick to the element
OverlayInstructions.prototype.deltaY = 5;	   // 0px vertical offset. vertical displacement not required.
OverlayInstructions.prototype.InstructionBlockElment = null;
OverlayInstructions.prototype.InstructionOverlay = null;
OverlayInstructions.prototype.arrowPosition="W"; // {"E","W","S","N","NE","NW","SE","SW"}
OverlayInstructions.prototype.arrowImage="";
OverlayInstructions.prototype.arrowImageHeight=50;  //px
OverlayInstructions.prototype.arrowImageWidth=100;  //px
OverlayInstructions.prototype.arrowImageRotationAngle=0 ;
OverlayInstructions.prototype.instructionBlockTheme = "ChalkBoard";
OverlayInstructions.prototype.arrowStyles= {
		"E" : "arrowImages/arrow-E.png",
		"W" : "arrowImages/arrow-W.png",
		"S" : "arrowImages/arrow-S.png",
		"N"  : "arrowImages/arrow-N.png",
		"NE" : "arrowImages/arrow-NE.png",
		"NW" : "arrowImages/arrow-NW.png",
		"SE" : "arrowImages/arrow-SE.png",
		"SW" : "arrowImages/arrow-SW.png"	
};
OverlayInstructions.prototype.InstructionText="";
OverlayInstructions.prototype.InstructionDetailsText="";

OverlayInstructions.prototype.ToggleMoreDetail = function (eventData) {
	var OverlayInstructionObj = eventData.data.OverlayInstructionObj;

	if(($("#MoreInstructionDetail_"+ OverlayInstructionObj.ControlID).is(':visible'))) {
		$("#MoreDetailButton_" + OverlayInstructionObj.ControlID).text("more...");
	} else {
		$("#MoreDetailButton_" + OverlayInstructionObj.ControlID).text("less...");
	}
	$("#MoreInstructionDetail_"+ OverlayInstructionObj.ControlID).toggle("fast");

};

OverlayInstructions.prototype.OnInstructionOKButtonClick = function (eventData) {
	var OverlayInstructionObj = eventData.data.OverlayInstructionObj;
	OverlayInstructionObj.hide();
	//detach event handlers
	//remove instruction block
	//remove overlay
	//destroy
};

OverlayInstructions.prototype.hideOverlay = function () {
	var overlay = this.getOverlay();
	overlay.hide();
};

OverlayInstructions.prototype.showOverlay = function () {
	var overlay = this.getOverlay();
	overlay.show();
};

OverlayInstructions.prototype.getOverlay = function() {
	if(!this.InstructionOverlay){
		return this.createOverlay();
	} else {
		return this.InstructionOverlay;
	}
};

OverlayInstructions.prototype.createOverlay = function () {
	var overlay = $('#InstructionsOverlay');
	if(overlay.length <= 0) { 
		overlay = $( '<div class="InstructionsOverlay" id="InstructionsOverlay" style="display:none"></div>' );
		$( "body" ).append(overlay);	
	}
	this.InstructionOverlay = overlay;
	return overlay;
};
OverlayInstructions.prototype.getInstructionBlockElement = function () {
	if(!this.InstructionBlockElment) {
		this.createInstructionBlockElement();
	}
	return this.InstructionBlockElment;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
TargetElement = function(elementID) {
	if(elementID){
		this.ID = elementID;
		this.Widget = $('#' + this.ID);
		if(this.Widget.length <= 0) {
			alert("Target element with ID='" + elementID + "' not found on page");
		} 
	} else {
		alert("Target Cannot be Empty");
	}

};
TargetElement.prototype.ID="";
TargetElement.prototype.Widget="";

TargetElement.prototype.getPositionX1 = function(){
	var targetElementPosition = this.Widget.offset();
	return targetElementPosition.left;
};
TargetElement.prototype.getPositionX2 = function(){
	return (this.getPositionX1() + this.getWidth());
};
TargetElement.prototype.getPositionY1 = function(){
	var targetElementPosition = this.Widget.offset();
	return targetElementPosition.top;
};
TargetElement.prototype.getPositionY2 = function(){
	return this.getPositionY1() + this.getHeight();
};
TargetElement.prototype.getWidth = function(){
	return this.Widget.actual('width');
};
TargetElement.prototype.getHeight = function(){
	return this.Widget.actual('height');
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


OverlayInstructions.prototype.autoSetArrowPosition = function() {

	var targetElementPositionX1,targetElementPositionX2,targetElementPositionY1,targetElementPositionY2,targetElementWidth,targetElementHeight;
	var screenHeight,screenWidth;
	var instructionContentHeight,instructionContentWidth;
	var arrowToTargetPadding = 30; // spacing between arrow and target element. 

	if(this.targetElement) {

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
		var instructionContenElement = $('#' + 'Cell-C_'+ this.ControlID);
		instructionContentHeight = instructionContenElement.actual('height');
		instructionContentWidth = instructionContenElement.actual('width');

		// resultant Horizontal & Vertical height-width of instruction block
		var horizontal_InstructionBlockHeight,horizontal_InstructionBlockWidth;
		horizontal_InstructionBlockHeight = (this.arrowImageHeight > instructionContentHeight)?this.arrowImageHeight:instructionContentHeight;
		horizontal_InstructionBlockWidth = this.arrowImageWidth + instructionContentWidth;

		var vertical_InstructionBlockHeight,vertical_InstructionBlockWidth;
		vertical_InstructionBlockHeight = this.arrowImageHeight + instructionContentHeight;
		vertical_InstructionBlockWidth = (this.arrowImageWidth > instructionContentWidth)?this.arrowImageWidth:instructionContentWidth;

		// Determine the appropriate arrow position based on target dimensions & screen dimensions

		// determine instruction block position left/right of target element
		if((targetElementPositionX2 + horizontal_InstructionBlockWidth) < screenWidth) {  // if right possible
			// RIGHT
			// possible positions
			// W, NW,SW
			if(targetElementPositionY2 > horizontal_InstructionBlockHeight){
				//position = SW
				this.arrowPosition ="SW";

			} else if(targetElementPositionY2 > (horizontal_InstructionBlockHeight/2)){  // if space above target is greater than 1/2 of inst_block height
				// position = W
				this.arrowPosition ="W";
			} else {
				//position = NW
				this.arrowPosition ="NW";
			}

		} else if((horizontal_InstructionBlockWidth + arrowToTargetPadding) <= targetElementPositionX1) {   // if left possible
			// LEFT
			// possible positions
			// E,NE,SE
			if(targetElementPositionY1 > horizontal_InstructionBlockHeight){
				//position = SE
				this.arrowPosition ="SE";

			} else if(targetElementPositionY1 > (horizontal_InstructionBlockHeight/2)){  // if space above target is greater than 1/2 of inst_block height
				// position = E
				this.arrowPosition ="E";
			} else {
				//position = NE	
				this.arrowPosition ="NE";
			}

		} else if ((vertical_InstructionBlockHeight + arrowToTargetPadding) <= targetElementPositionY1) { //determine block above or below target element

			// ABOVE
			// possible positions
			// S,SW,SE
			if(targetElementPositionX1 > vertical_InstructionBlockWidth){
				//position = SE
				this.arrowPosition ="SE";

			} else if(targetElementPositionX1 > (vertical_InstructionBlockWidth/2)){  // if space above target is greater than 1/2 of inst_block height
				// position = S
				this.arrowPosition ="S";
			} else {
				//position = SW				
				this.arrowPosition ="SW";
			}

		} else if((targetElementPositionY2 + vertical_InstructionBlockHeight) < screenHeight) {
			// BELOW
			// possible positions
			// N,NE,NW
			if(targetElementPositionX1 > vertical_InstructionBlockWidth){
				//position = NE
				this.arrowPosition ="NE";

			} else if(targetElementPositionX1 > (vertical_InstructionBlockWidth/2)){  // if space below target is greater than 1/2 of inst_block height
				// position = N
				this.arrowPosition ="N";
			} else {
				//position = NW		
				this.arrowPosition ="NW";
			}
		}

	} else {
		//	target element not found/defined , then take defaults
		this.arrowPosition ="NW";
	}	
};

OverlayInstructions.prototype.calculateInstructionBlockCoOrdinates = function(arrowPosition) {
	if(this.isValidArrowPosition(arrowPosition)){
		var instructionBlockX,instructionBlockY,arrowImageRotationAngle;
		var targetElementPositionX1,targetElementPositionX2,targetElementPositionY1,targetElementPositionY2,targetElementWidth,targetElementHeight;
		// Target element dimensions
		targetElementPositionX1 = this.targetElement.getPositionX1();
		targetElementPositionY1 = this.targetElement.getPositionY1();
		targetElementWidth = this.targetElement.getWidth();
		targetElementHeight = this.targetElement.getHeight();
		targetElementPositionX2 = this.targetElement.getPositionX2();
		targetElementPositionY2 = this.targetElement.getPositionY2(); 

		// instruction block dimensions
		var instructionContenElement = $('#' + 'Cell-C_'+ this.ControlID);
		var instructionContentHeight = instructionContenElement.actual('height');
		var instructionContentWidth = instructionContenElement.actual('width');

		// resultant Horizontal & Vertical height-width of instruction block
		var horizontal_InstructionBlockHeight,horizontal_InstructionBlockWidth;
		horizontal_InstructionBlockHeight = (this.arrowImageHeight > instructionContentHeight)?this.arrowImageHeight:instructionContentHeight;
		horizontal_InstructionBlockWidth = this.arrowImageWidth + instructionContentWidth;

		var vertical_InstructionBlockHeight,vertical_InstructionBlockWidth;
		vertical_InstructionBlockHeight = this.arrowImageHeight + instructionContentHeight;
		vertical_InstructionBlockWidth = (this.arrowImageWidth > instructionContentWidth)?this.arrowImageWidth:instructionContentWidth;


		switch(arrowPosition){
		case "NW": 
			instructionBlockX = targetElementPositionX2 + this.deltaX ;
			instructionBlockY = targetElementPositionY2 + this.deltaY;
			arrowImageRotationAngle = 30;
			break;//done

		case "N": 	
			instructionBlockX = ((targetElementPositionX1 + ((targetElementPositionX2 - targetElementPositionX1)/2))+ this.deltaX) - (vertical_InstructionBlockWidth/2) ;
			instructionBlockY = targetElementPositionY2 + this.deltaY;
			arrowImageRotationAngle = 90;
			break;

		case "NE": 
			instructionBlockX = targetElementPositionX1 - this.deltaX;
			instructionBlockY = targetElementPositionY1  + this.deltaY;
			arrowImageRotationAngle = 120;
			break;//done

		case "E": 
			instructionBlockX = targetElementPositionX1 - ( horizontal_InstructionBlockWidth + this.deltaX );
			instructionBlockY = ((targetElementPositionY1 + ((targetElementPositionY2 - targetElementPositionY1)/2)) + this.deltaY) - (horizontal_InstructionBlockHeight/2);
			arrowImageRotationAngle = 180;
			break; //done
			

		case "SE": 
			instructionBlockX = targetElementPositionX1 - ( vertical_InstructionBlockWidth + this.deltaX );
			instructionBlockY = targetElementPositionY1 - ( vertical_InstructionBlockHeight + this.deltaY );
			arrowImageRotationAngle = 220;
			break;//done

		case "S":
			instructionBlockX = (targetElementPositionX1 + ((targetElementPositionX2 - targetElementPositionX1)/2)) - ((vertical_InstructionBlockWidth/2) + this.deltaX);
			instructionBlockY = targetElementPositionY1 - ( vertical_InstructionBlockHeight + this.deltaY );
			break;//done
			arrowImageRotationAngle = 270;

		case "SW": 
			instructionBlockX = targetElementPositionX2 + this.deltaX ;
			instructionBlockY = ((targetElementPositionY1 +((targetElementPositionY2 - targetElementPositionY1)/2)) + this.deltaY) - vertical_InstructionBlockHeight;
			arrowImageRotationAngle = 300;
			break;//done

		case "W": 
			instructionBlockX = targetElementPositionX2 + this.deltaX ;
			instructionBlockY = ((targetElementPositionY1 +((targetElementPositionY2 - targetElementPositionY1)/2)) + this.deltaY) - (horizontal_InstructionBlockHeight/2);
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

	this.posX = instructionBlockX;
	this.posY = instructionBlockY;
	this.arrowImageRotationAngle = arrowImageRotationAngle;

};

OverlayInstructions.prototype.autoSetInstructionBlockPosition = function(){
	this.autoSetArrowPosition();
	this.calculateInstructionBlockCoOrdinates(this.arrowPosition);
	this.setPosition(this.posX,this.posY);
};

OverlayInstructions.prototype.setPosition = function (positionX,positionY) {
	this.InstructionPositionX = positionX;
	this.InstructionPositionY = positionY;
	$('#InstructionBlock_'+ this.ControlID).offset({top: positionY , left: positionX});
};

OverlayInstructions.prototype.show = function () {
	this.showOverlay();
	$('#InstructionBlock_'+ this.ControlID).show();

};

OverlayInstructions.prototype.hide = function () {
	this.hideOverlay();
	$('#InstructionBlock_'+ this.ControlID).hide();
};

OverlayInstructions.prototype.setTheme = function (theme) {
	if(this.instructionBlockTheme){
		$('#InstructionBlock_'+ this.ControlID).removeClass(this.instructionBlockTheme);
	}
	if(theme){
		$('#InstructionBlock_'+ this.ControlID).addClass(theme);
	}
	
};

OverlayInstructions.prototype.hideAllArrows = function () {
	var position;
	for (position in this.arrowStyles){
		$('#Cell-' + position + '_' + this.ControlID).invisible();
	}
	//TODO: decide if to clear the this.arrowPosition too.
};

OverlayInstructions.prototype.showArrow = function (newArrowPosition,keepCurrentArrow) {
	if(newArrowPosition && this.isValidArrowPosition(newArrowPosition)) {
		if(!keepCurrentArrow) {
			this.hideAllArrows();
		}
		this.arrowPosition = newArrowPosition;
		$('#Cell-' + newArrowPosition + '_' + this.ControlID).visible();
	}
};

OverlayInstructions.prototype.setArrowImageRotationAngle = function(arrowImageRotationAngle) {
	if(arrowImageRotationAngle) {
		this.arrowImageRotationAngle = arrowImageRotationAngle;
	}
	this.rotateArrowImage(this.arrowImageRotationAngle, this.arrowPosition);
};

OverlayInstructions.prototype.rotateArrowImage = function(arrowImageRotationAngle,arrowImagePosition) {
	if(arrowImageRotationAngle && arrowImagePosition) {
		$('#ArrowImage_' + arrowImagePosition + '_Div_' + this.ControlID).rotate(arrowImageRotationAngle);
	}
	
};

OverlayInstructions.prototype.setArrowImage = function(arrowImageURL,arrowImagePosition){
	if(arrowImagePosition && this.isValidArrowPosition(arrowImagePosition) && arrowImageURL){
		// change the url in respective src of the image tag corresponding to the position
		$('#ArrowImage_' + arrowImagePosition + '_Div_' + this.ControlID).css('background-image', arrowImageURL);
		this.arrowStyles[arrowImagePosition] = arrowImageURL;
	} else {
		if(arrowImageURL){
			// change the url in respective src of the image tag corresponding to the current position of arrow , i.e this.arrowPosition
			$('#ArrowImage_' + this.arrowPosition + '_Div_' + this.ControlID).css('background-image', arrowImageURL);
			this.arrowStyles[this.arrowPosition] = arrowImageURL;
		}
	}
};

OverlayInstructions.prototype.validateArguments = function (ID,InstructionString,InstructionDetailsString,targetID,arrowImagePosition,arrowImageURL,posX,posY) {
	if(!ID){
		console.log("Error : ID cannot be Empty");
		return false;
	}
	if(!InstructionString && !InstructionDetailsString) {
		console.log("Warning : Instruction text is empty, no content to render");
	}
	if(targetID && arrowImagePosition && posX && posY && arrowImageURL){
		console.log("Warning : Positioning arguments defaultes, Target element position will be ignored.");
	}
	if(!targetID){
		if(!posX && !posY){
			console.log("Warning : (X,Y) is empty, defaults(0,0) will be applied.");
		}
		if(!arrowImagePosition){
			console.log("Warning : Default arrow position of 'NW' will be applied");
		}
	}
	if(arrowImageURL){
		if(!arrowImagePosition){
			console.log("Error : Arrow position is required for applying custom arrow image.");
			return false;
		}
	}
	return true;
};

OverlayInstructions.prototype.isValidArrowPosition = function (arrowPosition) {
	if(arrowPosition == "" || arrowPosition == "E" || arrowPosition == "W" || arrowPosition == "S" || arrowPosition == "N" || arrowPosition == "NE" || arrowPosition == "NW" || arrowPosition == "SE" || arrowPosition == "SW" ) {
		return true;
	} else {
		alert("Incorrect arrow position. Shoud be one of [ E,W,S,N,NE,NW,SE,SW ]");
		return false;
	}
};

OverlayInstructions.prototype.createInstructionBlockElement = function () {
	var InstructionBlock = $('<table id="InstructionBlock_'+ this.ControlID +'" class="InstructionBlock '+ this.instructionBlockTheme +'" style="display:none"></table>');
	var InstructionBlockTopRow = $('<tr id="TopRow_'+ this.ControlID +'"></tr>');
	var InstructionBlockMiddleRow = $('<tr id="MiddleRow_'+ this.ControlID +'"></tr>');
	var InstructionBlockBottomRow = $('<tr id="BottomRow_'+ this.ControlID +'"></tr>');

	//Arrow Images
	var InstructionArrowImageNW = $('<td id="Cell-NW_' + this.ControlID + '" class="ArrowImageCell" style="visibility:hidden"><div class="ArrowImage ArrowImage_NW" id="ArrowImage_NW_Div_' + this.ControlID + '" style="height:' + this.arrowImageHeight + 'px;width:'+ this.arrowImageWidth +'px;"></div></td>');
	var InstructionArrowImageN = $('<td id="Cell-N_' + this.ControlID + '" class="ArrowImageCell" style="visibility:hidden"><div class="ArrowImage ArrowImage_N" id="ArrowImage_N_Div_' + this.ControlID + '" style="height:' + this.arrowImageHeight + 'px;width:'+ this.arrowImageWidth +'px;"></div></td>');
	var InstructionArrowImageNE = $('<td id="Cell-NE_' + this.ControlID + '" class="ArrowImageCell" style="visibility:hidden"><div class="ArrowImage ArrowImage_NE" id="ArrowImage_NE_Div_' + this.ControlID + '" style="height:' + this.arrowImageHeight + 'px;width:'+ this.arrowImageWidth +'px;"></div></td>');
	var InstructionArrowImageW = $('<td id="Cell-W_' + this.ControlID + '" class="ArrowImageCell" style="visibility:hidden"><div class="ArrowImage ArrowImage_W" id="ArrowImage_W_Div_' + this.ControlID + '" style="height:' + this.arrowImageHeight + 'px;width:'+ this.arrowImageWidth +'px;"></div></td>');
	var InstructionArrowImageE = $('<td id="Cell-E_' + this.ControlID + '" class="ArrowImageCell" style="visibility:hidden"><div class="ArrowImage ArrowImage_E" id="ArrowImage_E_Div_' + this.ControlID + '" style="height:' + this.arrowImageHeight + 'px;width:'+ this.arrowImageWidth +'px;"></div></td>');
	var InstructionArrowImageSW = $('<td id="Cell-SW_' + this.ControlID + '" class="ArrowImageCell" style="visibility:hidden"><div class="ArrowImage ArrowImage_SW" id="ArrowImage_SW_Div_' + this.ControlID + '" style="height:' + this.arrowImageHeight + 'px;width:'+ this.arrowImageWidth +'px;"></div></td>');
	var InstructionArrowImageSE = $('<td id="Cell-SE_' + this.ControlID + '" class="ArrowImageCell" style="visibility:hidden"><div class="ArrowImage ArrowImage_SE" id="ArrowImage_SE_Div_' + this.ControlID + '" style="height:' + this.arrowImageHeight + 'px;width:'+ this.arrowImageWidth +'px;"></div></td>');
	var InstructionArrowImageS = $('<td id="Cell-S_' + this.ControlID + '" class="ArrowImageCell" style="visibility:hidden"><div class="ArrowImage ArrowImage_S" id="ArrowImage_S_Div_' + this.ControlID + '" style="height:' + this.arrowImageHeight + 'px;width:'+ this.arrowImageWidth +'px;"></div></td>');

	// text content
	var InstructionContentCell = $('<td id="Cell-C_'+ this.ControlID +'"></td>');
	var InstructionContent = $('<div class="InstructionContent" id="InstructionContent_'+ this.ControlID +'"></div>');
	var InstructionTextBlock = $('<div class="InstructionText" id="InstructionText_'+ this.ControlID + '"> <span>' + this.InstructionText + '</span> </div>');
	var InstructionsOKButton = $('<div class="InstructionOKButtonHolder" id="InstructionOKButtonHolder_'+ this.ControlID +'"><a class="InstructionOKButton" id="InstructionOKButton_'+ this.ControlID +'">OK</a></div>');
	//InstructionBlock.append(this.InstructionArrowImage);
	InstructionContent.append(InstructionTextBlock);
	if(this.InstructionDetailsText) {
		var MoreButton = $('<br/><a class="MoreDetailButton" id="MoreDetailButton_'+ this.ControlID +'" href="#">more...</a>');
		var MoreDetailsText = $('<div class="InstructionDetailText" id="InstructionDetailText_'+ this.ControlID +'">'+ this.InstructionDetailsText +'</div>');
		var MoreTextBlock = $('<div class="MoreInstructionDetail" id="MoreInstructionDetail_'+ this.ControlID +'" style="display:none"></div>');
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
	$( "body" ).append(InstructionBlock);
	return InstructionBlock;
};