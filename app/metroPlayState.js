import clock from 'clock'
import {me as device} from "device"
import display from 'display'
import { vibration } from "haptics"
import { globals } from './globals'
import { state } from './state'

const FLASH_DURATION = 200            // ms
const VIBRATE_DURATION_LONG = 100     // ms; no point going over 100
const VIBRATE_DURATION_SHORT = 35     // ms
const POKE_INTERVAL = device.modelId < 36? 9500 : (device.modelId < 60? 7500 : 5500)  // ms between display.poke()
const VIBRATION_PATTERN = device.modelId <= 44? "nudge-max" : "ping"  // pattern should start with a long strong pulse

let metronomeTimer
let pokeTimer

function startState(tempo, sig) {
  //console.log(`metroPlayState tempo=${tempo} ${sig}`)
  globals.flashEl.style.fill = '#000000'
  globals.flashEl.style.display = 'inline'
  globals.touchEl.ondoubleclick = stopState
  display.onchange = onDisplayChange
  if (state.durInMetro) {
    onTick(new Date())
    clock.granularity = 'seconds'           // perhaps only necessary if displaying timer
    clock.ontick = evt => onTick(evt.date)  // perhaps only necessary if displaying timer
    globals.timerEl.style.display = 'inline'
    // could stop colon blinking, and restart it when done, but seconds is going to change every second anyway
  }
  if (!state.flash) {
    globals.btnEl.style.display = 'inline'
    globals.btnEl.image = 'tick.png'
    globals.btnEl.onclick = stopState
  }
  playMetronome(tempo, sig)
}

function playMetronome(tempo, sig) {
  // tempo: minor beats per minute
  // sig: time signature: minor beats per major beat
  if (state.flash) pokeTimer = setInterval(display.poke, POKE_INTERVAL)   // don't do this for prolonged periods because it can damage hardware
  const interval = 60000 / tempo  // ms per minor beat
  let beat = 0    // 0 to sig-1; 0 is major beat
  let vibrateDuration

  metronomeTimer = setInterval(onBeat, interval)

  function onBeat() {
    // Vibrate:
    if (state.vib) {
      vibration.start(VIBRATION_PATTERN)
      //console.log(`${VIBRATION_PATTERN}`)
      vibrateDuration = beat && state.shortVib? VIBRATE_DURATION_SHORT : VIBRATE_DURATION_LONG
      setTimeout(() => {  // stop vibration
        vibration.stop()  // only needed if playing non-standard duration (eg, short bump or ping)
      }, vibrateDuration)
    }

    // Flash:
    if (state.flash) {
      globals.flashEl.style.fill = beat? state.minorFill : '#ffffff'
      setTimeout(() => {  // stop flash
        globals.flashEl.style.fill = '#000000'
      }, FLASH_DURATION)
    }

    beat = ++beat % sig
  }
}

function onTick(now) {
  //console.log('metroPlay onTick()')
  globals.timerEl.onTick(now)   // because timer may be displayed
}

function onDisplayChange() {
  //console.log(`metroPlay onDisplayChange avail=${display.aodAvailable} allow=${display.aodAllowed} enab=${display.aodEnabled} act=${display.aodActive}`);
  if (display.aodAllowed && display.aodEnabled) { // entering or leaving AOD
    const aodActive = display.aodActive
    if (state.flash)
      display.poke()
    else {
      const aodDisplay = aodActive? 'none' : 'inline'
      globals.btnEl.style.display = aodDisplay
    }
  }
}

function stopState() {
  clearInterval(metronomeTimer)
  if (state.flash) clearInterval(pokeTimer)
  globals.flashEl.style.display = 'none'
  globals.touchEl.ondoubleclick = undefined
  if (state.durInMetro) clock.ontick = undefined    // no need to hide timerEl because it will be displayed in sessionPlayState
  globals.states.sessionPlay.start(true)            // sessionPlay doesn't restart timer
}

export const metroPlayState = {
  start: startState
}