document.addEventListener('DOMContentLoaded', initOptions);

function initOptions() {
	//var manifestData = chrome.runtime.getManifest();
	chrome.storage.local.get(null, function (settings) {
		//console.log(settings);
		var addCC = settings.addCC;
		if (addCC == undefined) {
			addCC = true;
			chrome.storage.local.set({ "addCC": addCC });
		}
		document.getElementById("addCC").checked = addCC;
		var dSTfix = settings.dSTfix;
		if (dSTfix == undefined) {
			dSTfix = true;
			chrome.storage.local.set({ "dSTfix": dSTfix });
		}
		document.getElementById("dSTfix").checked = dSTfix;
		var makeBold = settings.makeBold;
		if (makeBold == undefined) {
			makeBold = true;
			chrome.storage.local.set({ "makeBold": makeBold });
		}
		document.getElementById("makeBold").checked = makeBold;
		var makeImportant = settings.makeImportant;
		if (makeImportant == undefined) {
			makeImportant = true;
			chrome.storage.local.set({ "makeImportant": makeImportant });
		}
		document.getElementById("makeImportant").checked = makeImportant;
		var makeHighlighted = settings.makeHighlighted;
		if (makeHighlighted == undefined) {
			makeHighlighted = true;
			chrome.storage.local.set({ "makeHighlighted": makeHighlighted });
		}
		document.getElementById("makeHighlighted").checked = makeHighlighted;
		var cleanUp = settings.cleanUp;
		if (cleanUp == undefined) {
			cleanUp = true;
			chrome.storage.local.set({ "cleanUp": cleanUp });
		}
		document.getElementById("cleanUp").checked = cleanUp;
		var swapMQ = settings.swapMQ;
		if (swapMQ == undefined) {
			swapMQ = true;
			chrome.storage.local.set({ "swapMQ": swapMQ });
		}
		document.getElementById("swapMQ").checked = swapMQ;
		var highlightMQ = settings.highlightMQ;
		if (highlightMQ == undefined) {
			highlightMQ = true;
			chrome.storage.local.set({ "highlightMQ": highlightMQ });
		}
		document.getElementById("highlightMQ").checked = highlightMQ;
		var highColor = settings.highColor;
		var highBColor = settings.highBColor;
		if ((highColor == undefined) || (highBColor == undefined)) {
			highColor = "#000000";
			highBColor = "#ffff99";
			chrome.storage.local.set({ "highColor": highColor });
			chrome.storage.local.set({ "highBColor": highBColor });
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
		document.getElementById('colorswatch').addEventListener('change', saveColor);
		var classname = document.getElementsByClassName("options-clickable");
		Array.from(classname).forEach(function (element) {
			element.addEventListener('click', saveOption);
		});
	});
}

function saveOption() {
	chrome.storage.local.set({[this.id]:document.getElementById(this.id).checked});
}

function saveColor() {
	var select = document.getElementById("colorswatch");
	var highColor = select.children[select.selectedIndex].getAttribute('color');
	var highBColor = select.children[select.selectedIndex].value;
	document.getElementById("colorsample").style.color = highColor;
	document.getElementById("colorsample").style.backgroundColor = highBColor;
	chrome.storage.local.set({"highColor":highColor});
	chrome.storage.local.set({"highBColor":highBColor});
}