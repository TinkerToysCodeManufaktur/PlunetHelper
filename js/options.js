var defaultHighColor = "#000000";
var defaultHighBColor = "#ffff99";

document.addEventListener('DOMContentLoaded', initOptions);

function initOptions() {
	//var manifestData = chrome.runtime.getManifest();
	chrome.storage.local.get(null, function(settings) {


		
	})
	var addCC = localStorage["addCC"];
	if (addCC == undefined) {
		addCC = true;
		localStorage["addCC"] = addCC;
	} else
		addCC = (addCC == 'true');
	document.getElementById("addCC").checked = addCC;
	var dSTfix = localStorage["dSTfix"];
	if (dSTfix == undefined) {
		dSTfix = true;
		localStorage["dSTfix"] =dSTfix;
	} else
		dSTfix = (dSTfix == 'true');
	document.getElementById("dSTfix").checked = dSTfix;
	var makeBold = localStorage["makeBold"];
	if (makeBold == undefined) {
		makeBold = true;
		localStorage["makeBold"] = makeBold;
	} else
		makeBold = (makeBold == 'true');
	document.getElementById("makeBold").checked = makeBold;
	var makeImportant = localStorage["makeImportant"];
	if (makeImportant == undefined) {
		makeImportant = true;
		localStorage["makeImportant"] = makeImportant;
	} else
		makeImportant = (makeImportant == 'true');
	document.getElementById("makeImportant").checked = makeImportant;
	var makeHighlighted = localStorage["makeHighlighted"];
	if (makeHighlighted == undefined) {
		makeHighlighted = true;
		localStorage["makeHighlighted"] = makeHighlighted;
	} else
		makeHighlighted = (makeHighlighted == 'true');
	document.getElementById("makeHighlighted").checked = makeHighlighted;
	var cleanUp = localStorage["cleanUp"];
	if (cleanUp == undefined) {
		cleanUp = true;
		localStorage["cleanUp"] = cleanUp;
	} else
		cleanUp = (cleanUp == 'true');
	document.getElementById("cleanUp").checked = cleanUp;
	var swapMQ = localStorage["swapMQ"];
	if (swapMQ == undefined) {
		swapMQ = true;
		localStorage["swapMQ"] = swapMQ;
	} else
		swapMQ = (swapMQ == 'true');
	document.getElementById("swapMQ").checked = swapMQ;
	var highlightMQ = localStorage["highlightMQ"];
	if (highlightMQ == undefined) {
		highlightMQ = true;
		localStorage["highlightMQ"] = highlightMQ;
	} else
		highlightMQ = (highlightMQ == 'true');
	document.getElementById("highlightMQ").checked = highlightMQ;
	var highColor = localStorage["highColor"];
	var highBColor = localStorage["highBColor"];
	if ((highColor == undefined) || (highBColor == undefined)) {
		highColor = defaultHighColor;
		highBColor = defaultHighBColor;
		localStorage["highColor"] = highColor;
		localStorage["highBColor"] = highBColor;
	}
	document.getElementById('colorswatch').addEventListener('change', saveColor);
	var select = document.getElementById("colorswatch");
	for (var i = 0; i < select.children.length; i++) {
		var child = select.children[i];
		if (child.value == highBColor) {
			child.selected = "true";
			highColor = child.getAttribute('color');
			document.getElementById("colorsample").style.color = highColor;
			document.getElementById("colorsample").style.backgroundColor = highBColor;
			break;
		}
	}
	var classname = document.getElementsByClassName("options-clickable");
	Array.from(classname).forEach(function(element) {
		element.addEventListener('click', saveOption);
	});
	document.getElementById('resetdefaults').addEventListener('click', resetOptions);
}

function saveOption() {
	localStorage[this.id] = document.getElementById(this.id).checked;
}

function saveColor() {
	var select = document.getElementById("colorswatch");
	var highColor = select.children[select.selectedIndex].getAttribute('color');
	var highBColor = select.children[select.selectedIndex].value;
	document.getElementById("colorsample").style.color = highColor;
	document.getElementById("colorsample").style.backgroundColor = highBColor;
	localStorage["highColor"] = highColor;
	localStorage["highBColor"] = highBColor;
}

function resetOptions() {
	localStorage.removeItem("addCC");
	localStorage.removeItem("dSTfix");
	localStorage.removeItem("makeBold");
	localStorage.removeItem("makeImportant");
	localStorage.removeItem("makeHighlighted");
	localStorage.removeItem("cleanUp");
	localStorage.removeItem("swapMQ");
	localStorage.removeItem("highlightMQ");
	localStorage.removeItem("highColor");
	localStorage.removeItem("highBColor");
	location.reload();
}