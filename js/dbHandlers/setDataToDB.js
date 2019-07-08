function changeNodePositionDB (nodeId,x,y){
  DB.child("vis/nodes/"+nodeId).update({x:x,y:y})
}

// setNodeToDB

function setNodeToDB(node){

  var currentNodeDB = DB.child("vis/nodes/"+node.id);
  node.shadow = true;
  console.log("create node from DB 'setNodeToDB'")
  currentNodeDB.update(node);
}

// setEdgeToDB

function setEdgeToDB(edge){
  if(!edge.id){
    console.log("Error: no edge id")
  }else{
    var currentEdgeDB = DB.child("vis/edges/"+edge.id);
    edge.shadow = true;
    currentEdgeDB.update(edge);
  }
}

// delete node

function deleteNodeFromDB (nodeID){
  var currentNodeDB = DB.child("vis/nodes/"+nodeID);
  currentNodeDB.remove();
}

//delete edge

function deleteEdgeFromDB (edgeID){
  var currentEdgeDB = DB.child("vis/edges/"+edgeID);
  currentEdgeDB.remove();
  //dfdf

}


function addNode(label, x, y, shape, color) {

  if(label && x && y) {
    network.addNodeMode();
    var nodeData = { id:vis.util.randomUUID(),
                    label: label,
                    x: x,
                    y: y,
                    shape: shape,
                    color: color,
                    shadow:true
                   };
    if (nodeData !== null && nodeData !== undefined && network.manipulation.inMode === 'addNode') {
      DB.child("vis/nodes/"+nodeData.id).set(nodeData);
      network.manipulation.body.data.nodes.getDataSet().add(nodeData);
    }
    network.disableEditMode();
  }
}
