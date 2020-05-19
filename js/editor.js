$(document).ready(function () {
    updatePreview()
});

$(function () { // init lined textarea
    $("#m-editor").linedtextarea();
});

// Prevents the buttons from grabbing the focus
$('.editor-btn').on("mousedown",
    function (event) {
        event.preventDefault()
        editor.focus()
    }
)

let editor = document.querySelector("#m-editor")
let history = window.UndoRedojs(3);

var MarkdownIt = require('markdown-it')
md = new MarkdownIt();

$("#m-editor").on("input", function (e) {
    let previous_lines = getAllLines(history.undo())
    let current_lines = getAllLines()
    
    if (previous_lines.length == current_lines){
        pushLine(getCurrentLineNumber(), getCurrentLine())
    }
    else {
        pushText(roomNumber = -1)
    }
    // Check if the new textarea value is different
    if (history.current() !== editor.value) {
        // Check for pastes, auto corrects..
        if ((editor.value.length - history.current().length) > 1 || (editor.value.length - history.current().length) < -1 || (editor.value.length - history.current().length) === 0) {
            // Record the textarea value and force to bypass cooldown
            history.record(editor.value, true);
            // Check for single key press, single chacacter paste..
        } else {
            // Record the textarea value
            history.record(editor.value);
        }
    }
})

setTimeout(() => {
    if (editor.value) history.record(editor.value, true);
}, 100);

$("#m-editor").on("keydown click focus", function () {
    if (cursorPostionChanged()) {
        updateLineInfo()
    }
})

$("#bold").click(function () {
    toggleTextStyle(start_tag = "**", end_tag = "**", placeholder = "bold text")
    $("#m-editor").trigger("input")
});

$("#italic").click(function () {
    toggleTextStyle(start_tag = "*", end_tag = "*", placeholder = "italic text")
    $("#m-editor").trigger("input")
});

$("#sThrough").click(function () {
    toggleTextStyle(start_tag = "~~", end_tag = "~~", placeholder = "strikethrough")
    $("#m-editor").trigger("input")
});

$("#heading").click(function () {
    toggleHeading(placeholder = "Heading")
    $("#m-editor").trigger("input")
});

$("#link").click(function () {
    toggleLink()
    $("#m-editor").trigger("input")
});

$("#img").click(function () {
    toggleImage()
    $("#m-editor").trigger("input")
});

$("#code").click(function () {
    toggleCode()
    $("#m-editor").trigger("input")
});

$("#bQuote").click(function () {
    toggleBlockQuote()
    $("#m-editor").trigger("input")
});

$('#table').click(function () {
    insertTable()
    $("#m-editor").trigger("input")
})

$("#uList").click(function () {
    makeUList()
    $("#m-editor").trigger("input")
})

$("#cList").click(function () {
    makeCList()
    $("#m-editor").trigger("input")
})

$("#oList").click(function () {
    makeOList()
    $("#m-editor").trigger("input")
})


$("#m-editor").keydown(function (e) {
    if (e.ctrlKey && e.shiftKey) {
        editor.focus()
        switch (e.which) {
            case 66: // Ctrl + Shift + B => toggles bold text style
                toggleTextStyle(start_tag = "**", end_tag = "**", placeholder = "bold text")
                break;
            case 73: // Ctrl + Shift + I => toggles italic text style
                toggleTextStyle(start_tag = "*", end_tag = "*", placeholder = "italic text")
                break;
            case 72: // Ctrl + Shift + H => toggles heading
                // console.log("Toggle Heading");
                break;
            case 83: // Ctrl + Shift + S => toggles strikethrough text style
                toggleTextStyle(start_tag = "~~", end_tag = "~~", placeholder = "strikethrough text")
                break;
            case 85: // Ctrl + Shift + U => toggles unordered list
                makeUList()
                break;
            case 79: // Ctrl + Shift + O => toggles ordered list
                makeOList()
                break;
            case 67: // Ctrl + Shift + C => toggles check list
                makeCList()
                break;
            case 81: // Ctrl + Shift + Q => toggles blockquote
                toggleBlockQuote()
                break;
            case 75: // Ctrl + Shift + K => toggles code
                toggleCode()
                break;
            case 84: // Ctrl + Shift + T => toggles table
                insertTable()
                break;
            case 76: // Ctrl + Shift + L => toggles link
                toggleLink();
                break;
            case 71: // Ctrl + Shift + G => toggles image
                toggleImage();
                break;
        }
    }
    else if (!e.ctrlKey && !e.altKey && e.which == 13){
        editor.focus()
        let selected_value = editor.value.substring(editor.selectionStart, editor.selectionEnd)

        if (selected_value == "") {
            let curr_line = getCurrentLine()
            if (isEmptyListItem(curr_line)) {
                e.preventDefault()
                deleteCurrentLine()
            }
            else if (isCheckItem(curr_line)) {
                e.preventDefault()
                insertAtNewLine(" - [ ] ")
            }
            else if (isOrderedItem(curr_line)) {
                e.preventDefault()
                insertAtNewLine(" 1. ")
            }
            else if (isUnorderedItem(curr_line)) {
                e.preventDefault()
                insertAtNewLine(" - ")
            }
        }
    }
    else if (!e.ctrlKey && !e.altKey && e.which == 9 && $("#m-editor").is(":focus")) {
        e.preventDefault()
        var selection_start = editor.selectionStart;
        var selection_end = editor.selectionEnd;
        editor.value = editor.value.substring(0, selection_start) + "\t" + editor.value.substring(selection_end)
        editor.selectionStart = selection_start + 1
        editor.selectionEnd = selection_end + 1;
    }
    else if (e.ctrlKey && !e.altKey && !e.shiftKey && e.which == 90){ // undo
        e.preventDefault()
        if (history.undo(true) !== undefined) {
            editor.value = history.undo();
        }
    }
    else if (e.ctrlKey && !e.altKey && !e.shiftKey && e.which == 89) { // redo
        e.preventDefault()
        if (history.redo(true) !== undefined) {
            editor.value = history.redo();
        }
    }
});


setInterval(function () {
    if (valueChanged()) {
        updatePreview()
    }
}, 300);