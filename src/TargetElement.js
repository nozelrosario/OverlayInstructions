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


