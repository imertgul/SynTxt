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

function setLine(text, line_number){
    
}