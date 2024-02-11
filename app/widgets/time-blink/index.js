import { preferences } from "user-settings"
import { constructWidgets } from "../construct-widgets";
import { globals } from '../../globals'

const construct = (el) => {
  // el: the element object returned by getElementsByTypeName().

  const hourEl = el.getElementById('hour')
  const colonEl = el.getElementById('colon')
  const minEl = el.getElementById('min')
  const shadowEl = el.getElementById('shadow')
  const hourShEl = shadowEl.getElementById('hourSh')
  const colonShEl = shadowEl.getElementById('colonSh')
  const minShEl = shadowEl.getElementById('minSh')

  let hourPrev, minPrev
  let hourWidth, minWidth, colonWidth = colonEl.getBBox().width
  let secEl
  let displayShadows
  let blinkColon = true

  function formatHour(hr) {
    if (preferences.clockDisplay === '12h') {
      hr %= 12
      return hr? hr : 12
    }
    return globals.zeroPad(hr)
  }

  /*function zeroPad(s) {
    return s <= 9? '0' + s : s
  }*/

  Object.defineProperty(el, 'secondsEl', {
    // Optional element that will have its .text propery set to the current seconds string
    set(newSecEl) {
      secEl = newSecEl
    }
  })

  Object.defineProperty(el, 'time', {
    set(now) {
      const hour = now.getHours()
      const min = now.getMinutes()
      //hour=23; min=58 // TODO 8 del: AOD, sizing

      //const displayShadows = shadowEl.style.display !== 'none'
      //console.log(`time: ${displayShadows}`);
      let timeChanged

      if (hour !== hourPrev) {
        hourPrev = hour
        hourEl.text = formatHour(hour)
        if (displayShadows) hourShEl.text = hourEl.text
        hourWidth = hourEl.getBBox().width
        timeChanged = true
      }

      if (min !== minPrev) {
        minPrev = min
        minEl.text = globals.zeroPad(min)
        if (displayShadows) minShEl.text = minEl.text
        minWidth = minEl.getBBox().width
        timeChanged = true
      }

      if (timeChanged) {
        const hourX = (-hourWidth - colonWidth - minWidth) / 2
        hourEl.x = hourX
        colonEl.x = hourX + hourWidth
        minEl.x = colonEl.x + colonWidth
        //console.log(`${hourWidth} ${colonWidth} ${minWidth} ${hourX}`)
        if (displayShadows) {
          //console.log(`time timeChanged hourX=${hourX}`);
          hourShEl.x = hourX
          colonShEl.x = colonEl.x
          minShEl.x = minEl.x
        }
      }

      if (blinkColon) {
        const sec = now.getSeconds()
        //sec = 44  // TODO 8 SS and sizing
        const colonDisplay = sec%2? 'none' : 'inline'
        colonEl.style.display = colonDisplay  // blink colon if not in AOD
        //console.log(`time-blink .time colonDisplay=${colonDisplay}`)
        if (displayShadows) colonShEl.style.display = colonDisplay  // blink colon if not in AOD
        if (secEl) secEl.text = globals.zeroPad(sec)
      }
    }
  })

  Object.defineProperty(el, 'colonFill', {
    set(newValue) {
      colonEl.style.fill = newValue
    }
  })

  Object.defineProperty(el, 'shadowDisplay', {
    set(newValue) {
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
      blinkColon = !newAodActive
      if (newAodActive) {
        colonEl.style.display = 'inline'
        if (displayShadows) colonShEl.style.display = 'inline'
        //console.log(`time-blink aodActive`)
      }
      //if (secEl) secEl.style.display = newAodActive? 'none' : 'inline'
    }
  })

  // Initialisation:
  ;(function () {    // we use an IIFE so that its memory can be freed after execution
    colonShEl.y = colonEl.y
    displayShadows = shadowEl.style.display !== 'none'
  })();

  return el;
}

constructWidgets('time-blink', construct)