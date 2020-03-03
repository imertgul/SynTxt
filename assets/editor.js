var MarkdownIt = require('markdown-it')

$(function () {
    $("#markdown-editor").linedtextarea();
});

let markdown_editor = document.querySelector("#markdown-editor")
let html_preview = document.querySelector("#html-preview")
let recent_content = markdown_editor.value
md = new MarkdownIt();


markdown_editor.addEventListener('keydown', function (e) {
    if (e.keyCode === 9) {
        var start = this.selectionStart;
        var end = this.selectionEnd;

        var target = e.target;
        var value = target.value;

        target.value = value.substring(0, start)
            + "\t"
            + value.substring(end);

        this.selectionStart = this.selectionEnd = start + 1;

        e.preventDefault();
    }
});

setInterval(() => {
    if (contentChanged()) {
        recent_content = markdown_editor.value
        html_preview.innerHTML = md.render(recent_content)
    }
}, 500)

function contentChanged() {
    return recent_content != markdown_editor.value
}