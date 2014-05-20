var help_indicator = new OverlayInstructions({ID:"Help_Menu_link_help",
	 InstructionString:"Dont know how to navigate ??",
	 InstructionDetailsString:"<br/> Click the - Help - menu button ",
	 targetID:"Help_Menu_link",
	 expandDetails:true});

help_indicator.show();


var PageHelpTour= new PageTour("PageHelp");

//(ID,InstructionString,InstructionDetailsString,targetID,arrowImagePosition,arrowImageURL,posX,posY,arrowImageRotationAngle)
PageHelpTour.addInstruction({ID:"templatemo_login_section_help",
									 InstructionString:"Login to acess more features",
									 InstructionDetailsString:"<br/> Registered users can see & browse through more range of properties<br/> Also you get frequent updates about hot deals & Discounts",
									 targetID:"templatemo_login_section"});

PageHelpTour.addInstruction({ID:"Rent_Menu_link_help",
	 InstructionString:"Properties on available for rent",
	 InstructionDetailsString:"<br/> See all the properties available for rent<br/>",
	 targetID:"Rent_Menu_link"});

PageHelpTour.addInstruction({ID:"Mortgage_Menu_link_help",
	 InstructionString:"Mortgage description",
	 InstructionDetailsString:"<br/> See all the properties available for rent",
	 targetID:"Mortgage_Menu_link"});

PageHelpTour.addInstruction({ID:"About_Menu_link_help",
	 InstructionString:"About this Website",
	 InstructionDetailsString:"<br/> What we do and what we are......",
	 targetID:"About_Menu_link"});

PageHelpTour.addInstruction({ID:"Contact_Menu_link_help",
	 InstructionString:"Contact information",
	 InstructionDetailsString:"<br/> Detail contact information available on this link..",
	 targetID:"Contact_Menu_link"});

PageHelpTour.addInstruction({ID:"templatemo_section_1_1_help",
	 InstructionString:"Search for a Property as per your Criteria",
	 InstructionDetailsString:"<br/> Here you can find a property based on you preferences, Fill in the boxes as per your preference and click [Submit]",
	 targetID:"templatemo_section_1_1",
	 arrowImagePosition:"E",
	 expandDetails:true});

PageHelpTour.addInstruction({ID:"templatemo_content_panel_2_help",
	 InstructionString:"Here you find some Featured Properties..",
	 InstructionDetailsString:"<br/> Here you can find some Featured properties that are most popular in your area..",
	 targetID:"templatemo_content_panel_2",
	 arrowImagePosition:"E",
	 expandDetails:true});
	 