
class WSClient {
  constructor(url){
    this.url = url
    this.create()
  }

  create(){
    let ws = this.ws = new WebSocket(this.url)
    ws.onopen = function() {
      console.log("connected");
    };

    ws.onclose = () => {
      console.log('close')
      //this.reconnect()
    };

    ws.onerror = (e) => {
      console.log(e)
    };

    ws.onmessage = function(resp) {
      
    };
    console.log(ws)
  }

  reconnect(){
    this.create()
  }

  send(data){
    this.ws.send(data)
  }
}

var ws = new WSClient('ws://' + location.hostname + ':8080')

var buttonMode = false

var keyMap = { 'u': 'w', 'r': 'd', 'd': 's', 'l': 'a', 'x': "g", 'y': "h", a: 'g', b: "h" }

// var keyMap = { 'u': 'up', 'r': 'right', 'd': 'down', 'l': 'left', 'x': "<", 'y': ">", a: '<', b: ">" }

var pressMap = {}

function onPress(key) {
    if (!pressMap[key]) {
        pressMap[key] = 1
        if (keyMap[key]) ws.send(JSON.stringify({ type: 'KEY_TOGGLE', key: keyMap[key] , t:Date.now() }))
    }
}

function onRelease(key) {
    if (pressMap[key]) {
        delete pressMap[key]
        if (keyMap[key]) ws.send(JSON.stringify({ type: 'KEY_TOGGLE', key: keyMap[key], pressed: false, t:Date.now() }))
    }
}

function padActionHandle(e) {
    pos = e.targetTouches[0]
    let releaseAll = true

    if (pos) {
        releaseAll = false
        let keys = calcKeyFromPad({ x: pos.clientX, y: pos.clientY })
        if (keys) {
            let release = Object.keys(pressMap).filter(i => keys.every(j => j != i))

            for (let key of keys) {
                onPress(key)
            }

            for (let key of release) {
                onRelease(key)
            }
            // release 掉
        }
    }

    if (releaseAll) {
        for (let i in pressMap) {
            onRelease(i)
        }
    }
}


function calcKeyFromPad({ x, y }) {
    let pad = $('.hot')[0].getBoundingClientRect()
    //半径
    let rad = pad.width / 2,
        cx = pad.x + rad,
        cy = pad.y + rad,
        invalidRad = rad * rad / 16

    let ctrlAngle = 60

    let toDeg = 180 / Math.PI
    //相对圆心距离
    let ix = x - cx,
        iy = y - cy

    let angle = Math.atan2(iy, ix) * toDeg

    let rules = ['' [0, ctrlAngle]]

    let z = ix * ix + iy * iy
    if (z < invalidRad) {
        // n
        return false
    }
    if (angle < 0) angle += 360

    let key = []
    if (angle < ctrlAngle || angle > 360 - ctrlAngle) {
        key.push('u')
    }
    if (angle > 90 - ctrlAngle && angle < 90 + ctrlAngle) {
        key.push('r')
    }
    if (angle > 180 - ctrlAngle && angle < 180 + ctrlAngle) {
        key.push('d')
    }
    if (angle > 270 - ctrlAngle && angle < 270 + ctrlAngle) {
        key.push('l')
    }

    return key
}

window.addEventListener('load', function() {

    document.addEventListener('gesturestart', function(event) {
        event.preventDefault()
    })

    document.querySelector('body').addEventListener('touchmove', function(e) {
        e.preventDefault();
    })

    $('[data-key]').on('touchstart enter', function() {
        var key = $(this).attr('data-key')
        onPress(key)
    })


    $('[data-key]').on('leave touchend release', function(e) {
        var key = $(this).attr('data-key')
        onRelease(key)
    })

    $('.hot').on('touchstart touchmove touchend', function(e) {
        padActionHandle(e)
    })

})