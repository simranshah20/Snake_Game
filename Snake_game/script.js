document.addEventListener('DOMContentLoaded',function(){
    const gameArena=document.getElementById('game-arena');
    console.log(gameArena);

    const arenaSize=600;
    const cellSize=20;
    let score=0;   //updatable 
    let gameStarted=false;   //shows game status
    let food={x:300,y:200};   //x:15*cellSize(i.e 20),y:10*cellSize(i.e 20)  convert cell co-ordnate -> pixel //top left pixels
    let snake=[{x:160,y:200},{x:140,y:200},{x:120,y:200}];  //size of cell covered by snake in an array


    //for movement of snake
    let dx=cellSize; //+20 rightside    
    let dy=0;
    let intervalId;
    let gameSpeed=200;

    function moveFood(){
        let newX,newY;
        do{
           newX=Math.floor(Math.random()*30)*cellSize;
           newY=Math.floor(Math.random()*30)*cellSize;
        }while(snake.some(snakeCell => snakeCell.x===newX && snakeCell.y===newy));  //checks snake body part's position with food's position
        food={x:newX,y:newY};
    }
    function updateSnake(){
        const newHead={x:snake[0].x+dx,y:snake[0].y+dy};  //snake[0].x mean x of old  head and dx mean x of new co-ordinated which is added to the head to create new head 
        snake.unshift(newHead); //add new head to snake

        //check collision with food
        if(newHead.x===food.x && newHead.y===food.y){
            score+=10; //add 10 marks on old score 
            moveFood();

            //increase the speed of the game
            if(gameSpeed>60){
             clearInterval(intervalId);
            gameSpeed-=5;   //decrease speed by 10
            gameLoop();
            }
        }
        else{
            snake.pop();  //remove tail
        }
    }   
     
    function changeDirection(e){
     console.log("Key Pressed",e);
     //corner cases
     const isGoingdown=dy===cellSize;  //dy===cellSize do if you are going upward and pressed downward key then nothing should be happend
     const isGoinUp=dy===-cellSize;
     const isGoingRight=dx===cellSize;
     const isGoingLeft=dx===-cellSize;
     if(e.key==='ArrowUp' && !isGoingdown){  //dy==-cellSize  check you are already going in upward direction
      dx=0;
      dy=-cellSize;
     }
     else if(e.key==='ArrowDown' && !isGoinUp){
        dx=0;
        dy=cellSize;
     }
     else if(e.key==='ArrowLeft'  && !isGoingRight){
        dx=-cellSize;
        dy=0;
     }
     else if(e.key==='ArrowRight' && !isGoingLeft){
        dx=cellSize;
        dy=0;
     }
    }
    
    function drawDiv(x,y,className){
     const divElement=document.createElement('div');
     divElement.classList.add(className);
     divElement.style.top=`${y}px`;
     divElement.style.left=`${x}px`;
     return divElement;
    }

    function drawFoodAndSnake(){
        gameArena.innerHTML=''; //clear the game arena
        //wipe out everything and  redraw with new positions
        snake.forEach((snakeCell)=>{
            const snakeElement=drawDiv(snakeCell.x,snakeCell.y,'snake');  //change direction whe key is pressed
            gameArena.appendChild(snakeElement);
        })
       const foodElment=drawDiv(food.x,food.y,'food');
       gameArena.appendChild(foodElment);
    }

    function isGameOver(){
        //checks snake body collision
        for(let i=1;i<snake.length;i++){
            if(snake[0].x===snake[i].x && snake[0].y===snake[i].y){
                return true;
            }
        }
        //checks wall collision
        const hitLeftWall=snake[0].x<0;   //snake[0]->head
        const hitRightWall=snake[0].x>arenaSize - cellSize; 
        const hitTopWall=snake[0].y<0;
        const hitButtomWall=snake[0].y>arenaSize - cellSize; 
        return hitLeftWall || hitRightWall || hitTopWall ||hitButtomWall;

    }

    function gameLoop(){
        intervalId=setInterval(()=>{
            if(isGameOver()){
                clearInterval(intervalId);
                gameStarted=false;
                alert('Game Over'+'\n'+'Your score:'+score);
                return;
            }
            updateSnake();
            drawFoodAndSnake();
            showScoreBoard();
        },gameSpeed);
    }

    function runGame(){
        if(!gameStarted){
            gameStarted=true;
            document.addEventListener('keydown',changeDirection);
            gameLoop()
        }
    }
     
    function showScoreBoard(){
        const scoreBoard=document.getElementById('#score-board');
        scoreBoard.style.fontSize="30px";
        scoreBoard.style.fontWeight="bold";
        scoreBoard.style.margin="10px 0";
        scoreBoard.textContent=`Score: ${score}`;
    }

    function initiateGame(){
    const scoreBoard=document.createElement("div");  //create div
    scoreBoard.id='#score-board';  //give div id name as "score-board"
    document.body.insertBefore(scoreBoard,gameArena);  //div is inserted before gameArena

    const startButton=document.createElement('button');
    startButton.textContent=('Start Game'); // add content i.e start game on button
    startButton.classList.add('start-button'); //give class name as start-game

    startButton.addEventListener('click',function startGame(){
     startButton.style.display='none';  //hide start button

     runGame();  //calls function runGame
    })
    document.body.appendChild(startButton);  //button will be created after gameArena
    }
    initiateGame();
})