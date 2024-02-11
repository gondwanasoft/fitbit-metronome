import clock from 'clock'
import display from 'display'
import { globals } from './globals'
import { state } from './state'

//const preset1El = document.getElementById('preset1')

const AOD_BTN_FILL = '#000000'
const AOD_TEXT_FILL = '#808080'
const btns = globals.metroSelectEl.getElementsByClassName('select-btn')

function startState() {
  //console.log('metroSelectState start()')
  //preset1El.text = '100 BPM'//
  globals.metroSelectEl.style.display = 'inline'
  clock.granularity = 'off'
  clock.ontick = undefined
  display.onchange = onDisplayChange
}

function stopState() {
  globals.metroSelectEl.style.display = 'none'
}

function onBtnClick() {
  //console.log(`onBtnClick() ${this.id}`)
  stopState()
  const presetNbr = Number(this.id)
  if (presetNbr >= 0) {
    globals.states.metroPlay.start(state.presets[presetNbr].tempo, state.presets[presetNbr].sig)
  } else {
    globals.states.metroCustom.start()
  }
}

function doUpdateLabel(index) {
  btns[index].text = state.presets[index].label
}

function onDisplayChange() {
  //console.log(`onDisplayChange avail=${display.aodAvailable} allow=${display.aodAllowed} enab=${display.aodEnabled} act=${display.aodActive}`);
  if (display.aodAllowed && display.aodEnabled) { // entering or leaving AOD
    const aodActive = display.aodActive
    //console.log(`${btns[0].getElementById('text').style.fill}`)
    btns.forEach(btn => {
      btn.style.fill = aodActive? AOD_BTN_FILL : btn.bgFill
      btn.getElementById('text').style.fill = aodActive? AOD_TEXT_FILL : btn.textFill
    })
  }
}

;(function() {  // initialisation IIFE
  btns.forEach((btn, index) => {
    btn.onclick = onBtnClick
    btn.bgFill = btn.style.fill   // kludge: add property .bgFill directly to btn
    btn.textFill = btn.getElementById('text').style.fill   // kludge: add property .textFill directly to btn
    //console.log(`${btn.textFill}`)
    if (!btn.textFill) btn.textFill = '#ffffff'
  })
})()

export const metroSelectState = {
  start: startState,
  updateLabel: doUpdateLabel
}