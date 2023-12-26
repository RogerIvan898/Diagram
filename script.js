function getNumbers(){
    const inputText = document.querySelector('input').value
    const numbers = inputText.split(' ').filter(number => !isNaN(Number(number)) && number !== '')

    return numbers
}

function drawDiagram(){
    const MAX_COLUMN_HEIGHT = 650
    const numbers = getNumbers()
    let columnElement = document.getElementsByClassName('diagram-column')[0]
    const maxNumber = Math.max(...Object.values(numbers))

    clearDiagram()
    for(let number of numbers) {
        const newColumnElement = columnElement.cloneNode(true)
        newColumnElement.style.display = 'flex'

        newColumnElement.style.height = `${(MAX_COLUMN_HEIGHT*number)/maxNumber}px`
        newColumnElement.childNodes[0].textContent = number
        columnElement.after(newColumnElement)
        columnElement = newColumnElement
    }
}

function clearDiagram(){
    const columns = Array.from(document.getElementsByClassName('diagram-column'))
    for(let i =1;i<columns.length;i++){
        columns[i].remove()
    }
}
