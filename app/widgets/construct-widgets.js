// This file should not need to be customised when developing your own widgets.

// The functions in this module could be transferred to the widget's index.js, but keeping them in a separate module
// simplifies the widget-specific code in index.js and is more efficient if multiple widget types are
// used in a project.

import document from 'document';

export const constructWidgets = (widgetType, construct) => {
  // Finds widget elements of the specified type in the current document and calls construct() for each instance.
  // Ignores widgets that have class 'widget-manual'.
  // Searching the whole document for widgets is slow if the SVG is large.
  // Moreover, if SVG documents are loaded dynamically, the appraoch taken here will probably not work.
  const widgets = document.getElementsByTypeName(widgetType);
  widgets.forEach(widget => {
    const classes = widget.class.split(' ');  // array of all class names
    if (widget.id !== widget.type && classes.indexOf('widget-manual') < 0) { // .id!==.type selects <use> and rejects <symbol> in SDK4 on watch
      widget.class = widget.class;    // bring forward (ie, trigger) application of CSS styles
      construct(widget);
    }
  });
}

export const parseConfig = (el, callback) => {
  // Calls callback with {name:attributeName, value:attributeValue} for every value found in el's config element.
  const config = el.getElementById('config').text;
  if (config === "") return;

  const attributes = config.split(';');
  attributes.forEach(attribute => {
    const colonIndex = attribute.indexOf(':')
    if (colonIndex > 0) {   // to ignore trailing ; and malformed attributes
      const attributeName = attribute.substring(0, colonIndex).trim();
      const attributeValue = attribute.substring(colonIndex+1).trim();
      callback({name:attributeName, value:attributeValue});
    }
  });
}