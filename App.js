import {Diagram} from './src/classes/Diagram.js'
import './styles.css'

const inputElement = document.getElementById('diagram-options-input')
inputElement.addEventListener('keydown',
  ({key}) => key === 'Enter' && createDiagram()
)

const buttonCreateDiagram = document.getElementById('diagram-option-create')
buttonCreateDiagram.addEventListener('click', createDiagram)

let diagram = null

function createDiagram(){
  const inputText = inputElement.value
  const numbers = inputText.split(' ').filter(number => !isNaN(Number(number)) && number !== '').map(Number)

  if(!numbers.length){
    return
  }

  if(!diagram){
    diagram = new Diagram(numbers)
    return
  }

  diagram.redrawColumnContainer(numbers)
}