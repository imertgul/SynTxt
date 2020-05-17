function toggleTextStyle(start_tag = "", end_tag = "", placeholder = "") {
    let selection_start = editor.selectionStart
    let selection_end = editor.selectionEnd
    let selected_value = editor.value.substring(selection_start, selection_end)

    if (selected_value == "") { // THERE IS NO SELECTED VALUE
        editor.setRangeText(start_tag + placeholder + end_tag)
        editor.setSelectionRange(selection_start + start_tag.length, selection_end + start_tag.length + placeholder.length)
    }
    else {
        let prefix_before_s = editor.value.substring(selection_start - start_tag.length, selection_start)
        let suffix_before_s = editor.value.substring(selection_end, selection_end + end_tag.length)
        let prefix_in_s = selected_value.slice(0, start_tag.length)
        let suffix_in_s = selected_value.slice(selected_value.length - end_tag.length)

        if (prefix_before_s == start_tag && suffix_before_s == end_tag) { // THERE IS TAGS BEFORE SELECTED VALUE
            // editor.setRangeText(replacement, Start, End, Mode)
            editor.setRangeText(selected_value, selection_start - start_tag.length, selection_end + end_tag.length, 'select')
        }
        else if (prefix_in_s == start_tag && suffix_in_s == end_tag) { // THERE IS TAGS IN SELECTED VALUE
            editor.setRangeText(
                selected_value.slice(start_tag.length, selected_value.length - end_tag.length),
                selection_start,
                selection_end,
                'select')
        }
        else { // SELECTED VALUE IS NOT TAGGED
            editor.setRangeText(start_tag + selected_value + end_tag)
            editor.setSelectionRange(selection_start + start_tag.length, selection_end + start_tag.length)
        }
    }
}

function toggleLink() {
    let selection_start = editor.selectionStart
    let selection_end = editor.selectionEnd
    let selected_value = editor.value.substring(selection_start, selection_end)

    if (selected_value == "") {
        editor.setRangeText("[enter link description here](http://google.com/)")
        editor.setSelectionRange(selection_start + 1, selection_end + 28)
    }
    else {
        let fixes_result = checkFixesLinkTags()
        let whole_result = checkWholeTextLinkTags(selected_value)
        if (fixes_result) {
            editor.setRangeText(
                selected_value,
                selection_start - fixes_result.start_offset,
                selection_end + fixes_result.end_offset,
                'select')
        }
        else if (whole_result) {
            editor.setRangeText(
                selected_value.slice(whole_result.start, whole_result.end),
                selection_start,
                selection_end,
                'select')
        }
        else {
            editor.setRangeText("[" + selected_value + "](http://google.com/)")
            editor.setSelectionRange(selection_start + 1, selection_start + 1 + selected_value.length)
        }
    }
}

function toggleImage() {
    let selection_start = editor.selectionStart
    let selection_end = editor.selectionEnd
    let selected_value = editor.value.substring(selection_start, selection_end)

    if (selected_value == "") {
        editor.setRangeText("![enter image description here](https://i.picsum.photos/id/237/200/300.jpg)")
        editor.setSelectionRange(selection_start + 2, selection_end + 29)
    }
    else {
        let fixes_result = checkFixesLinkTags()
        let whole_result = checkWholeTextLinkTags(selected_value)
        if (fixes_result) {
            editor.setRangeText(
                selected_value,
                selection_start - fixes_result.start_offset,
                selection_end + fixes_result.end_offset,
                'select')
        }
        else if (whole_result) {
            editor.setRangeText(
                selected_value.slice(whole_result.start, whole_result.end),
                selection_start,
                selection_end,
                'select')
        }
        else {
            editor.setRangeText("![" + selected_value + "](https://i.picsum.photos/id/237/200/300.jpg)")
            editor.setSelectionRange(selection_start + 2, selection_start + 2 + selected_value.length)
        }
    }
}

function toggleHeading(placeholder = "") {
    let selection_start = editor.selectionStart
    let selection_end = editor.selectionEnd
    let selected_value = editor.value.substring(selection_start, selection_end)

    let in_string_result = checkHeadingInString(selected_value)
    let before_string_result = checkHeadingBeforeString(selection_start)
    let heading_size = in_string_result.heading + before_string_result.heading

    let offset_in = in_string_result.offset
    let offset_before = before_string_result.offset
    let offset = offset_in + offset_before

    let break_next = checkNextLineBreak(selection_end)
    let break_prev = checkPrevLineBreak(selection_start, "#")


    if (selected_value == "") {
        replacement = "## " + placeholder
        offset = 3

        if (break_prev) {
            replacement = "\n" + replacement
            offset += 1
        }
        if (break_next) { replacement += "\n" }

        editor.setRangeText(replacement)
        editor.setSelectionRange(selection_start + offset, selection_end + placeholder.length + offset)
    }

    else {
        new_heading_size = (heading_size == 0 ? 2 : heading_size - 1)
        replacement = "#".repeat(new_heading_size) + " " + selected_value.slice(offset_in)
        start_offset = new_heading_size + 1
        end_offset = 0
        if (break_prev) {
            replacement = "\n" + replacement
            offset += 1
            start_offset += 1
        }
        if (break_next) {
            replacement += "\n"
            end_offset -= 1
        }
        range_start = (selection_start - offset < 0 ? 0 : selection_start - offset)
        editor.setRangeText(replacement, range_start, selection_end)
        editor.setSelectionRange(editor.selectionStart + start_offset, editor.selectionEnd + end_offset)
    }
}

function insertTable() {
    // let col_num = prompt("Columns:");
    // let row_num = prompt("Rows:");
    let col_num = 3
    let row_num = 3

    let th = "\n" + "|      ".repeat(col_num) + "|\n"
    let hr = "|------".repeat(col_num) + "|\n"
    let rows = ("|      ".repeat(col_num) + "|\n").repeat(row_num)

    editor.setRangeText(th + hr + rows)
    editor.setSelectionRange(editor.selectionStart + 2, editor.selectionStart + 8)
}

function toggleBlockQuote() {
    let selection_start = editor.selectionStart
    let selection_end = editor.selectionEnd
    let selected_value = editor.value.substring(selection_start, selection_end)
    let break_prev = checkPrevLineBreak(selection_start, ">")
    let break_next = checkNextLineBreak(selection_end)

    if (selected_value == "") {
        replacement = "> blockquote"
        offset = 2
        if (break_prev) {
            replacement = "\n" + replacement
            offset += 1
        }
        if (break_next) {
            replacement += "\n"
        }
        editor.setRangeText(replacement)
        editor.setSelectionRange(selection_start + offset, selection_end + 10 + offset)
    }

    else {
        if (selected_value[0] == ">") {
            replacement = selected_value.slice(1).trimStart()
            start_offset = 0
            end_offset = 0
            if (break_prev) {
                replacement = "\n" + replacement
                start_offset += 1
            }
            if (break_next) {
                replacement += "\n"
                end_offset -= 1
            }
            editor.setRangeText(replacement)
            editor.setSelectionRange(editor.selectionStart + start_offset, editor.selectionEnd + end_offset)
        }
        else {
            let check_tag_result = checkTag(selection_start, ">")

            if (check_tag_result.isTagged) {
                editor.setRangeText(selected_value,
                    selection_start - check_tag_result.offset,
                    selection_end,
                    'select')
            }

            else {
                replacement = "> " + selected_value.trimStart()
                start_offset = 2
                end_offset = 0
                if (break_prev) {
                    replacement = "\n" + replacement
                    start_offset += 1
                }
                if (break_next) {
                    replacement += "\n"
                    end_offset -= 1
                }
                editor.setRangeText(replacement)
                editor.setSelectionRange(editor.selectionStart + start_offset, editor.selectionEnd + end_offset)
            }

        }
    }
}

function makeUList() {
    // SEÇİLİ DEĞER YOKSA INSERT LIST ITEM
    // SEÇİLİ DEĞER VARSA "\n" kısmından SPLIT YAP
    // EĞER HERHANGİ BİR LİST ITEMSA LIST ILK SATIRDAKININ TAGLERİNİ KALDIR
    // YOKSA "\n" KARAKTERLERINI " " İLE DEĞİŞTİR
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

    if (selected_value == "") {
        replace_value = " - List Item"
        selection_start += 3
        selection_end += 12
    }
    else {
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
    editor.setSelectionRange(selection_start, selection_end)
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
                lines[result[i].line] = " " + (i + 1).toString() + ". " + lines[result[i].line]
            }
            else if (result[i].type == 'oList') {
                lines[result[i].line] = lines[result[i].line].slice(lines[result[i].line].indexOf(".") + 1)
                lines[result[i].line] = " " + (i + 1).toString() + "." + lines[result[i].line]
            }
            else {
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
    editor.setSelectionRange(selection_start, selection_end)
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
    editor.setSelectionRange(selection_start, selection_end)
}

function deleteCurrentLine() {
    let range = getCurrentLineRange()
    editor.setRangeText("", range.start, range.end)
}

function insertAtNewLine(value) {
    editor.setRangeText("\n" + value + "\n")
    editor.setSelectionRange(editor.selectionStart + 1 + value.length, editor.selectionEnd + 1 + value.length)
}

function toggleCode() {
    let selection_start = editor.selectionStart
    let selection_end = editor.selectionEnd
    let selected_value = editor.value.substring(selection_start, selection_end)
    let break_prev = checkPrevLineBreak(selection_start, "`")
    let break_next = checkNextLineBreak(selection_end)
    let start_offset = 0
    let end_offset = 0

    if (selected_value == "") {
        if (break_next || break_prev) {
            replacement = "`enter code here`"
            start_offset = 1
            end_offset = 16
        }
        else {
            replacement = "```bash\nenter code here\n```"
            start_offset = 8
            end_offset = 23
        }
        editor.setRangeText(replacement)
        editor.setSelectionRange(selection_start + start_offset, selection_end + end_offset)
    }
    else {
        if (selected_value.startsWith("```bash\n") && selected_value.endsWith("\n```")) {
            replacement = selected_value.substring(8, selected_value.length - 4)
        }
        else if (selected_value.startsWith("`") && selected_value.endsWith("`")) {
            replacement = selected_value.substring(1, selected_value.length - 1)
        }
        else if (editor.value.substring(selection_start - 8, selection_start) == "```bash\n" &&
            editor.value.substring(selection_end, selection_end + 4) == "\n```") {
            replacement = selected_value
            start_offset = -8
            end_offset = 4
        }
        else if (editor.value[selection_start - 1] == "`" || editor.value[selection_end + 1] == "`") {
            replacement = selected_value
            start_offset = -1
            end_offset = 1
        }
        else {
            if (break_next || break_prev) {
                replacement = "`"+ selected_value + "`"
                start_offset = 1
                end_offset = 1 + selected_value.length
            }
            else {
                replacement = "```bash\n" + selected_value + "\n```"
                start_offset = 8
                end_offset = 8 + selected_value.length
            }
            editor.setRangeText(replacement)
            editor.setSelectionRange(selection_start + start_offset, selection_start + end_offset)
            return
        }
        editor.setRangeText(replacement, selection_start + start_offset, selection_end + end_offset, 'select')
    }
}