var edgesPre = [];

//get initialize nodes from DB (promise)
var nodesPre = [];
function getNodesFromDB() {
  return new Promise(function(resolve, reject) {

    DB.child("vis/nodes").once("value", function(nodesSnapshot){
      nodesPre=[];
      nodesSnapshot.forEach(function(nodeSnapshop){
        nodesPre.push(nodeSnapshop.val())
      })

      nodes = new vis.DataSet(nodesPre);
//      console.log('nodes loaded');
      resolve();
    }).catch(function(err) {console.error(err); reject();});
  });
}

//get initilize edges from DB (promise)

function getEdgesFromDB() {
  return new Promise(function(resolve, reject) {

    DB.child("vis/edges").once("value", function(edgesSnapshot){
      edgesPre = [];
      edgesSnapshot.forEach(function(edgeSnapshot){
        edgesPre.push(edgeSnapshot.val())
      });
      edges = new vis.DataSet(edgesPre);
//      console.log('edges loaded');
      resolve();
    }).catch(function(err) {console.error(err); reject();});;
  });
}

// ------   Listen to nodes -----------
//node changed
function listenToNodes(){

  //node changed
  DB.child("vis/nodes").on("child_changed",function(nodeSnap){
//    console.log("node changed: "+ nodeSnap.key)

    //find in nodesPre
    for (i in nodesPre){
      if (nodesPre[i].id == nodeSnap.key){
        //adjust to new values
        nodesPre[i] = nodeSnap.val();
        break;
      }
    }

    nodes = new vis.DataSet(nodesPre);

    //redraw node on map
    network.setData({nodes: nodes, edges: edges})

  });

  //node added
  DB.child("vis/nodes").on("child_added",function(nodeSnap){
//    console.log("node to be added: "+ nodeSnap.key);

    if(!nodeSnap.val().label){
//      console.log("node "+nodeSnap.key+" has no label");
      deleteEmptyNodes();
    } else{

      //check to see if node is already in the array of nodes (usaly happen when first time loading)
      var isNodeInArray = false;

      for (i in nodesPre){
        if (nodesPre[i].id === nodeSnap.key){
//          console.log("Node is in the array. will not load it");
          isNodeInArray = true;
          break;
        }
      }
      if (!isNodeInArray){ //if noad is not in array - set it to map

        nodesPre.push(nodeSnap.val());

        nodes = new vis.DataSet(nodesPre);
        edges = new vis.DataSet(edgesPre);

        //redraw node on map
        network.setData({nodes: nodes, edges: edges});
        console.log("node "+nodeSnap.key+" added from DB")
      }
    }
  })

  //node deleted
  DB.child("vis/nodes").on("child_removed", function(deletedNode){
    for (i in nodesPre){
      if(nodesPre[i].id == deletedNode.key){
        nodesPre.splice(i,1);
        break;
      }
    }
    nodes = new vis.DataSet(nodesPre);

    //redraw new map
    network.setData({nodes: nodes, edges: edges})
  })
};


// --- listen to edges ----
function listenToEdges(){

  //edge added
  DB.child("vis/edges").on("child_added",function(edgeSnap){

//    console.log("edge added")
    if (!edgeSnap.val().id){
      //if it has no id, don't upload it
      console.log("edge "+ edgeSnap.key + " has no id");
    } else {
//      console.log("edge: "+edgeSnap.key )
      var isInArray = false;
      for (i in edgesPre){
        if(edgesPre[i].id == edgeSnap.key){
          isInArray = true;
//          console.log("Edge is in the array. will not reload it")
          break;
        }
      }
      if(!isInArray){
        edgesPre.push(edgeSnap.val());
        console.dir(edgesPre)
        edges = new vis.DataSet(edgesPre);
        console.dir(edges)

        //redraw edge on map
        //          network.setData({nodes: nodes, edges: edges})
      }
    }
  });

  //edge deleted
  DB.child("vis/edges").on("child_removed",function(edgeSnap){
    console.log("edge deleted");

    for (i in edgesPre){
      if(edgesPre[i].id == edgeSnap.key){
        edgesPre.splice(i,1);
        break;
      }
    }
    edges = new vis.DataSet(edgesPre);

    //redraw edge on map
    network.setData({nodes: nodes, edges: edges})
  })
}

//edge changed


