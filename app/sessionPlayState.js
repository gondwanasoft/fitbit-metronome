import clock from 'clock'
import display from 'display'
import { globals } from "./globals"
import { state } from './state'

function createSessionPlayState() {   // closure
  function startState(tickNow) {
    // tickNow: we're returning from metroPlayState, so need to redisplay and update clock and timer
    //console.log(`sessionPlay.startState(${tickNow}) gran=${clock.granularity}`)
    if (tickNow) clock.granularity = 'seconds'  // could have been set to 'off' in metroPlayState
    clock.ontick = evt => onTick(evt.date)
    globals.timerEl.play()
    //globals.timerEl.blink = false
    globals.btnEl.image = 'metro.png'
    globals.touchEl.ondoubleclick = onDoubleClick
    globals.btnEl.onclick = onBtnClick
    if (tickNow) {
      globals.clockEl.style.display = globals.btnEl.style.display = 'inline'  // needed if returning from metroPlay
if (!state.durInMetro) globals.timerEl.style.display = 'inline'
      onTick(new Date())
    }

    display.onchange = onDisplayChange
  }

  function onTick(now) {
//console.log('sessionPlay onTick()')
    globals.timeEl.time = now
    //globals.timerEl.negative = true
    //globals.timerEl.blink = true
    //globals.timerEl.style.fill = 'green'
    //globals.timerEl.onTick(new Date(0,0,0,now.getSeconds()%3,now.getSeconds(),now.getSeconds()))
    globals.timerEl.onTick(now)
    //globals.timerEl.time = new Date(0,0,0,1,2,0)
  }

  function onDoubleClick(evt) {
    globals.states.sessionPause.start()
  }

  function onBtnClick() {   // start metroSelectState
    globals.clockEl.style.display = globals.btnEl.style.display = globals.timerEl.style.display = 'none'
    clock.ontick = undefined
    globals.touchEl.ondoubleclick = undefined
    globals.states.metroSelect.start()
  }

  function onDisplayChange() {
    //console.log(`onDisplayChange avail=${display.aodAvailable} allow=${display.aodAllowed} enab=${display.aodEnabled} act=${display.aodActive}`);
    if (display.aodAllowed && display.aodEnabled) { // entering or leaving AOD
      const aodActive = display.aodActive
      const aodDisplay = aodActive? 'none' : 'inline'
      globals.bgEl.style.display = globals.btnEl.style.display = aodDisplay

      //globals.timeEl.aodActive = globals.timerEl.aodActive = aodActive

      //clock.granularity = aodActive? 'minutes' : 'seconds'
    }
  }

  return {  // interface
    start: startState
  }
}

export const sessionPlayState = createSessionPlayState()