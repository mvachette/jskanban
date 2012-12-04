
# jskanban #

JsKanban is a small javascript lib to display a simple but useful virtual kanban board.

## Capabilities ##
### What does it do? ###

- Display kanban columns and card
- Load data from JSON
- Card editing

### What doesn't it do? ###
- Save cards state and positions (you should do it yourself, using the provided callback functions)

## How to use it ##

jsKban is built on top of Jquery, JqueryUI and Undersocre JS, so you need to include these libraries in your project.

jsKanban only needs a div to render into. 

The column definitions shoud be declared when creating the jsKanban object.

The cards should be available in JSON format at an URI that should be specified in the jsKanban options.

There is a simple but quite complete example (see the "example" folder).

Do not hesitate to read the source of the lib to discover all available options.


