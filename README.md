Overlay Instructions & Page Tour
==========================
##**PageTour** v0.0.1

Page Tour is a small (~200K) JQuery based library for showing help/instructions on the page in a innovative and user friendly manner. This library can be used with any HTML page for (mobile/Desktop) to show Help/Instructions for the Page. OverlayInstruction is standalone feature which which can be used to show standalone instruction. Page Tour helps to combine several OverlayInstructions in a structured manner and provides the user a unique experience of reading help/instructions on the page. Can be used to provide a Tour of the page features. 



ScreenShot 
-------------------------
A picture = 1000 words :-)
<img src="https://github.com/nozelrosario/OverlayInstructions/blob/v0.0.1/Demo/screenshot.gif?raw=true" />



How to use Page Tour
------------------------
###Getting started

Along with the OverlayInstructilons script you will have to add refrence to PageTour.js. Download the script & CSS files and reference them in your html page.
```HTML
<link href="style.css" rel="stylesheet">
<script type="text/javascript" src="jquery-2.0.3.js"></script> <!--JQuery required-->
<link href="PageTour.min.js" rel="stylesheet"> <!-- Required for Page Tour feature -->
```

###Creating a simple Page Tour
 1.  Create a instance of PageTour Class. 
```Javascript
    var PageTourOnChalkboard = new PageTour("PageTour_On_ChalkBoard");
```
The pageTour constructor take the ID as argument. "ID" will the unique identifier for your PageTour.
You can create multiple page tours with Same set of OverlayInstruction Widgets. 

 2. Create OverlayInstructions widgets and add to the PageTour
```Javascript
    PageTourOnChalkboard.addInstruction({ID:"inst1",
                                        InstructionString:"Instruction title 1",
    									InstructionDetailsString:"<i> Instruction Text <i/>",
                                        targetID:"input1" });
    PageTourOnChalkboard.addInstruction({ID:"inst2",
                                        InstructionString:"Instruction title 2",
    									InstructionDetailsString:"<i> Instruction Text <i/>",
                                        targetID:"input2" });
    PageTourOnChalkboard.addInstruction({ID:"inst3",
                                        InstructionString:"Instruction title 3",
    									InstructionDetailsString:"<i> Instruction Text <i/>",
                                        targetID:"input3" });
```
3. Start the Tour
```Javascript
    PageTourOnChalkboard.show();
```
This will show the PageTour overlay on screen along with "Stop" - "Play" - "Next" - "Previous" navigation buttons at bottom of page.

<img src="https://github.com/nozelrosario/OverlayInstructions/blob/v0.0.1/Demo/screenshot2.png?raw=true" />

###Methods provided by PageTour
| Method_Name(Arguments)   | Return Type  | Description
| :----------- |:-------------:| :-----:|
|  show()  |  void  | Shows the PageTour overlay on the screen
|  hide()  |  void  | Hides the PageTour overlay
|  play()  |  void  | Starts the PageTour,Shows the Instruction on Screen
|  pause()  |  void  | Suspends the PageTour playback. hides the currently shown instruction
|  stop()  |  void  | Stops the playback,Hides the Pagetour Ocerlay & resets the control to 1st instruction
|  jumpToNextInstruction()  |  void  |  Navigate to next Instruction in the sequence.
|  jumpToPreviousInstruction()  |  void  |  Navigate to previous Instruction in the sequence.
|  showInstruction(instructionID)  |  void  | Show a particular instruction in PageTour based on its "InstructionID"
|  getInstruction(instructionID)  |  OverlayInstructions  | Returns a refrence to particular instruction (OverlayInstructions Object) in PageTour based on its "InstructionID"
|  removeInstruction(instructionID)  |  void  | Removes a particular instruction in PageTour based on its "InstructionID"
|  addInstruction(params)  |  void  | Adds a new instruction to PageTour. [Refer OverlayInstructions class for "params"](#InstructionParams)
|||


##**OverlayInstructions**
-------------------
Is is also possible to show a standalone Overlay Instruction independent of the PageTour. Following section will guide you through.
For Eg.
<img src="https://github.com/nozelrosario/OverlayInstructions/blob/v0.0.1/Demo/screenshot1.png?raw=true" /> 
How to use OverlayInstructions
------------------------
###Getting started

Download the script & CSS files and reference them in your html page.
```HTML
<link href="style.css" rel="stylesheet">
<script type="text/javascript" src="jquery-2.0.3.js"></script> <!--JQuery required-->
<link href="PageTour.min.js" rel="stylesheet"> <!-- Required for Page Tour feature -->
```

If you are interested in customizing the styles/images of your Instructions you can make changes to  ChalkBoard.css. Arrow images are included in a seperate folder which are required as well.


###Creating a simple Overlay Instruction
1. Create a instance of OverlayInstructions Class. 
```Javascript
     var help_indicator = new OverlayInstructions({ID:"Help_Menu_link_help",
	                                               InstructionString:"Dont know how to navigate ??",
	                                               InstructionDetailsString:"<br/> Click the - Help - menu button ",
	                                               targetID:"Help_Menu_link",
	                                               expandDetails:true});
```

###Config Params<a name="InstructionParams"></a>
OverlayInstructions constructor supports multiple config.  options, Following is the listing :

| Name| DataType | Default  | Required | Description|
|:-----------|:-------------:|:-----:|:-----:|:-----:|
| ID  | String | - | YES | Unique ID of the Instruction Widget.|
|InstructionString | String | - | Optional |  Instruction Title Text to be rendered|
| InstructionDetailsString | String | - | Optional | Instruction Detail Text to be rendered |
|targetID |String|-|Optional|"ID" of the target HTML element for which the Instruction is displayed|
|arrowImagePosition|String|"W"|Optional| [**Primary position**] String indication the direction that the arrow should point. **Possible values [E,W,S,N,NE,NW,SE,SW]**|
|arrowImageURL|String (url) | - | Optional | URL of a custom image that should be rendered instead of default arrow image|
|posX |Numeric (px or %) | - | Optional | default X-coordinate of the Instruction Block|
|posY|Numeric (px or %) | - | Optional | default Y-coordinate of the Instruction Block|
|arrowImageRotationAngle|Numeric| - | Optional | Rotation angle for the arrow image|
|expandDetails|Bool| false | Optional| Boolean indicating whether to expand the Instruction Details by default|
|additionalArrows|Array[]| - | Optional| Additional arrows to be shown on a instruction. **Possible values ["E","W","S","N","NE","NW","SE","SW"]** |
| | | | | |

2. Call the show() method.
```Javascript
    help_indicator.show();
```

3. Done :)

###Methods provided by OverlayInstructions
| Method_Name(Arguments)   | Return Type  | Description
| :----------- |:-------------:| :-----:|
|  getID()  |  String  | Returns ID of the Instruction Widget
|  refreshInstructionBlockPosition()  |  void  |  Triggers the auto re-positioning of the Instruction widget. Can be used to force automatic re-positioning.  |  
|  setPosition(positionX, positionY)  |  void  |  Positions the Instruction Block at specified X,Y co-ordinates on the screen  |  
| show()   |  void  |  Shows the Instruction on Screen  |  
| hide()   |  void  |  Hides the Instruction on Screen  |  
|showArrow(newArrowPosition, keepCurrentArrow) | void | Shows a arrow on instruction. "newArrowPosition" (Required) indicates the arrow to be shown "keepCurrentArrow" (Optional) bool indicates if to hide the previously shown arrow. Can be used to show multiple arrows per instruction Widget.|
|setArrowImageRotationAngle(RotationAngle,arrowPosition) | void | Rotates the ArrowImage by spacified angle."RotationAngle" (numeric) Indicates the rotation angle & "arrowPosition" indicates the arrow which will be rotated.Empty will rotate default arrow .
|setArrowImage(arrowImageURL, arrowImagePosition)| void| sets a custom arrow image (arrowImageURL) on the specofied arrow position (arrowImagePosition) 
| | | |


### Using Events on OverlayInstruction Object
####Adding a event Listener
```Javascript
    inst1.addEventListener("onOkClick",function() { /* Event Handler code */  });
```
#### Events supported :
|Event|Description|
|:-----|:--------:|
| onInitialized | Triggered after OverlayInstruction Widget is initialized|
| onShow | Triggered when OverlayInstruction Widget is shown on screen |
| onHide | Triggered after OverlayInstruction Widget is hidden on screen |
| onOkClick | Triggered when "OK" button is clicked on OverlayInstruction Widget | 


What's Comming Next
-------------------------
+ More simple Jquery style syntax. Eg. &lt;button id="Save" O-InstructionText="Saves your file".....
+ Code Re-Factoring [optimize]
+ More Themes
+ Transition Animations
+ Mobile/Touch Friendly  UI
+ etc.....

## License

Copyright 2014 Nozel Rosario

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
