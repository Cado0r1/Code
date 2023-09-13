function timedCount() {
    if(i == 0){
        j--
        i = 60
    }
  i--;
  if(i <= 9){
    postMessage(j+':0'+i);
  }
  else{
    postMessage(j+':'+i);
  }
  setTimeout("timedCount()",1000);
}

onmessage = function(event) {
  var array = event.data.split(':');
  j = array[0]
  i = array[1]
  timedCount();
}