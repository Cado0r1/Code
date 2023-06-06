turn = 0

function pressed(id){
    if (document.getElementById(id).innerHTML == ''){
        if (turn % 2 == 0){
            document.getElementById(id).innerHTML = 'X'
            document.getElementById('turn_num').innerHTML = 'Player Turn: O'
        }
        else{
            document.getElementById(id).innerHTML = 'O'
            document.getElementById('turn_num').innerHTML = 'Player Turn: X'
        }
        turn +=1
    }
    else{
        console.log('This is occupied')
    }
}