/*
	TimeKeeper - A Steampunk Calendar
	Copyright © 2012 Dean Beedell and Harry Whitfield

	This program is free software; you can redistribute it and/or modify it
	under the terms of the GNU General Public License as published by the
	Free Software Foundation; either version 2 of the License, or (at your
	option) any later version.

	This program is distributed in the hope that it will be useful, but
	WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
	General Public License for more details.

	You should have received a copy of the GNU General Public License along
	with this program; if not, write to the Free Software Foundation, Inc.,
	51 Franklin St, Fifth Floor, Boston, MA	 02110-1301	 USA

	TimeKeeper - version 5.2.2
	26 April, 2014

	Concept and graphics by Dean Beedell
	dean.beedell@lightquick.co.uk

	Code by Harry Whitfield
	g6auc@arrl.net

	Animation and Sound Code by Dean Beedell
	dean.beedell@lightquick.co.uk

*/

/*global main_window, year: true, month: true, day: true, gISOdate: true, theISODate,
	sharedUpdateTimerFired, speakMemoToggle: true, updateMemoFolder, accessMode: true,
	addModes, logMemoFolder, makeMemoLock, updateMemoPrefs, systemPlatform, makeSelectHotKey,
	selectMonth, makeSpeechHotKey, speakMemo, makeSearchHotKey, findMemo, setContextMenu,
	SPEAK, saveAnchorPoint, deleteSelectHotKey, deleteSpeechHotKey, deleteSearchHotKey,
	deleteSearchHotKey, oldSelectHotKeyPref: true, oldSpeechHotKeyPref: true,
	oldSearchHotKeyPref: true, oldMemoScalePref: true, memo_window, showMemoButtons,
	hideMemoButtons, lastYear, daysInMonth, setPrefs, updateDate,
	anchorX: true, anchorY: true, anchorWindow, onClicked, openMemoWindow, getMemoLines,
	buildCalendarVitality, bf, lFlag: true, eFlag: true, sFlag: true, lprint, eprint, sprint,
	myPrint, logFilePref: true, logFlagPref: true, createLicense, updateSunPrefs,
	earthTimer, entry_window, popUpPlaque, plaqueButton
 */

/*properties
    Hoffset, PI, Voffset, accessModePref, allowAutoOpenPref, alphaLockKey,
    anchorXPref, anchorYPref, animatePref, appendChild, atan2, autoModePref,
    autoOpenPref, availHeight, availLeft, availTop, availWidth, bgColor,
    bgOpacity, changeMode, checkMoonWidgetPref, cogAnimatePref, color, cos,
    dayPref, dockDate, eFlagPref, earthSizePref, earthTurnPref, event, floor,
    font, getDate, getDay, getFullYear, getHours, getMinutes, getMonth,
    getSeconds, getTime, getYear, glassOpacityPref, hAlign, hOffset,
    hRegistrationPoint, height, hidden, hoffset, interval, itemExists, kEaseIn,
    kEaseInOut, kEaseOut, lFlagPref, level, locked, logFilePref, logFlagPref,
    memoScalePref, monthPref, onClick, onDockOpened, onGainFocus, onLoseFocus,
    onMouseDown, onMouseDrag, onMouseEnter, onMouseExit, onMouseUp, onMouseWheel,
    onPreferencesChanged, onTimerFired, onUnload, onWakeFromSleep,
    onWillChangePreferences, onload, opacity, pinHoffsetPref, pinVoffsetPref,
    reset, rotation, round, sFlagPref, scalePref, scrollDelta, searchHotKeyPref,
    selectHotKeyPref, setDate, setMonth, setYear, sharedDirectoryPref,
    sharedMemoFolderPref, sharedModePref, sharedUpdateTimerPref, sin, size,
    sizebar, soundPref, speechHotKeyPref, src, srcHeight, srcWidth, start, style,
    text, tickPref, ticking, toLowerCase, tooltip, tooltipPref,
    userWidgetsFolder, vOffset, vRegistrationPoint, value, visible, voffset,
    widgetLockPref, width, yearPref, zOrder, zorder
*/

//log("preferences.scalePref.value	" + preferences.scalePref.value);

//this will be removed later - just for testing purposes

if (preferences.scalePref.value <= 30) {
	preferences.scalePref.value = 30;
}

//==============================
// general vars
//==============================
var scale	 = Number(preferences.scalePref.value) / 100,
	oldScale = scale;
var shrunkFlg = 0;
var animationSpeed = 1700;
var AutomateTimerCnt = 1;
var base = "Resources/Orrery/";
var moonWidgetFound = false; // for the Moon Phase III widget
var underWidgetFound = false; // for the under widget
var globe_frame = null;
var cogrotation = 0;
var modulo_cnt = 0;
var driveBandClicks = 0;
var moonRotationValue = 0;
var earthRotationValue = 0;
var accelVal = 0;
var moonAngle = 0;
var savEarthAngle = 0;
var earthAngle = 0;

var useMouseWheel = 0;
var globeStartHoffset = 0;
var globeEndHoffset = 0;


//==============================
// vars for the rotating earth
//==============================
var earthFrame = 1;
var earthBaseName;

//==============================
// vars to save earth and moon positions
//==============================
var earthHoffset = 0;
var earthVoffset = 0;
var earthzorder = 0;
var moonHoffset = 0;
var moonVoffset = 0;
var moonzorder = 34;
var savEarthHoffset;
var savEarthVoffset;
var savMoonHoffset;
var savMoonVoffset;

//==============================
// declare the sounds
//==============================
var buzzer = "Resources/sounds/buzzer.mp3";
var zzzz = "Resources/sounds/zzzz.mp3";
var zzzzQuiet = "Resources/sounds/zzzz-quiet.mp3";
var crank = "Resources/sounds/crank.mp3";
var tingingSound = "Resources/sounds/ting.mp3";
var steam = "Resources/sounds/steamsound.mp3";
var suck = "Resources/sounds/suck.mp3";
var newClunk = "Resources/sounds/newclunk.mp3";
var electricDrone = "Resources/sounds/electricDrone.mp3";
var winding = "Resources/sounds/winding.mp3";
var mechanism = "Resources/sounds/mechanism.mp3";
var ticktock = "Resources/sounds/ticktock-quiet.mp3";
var tick = "Resources/sounds/tick.mp3";
var till = "Resources/sounds/till.mp3";
var tock = "Resources/sounds/tock.mp3";
var lock = "Resources/sounds/lock.mp3";
var nothing = "Resources/sounds/nothing.mp3";

//==============================
// resizing variables
//==============================
var sizeLevel = null;
var origGlobeWidth = 330;
var origGlobeHeight = 330;
var origGlobeHoffset = 125;
var origGlobeVoffset = 130;

var origRingWidth = 330;
var origRingHeight = 330;
var origRingHoffset = 143;
var origRingVoffset = 145;

var origGlowWidth = 330;
var origGlowHeight = 330;
var origGlowHoffset = 125;
var origGlowVoffset = 130;

var origGlobeTopWidth = 21;
var origGlobeTopHeight = 28;
var origGlobeTopHoffset = 273;
var origGlobeTopVoffset = 128;

var origSupportingBarWidth = 164;
var origSupportingBarHeight = 312;
var origSupportingBarHoffset = 130;
var origSupportingBarVoffset = 132;

var origToggle1Width = 16;
var origToggle1Height = 16;
var origToggle1Hoffset = 249;
var origToggle1Voffset = 133;

var origToggle2Width = 16;
var origToggle2Height = 16;
var origToggle2Hoffset = 194;
var origToggle2Voffset = 154;

var origToggle3Width = 16;
var origToggle3Height = 16;
var origToggle3Hoffset = 149;
var origToggle3Voffset = 199;

var origToggle4Width = 16;
var origToggle4Height = 16;
var origToggle4Hoffset = 126;
var origToggle4Voffset = 271;

var origToggle5Width = 16;
var origToggle5Height = 16;
var origToggle5Hoffset = 130;
var origToggle5Voffset = 325;

var origToggle6Width = 16;
var origToggle6Height = 16;
var origToggle6Hoffset = 154;
var origToggle6Voffset = 374;

var origToggle7Width = 16;
var origToggle7Height = 16;
var origToggle7Hoffset = 186;
var origToggle7Voffset = 407;

var origToggleSWidth = 16;
var origToggleSHeight = 16;
var origToggleSHoffset = 266;
var origToggleSVoffset = 424;

var origToggleFWidth = 16;
var origToggleFHeight = 16;
var origToggleFHoffset = 314;
var origToggleFVoffset = 424;

/*var origFrameWidth =	100;
var origFrameHeight =  100;
var origFrameHoffset = 1;
var origFrameVoffset = 1;
*/

var GlobeHoffset = 125;
var GlobeVoffset = 130;

//==============================
// vars to determine the position of the components
//==============================
var cogsPos = 0;
var clockPos = 0;
var timekeeperPos = 0;

//==============================
// vars to determine the visibility of the expanded planets
//==============================
var largeEarthVisible = false;
var lunarWidgetVisible = false;
var allowRingClick = false;

var preferred_form = null;
var under_preferred_form = null;
var numberOfDaysToAdd = 0;
var numberOfMonthsToAdd = 0;
var numberOfYearsToAdd = 0;

var downAngle,
	downDate;
var currDat = null;

//////////////////////////////////////////////////////////////////////////////////////////

include("Resources/Scripts/logToFile.js");

/*
var lFlag = true;	// log important progress and error messages
var eFlag = true;	// log other progress and error messages
var sFlag = true;	// log scripts

function lprint(theString) { if (lFlag) { log(theString);	 } }
function eprint(theString) { if (eFlag) { print(theString); } }
function sprint(theString) { if (sFlag) { print(theString); } }

function myPrint(theStr) { print(theStr); }
*/

//=================================
// create the images to scale
//=================================
function newImage(parent, hOffset, vOffset, width, height, src, zOrder, opacity, hRegP, vRegP) {
	var o = new Image();

	o.src = src;

	if (!width) {
		width = o.srcWidth;
	} // width is an optional parameter
	if (!height) {
		height = o.srcHeight;
	} // height is an optional parameter

	o.width	 = Math.round(scale * width);
	o.height = Math.round(scale * height);

	if (zOrder) {
		o.zOrder = zOrder;
	} // zOrder is an optional parameter
	o.opacity = opacity || 255; // opacity is an optional parameter, if zero defaults to 255...

	hRegP				 = hRegP || 0; // hRegP and vRegP are optional parameters, if not specified defaults to zero
	vRegP				 = vRegP || 0;

	hOffset				 += hRegP;
	vOffset				 += vRegP;

	o.hOffset			 = Math.round(scale * hOffset);
	o.vOffset			 = Math.round(scale * vOffset);

	o.hRegistrationPoint = Math.round(scale * hRegP);
	o.vRegistrationPoint = Math.round(scale * vRegP);

	parent.appendChild(o);
	return o;
}
//=================================
//
//=================================
function newText(parent, hOffset, vOffset, width, height, hAlign, font, style, size, color, opacity, bgColor, bgOpacity, zOrder) {
	var o = new Text();
	o.hOffset = Math.round(scale * hOffset);
	o.vOffset = Math.round(scale * vOffset);
	o.width = Math.round(scale * width);
	o.height = Math.round(scale * height);
	o.hAlign = hAlign;
	o.font = font;
	o.style = style;
	o.size = Math.round(scale * size);
	o.color = color;
	o.opacity = opacity;
	o.bgColor = bgColor;
	o.bgOpacity = bgOpacity;
	o.zOrder = zOrder;
	parent.appendChild(o);
	return o;
}




var innerFrames,
	underlyingGlass,
	underlay,
	rotatingring,
	layer35,
	ringtext,
	woodSurround,
	counterWheel,
	cogShadow,
	cog,
	monthCogShadow,
	monthCog,
	wheelShadow,
	wheel,
	driveBand,
	dayOfWeek,
	clock,
	hourHand,
	minuteHand,
	secondHand,
	centreBoss,
	clockReflection,
	dayAndYearCounters,
	dayTensCounter,
	dayUnitsCounter,
	monthCounter,
	yearTensCounter,
	yearUnitsCounter,
	timekeeper,
	moonUnderShadow,
	moon,
	moonOverShadow,
	earthUnderShadow,
	earth,
	earthOverShadow,
	shrinker,
	innerFramesclickpointleft,
	innerFramesclickpointright,
	innerFramesclickpointtop,
	clockclickpointleft,
	clockclickpointcentre,
	clockclickpointright,
	timekeeperclickpointleft,
	timekeeperclickpointright,
	timekeeperclickpointbottom,
	timekeeperclickpointfarright,
	rotatingpointwidth,
	opacitySlider,
	sizeSlider,
	driveBandclickpoint,
	dayCounter,
	yearCounter,
	soundtoggle,
	glass,
	about,
	widgetHelp,
	ring,
	globe,
	glow,
	globetop,
	supportingBar,
	toggle1,
	toggle2,
	toggle3,
	toggle4,
	toggle5,
	toggle6,
	toggle7,
	toggleS,
	toggleF,
	pin,
	sizeText;

(function () {
	main_window.width			 = Math.round(scale * 658); //608
	main_window.height			 = Math.round(scale * 598);
	rotatingpointwidth			 = Math.round(scale * 528);
//	newImage(parent, hOffset, vOffset, width, height, src, zOrder, opacity, hRegP, vRegP)
	shrinker				= newImage(main_window, 51, 51, 475, 475, base + "shrinker.png", 0, 255, 230, 230);
	underlay				= newImage(main_window, 51, 51, 475, 475, base + "underlay.png", 0, 255);
	underlyingGlass				= newImage(main_window, 143, 143, 294, 294, base + "underlyingGlass.png", 1, 200);
	innerFrames				= newImage(main_window, 100, 100, 385, 385, base + "innerFrames.png", 2, 255);
	opacitySlider				= newImage(main_window, 100, 100, 385, 385, base + "opacitySlider.png", 2, 255, 192, 192);
	sizeSlider				= newImage(main_window, 100, 100, 385, 385, base + "sizeSlider.png", 2, 255, 192, 192);
	rotatingring				= newImage(main_window, 50, 50, 478, 478, base + "rotatingring.png", 1, 255, 239, 239);
	ringtext				= newImage(main_window, 64, 62, 448, 448, base + "ringtext.png", 3, 255, 224, 226);

	woodSurround				 = newImage(main_window, 50, 50, 478, 498, base + "woodSurround.png", 4);
	counterWheel				 = newImage(main_window, 119, 121, 341, 341, base + "counterWheel.png", 5, 255, 171, 171);
	cogShadow				 = newImage(main_window, 103, 243, 103, 103, base + "cogShadow.png", 6, 255, 52, 52);
	cog					= newImage(main_window, 101, 219, 98, 99, base + "cog.png", 7, 255, 49, 50);
	monthCogShadow				 = newImage(main_window, 353, 249, 108, 108, base + "monthCogShadow.png", 8, 255, 54, 54);
	monthCog				= newImage(main_window, 355, 241, 98, 99, base + "monthCog.png", 9, 255, 49, 50);
	wheelShadow				= newImage(main_window, 57, 250, 95, 95, base + "wheelShadow.png", 10, 217, 47, 47);
	wheel					= newImage(main_window, 60, 248, 88, 88, base + "wheel.png", 10, 255, 44, 44);
	driveBand				= newImage(main_window, 82, 249, 73, 73, base + "driveBand.png", 11);
	driveBandclickpoint			 = newImage(main_window, 95, 281, 20, 20, base + "blank.png", 11);
	dayOfWeek				= newImage(main_window, 131, 209, 64, 37, base + "sunday.png", 12);
	clock					= newImage(main_window, 76, 114, 182, 182, base + "clock.png", 13);
	clockclickpointleft			 = newImage(main_window, 133, 195, 20, 20, base + "blank.png", 34);
	clockclickpointcentre	 	         = newImage(main_window, 153, 190, 20, 20, base + "blank.png", 34);
	clockclickpointright		         = newImage(main_window, 173, 195, 20, 20, base + "blank.png", 34);
	hourHand				= newImage(main_window, 152, 149, 27, 55, base + "hourHand.png", 14, 255, 13, 52);
	minuteHand				= newImage(main_window, 155, 133, 20, 71, base + "minuteHand.png", 15, 255, 10, 68);
	secondHand				= newImage(main_window, 162, 145, 4, 21, base + "secondHand.png", 16, 255, 2, 21);
	centreBoss				= newImage(main_window, 153, 188, 25, 26, base + "centreBoss.png", 17);
	clockReflection				 = newImage(main_window, 103, 135, 122, 74, base + "clockReflection.png", 18, 89);
	dayCounter			         = newImage(main_window, 427, 239, 43, 42, base + "dayCounter.png", 19, 255);
	yearCounter				= newImage(main_window, 427, 299, 43, 42, base + "yearCounter.png", 19, 255);
	dayTensCounter				 = newImage(main_window, 432, 253, 15, 16, base + "0.png", 20, 214);
	dayUnitsCounter				 = newImage(main_window, 447, 253, 15, 16, base + "4.png", 20, 214);
	monthCounter				 = newImage(main_window, 359, 280, 89, 21, base + "march.png", 20);
	yearTensCounter				 = newImage(main_window, 432, 315, 15, 16, base + "1.png", 20, 214);
	yearUnitsCounter			 = newImage(main_window, 447, 315, 15, 16, base + "2.png", 20, 214);
	timekeeperclickpointbottom	         = newImage(main_window, 465, 310, 53, 50, base + "blank.png", 21);
	soundtoggle				= newImage(main_window, 525, 284, 25, 16, base + "soundToggle.png", 21);
	timekeeper				= newImage(main_window, 335, 236, 216, 134, base + "timekeeper.png", 21);
	glass					= newImage(main_window, 471, 273, 43, 43, base + "glass.png", 21, 1);
	timekeeperclickpointleft	        = newImage(main_window, 330, 283, 20, 20, base + "blank.png", 21);
	timekeeperclickpointright	        = newImage(main_window, 510, 266, 20, 20, base + "blank.png", 21);
	timekeeperclickpointfarright            = newImage(main_window, 535, 281, 20, 20, base + "blank.png", 21);
	innerFramesclickpointleft	        = newImage(main_window, 184, 432, 20, 20, base + "blank.png", 3);
	innerFramesclickpointright	        = newImage(main_window, 378, 430, 20, 20, base + "blank.png", 3);
	innerFramesclickpointtop	        = newImage(main_window, 378, 128, 20, 20, base + "blank.png", 3);
	moonUnderShadow				 = newImage(main_window, 338, 325, 45, 46, base + "moonUnderShadow.png", 22, 179, 22, 22);
	moon					= newImage(main_window, 339, 321, 33, 33, base + "moon.png", 23, 255, 16, 16);
	moonOverShadow				 = newImage(main_window, 339, 321, 52, 46, base + "moonOverShadow.png", 24, 255, 26, 18);
	earthUnderShadow			 = newImage(main_window, 276, 328, 82, 83, base + "earthUnderShadow.png", 25, 224, 41, 41);
	earth					= newImage(main_window, 269, 321, 68, 69, base + "earth.png", 26, 255, 34, 34);
	earthOverShadow				 = newImage(main_window, 277, 321, 84, 68, base + "earthOverShadow.png", 27, 179, 42, 18);
	about					 = newImage(main_window, 20, 50, 570, 499, base + "About.png", 50, 1);
	widgetHelp				 = newImage(main_window, 30, -8, 600, 600, base + "widgetHelp.png", 51, 1);
	pin					= newImage(main_window, 1, 1, 37, 37, base + "pin.png", 101, 1);

								//newText(parent, hOffset, vOffset, width, height, hAlign, font, style, size, color, opacity, bgColor, bgOpacity, zOrder) {
	sizeText					 = newText(main_window,	 350, 400, 50, 20, "left", "TIMES", "-kon-shadow:black 5px", 18, "#FFCC00", 0, "#000000", 0, 101);
	// it ignores this next line
	sizeText.style = "text-align:center; -kon-shadow:black 2px";

	pin.opacity					 = 0;
	about.opacity				 = 0;
	widgetHelp.opacity			 = 0;

//================================
//enlarged earth images & controls
//================================
	ring = newImage(main_window, 143, 145, 300, 300, base + "ring.png", 25, 1);
	globe						 = newImage(main_window, 125, 130, 330, 330, base + "globe/Earth-spinning_1.png", 25, 1);
	glow						 = newImage(main_window, 125, 130, 330, 330, base + "glow.png", 25, 1);
	globetop					 = newImage(main_window, 273, 128, 21, 28, base + "globetop.png", 25, 1);
	supportingBar				         = newImage(main_window, 130, 132, 164, 312, base + "supportingBar.png", 25, 1);
	toggle1						 = newImage(main_window, 249, 133, 16, 15, base + "toggle1.png", 25, 1);
	toggle2						 = newImage(main_window, 194, 154, 16, 16, base + "toggle2.png", 25, 1);
	toggle3						 = newImage(main_window, 149, 199, 16, 16, base + "toggle3.png", 25, 1);
	toggle4						 = newImage(main_window, 126, 271, 16, 16, base + "toggle4.png", 25, 1);
	toggle5						 = newImage(main_window, 130, 325, 16, 16, base + "toggle5.png", 25, 1);
	toggle6						 = newImage(main_window, 154, 374, 16, 16, base + "toggle6.png", 25, 1);
	toggle7						 = newImage(main_window, 186, 407, 16, 16, base + "toggle7.png", 25, 1);
	toggleS						 = newImage(main_window, 260, 425, 16, 16, base + "toggleS.png", 25, 1);
	toggleF						 = newImage(main_window, 314, 424, 16, 16, base + "toggleF.png", 25, 1);

//======================================
//newImage function will not create objects
//with zero opacity,so the enlarged earth is made completely invisible here
//======================================
	globe.opacity = 0;
	ring.opacity				 = 0;
	globetop.opacity			 = 0;
	supportingBar.opacity		 = 0;
	toggle1.opacity				 = 0;
	toggle2.opacity				 = 0;
	toggle3.opacity				 = 0;
	toggle4.opacity				 = 0;
	toggle5.opacity				 = 0;
	toggle6.opacity				 = 0;
	toggle7.opacity				 = 0;
	toggleS.opacity				 = 0;
	toggleF.opacity				 = 0;
	shrinker.opacity			 = 0;

//==============================
// resizing variables for the enlarged earth
// required as it must be dynamically resized
//==============================
//origWoodSurroundHoffset= woodSurround.hOffset;
//origWoodSurroundWidth= woodSurround.width;
	origGlobeWidth = globe.width;
	origGlobeHeight				 = globe.height;
	origGlobeHoffset			 = globe.hOffset;
	origGlobeVoffset			 = globe.vOffset;

	origRingWidth				 = ring.width;
	origRingHeight				 = ring.height;
	origRingHoffset				 = ring.hOffset;
	origRingVoffset				 = ring.vOffset;

	origGlowWidth				 = glow.width;
	origGlowHeight				 = glow.height;
	origGlowHoffset				 = glow.hOffset;
	origGlowVoffset				 = glow.vOffset;

	origGlobeTopWidth			 = globetop.width;
	origGlobeTopHeight			 = globetop.height;
	origGlobeTopHoffset			 = globetop.hOffset;
	origGlobeTopVoffset			 = globetop.vOffset;

	origSupportingBarWidth		 = supportingBar.width;
	origSupportingBarHeight		 = supportingBar.height;
	origSupportingBarHoffset	 = supportingBar.hOffset;
	origSupportingBarVoffset	 = supportingBar.vOffset;

	origToggle1Width			 = toggle1.width;
	origToggle1Height			 = toggle1.height;
	origToggle1Hoffset			 = toggle1.hOffset;
	origToggle1Voffset			 = toggle1.vOffset;

	origToggle2Width			 = toggle2.width;
	origToggle2Height			 = toggle2.height;
	origToggle2Hoffset			 = toggle2.hOffset;
	origToggle2Voffset			 = toggle2.vOffset;

	origToggle3Width			 = toggle3.width;
	origToggle3Height			 = toggle3.height;
	origToggle3Hoffset			 = toggle3.hOffset;
	origToggle3Voffset			 = toggle3.vOffset;

	origToggle4Width			 = toggle4.width;
	origToggle4Height			 = toggle4.height;
	origToggle4Hoffset			 = toggle4.hOffset;
	origToggle4Voffset			 = toggle4.vOffset;

	origToggle5Width			 = toggle5.width;
	origToggle5Height			 = toggle5.height;
	origToggle5Hoffset			 = toggle5.hOffset;
	origToggle5Voffset			 = toggle5.vOffset;

	origToggle6Width			 = toggle6.width;
	origToggle6Height			 = toggle6.height;
	origToggle6Hoffset			 = toggle6.hOffset;
	origToggle6Voffset			 = toggle6.vOffset;

	origToggle7Width			 = toggle7.width;
	origToggle7Height			 = toggle7.height;
	origToggle7Hoffset			 = toggle7.hOffset;
	origToggle7Hoffset			 = toggle7.vOffset;

	origToggleSWidth			 = toggleS.width;
	origToggleSHeight			 = toggleS.height;
	origToggleSHoffset			 = toggleS.hOffset;
	origToggleSVoffset			 = toggleS.vOffset;

	origToggleFWidth			 = toggleF.width;
	origToggleFHeight			 = toggleF.height;
	origToggleFHoffset			 = toggleF.hOffset;
	origToggleFVoffset			 = toggleF.vOffset;
}());

//var dayOfWeek = newText(main_window,	95, 182, 40, 14, "left", "ENGRAVERS", "normal", 12, "#000000", 255, "#FFFFFF", 0, 30);
//var theDay	= newText(main_window, 384, 213, 28, 22, "left", "ENGRAVERS", "normal", 22, "#000000", 255, "#FFFFFF", 0, 30);
//var theMonth	= newText(main_window, 326, 242, 60, 20, "left", "ENGRAVERS", "normal", 16, "#000000", 255, "#FFFFFF", 0, 30);
//var theYear	= newText(main_window, 384, 275, 28, 22, "left", "ENGRAVERS", "normal", 22, "#000000", 255, "#FFFFFF", 0, 30);

//////////////////////////////////////////////////////////////////////////////////////////

function dayAngle(currDat) {
	var year  = currDat.getFullYear(),	// 20yy
		month = currDat.getMonth(),		// 0..11
		day	  = currDat.getDate(),		// 1..31

		daysInMonth = function (month, year) { // month 0..11
			var monthDays = [
					31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
				];

			if (month !== 1) {
				return monthDays[month];
			}
			if ((year % 4) !== 0) {
				return 28;
			}
			if ((year % 400) === 0) {
				return 29;
			}
			if ((year % 100) === 0) {
				return 28;
			}
			return 29;
		};

	return 360 * (year - 2012) + 30 * month + Math.round(30 * day / daysInMonth(month, year));
}

//=================================
//
//=================================
function weekDayOf(currDat) {
	var dow = [
			"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
		];

	return dow[currDat.getDay()];
}

//=================================
//
//=================================
function dayOf(currDat) {
	return currDat.getDate();
}

//=================================
//
//=================================
function monthOf(currDat) {
	var months = [
			"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
		];

	return months[currDat.getMonth()];
}

//=================================
//
//=================================
function theYearOf(currDat) {
	return currDat.getFullYear() % 100;
}

//////////////////////////////////////////////////////////////////////////////////////////

var date,
	newDate,
	angle0;
var cos = [],
	sin = [];

//=================================
//
//=================================
(function makeTrigTables() {
	var i;

	for (i = 0; i < 360; i += 1) {
		cos[i] = Math.cos(Math.PI * i / 180);
		sin[i] = Math.sin(Math.PI * i / 180);
	}
}());

//=================================
//
//=================================
function updateVitality(currDat) {
	var colorize  = "#307968",
		textColor = "#FFFFFF";

	if (preferences.dockDate.value === "0") {
		currDat = new Date();
	} else {
		colorize  = "#ff9008";
		textColor = "#000000";
		if (currDat === undefined) {
			currDat = new Date(year, month - 1, day);
		}
	}
	buildCalendarVitality(currDat, colorize, textColor);
}

function moveMoon(moonAngle) {
		var lunarMonth = 29.53058917, // days
			sunX	   = rotatingpointwidth / 2,
			sunY	   = main_window.height / 2 - 10 * scale, // sun is off-centre
			bearing,
		        moonRadius	= 55 * scale;

		moonAngle			= ((Math.round(moonAngle * 365.2425 / lunarMonth + moonAngle - 15) % 360) + 360) % 360;

		moon.hOffset			= Math.round(earth.hOffset + moonRadius * cos[moonAngle]);
		moon.vOffset			= Math.round(earth.vOffset - moonRadius * sin[moonAngle]);

		moonUnderShadow.hOffset = moon.hOffset;
		moonUnderShadow.vOffset = moon.vOffset;
		moonOverShadow.hOffset	= moon.hOffset;
		moonOverShadow.vOffset	= moon.vOffset;

		bearing					= 180 * Math.atan2(moon.vOffset - sunY, moon.hOffset - sunX) / Math.PI;
		moonOverShadow.rotation = (Math.round(bearing - 90) + 720) % 360;
}

	//=================================
	//
	//=================================
	function moveEarth(earthAngle) {
		earthAngle		= (earthAngle + 220) % 360;
		earthRadius     = 55 * scale;
		if (earthRotateStyle == 0) {
                  earth.hOffset	= Math.round(rotatingpointwidth / 2 + earthRadius * cos[earthAngle]);
		  earth.vOffset	= Math.round(main_window.height / 2 - earthRadius * sin[earthAngle]);
	        } else {
                  earth.hOffset	= Math.round(moon.hOffset + earthRadius * cos[earthAngle]);
	          earth.vOffset	= Math.round(moon.vOffset - earthRadius * sin[earthAngle]);
                }
		earthUnderShadow.hOffset = earth.hOffset;
		earthUnderShadow.vOffset = earth.vOffset;
		earthOverShadow.hOffset	 = earth.hOffset;
		earthOverShadow.vOffset	 = earth.vOffset;

		earthOverShadow.rotation = (720 - earthAngle - 90) % 360;
	}
	//=================================
	//
	//=================================



//=================================
//
//=================================
function displayDate(currDat, angle0) {

		var angleMod360     = (moonAngle % 360 + 360) % 360,
		earthAngle	= (angleMod360 + 240) % 360,
//		angleMod30	= earthAngle % 30,
		dow		= weekDayOf(currDat).toLowerCase(),
		year99,
		sMonth,
		autoOpenPref,
		head;
                moonAngle		= dayAngle(currDat);

	year = currDat.getFullYear();
	log("year" + year);
	month						= currDat.getMonth() + 1;
	day							= currDat.getDate();

	preferences.yearPref.value	= String(year);
	preferences.monthPref.value = String(month);
	preferences.dayPref.value	= String(day);

	year99						= year % 100;
	sMonth						= monthOf(currDat).toLowerCase();

	//rotatingring.rotation		  = -angleMod30;
	ringtext.rotation			= -earthAngle;
	counterWheel.rotation		= earthAngle - 51;

	monthCogShadow.rotation		= monthCog.rotation = earthAngle;

	cogShadow.rotation			= cog.rotation = earthAngle;

	wheelShadow.rotation		= wheel.rotation = angle0 - earthAngle;

	dayOfWeek.src				= base + dow + ".png";
	dayTensCounter.src			= base + String(Math.floor(day / 10)) + ".png";
	dayUnitsCounter.src			= base + String(day % 10) + ".png";
	monthCounter.src			= base + sMonth + ".png";
	yearTensCounter.src			= base + String(Math.floor(year99 / 10)) + ".png";
	yearUnitsCounter.src		= base + String(year99 % 10) + ".png";

	updateVitality(currDat);

	gISOdate	 = theISODate(currDat);

	autoOpenPref = preferences.autoOpenPref.value;
	switch (autoOpenPref) {
	case "Always":
		if (!memo_window.visible) {
			openMemoWindow(gISOdate, "");
		}
		break;
	case "Only when it has content":
		head = getMemoLines(gISOdate, 1, 20);
		if ((head !== "") && (!memo_window.visible)) {
			openMemoWindow(gISOdate, "");
		}
		break;
	case "Never":
		break;
	}
        earthRotateStyle = 0;
	moveEarth(earthAngle);
	moveMoon(moonAngle);
	log ("1 moonAngle "+moonAngle);
}



//=================================
//
//=================================
function cal(year, month, day) {
	var currDat = new Date(year, month - 1, day);

	displayDate(currDat, angle0);
	date = currDat;
}

//=====================
//rotate the cog and shadow
//=====================
function rotatingRingMovement() {
	var a;
	
	cogrotation = cogrotation + 32;
	a = new RotateAnimation(monthCog, cogrotation, 990, animator.kEaseOut);
	animator.start(a);

	a = new RotateAnimation(monthCogShadow, cogrotation, 990, animator.kEaseOut);
	animator.start(a);

	// the counterWheel rotates opposite to the date ring rotation
	if (currDat <= date) {
		a = new RotateAnimation(counterWheel, -cogrotation / 2, 990, animator.kEaseOut);
	} else {
		a = new RotateAnimation(counterWheel, cogrotation / 2, 990, animator.kEaseOut);
	}
	animator.start(a);
}
//=====================
//End function
//=====================

//=================================
// Make the large globe controls invisible
//=================================
function controlsInvisible() {
	glow.opacity			 = 0;
	glow.visible			 = false;
	globetop.opacity		 = 0;
	globetop.visible		 = false;
	supportingBar.opacity	 = 0;
	supportingBar.visible	 = false;
	toggle1.opacity			 = 0;
	toggle1.visible			 = false;
	toggle2.opacity			 = 0;
	toggle2.visible			 = false;
	toggle3.opacity			 = 0;
	toggle3.visible			 = false;
	toggle4.opacity			 = 0;
	toggle4.visible			 = false;
	toggle5.opacity			 = 0;
	toggle5.visible			 = false;
	toggle6.opacity			 = 0;
	toggle6.visible			 = false;
	toggle7.opacity			 = 0;
	toggle7.visible			 = false;
	toggleS.opacity			 = 0;
	toggleS.visible			 = false;
	toggleF.opacity			 = 0;
	toggleF.visible			 = false;

	//if (earth.opacity != 255) {
	earth.opacity = 255;
	earthOverShadow.opacity	 = 170;
	earthUnderShadow.opacity = 255;
	log("%TIMEK-I-EARTO, earth.opacity " + earth.opacity);
	//}
}

//===========================
//when the expanded globe is double-clicked a click on the ring ought to restore the moon and shadows to normal positions.
//===========================
function largeEarthInvisible() {
	var a, b, c, d, f, g, h;

	largeEarthVisible = false;
	if (preferences.soundPref.value === "enable") {
		play(steam, false);
	}
	controlsInvisible();
	//stops the earth spinning
	earthTimer.ticking = false;
	//make the earth visible prior to rotating it back into position
	a = new FadeAnimation(earth, 255, 100, animator.kEaseOut);
	b = new FadeAnimation(earthOverShadow, 179, 100, animator.kEaseOut);
	c = new FadeAnimation(earthUnderShadow, 224, 100, animator.kEaseOut, controlsInvisible);
	d = new RotateAnimation(earth, 180, 1350, animator.kEaseOut);
	f = new MoveAnimation(earth, savEarthHoffset, savEarthVoffset, 1350, animator.kEaseIn);
	g = new MoveAnimation(earthOverShadow, savEarthHoffset, savEarthVoffset, 1350, animator.kEaseIn);
	h = new MoveAnimation(earthUnderShadow, savEarthHoffset, savEarthVoffset, 1350, animator.kEaseIn, controlsInvisible);
	animator.start([
		a, b, c, d, f, g, h
	]);
	a = new FadeAnimation(globe, 0, 1350, animator.kEaseOut);
	b = new FadeAnimation(ring, 0, 1350, animator.kEaseOut);
	animator.start([
		a, b
	]);
}

//=====================
//put the moon shadow back
//=====================
function moonShadowVisible() {
	moonUnderShadow.visible = true;
	moonOverShadow.visible	= true;
	// make the earth visible again, sometimes the animation does not complete and the earth does not become visible
	if (moon.opacity !== 255) {
		moon.opacity = 255;
	}
}
//=====================
//End function
//=====================

//===========================
//Show the small moon
//===========================
function showSmallMoon() {
	//when the expanded globe is double-clicked a click on the ring ought to restore the moon and shadows to normal positions.
	var a = new MoveAnimation(moon, savMoonHoffset, savMoonVoffset, 3500, animator.kEaseIn, moonShadowVisible),
		b = new MoveAnimation(moonUnderShadow, savMoonHoffset, savMoonVoffset, 3500, animator.kEaseIn),
		c = new MoveAnimation(moonOverShadow, savMoonHoffset, savMoonVoffset, 3500, animator.kEaseIn),
		d = new RotateAnimation(moon, 360, 3500, animator.kEaseIn);

	animator.start([
		a, b, c, d
	]);
}

//===========================
//Show the big moon
//===========================
function showBigMoon() {
	var hmod, vmod, newhoffset, newvoffset;

	//var newhoffset = (main_window.hoffset + (42*scale));
	//var newvoffset = (main_window.voffset + (45*scale));

	//286 is the orrey mid-point	when 100%
	//57 is the moon hoffset from its own main_window when full sized
	hmod = 286 * scale;
	vmod = 286 * scale;
	//find the start of the orrery and add the orrery mid-point
	newhoffset = main_window.hoffset + hmod;
	newvoffset = main_window.voffset + vmod;

	/*
	log("scale " +scale);
	log("hmod " +hmod);
	log("vmod " +vmod);
	log("newhoffset " +newhoffset);
	log("newvoffset " +newvoffset);
	log("main_window " +main_window.hoffset);
	*/
	lunarWidgetVisible = true;
	if (preferences.soundPref.value === "enable") {
		play(electricDrone, false);
	}
	if (largeEarthVisible) {
		largeEarthInvisible();
	}
	if (moonWidgetFound) {
		log("%TIMEK-I-SETD, Moon Phase III", "setPref:hoffset=" + newhoffset);
		tellWidget(preferred_form, "setPref:hoffset=" + newhoffset);
		tellWidget(preferred_form, "setPref:voffset=" + newvoffset);
		tellWidget(preferred_form, "setPref:visible=true");
		tellWidget(preferred_form, "setPref:locked=true");
		tellWidget(preferred_form, "setDate:date=" + downDate);
	}
	if (underWidgetFound) {
		log("%TIMEK-I-SETD, Under widget", "setPref:hoffset=" + newhoffset);
		tellWidget(under_preferred_form, "setPref:hoffset=" + newhoffset);
		tellWidget(under_preferred_form, "setPref:voffset=" + newvoffset);
		tellWidget(under_preferred_form, "setPref:locked=true");
		tellWidget(under_preferred_form, "setDate:date=" + downDate);
                underlyingGlass.opacity = 120;
	}
	//log("%TIMEK-I-SETD, Moon Phase III", "setDate:date="+downDate);
	// when the expanded globe is double-clicked a click on the ring ought to restore the moon and shadows to normal positions.
	// for the mo' it is done here in script.js but it should be done by the moon widget
	// telling the timekeeper it is done. Need to include tellwidget code here in order to be
	// able to receive commands.
	showSmallMoon();
}

//===========================
//when the small moon is clicked it will animate the globe growing and then trigger the globe rotating
//===========================
function animateMoonEnlarging() {
	var a, b, c, d;

	if (preferences.soundPref.value === "enable") {
		play(steam, false);
	}
	a = new RotateAnimation(moon, 720, 2350, animator.kEaseIn); //rotate the moon
	b = new MoveAnimation(moon, (288 * scale), (284 * scale), 2350, animator.kEaseIn, showBigMoon);
	c = new MoveAnimation(moonOverShadow, (288 * scale), (284 * scale), 2350, animator.kEaseIn);
	d = new MoveAnimation(moonUnderShadow, (288 * scale), (284 * scale), 2350, animator.kEaseIn);
	animator.start([
		a, b, c, d
	]);
}

//===========================================
// this function rotates the moon  around the earth when the mini-moon is clicked upon
//===========================================
function rotateMoon(moonAngle) {
	moonRotationValue = moonRotationValue + 1;
	accelVal = accelVal  + moonRotationValue;

        moonAngle = moonAngle + (accelVal) % 360;
        moveMoon(moonAngle);
        log ("3 moonAngle "+moonAngle);

	if (moonRotationValue >= 30) {
		theRotateTimer.ticking = false;
		moonRotationValue = 0;
		animateMoonEnlarging();
	}
}
//=====================
//End function
//=====================

//===========================================
// this function rotates the earth around the moon when the mini-earth is clicked upon
//===========================================
function rotateEarth(earthAngle) {
	earthRotationValue = earthRotationValue + 1;
	accelVal = accelVal + 1 + earthRotationValue;

	earthAngle = earthAngle + (accelVal) % 360;
        earthRotateStyle = 1;
        moveEarth(earthAngle);

	log("earthAngle " + earthAngle);
	if (earthRotationValue >= 40) {
		theEarthRotateTimer.ticking = false;
		earthRotationValue = 0;
		animateEarthEnlarging();
	}
}
//=====================
//End function
//=====================

//=================================
//
//=================================
function displayTime(currDat) {
	var hours = currDat.getHours() % 12,
		mins  = currDat.getMinutes(),
		secs  = currDat.getSeconds();

	hourHand.rotation	= Math.floor(30 * hours + mins / 2);
	minuteHand.rotation = Math.floor(6 * mins + secs / 10);
	secondHand.rotation = 6 * secs;

	if (useMouseWheel > 10) {
		useMouseWheel = 0;
		rotatingRingMovement();
	}
}


//=================================
// Make the large globe controls visible
//=================================
function controlsVisible() {
	if (preferences.soundPref.value === "enable") {
		play(tingingSound, false);
	}

	globetop.opacity	  = 255;
	globetop.visible	  = true;
	supportingBar.opacity = 255;
	supportingBar.visible = true;
	toggle1.opacity		  = 255;
	toggle1.visible		  = true;
	toggle2.opacity		  = 255;
	toggle2.visible		  = true;
	toggle3.opacity		  = 255;
	toggle3.visible		  = true;
	toggle4.opacity		  = 255;
	toggle4.visible		  = true;
	toggle5.opacity		  = 255;
	toggle5.visible		  = true;
	toggle6.opacity		  = 255;
	toggle6.visible		  = true;
	toggle7.opacity		  = 255;
	toggle7.visible		  = true;
	toggleS.opacity		  = 255;
	toggleS.visible		  = true;
	toggleF.opacity		  = 255;
	toggleF.visible		  = true;

	allowRingClick		  = true;
}

//=====================
// when the large earth is loaded the small earth is faded and the globe timer activated
//=====================
function onLargeEarthLoad() {
	var a, b, c, d, e;

	allowRingClick = false;
	a = new FadeAnimation(earth, 0, 2350, animator.kEaseOut);
	b = new FadeAnimation(earthUnderShadow, 0, 2350, animator.kEaseOut);
	c = new FadeAnimation(earthOverShadow, 0, 2350, animator.kEaseOut);
	d = new FadeAnimation(globe, 255, 1350, animator.kEaseOut);
	e = new FadeAnimation(ring, 255, 1350, animator.kEaseOut, controlsVisible);
	largeEarthVisible = true;
	animator.start([
		a, b, c, d, e
	]);
	glow.opacity  = 255; // this is done because when the object is created iti set o minimum opacity
	glow.visible  = true;
	earthBaseName = base + "globe/Earth-spinning_";
	if (preferences.earthTurnPref.value === "Fast") {
		earthTimer.interval = 0.1;
	} else if (preferences.earthTurnPref.value === "Slow") {
		earthTimer.interval = 0.3;
	}
	globe.src = earthBaseName + earthFrame + ".png";
	if (preferences.soundPref.value === "enable") {
		play(till, false);
	}

	earthTimer.ticking = true;
}
//=====================
//End function
//=====================

//===========================
// tell the moon widget to close
//===========================
function closeLunarWidget() {
	if (lunarWidgetVisible) {
		if (moonWidgetFound === true) {
			tellWidget(preferred_form, "setPref:visible=false");
		}
	}
}

//===========================
//when the small earth is clicked it will animate the globe growing and then trigger the globe rotating
//===========================
function animateEarthEnlarging() {
	var a, c, d, e,
		glowHoffset,
		glowVoffset;

	// here will go the rotation animation prior to actually moving
	// start a timer
	// it calls the routine for doing the earth rotation
	// timer modifies the value for rotation

	allowRingClick	= false;

	if (preferences.soundPref.value === "enable") {
		play(steam, false);
	}
	a = new RotateAnimation(earth, 720, 2350, animator.kEaseIn);
	//230,250 is the location of the glow, the earth moves to the glow
	glowHoffset = 230;
	glowVoffset = 250;
	if (preferences.earthSizePref.value === "0.5") {
		glowHoffset = 255;
		glowVoffset = 275;
	}
	if (preferences.earthSizePref.value === "0.6") {
		glowHoffset = 250;
		glowVoffset = 270;
	}
	if (preferences.earthSizePref.value === "0.7") {
		glowHoffset = 245;
		glowVoffset = 265;
	}
	if (preferences.earthSizePref.value === "0.8") {
		glowHoffset = 240;
		glowVoffset = 260;
	}
	if (preferences.earthSizePref.value === "0.9") {
		glowHoffset = 235;
		glowVoffset = 255;
	}
	if (preferences.earthSizePref.value === "1.0") {
		glowHoffset = 230;
		glowVoffset = 250;
	}

	c = new MoveAnimation(earth, (glowHoffset * scale), (glowVoffset * scale), 2350, animator.kEaseIn, onLargeEarthLoad);
	d = new MoveAnimation(earthUnderShadow, (glowHoffset * scale), (glowVoffset * scale), 2350, animator.kEaseIn);
	// move the earth over-shadow, then tell the moon widget to close
	// it does this just in case the moon is open and running (you can click on both planets)
	e = new MoveAnimation(earthOverShadow, (glowHoffset * scale), (glowVoffset * scale), 2350, animator.kEaseIn, closeLunarWidget);
	animator.start([
		a, c, d, e
	]);
}

var theRotateTimer = new Timer();
theRotateTimer.ticking = false;
theRotateTimer.interval = 0.01;

theRotateTimer.onTimerFired = function () {
	rotateMoon(moonAngle);
		log ("2 moonAngle "+moonAngle);
};

var theEarthRotateTimer = new Timer();
theEarthRotateTimer.ticking = false;
theEarthRotateTimer.interval = 0.01;

theEarthRotateTimer.onTimerFired = function () {
	rotateEarth(false);
};

var theTimer = new Timer();
theTimer.ticking = false;
theTimer.interval = 5;

theTimer.onTimerFired = function () {
	updateDate(false);
};

var timer = new Timer();
timer.ticking = false;
timer.interval = 1;

timer.onTimerFired = function () {
	displayTime(new Date());
};

//=================================
// timer to determine cog rotation
//=================================
var cogtimer = new Timer();
cogtimer.ticking = false;
cogtimer.interval = 1;

cogtimer.onTimerFired = function () {
	var a;
	// rotate the components using a simple modification of the rotate property
	if (preferences.cogAnimatePref.value === "disable") {
		cog.rotation = cog.rotation - 4;
		cogShadow.rotation = cogShadow.rotation - 4;
		wheel.rotation = wheel.rotation - 16;
		wheelShadow.rotation = wheelShadow.rotation - 16;
		counterWheel.rotation = counterWheel.rotation - 16;
	} else {
	// rotate the components using the rotation animation - more cpu
		cogrotation = cogrotation + 32;
		a			= new RotateAnimation(cog, cogrotation, 990, animator.kEaseOut);
		animator.start(a);

		a = new RotateAnimation(cogShadow, cogrotation, 990, animator.kEaseOut);
		animator.start(a);

		a = new RotateAnimation(wheel, -cogrotation, 990, animator.kEaseOut);
		animator.start(a);

		a = new RotateAnimation(wheelShadow, -cogrotation, 990, animator.kEaseOut);
		animator.start(a);

		a = new RotateAnimation(counterWheel, -cogrotation / 2, 990, animator.kEaseOut);
		animator.start(a);

		modulo_cnt = modulo_cnt + 1;
		if (modulo_cnt <= 10) {
			return;
		}
		modulo_cnt = 0;

		a		   = new RotateAnimation(monthCog, -cogrotation / 2, 990, animator.kEaseOut);
		animator.start(a);

		a = new RotateAnimation(monthCogShadow, -cogrotation / 2, 990, animator.kEaseOut);
		animator.start(a);
	}
};

//=================================
// timer to determine tic/tocking
//=================================
var tickTimer = new Timer();
tickTimer.ticking = false;
tickTimer.interval = 1;

//===========================================
// function to play tick sound
//===========================================
function tickandtock() {
	if (preferences.tickPref.value === "enable") {
		tickTimer.interval = 30;
		log("%TIMEK-I-PLAT, playing ticktock");
		play(ticktock, false);
	}
}
//=====================
//End function
//=====================

tickTimer.onTimerFired = function () {
	tickandtock();
};

//=================================
// timer to automate the movement of the cogs on startup - in & out
//=================================
var theAutomateTimer = new Timer();
theAutomateTimer.ticking = true;
theAutomateTimer.interval = 2;

theAutomateTimer.onTimerFired = function () {
	if (preferences.animatePref.value === "enable") {
		timekeeperclickpointleft.onClick();
	}
	if (AutomateTimerCnt === 2) {
		theAutomateTimer.ticking = false;
	} else {
		AutomateTimerCnt = AutomateTimerCnt + 1;
	}
};

//==============================
//the default condition of the mask is a 1% opaque seemingly blank PNG
//==============================
function highlightRedGone() {
	innerFramesclickpointleft.src	 = "Resources/Orrery/blank.png";
	innerFramesclickpointright.src	 = "Resources/Orrery/blank.png";
	innerFramesclickpointtop.src	 = "Resources/Orrery/blank.png";
	clockclickpointleft.src			 = "Resources/Orrery/blank.png";
	clockclickpointcentre.src		 = "Resources/Orrery/blank.png";
	clockclickpointright.src		 = "Resources/Orrery/blank.png";
	timekeeperclickpointleft.src	 = "Resources/Orrery/blank.png";
	timekeeperclickpointright.src	 = "Resources/Orrery/blank.png";
	timekeeperclickpointfarright.src = "Resources/Orrery/blank.png";
	timekeeperclickpointbottom.src	 = "Resources/Orrery/blank.png";
	driveBandclickpoint.src			 = "Resources/Orrery/blank.png";
}

//=================================
// timer to fade the highlighted click points in & out
//=================================
var theFadeTimer = new Timer();
theFadeTimer.ticking = false;
theFadeTimer.interval = 8;

theFadeTimer.onTimerFired = function () {
	highlightRedGone();
	theFadeTimer.ticking = false;
};

//=================================
//
//=================================
var sharedUpdateTimer = new Timer();
sharedUpdateTimer.ticking = false;
sharedUpdateTimer.interval = 900;

sharedUpdateTimer.onTimerFired = function () {
	sharedUpdateTimerFired();
};

//=================================
//
//=================================
var speechTimer = new Timer();
speechTimer.ticking = false;
speechTimer.interval = 5;

speechTimer.onTimerFired = function () {
	speechTimer.ticking = false;
	speakMemoToggle		= false;
};

var memoFolderPath = null;
var multiUser = false;
var disallowAutoOpenPref = true;
var specialMode = false;

//=================================================
// function to check whether the moon widget exists
//=================================================
function checkMoonWidget() {
	var expandedForm, widgetForm, answer;

	if (preferences.checkMoonWidgetPref.value === "enable") {
		log("%TIMEK-I-CHKM, Checking the moon widget is installed.");
		log("%TIMEK-I-CHKM, system.userWidgetsFolder - " + system.userWidgetsFolder);
		//expanded form
		expandedForm = system.userWidgetsFolder + "/Moon_Phase_III/Contents/moon_phase_iii.kon";
		// temporary development version of the widget
		expandedForm = "D:/DEAN/steampunk theme/Moon_Phase_III/Contents/moon_phase_iii.kon";

		//widget form
		widgetForm = system.userWidgetsFolder + "/Moon_Phase_III.widget";

		// use the expanded form in preference to the .widget form
		if (filesystem.itemExists(expandedForm)) {
			log("%TIMEK-I-CHKM, Checking expanded form of the Moon widget - " + filesystem.itemExists(expandedForm));
			preferred_form = expandedForm;
		} else if (filesystem.itemExists(widgetForm)) {
			log("%TIMEK-I-CHKM, Checking widget form of the Moon widget - " + filesystem.itemExists(widgetForm));
			preferred_form = widgetForm;
		}

		if (filesystem.itemExists(expandedForm) || filesystem.itemExists(widgetForm)) {
			log("%TIMEK-I-CHKM, Moon widget III is installed." + preferred_form);
			moonWidgetFound = true;
			play(tingingSound, false);
		} else {
			moonWidgetFound = false;
			log("%TIMEK-I-CHKM, Moon widget III is NOT installed.");
			answer = alert("The Moon Phase III widget was not found - it is part of the essential function of this widget, please download it and install it and run it, click on Open Browser Window to go to the download location for the moon phase widget.", "Open Browser Window", "No Thanks");
			if (answer === 1) {
				openURL("http://lightquick.co.uk/moon-phase-III-widget.html?Itemid=264");
				if (preferences.soundPref.value === "enable") {
					play(winding, false);
				}
			}
		}
	}
}
//=====================
//End function
//=====================

//=================================================
// function to check whether the moon widget exists
//=================================================
function checkUnderWidget() {
	var expandedForm, widgetForm, answer;

	if (preferences.checkMoonWidgetPref.value === "enable") {
		log("%TIMEK-I-CHKM, Checking the under widget is installed.");
		log("%TIMEK-I-CHKM, system.userWidgetsFolder - " + system.userWidgetsFolder);
		//expanded form
		expandedForm = system.userWidgetsFolder + "/underwidget/Contents/underwidget.kon";
		// temporary development version of the widget
		expandedForm = "D:/DEAN/steampunk theme/underwidget/Contents/underwidget.kon";

		//widget form
		widgetForm = system.userWidgetsFolder + "/underwidget.widget";

		// use the expanded form in preference to the .widget form
		if (filesystem.itemExists(expandedForm)) {
			log("%TIMEK-I-CHKM, Checking expanded form of the under widget - " + filesystem.itemExists(expandedForm));
			under_preferred_form = expandedForm;
		} else if (filesystem.itemExists(widgetForm)) {
			log("%TIMEK-I-CHKM, Checking widget form of the under widget - " + filesystem.itemExists(widgetForm));
			under_preferred_form = widgetForm;
		}

		if (filesystem.itemExists(expandedForm) || filesystem.itemExists(widgetForm)) {
			log("%TIMEK-I-CHKM, under widget is installed." + under_preferred_form);
			underWidgetFound = true;
			play(tingingSound, false);
		} else {
			underWidgetFound = false;
			log("%TIMEK-I-CHKM, under widget is NOT installed.");
			if (preferences.underWidgetPref.value == "0") {
                            answer = alert("The under widget was not found - it is an optional part of this widget that provides the cogs and working gubbins, please download it, install it and run it. Click on Open Browser Window to open the download location for the under widget.", "Open Browser Window", "No Thanks","Don't ever ask me again");
    			    if (answer === 1) {
    				openURL("http://lightquick.co.uk/underwidget.html?Itemid=264");
    				if (preferences.soundPref.value === "enable") {
    					play(winding, false);
    				}
    			    }
      			    if (answer === 3) {
      				if (preferences.soundPref.value === "enable") {
      					play(tingingSound, false);
      				}
      				preferences.underWidgetPref.value = "1";
      			    }
                        }
		}
	}
}
//=====================
//End function
//=====================
//=====================
// set the tooltips of the click points
//=====================
function setClickPointToolTips() {
	if (preferences.tooltipPref.value === "enable") {
		innerFramesclickpointleft.tooltip	 = bf("bringsUpTheAboutBox");
		innerFramesclickpointright.tooltip	 = bf("resizeThisWidget");
		innerFramesclickpointtop.tooltip	 = bf("openHelpPageForThisWidget");
		clockclickpointleft.tooltip			 = bf("MovesTheClockAndCogs");
		clockclickpointcentre.tooltip		 = bf("HideTheClockByClickingHere");
		clockclickpointright.tooltip		 = bf("HidesTheOrreryAndWheelCluster");
		timekeeperclickpointleft.tooltip	 = bf("MovesAllTheWindingGear");
		timekeeperclickpointright.tooltip	 = bf("ThisScrewCausesTheCalendarToReset");
		timekeeperclickpointfarright.tooltip = bf("ThisTogglesTheSound");
		timekeeperclickpointbottom.tooltip	 = bf("ThisShowsThePreferences");
		driveBand.tooltip					 = bf("ClickHereToCauseWheelsAndCogsToMove");
		driveBandclickpoint.tooltip			 = bf("ClickHereToCauseWheelsAndCogsToMove");
		ring.tooltip						 = bf("ClickOnTheOuterRingToMoveOrDrag");	//Click on the outer ring to move or drag the widget to a new location
		globe.tooltip						 = bf("SingleClickToStopMeSpinning");		//Single click to stop me spinning.
		clockReflection.tooltip					= bf("ClickHereToShowHelp");		//Single click to stop me spinning.
		globetop.tooltip	  = bf("BringBackResizingBar");
		glass.tooltip		  = bf("ClickToOpenMemo"); //Single click to stop me spinning.
		toggle1.tooltip		  = bf("ClickButtonReduceGlobe");
		toggle2.tooltip		  = bf("ClickButtonReduceGlobe");
		toggle3.tooltip		  = bf("ClickButtonReduceGlobe");
		toggle4.tooltip		  = bf("ClickButtonReduceGlobe");
		toggle5.tooltip		  = bf("ClickButtonReduceGlobe");
		toggle6.tooltip		  = bf("ClickButtonReduceGlobe");
		toggle7.tooltip		  = bf("ClickButtonReduceGlobe");

		toggleF.tooltip		  = bf("ClickButtonSpeedRotation");
		toggleS.tooltip		  = bf("ClickButtonSlowRotation");

		opacitySlider.tooltip = bf("ThisSliderControlsTheOpacity");
		sizeSlider.tooltip	  = bf("ThisSliderControlsTheSize");
		pin.tooltip	   = bf("thisPinUnlocksTheWidget");
                popUpPlaque.tooltip     = bf("clickHereToMakeMeGoAway");
                plaqueButton.tooltip    = bf("clickHereToOpenHelp");
	} else {
		innerFramesclickpointleft.tooltip	 = "";
		innerFramesclickpointright.tooltip	 = "";
		innerFramesclickpointtop.tooltip	 = "";
		clockclickpointleft.tooltip			 = "";
		clockclickpointcentre.tooltip		 = "";
		clockclickpointright.tooltip		 = "";
		timekeeperclickpointleft.tooltip	 = "";
		timekeeperclickpointright.tooltip	 = "";
		timekeeperclickpointfarright.tooltip = "";
		timekeeperclickpointbottom.tooltip	 = "";
		driveBand.tooltip					 = "";
		driveBandclickpoint.tooltip			 = "";
		ring.tooltip						 = "";
		globe.tooltip						 = "";
		clockReflection.tooltip					= "";
		globetop.tooltip	  = "";
		glass.tooltip		  = "";
		toggle1.tooltip		  = "";
		toggle2.tooltip		  = "";
		toggle3.tooltip		  = "";
		toggle4.tooltip		  = "";
		toggle5.tooltip		  = "";
		toggle6.tooltip		  = "";
		toggle7.tooltip		  = "";

		toggleF.tooltip		  = "";
		toggleS.tooltip		  = "";

		opacitySlider.tooltip = "";
		sizeSlider.tooltip	  = "";
		pin.tooltip	   = "";
                popUpPlaque.tooltip     = "";
                plaqueButton.tooltip    = "";
   	}
}
//=====================
//End function
//=====================

// Function to move the main_window onto the main screen in the viewable area
function mainScreen() {
	if (main_window.hOffset < 0) {
		main_window.hOffset = 10;
	}
	if (main_window.vOffset < 32) {
		main_window.vOffset = 32; // avoid Mac toolbar
	}
	if (main_window.hOffset > screen.width - 50) {
		main_window.hOffset = screen.width - main_window.width;
	}
	if (main_window.vOffset > screen.height - 50) {
		main_window.vOffset = screen.height - main_window.height; // avoid Mac dock
	}
}

//=====================
//function to set the initial state of the size slider
//=====================
function setSizeSlider() {
	sizeSlider.rotation = ((preferences.scalePref.value / 4.54) - 1) - 14;
	log("preferences.scalePref.value " + preferences.scalePref.value);
	sizeText.text = preferences.scalePref.value + "%";
}
//=====================
//End function
//=====================

//=====================
//function to set the initial state of the opacity slider
//=====================
function setOpacitySlider() {
	var opacityLevel = opacitySlider.rotation + 9; //normalise the opacity level
	
	underlyingGlass.opacity = opacityLevel * 12;
	opacitySlider.rotation = (preferences.glassOpacityPref.value / 12) - 9;
}
//=====================
//End function
//=====================

//===========================================
// set the tooltips for all hover points
//===========================================
function setTooltips() {
	if (preferences.tooltipPref.value === "enable") {
		rotatingring.tooltip = bf("dragTheRing");
		monthCounter.tooltip = bf("monthScroll");
		moon.tooltip		 = bf("moonClick");
		earth.tooltip		 = bf("earthClick");
		yearCounter.tooltip  = bf("yearScroll");
		dayCounter.tooltip   = bf("dayScroll");
		if (!main_window.locked) {
			underlyingGlass.tooltip = bf("draggingTooltip");
		} else {
			underlyingGlass.tooltip = bf("deanAndHarryTooltip");
		}
	} else {
	  	rotatingring.tooltip = "";
	  	monthCounter.tooltip = "";
	  	moon.tooltip		 = "";
	  	earth.tooltip		 = "";
	  	yearCounter.tooltip  = "";
	  	dayCounter.tooltip   = "";
	  	underlyingGlass.tooltip = "";
	  	sizeSlider.tooltip   = "";
	  	innerFrames.tooltip  = "";
	}
}
//=====================
//End function
//=====================


//==============================
// load the widget
//==============================
widget.onload = function () {
	var specialMode,
		currDat;

	// play sounds on startup
	if (preferences.soundPref.value === "enable") {
		play(electricDrone, false);
	}

	//farright
	if (preferences.soundPref.value === "enable") {
		print("dummy");
		//soundtoggle.hoffset = soundtoggle.hoffset + (10*scale)
		//timekeeperclickpointfarright.hoffset = timekeeperclickpointfarright.hoffset + (10*scale)
	} else {
		soundtoggle.hoffset = soundtoggle.hoffset - (10 * scale);
		timekeeperclickpointfarright.hoffset = timekeeperclickpointfarright.hoffset - (10 * scale);
	}
	log("preferences.widgetLockPref.value " + preferences.widgetLockPref.value);

	if (preferences.widgetLockPref.value === "1") {
		log("here");
                //log("preferences.widgetLockPref.value " + preferences.widgetLockPref.value);
		main_window.locked = true;
		pin.opacity = 255;
		pin.hoffset = preferences.pinHoffsetPref.value;
		pin.Voffset = preferences.pinVoffsetPref.value;
	}

    checkUnderWidget();
    checkMoonWidget();
	multiUser = (preferences.sharedMemoFolderPref.value === "1") && (preferences.sharedDirectoryPref.value !== "");
	include("Resources/Scripts/SPEAK.js");
	include("Resources/Scripts/utils.js");
	include("Resources/Scripts/sunService.js");
	include("Resources/Scripts/service.js");
	include("Resources/Scripts/cardOrdinals.js");
	include("Resources/Scripts/memo_window.js");
	if (multiUser) {
		include("Resources/Scripts/sharedMemos.js");
	} else {
		include("Resources/Scripts/memos.js");
	}
	include("Resources/Scripts/preferences.js");
	include("Resources/Scripts/MCmain.js");
	include("Resources/Scripts/main.js");
	include("Resources/Scripts/prefs.js");
	include("Resources/Scripts/vitality.js");

	include("Resources/License/License.js");

	memoFolderPath		 = updateMemoFolder();
	accessMode			 = preferences.accessModePref.value;
	disallowAutoOpenPref = (preferences.allowAutoOpenPref.value === "0");

	if (multiUser) {
		if (disallowAutoOpenPref) {
			preferences.autoOpenPref.value = "Never";
		}
		sharedUpdateTimer.interval = 60 * Number(preferences.sharedUpdateTimerPref.value);
		sharedUpdateTimer.ticking  = true;
		accessMode				   = preferences.sharedModePref.value;
	} else {
		sharedUpdateTimer.ticking = false;
	}

	eprint('onLoad:changeMode:memoFolderPath: ' + filesystem.changeMode(memoFolderPath, addModes(accessMode, "0111")));

	logMemoFolder();

	if (multiUser) {
		makeMemoLock(accessMode);
	}

	updateMemoPrefs();
	updateSunPrefs();

	preferences.accessModePref.hidden = preferences.sharedModePref.hidden = (systemPlatform !== "macintosh");

	specialMode						  = filesystem.itemExists(memoFolderPath + "/noHotKeys.txt") || system.event.alphaLockKey;

	if (!specialMode) {
		makeSelectHotKey(preferences.selectHotKeyPref.value, selectMonth);
		makeSpeechHotKey(preferences.speechHotKeyPref.value, speakMemo);
		makeSearchHotKey(preferences.searchHotKeyPref.value, findMemo);
	}

	setPrefs();

	//setmenu();
	setContextMenu();

	anchorX = Number(preferences.anchorXPref.value);
	anchorY = Number(preferences.anchorYPref.value);

	anchorWindow(memo_window.width, memo_window.height);

	currDat = new Date();
	log("*************************** currDat " + currDat);
	angle0 = dayAngle(currDat) - 120;

	if (preferences.autoModePref.value === "1") {
		updateDate(false);
	} else {
		year  = parseInt(preferences.yearPref.value, 10);
		month = Number(preferences.monthPref.value);
		day	  = parseInt(preferences.dayPref.value, 10);
		if ((1900 <= year) && (year <= lastYear) && (0 < day) && (day <= daysInMonth(year, month))) {
			cal(year, month, day);
		} else {
			displayDate(currDat, angle0);
			date = currDat;
		}
	}

	setSizeSlider();
	setOpacitySlider();

	underlyingGlass.opacity = preferences.glassOpacityPref.value;

	// if the moon widget is found set the widget to sit below the others
	if (moonWidgetFound) {
		main_window.level = "below";
		tellWidget(preferred_form, "setPref:visible=false");
		tellWidget(preferred_form, "setPref:level=\"normal\"");
	}

	// if the moon widget is found set the widget to sit below the others
	if (underWidgetFound) {
		main_window.level = "below";
		tellWidget(under_preferred_form, "setPref:visible=false");
		tellWidget(under_preferred_form, "setPref:level=\"normal\"");
	}
	displayTime(currDat);
	timer.ticking = true;
	mainScreen();
	createLicense(main_window);
	// set the tooltips for all hover points
	setTooltips();
	// set the tooltips for all click points on the rings and timekeeper itself
	setClickPointToolTips();
};

//==============================
// Widget unload function
//==============================
widget.onUnload = function () {
	SPEAK.reset();

	preferences.anchorXPref.value = String(memo_window.hOffset);
	preferences.anchorYPref.value = String(memo_window.vOffset);

	saveAnchorPoint(); // for memo window

	deleteSelectHotKey();
	deleteSpeechHotKey();
	deleteSearchHotKey();
};

//==============================
//
//==============================
widget.onWillChangePreferences = function () {
	oldSelectHotKeyPref = preferences.selectHotKeyPref.value;
	oldSpeechHotKeyPref = preferences.speechHotKeyPref.value;
	oldSearchHotKeyPref = preferences.searchHotKeyPref.value;
	oldMemoScalePref	= preferences.memoScalePref.value;
};

//==============================
//	Re-position the components that comprise the large earth globe
//==============================
function repositionEarthGlobe() {
	var hModifier = null,
		vModifier = null;

	//var centreHorizPoint = (woodSurround.hoffset + woodSurround.width /2);
	//var centreVertPoint = (woodSurround.voffset + woodSurround.height /2);

	//globe.hoffset = (centreHorizPoint - (globe.width/2));
	//globe.voffset = (centreVertPoint - (globe.height/2));

	// I could have done the resizng mathematically but all attempts failed
	// due to inconsistencies in the maths I was using, the components are
	// now placed manually using modifiers.

	//0.6
	if (preferences.earthSizePref.value === "0.5") {
		hModifier = 145 * scale; //87;
		vModifier = 143 * scale; // 86;
	}
	if (preferences.earthSizePref.value === "0.6") {
		hModifier = 115 * scale; //69;
		vModifier = 112 * scale; //67;
	}
	if (preferences.earthSizePref.value === "0.7") {
		hModifier = 85 * scale; //51;
		vModifier = 83 * scale; //50;
	}
	if (preferences.earthSizePref.value === "0.8") {
		hModifier = 58 * scale; //35;
		vModifier = 55 * scale; //33;
	}
	if (preferences.earthSizePref.value === "0.9") {
		hModifier = 28 * scale; //17;
		vModifier = 25 * scale; //15;
	}
	if (preferences.earthSizePref.value === "1.0") {
		hModifier = 0;
		vModifier = 0;
	}
	//log("hModifier "+hModifier);
	vModifier			  = 5 * scale + vModifier;

	globe.hoffset		  = origGlobeHoffset * preferences.earthSizePref.value + hModifier;
	globe.voffset		  = origGlobeVoffset * preferences.earthSizePref.value + vModifier;

	ring.hoffset		  = origRingHoffset * preferences.earthSizePref.value + hModifier;
	ring.voffset		  = origRingVoffset * preferences.earthSizePref.value + vModifier;

	glow.hoffset		  = origGlowHoffset * preferences.earthSizePref.value + hModifier;
	glow.voffset		  = origGlowVoffset * preferences.earthSizePref.value + vModifier;

	globetop.hoffset	  = origGlobeTopHoffset * preferences.earthSizePref.value + hModifier;
	globetop.voffset	  = origGlobeTopVoffset * preferences.earthSizePref.value + vModifier;

	supportingBar.hoffset = origSupportingBarHoffset * preferences.earthSizePref.value + hModifier;
	supportingBar.voffset = origSupportingBarVoffset * preferences.earthSizePref.value + vModifier;
	toggle1.hoffset		  = origToggle1Hoffset * preferences.earthSizePref.value + hModifier;
	toggle1.voffset		  = origToggle1Voffset * preferences.earthSizePref.value + vModifier;
	toggle2.hoffset		  = origToggle2Hoffset * preferences.earthSizePref.value + hModifier;
	toggle2.voffset		  = origToggle2Voffset * preferences.earthSizePref.value + vModifier;
	toggle3.hoffset		  = origToggle3Hoffset * preferences.earthSizePref.value + hModifier;
	toggle3.voffset		  = origToggle3Voffset * preferences.earthSizePref.value + vModifier;
	toggle4.hoffset		  = origToggle4Hoffset * preferences.earthSizePref.value + hModifier;
	toggle4.voffset		  = origToggle4Voffset * preferences.earthSizePref.value + vModifier;
	toggle5.hoffset		  = origToggle5Hoffset * preferences.earthSizePref.value + hModifier;
	toggle5.voffset		  = origToggle5Voffset * preferences.earthSizePref.value + vModifier;
	toggle6.hoffset		  = origToggle6Hoffset * preferences.earthSizePref.value + hModifier;
	toggle6.voffset		  = origToggle6Voffset * preferences.earthSizePref.value + vModifier;
	toggle7.hoffset		  = origToggle7Hoffset * preferences.earthSizePref.value + hModifier;
	toggle7.voffset		  = origToggle7Voffset * preferences.earthSizePref.value + vModifier;
	toggleS.hoffset		  = origToggleSHoffset * preferences.earthSizePref.value + hModifier;
	toggleS.voffset		  = origToggleSVoffset * preferences.earthSizePref.value + vModifier;
	toggleF.hoffset		  = origToggleFHoffset * preferences.earthSizePref.value + hModifier;
	toggleF.voffset		  = origToggleFVoffset * preferences.earthSizePref.value + vModifier;
	//log("toggle4.hoffset "+toggle4.hoffset);
	//log("toggle2.hoffset "+toggle2.hoffset);
}

//==============================
//	Resize the components that comprise the large earth globe
//==============================
function resizeEarthGlobe() {
	// Now to rescale the frame and contents at any later time

	globe.width			 = origGlobeWidth * preferences.earthSizePref.value;
	globe.height		 = origGlobeHeight * preferences.earthSizePref.value;

	ring.width			 = origRingWidth * preferences.earthSizePref.value;
	ring.height			 = origRingHeight * preferences.earthSizePref.value;

	glow.width			 = origGlowWidth * preferences.earthSizePref.value;
	glow.height			 = origGlowHeight * preferences.earthSizePref.value;

	globetop.width		 = origGlobeTopWidth * preferences.earthSizePref.value;
	globetop.height		 = origGlobeTopHeight * preferences.earthSizePref.value;

	supportingBar.width	 = origSupportingBarWidth * preferences.earthSizePref.value;
	supportingBar.height = origSupportingBarHeight * preferences.earthSizePref.value;

	toggle1.width		 = origToggle1Width * preferences.earthSizePref.value;
	toggle1.height		 = origToggle1Height * preferences.earthSizePref.value;

	toggle2.width		 = origToggle2Width * preferences.earthSizePref.value;
	toggle2.height		 = origToggle2Height * preferences.earthSizePref.value;

	toggle3.width		 = origToggle3Width * preferences.earthSizePref.value;
	toggle3.height		 = origToggle3Height * preferences.earthSizePref.value;

	toggle4.width		 = origToggle4Width * preferences.earthSizePref.value;
	toggle4.height		 = origToggle4Height * preferences.earthSizePref.value;

	toggle5.width		 = origToggle5Width * preferences.earthSizePref.value;
	toggle5.height		 = origToggle5Height * preferences.earthSizePref.value;

	toggle6.width		 = origToggle6Width * preferences.earthSizePref.value;
	toggle6.height		 = origToggle6Height * preferences.earthSizePref.value;

	toggle7.width		 = origToggle7Width * preferences.earthSizePref.value;
	toggle7.height		 = origToggle7Height * preferences.earthSizePref.value;

	toggleS.width		 = origToggleSWidth * preferences.earthSizePref.value;
	toggleS.height		 = origToggleSHeight * preferences.earthSizePref.value;

	toggleF.width		 = origToggleFWidth * preferences.earthSizePref.value;
	toggleF.height		 = origToggleFHeight * preferences.earthSizePref.value;

	repositionEarthGlobe();
}

//==============================
//
//==============================
function doTheStuffAfterPrefsChanged() {
	var scale = Number(preferences.scalePref.value) / 100,
		year,
		month,
		day;

	if (moonWidgetFound) {
		tellWidget(preferred_form, "setPref:visible=false");
	}

	if (oldScale !== scale) {
		reloadWidget();
	}

	if (preferences.selectHotKeyPref.value !== oldSelectHotKeyPref) {
		makeSelectHotKey(preferences.selectHotKeyPref.value, selectMonth);
	}
	if (preferences.speechHotKeyPref.value !== oldSpeechHotKeyPref) {
		makeSpeechHotKey(preferences.speechHotKeyPref.value, speakMemo);
	}
	if (preferences.speechHotKeyPref.value !== oldSearchHotKeyPref) {
		makeSearchHotKey(preferences.searchHotKeyPref.value, findMemo);
	}

	eFlag		= (preferences.eFlagPref.value === "1");
	lFlag		= (preferences.lFlagPref.value === "1");
	sFlag		= (preferences.sFlagPref.value === "1");
	logFilePref = preferences.logFilePref.value; // path to log file
	logFlagPref = preferences.logFlagPref.value; // flag to control printing to file

	accessMode = preferences.accessModePref.value;

	if (multiUser) {
		if (disallowAutoOpenPref) {
			preferences.autoOpenPref.value = "Never";
		}
		sharedUpdateTimer.interval = 60 * Number(preferences.sharedUpdateTimerPref.value);
		sharedUpdateTimer.ticking  = true;
		accessMode				   = preferences.sharedModePref.value;
	} else {
		sharedUpdateTimer.ticking = false;
	}

	if (preferences.autoModePref.value === "1") {
		updateDate(false);
	} else {
		theTimer.ticking = false;
		year			 = parseInt(preferences.yearPref.value, 10);
		month			 = Number(preferences.monthPref.value);
		day				 = parseInt(preferences.dayPref.value, 10);
		if ((1900 <= year) && (year <= lastYear) && (0 < day) && (day <= daysInMonth(year, month))) {
			cal(year, month, day);
		} else {
			currDat = new Date();
			displayDate(currDat, angle0);
			date = currDat;
		}
	}
	if (preferences.earthTurnPref.value === "Fast") {
		earthTimer.interval = 0.1;
	} else if (preferences.earthTurnPref.value === "Slow") {
		earthTimer.interval = 0.3;
	}

// resize the controls
	resizeEarthGlobe();

	underlyingGlass.opacity = preferences.glassOpacityPref.value;

	saveAnchorPoint();
	updateMemoPrefs();
	updateSunPrefs();
	savePreferences();
	if (lunarWidgetVisible) {
		if (moonWidgetFound) {
			showBigMoon();
		}
	}

	// set the tooltips for all hover points
	setTooltips();
	// set the tooltips for all click points on the rings and timekeeper itself
	setClickPointToolTips();
	
}

//==============================
//
//==============================
widget.onPreferencesChanged = function () {
	doTheStuffAfterPrefsChanged();
};

//==============================
// Update the Dock vitality
//==============================
widget.onDockOpened = function () {
	updateVitality();
};

//==============================
// reload after sleep
//==============================
widget.onWakeFromSleep = function () {
	lprint("onWakeFromSleep");
	reloadWidget();
};

//==============================
// show buttons
//==============================
memo_window.onGainFocus = function () {
	showMemoButtons();
};

//==============================
// lose buttons
//==============================
memo_window.onLoseFocus = function () {
	hideMemoButtons();
};

//==============================
// bringsUpTheAboutBox by changing the opacity
//==============================
innerFramesclickpointleft.onClick = function () {
	//about.opacity = 255;
	var a = new FadeAnimation(about, 255, 1350, animator.kEaseOut);
	animator.start([
		a
	]);

	if (preferences.soundPref.value === "enable") {
		play(winding, false);
		play(electricDrone, false);
	}
};

//==============================
// bringsUpTheAboutBox by changing the opacity
//==============================
popUpPlaque.onClick = function () {
    popUpPlaque.opacity = 0;
    plaqueButton.opacity = 0;
    if (preferences.soundPref.value === "enable") {
        play(tingingSound, false);
    }
};

//==============================
// bringsUpTheAboutBox by changing the opacity
//==============================
plaqueButton.onClick = function () {
    popUpPlaque.opacity = 0;
    plaqueButton.opacity = 0;
    if (preferences.soundPref.value === "enable") {
        play(tingingSound, false);
    }
    if (preferences.soundPref.value === "enable") {
    	play(steam, false);
    }    
    openURL("http://lightquick.co.uk/instructions-for-the-steampunk-orrery-timekeeper-widget.html?Itemid=264");
};

//==============================
// pins the widget in place
//==============================
woodSurround.onMouseDown = function () {
	if (!main_window.locked) {
		main_window.locked = true;
	  	preferences.widgetLockPref.value = "1";
	  	pin.hoffset = system.event.hOffset - 5;
	  	pin.Voffset = system.event.vOffset - 5;
	  	preferences.pinHoffsetPref.value = pin.hoffset;
	  	preferences.pinVoffsetPref.value = pin.Voffset;
	  	pin.opacity = 255;
	}

	if (preferences.soundPref.value === "enable") {
		play(lock, false);
	}
};

//==============================
// pins the widget in place
//==============================
pin.onMouseDown = function () {
	if (main_window.locked) {
	  	main_window.locked = false;
	  	pin.opacity = 0;
	  	preferences.widgetLockPref.value = "1";
   	}
   	if (preferences.soundPref.value === "enable") {
	  	play(lock, false);
   	}
};

//==============================
// bringsUpThe help
//==============================
clockReflection.onMouseDown = function () {
	if (timekeeperPos === 1) {
		timekeeperclickpointleft.onClick();
	} else {
		if (clockPos === 1) {
			clockclickpointright.onClick();
		}
	}
	widgetHelp.opacity = 255;
	if (preferences.soundPref.value === "enable") {
		play(electricDrone, false);
	}

	moonUnderShadow.opacity	 = 255;
	moon.opacity			 = 255;
	moonOverShadow.opacity	 = 255;
	earthUnderShadow.opacity = 255;
	earth.opacity			 = 255;
	earthOverShadow.opacity	 = 170;

};

//==============================
// removes the help
//==============================
clockReflection.onMouseUp = function () {
	widgetHelp.opacity = 0;
	if (preferences.soundPref.value === "enable") {
		play(electricDrone, false);
	}
};

//==============================
// makes theAboutBox go away by changing the opacity
//==============================
about.onClick = function () {
	about.opacity = 0;
	if (preferences.soundPref.value === "enable") {
		play(steam, false);
		play(newClunk, false);
	}
};

//==============================
//	click on the timekeeper glass
//==============================
glass.onClick = function () {
	onClicked(gISOdate);
	if (preferences.soundPref.value === "enable") {
		play(steam, false);
	}
};

//===========================================
// this function opens the online help file
//===========================================
function widgetHelpFunction() {
	var hMiddle = (woodSurround.width / 2) + woodSurround.hOffset - 90,
		vMiddle = (woodSurround.height / 2) + woodSurround.vOffset - 126;
		
    popUpPlaque.opacity = 255;
    plaqueButton.opacity = 255;
    popUpPlaque.hOffset = hMiddle;
    popUpPlaque.vOffset = vMiddle;
    plaqueButton.hOffset = hMiddle + 13;
    plaqueButton.vOffset = vMiddle + 93;

	if (preferences.soundPref.value === "enable") {
    	play(winding, false);
	}

/*	answer = alert("This button opens a browser window and connects to the help page for this widget. Do you wish to proceed?", "Open Browser Window", "No Thanks");
	if (answer === 1) {
        	openURL("http://lightquick.co.uk/instructions-for-the-steampunk-orrery-timekeeper-widget.html?Itemid=264");
        	if (preferences.soundPref.value === "enable") {
                 play(steam, false);
        	}
	}
*/
}
//=====================
//End function
//=====================

//==============================
// causes the planets to appear when clicked (after an animation has terminated abnormally)
//==============================
innerFramesclickpointtop.onClick = function () {
	widgetHelpFunction();
};

function startCogsMoving() {
	cogtimer.ticking = true;
	tickTimer.ticking  = true;
	tickTimer.interval = 1;
}

//==============================
// all clickpoints hovered over (onMouseEnter) cause the red mask to appear
//==============================
function driveBandClick() {
	var a, b, c, d;

	if (preferences.soundPref.value === "enable") {
		play(tingingSound, false);
		play(newClunk, false);
	}

	if (driveBandClicks === 0) {
		preferences.cogAnimatePref.value = "enable";
	}
	if (driveBandClicks === 1) {
		preferences.cogAnimatePref.value = "disable";
	}
	if (driveBandClicks === 2) {
		//turn off the cogtimer and stop playing
		if (preferences.soundPref.value === "enable") {
			log("%TIMEK-I-PLYN, Playing nothing to empty the sound buffer.");
			play(nothing, true);
			play(newClunk, false);
		}

		cogtimer.ticking  = false;
		tickTimer.ticking = false;
		a = new RotateAnimation(cog, 100, animationSpeed, animator.kEaseOut);
		b = new RotateAnimation(cogShadow, 100, animationSpeed, animator.kEaseOut);
		c = new RotateAnimation(wheel, 100, animationSpeed, animator.kEaseOut);
		d = new RotateAnimation(wheelShadow, 100, animationSpeed, animator.kEaseOut);
		animator.start([
			a, b, c, d
		]);
	}

	if (driveBandClicks === 0 || driveBandClicks === 1) {
		if (!cogtimer.ticking) {
		  	//turn on the cogtimer and do some rotations prior to starting the cogs
		  	if (preferences.soundPref.value === "enable") {
			  	a = new RotateAnimation(cog, 0, 500, animator.kEaseOut);
			  	b = new RotateAnimation(cogShadow, 0, 500, animator.kEaseOut);
			  	c = new RotateAnimation(wheel, -100, 1000, animator.kEaseOut);
			  	d = new RotateAnimation(wheelShadow, -100, 1000, animator.kEaseOut, startCogsMoving);
			  	animator.start([
					a, b, c, d
			  	]);
		  	}
	  	}
	}
	driveBandClicks = driveBandClicks + 1;
	if (driveBandClicks >= 3) { driveBandClicks = 0; }
}

//==============================
// clicking on the driveband centre causes the cogs to move with the ticking clock
//==============================
driveBandclickpoint.onClick = function () {
	driveBandClick();
};
//==============================
// clicking on the driveband centre causes the cogs to move with the ticking clock
//==============================
driveBand.onClick = function () {
	driveBandClick();
};

//==============================
// clock right hand click point
//==============================
clockclickpointright.onClick = function () {
	// clicking on the clock right click point causes the clock and cogs to move in combination upwards
	// and the clock to move to the left
	var a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r;

	if (preferences.soundPref.value === "enable") {
		play(mechanism, false);
	}
	if (clockPos === 0) {
		clockPos = 1;
		a = new MoveAnimation(driveBand, driveBand.hoffset - scale, driveBand.voffset - (40 * scale), animationSpeed, animator.kEaseOut);
		b = new MoveAnimation(wheel, wheel.hoffset - scale, wheel.voffset - (40 * scale), animationSpeed, animator.kEaseOut);
		c = new MoveAnimation(wheelShadow, wheelShadow.hoffset - scale, wheelShadow.voffset - (40 * scale), animationSpeed, animator.kEaseOut);
		d = new MoveAnimation(cog, cog.hoffset - (6 * scale), cog.voffset - (40 * scale), animationSpeed, animator.kEaseOut);
		e = new MoveAnimation(cogShadow, cogShadow.hoffset - (6 * scale), cogShadow.voffset - (40 * scale), animationSpeed, animator.kEaseOut);
		f = new MoveAnimation(driveBandclickpoint, driveBandclickpoint.hoffset - scale, driveBandclickpoint.voffset - (40 * scale), animationSpeed, animator.kEaseOut);

		g = new MoveAnimation(dayOfWeek, dayOfWeek.hoffset - (30 * scale), dayOfWeek.voffset - (20 * scale), animationSpeed, animator.kEaseOut);
		h = new MoveAnimation(clock, clock.hoffset - (30 * scale), clock.voffset - (20 * scale), animationSpeed, animator.kEaseOut);
		i = new MoveAnimation(clockclickpointleft, clockclickpointleft.hoffset - (30 * scale), clockclickpointleft.voffset - (20 * scale), animationSpeed, animator.kEaseOut);
		j = new MoveAnimation(clockclickpointcentre, clockclickpointcentre.hoffset - (30 * scale), clockclickpointcentre.voffset - (20 * scale), animationSpeed, animator.kEaseOut);
		k = new MoveAnimation(clockclickpointright, clockclickpointright.hoffset - (30 * scale), clockclickpointright.voffset - (20 * scale), animationSpeed, animator.kEaseOut);
		l = new MoveAnimation(hourHand, hourHand.hoffset - (30 * scale), hourHand.voffset - (20 * scale), animationSpeed, animator.kEaseOut);
		m = new MoveAnimation(minuteHand, minuteHand.hoffset - (30 * scale), minuteHand.voffset - (20 * scale), animationSpeed, animator.kEaseOut);
		n = new MoveAnimation(secondHand, secondHand.hoffset - (30 * scale), secondHand.voffset - (20 * scale), animationSpeed, animator.kEaseOut);
		o = new MoveAnimation(centreBoss, centreBoss.hoffset - (30 * scale), centreBoss.voffset - (20 * scale), animationSpeed, animator.kEaseOut);
		p = new MoveAnimation(clockReflection, clockReflection.hoffset - (30 * scale), clockReflection.voffset - (20 * scale), animationSpeed, animator.kEaseOut);
		q = new RotateAnimation(cog, 0, animationSpeed, animator.kEaseOut);
		r = new RotateAnimation(cogShadow, 0, animationSpeed, animator.kEaseOut);
	} else {
		clockPos = 0;
		a = new MoveAnimation(driveBand, driveBand.hoffset + scale, driveBand.voffset + (40 * scale), animationSpeed, animator.kEaseOut);
		b = new MoveAnimation(wheel, wheel.hoffset + scale, wheel.voffset + (40 * scale), animationSpeed, animator.kEaseOut);
		c = new MoveAnimation(wheelShadow, wheelShadow.hoffset + scale, wheelShadow.voffset + (40 * scale), animationSpeed, animator.kEaseOut);
		d = new MoveAnimation(cog, cog.hoffset + (6 * scale), cog.voffset + (40 * scale), animationSpeed, animator.kEaseOut);
		e = new MoveAnimation(cogShadow, cogShadow.hoffset + (6 * scale), cogShadow.voffset + (40 * scale), animationSpeed, animator.kEaseOut);
		f = new MoveAnimation(driveBandclickpoint, driveBandclickpoint.hoffset + scale, driveBandclickpoint.voffset + (40 * scale), animationSpeed, animator.kEaseOut);
		g = new MoveAnimation(dayOfWeek, dayOfWeek.hoffset + (30 * scale), dayOfWeek.voffset + (20 * scale), animationSpeed, animator.kEaseOut);
		h = new MoveAnimation(clock, clock.hoffset + (30 * scale), clock.voffset + (20 * scale), animationSpeed, animator.kEaseOut);
		i = new MoveAnimation(clockclickpointleft, clockclickpointleft.hoffset + (30 * scale), clockclickpointleft.voffset + (20 * scale), animationSpeed, animator.kEaseOut);
		j = new MoveAnimation(clockclickpointcentre, clockclickpointcentre.hoffset + (30 * scale), clockclickpointcentre.voffset + (20 * scale), animationSpeed, animator.kEaseOut);
		k = new MoveAnimation(clockclickpointright, clockclickpointright.hoffset + (30 * scale), clockclickpointright.voffset + (20 * scale), animationSpeed, animator.kEaseOut);
		l = new MoveAnimation(hourHand, hourHand.hoffset + (30 * scale), hourHand.voffset + (20 * scale), animationSpeed, animator.kEaseOut);
		m = new MoveAnimation(minuteHand, minuteHand.hoffset + (30 * scale), minuteHand.voffset + (20 * scale), animationSpeed, animator.kEaseOut);
		n = new MoveAnimation(secondHand, secondHand.hoffset + (30 * scale), secondHand.voffset + (20 * scale), animationSpeed, animator.kEaseOut);
		o = new MoveAnimation(centreBoss, centreBoss.hoffset + (30 * scale), centreBoss.voffset + (20 * scale), animationSpeed, animator.kEaseOut);
		p = new MoveAnimation(clockReflection, clockReflection.hoffset + (30 * scale), clockReflection.voffset + (20 * scale), animationSpeed, animator.kEaseOut);
		q = new RotateAnimation(cog, 180, animationSpeed, animator.kEaseOut);
		r = new RotateAnimation(cogShadow, 180, animationSpeed, animator.kEaseOut);
	}

	animator.start([
		a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r
	]);

};
//==============================
// all clickpoints hovered over (onMouseEnter) cause the red mask to appear
//==============================
function highlightRed() {
	innerFramesclickpointleft.src	 = "Resources/Orrery/hole.png";
	innerFramesclickpointright.src	 = "Resources/Orrery/hole.png";
	innerFramesclickpointtop.src	 = "Resources/Orrery/hole.png";
	clockclickpointleft.src			 = "Resources/Orrery/brass-knob-tiny.png";
	clockclickpointcentre.src		 = "Resources/Orrery/brass-knob.png";
	clockclickpointright.src		 = "Resources/Orrery/brass-knob-tiny.png";
	timekeeperclickpointleft.src	 = "Resources/Orrery/red.png";
	timekeeperclickpointright.src	 = "Resources/Orrery/red.png";
	timekeeperclickpointfarright.src = "Resources/Orrery/red.png";
	timekeeperclickpointbottom.src	 = "Resources/Orrery/winged-key.png";
	driveBandclickpoint.src			 = "Resources/Orrery/clockhole.png";
	theFadeTimer.ticking			 = true;
}

//==============================
//click point onMouseEnter events
//==============================
innerFramesclickpointleft.onMouseEnter = function () {
	highlightRed();
};
innerFramesclickpointright.onMouseEnter = function () {
	highlightRed();
};
innerFramesclickpointtop.onMouseEnter = function () {
	highlightRed();
};
clockclickpointleft.onMouseEnter = function () {
	highlightRed();
};
clockclickpointcentre.onMouseEnter = function () {
	highlightRed();
};
clockclickpointright.onMouseEnter = function () {
	highlightRed();
};
timekeeperclickpointleft.onMouseEnter = function () {
	highlightRed();
};
timekeeperclickpointright.onMouseEnter = function () {
	highlightRed();
};
timekeeperclickpointfarright.onMouseEnter = function () {
	highlightRed();
};
timekeeperclickpointbottom.onMouseEnter = function () {
	highlightRed();
};
driveBandclickpoint.onMouseEnter = function () {
	highlightRed();
};

//==============================
//click point onMouseLeave events
//==============================
innerFramesclickpointright.onMouseExit = function () {
	highlightRedGone();
};
innerFramesclickpointtop.onMouseExit = function () {
	highlightRedGone();
};
clockclickpointleft.onMouseExit = function () {
	highlightRedGone();
};
clockclickpointcentre.onMouseExit = function () {
	highlightRedGone();
};
clockclickpointright.onMouseExit = function () {
	highlightRedGone();
};
timekeeperclickpointleft.onMouseExit = function () {
	highlightRedGone();
};
timekeeperclickpointright.onMouseExit = function () {
	highlightRedGone();
};
timekeeperclickpointfarright.onMouseExit = function () {
	highlightRedGone();
};
timekeeperclickpointbottom.onMouseExit = function () {
	highlightRedGone();
};
driveBandclickpoint.onMouseExit = function () {
	highlightRedGone();
};

//==============================
// click on shrinker image when visible does the same as clicking on the clock middle
//==============================
shrinker.onClick = function () {
	clockclickpointcentre.onClick();
};

//=================================
//the function called at the end of
//the MoveAnimation(moon) when the
//centre clock is clicked to shrinkthe orrery
//=================================
function stuffinvisible() {
	//var b = new MoveAnimation(shrinker, clock.hoffset + (91 *scale), clock.voffset  + (91 *scale), 350,
	//animator.kEaseIn);
	//animator.start(b	);

	underlyingGlass.visible		= false;
	sizeSlider.visible					 = false;
	opacitySlider.visible			   = false;
	underlay.visible			= false;
	innerFrames.visible			= false;
	rotatingring.visible		= false;
	ringtext.visible			= false;
	woodSurround.visible		= false;
	counterWheel.visible		= false;
	cogShadow.visible			= false;
	cog.visible					= false;
	monthCogShadow.visible		= false;
	monthCog.visible			= false;
	wheelShadow.visible			= false;
	wheel.visible				= false;
	driveBand.visible			= false;
	driveBandclickpoint.visible = false;
	dayCounter.visible			= false;
	yearCounter.visible			= false;
	dayTensCounter.visible		= false;
	dayUnitsCounter.visible		= false;
	monthCounter.visible		= false;
	yearTensCounter.visible		= false;
	yearUnitsCounter.visible	= false;
	timekeeper.visible			= false;
	soundtoggle.visible			= false;
	moonUnderShadow.visible		= false;
	moon.visible				= false;
	moonOverShadow.visible		= false;
	earthUnderShadow.visible	= false;
	earth.visible				= false;
	earthOverShadow.visible		= false;
	moon.zorder					= 24;
	earth.zorder				= 26;
}

//=================================
// the function called at the end of the RotateAnimation(shrinker) when the centre
// clock is clicked to enlarge the orrery
//=================================
function allItemsReappear() {
	var a;
	
	innerFramesclickpointleft.visible	 = true;
	innerFramesclickpointright.visible	 = true;
	innerFramesclickpointtop.visible	 = true;
	timekeeperclickpointleft.visible	 = true;
	timekeeperclickpointright.visible	 = true;
	timekeeperclickpointfarright.visible = true;
	timekeeperclickpointbottom.visible	 = true;

	//shrinker.visible					   = false;
	opacitySlider.visible				 = true;
	sizeSlider.visible					 = true;
	underlyingGlass.visible				 = true;
	underlay.visible					 = false;
	innerFrames.visible					 = true;
	rotatingring.visible				 = true;
	ringtext.visible					 = true;
	woodSurround.visible				 = true;
	counterWheel.visible				 = true;
	cogShadow.visible					 = true;
	cog.visible							 = true;
	monthCogShadow.visible				 = true;
	monthCog.visible					 = true;
	wheelShadow.visible					 = true;
	wheel.visible						 = true;
	driveBand.visible					 = true;
	driveBandclickpoint.visible			 = true;
	dayCounter.visible					 = true;
	yearCounter.visible					 = true;
	dayTensCounter.visible				 = true;
	dayUnitsCounter.visible				 = true;
	monthCounter.visible				 = true;
	yearTensCounter.visible				 = true;
	yearUnitsCounter.visible			 = true;
	timekeeper.visible					 = true;
	soundtoggle.visible					 = true;
	moonUnderShadow.visible				 = true;
	moon.visible						 = true;
	moonOverShadow.visible				 = true;
	earthUnderShadow.visible			 = true;
	earth.visible						 = true;
	earthOverShadow.visible				 = true;
	moon.zorder							 = 24;
	earth.zorder						 = 26;
	if (preferences.soundPref.value === "enable") {
		play(tingingSound, false);
	}
	a = new FadeAnimation(shrinker, 0, 2000, animator.kEaseOut);
	animator.start(a);
}

//==============================
// clock centre click point
//==============================
clockclickpointcentre.onClick = function () {
	//clicking on the clock centre causes the cogs, band and wheel and all other components to made invisible
	//the flattened shrinker image appears and then various animations are called to make the moon, earth
	//and shrinker move upward and left behind the clock.
	var a, b, c, d, e, f, g, h;

	shrinker.opacity = 255;
	if (shrunkFlg === 0) {
		if (cogsPos === 0) {
			clockclickpointleft.onClick(); // this causes the cogs and wheels to move
		}
		shrunkFlg		 = 1;
		shrinker.visible = true;
		earthHoffset	 = earth.hoffset;
		earthVoffset	 = earth.Voffset;
		earthzorder		 = earth.zorder;
		earth.zorder	 = 12;
		moonHoffset		 = moon.hoffset;
		moonVoffset		 = moon.voffset;
		moonzorder		 = moon.zorder;
		moon.zorder		 = 12;
		a = new ResizeAnimation(shrinker, (478 / 4) * scale, (478 / 4) * scale, 2300, animator.kEaseOut);
		b = new MoveAnimation(shrinker, shrinker.hoffset + (70 * scale), shrinker.voffset + (90 * scale), 1350, animator.kEaseIn);
		f = new RotateAnimation(shrinker, 360, 1350, animator.kEaseOut);
		c = new RotateAnimation(earth, 360, 2350, animator.kEaseIn); //rotate the earth
		d = new ResizeAnimation(earth, (68) * scale, (69) * scale, 2300, animator.kEaseOut);
		e = new MoveAnimation(earth, (140 * scale), (150 * scale), 2350, animator.kEaseIn);
		g = new ResizeAnimation(moon, (33) * scale, (33) * scale, 2300, animator.kEaseOut);
		h = new MoveAnimation(moon, (140 * scale), (150 * scale), 2350, animator.kEaseIn, stuffinvisible);
		if (preferences.soundPref.value === "enable") {
			play(suck, false);
		}
		innerFramesclickpointleft.visible	 = false;
		innerFramesclickpointright.visible	 = false;
		innerFramesclickpointtop.visible	 = false;
		timekeeperclickpointleft.visible	 = false;
		timekeeperclickpointright.visible	 = false;
		timekeeperclickpointfarright.visible = false;
		timekeeperclickpointbottom.visible	 = false;
		opacitySlider.visible			   = false;
		sizeSlider.visible				= false;

		underlyingGlass.visible				 = false;
		underlay.visible					 = false;
		innerFrames.visible					 = false;
		rotatingring.visible				 = false;
		ringtext.visible					 = false;
		woodSurround.visible				 = false;
		counterWheel.visible				 = false;
		//cogShadow.visible = false;
		//cog.visible = false;
		monthCogShadow.visible = false;
		monthCog.visible					 = false;
		//wheelShadow.visible = false;
		//wheel.visible = false;
		//driveBand.visible = false;
		//driveBandclickpoint.visible = false;
		dayCounter.visible = false;
		yearCounter.visible					 = false;
		dayTensCounter.visible				 = false;
		dayUnitsCounter.visible				 = false;
		monthCounter.visible				 = false;
		yearTensCounter.visible				 = false;
		yearUnitsCounter.visible			 = false;
		timekeeper.visible					 = false;
		soundtoggle.visible					 = false;
		moonUnderShadow.visible				 = false;
		moonOverShadow.visible				 = false;
		earthUnderShadow.visible			 = false;
		earthOverShadow.visible				 = false;
		animator.start([
			a, b, c, e, f, g, h
		]);
	} else {
		log("%TIMEK-I-COGP2, Cog Position, " + cogsPos);
		if (cogsPos === 1) {
			clockclickpointleft.onClick(); // this causes the cogs and wheels to move
		}
		log("%TIMEK-I-COGP3, Cog Position, " + cogsPos);
		shrunkFlg = 0;
		if (timekeeperPos === 1) {
			timekeeperclickpointleft.onClick();
		}
		earth.zorder  = 1;
		earth.visible = true;
		moon.zorder	  = 1;
		moon.visible  = true;
		if (preferences.soundPref.value === "enable") {
			play(steam, false);
		}
		a = new ResizeAnimation(shrinker, 478 * scale, 478 * scale, 1000, animator.kEaseInOut);
		b = new MoveAnimation(shrinker, shrinker.hoffset - (70 * scale), shrinker.voffset - (90 * scale), 1300, animator.kEaseOut);
		c = new RotateAnimation(shrinker, -360, 3000, animator.kEaseOut, allItemsReappear);
		d = new MoveAnimation(moon, moonHoffset, moonVoffset, 1350, animator.kEaseIn);
		e = new RotateAnimation(earth, -360, 1350, animator.kEaseOut);
		f = new MoveAnimation(earth, earthHoffset, earthVoffset, 1350, animator.kEaseIn);
		animator.start([
			a, b, c, d, e, f
		]);
	}
};

//=================================
// clicking on the clock right clickpoint moves the cogs behind the clock
//=================================
clockclickpointleft.onClick = function () {
	var a, b, c, d, e, f, g, h;

	if (preferences.soundPref.value === "enable") {
		play(mechanism, false);
	}
	if (!cogShadow.visible) {
		cogShadow.visible			= true;
		cog.visible					= true;
		wheelShadow.visible			= true;
		wheel.visible				= true;
		driveBand.visible			= true;
		driveBandclickpoint.visible = true;
	}
	log("%TIMEK-I-COGP, Cog Position, " + cogsPos);
	if (cogsPos === 0) {
		cogsPos = 1;
		a = new MoveAnimation(driveBand, driveBand.hoffset + (30 * scale), driveBand.voffset - (50 * scale), animationSpeed, animator.kEaseOut);
		b = new MoveAnimation(driveBandclickpoint, driveBandclickpoint.hoffset + (30 * scale), driveBandclickpoint.voffset - (50 * scale), animationSpeed, animator.kEaseOut);
		c = new MoveAnimation(wheel, wheel.hoffset + (40 * scale), wheel.voffset - (80 * scale), animationSpeed, animator.kEaseOut);
		d = new MoveAnimation(wheelShadow, wheelShadow.hoffset + (40 * scale), wheelShadow.voffset - (80 * scale), animationSpeed, animator.kEaseOut);
		e = new MoveAnimation(cog, cog.hoffset + (20 * scale), cog.voffset - (60 * scale), animationSpeed, animator.kEaseOut);
		f = new MoveAnimation(cogShadow, cogShadow.hoffset + (20 * scale), cogShadow.voffset - (60 * scale), animationSpeed, animator.kEaseOut);
		g = new RotateAnimation(cog, 0, animationSpeed, animator.kEaseOut);
		h = new RotateAnimation(cogShadow, 0, animationSpeed, animator.kEaseOut);
		animator.start([
			a, b, c, d, e, f, g, h
		]);
	} else {
		cogsPos = 0;
		a = new MoveAnimation(driveBand, driveBand.hoffset - (30 * scale), driveBand.voffset + (50 * scale), animationSpeed, animator.kEaseOut);
		b = new MoveAnimation(driveBandclickpoint, driveBandclickpoint.hoffset - (30 * scale), driveBandclickpoint.voffset + (50 * scale), animationSpeed, animator.kEaseOut);
		c = new MoveAnimation(wheel, wheel.hoffset - (40 * scale), wheel.voffset + (80 * scale), animationSpeed, animator.kEaseOut);
		d = new MoveAnimation(wheelShadow, wheelShadow.hoffset - (40 * scale), wheelShadow.voffset + (80 * scale), animationSpeed, animator.kEaseOut);
		e = new MoveAnimation(cog, cog.hoffset - (20 * scale), cog.voffset + (60 * scale), animationSpeed, animator.kEaseOut);
		f = new MoveAnimation(cogShadow, cogShadow.hoffset - (20 * scale), cogShadow.voffset + (60 * scale), animationSpeed, animator.kEaseOut);
		g = new RotateAnimation(cog, 180, animationSpeed, animator.kEaseOut);
		h = new RotateAnimation(cogShadow, 180, animationSpeed, animator.kEaseOut);
		animator.start([
			a, b, c, d, e, f, g, h
		]);
	}
};

//=================================
//the timekeeper left point click causes
//the timekeeper, the clock and the cogs
//to move outward unless the clock/cogs are already there.
//=================================
timekeeperclickpointleft.onClick = function () {
	var a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q;

	if (preferences.soundPref.value === "enable") {
		play(crank, false);
	}
	if (timekeeperPos === 0) {
		timekeeperPos = 1;
		a = new MoveAnimation(timekeeper, timekeeper.hoffset + (50 * scale), timekeeper.voffset, animationSpeed, animator.kEaseOut);
		b = new MoveAnimation(soundtoggle, soundtoggle.hoffset + (50 * scale), soundtoggle.voffset, animationSpeed, animator.kEaseOut);
		c = new MoveAnimation(dayCounter, dayCounter.hoffset + (50 * scale), dayCounter.voffset, animationSpeed, animator.kEaseOut);
		q = new MoveAnimation(yearCounter, yearCounter.hoffset + (50 * scale), yearCounter.voffset, animationSpeed, animator.kEaseOut);
		d = new MoveAnimation(dayTensCounter, dayTensCounter.hoffset + (50 * scale), dayTensCounter.voffset, animationSpeed, animator.kEaseOut);
		e = new MoveAnimation(dayUnitsCounter, dayUnitsCounter.hoffset + (50 * scale), dayUnitsCounter.voffset, animationSpeed, animator.kEaseOut);
		f = new MoveAnimation(monthCounter, monthCounter.hoffset + (50 * scale), monthCounter.voffset, animationSpeed, animator.kEaseOut);
		g = new MoveAnimation(yearTensCounter, yearTensCounter.hoffset + (50 * scale), yearTensCounter.voffset, animationSpeed, animator.kEaseOut);
		h = new MoveAnimation(yearUnitsCounter, yearUnitsCounter.hoffset + (50 * scale), yearUnitsCounter.voffset, animationSpeed, animator.kEaseOut);
		i = new MoveAnimation(timekeeper, timekeeper.hoffset + (50 * scale), timekeeper.voffset, animationSpeed, animator.kEaseOut);
		j = new MoveAnimation(monthCog, monthCog.hoffset + (50 * scale), monthCog.voffset, animationSpeed, animator.kEaseOut);
		k = new MoveAnimation(monthCogShadow, monthCogShadow.hoffset + (50 * scale), monthCogShadow.voffset, animationSpeed, animator.kEaseOut);
		l = new MoveAnimation(timekeeperclickpointleft, timekeeperclickpointleft.hoffset + (50 * scale), timekeeperclickpointleft.voffset, animationSpeed, animator.kEaseOut);
		m = new MoveAnimation(timekeeperclickpointright, timekeeperclickpointright.hoffset + (50 * scale), timekeeperclickpointright.voffset, animationSpeed, animator.kEaseOut);
		n = new MoveAnimation(timekeeperclickpointfarright, timekeeperclickpointfarright.hoffset + (50 * scale), timekeeperclickpointfarright.voffset, animationSpeed, animator.kEaseOut);
		o = new MoveAnimation(timekeeperclickpointbottom, timekeeperclickpointbottom.hoffset + (50 * scale), timekeeperclickpointbottom.voffset, animationSpeed, animator.kEaseOut);
		p = new RotateAnimation(monthCog, 0, animationSpeed, animator.kEaseOut);
		if (clockPos === 0) {
			clockclickpointright.onClick();
		}
	} else {
		timekeeperPos = 0;
		a = new MoveAnimation(timekeeper, timekeeper.hoffset - (50 * scale), timekeeper.voffset, animationSpeed, animator.kEaseOut);
		b = new MoveAnimation(soundtoggle, soundtoggle.hoffset - (50 * scale), soundtoggle.voffset, animationSpeed, animator.kEaseOut);
		c = new MoveAnimation(dayCounter, dayCounter.hoffset - (50 * scale), dayCounter.voffset, animationSpeed, animator.kEaseOut);
		q = new MoveAnimation(yearCounter, yearCounter.hoffset - (50 * scale), yearCounter.voffset, animationSpeed, animator.kEaseOut);
		d = new MoveAnimation(dayTensCounter, dayTensCounter.hoffset - (50 * scale), dayTensCounter.voffset, animationSpeed, animator.kEaseOut);
		e = new MoveAnimation(dayUnitsCounter, dayUnitsCounter.hoffset - (50 * scale), dayUnitsCounter.voffset, animationSpeed, animator.kEaseOut);
		f = new MoveAnimation(monthCounter, monthCounter.hoffset - (50 * scale), monthCounter.voffset, animationSpeed, animator.kEaseOut);
		g = new MoveAnimation(yearTensCounter, yearTensCounter.hoffset - (50 * scale), yearTensCounter.voffset, animationSpeed, animator.kEaseOut);
		h = new MoveAnimation(yearUnitsCounter, yearUnitsCounter.hoffset - (50 * scale), yearUnitsCounter.voffset, animationSpeed, animator.kEaseOut);
		i = new MoveAnimation(timekeeper, timekeeper.hoffset - (50 * scale), timekeeper.voffset, animationSpeed, animator.kEaseOut);
		j = new MoveAnimation(monthCog, monthCog.hoffset - (50 * scale), monthCog.voffset, animationSpeed, animator.kEaseOut);
		k = new MoveAnimation(monthCogShadow, monthCogShadow.hoffset - (50 * scale), monthCogShadow.voffset, animationSpeed, animator.kEaseOut);
		l = new MoveAnimation(timekeeperclickpointleft, timekeeperclickpointleft.hoffset - (50 * scale), timekeeperclickpointleft.voffset, animationSpeed, animator.kEaseOut);
		m = new MoveAnimation(timekeeperclickpointright, timekeeperclickpointright.hoffset - (50 * scale), timekeeperclickpointright.voffset, animationSpeed, animator.kEaseOut);
		n = new MoveAnimation(timekeeperclickpointfarright, timekeeperclickpointfarright.hoffset - (50 * scale), timekeeperclickpointfarright.voffset, animationSpeed, animator.kEaseOut);
		o = new MoveAnimation(timekeeperclickpointbottom, timekeeperclickpointbottom.hoffset - (50 * scale), timekeeperclickpointbottom.voffset, animationSpeed, animator.kEaseOut);
		p = new RotateAnimation(monthCog, 180, animationSpeed, animator.kEaseOut);
		if (clockPos === 1) {
			clockclickpointright.onClick();
		}
	}
	animator.start([
		a, b, c, q, d, e, f, g, h, i, j, k, l, m, n, o, p
	]);
};

//=================================
//on click here reset the date
//=================================
timekeeperclickpointright.onClick = function () {
	var currDat = new Date(),
		a;
		
	if (preferences.soundPref.value === "enable") {
		play(winding, false);
	}
	angle0 = dayAngle(currDat) - 120;
	displayDate(currDat, angle0);
	date = currDat;
	displayTime(currDat);
	if (lunarWidgetVisible) {
		if (moonWidgetFound === true) {
			tellWidget(preferred_form, "setDate:date=" + currDat.getTime());
		}
	}
	cogrotation = cogrotation + 32;
	a = new RotateAnimation(counterWheel, -cogrotation / 2, 990, animator.kEaseOut);
	animator.start(a);
};

//===========================
//turns off the sound
//===========================
function soundoff() {
	play(newClunk, false); // this one does not have a prefs check
	if (preferences.soundPref.value === "enable") {
		preferences.soundPref.value			 = "disable";
		soundtoggle.hoffset					 = soundtoggle.hoffset - (10 * scale);
		timekeeperclickpointfarright.hoffset = timekeeperclickpointfarright.hoffset - (10 * scale);
	} else {
		preferences.soundPref.value			 = "enable";
		soundtoggle.hoffset					 = soundtoggle.hoffset + (10 * scale);
		timekeeperclickpointfarright.hoffset = timekeeperclickpointfarright.hoffset + (10 * scale);
	}
}

//=================================
// clicking on the sound toggle turns of the sound
//=================================
soundtoggle.onClick = function () {
	soundoff();
};

//=================================
//on click here toggle sound off
//=================================
timekeeperclickpointfarright.onClick = function () {
	soundoff();
};

//===========================
//when the timekeeperclickpointbottom is clicked it will call this function
//===========================
function callShowWidgetPreferences() {
//it is done this way as the RotateAnimation won't call the default engine function showWidgetPreferences
	showWidgetPreferences();
}

//===========================
// on click here show the widget preferences
//===========================
timekeeperclickpointbottom.onClick = function () {
	var a;

	cogrotation = cogrotation + 96;
	a = new RotateAnimation(counterWheel, -cogrotation / 2, 990, animator.kEaseOut, callShowWidgetPreferences);
	animator.start(a);
	if (preferences.soundPref.value === "enable") {
		play(winding, false);
	}
};

//===========================
//Show the big moon
//===========================
moon.onClick = function () {
//when the expanded globe is double-clicked a click on the ring ought to restore the moon and shadows to normal positions.
	var a;
	if (moonWidgetFound) {
	   cogrotation = cogrotation + 32;
	   a = new RotateAnimation(counterWheel, -cogrotation / 2, 990, animator.kEaseOut);
	   animator.start(a);

           savMoonHoffset = moon.hoffset;
	   savMoonVoffset = moon.voffset;
	   theRotateTimer.ticking = true;
        }
};

//===========================
//Show the big moon
//===========================
moonOverShadow.onClick = function () {
	var a;
	if (moonWidgetFound) {
	   cogrotation = cogrotation + 32;
	   a = new RotateAnimation(counterWheel, -cogrotation / 2, 990, animator.kEaseOut);
	   animator.start(a);

           savMoonHoffset = moon.hoffset;
	   savMoonVoffset = moon.voffset;
	   theRotateTimer.ticking = true;
        }
};

//===========================
//when the small earth overshadow is clicked it will animate the globe growing and then trigger the globe rotating
//===========================
earthOverShadow.onClick = function () {
	var a;

	cogrotation = cogrotation + 32;
	a = new RotateAnimation(counterWheel, -cogrotation / 2, 990, animator.kEaseOut);
	animator.start(a);

        savEarthHoffset = earth.hoffset;
	savEarthVoffset = earth.voffset;

	theEarthRotateTimer.ticking = true;
};

//===========================
//when the small earth is clicked it will animate the globe growing and then trigger the globe rotating
//===========================
earth.onClick = function () {
	var a;

	cogrotation = cogrotation + 32;
	a = new RotateAnimation(counterWheel, -cogrotation / 2, 990, animator.kEaseOut);
	animator.start(a);

        savEarthHoffset = earth.hoffset;
	savEarthVoffset = earth.voffset;

	theEarthRotateTimer.ticking = true;
};

//===========================
//when the expanded globe is double-clicked a click on the ring ought to restore the moon and shadows to normal positions.
//===========================
ring.onClick = function () {
	log("%TIMEK-I-ALLR, allowRingClick" + allowRingClick);
	if (allowRingClick) {
		largeEarthInvisible();
	}
};

//=================================
//when the enlarged earth is clicked once it will stop the globe rotating
//=================================
globe.onMouseDown = function () {
	globeStartHoffset = system.event.hOffset;
	log("globeStartHoffset " + globeStartHoffset);
	earthTimer.ticking = false;
};
//=================================
// function ENDS
//=================================


//==============================
// drag the ring...
//==============================
globe.onMouseDrag = function () {
	globeEndHoffset = system.event.hOffset;
	log("globeEndHoffset " + globeEndHoffset);
	earthTimer.ticking = true;
};
//=====================
//End function
//=====================

//==============================
// drag the ring...
//==============================
globe.onMouseUp = function () {
	globeEndHoffset = system.event.hOffset;
	log("globeStartHoffset " + globeStartHoffset);
	log("globeEndHoffset " + globeEndHoffset);
	if (preferences.soundPref.value === "enable") {
		play(tingingSound, false);
	}
};
//=====================
//End function
//=====================

//=================================
//	When the mouse is over the counter will increment the date by a year
//=================================
yearCounter.onMouseWheel = function () {
	var delta = system.event.scrollDelta,
		yearInc = 0,
		someDate,
		a;

	//print("scroll wheel " + delta);
	if (preferences.soundPref.value === "enable") {
		play(tingingSound, false);
	}
	if (delta !== 0) {
		yearInc = parseInt(delta / 10, 10);
		//build the date for today
		someDate = new Date();

		log("someDate " + someDate);
		numberOfYearsToAdd = numberOfYearsToAdd + yearInc;
		someDate.setYear(someDate.getYear() + numberOfYearsToAdd);
		currDat = someDate;
		angle0	= dayAngle(currDat) - 120;
		displayDate(currDat, angle0);
		date = currDat;
		displayTime(currDat);
		if (lunarWidgetVisible) {
			if (moonWidgetFound === true) {
				tellWidget(preferred_form, "setDate:date=" + currDat.getTime());
			}
		}
	}
	cogrotation = cogrotation + 12;
	a = new RotateAnimation(counterWheel, -cogrotation / 2, 990, animator.kEaseOut);
	animator.start(a);

};
//=================================
// function ENDS
//=================================
//=================================
//	When the mouse is over the counter will increment the date by a year
//=================================
yearCounter.onClick = function () {
	var yearInc = 0,
		someDate,
		a;

	//print("scroll wheel " + delta);
	if (preferences.soundPref.value === "enable") {
		play(newClunk, false);
	}
	yearInc = yearInc + 1;
	//build the date for today
	someDate = new Date();

	log("someDate " + someDate);
	numberOfYearsToAdd = numberOfYearsToAdd + yearInc;
	someDate.setYear(someDate.getYear() + numberOfYearsToAdd);
	currDat = someDate;
	angle0	= dayAngle(currDat) - 120;
	displayDate(currDat, angle0);
	date = currDat;
	displayTime(currDat);
	if (lunarWidgetVisible) {
		if (moonWidgetFound === true) {
			tellWidget(preferred_form, "setDate:date=" + currDat.getTime());
		}
	}
	cogrotation = cogrotation + 12;
	a = new RotateAnimation(counterWheel, -cogrotation / 2, 990, animator.kEaseOut);
	animator.start(a);
	
};
//=================================
// function ENDS
//=================================

//=================================
//	When the mouse is over the counter will increment the date by a month
//=================================
monthCounter.onMouseWheel = function () {
	var delta = system.event.scrollDelta,
		monthInc = 0,
		someDate;

	if (delta < 0) {
		if (preferences.soundPref.value === "enable") {
			play(tick, false);
		}
	} else {
		if (preferences.soundPref.value === "enable") {
			play(tock, false);
		}
	}
	//print("scroll wheel " + delta);
	if (delta !== 0) {
		monthInc = parseInt(delta / 11, 10);
		//build the date for today
		someDate = new Date();
		numberOfMonthsToAdd = numberOfMonthsToAdd + monthInc;
		someDate.setMonth(someDate.getMonth() + numberOfMonthsToAdd);
		currDat = someDate;
		angle0	= dayAngle(currDat) - 120;
		displayDate(currDat, angle0);
		date = currDat;
		displayTime(currDat);
		if (lunarWidgetVisible) {
			if (moonWidgetFound) {
				tellWidget(preferred_form, "setDate:date=" + currDat.getTime());
			}
		}
	}
};
//=================================
// function ENDS
//=================================

//=================================
//	When the mouse is over the counter will increment the date by a month
//=================================
monthCounter.onClick = function () {
	var monthInc = 0,
		someDate;

	if (preferences.soundPref.value === "enable") {
		play(newClunk, false);
	}
	monthInc = monthInc + 1;
	//build the date for today
	someDate = new Date();
	numberOfMonthsToAdd = numberOfMonthsToAdd + monthInc;
	someDate.setMonth(someDate.getMonth() + numberOfMonthsToAdd);
	currDat = someDate;
	angle0	= dayAngle(currDat) - 120;
	displayDate(currDat, angle0);
	date = currDat;
	displayTime(currDat);
	if (lunarWidgetVisible) {
		if (moonWidgetFound) {
			tellWidget(preferred_form, "setDate:date=" + currDat.getTime());
		}
	}
};
//=================================
// function ENDS
//=================================

//=================================
//	When the mouse is over the counter will increment the date by a day
//=================================
dayCounter.onMouseWheel = function () {
	var delta = system.event.scrollDelta,
		dayInc = 0,
		someDate;

	//print("scroll wheel " + delta);
	if (delta < 0) {
		if (preferences.soundPref.value === "enable") {
			play(tick, false);
		}
	} else {
		if (preferences.soundPref.value === "enable") {
			play(tock, false);
		}
	}
	if (delta !== 0) {
		dayInc = parseInt(delta / 10, 10);
		//build the date for today
		someDate = new Date();
		log("currDat " + currDat);
		numberOfDaysToAdd = numberOfDaysToAdd + dayInc;
		someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
		currDat = someDate;
		angle0	= dayAngle(currDat) - 120;
		displayDate(currDat, angle0);
		date = currDat;
		displayTime(currDat);
		if (lunarWidgetVisible) {
			if (moonWidgetFound) {
				tellWidget(preferred_form, "setDate:date=" + currDat.getTime());
			}
		}
	}
	log("delta " + delta);
};
//=================================
// function ENDS
//=================================

//=================================
//	When the mouse is over the counter will increment the date by a month
//=================================
dayCounter.onClick = function () {
	var dayInc = 0,
		someDate;

	if (preferences.soundPref.value === "enable") {
		play(newClunk, false);
	}
	dayInc = dayInc + 1;
	//build the date for today
	someDate = new Date();
	numberOfDaysToAdd = numberOfDaysToAdd + dayInc;
	someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
	currDat = someDate;
	angle0	= dayAngle(currDat) - 120;
	displayDate(currDat, angle0);
	date = currDat;
	displayTime(currDat);
	if (lunarWidgetVisible) {
		if (moonWidgetFound) {
			tellWidget(preferred_form, "setDate:date=" + currDat.getTime());
		}
	}
};
//=================================
// function ENDS
//=================================

//==============================
// click on the rotating ring
//==============================
rotatingring.onMouseDown = function () {
	downAngle = (Math.atan2((main_window.height / 2) - system.event.vOffset, (main_window.width / 2) - system.event.hOffset) / Math.PI) * 180;
	downDate  = date.getTime();
	if (preferences.soundPref.value === "enable") {
		play(zzzz, false);
	}
};
//=================================
// function ENDS
//=================================

//==============================
// when the opacitySlider is clicked upon and dragged
//==============================
opacitySlider.onMouseDrag = function () {
	var angle,
		opacityLevel;
	if (preferences.soundPref.value === "enable") {
		play(zzzzQuiet, false);
	}
	angle = (Math.atan2((main_window.height / 2) - system.event.vOffset, (main_window.width / 2) - system.event.hOffset) / Math.PI) * 180;
	opacitySlider.rotation = angle - 63;
	//log("opacitySlider.rotation " + opacitySlider.rotation);
	if (opacitySlider.rotation >= 13) {
		opacitySlider.rotation = 13;
	}
	if (opacitySlider.rotation <= -9) {
		opacitySlider.rotation = -9;
	}
	opacityLevel					   = opacitySlider.rotation + 9; //normalise the opacity level
	underlyingGlass.opacity			   = opacityLevel * 12;
	if (underlyingGlass.opacity <= 1) {
		underlyingGlass.opacity = 1;
	}
	preferences.glassOpacityPref.value = underlyingGlass.opacity;

//log("underlyingGlass.opacity " + underlyingGlass.opacity);
};
//=====================
//End function
//=====================

//==============================
// when the opacitySlider is clicked upon and dragged
//==============================
opacitySlider.onMouseDown = function () {
	if (preferences.soundPref.value === "enable") {
		play(zzzz, false);
	}
};
//=====================
//End function
//=====================

//==============================
// when the opacitySlider is clicked upon and dragged
//==============================
opacitySlider.onMouseUp = function () {
	if (preferences.soundPref.value === "enable") {
		play(zzzz, false);
	}
};
//=====================
//End function
//=====================

//==============================
// when the sizeSlider is clicked upon and dragged
//==============================
sizeSlider.onMouseDrag = function () {
	var angle;
	if (preferences.soundPref.value === "enable") {
		play(zzzzQuiet, false);
	}
	angle = (Math.atan2((main_window.height / 2) - system.event.vOffset, (main_window.width / 2) - system.event.hOffset) / Math.PI) * 180;
	sizeSlider.rotation = angle + 133;
	//log("sizeSlider.rotation " + sizeSlider.rotation);
	if (sizeSlider.rotation >= 8) {
		sizeSlider.rotation = 8;
	}
	if (sizeSlider.rotation <= -14) {
		sizeSlider.rotation = -14;
	}
	sizeLevel			= sizeSlider.rotation + 14; //normalise the size level
	sizeLevel			= parseInt((sizeLevel * 4.54) + 1, 10);
	if (preferences.tooltipPref.value === "enable") {
		sizeSlider.tooltip	= "Size " + sizeLevel + "% - Double click the size slider to set";
		innerFrames.tooltip = "Size " + sizeLevel + "% - Double click the size slider to set";
	} else {
		sizeSlider.tooltip	= "";
		innerFrames.tooltip = "";
	}
	sizeText.opacity = 90;
	sizeText.text = sizeLevel + "%";

	log("2 sizeLevel " + sizeLevel);
	//log("preferences.scalePref.value	" + preferences.scalePref.value);
};
//=====================
//End function
//=====================

//==============================
// after the drag a double-clock is required to resize
//==============================
sizeSlider.onMouseUp = function () {
	var a = new FadeAnimation(sizeText, 0, 1550, animator.kEaseOut);
	animator.start([
		a
	]);
	if (preferences.soundPref.value === "enable") {
		play(zzzz, false);
	}

};
//=====================
//End function
//=====================

//==============================
// after the drag a double-clock is required to resize
//==============================
sizeSlider.onMouseEnter = function () {
	log("1 sizeText.text " + sizeText.text);
	if (!sizeText.text) {
		sizeText.text = preferences.scalePref.value + "%";
	}
	sizeText.opacity = 90;
};
//=====================
//End function
//=====================

//==============================
// after the drag a double-clock is required to resize
//==============================
sizeSlider.onMouseExit = function () {
	sizeText.opacity = 0;
};
//=====================
//End function
//=====================

//==============================
// after the drag a double-clock is required to resize
//==============================
sizeSlider.onMouseDown = function () {
	sizeText.opacity = 90;
	if (preferences.soundPref.value === "enable") {
		play(zzzz, false);
	}
};
//=====================
//End function
//=====================

//==============================
// changes the widget size
//==============================
innerFramesclickpointright.onClick = function () {
	if (preferences.soundPref.value === "enable") {
		play(steam, false);
	}

	if (!sizeLevel) {
		sizeLevel = preferences.scalePref.value;
	} else {
	  preferences.scalePref.value = sizeLevel;
        }       
	log("sizeLevel " + sizeLevel);
	log("preferences.scalePref.value  " + preferences.scalePref.value);
	doTheStuffAfterPrefsChanged();
};
//=====================
//End function
//=====================

//==============================
// drag the ring...
//==============================
rotatingring.onMouseDrag = function () {
	var angle,
		delta;

	angle	= (Math.atan2((main_window.height / 2) - system.event.vOffset, (main_window.width / 2) - system.event.hOffset) / Math.PI) * 180;
	delta	= Math.round(downAngle - angle);
	currDat = new Date(downDate + delta * 86400000);
	log(currDat + " " + angle + " " + delta);
	displayDate(currDat, angle0);
	newDate = currDat;
	
	//log("1 currDat " + currDat);
	if (lunarWidgetVisible) {
		if (moonWidgetFound) {
			tellWidget(preferred_form, "setDate:date=" + newDate.getTime());
		}
	}
};
//=====================
//End function
//=====================

//==============================
// final date on mouse up
//==============================
rotatingring.onMouseUp = function () {
	//date = newDate;
	//currDate =  newDate;
	//log("2 newDate " + newDate);
	//log("3 currDat " + currDat);
	savEarthHoffset = earth.hoffset;
	savEarthVoffset = earth.voffset;
	if (preferences.soundPref.value === "enable") {
		play(tingingSound, false);
	}
	rotatingRingMovement();
};
//=====================
//End function
//=====================

//=====================
//
//=====================
rotatingring.onMouseWheel = function () {
	var delta = system.event.scrollDelta,
		dayInc = 0,
		someDate;

	//print("scroll wheel " + delta);
	if (delta !== 0) {
		dayInc = parseInt(delta / 5, 10);
		//build the date for today
		someDate = new Date();
		log("currDat " + currDat);
		numberOfDaysToAdd = numberOfDaysToAdd + dayInc;
		someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
		currDat = someDate;
		angle0	= dayAngle(currDat) - 120;
		displayDate(currDat, angle0);
		date = currDat;
		displayTime(currDat);
		if (lunarWidgetVisible) {
			if (moonWidgetFound) {
				tellWidget(preferred_form, "setDate:date=" + currDat.getTime());
			}
		}
	}
	log("delta " + delta);
	
	useMouseWheel = useMouseWheel + 1;
};
//=================================
// function ENDS
//=================================

//=================================
//Turn the earth, selecting the next animated image
//=================================
function earthTurn() {
	globe.src = earthBaseName + earthFrame + ".png";
	if (globeStartHoffset < globeEndHoffset) {
		if (earthFrame >= 35) {
			earthFrame = 1;
		} else {
			earthFrame = earthFrame + 1;
		}
	} else {
		if (earthFrame <= 1) {
			earthFrame = 35;
		} else {
			earthFrame = earthFrame - 1;
		}
	}
}
//=====================
//End function
//=====================

//=====================
//when the 1 toggle is clicked it show in full size
//=====================
toggle1.onClick = function () {
	if (preferences.soundPref.value === "enable") {
		play(steam, false);
	}
	preferences.earthSizePref.value = "1.0";
	resizeEarthGlobe();
};
//=====================
//End function
//=====================

//=====================
//when the 2 toggle is clicked it decrease size by 10%
//=====================
toggle2.onClick = function () {
	if (preferences.soundPref.value === "enable") {
		play(steam, false);
	}
	preferences.earthSizePref.value = "0.9";
	resizeEarthGlobe();
};
//=====================
//End function
//=====================

//=====================
//when the 3 toggle is clicked it decrease size by 20%
//=====================
toggle3.onClick = function () {
	if (preferences.soundPref.value === "enable") {
		play(steam, false);
	}
	preferences.earthSizePref.value = "0.8";
	resizeEarthGlobe();
};
//=====================
//End function
//=====================

//=====================
//when the 4 toggle is clicked it decrease size by 30%
//=====================
toggle4.onClick = function () {
	if (preferences.soundPref.value === "enable") {
		play(steam, false);
	}
	preferences.earthSizePref.value = "0.7";
	resizeEarthGlobe();
};
//=====================
//End function
//=====================

//=====================
//when the 5 toggle is clicked it decrease size by 40%
//=====================
toggle5.onClick = function () {
	if (preferences.soundPref.value === "enable") {
		play(steam, false);
	}
	preferences.earthSizePref.value = "0.6";
	resizeEarthGlobe();
};
//=====================
//End function
//=====================

//=====================
//when the 6 toggle is clicked it decrease size by 50%
//=====================
toggle6.onClick = function () {
	if (preferences.soundPref.value === "enable") {
		play(steam, false);
	}
	preferences.earthSizePref.value = "0.5";
	resizeEarthGlobe();
};
//=====================
//End function
//=====================

//=====================
//when the globe is double-clicked it
//=====================
toggle7.onClick = function () {
	if (preferences.soundPref.value === "enable") {
		play(steam, false);
	}
	preferences.earthSizePref.value = "0.4";
	resizeEarthGlobe();
};
//=====================
//End function
//=====================

//=====================
//when the F toggle is clicked turn the globe fast
//=====================
toggleF.onClick = function () {
	preferences.earthTurnPref.value = "Fast";
	earthTimer.interval				= 0.1;
	earthTimer.ticking				= true;
	if (preferences.soundPref.value === "enable") {
		play(electricDrone, false);
	}
};
//=====================
//End function
//=====================

//=====================
//when the S toggle is clicked turn the globe slow
//=====================
toggleS.onClick = function () {
	preferences.earthTurnPref.value = "Slow";
	earthTimer.interval				= 0.3;
	earthTimer.ticking				= true;
	if (preferences.soundPref.value === "enable") {
		play(newClunk, false);
	}
};
//=====================
//End function
//=====================

//=====================
//when the supporting bar is clicked bar disappears
//=====================
supportingBar.onClick = function () {
	if (preferences.soundPref.value === "enable") {
		play(suck, false);
	}
	preferences.sizebar.value = "disable";
	supportingBar.visible	  = false;
	toggle1.visible			  = false;
	toggle2.visible			  = false;
	toggle3.visible			  = false;
	toggle4.visible			  = false;
	toggle5.visible			  = false;
	toggle6.visible			  = false;
	toggle7.visible			  = false;
	globetop.visible		  = true;
};
//=====================
//End function
//=====================

//=====================
//when the supporting bar is clicked bar disappears
//=====================
globetop.onClick = function () {
	if (preferences.soundPref.value === "enable") {
		play(suck, false);
	}
	preferences.sizebar.value = "enable";
	supportingBar.visible	  = true;
	toggle1.visible			  = true;
	toggle2.visible			  = true;
	toggle3.visible			  = true;
	toggle4.visible			  = true;
	toggle5.visible			  = true;
	toggle6.visible			  = true;
	toggle7.visible			  = true;
};
//=====================
//End function
//=====================

//===========================================
// this function opens other widgets URL
//===========================================
function otherwidgets() {
	var answer = alert("This button opens a browser window and connects to the Steampunk widgets page on my site. Do you wish to proceed", "Open Browser Window", "No Thanks");

	if (answer === 1) {
		openURL("http://lightquick.co.uk/steampunk-widgets.html?Itemid=264");
		if (preferences.soundPref.value === "enable") {
			play(winding, false);
		}
	}
}
//=====================
//End function
//=====================

//===========================================
// this function opens the URL for paypal
//===========================================
function donate() {
	var answer = alert("Help support the creation of more widgets like this, send us a beer! This button opens a browser window and connects to the Paypal donate page for this widget). Will you be kind and proceed?", "Open Browser Window", "No Thanks");

	if (answer === 1) {
		//openURL("https://www.paypal.com/uk/cgi-bin/webscr?cmd=_flow&SESSION=CHFojKaws7BH7Nnavk7M3I8M369MmoGfUxkSu_lfOygjH_Qm9e2ZDao7Fs4&dispatch=5885d80a13c0db1f8e263663d3faee8d14f86393d55a810282b64afed84968ec");
		openURL("http://lightquick.co.uk/donate-a-beer.html?Itemid=269");
		if (preferences.soundPref.value === "enable") {
			play(winding, false);
		}
	}
}
//=====================
//End function
//=====================

//===========================================
// this function opens my Amazon URL wishlist
//===========================================
function amazon() {
	var answer = alert("Help support the creation of more widgets like this. Buy me a small item on my Amazon wishlist! This button opens a browser window and connects to my Amazon wish list page). Will you be kind and proceed?", "Open Browser Window", "No Thanks");

	if (answer === 1) {
		openURL("http://www.amazon.co.uk/gp/registry/registry.html?ie=UTF8&id=A3OBFB6ZN4F7&type=wishlist");
	}
}
//=====================
//End function
//=====================

//===========================================
// this function opens the rocketdock URL
//===========================================
function rocketdock() {
	var answer = alert("Log in and vote for my widgets on Rocketdock. This button opens a browser window and connects to the Rocketdock page where you can give the widget a 5 star rating... Will you be kind and proceed?", "Open Browser Window", "No Thanks");

	if (answer === 1) {
		openURL("http://rocketdock.com/user/107284/addons/popular");
		if (preferences.soundPref.value === "enable") {
			play(winding, false);
		}
	}
}
//=====================
//End function
//=====================


//===========================================
// this function opens the underWidget URL
//===========================================
function underWidget() {
	var answer = alert("This button opens a browser window and connects to the Under Widget download page where you can download and install the UnderWidget that provides the cogs and gubbins underneath this widget", "Open Browser Window", "No Thanks");

	if (answer === 1) {
	        openURL("http://lightquick.co.uk/underwidget.html?Itemid=264");
		if (preferences.soundPref.value === "enable") {
			play(winding, false);
		}
	}
}
//=====================
//End function
//=====================


//===========================================
// this function opens the underWidget URL
//===========================================
function moonWidget() {
	var answer = alert("This button opens a browser window and connects to the Moon Widget download page where you can download and install the moon widget that provides the moon phase functionality for this widget", "Open Browser Window", "No Thanks");

	if (answer === 1) {
	        openURL("http://lightquick.co.uk/moon-phase-III-widget.html?Itemid=264");
		if (preferences.soundPref.value === "enable") {
			play(winding, false);
		}
	}
}
//=====================
//End function
//=====================

//===========================================
// this function opens the download URL
//===========================================
function update() {
	var answer = alert("Download latest version of the widget - this button opens a browser window and connects to the widget download page where you can check and download the latest zipped .WIDGET file). Proceed?", "Open Browser Window", "No Thanks");

	if (answer === 1) {
		openURL("http://lightquick.co.uk/jdownloads/steampunk-orrery-calendar-clock-yahoo-widget.html?Itemid=264");
		if (preferences.soundPref.value === "enable") {
			play(winding, false);
		}
	}
}
//=====================
//End function
//=====================

//===========================================
// this function opens the browser at the contact URL
//===========================================
function contact() {
	var answer = alert("Visiting the support page - this button opens a browser window and connects to our contact us page where you can send us a support query or just have a chat). Proceed?", "Open Browser Window", "No Thanks");

	if (answer === 1) {
		openURL("http://lightquick.co.uk/contact.html?Itemid=3");
		if (preferences.soundPref.value === "enable") {
			play(winding, false);
		}
	}
}
//=====================
//End function
//=====================

//===========================================
// this function allows a spacer in the menu
//===========================================
function nullfunction() {
	print("dummy");
}
//=====================
//End function
//=====================

//=====================
//position the data window near the widget but still on screen
//=====================
function posEntryWindow() {
	var vOff = main_window.vOffset + main_window.height / 2 - entry_window.height / 2,
		hOff = main_window.hOffset + main_window.width / 2 - entry_window.width / 2;

	if (hOff + entry_window.width > screen.availWidth) {
		hOff = screen.availWidth - entry_window.width;
	}

	if (hOff < screen.availLeft) {
		hOff = screen.availLeft;
	}

	if (vOff + entry_window.height > screen.availHeight) {
		vOff = screen.availHeight - entry_window.height;
	}

	if (vOff < screen.availTop) {
		vOff = screen.availTop;
	}

	entry_window.vOffset = vOff + (60 * scale);
	entry_window.hOffset = hOff - (30 * scale);
}
//=====================
//End function
//=====================

//=====================
//End script.js
//=====================
