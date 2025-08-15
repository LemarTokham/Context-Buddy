// Script that runs on actual web pages
console.log("Text Highlighter extension ready to go")

// Creating the popup
const popup = document.createElement('div')
popup.className = 'definition-popup hidden' // Starting the popup as hidden initially
document.body.appendChild(popup)


let selectionTimer


function showPopup(text, x, y){
    popup.innerHTML = `
    <div class="loading">
        <strong>You highlighted:</strong><br>
        "${text}"<br><br>
        <div class="spinner"></div>
        <em>Fetching definitions...</em>
    </div>
    `;

    popup.style.left = x + 'px'
    popup.style.top = (y + 20) + 'px' // Abit of room below the cursor

    popup.classList.remove('hidden')
}



// Get context
function getContextAroundSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;

    // get parent elem (if its a text node get its parent)
    let parentElement = container.nodeType === 3 ? container.parentElement : container

    // Find nearest para or meaningful container
    while (parentElement && !['P', 'DIV', 'ARTICLE', 'SECTION', 'LI'].includes(parentElement.tagName)) {
        parentElement = parentElement.parentElement
    }

    return  {
        selectedText : selection.toString().trim(),
        context: parentElement ? parentElement.textContent.substring(0, 300) : '',
        pageTitle: document.title,
        url: window.location.href
    }

}

async function getAIDef(contextData){
    // implement
    try {
        const response = await chrome.runtime.sendMessage({
            type: 'GET_DEFINITION',
            data: contextData
        })

        if (response.success){
            console.log(response.definition)
            return response.definition
        } else {
            throw new Error(response.error || 'Failed to get definitions')
        }
    } catch(error) {
        console.log('Error getting defs:', error)
        throw error
    }
}


function hidePopup() {
    popup.classList.add('hidden')
}


document.addEventListener('mouseup', (e) => {
    // clear prev timers
    clearTimeout(selectionTimer)

    const selectedText = window.getSelection().toString().trim()

    if (selectedText.length > 0){
        // 500ms delay to make sure user is done selecting
        selectionTimer = setTimeout(async () => {
            console.log("Highlighted:" , selectedText)

            // Get the cursor coordinates
            const x = e.pageX 
            const y = e.pageY

            showPopup(selectedText, x, y)

            // get context around selection

            const contextData = getContextAroundSelection();
            console.log("Context data:", contextData)

            // mock ai definitions
            try {
                const definition = await getAIDef(contextData)
                popup.innerHTML = `
                <strong>You highlighted:</strong>
                "${selectedText}<br><br>
                <div class="definition">${definition}</div>
                `
            } catch (error) {
                popup.innerHTML = `
                <strong>Error:</strong><br>
                Could not get definitions. Please try again.
                `
            }

        }, 500)
        


        

    }
})

// When the user clicks anywhere on the page the popup will be hidden
document.addEventListener('mousedown', () => {
    clearTimeout(selectionTimer)
    hidePopup()
})
