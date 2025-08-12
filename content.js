console.log("Texh Highlighter extension ready to go")

document.addEventListener('mouseup', () => {
    const selectedText = window.getSelection().toString()

    if (selectedText.length > 0){
        console.log("Highlighted:" , selectedText)
    }
})