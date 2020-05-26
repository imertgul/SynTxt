function getCurrentLine() {
    let lines = editor.value.substring(0, editor.value.length).split("\n")
    return lines[getCurrentLineNumber() - 1]
}

function getLine(line_number) {
    let lines = editor.value.substring(0, editor.value.length).split("\n")
    return lines[line_number]
}

function getLineDifference(previous, current, same_length = true){
    let diff = []

    if (same_length) {
        for (let i = 0; i < previous.length; i++) {
            if (previous[i] != current[i]) {
                diff.push({ 'line': i, 'text': current[i] })
            }
        }

        return diff
    }
    let i

    for (i = 0; i < current.length; i++) {
        if (current[i] != previous[i]){
            break;
        }
    }
    
    for (let j = i; j < current.length; j++) {
        diff.push({'line': j,'text':current[j]})
    }
    
    return diff
}

function getAllLines(value) {
    let lines
    if (value) {
        lines = value.substring(0, value.length).split("\n")
    }
    else {
        lines = editor.value.substring(0, editor.value.length).split("\n")
    }
    return lines
}

function getCurrentLineNumber() {
    return editor.value.substring(0, editor.selectionStart).split("\n").length
}

function getCurrentLineRange() {
    let lines = editor.value.substring(0, editor.value.length).split("\n")
    let curr_line_no = editor.value.substring(0, editor.selectionStart).split("\n").length
    let start = 0
    let end = 0
    for (let i = 0; i < curr_line_no - 1; i++) {
        start += lines[i].length + 1
    }
    end = start + lines[curr_line_no - 1].length
    return {'start':start, 'end':end}
}

function checkFixesLinkTags() {
    let value_after_selected = editor.value.substring(editor.selectionEnd, editor.value.length)
    let suffix_regex = /.*\]{1}\({1}.*\)/g
    let suffix_regex_result = suffix_regex.exec(value_after_selected)
    let is_image_prefix = editor.value.substring(editor.selectionStart - 2, editor.selectionStart) == "!["
    let is_link_prefix = editor.value.substring(editor.selectionStart - 1, editor.selectionStart) == "["

    if (suffix_regex_result) {
        if (is_image_prefix) {
            return { 'start_offset': 2, 'end_offset': suffix_regex_result[0].length }
        }
        else if (is_link_prefix) {
            return { 'start_offset': 1, 'end_offset': suffix_regex_result[0].length }
        }
    }
    return null
}

function checkWholeTextLinkTags(value) {
    let image_regex = /!{1}\[{1}.*\]{1}\({1}.*\)/g
    let link_regex = /\[{1}[^\[]*\]{1}\({1}.*\)/g
    let image_regex_result = image_regex.exec(value)
    let link_regex_result = link_regex.exec(value)

    if (image_regex_result && image_regex_result.index == 0) {
        return { 'start': image_regex_result[0].indexOf("[") + 1, 'end': image_regex_result[0].indexOf("]") }
    }
    else if (link_regex_result && link_regex_result.index == 0) {
        return { 'start': link_regex_result[0].indexOf("[") + 1, 'end': link_regex_result[0].indexOf("]") }
    }
    return null
}

function isUnorderedItem(value) {
    return value.startsWith(" - ")
}

function isCheckItem(value) {
    return value.startsWith(" - [")
}

function isOrderedItem(value) {
    let dot_index = value.indexOf(".")
    if (dot_index != -1 && value.startsWith(" ")) {
        if (Number.isInteger(Number(value.substr(1, dot_index)))) {
            return true
        }
    }
    return false
}

function isEmptyListItem(value) {
    let trimmed = value.trim()
    let orderedItemRegex = /^[0-9]+\.{1}$/g
    let regexResult = orderedItemRegex.test(trimmed)
    return trimmed == "-" || trimmed == "- [ ]" || regexResult
}

function checkHeadingInString(value) {
    let heading_size = 0
    let offset = 0
    for (let i = 0; i < value.length; i++) {
        let char = value[i]
        offset += 1
        if (char == "#") {
            heading_size += 1
        }
        else if (char == " ") { continue }
        else {
            offset -= 1
            break
        }
    }
    return { 'heading': heading_size, 'offset': offset }
}

function checkHeadingBeforeString(start) {
    let heading_size = 0
    let offset = 0
    for (let i = start - 1; i >= 0; i--) {
        let char = editor.value[i]
        offset += 1
        if (char == "#") {
            heading_size += 1
        }
        else if (char == " ") { continue }
        else {
            offset -= 1
            break
        }
    }
    return { 'heading': heading_size, 'offset': offset }
}

function checkPrevLineBreak(start, tag) {
    let i = 1
    let value
    while (true) {
        value = editor.value.substring(start - i, start - i + 1)
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

function checkNextLineBreak(end) {
    let i = 1
    let break_next = false
    let value
    while (true) {
        value = editor.value.substring(end + i - 1, end + i)
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

function checkTag(start, tag) {
    let i = 1
    let tagged = false
    let value
    while (true) {
        value = editor.value.substring(start - i, start - i + 1)
        if (value == tag) {
            tagged = true
            break
        }
        else if (value != " " || value == "\n" || value == "") {
            break
        }
        i++
    }
    return { 'isTagged': tagged, 'offset': i }
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