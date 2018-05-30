// PlunetHelper, version 1.0
// (C) 2018 Michael K. Schmidt
//
// define helpers to determine DST
Date.prototype.stdTimezoneOffset = function () {
    var jan = new Date(this.getFullYear(), 0, 1);
    var jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}
Date.prototype.isDstObserved = function () {
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
}
// look for the CC field and if found then add Coordination
var cc = document.querySelector('[id^="ATagBox05CC"]');
var ccSelect = cc.getElementsByClassName('selectWrapper');
if (ccSelect.length > 0) {
    ccSelect = ccSelect[0].getElementsByClassName('ng-non-bindable');
    if (ccSelect.length > 0) {
        ccSelect = ccSelect[0];
        ccSelect.innerHTML = '<option id="ATagBox07#' + ccSelect.getAttribute('name') + '#Q29vcmRpbmF0aW9uIFRlYW0gIDxjb29yZGluYXRpb25AYWx0YWdyYW0uY29tPg==" value="Q29vcmRpbmF0aW9uIFRlYW0gIDxjb29yZGluYXRpb25AYWx0YWdyYW0uY29tPg==" selected="selected">coordination@altagram.com</option>';
    }
}
var ccFakeSelect = cc.getElementsByClassName('ellipsis');
if (ccFakeSelect.length > 0) {
    ccFakeSelect = ccFakeSelect[0];
    ccFakeSelect.innerHTML = '<span title="coordination@altagram.com <coordination@altagram.com>">coordination@altagram.com</span><div class="icon-cross-small deleteButton"></div><div class="icon-cross-small deleteButtonHover"></div>';
    ccFakeSelect.classList.remove('hinweistext');
    ccFakeSelect.classList.add('selectedTag');
}
// check if DST is on, and if so, fix the "CET" indicator
var today = new Date();
if (today.isDstObserved()) {
    var tags = document.getElementsByTagName('textarea');
    for (var i = 0; i < tags.length; i++) {
        if (tags[i].innerHTML.match(/\b(\d{1,2}:\d\d)\sCET\b/i) !== null) {
            tags[i].innerHTML = tags[i].innerHTML.replace(/\b(\d{1,2}:\d\d)\sCET\b/i, '$1 CEST');
            break;
        }
    }
}