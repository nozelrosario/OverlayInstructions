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
PageTour.prototype.getPageInstructionsList = function () {
	"use strict";
	if (!this.pageInstructionsList) {
		this.pageInstructionsList = new InstructionsList();
	}
	return this.pageInstructionsList;
};
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

PageTour.prototype.__blockNavigationToNextInstruction = function () {
	this.__blockNextInstruction = true;
};

PageTour.prototype.__unBlockNavigationToNextInstruction = function () {
	this.__blockNextInstruction = false;
};

PageTour.prototype.__isNavigationToNextInstructionAllowed = function () {
	return this.__blockNextInstruction;
};

PageTour.prototype.pause = function () {
	"use strict";
	if (this.currentActiveInstruction) {
		this.__blockNavigationToNextInstruction();
		this.currentActiveInstruction.InstructionObject.hide();
		this.__unBlockNavigationToNextInstruction();
	}
	//this.hide();
};

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

PageTour.prototype.showInstruction = function (instructionID) {
	"use strict";
	var overlayInstructionObject = this.getPageInstructionsList().find(instructionID);
	if(overlayInstructionObject) {
		overlayInstructionObject.show();
	}
};

PageTour.prototype.getInstruction = function (instructionID) {
	"use strict";
	var overlayInstructionObject = this.getPageInstructionsList().find(instructionID);
	return overlayInstructionObject;
};

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

PageTour.prototype.__add = function (overlayInstructionObject) {
	"use strict";
	var me = this;
	overlayInstructionObject.addEventListener("__on_show_next_instruction__", function () { me.showNextInstruction(); });
	this.getPageInstructionsList().add(overlayInstructionObject);
};

PageTour.prototype.removeInstruction = function (instructionID) {
	"use strict";
	var overlayInstructionObject = this.getPageInstructionsList().find(instructionID);
	if(overlayInstructionObject) {
		overlayInstructionObject.removeEventListener("__on_show_next_instruction__");
		this.getPageInstructionsList().remove(overlayInstructionObject.ID);
	}
};

PageTour.prototype.addInstruction = function(params) {
	var overlayInstruction = new OverlayInstructions(params);
	this.__add(overlayInstruction);
	if(params.targetID) {
		this.addTarget(params.targetID,overlayInstruction);
	}
};

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

PageTour.prototype.OnInstructionTriggerButtonClick = function (eventData) {
	"use strict";
	var OverlayInstructionObj = eventData.data.OverlayInstructionObj;
	var PageTourObj = eventData.data.PageTourObj;
	var PageTourInstruction = PageTourObj.getPageInstructionsList().find(OverlayInstructionObj.getID());
	PageTourObj.currentActiveInstruction = PageTourInstruction;
	OverlayInstructionObj.show(true);
	PageTourObj.showPauseButton();
};

PageTour.prototype.rePositionInstructionTarget = function (targetElementID) {

		var targetWidgetInstructionTrigger = this.instructionTargets[targetElementID];  //$('#' + targetElementID);
		var targetElementPosition = $('#' + targetElementID).offset();
		var targetWidgetX1 = targetElementPosition.left;
		var targetWidgetY1 = targetElementPosition.top;
		targetWidgetInstructionTrigger.css("left", targetWidgetX1);
		targetWidgetInstructionTrigger.css("top", targetWidgetY1);
};

PageTour.prototype.rePositionAllInstructionTargets = function () {
	// loop through all targets and update each positions
	var instructionTarget;
	for (instructionTarget in this.instructionTargets) {
		if (this.instructionTargets.hasOwnProperty(instructionTarget)) {
			this.rePositionInstructionTarget(instructionTarget);
		}
	}
};

PageTour.prototype.refreshPageTourLayout = function () {
	this.resizeOverlay();
	this.rePositionAllInstructionTargets();
	
};

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

PageTour.prototype.resizeOverlay = function () {
	var overlay=this.getOverlay();
	overlay.height($(document).height()-1);
	overlay.width($(document).width()-1);
};

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

PageTour.prototype.createNavigationButtons = function () {
	var PageTourPlayButton = $('<a class="PageTourNavigationButton PageTourPlayButton" style="display:block;float:left;" id="PageTour_' + this.name + '_PlayButton"></a>');
	var PageTourPauseButton = $('<a class="PageTourNavigationButton PageTourPauseButton" style="display:none;float:left;" id="PageTour_' + this.name + '_PauseButton"></a>');
	var PageTourStopButton = $('<a class="PageTourNavigationButton PageTourStopButton" style="display:block;float:left;" id="PageTour_' + this.name + '_StopButton"></a>');
	var PageTourNextButton = $('<a class="PageTourNavigationButton PageTourNextButton" style="display:none;float:left;" id="PageTour_' + this.name + '_NextButton"></a>');
	var PageTourPreviousButton = $('<a class="PageTourNavigationButton PageTourPreviousButton" style="display:none;float:left;" id="PageTour_' + this.name + '_PreviousButton"></a>');
	var PageNavigationButtonsHolder = $('<div class="PageTourNavigationButtons ' + this.instructionBlockTheme + '" style="display:none; position:fixed; bottom: 0; width: 100%;" id="PageTour_' + this.name + '_NavigationButtons"></div>');
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

PageTour.prototype.onPlayButtonClick = function (eventData) {
	var PageTourObj = eventData.data.PageTourObj;
	PageTourObj.showPauseButton();
	PageTourObj.showNextPreviousButtons();
	PageTourObj.play();
};

PageTour.prototype.onPauseButtonClick = function (eventData) {
	var PageTourObj = eventData.data.PageTourObj;
	PageTourObj.showPlayButton();
	PageTourObj.pause();
};

PageTour.prototype.onStopButtonClick = function (eventData) {
	var PageTourObj = eventData.data.PageTourObj;
	PageTourObj.stop();
	PageTourObj.showPlayButton();
	PageTourObj.hideNextPreviousButtons();
};

PageTour.prototype.onNextButtonClick = function (eventData) {
	var PageTourObj = eventData.data.PageTourObj;
	PageTourObj.showPauseButton();
	PageTourObj.jumpToNextInstruction();
};

PageTour.prototype.onPreviousButtonClick = function (eventData) {
	var PageTourObj = eventData.data.PageTourObj;
	PageTourObj.showPauseButton();
	PageTourObj.jumpToPreviousInstruction();
};

PageTour.prototype.showPlayButton = function () {
	$('#PageTour_' + this.name + '_PlayButton').css("display","block");
	$('#PageTour_' + this.name + '_PauseButton').css("display","none");
};

PageTour.prototype.showPauseButton = function () {
	$('#PageTour_' + this.name + '_PlayButton').css("display","none");
	$('#PageTour_' + this.name + '_PauseButton').css("display","block");
};

PageTour.prototype.showNextPreviousButtons = function () {
	$('#PageTour_' + this.name + '_NextButton').css("display","block");
	$('#PageTour_' + this.name + '_PreviousButton').css("display","block");
};

PageTour.prototype.hideNextPreviousButtons = function () {
	$('#PageTour_' + this.name + '_NextButton').css("display","none");
	$('#PageTour_' + this.name + '_PreviousButton').css("display","none");
};

PageTour.prototype.disableNextPreviousButtons = function () {
	this.disableButton("NextButton");
	this.disableButton("PreviousButton");
};

PageTour.prototype.enableNextPreviousButtons = function () {
	this.enableButton("NextButton");
	this.enableButton("PreviousButton");
};

PageTour.prototype.disableButton = function (button) {
	$('#PageTour_' + this.name + '_'+ button).addClass('disabled');
};

PageTour.prototype.enableButton = function(button) {
	$('#PageTour_' + this.name + '_'+ button).removeClass('disabled');
};

PageTour.prototype.show = function () {
	this.refreshPageTourLayout();
	var overlay=this.getOverlay();
	var navigationButtons = this.getNavigationButtons();
	overlay.css("display","block");
	navigationButtons.css("display","block");
	this.__Is_Active__ = true;
};

PageTour.prototype.hide = function () {
	var overlay=this.getOverlay();
	var navigationButtons = this.getNavigationButtons();
	overlay.css("display","none");
	navigationButtons.css("display","none");
	this.__unBlockNavigationToNextInstruction();
	this.__Is_Active__ = false;
};



