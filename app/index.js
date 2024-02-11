import { me as appbit } from "appbit"
import {me as device} from "device"
import display from 'display'
import { inbox } from "file-transfer"
import * as fs from 'fs'
import { vibration } from "haptics"
import { globals } from './globals'
import { state, loadState, saveState } from './state'
import './widgets/time-blink'
import './widgets/shadow-text'
import './widgets/timer'
import './widgets/touch'
import { clockState } from "./clockState"
import { sessionPauseState } from "./sessionPauseState"
import { sessionPlayState } from "./sessionPlayState"
import { metroSelectState } from "./metroSelectState"
import { metroCustomState } from "./metroCustomState"
import { metroPlayState } from "./metroPlayState"

// Vibration pattern test:
/*let vibIndex = 0
let vibPatterns = ["ping", "confirmation-max", "nudge-max"]
function vibrationTestSet() {
  return new Promise(resolveFunc => setTimeout(()=>{
    vibration.start(vibPatterns[vibIndex])
    /console.log(vibPatterns[vibIndex])
    if (++vibIndex >= vibPatterns.length) vibIndex = 0
    resolveFunc()
  }, 2000))
}
async function vibrationTest() {
  while(true)
    await vibrationTestSet()
}
vibrationTest()*/

;(function() {       //initialisation IIFE
  if (display.aodAvailable) display.aodAllowed = true // TODO 8 AOD reinstate

  loadState()

  metroSelectState.updateLabel(0)
  metroSelectState.updateLabel(1)
  metroSelectState.updateLabel(2)

  globals.states = {clock: clockState, sessionPause: sessionPauseState, sessionPlay: sessionPlayState, metroSelect: metroSelectState, metroCustom: metroCustomState, metroPlay: metroPlayState}

  inbox.addEventListener("newfile", receiveFiles)
  receiveFiles()    // in case settings were sent while not running or while playing a game (mode 1 or 2)

  if (globals.clockface)
    clockState.start()
  else {  // app
    appbit.appTimeoutEnabled = false
    //console.log('appTimeoutEnabled = false')
    sessionPauseState.start(true)
  }
})()

//#region **************************************************************************************** File Transfer *****

function receiveFiles() {
  let fileName
  while (fileName = inbox.nextFile()) {
    //console.log(`/private/data/${fileName} is now available`)
    receiveFile(fileName)
  }

  function receiveFile(fileName) {
    const settings = fs.readFileSync(fileName, 'cbor')
    let value

    for (let key in settings) {
      value = settings[key]
      //console.log(`receiveSettings() ${key}=${value} (${typeof value})`)
      switch(key) {
        case 'sessionDur': state.sessionDur = value; break
        case 'down': state.down = value; break
        case 'flash': state.flash = value; break
        case 'durInMetro': state.durInMetro = value; break
        case 'vib': state.vib = value; break
        case 'shortVib': state.shortVib = value; break
        case 'label0': state.presets[0].label = value; metroSelectState.updateLabel(0); break
        case 'label1': state.presets[1].label = value; metroSelectState.updateLabel(1); break
        case 'label2': state.presets[2].label = value; metroSelectState.updateLabel(2); break
        case 'tempo0': state.presets[0].tempo = value; break
        case 'tempo1': state.presets[1].tempo = value; break
        case 'tempo2': state.presets[2].tempo = value; break
        case 'sig0': state.presets[0].sig = value; break
        case 'sig1': state.presets[1].sig = value; break
        case 'sig2': state.presets[2].sig = value; break
      }
    }

    display.poke()

    saveState()
  }
}

//#endregion

// TODO 9 user-changeable pic?
// TODO 9 Tips; eg, temp overlay saying ’Double-tap to pause’.
// TODO 9 Moveable, resizable and recolourable text elements (?).
// TODO 9 Light/dark themes?
// TODO 9 Schedule of drills/pieces (eg, trills, Mozart, Rach prac, Rach)?
// TODO 9 Bar or pie graph(s) to indicate progress through session and segments.
// TODO 9 Multiple session ‘profiles’ (session duration, schedule, available metro presets, etc).
// TODO 9 larger flag button .PNGs