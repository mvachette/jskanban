# jskanban #

JsKanban is a small javascript lib to display a simple but useful virtual kanban board.

## Capabilities ##
### What it does? ###

- Display kanban columns and card
- Load data from JSON
- Card editing

### What it does'nt? ###
- Save cards state and positions (it should be done the way is yours, using the provided callback functions)

## How to use ##

jsKban is build on top of Jquery, JqueryUI and Undersocre JS, so you need to include it in your project.

jsKanban needs only a div to render into. 

The columns definitions shoud be declared when creatin the jsKanban object.

The cards should be avaliable in JSON format at an uri that should be specified in jsKanban options.

There is a simple but quite complete example (see the "example" folder).

Do not hesitate to read the source of the lib to discover all available options.


