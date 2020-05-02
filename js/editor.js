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
var MarkdownIt = require('markdown-it')
md = new MarkdownIt();


// $("#m-editor").on("change", function () {
//     console.log("change");
// })

// $("#m-editor").on("textInput", function () {
//     console.log("textinput");
// })

// $("#m-editor").on("input", function () {
//     console.log("input");
// })

$("#m-editor").on("keydown click focus", function () {
    if (cursorPostionChanged()) {
        updateLineInfo()
    }
})

$("#bold").click(function () {
    toggleTextStyle(start_tag = "**", end_tag = "**", placeholder = "bold text")
});

$("#italic").click(function () {
    toggleTextStyle(start_tag = "*", end_tag = "*", placeholder = "italic text")
});

$("#sThrough").click(function () {
    toggleTextStyle(start_tag = "~~", end_tag = "~~", placeholder = "strikethrough")
});

$("#heading").click(function () {
    toggleHeading(placeholder = "Heading")
});

$("#link").click(function () {
    toggleLink()
});

$("#img").click(function () {
    toggleImage()
});

$("#code").click(function () {
    toggleCode()
});

$("#bQuote").click(function () {
    toggleBlockQuote()
});

$('#table').click(function () {
    insertTable()
})

$("#uList").click(function () {
    makeUList()
})

$("#cList").click(function () {
    makeCList()
})

$("#oList").click(function () {
    makeOList()
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
});


setInterval(function () {
    if (valueChanged()) {
        updatePreview()
    }
}, 300);