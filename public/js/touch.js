var doc = document;

function array_from(list , handle){
  var ret = []
  for(var i = 0; i<list.length;i++){
    ret[i] = list[i]
  }
  return ret
}
function elementFromPoint(evt) {
  return array_from(evt.targetTouches).map(touch => doc.elementFromPoint(touch.clientX, touch.clientY)).filter(i => !!i)
}

function updateLeaveEnter(cur , last){
  var leave = last.filter(i => cur.every(j => j != i))
  var enter = cur .filter(i => last.every(j => j!=i ))
  leave.forEach(i => {
    emit(i, 'leave');
  })

  enter.forEach(i => {
    emit(i, 'enter');
  })

}


function emit(node, type, evt = {}) {
  var ne = document.createEvent('HTMLEvents');
  ne.initEvent(type, !!evt.bubbles, !!evt.canCancel);

  for (var p in evt) {
    if (!(p in ne)) {
      ne[p] = evt[p];
    }
  }

  return node.dispatchEvent(ne);
}

doc.addEventListener('DOMContentLoaded', function() {
  var hoverNode = [document.body];
  
  doc.addEventListener('touchstart', function(evt) {
   

  }, true);

  //为移出元素触发mytouchout，为移入元素触发mytouchover
  //touchmove事件只与触摸操作相关，不会具有mouseover、mouseout的效果
  doc.addEventListener('touchmove', function(evt) {
    var currentNode = elementFromPoint(evt);

    if (currentNode.length > 0) {
      updateLeaveEnter(currentNode , hoverNode)
    }
    hoverNode = currentNode

    evt.preventDefault();
  },{
      passive: false
  });

  doc.addEventListener('touchend', function(evt) {
    var currentNode = elementFromPoint(evt);
    if (currentNode.length > 0) {
      updateLeaveEnter(currentNode , hoverNode)
    }
    hoverNode = currentNode
    currentNode.forEach(i => {
      emit(i, 'release');
    })
  });
});