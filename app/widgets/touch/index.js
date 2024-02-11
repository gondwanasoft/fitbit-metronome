import { constructWidgets } from "../construct-widgets"

const DOUBLE_TAP_INTERVAL_MAX = 500   // ms between touches to register as a double-tap

const construct = (el) => {
  // el: the element object returned by getElementsByTypeName().

  const touchRectEl = el.getElementById('touchRect')

  let singleClickListener, doubleClickListener
  let timer

  Object.defineProperty(el, 'ondoubleclick', {
    set(newValue) {   // if newValue is undefined, extant listener will be removed
      if (timer !== undefined) {clearTimeout(timer); timer = undefined}
      doubleClickListener = newValue
      touchRectEl.onclick = doubleClickListener? onRectTouch : undefined
      //console.log(`ondoubleclick ${0}`)
    }
  })

  /*el.ondoubleclick = listener => {
    doubleClickListener = listener
    touchRectEl.onclick = onRectTouch
  }*/

  function onRectTouch(evt) {
    //console.log(`onRectTouch ${0}`)
    if (timer === undefined) {   // this is not the second tap of a double-tap
      timer = setTimeout(() => {
        timer = undefined
        if (singleClickListener) singleClickListener(evt)
      }, DOUBLE_TAP_INTERVAL_MAX)
    } else {    // this is the second tap of a double-tap
      clearTimeout(timer)
      timer = undefined
      if (doubleClickListener) doubleClickListener(evt)
    }
  }

  return el
}

constructWidgets('touchWidget', construct)
