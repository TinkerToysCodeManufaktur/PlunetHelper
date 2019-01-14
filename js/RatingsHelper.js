// RatingsHelper
// (C) 2019 Michael K. Schmidt
//
function addRatings(divid) {

}
// entry point is here
var joblist = document.getElementsByID('outJobListAjxHdlrId');
if (typeof joblist != 'undefined') {
	var divtype = joblist[0].getAttribute('ajax-container');
	console.log("joblist div type: " + divtype);
	// set up a mutation observer
	var observer = new MutationObserver(function (mutations, me) {
		var joblist = document.getElementsByID('outJobListAjxHdlrId');
		if (joblist) {
			var doc = (joblist.contentDocument ? joblist.contentDocument : joblist.contentWindow.document);
			if (doc.readyState == "complete") {
				console.log("joblist div is fully loaded, calling the update function directly");
				addRatings('outJobListAjxHdlrId');
			} else {
				console.log("joblist div is NOT fully loaded, adding the update function as event listener");
				joblist.onload = addRatings('outJobListAjxHdlrId');
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
	console.log("no joblist area found, aborting mission!");
}
console.log("end of injected JS code reached");