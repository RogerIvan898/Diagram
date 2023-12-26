function getNumbers(){
    const inputText = document.querySelector('input').value
    const numbers = inputText.split(' ').filter(number => !isNaN(Number(number)) && number !== '')

    return numbers
}

function drawDiagram(){
    const MAX_COLUMN_HEIGHT = 650

    const numbers = getNumbers()
    const maxNumber = Math.max(...numbers)
    const diagramElement = document.getElementsByClassName('diagram')[0]

    clearDiagram()
    for(let number of numbers) {

        const newColumnElement = createColumn()
        const columnTextElement = newColumnElement.childNodes[0]

        newColumnElement.style.height = `${(MAX_COLUMN_HEIGHT*number)/maxNumber}px`
        columnTextElement.textContent = number
        diagramElement.appendChild(newColumnElement)
    }
}

function clearDiagram(){
    const columns = Array.from(document.getElementsByClassName('diagram-column'))

    columns.forEach(column =>{
        column.remove()
    })
}

function createColumn(){
    const columnElement = document.createElement('div')
    const columnContent = document.createElement('p')

    columnElement.setAttribute('class','diagram-column')
    columnElement.appendChild(columnContent)

    return columnElement
}