var edges;
var nodes;
var network;

var currentNode = {};
var currentNodeClbk;

var options = {
  autoResize:false,
  manipulation: {
    enabled:true,
    initiallyActive:true,
    addNode: function(nodeData,callback) {

      setNodeToDB(nodeData);
      // DB.child("vis/nodes/"+nodeData.id).set({id:nodeData.id, label: nodeData.label, x: nodeData.x, y: nodeData.y,shape: "circle", color:{border:"gray", background:"white"}});
      callback(nodeData);
    },
    deleteNode: function (deleteData, callback){
      console.dir(deleteData)
      console.log(deleteData.nodes[0])
      //remove node
      deleteNodeFromDB(deleteData.nodes[0]);
      // DB.child("vis/nodes/"+deleteData.nodes[0]).remove();
      //remove edges
      for (edgeId in deleteData.edges) {
        deleteEdgeFromDB(edgeId);
      }
      // var deletedEdges = deleteData.edges;
      // for (i in deletedEdges){
      //   DB.child("vis/nodes/"+deletedEdges[i]).remove();
      // }

    },
    addEdge: function(edgeData,callback) {
      if (edgeData.from === edgeData.to) {
        var r = confirm("Do you want to connect the node to itself?");
        if (r === true) {
          DB.child("vis/edges/"+edgeData.id).set({from:edgeData.from, to:edgeData.to})
          callback(edgeData);
        }
      }
      else {
        //create node on canvas and send to DB
//        setEdgeToDB(edgeData);
        callback(edgeData);
//        var x = DB.child("vis/edges/"+edgeData.id).set({from:edgeData.from, to:edgeData.to, id: edgeData.id});
        setEdgeToDB(edgeData);
      }
    },
    deleteEdge: function (edgeData, callback){
      console.dir(edgeData);
      deleteEdgeFromDB(edgeData.edges[0]);
      callback(edgeData);
      // DB.child("vis/edges/"+edgeData.edges[0]).remove();
    },
    editNode: function(nodeData,callback) {
      showNodeDetails(nodeData, callback);
      //      callback(nodeData);
    }
  },
  physics:{
    enabled: false
  },
  edges:{
    arrows:{
      to:{
        enabled: true
      }
    },
    smooth:{
      type:"continuous"
    }
  },
  autoResize: false,
  interaction: {
    dragView:true,
    multiselect: true,
    navigationButtons:true
  }
}

function initNetwork(containerName, width, height, seed) {

  if(!edges) {
    console.error('no edges');
    return 'no edges for network!'
  }

  if(!nodes) {
    console.error('no nodes');
    return 'no nodes for network!'
  }

  var container = document.getElementById(containerName); //mynetwork

  // provide the data in the vis format
  var data = {
    nodes: nodes,
    edges: edges
  };



  // initialize your network!
  network = new vis.Network(container, data, options);
  network.setOptions(options);
  network.setSize(width,height); //1300px, 650px

  network.on("doubleClick", function (params) {
    if(params.nodes.length == 0 && params.edges.length == 0 && params.pointer) {
      addNode('new', params.pointer.canvas.x, params.pointer.canvas.y, 'circle', 'cyan');
    }
    else if (params.nodes.length == 1) {
      showNodeDetails(getNodeById(params.nodes[0]), null);//check
    }
  });

  network.on("dragEnd", function(e){
    var nodeId = e.nodes[0];
    var nodeX = e.pointer.canvas.x;
    var nodeY = e.pointer.canvas.y;
    changeNodePositionDB(nodeId, nodeX, nodeY);
  });

}


//click events




var preiviousTime = new Date();
preiviousTime = preiviousTime.getMilliseconds()


function setNewNode(){
  network.addNodeMode();
}

function newNode(){
  console.log("new node clicked")
}

function isDblClick (){
  var currentTime = new Date();
  var deltaTimes = currentTime - preiviousTime;

  preiviousTime = currentTime;
  maxDelta = 250; //time for dbl click
  if (deltaTimes >maxDelta){
    return false;
  } else {
    return true;
  }

}

function getNodeById(nodeId){
  var foundNode = null;
  network.manipulation.body.data.nodes.forEach(function(node){
    if(node.id == nodeId){
      foundNode = node;
    }
  })
  return foundNode;
}

var optionsClust = {
  joinCondition: function (nodeOptions){
    return nodeOptions.cid === 1;
  }
}

function clusterNodes(){
  network.clustering.cluster(optionsClust);
}
