/**
 * Created by ASUS on 2017/9/26.
 */
// 游戏数据
var board=new Array();
// 分数
var score=0;

var hasConflicted=new Array();

$(document).ready(function () {
    prepareForMobile();
    newGame();
});

function prepareForMobile() {
    if(documentWidth>500){
        gridContainerWidth=500;
        cellSpace=20;
        cellSideLength=100;
    }
    $('#grid_container').css('width',gridContainerWidth-2*cellSpace);
    $('#grid_container').css('height',gridContainerWidth-2*cellSpace);
    $('#grid_container').css('padding',cellSpace);
    $('#grid_container').css('border-radius',0.02*gridContainerWidth);
    $('.grid_cell').css('width',cellSideLength);
    $('.grid_cell').css('height',cellSideLength);
    $('.grid_cell').css('border-radius',0.02*cellSideLength);
}

function newGame() {

    // 初始化棋盘格
    init();
    // 随机两个格子生成数字
    score=0;
    updateScore(score);
    generateOneNumber();
    generateOneNumber();

}

function init() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var gridCell = $("#grid_cell_" + i + "_" + j);
            // 格子位置生成
            gridCell.css("top", getPosTop(i, j));
            gridCell.css("left", getPosLeft(i, j));
        }
    }
    for(var i=0;i<4;i++){
        board[i]=new Array();
        hasConflicted[i]=new Array();
        for(var j=0;j<4;j++){
            board[i][j]=0;
            hasConflicted[i][j]=false;
        }
    }

    updateBoardView();
}

function updateBoardView() {
    $(".number_cell").remove();
    // var html='';
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            // html+='<div class="number_cell" id="number_cell_'+i+'_'+j+'"></div>';
            $("#grid_container").append('<div class="number_cell" id="number_cell_'+i+'_'+j+'"></div>');
            var theNumberCell=$("#number_cell_"+i+"_"+j);
            if(board[i][j]===0){
                theNumberCell.css("width","0");
                theNumberCell.css("height","0");
                theNumberCell.css("top",getPosTop(i,j)+cellSideLength/2);
                theNumberCell.css("left",getPosLeft(i,j)+cellSideLength/2);
            }else{
                theNumberCell.css("width",cellSideLength);
                theNumberCell.css("height",cellSideLength);
                theNumberCell.css("top",getPosTop(i,j));
                theNumberCell.css("left",getPosLeft(i,j));
                theNumberCell.css("background-color",getNumberCellBGColor(board[i][j]));
                theNumberCell.css("color",getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }

            hasConflicted[i][j]=false;
        }
        $('.number_cell').css('line-height',cellSideLength+'px');
        $('.number_cell').css('font-size',0.6*cellSideLength+'px');
        $('.number_cell').css('border-radius',0.02*cellSideLength);
    }

    // $("#grid_container").append(html);
}

function generateOneNumber(){
    if(nospace(board)){
        return false;
    }
    // 随机一个位置
    var randx=parseInt(Math.floor(Math.random()*4));//向上取整  0-3
    var randy=parseInt(Math.floor(Math.random()*4));
    while(true){
        if(board[randx][randy]===0){
            break;
        }
         randx=parseInt(Math.floor(Math.random()*4));//向上取整  0-3
         randy=parseInt(Math.floor(Math.random()*4));
    }
    // 随机一个数字
        var randNumber=Math.random()<0.5?2:4;

    // 在随机位置放置随机数
    board[randx][randy]=randNumber;

    showNumberWithAnimation(randx,randy,randNumber);
    return true;
}

$(document).keydown(function (e) {

    switch(e.keyCode){
        case 37://left
            e.preventDefault();
            if(moveLeft()){
            setTimeout("generateOneNumber()",210);
            setTimeout("isGameOver()",300);
            }
            break;
        case 38://up
            e.preventDefault();
            if(moveUp()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
            break;
        case 39://right
            e.preventDefault();
            if(moveRight()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
            break;
        case 40://down
            e.preventDefault();
            if(moveDown()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
            break;
        default:break;
    }
});

document.addEventListener('touchstart',function (event) {
    startx=event.touches[0].pageX;
    starty=event.touches[0].pageY;
});

document.addEventListener('touchend',function (event) {
    endx=event.changedTouches[0].pageX;
    endy=event.changedTouches[0].pageY;

    var deltax=endx-startx;
    var deltay=endy-starty;
    if(Math.abs(deltax)<0.3*documentWidth && Math.abs(deltay)<0.3*documentWidth){
     return;
    }
    if(Math.abs(deltax)>=Math.abs(deltay)){
        if(deltax>0){
            //moveright
            if(moveRight()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
        }else{
            //moveleft
            if(moveLeft()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
        }
    }else{
        if(deltay>0){
            //movedown
            if(moveDown()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
        }else{
            //moveup
            if(moveUp()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
        }
    }
});
function isGameOver() {
    if(nospace(board) && nomove(board)){
        gameOver();
    }
}

function gameOver() {
    alert("game over");
}

function moveLeft() {
    if(!canMoveLeft(board)){
        return false;
    }
    //moveLeft
    for(var i=0;i<4;i++){
        for(var j=1;j<4;j++){
            if(board[i][j]!=0){
                for(var k=0;k<j;k++){
                    if(board[i][k]==0 && noBlockHerizontal(i,k,j,board)){
                        //move
                        showMoveAnimation(i,j,i,k);
                        board[i][k]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }
                    else if(board[i][k]==board[i][j] && noBlockHerizontal(i,k,j,board) && !hasConflicted[i][k]){
                        //move
                        showMoveAnimation(i,j,i,k);
                        //add
                        board[i][k]+=board[i][j];
                        board[i][j]=0;
                        score+=board[i][k];
                        setTimeout("updateScore(score)",210);
                        hasConflicted[i][k]=true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    // updateBoardView();
    return true;
}

function moveRight() {
    if(!canMoveRight(board)){
        return false;
    }
    //moveRight
    for(var i=0;i<4;i++){
        for(var j=2;j>=0;j--){
            if(board[i][j]!=0){
                for(var k=3;k>j;k--){
                    if(board[i][k]==0 && noBlockHerizontal(i,j,k,board)){
                        //move
                        showMoveAnimation(i,j,i,k);
                        board[i][k]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }
                    else if(board[i][k]==board[i][j] && noBlockHerizontal(i,j,k,board) && !hasConflicted[i][k]){
                        //move
                        showMoveAnimation(i,j,i,k);
                        //add
                        board[i][k]+=board[i][j];
                        board[i][j]=0;
                        score+=board[i][k];
                        setTimeout("updateScore(score)",210);
                        hasConflicted[i][k]=true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    // updateBoardView();
    return true;
}

function moveUp() {
    if(!canMoveUp(board)){
        return false;
    }
    //moveUp
    for(var j=0;j<4;j++){
        for(var i=1;i<4;i++){
            if(board[i][j]!=0){
                for(var k=0;k<i;k++){
                    if(board[k][j]==0 && noBlockVertical(j,k,i,board)){
                        //move
                        showMoveAnimation(i,j,k,j);
                        board[k][j]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }
                    else if(board[k][j]==board[i][j] && noBlockVertical(j,k,i,board) && !hasConflicted[k][j]){
                        //move
                        showMoveAnimation(i,j,k,j);
                        //add
                        board[k][j]*=2;
                        board[i][j]=0;
                        score+=board[k][j];
                        setTimeout("updateScore(score)",210);
                        hasConflicted[k][j]=true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    // updateBoardView();
    return true;
}

function moveDown() {
    if(!canMoveDown(board)){
        return false;
    }
    //moveDown
    for(var j=0;j<4;j++){
        for(var i=2;i>=0;i--){
            if(board[i][j]!=0){
                for(var k=3;k>i;k--){
                    if(board[k][j]==0 && noBlockVertical(j,i,k,board)){
                        //move
                        showMoveAnimation(i,j,k,j);
                        board[k][j]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }
                    else if(board[k][j]==board[i][j] && noBlockVertical(j,i,k,board) && !hasConflicted[k][j]){
                        //move
                        showMoveAnimation(i,j,k,j);
                        //add
                        board[k][j]*=2;
                        board[i][j]=0;
                        score+=board[k][j];
                        setTimeout("updateScore(score)",210);
                        hasConflicted[k][j]=true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    // updateBoardView();
    return true;
}