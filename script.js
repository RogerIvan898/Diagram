function getNumbers(){
    const numbers = {}
    const inputText = document.querySelector('input').value
    let numbersArr = inputText.split(' ').filter(number => !isNaN(Number(number)) && number !== '')

    for(let number of numbersArr){
        if(!numbers.hasOwnProperty(number)){
            numbers[number] = 1
        }
        else {
            numbers[number]++
        }

    }
    return numbers
}

function drawDiagram(){
    clearDiagram()
    const numbers = getNumbers()
    let columnElement = document.getElementsByClassName('diagram-column')[0]
    const maxNumber = Math.max(...Object.values(numbers))

    for(let number of Object.keys(numbers)) {
        const newColumnElement = columnElement.cloneNode(true)
        newColumnElement.style.display = 'flex'


        newColumnElement.style.height = `${(650*numbers[number])/maxNumber}px`
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
