import {Diagram} from './src/classes/Diagram.js'
import {disableButtons} from './src/helpers.js'
import {swapDirections} from './src/constants.js'

const diagramControlButtons = {
  buttonForwardSwap: document.getElementById('sort-forward'),
  buttonBackwardSwap: document.getElementById('sort-backward'),
  buttonCreateDiagram: document.getElementById('diagram-options-button'),
}

const diagram = new Diagram()

export function disableSwapButton(swapDirection, isDisabled){
  if(swapDirection === swapDirections.FORWARD){
    buttonForwardSwap.disabled = isDisabled
    return
  }

  buttonBackwardSwap.disabled = isDisabled
}

export function disableDiagramControlButtons(isDisabled){
  disableButtons(isDisabled, ...Object.values(diagramControlButtons))
}