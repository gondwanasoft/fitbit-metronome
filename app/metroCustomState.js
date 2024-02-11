import display from 'display'
import { globals } from './globals'
import { state, saveState } from './state'
import { TEMPO_MIN, TEMPO_MAX, SIG_MIN, SIG_MAX } from '../common/common'

const AOD_FILL = '#404040'
const tempoElements = globals.metroCustomEl.getElementsByClassName('tempo')
const sigElements = globals.metroCustomEl.getElementsByClassName('sig')
const btnFillPrev = globals.btnEl.style.fill
let tempoOkay = true
let sigOkay = true

function startState() {
  // Init tempo:
  let valueString = state.customTempo.toString()
  if (valueString.length < 3) valueString = '0' + valueString  // force to 3 chars
  //console.log(`custom IIFE ${state.customTempo} "${valueString}"`)
  tempoElements.forEach((digit, index) => {
    digit.text = valueString[index]
    digit.onclick = onTempoClick
  })

  // Init sig:
  valueString = state.customSig.toString()
  if (valueString.length < 2) valueString = '0' + valueString // force to 2 chars
  sigElements.forEach((digit, index) => {
    digit.text = valueString[index]
    digit.onclick = onSigClick
  })

  globals.btnEl.image = 'tick.png'
  globals.btnEl.style.fill = 'cyan'
  globals.btnEl.onclick = startMetro
  globals.metroCustomEl.style.display = globals.btnEl.style.display = 'inline'

  display.onchange = onDisplayChange
}

function startMetro() {
  globals.btnEl.style.fill = btnFillPrev
  globals.metroCustomEl.style.display = globals.btnEl.style.display = 'none'
  state.customTempo = getTempo()
  state.customSig = getSig()
  saveState()
  globals.states.metroPlay.start(state.customTempo, state.customSig)
}

function onTempoClick() {
  let value = Number(this.text)
  const maxValue = this.id === '100'? 2 : 9
  if (++value > maxValue) value = 0
  this.text = value
  const tempo = getTempo()
  const newTempoOkay = tempo >= TEMPO_MIN && tempo <= TEMPO_MAX
  if (newTempoOkay !== tempoOkay) {
    tempoOkay = newTempoOkay
    tempoElements.forEach(el => el.style.fill = newTempoOkay? 'white' : 'red')
    updateBtn()
  }
}

function onSigClick() {
  let value = Number(this.text)
  const maxValue = this.id === '10'? 1 : 9
  if (++value > maxValue) value = 0
  this.text = value
  const sig = getSig()
  const newSigOkay = sig >= SIG_MIN && sig <= SIG_MAX
  if (newSigOkay !== sigOkay) {
    sigOkay = newSigOkay
    sigElements.forEach(el => el.style.fill = newSigOkay? 'white' : 'red')
    updateBtn()
  }
}

function updateBtn() {
  globals.btnEl.style.fill = tempoOkay && sigOkay? 'cyan' : '#808080'
  globals.btnEl.onclick = tempoOkay && sigOkay? startMetro : undefined
}

function getTempo() { // Number
  let tempo = ''
  tempoElements.forEach(digit => tempo += digit.text)
  return Number(tempo)
}

function getSig() { // Number
  let sig = ''
  sigElements.forEach(digit => sig += digit.text)
  return Number(sig)
}

function onDisplayChange() {
  //console.log(`onDisplayChange avail=${display.aodAvailable} allow=${display.aodAllowed} enab=${display.aodEnabled} act=${display.aodActive}`);
  if (display.aodAllowed && display.aodEnabled) { // entering or leaving AOD
    const aodActive = display.aodActive
    const aodDisplay = aodActive? 'none' : 'inline'
    globals.btnEl.style.display = aodDisplay
    const fill = aodActive? AOD_FILL : '#ffffff'
    tempoElements.forEach(el => el.style.fill = fill)
    sigElements.forEach(el => el.style.fill = fill)
  }
}

/*;(function() {  // initialisation IIFE
  // Init tempo:
  //console.log(`custom IIFE ${state.customTempo}`)
  let valueString = state.customTempo.toString()
  tempoElements.forEach((digit, index) => {
    digit.text = valueString[index]
    digit.onclick = onTempoClick
  })

  // Init sig:
  valueString = state.customSig.toString()
  if (valueString.length < 2) valueString = '0' + valueString
  sigElements.forEach((digit, index) => {
    digit.text = valueString[index]
    digit.onclick = onSigClick
  })
})()*/

export const metroCustomState = {
  start: startState
}