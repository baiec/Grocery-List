//i only do $(document).on(blah) for dynamically created items
//if the element is there when the page is loaded, no need for what is above

var pubnub = PUBNUB.init({
	publish_key: 'pub-c-c2a05254-fb11-4396-9c28-0e1c258d0b98',
	subscribe_key: 'sub-c-c0eb9a8a-3373-11e5-bd95-0619f8945a4f'
});

$(document).ready(function(){
	console.log("document loaded");
	settingsDiv.hide();
	console.log("settingsDiv hidden");
});
//assining ids to variables
//divs
var commonDiv = $("#common");
var toBuyDiv = $("#buy");
var settingsDiv = $("#settings");
//buttons
var input = $("#uInput");
var submit = $("#submit");
var undo = $("#undo");
var Delete = $("#delete");
var help = $("#help");
var settings = $("#settingsBut");
var togNoise = $("#noise");
//colors
var comBlue = $("#comBlue");
var comRed = $("#comRed");
var comGreen = $("#comGreen");

var buyBlue = $("#buyBlue");
var buyRed = $("#buyRed");
var buyGreen = $("#buyGreen");
//sounds
var happyBoing = document.getElementById("happyBoing");
var sadBoing = document.getElementById("sadBoing");
//lists
var common = $("#submittedItems");
var toBuy = $("#itemsToBuy");
//undo array
var undoArray = [];
//toggle modes
var delMode = false;
var helpMode = false;
var stateOfHelp = $("#stateOfHelp");
var sound = true;
var stateOfSound = $("#stateOfSound");

console.log("variables assigned");
//functions for handling changes
function handleCommonChange(change){
	//common.replaceWith(change.list);
	alert(change.list);
}

function handleBuyChange(change){
	toBuy.replaceWith(change.list);
}
//submitting items is on the pubnub file
input.keydown(function(key){
	if(key.which == 13){
		console.log("enter key pressed on input box");
		submit.click();
		console.log("ran submit.click()");
	}
});

submit.click(function(){
	if(input.val() != ''){
		common.prepend("<li class='commonItem'>"+input.val()+"</li>");
		input.val("");
		console.log("prepended input and cleared it");
		pubnub.publish({
			channel: 'common',
			message: {
				list: 'hi'
			}
		});
		console.log("list published on channel common");
	}
});

//clicking common item (dynam)
$(document).on('click','.commonItem',function(){
	console.log("common item clicked");
	if(!delMode){
		var item = $(this).clone();
		item.removeClass("commonItem").addClass("itemToBuy").prependTo(itemsToBuy);
		console.log("item cloned and changed class");
		if(sound){
			happyBoing.play();
		}
	}
	else {
		$(this).remove();
		if(sound){
			sadBoing.play();
		}
		console.log("item removed");
	}
});

//clicking item to buy (dynam)
$(document).on('click','.itemToBuy',function(){
	console.log("to buy item was clicked");

	undoArray.push(this);
	this.remove();
	if(sound){
		sadBoing.play();
	}
	console.log("added to undo array and removed");
});

//clicking undo button
undo.click(function(){
	console.log("undo button clicked");

	var index = undoArray.length - 1;
	toBuy.prepend(undoArray[index]);
	undoArray.splice(index,1);
	console.log("put recently deleted item back on to buy list and took it away from array");
});

//toggling delete mode button
Delete.click(function(){
	console.log("delete button clicked");
	if(!delMode){
		delMode = true;
		console.log("delete mode on");
	}
	else {
		delMode = false;
		console.log("delete mode off");
	}
});

//help mode button
help.click(function(){
	console.log("help button clicked");
	if(!helpMode){
		helpMode = true;
		console.log("help mode on");
		stateOfHelp.html("Help Mode is on.");
	}
	else {
		helpMode = false;
		console.log("help mode off");
		stateOfHelp.html("Help Mode is off.");
	}
});

//sound button
togNoise.click(function(){
	console.log("noise button clicked");
	if(!sound){
		sound = true;
		console.log("sound is on");
		stateOfSound.html("Sound is on.");
	}
	else {
		sound = false;
		console.log("sound is off");
		stateOfSound.html("Sound is off.");
	}
});

//settings button
settings.click(function(){
	console.log("settings button clicked");
	settingsDiv.toggle(800);
	console.log("settings div toggled");
});

//changing background color in settings

//comblue
comBlue.click(function(){
	console.log("common blue button clicked");
	commonDiv.animate({
		backgroundColor: "blue"
	},200);
});
//comred
comRed.click(function(){
	console.log("common red button clicked");
	commonDiv.animate({
		backgroundColor: "red"
	},200);
});
//comgreen
comGreen.click(function(){
	console.log("common green button clicked");
	commonDiv.animate({
		backgroundColor: "green"
	},200);
});
//buyblue
//it doesnt work for some reason
buyBlue.click(function(){
	console.log("buy blue button clicked");
	toBuyDiv.animate({
		backgroundColor: "blue"
	},200);
});
//buyred
buyRed.click(function(){
	console.log("buy red button clicked");
	toBuyDiv.animate({
		backgroundColor: "red"
	},200);
});
//buygreen
buyGreen.click(function(){
	console.log("buy green button clicked");
	toBuyDiv.animate({
		backgroundColor: "green"
	},200);
});

pubnub.subscribe({
	channel: 'common',
	message: handleCommonChange
});
