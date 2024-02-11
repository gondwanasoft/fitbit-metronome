import clock from 'clock'
import { preferences } from "user-settings"
import { globals } from './globals'

function createClockState() {   // closure
  let datePrev

  ;(function() {  // initialisation IIFE
    clock.granularity = 'seconds'
    //console.log(`clockState IIFE`)
  })()

  /*function initState(states) {

  }*/

  function startState() {
    clock.ontick = evt => {onTick(evt.date)}
    //globals.touchEl.onclick = onTouch
    globals.touchEl.ondoubleclick = onDoubleClick
    globals.dateEl.style.display = 'inline'
  }

  function onTick(now) {
    globals.timeEl.time = now

    const date = now.getDate()
      if (date !== datePrev) {
      datePrev = date
      globals.dateEl.text = date
    }
  }

  function onDoubleClick() {
    stopState()
    globals.states.sessionPause.start(true)
  }

  function stopState() {
    globals.touchEl.ondoubleclick = undefined
    globals.dateEl.style.display = 'none'
    datePrev = undefined  // ensure date is redisplayed when clockState restarts
  }

  return {  // interface
    //init: initState,
    start: startState
  }
}

export const clockState = createClockState()