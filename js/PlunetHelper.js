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
chrome.storage.local.get(null, function(settings) {
    if (!chrome.runtime.error) {
        //console.log(settings);
        var addCC = (settings.addCC == undefined ? true : settings.addCC);
        var dSTfix = (settings.dSTfix == undefined ? true : settings.dSTfix);
        var makeBold = (settings.makeBold == undefined ? true : settings.makeBold);
        var makeImportant = (settings.makeImportant == undefined ? true : settings.makeImportant);
        var makeHighlighted = (settings.makeHighlighted == undefined ? true : settings.makeHighlighted);
        var cleanUp = (settings.cleanUp == undefined ? true : settings.cleanUp);
        var swapMQ = (settings.swapMQ == undefined ? true : settings.swapMQ);
        var highlightMQ = (settings.highlightMQ == undefined ? true : settings.highlightMQ);
        var highColor = (settings.highColor == undefined ? "#000000" : settings.highColor);
        var highBColor = (settings.highBColor == undefined ? "#ffff99" : settings.highBColor);
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
            //console.log('before: ' + tags[i].textContent);
            if (dSTfix) {
                // check if DST is on, and if so, fix the "CET" indicator
                var today = new Date();
                if (today.isDstObserved()) {
                    if (tags[i].textContent.match(/\b(\d{1,2}:\d\d)\sCET\b/) !== null) {
                        tags[i].textContent = tags[i].textContent.replace(/\b(\d{1,2}:\d\d)\sCET\b/g, '$1 CEST');
                    }
                }
            }
            if (swapMQ) { // look if file(s) info precedes memoq project name, and flip them
                var turned = tags[i].textContent.match(/(file(s)?\s*(\s*\(\d+\))?:\s*)(.+?)(memoq\s+project\s*:\s*)(.+?)(\r|\n|\r\n|<\s*br\s*\/?\s*>)+/sim);
                if (turned !== null) {
                    tags[i].textContent = tags[i].textContent.replace(/(file(s)?\s*(\s*\(\d+\))?:\s*)(.+?)(memoq\s+project\s*:\s*)(.+?)(\r|\n|\r\n|<\s*br\s*\/?\s*>)+/sim, '$5 $6<br/>$1$4<br/>');
                }
            }
            if (highlightMQ) { // look for memoQ project name and file(s) list info, and highlight if found
                var mqp = tags[i].textContent.match(/(?![\r\n]\s*?)(memoq\s+?project\s*?:\s*?)(.+?)(\r|\n|\r\n|<\s*br\s*\/?\s*>)+/ism);
                if (mqp !== null) {
                    tags[i].textContent = tags[i].textContent.replace(/(?![\r\n]\s*?)(memoq\s+?project\s*?:\s*?)(.+?)(\r|\n|\r\n|<\s*br\s*\/?\s*>)+/ism, '<strong><span style="color:' + highColor + ';background-color:' + highBColor + ';">$1$2</span></strong><br/>');
                }
                var mqf = tags[i].textContent.match(/(?![\r\n]\s*?)(file(s)?\s*?(\s*?\(\d+?\))?:\s*?)(.+?)((\r|\n|\r\n|<\s*br\s*\/?\s*>){2,}|(?=memoq\s+?project))/ism);
                if (mqf !== null) {
                    tags[i].textContent = tags[i].textContent.replace(/(?![\r\n]\s*?)(file(s)?\s*?(\s*?\(\d+?\))?:\s*?)(.+?)((\r|\n|\r\n|<\s*br\s*\/?\s*>){2,}|(?=memoq\s+?project))/ism, '<strong><span style="color:' + highColor + ';background-color:' + highBColor + ';">$1$4</span></strong><br/><br/>');
                }
            }
            if (cleanUp) { // get rid of unnecessary linebreaks
                if (tags[i].textContent.match(/(<div><span[^>]*>\s*?<\/span><\/div>\s*)+/gi) !== null) {
                    tags[i].textContent = tags[i].textContent.replace(/(<div><span[^>]*>\s*?<\/span><\/div>\s*)+/gi, '$1');
                }
                if (tags[i].textContent.match(/<div>\s*?<\/div>(<br\/>)*/gi) !== null) {
                    tags[i].textContent = tags[i].textContent.replace(/<div>\s*?<\/div>(<br\/>)*/gi, '');
                }
                if (tags[i].textContent.match(/(<div>)(<br\s*\/>)(<span[^>]*>.*?<\/span><\/div>\s*)/gis) !== null) {
                    tags[i].textContent = tags[i].textContent.replace(/(<div>)(<br\s*\/>)(<span[^>]*>.*?<\/span><\/div>\s*)/gis, '$1$3');
                }
                if (tags[i].textContent.match(/(\/span><\/strong><br\/>)(<br\/>)(\s*<\/span>\s*<\/div>\s*<div>\s*<p>\s*<span)/gis) !== null) {
                    tags[i].textContent = tags[i].textContent.replace(/(\/span><\/strong><br\/>)(<br\/>)(\s*<\/span>\s*<\/div>\s*<div>\s*<p>\s*<span)/gis, '$1$3');
                }
            }
            if (makeBold) { // look for *bold* shortcuts and format as <strong>bold</strong>
                if (tags[i].textContent.match(/\*+([^<>]+?)\*+/gism) !== null) {
                    tags[i].textContent = tags[i].textContent.replace(/\*+([^<>]+?)\*+/gism, '<strong>$1</strong>');
                }
            }
            if (makeImportant) { // look for §important§ shortcuts and format as <strong style="color:red;">important</strong>
                if (tags[i].textContent.match(/\§+([^<>]+?)\§+/gism) !== null) {
                    tags[i].textContent = tags[i].textContent.replace(/\§+([^<>]+?)\§+/gism, '<strong><span style="color:#ff0000;">$1</span></strong>');
                }
            }
            if (makeHighlighted) { // look for #highlighting# shortcuts and format accordingly
                if (tags[i].textContent.match(/\~+([^<>]+?)\~+/gism) !== null) {
                    tags[i].textContent = tags[i].textContent.replace(/\~+([^<>]+?)\~+/gism, '<span style="color:' + highColor + ';background-color:' + highBColor + ';">$1</span>');
                }
            }
            //console.log('after: ' + tags[i].textContent);
        }
    }
});