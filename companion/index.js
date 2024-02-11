import { encode } from 'cbor'
import { me as companion } from "companion"
import { outbox } from "file-transfer"
import { settingsStorage } from "settings"
import { DUR_MIN, DUR_MAX } from './common'
import { TEMPO_MIN, TEMPO_MAX, SIG_MIN, SIG_MAX } from '../common/common'

;(function() {       //initialisation IIFE
  setDefaultSetting('sessionDur', {name:'30'})
  setDefaultSetting('flash', 'true')
  setDefaultSetting('vib', 'true')
  setDefaultSetting('label0', {name:'Adagio 4/4'})
  setDefaultSetting('tempo0', {name:'56'})
  setDefaultSetting('sig0', {name:'4'})
  setDefaultSetting('label1', {name:'Moderato 2/4'})
  setDefaultSetting('tempo1', {name:'112'})
  setDefaultSetting('sig1', {name:'2'})
  setDefaultSetting('label2', {name:'Allegro 6/8'})
  setDefaultSetting('tempo2', {name:'200'})
  setDefaultSetting('sig2', {name:'6'})

  settingsStorage.onchange = onSettingsChange

  //setDefaultSetting('vibTouch', 'true')

  if (companion.launchReasons.settingsChanged) getAndSendAllSettings()

  function setDefaultSetting(key, value) {
    let extantValue = settingsStorage.getItem(key)
    if (extantValue === null) {
      if (typeof(value) === 'object') value = JSON.stringify(value)
      settingsStorage.setItem(key, value)
    }
  }
})()

function getAndSendAllSettings() {
  let settings = {}

  addSetting(settings, 'sessionDur')
  addSetting(settings, 'down')
  addSetting(settings, 'flash')
  addSetting(settings, 'durInMetro')
  addSetting(settings, 'vib')
  addSetting(settings, 'shortVib')
  addSetting(settings, 'label0')
  addSetting(settings, 'tempo0')
  addSetting(settings, 'sig0')
  addSetting(settings, 'label1')
  addSetting(settings, 'tempo1')
  addSetting(settings, 'sig1')
  addSetting(settings, 'label2')
  addSetting(settings, 'tempo2')
  addSetting(settings, 'sig2')

  if (Object.keys(settings).length) sendSettings(settings)
}

function onSettingsChange(evt) {
  //console.log(`onSettingsChange() ${evt.key}=${evt.newValue} (${typeof evt.newValue})`);

  let setting = {}
  if (addSetting(setting, evt.key)) sendSettings(setting)
}

function addSetting(settings, key) {
  // Returns true if any settings were added.
  //console.log(`addSetting(): key=${key} initialised=${settingsStorage.getItem('initialised')} ready=${settingsStorage.getItem('ready')}`)

  let item = settingsStorage.getItem(key)
  if (item === undefined || item === null) return
  //console.log(`addSetting(): ${key}=${item} (${typeof item})`)
  let value
  switch(key) {
    case 'sessionDur':
      rangeCheck(DUR_MIN, DUR_MAX)
      if (!value) return false
      value *= 60000  // ms
      break
    case 'down':
    case 'flash':
    case 'durInMetro':
    case 'vib':
      value = item === 'true'
      break
    case 'shortVib':
      value = item !== 'true'
      break
    case 'label0':
    case 'label1':
    case 'label2':
      value = JSON.parse(item).name
      break
    case 'tempo0':
    case 'tempo1':
    case 'tempo2':
      rangeCheck(TEMPO_MIN, TEMPO_MAX)
      if (!value) return false
      break
    case 'sig0':
    case 'sig1':
    case 'sig2':
      rangeCheck(SIG_MIN, SIG_MAX)
      if (!value) return false
      break
    default:
      return false
  }

  settings[key] = value
  return true

  function rangeCheck(min, max) { // set value of item if it is between min and max (inclusive); undefined if not
    value = Number(JSON.parse(item).name)
    const isValid = Number.isInteger(value) && value>=min && value<=max
    //console.log(`${value} ${typeof value}`)
    if (!isValid) value = undefined
  }
}

function sendSettings(settings) {
  //console.log(`sendSettings: ${JSON.stringify(settings)} [${Object.keys(settings).length}]`);
  if (settings !== undefined) {
    outbox.enqueue('set.' + Date.now(), encode(settings))
  }
}