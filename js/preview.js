var MarkdownIt = require('markdown-it')
md = new MarkdownIt();

var preview_content = document.getElementById("preview-content")

var current_value = editor.value

setInterval(function () { 
    if(valueChanged()){
        updatePreview()
    }
}, 300);

function valueChanged() {
    return editor.value != current_value
}

function updatePreview() {
    current_value = editor.value
    var html_content = md.render(current_value);
    preview_content.innerHTML = html_content
}