function voteAssign(vote){
  currentNode.Nvote = vote;

  $("#voteUp").css("color", "gray");
  $("#voteDown").css("color", "gray");
  $("#voteAbs").css("color", "gray");
  console.log(vote)
  if(vote == 0){
    $("#voteAbs").css("color", "orange");

  }
  if(vote > 0){
    $("#voteUp").css("color", "green");
  }
  if(vote < 0){
    $("#voteDown").css("color", "red");
  }
  //set votes to DB
  var nodeDB = DB.child("vis/nodes/"+currentNode.id);

  nodeDB.child("votes/"+userObject.uid).set(vote);

  //set color
  nodeDB.child("votes").once("value", function(votesDB){
    var votesCount = 0;
    var numberOfVoters = 0;
    votesDB.forEach(function(voteDB){
      votesCount += voteDB.val();
      numberOfVoters ++;
    });
    if (numberOfVoters > 0){
      console.log(votesCount/numberOfVoters)
      var colorVotes = fromRedToGreen(votesCount/numberOfVoters);
      currentNode.color.background = colorVotes;

      nodeDB.update({color: {border: "gray", background: colorVotes}});

    } else {
      currentNode.color.background = "white";
      nodeDB.update({color: {border: "gray", background: "white"}});
    }

    //set to network
    network.manipulation.body.data.nodes.getDataSet().update(currentNode);

  })

}

function showNodeDetails(nodeData, callback){

  $("#interactionBox").show(100);
  currentNode = nodeData;
  currentNodeClbk = callback;
  $("#title").text(nodeData.label);

  //get node description from DB
  DB.child("vis/nodes/"+nodeData.id+"/description").once("value",function(descriptionSnapshot){

    if (descriptionSnapshot.val()){
      $("#description").text(descriptionSnapshot.val());
    } else {
      $("#description").text("Please add description...");
    }
  });
  if (!nodeData.type){
    nodeData.type = "option";
  }
  var radiobtn = document.getElementById(nodeData.type);
  radiobtn.checked = true;
}

function setDataFromForm(){

  console.log("enter input");
  var currentNodeDB = DB.child("vis/nodes/"+currentNode.id);

  currentNode.label =  $("#title").text();
  currentNode.description = $("#description").text()
  currentNode.type = $('input[name=group1]:checked', '#typeOfEntityForm')[0].id;


  //set to DB
  setNodeToDB(currentNode);

  switch (currentNode.type){
    case "option":
      currentNodeDB.child("shape").set("box");
      currentNodeDB.child("type").set("option");
      currentNodeDB.child("font").update({size:14, color: "black", face: "time"});
      currentNodeDB.child("borderWidth").set(2);
      currentNodeDB.child("color/border").set("#1f1f1f");

      currentNode.shape = "box";
      currentNode.font = "14px time black";
      currentNode.borderWidth = 2;
//      currentNode.color.background = "white";
      currentNode.color.border = "#1f1f1f";
      break;
    case "implication":

      currentNodeDB.child("color/border").set("gray");
      currentNodeDB.update({
        shape:"box",
        type: "implication",
        borderWidth:1,
        font:{
          face: "times",
          size: 11,
          color:"#262626"
        },
        shapeProperties:{
          borderDashes:true,
          borderRadius: 10
        }
      })

      currentNode.shape = "box";
      currentNode.font = "11px Times #454545";
      currentNode.borderWidth = 1;
      currentNode.color.border = "gray";

      break;
    case "question":
      currentNodeDB.child("shape").set("ellipse");
      currentNodeDB.child("color").set("#1919be");
      currentNodeDB.child("type").set("question");
      currentNodeDB.child("font/color").set("white");
      currentNodeDB.child("widthConstraint/maximum").set(5)
      currentNode.shape = "ellipse";
      currentNode.color = "#1919be";
      currentNode.font = "14px arial white";
//      currentNode.widthConstraint.maximum = 5;
      break;
    case "goal":
      currentNodeDB.child("shape").set("circle");
      currentNodeDB.child("color").set("#0b8b00");
      currentNodeDB.child("type").set("goal");
      currentNodeDB.child("font/color").set("white");
      currentNode.shape = "circle";
      currentNode.color = "#0b8b00";
      currentNode.font = "14px arial white";
      break;
    default:
      currentNodeDB.child("shape").set("box");
      currentNode.shape = "box";
  }

  //set to network
  network.manipulation.body.data.nodes.getDataSet().update(currentNode);

  $("#interactionBox").hide(100);
  currentNode = {};
}

function closeForm(){

  $("#interactionBox").hide(100);
}
