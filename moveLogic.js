export default function move(gameState){
    let moveSafety = {
        up: true,
        down: true,
        left: true,
        right: true
    };
    let priorityMoves = {
        up: false,
        down: false,
        left: false,
        right: false
    }
    let riskyMoves = {
        up: false,
        down: false,
        left: false,
        right: false
    };
    
    // We've included code to prevent your Battlesnake from moving backwards
    
    const myHead = gameState.you.body[0];
    const myNeck = gameState.you.body[1];

    function safeBack(){
        moveSafety.left  = (myNeck.x < myHead.x) ? false : moveSafety.left;
    moveSafety.right  = (myNeck.x > myHead.x) ? false : moveSafety.right;
    moveSafety.down  = (myNeck.y < myHead.y) ? false : moveSafety.down;
    moveSafety.up  = (myNeck.y > myHead.y) ? false : moveSafety.up;
    }
    safeBack()
    
    // TODO: Step 1 - Prevent your Battlesnake from moving out of bounds
    function bounds(){
        moveSafety.left = (myHead.x == 0) ? false : moveSafety.left
        moveSafety.right = (myHead.x == (gameState.board.width) -1) ? false : moveSafety.right
        moveSafety.down = (myHead.y == 0) ? false : moveSafety.down
        moveSafety.up = (myHead.y == (gameState.board.height) -1) ? false : moveSafety.up
    }
    bounds()
    
    // TODO: Step 2 - Prevent your Battlesnake from colliding with itself
    let myBody = gameState.you.body
    function selfPreservation(){
        for(let i = 1; i < myBody.length - 1; i++){
            moveSafety.right = (myHead.x + 1 == myBody[i].x  && myHead.y == myBody[i].y) ? false : moveSafety.right
            moveSafety.left = (myHead.x  -1 == myBody[i].x && myHead.y == myBody[i].y) ? false : moveSafety.left
            moveSafety.up = (myHead.x == myBody[i].x  && myHead.y + 1== myBody[i].y ) ? false : moveSafety.up
            moveSafety.down = (myHead.x == myBody[i].x && myHead.y -1 == myBody[i].y) ? false : moveSafety.down
        }
    }
    selfPreservation()
    
    
    // TODO: Step 3 - Prevent your Battlesnake from colliding with other Battlesnakes


    for (let j = 0; j < gameState.board.snakes.length; j++) {
        let enemySnake = gameState.board.snakes[j];
        if (enemySnake.id === gameState.you.id) continue;
        //prevents me hitting the bodies
        function enemyDodging(){
            for (let i = 0; i < enemySnake.body.length; i++) {
                const enemyBody = enemySnake.body[i];
                moveSafety.right = (myHead.x + 1 == enemyBody.x && myHead.y == enemyBody.y) ? false : moveSafety.right
                moveSafety.left = (myHead.x - 1 == enemyBody.x && myHead.y == enemyBody.y) ? false : moveSafety.left
                moveSafety.up = (myHead.x == enemyBody.x && myHead.y + 1 == enemyBody.y) ? false : moveSafety.up
                moveSafety.down = (myHead.x == enemyBody.x && myHead.y - 1 == enemyBody.y) ? false : moveSafety.down
            }
            
        }
        enemyDodging()
        let enemyHead = enemySnake.body[0];
        let myLength = gameState.you.body.length;
        let enemyLength = enemySnake.body.length;
    
        //only applies if they are longer (where I would lose)
        if (enemyLength >= myLength) {
            let enemyMoves = [
                { x: enemyHead.x + 1, y: enemyHead.y },
                { x: enemyHead.x - 1, y: enemyHead.y },
                { x: enemyHead.x,     y: enemyHead.y + 1 },
                { x: enemyHead.x,     y: enemyHead.y - 1 },
            ];
            for (const move of enemyMoves) {
                if (myHead.x + 1 === move.x && myHead.y === move.y) {
                    moveSafety.right = false;
                    riskyMoves.right = true
                }
                if (myHead.x - 1 === move.x && myHead.y === move.y) {
                    moveSafety.left = false;
                    riskyMoves.left = true
                }
                
                if (myHead.x === move.x && myHead.y + 1 === move.y) {
                    moveSafety.up = false;
                    riskyMoves.up = true
                }
                if (myHead.x === move.x && myHead.y - 1 === move.y) {
                    moveSafety.down = false;
                    riskyMoves.down = true
                }
            }
            enemyDodging()
            selfPreservation()
        }
    }

    // TODO: Step 4 - Move towards food instead of random, to regain health and survive longer
    // gameState.board.food contains an array of food coordinates https://docs.battlesnake.com/api/objects/board
    
    function findClosestFood(locations){
        let totalDis = Math.abs(myHead.y - locations[0].y) + Math.abs(myHead.x - locations[0].x)
        let totalIndex = 0
        for(let i = 0; i < locations.length; i++){
            let xDis = Math.abs(myHead.x - locations[i].x)
            let yDis = Math.abs(myHead.y - locations[i].y)
            let newtotalDis = xDis + yDis
            
            if(newtotalDis < totalDis){
                totalDis = newtotalDis
                totalIndex = i
            }
        }
        return totalIndex
    }

    if(gameState.you.health < 50){
        let foodSpot = gameState.board.food[findClosestFood(gameState.board.food)]
        priorityMoves.right = (foodSpot.x > myHead.x) ? true : priorityMoves.right
        priorityMoves.left = (foodSpot.x < myHead.x) ? true : priorityMoves.left
        priorityMoves.up = (foodSpot.y > myHead.y) ? true : priorityMoves.up
        priorityMoves.down = (foodSpot.y < myHead.y) ? true : priorityMoves.down
    }
    
    // Are there any safe moves left?
    
    //Object.keys(moveSafety) returns ["up", "down", "left", "right"]
    //.filter() filters the array based on the function provided as an argument (using arrow function syntax here)
    //In this case we want to filter out any of these directions for which moveSafety[direction] == false
    const safeMoves = Object.keys(moveSafety).filter(direction => moveSafety[direction]);
    const priorityMovesFinal = Object.keys(priorityMoves).filter(direction => priorityMoves[direction]);
    const riskyOptions = Object.keys(riskyMoves).filter(direction => riskyMoves[direction]);

    if (safeMoves.length == 0) {
        if(riskyOptions.length != 0){
            console.log(`MOVE ${gameState.turn}: RISKY TIME`)
        return { move: riskyOptions[Math.floor(Math.random() * riskyOptions.length)] };
        }
        console.log(`MOVE ${gameState.turn}: Death is EVERYWHERE`)
        return { move: moveSafety[Math.floor(Math.random() * moveSafety.length)] };
    }
    
    let futureSenseMoves = safeMoves.filter(move => futureSense(move, gameState, 5));

    let nextPriorityMove1 = priorityMovesFinal[0]; // only 2 options for food, its either up/down, or left/right
    let nextPriorityMove2 = priorityMovesFinal[1];

    if (futureSenseMoves.includes(nextPriorityMove1)) {
        console.log(`Priority FutureSense MOVE (1) ${gameState.turn}: ${nextPriorityMove1}`);
        return { move: nextPriorityMove1 };
    } else if (futureSenseMoves.includes(nextPriorityMove2)) {
        console.log(`Priority FutureSense MOVE (2) ${gameState.turn}: ${nextPriorityMove2}`);
        return { move: nextPriorityMove2 };
    } else if (futureSenseMoves.length > 0) {
        const bestMove = futureSenseMoves[Math.floor(Math.random() * futureSenseMoves.length)];
        console.log(`FutureSense MOVE ${gameState.turn}: ${bestMove}`);
        return { move: bestMove };
    }

    if(safeMoves.includes(nextPriorityMove1)){
        console.log(`Priority MOVE (1) ${gameState.turn}: ${nextPriorityMove1}`)
        return { move: nextPriorityMove1 };
    } else if (safeMoves.includes(nextPriorityMove2)) {
        console.log(`Priority MOVE (2) ${gameState.turn}: ${nextPriorityMove2}`)
        return { move: nextPriorityMove2 };
    }
    let nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)]
    console.log(`MOVE ${gameState.turn}: ${nextMove}`)
    return { move: nextMove };
}
// checks for dead ends
function futureSense(move, gameState, depth) {
    const newGameState = JSON.parse(JSON.stringify(gameState));

    const newHead = { ...newGameState.you.body[0] };
    if (move == "up") newHead.y += 1;
    if (move == "down") newHead.y -= 1;
    if (move == "left") newHead.x -= 1;
    if (move == "right") newHead.x += 1;

    newGameState.you.body.unshift(newHead);
    newGameState.you.health -= 1;
    if (
        newHead.x < 0 || newHead.x >= newGameState.board.width ||
        newHead.y < 0 || newHead.y >= newGameState.board.height
    ){
        return false;
    } 

    for (let i = 1; i < newGameState.you.body.length; i++) {
        if (newHead.x == newGameState.you.body[i].x &&
            newHead.y == newGameState.you.body[i].y) {
            return false;
        }
    }

    for (let snake of newGameState.board.snakes) { // so much easier than a normal for loop
        if (snake.id == newGameState.you.id) continue; // once again ignore myself
        for (let body of snake.body) { // for each snake (doesn't account for them moving yet)
            if (newHead.x == body.x && newHead.y == body.y) {
                return false;
            }
        }
    }
    if (depth <= 0) {
        return true;
    }
    const nextMoves = ["up", "down", "left", "right"];
    for (let nextMove of nextMoves) {
        if (futureSense(nextMove, newGameState, depth - 1)) {
            return true;
        }
    }

    return false;
}