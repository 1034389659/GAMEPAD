const robot = require("robotjs");

robot.setKeyboardDelay(0)

const pressedToState = {
  true: 'down',
  false: 'up'
}

module.exports = function (message) {
  let data = JSON.parse(message)
  let { type , ...action } = data
  let now = Date.now()
  console.log('+'+(now-data.t)+' ms',message,)

  if(type == 'MOUSE_MOVE'){
    let { x:dx, y:dy, scroll } = action
    if (!scroll) {
      let { x, y } = robot.getMousePos()
      
      robot.moveMouse(x + dx, y + dy)
    }else{
      dy = dy > 0 ? 1 : -1
      robot.scrollMouse(0, dy)
    }
  }
  else if( type == 'MOUSE_CLICK' ){
    let { button, double = false } = action
    robot.mouseClick(button, double)
  }
  else if( type == 'KEY_PRESS'){

    let modified = []
    if( action.alt ) modified.push('alt')
    if( action.command ) modified.push('command')
    if( action.control ) modified.push('control')
    if( action.shift ) modified.push('shift')

    robot.keyTap(key , modified)
  }
  else if( type == 'KEY_TOGGLE'){
    let { key, pressed = true} = action
    const state = pressed ? 'down' : 'up'
    if (key === 'meta') key = 'command'
    robot.keyToggle(key, state)
  }
}