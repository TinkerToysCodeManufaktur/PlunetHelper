// PlunetHelper
// (C) 2018 Michael K. Schmidt
//
Date.prototype.addHours = function(h) {
	this.setTime(this.getTime() + (h*60*60*1000));
	return this;
}
function getTimeDiff(d, tz) {
	var a = d.toLocaleString("ja", {timeZone: tz}).split(/[\/\s:]/);
	a[1]--;
	var t1 = Date.UTC.apply(null, a);
	var t2 = new Date(d).setMilliseconds(0);
	return (t2 - t1) / 60 / 60 / 1000;
}
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
					case 'lm@altagram.com': mailID = 'QWx0YWdyYW0gR21iSCAgPGxtQGFsdGFncmFtLmNvbT4='; break;
					case 'korea.coordination@altagram.com': mailID = 'QWx0YWdyYW0gS29yZWEgIDxrb3JlYS5jb29yZGluYXRpb25AYWx0YWdyYW0uY29tPg=='; break;
				}
				var dSTfix = (settings.dSTfix == undefined ? true : settings.dSTfix);
				var timeZone = (settings.timeZone == undefined ? 'Europe/Berlin' : settings.timeZone);
				var makeBold = (settings.makeBold == undefined ? true : settings.makeBold);
				var makeImportant = (settings.makeImportant == undefined ? true : settings.makeImportant);
				var makeHighlighted = (settings.makeHighlighted == undefined ? true : settings.makeHighlighted);
				var cleanUp = (settings.cleanUp == undefined ? true : settings.cleanUp);
				var swapMQ = (settings.swapMQ == undefined ? true : settings.swapMQ);
				var highlightMQ = (settings.highlightMQ == undefined ? true : settings.highlightMQ);
				var highColor = (settings.highColor == undefined ? "#000000" : settings.highColor);
				var highBColor = (settings.highBColor == undefined ? "#ffff99" : settings.highBColor);
				// update the mail body text
				if (dSTfix) { // request mail times are local Berlin time (can be with and without DST)
					// find times
					var pattern = /\b((\d\d)[\.\-\/](\d\d)[\.\-\/](\d\d\d\d)\s((\d{1,2}):(\d\d)))\sCET\b/i;
					var match = pattern.exec(body);
					while (match != null) {
						var year = parseInt(match[4]),
							month = parseInt(match[3]),
							day = parseInt(match[2]),
							hours = parseInt(match[6]),
							minutes = parseInt(match[7]);
						var pDate = new Date(year, month-1, day, hours, minutes);
						// determine any time difference to request mail time
						var uDate = pDate.toLocaleString('ja', {timeZone: 'UTC', hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'}).replace(/\//g,'-') + ' UTC';
						var uDay = pDate.toLocaleString('ja', {timeZone: 'UTC', hour12: false, year: 'numeric', month: '2-digit', day: '2-digit'});
						var uTime = pDate.toLocaleString('ja', {timeZone: 'UTC', hour12: false, hour: '2-digit', minute:'2-digit'}) + ' UTC';
						var tdiff = getTimeDiff(pDate, timeZone) - getTimeDiff(pDate, "Europe/Berlin");
						pDate.addHours(-1 * tdiff);
						var sDate = pDate.toLocaleString('ja', {hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'}).replace(/\//g,'-');
						var sDay = pDate.toLocaleString('ja', {hour12: false, year: 'numeric', month: '2-digit', day: '2-digit'});
						// check if DST is on, and if so, fix the "CET" indicator
						var mom = moment(new Date(sDate)), tzCode = '';
						var dst = mom.tz(timeZone).isDST();
						switch (timeZone) {
							case 'America/Montreal':
								tzCode = (dst ? 'EDT' : 'ET');
								break;
							case 'Asia/Seoul':
								tzCode = (dst ? 'KDST' : 'KST');
								break;
							case 'Europe/Berlin':
								tzCode = (dst ? 'CEST' : 'CET');
								break;
							default:
								tzCode = '';
						}
						body = body.replace(pattern, sDate + ' ' + tzCode + ' (' + (sDay == uDay ? uTime : uDate) + ')');
						match = pattern.exec(body);
					}
					pattern = /(Start date)\s+?(.*?)\s*?\|\s*?(Delivery date )(.*?)(?=<br)/i;
					body = body.replace(pattern, '$4 <br ><span style="color:black;">$1:&nbsp;$2</span>');
				}
				if (swapMQ) { // look if file(s) info precedes memoq project name, and flip them
					var turned = body.match(/(file(s)?\s*(\s*\(\d+\))?:\s*)(.+?)((\r|\n|\r\n|<\s*?br\s*?\/?\s*?>)?)(memoq\s+project\s*:\s*)(.+?)((\r|\n|\r\n|<\s*?br\s*?\/?\s*?>)+)/im);
					if (turned !== null) {
						body = body.replace(/(file(s)?\s*(\s*\(\d+\))?:\s*)(.+?)((\r|\n|\r\n|<\s*?br\s*?\/?\s*?>)?)(memoq\s+project\s*:\s*)(.+?)((\r|\n|\r\n|<\s*?br\s*?\/?\s*?>)+)/im, '$7$8<br/>$1$4$9');
					}
				}
				if (highlightMQ) { // look for memoQ project name and file(s) list info, and highlight if found
					var mqp = body.match(/(?![\r\n]\s*?)(memoq\s+?project\s*?:\s*?)(.+?)((\r|\n|\r\n|<\s*?br\s*?\/?\s*?>)+)/im);
					if (mqp !== null) {
						body = body.replace(/(?![\r\n]\s*?)(memoq\s+?project\s*?:\s*?)(.+?)((\r|\n|\r\n|<\s*?br\s*?\/?\s*?>)+)/im, '<strong><span style="color:' + highColor + ';background-color:' + highBColor + ';">$1$2</span></strong>$3');
					}
					var mqf = body.match(/(?![\r\n]\s*?)(file(s)?\s*?(\s*?\(\d+?\))?:\s*?)(.+?)((\r|\n|\r\n|<\s*?br\s*?\/?\s*?>){2,}|<\s*?br\s*?\/?\s*?>(?=memoq\s+?project))/im);
					if (mqf !== null) {
						body = body.replace(/(?![\r\n]\s*?)(file(s)?\s*?(\s*?\(\d+?\))?:\s*?)(.+?)((\r|\n|\r\n|<\s*?br\s*?\/?\s*?>){2,}|<\s*?br\s*?\/?\s*?>(?=memoq\s+?project))/im, '<strong><span style="color:' + highColor + ';background-color:' + highBColor + ';">$1$4</span></strong>$5');
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
		console.log("iframe found: " + iframe);
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