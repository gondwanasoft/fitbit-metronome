import document from 'document'

export const globals = {
  clockface: false,    // if false, app
  clockEl: document.getElementById('clock'),
  timerEl: document.getElementById('timer'),
  touchEl: document.getElementById('touch'),
  flashEl: document.getElementById('flash'),
  btnEl: document.getElementById('btn'),
  metroSelectEl: document.getElementById('metroSelect'),
  metroCustomEl: document.getElementById('metroCustom'),
  zeroPad: n => n <= 9? '0' + n : n,
  states: {}  // populated in startup IIFE to avoid circular dependencies in imports
}

//globals.hourEl = globals.clockEl.getElementById('hour')
//globals.minuteEl = globals.clockEl.getElementById('minute')
globals.bgEl = globals.clockEl.getElementById('bg')
globals.timeEl = globals.clockEl.getElementById('time')
globals.dateEl = globals.clockEl.getElementById('date')