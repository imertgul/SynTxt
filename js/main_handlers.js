var preview_content = document.getElementById("preview-content")
var last_value = editor.value
var last_cursor_position = 0

function valueChanged() {
    return editor.value != last_value
}

function updatePreview() {
    last_value = editor.value
    html_content = md.render(last_value.replace(/(?:\r\n|\r|\n)/g, "  \n"))
    preview_content.innerHTML = html_content
}

function cursorPostionChanged() {
    return last_cursor_position != editor.selectionStart
}

function updateLineInfo() {
    last_cursor_position = editor.selectionStart
    let line_no = getCurrentLineNumber()
    document.getElementById("line-number-span").innerText = line_no
}

function setAllLines(lines){
    editor.value = lines.join("\n")
}

function setLine(line_number, value){
    let lines = getAllLines()
    let start_position = 0
    let end_position
    // tam güncellenirken text silinirse (komple veya kısmi, emin değilim) cannot read property of null hatası veriyor
    for (let i = 0; i < line_number; i++) {
        start_position += lines[i].length + 1
    }
    end_position = start_position + lines[line_number].length
    editor.setRangeText(value, start_position, end_position)
}