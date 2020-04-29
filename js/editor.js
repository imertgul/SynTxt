$(function () { // init lined textarea
    $("#m-editor").linedtextarea();
});

// Prevents the buttons from grabbing the focus
$('.editor-btn').on("mousedown",
    function (event) {
        event.preventDefault()
    }
)

let editor = document.querySelector("#m-editor")

$("#m-editor").on("change", function () {
    // console.log("change");
})

$("#m-editor").on("textInput", function () {
    // console.log("textinput");
})

$("#m-editor").on("input", function () {
    // console.log("input");
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
    toggleLink(image = true)
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
                toggleLink(image = true)
                break;
        }
    }
});


function toggleHeading(placeholder = "") {
    let selection_start = editor.selectionStart
    let selection_end = editor.selectionEnd
    let target = parseTargetValue(selection_start, selection_end)

    let new_heading = (target.heading_size == 0 ? "#".repeat(2) : "#".repeat(target.heading_size - 1))
    let selection_offset = (target.heading_size == 0 ? 2 : -1)

    let white_space = (new_heading.length == 0 ? "" : " ")
    selection_offset += white_space.length + target.heading_size - target.offset_in_selected

    let new_value = new_heading + white_space + target.value.split("#").join("").split(" ").join("")

    if (checkPrevLineBreak(selection_start, "#")) {
        selection_offset += 1
        new_value = "\n" + new_value
    }

    if (checkNextLineBreak(selection_end)) {
        new_value += "\n"
    }

    let value_before_target = editor.value.substring(0, selection_start - target.offset_in_selected)
    let value_after_target = editor.value.substring(selection_end, editor.value.length)
    editor.value = value_before_target + new_value + value_after_target
    setSelectionPositions(selection_start + selection_offset, selection_end + selection_offset)
}

function parseTargetValue(selection_start, selection_end) {
    let heading_size = 0
    let i
    for (i = 0; i < selection_end - selection_start; i++) {
        characterInTarget = editor.value.substring(selection_start + i, selection_start + i + 1)
        if (characterInTarget == "#") {
            heading_size++
        } else {
            break
        }
    }
    let j = 0
    while (true) {
        characterBeforeTarget = editor.value.substring(selection_start - j - 1, selection_start - j)
        if (characterBeforeTarget == "#") {
            heading_size++
        }
        else if (characterBeforeTarget != " ") {
            break
        }
        j++
    }
    let value = editor.value.substring(selection_start - j, selection_end)

    return { "value": value, "heading_size": heading_size, "offset_before_selected": i, "offset_in_selected": j }
}

function checkPrevLineBreak(selection_start, tag) {
    let i = 1
    let value
    while (true) {
        value = editor.value.substring(selection_start - i, selection_start - i + 1)
        if (value == "\n" || value == "") {
            break
        }
        else if (value != " " && value != tag) {
            return true
        }
        i++
    }
    return false
}

function checkNextLineBreak(selection_end) {
    let i = 1
    let break_next = false
    let value
    while (true) {
        value = editor.value.substring(selection_end + i - 1, selection_end + i)
        if (value == "\n") {
            break
        }
        else if (value == "") {
            break
        }
        else if (value != " " || value != "#") {
            break_next = true
            break
        }
        a++
    }
    return break_next
}

function toggleTextStyle(start_tag = "", end_tag = "", placeholder = "") {
    let selection_start = editor.selectionStart
    let selection_end = editor.selectionEnd

    let value = editor.value
    let selected_value = value.substring(selection_start, selection_end)
    let before_selected_value = value.substring(0, selection_start)
    let after_selected_value = value.substring(selection_end, value.length)

    // TO CHECK WHETHER SELECTED VALUE IS TAGGED
    let prefix = before_selected_value.substring(before_selected_value.length - start_tag.length)
    let suffix = after_selected_value.substring(0, end_tag.length)


    if (selected_value == "") {
        replace_value = start_tag + placeholder + end_tag
        selection_start += start_tag.length
        selection_end += start_tag.length + placeholder.length
    }
    else if (prefix == start_tag && suffix == end_tag) { // SELECTED VALUE IS TAGGED
        before_selected_value = before_selected_value.substring(0, before_selected_value.length - start_tag.length)
        after_selected_value = after_selected_value.substring(end_tag.length)
        replace_value = selected_value
        selection_start -= start_tag.length
        selection_end -= start_tag.length
    }
    else { // SELECTED VALUE IS NOT TAGGED
        replace_value = start_tag + selected_value + end_tag
        selection_start += start_tag.length
        selection_end += start_tag.length
    }

    editor.value = before_selected_value + replace_value + after_selected_value
    setSelectionPositions(selection_start, selection_end)
}

function toggleLink(image = false) {
    let selection_start = editor.selectionStart
    let selection_end = editor.selectionEnd
    let value = editor.value
    let value_before_selected = value.substring(0, selection_start)
    let value_after_selected = value.substring(selection_end, value.length)
    let selected_value = value.substring(selection_start, selection_end)
    let new_value
    let new_selection_start
    let new_selection_end

    if (selected_value == "") {
        if (image) {
            new_value = "![enter image description here](enter image link here)"
            new_selection_start = selection_start + 2
            new_selection_end = selection_end + 30
        } else {
            new_value = "[enter link description here](enter link here)"
            new_selection_start = selection_start + 1
            new_selection_end = selection_end + 28
        }
    }

    else {
        let re_one = /!?\[{1}/g // öncesi
        let re_two = /.*\]{1}\({1}.*\)/g // sonrası
        let re_three = /!{1}\[{1}.*\]{1}\({1}.*\)/g // tüm image
        let re_four = /\[{1}[^\[]*\]{1}\({1}.*\)/g // tüm link

        let re_one_result = re_one.exec(value_before_selected)
        let re_two_result = re_two.exec(value_after_selected)
        let re_three_result = re_three.exec(selected_value)
        let re_four_result = re_four.exec(selected_value)

        // içerdeki bir değer seçiliyse re_one'a ve re_two'ya bakıcaz
        if (re_one_result && re_two_result) {
            value_before_selected = value.substring(0, re_one_result.index)
            value_after_selected = value.substring(selection_end + re_two_result[0].length, value.length)

            new_value = selected_value
            new_selection_start = value_before_selected.length
            new_selection_end = value_before_selected.length + selected_value.length
        }

        // tüm değer seçiliyse
        else {
            //image
            if (re_three_result && re_three_result.index == 0) {
                substring_start = re_three_result[0].indexOf("[")
                substring_end = re_three_result[0].indexOf("]")

                new_value = re_three_result[0].substring(substring_start + 1, substring_end)
                new_selection_start = value_before_selected.length
                new_selection_end = value_before_selected.length + new_value.length
            }
            //link
            else if (re_four_result && re_four_result.index == 0) {
                substring_start = re_four_result[0].indexOf("[")
                substring_end = re_four_result[0].indexOf("]")

                new_value = re_four_result[0].substring(substring_start + 1, substring_end)
                new_selection_start = value_before_selected.length
                new_selection_end = value_before_selected.length + new_value.length
            }

            else {
                if (image) {
                    new_value = "![" + selected_value + "](enter image link here)"
                    new_selection_start = selection_start + 2
                    new_selection_end = selection_start + selected_value.length + 2
                } else {
                    new_value = "[" + selected_value + "](enter link here)"
                    new_selection_start = selection_start + 1
                    new_selection_end = selection_start + selected_value.length + 1
                }
            }
        }
    }

    editor.value = value_before_selected + new_value + value_after_selected
    setSelectionPositions(new_selection_start, new_selection_end)
}

function toggleBlockQuote() {
    let selection_start = editor.selectionStart
    let selection_end = editor.selectionEnd
    let value = editor.value
    let selected_value = value.substring(selection_start, selection_end)
    let value_before_selected = value.substring(0, selection_start)
    let value_after_selected = value.substring(selection_end, value.length)
    let new_value
    let new_selection_start
    let new_selection_end
    let break_prev = checkPrevLineBreak(selection_start, ">")
    let break_next = checkNextLineBreak(selection_end)



    if (selected_value == "") {
        new_value = "> blockquote"
        new_selection_start = selection_start + 2
        new_selection_end = selection_end + 12

    } else {
        // Kendisinde tag var mı?
        if (selected_value[0] == ">") {
            new_value = selected_value.slice(1)
            new_selection_start = selection_start
            new_selection_end = selection_end - 1

        }
        else {
            // öncesinde tag var mı?
            let result = checkTag(selection_start, selection_end, ">")
            if (result.isTagged) {
                value_before_tag = value_before_selected.substring(0, selection_start - result.offset)
                value_after_tag = value_before_selected.substring(selection_start - result.offset + 1, selection_start)
                value_before_selected = value_before_tag + value_after_tag
                new_value = selected_value
                offset = result.offset == 1 ? 2 : result.offset
                new_selection_start = selection_start - offset + 1
                new_selection_end = selection_end - offset + 1

            } else {
                new_value = "> " + selected_value
                new_selection_start = selection_start + 2
                new_selection_end = selection_end + 2

            }
        }
    }


    if (break_prev) {
        new_value = "\n" + new_value
        new_selection_start += 1
        new_selection_end += 1

    }

    if (break_next) { new_value = new_value + "\n" }

    editor.value = value_before_selected + new_value + value_after_selected

    setSelectionPositions(new_selection_start, new_selection_end)

}

function checkTag(start, end, tag) {
    let i = 1
    let tagged = false
    let value
    while (true) {
        value = editor.value.substring(start - i, start - i + 1)
        if (value == "\n" || value == "") {
            break
        }
        else if (value == tag) {
            tagged = true
            break
        }
        else if (value != " ") {
            break
        }
        i++
    }
    return { 'isTagged': tagged, 'offset': i }
}

function insertTable() {
    let selection_start = editor.selectionStart
    let selection_end = editor.selectionEnd

    let value = editor.value
    let before_selection_start = value.substring(0, selection_start)
    let after_selection_start = value.substring(selection_start, value.length)

    let col_num = prompt("Columns:");
    let row_num = prompt("Rows:");

    let th = "\n" + "|      ".repeat(col_num) + "|\n"
    let hr = "|------".repeat(col_num) + "|\n"
    let rows = ("|      ".repeat(col_num) + "|\n").repeat(row_num)
    selection_start += 2
    selection_end = selection_start

    editor.value = before_selection_start + th + hr + rows + after_selection_start
    setSelectionPositions(selection_start, selection_end)
}


function setSelectionPositions(selection_start, selection_end) {
    editor.selectionStart = selection_start
    editor.selectionEnd = selection_end
}


function makeUList() {
    let selection_start = editor.selectionStart
    let selection_end = editor.selectionEnd
    let value = editor.value
    let lines = editor.value.substr(0, editor.value.length).split("\n")
    let selected_value = value.substring(selection_start, selection_end)
    let value_before_selected = value.substring(0, selection_start)
    let value_after_selected = value.substring(selection_end, value.length)
    let break_prev = checkPrevLineBreak(selection_start, " ")
    let break_next = checkNextLineBreak(selection_end)
    let result = testForList()

    if (result.length) {
        for (let i = 0; i < result.length; i++) {
            if (result[i].type == 'cList') {
                lines[result[i].line] = lines[result[i].line].slice(7)
                lines[result[i].line] = " - " + lines[result[i].line]
            }
            else if (result[i].type == 'oList') {
                lines[result[i].line] = lines[result[i].line].slice(lines[result[i].line].indexOf(".") + 1)
                lines[result[i].line] = " -" + lines[result[i].line]
            }
        }
        editor.value = lines.join("\n")
        return
    }
    
    if(selected_value == "") {
        replace_value = " - List Item"
        selection_start += 3
        selection_end += 12
    }
    else{
        replace_value = " - " + selected_value
        selection_start += 3
        selection_end += 3
    }

    if (break_prev) {
        replace_value = "\n" + replace_value
        selection_start += 1
        selection_end += 1
    }
    if (break_next) { replace_value += "\n" }

    editor.value = value_before_selected + replace_value + value_after_selected
    setSelectionPositions(selection_start, selection_end)
}


function makeOList() {
    let selection_start = editor.selectionStart
    let selection_end = editor.selectionEnd
    let value = editor.value
    let lines = editor.value.substr(0, editor.value.length).split("\n")
    let selected_value = value.substring(selection_start, selection_end)
    let value_before_selected = value.substring(0, selection_start)
    let value_after_selected = value.substring(selection_end, value.length)
    let break_prev = checkPrevLineBreak(selection_start, " ")
    let break_next = checkNextLineBreak(selection_end)
    let result = testForList()

    if (result.length) {
        result.sort((a, b) => (a.line > b.line) ? 1 : -1)

        for (let i = 0; i < result.length; i++) {
            if (result[i].type == 'cList') {
                lines[result[i].line] = lines[result[i].line].slice(7)
                lines[result[i].line] = " " + (i+1).toString() + ". " +lines[result[i].line]
            }
            else if (result[i].type == 'oList') {
                lines[result[i].line] = lines[result[i].line].slice(lines[result[i].line].indexOf(".") + 1)
                lines[result[i].line] = " " + (i + 1).toString() + "." + lines[result[i].line]
            }
            else{
                lines[result[i].line] = lines[result[i].line].slice(3)
                lines[result[i].line] = " " + (i + 1).toString() + ". " + lines[result[i].line]
            }
        }
        editor.value = lines.join("\n")
        return
    }

    if (selected_value == "") {
        replace_value = " 1. List Item"
        selection_start += 4
        selection_end += 13
    }
    else {
        replace_value = " 1. " + selected_value
        selection_start += 4
        selection_end += 4
    }

    if (break_prev) {
        replace_value = "\n" + replace_value
        selection_start += 1
        selection_end += 1
    }
    if (break_next) { replace_value += "\n" }

    editor.value = value_before_selected + replace_value + value_after_selected
    setSelectionPositions(selection_start, selection_end)
}

function makeCList() {
    let selection_start = editor.selectionStart
    let selection_end = editor.selectionEnd
    let value = editor.value
    let lines = editor.value.substr(0, editor.value.length).split("\n")
    let selected_value = value.substring(selection_start, selection_end)
    let value_before_selected = value.substring(0, selection_start)
    let value_after_selected = value.substring(selection_end, value.length)
    let break_prev = checkPrevLineBreak(selection_start, " ")
    let break_next = checkNextLineBreak(selection_end)
    let result = testForList()

    if (result.length) {
        for (let i = 0; i < result.length; i++) {
            if (result[i].type == 'uList') {
                lines[result[i].line] = lines[result[i].line].slice(3)
                lines[result[i].line] = " - [ ] " + lines[result[i].line]
            }
            else if (result[i].type == 'oList') {
                lines[result[i].line] = lines[result[i].line].slice(lines[result[i].line].indexOf(".") + 1)
                lines[result[i].line] = " - [ ]" + lines[result[i].line]
            }
        }
        editor.value = lines.join("\n")
        return
    }

    if (selected_value == "") {
        replace_value = " - [ ] List Item"
        selection_start += 7
        selection_end += 16
    }
    else {
        replace_value = " - [ ] " + selected_value
        selection_start += 7
        selection_end += 7
    }

    if (break_prev) {
        replace_value = "\n" + replace_value
        selection_start += 1
        selection_end += 1
    }
    if (break_next) { replace_value += "\n" }

    editor.value = value_before_selected + replace_value + value_after_selected
    setSelectionPositions(selection_start, selection_end)
}

function testForList() {
    var lines_before_current = editor.value.substr(0, editor.selectionStart).split("\n")
    var lines_after_current = editor.value.substr(editor.selectionStart, editor.value.length).split("\n").slice(1)
    var test_results = []
    

    for (let i = lines_before_current.length - 1; i >= 0; i--) {
        if (isCheckItem(lines_before_current[i])) {
            test_results.push({ 'line': i, 'type': 'cList' })
            continue
        }
        if (isOrderedItem(lines_before_current[i])) {
            test_results.push({ 'line': i, 'type': 'oList' })
            continue
        }
        if (isUnorderedItem(lines_before_current[i])) {
            test_results.push({ 'line': i, 'type': 'uList' })
            continue
        }
        break
    }

    for (let i = 0; i < lines_after_current.length; i++) {
        if (isCheckItem(lines_after_current[i])) {
            test_results.push({ 'line': i + lines_before_current.length, 'type': 'cList' })
            continue
        }
        if (isOrderedItem(lines_after_current[i])) {
            test_results.push({ 'line': i + lines_before_current.length, 'type': 'oList' })
            continue
        }
        if (isUnorderedItem(lines_after_current[i])) {
            test_results.push({ 'line': i + lines_before_current.length, 'type': 'uList' })
            continue
        }
        break
    }
    return test_results
}

function isUnorderedItem(text) {
    return text.startsWith(" - ")
}

function isCheckItem(text) {
    return text.startsWith(" - [")
}

function isOrderedItem(text) {
    let dot_index = text.indexOf(".")
    if (dot_index != -1 && text.startsWith(" ")) {
        if (Number.isInteger(Number(text.substr(1, dot_index)))){
            return true
        }
    }
    return false
}