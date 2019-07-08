function fromRedToGreen(value){
  value = value*-1
  if (value >= -1 && value <= 1){
    //value from -1 to 1
    console.log("value:", value)
    value = (value+1)/2
    //value from 0 to 1

    console.log("value:", value)
    var hue=((1-value)*120).toString(10);
    return ["hsl(",hue,",100%,50%)"].join("");
  } else {
    return "white";
  }
}

function deleteEmptyNodes(){
  //bring nodes
  DB.child("vis/nodes").once("value", function(dataSnapshot){
    dataSnapshot.forEach(function(nodeDataDB){

      if(nodeDataDB.val().label == null){
        DB.child("vis/nodes/"+nodeDataDB.key).remove();
      }
    })
  })
}
