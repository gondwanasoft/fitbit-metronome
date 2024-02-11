import { vibration } from "haptics"
import { constructWidgets } from "../construct-widgets";
import { globals } from '../../globals'

const construct = (el) => {
  // el: the element object returned by getElementsByTypeName().

  const FILL_PAUSED = '#30abdf' // darkcyan lightened
  const FILL_ENDED = '#9DFF1F'  // green
  const hourEl = el.getElementById('tHr')
  const hrColonEl = el.getElementById('tHrColon')
  const minEl = el.getElementById('tMin')
  const minColonEl = el.getElementById('tMinColon')
  const secEl = el.getElementById('tSec')
  const shadowEl = el.getElementById('shadow')
  const hourShEl = shadowEl.getElementById('tHrSh')
  const hrColonShEl = shadowEl.getElementById('tHrColonSh')
  const minShEl = shadowEl.getElementById('tMinSh')
  const minColonShEl = shadowEl.getElementById('tMinColonSh')
  const secShEl = shadowEl.getElementById('tSecSh')

  let neg       // negative (-) (bool)
  let blinkColons = true
  let blinkAll  // blink hr, min and sec (bool)
  let blinkAllTimer
  let hourPrev, minPrev
  let hourWidth, minWidth, colonWidth, secWidth
  let targetDuration // ms
  let runningDuration
  let countDown
  let isRunning     // counting (not paused)
  let resumeTime    // Date when play() was last called
  let onEndCalled
  let fillRunning   // el.style.fill when isRunning
  let displayShadows

  function stopBlink() {
    if (blinkAllTimer !== undefined) {
      clearInterval(blinkAllTimer)
    blinkAllTimer = undefined
}
    el.style.opacity = 1
  }

  function onEnd() {
    //console.log(`onEnd(): ${countDown}`)
    el.style.fill = FILL_ENDED
    if (countDown) {
      neg = true
      hourPrev = minPrev = undefined  // force redisplay of everything
    }
    vibration.start("nudge")  // don't use a repeating pattern because that would be distracting if user wants to keep playing
    onEndCalled = true
    // could call a listener
  }

  Object.defineProperty(el, 'time', {
    set(now) {
      const hour = now.getUTCHours()
      const min = now.getUTCMinutes()
      const sec = now.getUTCSeconds()
      //hour=23; min=58 // TODO 8 del: AOD, sizing
      //console.log(`${hour} ${min} ${sec}`)

      //const displayShadows = shadowEl.style.display !== 'none'
      //console.log(`timer: ${displayShadows}`);
      let timeChanged   // hour and/or minute only

      if (hour !== hourPrev) {
        hourPrev = hour
        hourEl.style.display = hrColonEl.style.display = hour? 'inline' : 'none'
        if (displayShadows) {
          hourShEl.style.display = hourEl.style.display
          hrColonShEl.style.display = !hour || sec%2? 'none' : 'inline'    // don't display colon if sec is odd
        }
        if (hour) {
          if (neg) hour = '-' + hour
          hourEl.text = hour
          if (displayShadows) hourShEl.text = hourEl.text
          hourWidth = hourEl.getBBox().width
        }
        timeChanged = true
      }

      if (min !== minPrev) {
        minPrev = min
        minEl.text = hour? globals.zeroPad(min) : (neg? '-'+min : min)   // only zeroPad minute if hour>0
        if (displayShadows) minShEl.text = minEl.text
        minWidth = minEl.getBBox().width
        timeChanged = true
      }

      if (timeChanged) {    // adjust elements' .x
        // only display hour, and take its size into account, if hour>0
        let hourX = -minWidth - colonWidth - secWidth
        if (hour) hourX -= hourWidth + colonWidth
        hourX /= 2  // because centred
        let minX = hourX
        //console.log(`${hour} ${hourX} ${hourWidth} ${minWidth} ${secWidth} ${colonWidth}`)
        if (hour) {
          hourEl.x = hourX
          hrColonEl.x = hourX + hourWidth
          minX += hourWidth + colonWidth
        }
        minEl.x = minX
        //console.log(`${hourWidth} ${colonWidth} ${minWidth} ${hourX}`)
        minColonEl.x = minEl.x + minWidth
        secEl.x = minColonEl.x + colonWidth

        if (displayShadows) {
          //console.log(`time timeChanged hourX=${hourX}`);
          hourShEl.x = hourX
          hrColonShEl.x = hrColonEl.x
          minShEl.x = minEl.x
          minColonShEl.x = minColonEl.x
          secShEl.x = secEl.x
        }
      }

      secEl.text = globals.zeroPad(sec)
      if (displayShadows) secShEl.text = secEl.text

      //console.log(`timer .time all=${blinkAll} colons=${blinkColons}`)
      if (blinkColons) {   // blink colons
        //sec = 44  // TODO 8 SS and sizing
        const colonDisplay = sec%2? 'none' : 'inline' // display colon(s) if seconds is even
        //console.log(`  timer .time colonDisplay=${colonDisplay}`)
        displayColons(colonDisplay)
      }
    }
  })

  function displayColons(colonDisplay) {
    if (hourPrev) hrColonEl.style.display = colonDisplay
        minColonEl.style.display = colonDisplay
        if (displayShadows) {
          if (hourPrev) hrColonShEl.style.display = colonDisplay
          minColonShEl.style.display = colonDisplay
        }
      }

  /*Object.defineProperty(el, 'negative', {
    set(newValue) {
      neg = newValue
      // should redisplay previous time
    }
  })*/

  Object.defineProperty(el, 'blink', {  // blink entire element (including digits); colons blink automatically
    set(newValue) {
      //console.log(`blink=${newValue} was ${blinkAll}`)
      if (newValue === blinkAll) return   // no change, so do nothing

      blinkAll = newValue
blinkColons = !blinkAll   // assumes AOD isn't active
      if (blinkAll) {
        displayColons('inline')
        blinkAllTimer = setInterval(() => {
          el.style.opacity = 1 - el.style.opacity
        }, 500);
      } else stopBlink()
      // should redisplay previous time
    }
  })

  Object.defineProperty(el, 'colonFill', {
    set(newValue) {
      hrColonEl.style.fill = minColonEl.style.fill = newValue
    }
  })

  Object.defineProperty(el, 'shadowDisplay', {
    set(newValue) { // newValue: 'inline' or 'none' (string)
      // Set time immediately after this to ensure that shadow el .text and .x are updated.
      shadowEl.style.display = newValue
displayShadows = shadowEl.style.display !== 'none'
      //console.log(`shadowDisplay: ${shadowEl.style.display}`);
      if (newValue === 'inline') {
        hourPrev = minPrev = undefined   // force el.time to redisplay everything
        //el.time = new Date()
      }
    }
  })

  Object.defineProperty(el, 'aodActive', {
    set(newAodActive) {
//console.log(`timer aodActive=${newAodActive}`)
      if (newAodActive) {
        displayColons('inline')
        /*if (hourPrev) hrColonEl.style.display = 'inline'
        minColonEl.style.display = 'inline'
        if (displayShadows) {
        if (hourPrev) hrColonShEl.style.display = 'inline'
          minColonShEl.style.display = 'inline'
        }*/
      }
      //if (secEl) secEl.style.display = newAodActive? 'none' : 'inline'
      el.blink = !isRunning && !newAodActive
      blinkColons = !newAodActive
      //console.log(`timer aodActive() blinkAll=${blinkAll} blinkColons=${blinkColons}`)
    }
  })

  el.init = (targetDur, down = false) => {
    // targetDuration: ms
    stopBlink()
    blinkAll = false
    el.blink = true
    el.style.display = 'inline'
    el.reset(targetDur, down)
  }

  el.reset = (targetDur, down) => {
    targetDuration = targetDur
    countDown = down

    runningDuration = 0
        neg = false
    isRunning = false
    onEndCalled = false
    hourPrev = minPrev = undefined
    el.style.fill = FILL_PAUSED
    el.onTick() // don't need to pass an arg because isRunning is false
  }

  el.play = () => {
    if (isRunning) return

    resumeTime = Date.now()
    el.blink = false
    el.style.fill = onEndCalled? FILL_ENDED : fillRunning
    isRunning = true
  }

  el.pause = () => {
    if (!isRunning) return

    runningDuration += Date.now() - resumeTime
    el.style.fill = FILL_PAUSED
    el.blink = true
    isRunning = false
  }

  el.onTick = now => {
    let currentDuration = runningDuration
    if (isRunning) currentDuration += now.getTime() - resumeTime
    //console.log(`${runningDuration} ${currentDuration}`)
    //el.time = new Date(0,0,0,now.getSeconds(),now.getSeconds(),now.getSeconds())
    if (currentDuration >= targetDuration && !onEndCalled) onEnd()

    let displayDuration
    if (countDown) {
      displayDuration = targetDuration - currentDuration
      if (displayDuration < 0) displayDuration = -displayDuration   // neg is set to true in onEnd()
    } else displayDuration = currentDuration

    el.time = new Date(displayDuration)
  }

  el.close = () => {
    el.style.display = 'none'
    stopBlink()
  }

  // Initialisation:
  ;(function () {    // we use an IIFE so that its memory can be freed after execution
    //hrColonShEl.y = hrColonEl.y
    const display = el.style.display
    el.style.display = 'inline'   // for getBBox()
    fillRunning = el.style.fill
    secEl.text = '00'
    secWidth = secEl.getBBox().width
    colonWidth = minColonEl.getBBox().width
    displayShadows = shadowEl.style.display !== 'none'
    el.style.display = display
  })();

  return el;
};

constructWidgets('timerWidget', construct)