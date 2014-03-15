

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
	overlayInstructionObject.addEventListener("__on_show_next_instruction__", function () { me.showNextInstruction(); });
	this.getPageInstructionsList().add(overlayInstructionObject);
};

PageTour.prototype.remove = function (overlayInstructionObject) {
	"use strict";
	overlayInstructionObject.removeEventListener("__on_show_next_instruction__");
	this.getPageInstructionsList().remove(overlayInstructionObject.ID);
};

