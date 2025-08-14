// Script that runs on actual web pages
console.log("Text Highlighter extension ready to go")

// Creating the popup
const popup = document.createElement('div')
popup.className = 'definition-popup hidden' // Starting the popup as hidden initially
document.body.appendChild(popup)


function showPopup(text, x, y){
    popup.innerHTML = `
        <strong>You highlighted:</strong><br>
        "${text}"<br><br>
        <em>Definition coming soon...</em>
    `;

    popup.style.left = x + 'px'
    popup.style.top = (y + 20) + 'px' // Abit of room below the cursor

    popup.classList.remove('hidden')
}


function hidePopup() {
    popup.classList.add('hidden')
}


document.addEventListener('mouseup', (e) => {
    const selectedText = window.getSelection().toString()

    if (selectedText.length > 0){
        console.log("Highlighted:" , selectedText)


        // Get the cursor coordinates
        const x = e.pageX 
        const y = e.pageY

        showPopup(selectedText, x, y)

    }
})

// When the user clicks anywhere on the page the popup will be hidden
document.addEventListener('mousedown', () => {
    hidePopup()
})
// new password: ekmuGei7o
