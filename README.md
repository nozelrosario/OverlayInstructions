Overlay Instructions & Page Tour
==========================

OverlayInstructions is a JQuery based library for showing help/instructions on the page in a innovative and user friendly manner.

Page Tour is feature which is integrated onto Overlay Instructions library. Page Tour helps to combine several OverlayInstructions in a structured manner and provides the user a unique experience of reading help/instructions on the page. Can be used to provide a Tour of the page features. 

Demo:
-------------------------


ScreenShot
-------------------------
<img src="https://github.com/nozelrosario/OverlayInstructions/blob/master/Test/screenshot.jpg?raw=true" height="100%" width="100%"/>


How to use OverlayInstructions
------------------------
###Getting started

Download the script & CSS files and reference them in your html page.
```HTML
<link href="OverlayInstructions.css" rel="stylesheet">
<link href="ChalkBoard.css" rel="stylesheet">
<script type="text/javascript" src="jquery-2.0.3.js"></script> <!--JQuery required-->
<script src="OverlayInstructions.js"></script>
```

If you are interested in customizing the styles/images of your Instructions you can make changes to  ChalkBoard.css. Arrow images are included in a seperate folder which are required as well.


###Creating a simple Overlay Instruction
1. Create a instance of OverlayInstructions Class. 
```Javascript
     var inst1 = new OverlayInstructions({ID:"inst1",
                                        InstructionString:"Instruction title",
    									InstructionDetailsString:"<i> Instruction Text <i/>",
                                        targetID:"input1" });
```

OverlayInstructions constructor supports multiple config.  options, Following is the listing :
| Name| DataType | Default  | Required | Description|
|:-----------|:-------------:|:-----:|:-----:|:-----:|
| ID  | String | - | YES | Unique ID of the Instruction Widget.|
|InstructionString | String | - | Optional |  Instruction Title Text to be rendered|
| InstructionDetailsString | String | - | Optional | Instruction Detail Text to be rendered |
|targetID |String|-|Optional|"ID" of the target HTML element for which the Instruction is displayed|
|arrowImagePosition|String|"W"|Optional|String indication the direction that the arrow should point. Possible values [E,W,S,N,NE,NW,SE,SW]|
|arrowImageURL|String (url) | - | Optional | URL of a custom image that should be rendered instead of default arrow image|
|posX |Numeric (px or %) | - | Optional | default X-coordinate of the Instruction Block|
|posY|Numeric (px or %) | - | Optional | default Y-coordinate of the Instruction Block|
|arrowImageRotationAngle|Numeric| - | Optional | Rotation angle for the arrow image|
|expandDetails|Bool| false | Optional| Boolean indicating whether to expand the Instruction Details by default|
| | | | | |

2. Call the show() method.
```Javascript
    inst1.show();
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


How to use Page Tour
------------------------
###Getting started

Along with the OverlayInstructions script you will have to add refrence to PageTour.js. Download the script & CSS files and reference them in your html page.
```HTML
<link href="OverlayInstructions.css" rel="stylesheet">
<link href="ChalkBoard.css" rel="stylesheet">
<script type="text/javascript" src="jquery-2.0.3.js"></script> <!--JQuery required-->
<script src="OverlayInstructions.js"></script>
<script src="PageTour.js"></script> <!-- Required for Page Tour feature -->
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
    var inst1 = new OverlayInstructions({ID:"inst1",
                                        InstructionString:"Instruction title 1",
    									InstructionDetailsString:"<i> Instruction Text <i/>",
                                        targetID:"input1" });
    var inst2 = new OverlayInstructions({ID:"inst2",
                                        InstructionString:"Instruction title 2",
    									InstructionDetailsString:"<i> Instruction Text <i/>",
                                        targetID:"input2" });
    var inst3 = new OverlayInstructions({ID:"inst3",
                                        InstructionString:"Instruction title 3",
    									InstructionDetailsString:"<i> Instruction Text <i/>",
                                        targetID:"input3" });
    PageTourOnChalkboard.add(inst1);
    PageTourOnChalkboard.add(inst2);
    PageTourOnChalkboard.add(inst3);
```
3. Start the Tour
```Javascript
    PageTourOnChalkboard.start();
```
###Methods provided by OverlayInstructions
| Method_Name(Arguments)   | Return Type  | Description
| :----------- |:-------------:| :-----:|
|  start()  |  void  | Starts the PageTour
|  suspend()  |  void  | Suspends the PageTour
|  resume()  |  void  | Resumes a Suspended PageTour
|  stop()  |  void  | Stops the PageTour.Reset to 1st instruction of Tour
|  add(overlayInstructionObject)  |  void  | Adds a OverlayInstruction widget to the Page Tour
|  remove(overlayInstructionObject)  |  void  | Removes a OverlayInstruction widget from the Page Tour


What's Comming Next
-------------------------
+ More simple Jquery style syntax. Eg. &lt;button id="Save" O-InstructionText="Saves your file".....
+ Code Re-Factoring [optimize]
+ More Themes
+ Transition Animations
+ etc.....
