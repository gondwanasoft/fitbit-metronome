import * as fs from "fs"

export let state = {
  sessionDur: 30*60*1000,   // practice session duration (ms)
  down: false,              // session timer counts down to zero (backwards)
  flash: true,
  minorFill: '#80ff80',
  vib: true,
  shortVib: false,   // use VIBRATE_DURATION_SHORT for minor beats; else use VIBRATE_DURATION_LONG
  durInMetro: false,   // show duration widget in metronomePlayState
  presets: [
    {label:'Adagio 4/4', tempo:56, sig:4},
    {label:'Moderato 2/4', tempo:112, sig:2},
    {label:'Allegro 6/8', tempo:200, sig:6}
  ],
  customTempo: 100,
  customSig: 4
}

export function loadState() {
  // Returns true if state restored.
  let newState
  try {
    newState = fs.readFileSync("state.cbor", "cbor")
    state = newState
    //console.log(`loadState ${state.customTempo}`)
    return true
  } catch(err) {   // leave state as is
    //console.log(`state.cbor not found`);
  }
}

export function saveState() {
  //console.log(`saveState ${state.customTempo}`);
  fs.writeFileSync("state.cbor", state, "cbor")
}