import {Diagram} from './src/classes/Diagram.js'
import {disableButtons} from './src/helpers.js'

const diagramControlButtons = {
  buttonForwardSwap: document.getElementById('sort-forward'),
  buttonBackwardSwap: document.getElementById('sort-backward'),
  buttonCreateDiagram: document.getElementById('diagram-options-button'),
}

const diagram = new Diagram()
const { buttonForwardSwap, buttonBackwardSwap, buttonCreateDiagram } = diagramControlButtons

buttonForwardSwap.addEventListener('click', () => diagram.forwardSwap())
buttonBackwardSwap.addEventListener('click', () => diagram.backwardSwap())
buttonCreateDiagram.addEventListener('click', createDiagram)

function getNumbers(){
  const inputText = document.getElementById('diagram-options-input').value
  const numbers = inputText.split(' ').filter(number => !isNaN(Number(number)) && number !== '')

  return numbers.map(Number)
}

function createDiagram(){
  const numbers = getNumbers()
  if(!numbers.length) {
    return
  }

  diagram.clear()
  diagram.draw(numbers)
  disableForwardSwapButton(false)
}

export function disableForwardSwapButton(isDisabled){
  buttonForwardSwap.disabled = isDisabled
}

export function disableBackwardSwapButton(isDisabled){
  buttonBackwardSwap.disabled = isDisabled
}

export function disableAllDiagramControlButtons(isDisabled){
  disableButtons(isDisabled, ...Object.values(diagramControlButtons))
}