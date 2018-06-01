// PlunetHelper
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
// read settings from local storage
var addCC = (localStorage["addCC"] == undefined ? true : (localStorage["addCC"] == 'true'));
var dSTfix = (localStorage["dSTfix"] == undefined ? true : (localStorage["dSTfix"] == 'true'));
var makeBold = (localStorage["makeBold"] == undefined ? true : (localStorage["makeBold"] == 'true'));
var makeImportant = (localStorage["makeImportant"] == undefined ? true : (localStorage["makeImportant"] == 'true'));
var makeHighlighted = (localStorage["makeHighlighted"] == undefined ? true : (localStorage["makeHighlighted"] == 'true'));
var cleanUp = (localStorage["cleanUp"] == undefined ? true : (localStorage["cleanUp"] == 'true'));
var swapMQ = (localStorage["swapMQ"] == undefined ? true : (localStorage["swapMQ"] == 'true'));
var highlightMQ = (localStorage["highlightMQ"] == undefined ? true : (localStorage["highlightMQ"] == 'true'));
var highColor = (localStorage["highColor"] == undefined ? "#000000" : localStorage["highColor"]);
var highBColor = (localStorage["highBColor"] == undefined ? "#ffff99" : localStorage["highBColor"]);
if (addCC) {
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
}
// prettyfy/enhance the mail body text
var tags = document.getElementsByTagName('textarea');
for (var i = 0; i < tags.length; i++) {
    if (dSTfix) {
        // check if DST is on, and if so, fix the "CET" indicator
        var today = new Date();
        if (today.isDstObserved()) {
            if (tags[i].innerHTML.match(/\b(\d{1,2}:\d\d)\sCET\b/i) !== null) {
                tags[i].innerHTML = tags[i].innerHTML.replace(/\b(\d{1,2}:\d\d)\sCET\b/ig, '$1 CEST');
            }
        }
    }
    if (swapMQ) { // look if file(s) info precedes memoq project name, and flip them
        var turned = tags[i].innerHTML.match(/(?![\r\n]\s*?)(file(s)?\s*?(\s*?\(\d+?\))?:\s*?)([^<>]+?)(\s*?)(memoq\s+?project\s*?:\s*?)([^<>]+?)(\s*?[\r\n])/gism);
        if (turned !== null) {
            //tags[i].innerHTML = tags[i].innerHTML.replace(/(?![\r\n]\s*?)(file(s)?\s*?(\s*?\(\d+?\))?:\s*?)([^<>]+?)(\s*?)(memoq\s+?project\s*?:\s*?)([^<>]+?)(\s*?[\r\n])/gism, '$6$7$8$1$4');
        }
    }
    if (highlightMQ) { // look for memoQ project name and file(s) list info, and highlight if found
        var mqp = tags[i].innerHTML.match(/(?![\r\n]\s*?)(memoq\s+?project\s*?:\s*?)([^<>]+?)(\s*?[\r\n])/is);
        if (mqp !== null) {
            tags[i].innerHTML = tags[i].innerHTML.replace(/(?![\r\n]\s*?)(memoq\s+?project\s*?:\s*?)([^<>]+?)(\s*?[\r\n])/is, '<strong><span style="color:' + highColor + ';background-color:' + highBColor + ';">$1$2</span></strong>$3');
        }
        var mqf = tags[i].innerHTML.match(/(?![\r\n]\s*?)(file(s)?\s*?(\s*?\(\d+?\))?:\s*?)([^<>]+?)(\s*?[\r\n][\r\n])/is);
        if (mqf !== null) {
            tags[i].innerHTML = tags[i].innerHTML.replace(/(?![\r\n]\s*?)(file(s)?\s*?(\s*?\(\d+?\))?:\s*?)([^<>]+?)(\s*?[\r\n][\r\n])/is, '<strong><span style="color:' + highColor + ';background-color:' + highBColor + ';>$1$4</span></strong>$5');
        }
    }
    if (cleanUp) { // get rid of unnecessary linebreaks
        if (tags[i].innerHTML.match(/&lt;div&gt;&lt;span[^&]*?&gt;&lt;\/span&gt;&lt;\/div&gt;/gism) !== null) {
            tags[i].innerHTML = tags[i].innerHTML.replace(/&lt;div&gt;&lt;span[^&]*?&gt;&lt;\/span&gt;&lt;\/div&gt;/gism, '');
        }
    }
    if (makeBold) { // look for *bold* shortcuts and format as <strong>bold</strong>
        if (tags[i].innerHTML.match(/\*([^<>]+?)\*/gism) !== null) {
            tags[i].innerHTML = tags[i].innerHTML.replace(/\*([^<>]+?)\*/gism, '<strong>$1</strong>');
        }
    }
    if (makeImportant) { // look for §important§ shortcuts and format as <strong style="color:red;">important</strong>
        if (tags[i].innerHTML.match(/\§([^<>]+?)\§/gism) !== null) {
            tags[i].innerHTML = tags[i].innerHTML.replace(/\§([^<>]+?)\§/gism, '<strong><span style="color:#ff0000;">$1</span></strong>');
        }
    }
    if (makeHighlighted) { // look for #highlighting# shortcuts and format accordingly
        if (tags[i].innerHTML.match(/\~([^<>]+?)\~/gism) !== null) {
            tags[i].innerHTML = tags[i].innerHTML.replace(/\~([^<>]+?)\~/gism, '<strong><span style="color:' + highColor + ';background-color:' + highBColor + ';">$1</span></strong>');
        }
    }
}