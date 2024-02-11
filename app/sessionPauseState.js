import clock from 'clock'
import display from 'display'
import { globals } from "./globals"
import { state } from './state'

function createSessionPauseState() {   // closure
  function startState(init = false) {
    // init: true to start a new session; false to pause the current session
    //console.log(`sessionPause.startState() init=${init}`)
    if (init) {
      globals.timerEl.init(state.sessionDur, state.down)
      //globals.timerEl.style.display = 'inline'
      globals.btnEl.style.display = 'inline'
    } else
      globals.timerEl.pause()

    //globals.timerEl.blink = true
    clock.ontick = evt => onTick(evt.date)
    globals.btnEl.onclick = globals.clockface? startClock : resetTimer
    globals.btnEl.image = globals.clockface? 'done.png' : 'reset.png'
    //globals.btnIconEl.href = globals.btnIconPressEl.href = globals.clockface? 'done.png' : 'reset.png'
    globals.touchEl.ondoubleclick = onDoubleClick

    display.onchange = onDisplayChange

    //globals.timerEl.aodActive = true    // TODO 8 del testing
  }

  function stopState() {
    globals.timerEl.close()
    globals.btnEl.style.display = 'none'
    globals.touchEl.ondoubleclick = undefined
  }

  function onTick(now) {
    globals.timeEl.time = now
    //globals.timerEl.negative = true
    //globals.timerEl.style.fill = 'green'
    //globals.timerEl.onTick(new Date(0,0,0,now.getSeconds()%3,now.getSeconds(),now.getSeconds()))
    globals.timerEl.onTick(now)
    //globals.timerEl.time = new Date(0,0,0,1,2,0)
  }

  function onDoubleClick(evt) {
    globals.states.sessionPlay.start()
  }

  function startClock() {
    stopState()
    globals.states.clock.start()
  }

  function resetTimer() {
    //console.log('sessionPause resetTimer()')
    globals.timerEl.reset(state.sessionDur, state.down)
  }

  function onDisplayChange() {
    //console.log(`onDisplayChange avail=${display.aodAvailable} allow=${display.aodAllowed} enab=${display.aodEnabled} act=${display.aodActive}`);
    if (display.aodAllowed && display.aodEnabled) { // entering or leaving AOD
      const aodActive = display.aodActive

      const aodDisplay = aodActive? 'none' : 'inline'
      globals.bgEl.style.display = globals.btnEl.style.display = aodDisplay

      globals.timeEl.aodActive = globals.timerEl.aodActive = aodActive

      clock.granularity = aodActive? 'minutes' : 'seconds'

      //console.log(`onDisplayChange aod=${aodActive} ontick=${clock.ontick}`);

    }
  }

  return {  // interface
    start: startState
  }
}

export const sessionPauseState = createSessionPauseState()