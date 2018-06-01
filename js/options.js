var defaultAddCC = true;
var defaultDSTfix = true;
var defaultMakeBold = true;
var defaultMakeImportant = true;
var defaultCleanUp = true;
var defaultSwapMQ = true;
var defaultHighlightMQ = true;
var defaultHighColor = "yellow";

document.addEventListener('DOMContentLoaded', initOptions);

function initOptions() {
	var manifestData = chrome.runtime.getManifest();
	document.getElementById("ext-version").textContent = 'v' + manifestData.version;
	var addCC = localStorage["addCC"];
	if (addCC == undefined ) {
		addCC = defaultAddCC;
		localStorage["addCC"] = addCC;
	}
	document.getElementById("add-coord").checked = addCC;
	var dSTfix = localStorage["dSTfix"];
	if (dSTfix == undefined ) {
		dSTfix = defaultDSTfix;
		localStorage["dSTfix"] =dSTfix;
	}
	document.getElementById("correct-cest").checked = dSTfix;
	var makeBold = localStorage["makeBold"];
	if (makeBold == undefined ) {
		makeBold = defaultMakeBold;
		localStorage["makeBold"] = makeBold;
	}
	document.getElementById("make-bold").checked = makeBold;
	var makeImportant = localStorage["makeImportant"];
	if (makeImportant == undefined ) {
		makeImportant = defaultMakeImportant;
		localStorage["makeImportant"] = makeImportant;
	}
	document.getElementById("make-important").checked = makeImportant;
	var cleanUp = localStorage["cleanUp"];
	if (cleanUp == undefined ) {
		cleanUp = defaultCleanUp;
		localStorage["cleanUp"] = cleanUp;
	}
	document.getElementById("remove-empty").checked = cleanUp;
	var swapMQ = localStorage["swapMQ"];
	if (swapMQ == undefined ) {
		swapMQ = defaultSwapMQ;
		localStorage["swapMQ"] = swapMQ;
	}
	document.getElementById("swap-mqinfo").checked = swapMQ;
	var highlightMQ = localStorage["highlightMQ"];
	if (highlightMQ == undefined ) {
		highlightMQ = defaultHighlightMQ;
		localStorage["highlightMQ"] = highlightMQ;
	}
	document.getElementById("highlight-mqinfo").checked = highlightMQ;
	var highColor = localStorage["highColor"];
	if (highColor == undefined ) {
		highColor = defaultHighColor;
		localStorage["addCC"] =	addCC;
	}
	var select = document.getElementById("background-color");
	for (var i = 0; i < select.children.length; i++) {
		var child = select.children[i];
			if (child.value == highColor) {
			child.selected = "true";
			break;
		}
	}
	document.getElementById('save-button').addEventListener('click', saveOptions);
	document.getElementById('reset-button').addEventListener('click', resetOptions);
}

function saveOptions() {
	localStorage["addCC"] = document.getElementById("add-coord").checked;
	localStorage["dSTfix"] = document.getElementById("correct-cest").checked;
	localStorage["makeBold"] = document.getElementById("make-bold").checked;
	localStorage["makeImportant"] = document.getElementById("make-important").checked;
	localStorage["cleanUp"] = document.getElementById("remove-empty").checked;
	localStorage["swapMQ"] = document.getElementById("swap-mqinfo").checked;
	localStorage["highlightMQ"] = document.getElementById("highlight-mqinfo").checked;
	var select = document.getElementById("background-color");
	var bcolor = select.children[select.selectedIndex].value;
	localStorage["highColor"] = bcolor;
}

function resetOptions() {
	localStorage.removeItem("addCC");
	localStorage.removeItem("dSTfix");
	localStorage.removeItem("makeBold");
	localStorage.removeItem("makeImportant");
	localStorage.removeItem("cleanUp");
	localStorage.removeItem("swapMQ");
	localStorage.removeItem("highlightMQ");
	localStorage.removeItem("highColor");
	location.reload();
}