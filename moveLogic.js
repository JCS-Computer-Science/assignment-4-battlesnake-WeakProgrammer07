export default function move(gameState){
    let moveSafety = {
        up: true,
        down: true,
        left: true,
        right: true
    };
    
    // We've included code to prevent your Battlesnake from moving backwards
    const myHead = gameState.you.body[0];
    const myNeck = gameState.you.body[1];
    
    
    if (myNeck.x < myHead.x) {        // Neck is left of head, don't move left
        moveSafety.left = false;
        
    } else if (myNeck.x > myHead.x) { // Neck is right of head, don't move right
        moveSafety.right = false;
        
    } else if (myNeck.y < myHead.y) { // Neck is below head, don't move down
        moveSafety.down = false;
        
    } else if (myNeck.y > myHead.y) { // Neck is above head, don't move up
        moveSafety.up = false;
    }
    
    // TODO: Step 1 - Prevent your Battlesnake from moving out of bounds
    // gameState.board contains an object representing the game board including its width and height
    // https://docs.battlesnake.com/api/objects/board

    if(myHead.x == 0){
        moveSafety.left = false;
    }

    if(myHead.x == (gameState.board.width) -1){
        moveSafety.right = false;
    }

    if(myHead.y == 0){
        moveSafety.down = false;
    }

    if(myHead.y == (gameState.board.height) -1){
        moveSafety.up = false;
    }
    
    // TODO: Step 2 - Prevent your Battlesnake from colliding with itself
    // gameState.you contains an object representing your snake, including its coordinates
    // https://docs.battlesnake.com/api/objects/battlesnake
    
    for(let i = 1; i < gameState.you.body.length - 1; i++){
        if(myHead.x + 1 == gameState.you.body[i].x  && myHead.y == gameState.you.body[i].y){
            moveSafety.right = false;
        }
        if(myHead.x  -1 == gameState.you.body[i].x && myHead.y == gameState.you.body[i].y){
            moveSafety.left = false;
        }
        if(myHead.x == gameState.you.body[i].x  && myHead.y + 1== gameState.you.body[i].y ){
            moveSafety.up = false;
        }
        if(myHead.x == gameState.you.body[i].x && myHead.y -1 == gameState.you.body[i].y){
            moveSafety.down = false;
        }
    }
    
    // TODO: Step 3 - Prevent your Battlesnake from colliding with other Battlesnakes
    // gameState.board.snakes contains an array of enemy snake objects, which includes their coordinates
    // https://docs.battlesnake.com/api/objects/battlesnake
    let riskyMoves = {
        up: false,
        down: false,
        left: false,
        right: false
    };

    for (let j = 0; j < gameState.board.snakes.length; j++) {
        
        let enemySnake = gameState.board.snakes[j];
        if (enemySnake.id === gameState.you.id) continue;
        //prevents me hitting the bodies
        for (let i = 0; i < enemySnake.body.length; i++) {
            const segment = enemySnake.body[i];
       
            if (myHead.x + 1 == segment.x && myHead.y == segment.y) {
                moveSafety.right = false;
                riskyMoves.right = true
            }
            if (myHead.x - 1 == segment.x && myHead.y == segment.y) {
                moveSafety.left = false;
                riskyMoves.left = true
            }
            if (myHead.x == segment.x && myHead.y + 1 == segment.y) {
                moveSafety.up = false;
                riskyMoves.up = true
            }
            if (myHead.x == segment.x && myHead.y - 1 == segment.y) {
                moveSafety.down = false;
                riskyMoves.down = true
            }
        }

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
                }
                if (myHead.x - 1 === move.x && myHead.y === move.y) {
                    moveSafety.left = false;
                }
                if (myHead.x === move.x && myHead.y + 1 === move.y) {
                    moveSafety.up = false;
                }
                if (myHead.x === move.x && myHead.y - 1 === move.y) {
                    moveSafety.down = false;
                }
            }
        }
    }

    // TODO: Step 4 - Move towards food instead of random, to regain health and survive longer
    // gameState.board.food contains an array of food coordinates https://docs.battlesnake.com/api/objects/board
    let priorityMoves = {
        up: false,
        down: false,
        left: false,
        right: false
    }
    
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

    if(gameState.you.health < 65){
        let foodIndex = findClosestFood(gameState.board.food)
        if(gameState.board.food[foodIndex].x > myHead.x){
            priorityMoves.right = true
        }
        if(gameState.board.food[foodIndex].x < myHead.x){
            priorityMoves.left = true
        }
        if(gameState.board.food[foodIndex].y > myHead.y){
            priorityMoves.up = true
        }
        if(gameState.board.food[foodIndex].y < myHead.y){
            priorityMoves.down = true
        }
    }
    
    // Are there any safe moves left?
    
    //Object.keys(moveSafety) returns ["up", "down", "left", "right"]
    //.filter() filters the array based on the function provided as an argument (using arrow function syntax here)
    //In this case we want to filter out any of these directions for which moveSafety[direction] == false
    const safeMoves = Object.keys(moveSafety).filter(direction => moveSafety[direction]);
    const priorityMovesFinal = Object.keys(priorityMoves).filter(direction => priorityMoves[direction]);
    if (safeMoves.length == 0) {
        console.log(`MOVE ${gameState.turn}: No safe moves detected!`)
        return { move: moveSafety[Math.floor(Math.random() * moveSafety.length)] };
    }
    
    // Choose a random move from the safe moves
    const nextPriorityMove1 = priorityMovesFinal[0];
    const nextPriorityMove2 = priorityMovesFinal[1];
    const nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];

    if(safeMoves.includes(nextPriorityMove1)){
        console.log(`Priority MOVE (1) ${gameState.turn}: ${nextPriorityMove1}`)
        return { move: nextPriorityMove1 };
    } else if (safeMoves.includes(nextPriorityMove2)) {
        console.log(`Priority MOVE (2) ${gameState.turn}: ${nextPriorityMove2}`)
        return { move: nextPriorityMove2 };
    }

    console.log(`MOVE ${gameState.turn}: ${nextMove}`)
    return { move: nextMove };
}