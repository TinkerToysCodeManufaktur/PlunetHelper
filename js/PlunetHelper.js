// PlunetHelper
// (C) 2018 Michael K. Schmidt
//
// define helpers to determine DST
Date.prototype.stdTimezoneOffset = function () {
    var jan = new Date(this.getFullYear(), 0, 1);
    var jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
};
Date.prototype.isDstObserved = function () {
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
};
// observer calls this one
function updateIframe(meiframe) {
	//var meiframe = this.id;
	console.log("update function is being called for " + meiframe);
	chrome.storage.local.get(null, function (settings) {
		console.log("stored settings found");
		var iframe = document.getElementById(meiframe);
		var doc = iframe.contentDocument ? iframe.contentDocument: iframe.contentWindow.document;
		var body = doc.querySelector('body').innerHTML;
		if (typeof body !== 'undefined') {
			console.log("body html found");
			if (!doc.getElementById('updatedbyplunethelper')) {
				var addCC = (settings.addCC == undefined ? true : settings.addCC);
				var mailCC = (settings.mailCC == undefined ? 'coordination@altagram.com' : settings.mailCC);
				var mailID = '';
				switch (mailCC) {
					case 'coordination@altagram.com': mailID = 'Q29vcmRpbmF0aW9uIFRlYW0gIDxjb29yZGluYXRpb25AYWx0YWdyYW0uY29tPg=='; break;
					case 'lm@altagram.com': mailID = 'QWx0YWdyYW0gR2VybWFueSBsbSA8bG1AYWx0YWdyYW0uY29tPg=='; break;
				}
				var dSTfix = (settings.dSTfix == undefined ? true : settings.dSTfix);
				var makeBold = (settings.makeBold == undefined ? true : settings.makeBold);
				var makeImportant = (settings.makeImportant == undefined ? true : settings.makeImportant);
				var makeHighlighted = (settings.makeHighlighted == undefined ? true : settings.makeHighlighted);
				var cleanUp = (settings.cleanUp == undefined ? true : settings.cleanUp);
				var swapMQ = (settings.swapMQ == undefined ? true : settings.swapMQ);
				var highlightMQ = (settings.highlightMQ == undefined ? true : settings.highlightMQ);
				var highColor = (settings.highColor == undefined ? "#000000" : settings.highColor);
				var highBColor = (settings.highBColor == undefined ? "#ffff99" : settings.highBColor);
				// prettify/enhance the mail body text
				if (dSTfix) {
					// check if DST is on, and if so, fix the "CET" indicator
					var today = new Date();
					if (today.isDstObserved()) {
						if (body.match(/\b(\d{1,2}:\d\d)\sCET\b/) !== null) {
							body = body.replace(/\b(\d{1,2}:\d\d)\sCET\b/g, '$1 CEST');
						}
					}
				}
				if (swapMQ) { // look if file(s) info precedes memoq project name, and flip them
					var turned = body.match(/(file(s)?\s*(\s*\(\d+\))?:\s*)(.+?)(memoq\s+project\s*:\s*)(.+?)(\r|\n|\r\n|<\s*br\s*\/?\s*>)+/im);
					if (turned !== null) {
						body = body.replace(/(file(s)?\s*(\s*\(\d+\))?:\s*)(.+?)(memoq\s+project\s*:\s*)(.+?)(\r|\n|\r\n|<\s*br\s*\/?\s*>)+/im, '$5 $6<br/>$1$4<br/>');
					}
				}
				if (highlightMQ) { // look for memoQ project name and file(s) list info, and highlight if found
					var mqp = body.match(/(?![\r\n]\s*?)(memoq\s+?project\s*?:\s*?)(.+?)(\r|\n|\r\n|<\s*br\s*\/?\s*>)+/im);
					if (mqp !== null) {
						body = body.replace(/(?![\r\n]\s*?)(memoq\s+?project\s*?:\s*?)(.+?)(\r|\n|\r\n|<\s*br\s*\/?\s*>)+/im, '<strong><span style="color:' + highColor + ';background-color:' + highBColor + ';">$1$2</span></strong><br/>');
					}
					var mqf = body.match(/(?![\r\n]\s*?)(file(s)?\s*?(\s*?\(\d+?\))?:\s*?)(.+?)((\r|\n|\r\n|<\s*br\s*\/?\s*>){2,}|(?=memoq\s+?project))/im);
					if (mqf !== null) {
						body = body.replace(/(?![\r\n]\s*?)(file(s)?\s*?(\s*?\(\d+?\))?:\s*?)(.+?)((\r|\n|\r\n|<\s*br\s*\/?\s*>){2,}|(?=memoq\s+?project))/im, '<strong><span style="color:' + highColor + ';background-color:' + highBColor + ';">$1$4</span></strong><br/><br/>');
					}
				}
				if (cleanUp) { // get rid of unnecessary linebreaks
					if (body.match(/(<div><span[^>]*>(\s*?|(\s*?&nbsp;\s*?)*?)<\/span><\/div>\s*)+/gi) !== null) {
						body = body.replace(/(<div><span[^>]*>(\s*?|(\s*?&nbsp;\s*?)*?)<\/span><\/div>\s*)+/gi, '');
					}
					if (body.match(/<div>(\s*?|(&nbsp;)*?)<\/div>(<br\/>)*/gi) !== null) {
						body = body.replace(/<div>(\s*?|(&nbsp;)*?)<\/div>(<br\/>)*/gi, '');
					}
					if (body.match(/(egards\s*?<\/span>\s*?<\/div>\s*?<div>\s*?)(<br\s*\/>)(\s*?<span)/gi) !== null) {
						body = body.replace(/(egards\s*?<\/span>\s*?<\/div>\s*?<div>\s*?)(<br\s*\/>)(\s*?<span)/gi, '$1$3');
					}
					if (body.match(/(<br\s*\/>)(<br\s*\/>)(\s*<\/span>\s*<\/div>\s*<div>\s*<p>\s*<span)/gi) !== null) {
						body = body.replace(/(<br\s*\/>)(<br\s*\/>)(\s*<\/span>\s*<\/div>\s*<div>\s*<p>\s*<span)/gi, '$1$3');
					}
					if (body.match(/(<\/p><\/div>)(<div>\s*?&nbsp;\s*?<\/div>)(<div><br\s*\/><\/div>)(<div><\/span)/gi) !== null) {
						body = body.replace(/(<\/p><\/div>)(<div>\s*?&nbsp;\s*?<\/div>)(<div><br\s*\/><\/div>)(<div><\/span)/gi, '$1$3$4');
					}
				}
				if (makeBold) { // look for *bold* shortcuts and format as <strong>bold</strong>
					if (body.match(/\*+([^<>]+?)\*+/gim) !== null) {
						body = body.replace(/\*+([^<>]+?)\*+/gim, '<strong>$1</strong>');
					}
				}
				if (makeImportant) { // look for §important§ shortcuts and format as <strong style="color:red;">important</strong>
					if (body.match(/\§+([^<>]+?)\§+/gim) !== null) {
						body = body.replace(/\§+([^<>]+?)\§+/gim, '<strong><span style="color:#ff0000;">$1</span></strong>');
					}
				}
				if (makeHighlighted) { // look for #highlighting# shortcuts and format accordingly
					if (body.match(/\~+([^<>]+?)\~+/gim) !== null) {
						body = body.replace(/\~+([^<>]+?)\~+/gim, '<span style="color:' + highColor + ';background-color:' + highBColor + ';">$1</span>');
					}
				}
				doc.querySelector('body').innerHTML = '';
				doc.querySelector('body').insertAdjacentHTML('afterbegin', body + '<div id="updatedbyplunethelper"></div>');
				var taname = meiframe.substr(0, meiframe.length - 4);
				document.getElementById(taname).innerHTML = '';
				document.getElementById(taname).insertAdjacentHTML('afterbegin', body + '<div id="updatedbyplunethelper"></div>');
				console.log("body html updated");
				if ((addCC) && (mailCC != '') && (mailID != '')) {
					// look for the CC field and if found then add the mail address
					var cc = document.querySelector('[id^="ATagBox05CC"]');
					var ccSelect = cc.getElementsByClassName('selectWrapper');
					if (ccSelect.length > 0) {
						ccSelect = ccSelect[0].getElementsByClassName('ng-non-bindable');
						if (ccSelect.length > 0) {
							ccSelect = ccSelect[0];
							ccSelect.insertAdjacentHTML('afterbegin', '<option id="ATagBox07#' + ccSelect.getAttribute('name') + '#' + mailID + '" value="' + mailID + '" selected="selected">' + mailCC + '</option>');
						}
					}
					var ccFakeSelect = cc.getElementsByClassName('ellipsis');
					if (ccFakeSelect.length > 0) {
						ccFakeSelect = ccFakeSelect[0];
						ccFakeSelect.insertAdjacentHTML('afterbegin', '<span title="' + mailCC + ' <' + mailCC + '>">' + mailCC + '</span><div class="icon-cross-small deleteButton"></div><div class="icon-cross-small deleteButtonHover"></div>');
						ccFakeSelect.classList.remove('hinweistext');
						ccFakeSelect.classList.add('selectedTag');
					}
					console.log("CC added");
				}
			} else {
				console.log("Updated by PlunetHelper!");
			}
		}
		console.log("settings async call finished");
	});
	console.log("iframe update function finished");
}
// entry point is here
var ta = document.getElementsByTagName('textarea');
if (typeof ta != 'undefined') {
	var taname = ta[0].getAttribute('name');
	console.log("textarea name: " + taname);
	var iframeid = taname + '_ifr';
	console.log("iframe id: " + iframeid);
	// set up a mutation observer
	var observer = new MutationObserver(function (mutations, me) {
		var iframe = document.getElementById(iframeid);
		if (iframe) {
			var doc = iframe.contentDocument ? iframe.contentDocument: iframe.contentWindow.document;
			if (doc.readyState == "complete") {
				console.log("iframe is fully loaded, calling the update function directly");
				updateIframe(iframeid);
			} else {
				console.log("iframe is NOT fully loaded, adding the update function as event listener");
				iframe.onload = updateIframe(iframeid);
			}
			me.disconnect(); // stop observing
			return;
		}
	});
	// start observing
	observer.observe(document, {
		childList: true,
		subtree: true
	});
} else {
	console.log("no textarea found, aborting mission!");
}
console.log("end of injected JS code reached");