// ==UserScript==
// @name        prompts-on-chatgpt
// @match       *://chat.openai.com/chat*
// @icon        https://raw.githubusercontent.com/dsymbol/prompts-on-chatgpt/main/assets/favicon.png
// @author      dsymbol
// @run-at      document-end
// @resource    data https://raw.githubusercontent.com/dsymbol/prompts-on-chatgpt/main/prompts.json
// @resource    jquery-ui https://code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css
// @require     https://code.jquery.com/jquery-3.6.0.js
// @require     https://code.jquery.com/ui/1.13.2/jquery-ui.js
// @grant       GM_getResourceText
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// ==/UserScript==

GM_addStyle(GM_getResourceText('jquery-ui'));

var data = JSON.parse(GM_getResourceText('data'));
var prompts = Object.fromEntries(
    Object.entries(data).map(([k, v]) => ["/" + k.replaceAll(/[^a-zA-Z0-9\s]/g, "").replaceAll(" ", "_").toLowerCase(), v])
);

function split(val) {
    return val.split(/\/\s*/);
}

function extractLast(term) {
    return split(term).pop();
}

$( "textarea" )
    .bind("keydown", function (event) {
        if (event.keyCode === $.ui.keyCode.TAB && $(this).data("autocomplete").menu.active) {
            event.preventDefault();
        }
    }).autocomplete({
        minLength: 0,
        source: function (request, response) {
            var term = request.term,
                results = [];
            if (term.indexOf("/") >= 0) {
                term = extractLast(request.term);
                results = $.ui.autocomplete.filter(
                    Object.keys(prompts), term);

            }
            response(results);
        },
        open: function (event, ui) {
            var $input = $(event.target),
                $results = $input.autocomplete("widget"),
                top = $results.position().top,
                height = $results.height(),
                inputHeight = $input.height(),
                newTop = top - height - inputHeight;
            $results.css("top", newTop + "px");
        },
        focus: function () {
            return false;
        },
        select: function (event, ui) {
            ui.item.value = prompts[ui.item.value];
            this.style.height = '100px';
            var terms = split(this.value);
            terms.pop();
            terms.push(ui.item.value);
            terms.push("");
            this.value = terms.join("");
            return false;
        }
    });

$( ".ui-autocomplete" ).css({
    "overflow-y": "scroll",
    "max-height": "400px"
});