/**
 * Created by ASUS on 2017/9/26.
 */
function showNumberWithAnimation(i,j,randNumber){
    var numberCell=$("#number_cell_"+i+"_"+j);

     numberCell.css("backgroundColor",getNumberCellBGColor(randNumber));
     numberCell.css("color",getNumberColor(randNumber));
     numberCell.text(randNumber);

     numberCell.animate({
         width:cellSideLength,
         height:cellSideLength,
         top:getPosTop(i,j),
         left:getPosLeft(i,j)
     },50);
}

function showMoveAnimation(fromX,fromY,toX,toY) {
    var numberCell=$("#number_cell_"+fromX+"_"+fromY);
    numberCell.animate({
        top:getPosTop(toX,toY),
        left:getPosLeft(toX,toY)
    },200);
}

function updateScore(score) {
    $("#score").text(score);
}