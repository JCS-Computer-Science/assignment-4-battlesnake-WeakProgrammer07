export default function move(gameState){
    gameState.board.snakes.forEach(snake => console.log(snake.name));
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
    let spaceScores = { up: 0, down: 0, left: 0, right: 0 }  // Initialize here to avoid undefined issues
    
    let myHead = gameState.you.body[0];
    let myNeck = gameState.you.body[1];



    function safeBack(){
        moveSafety.left  = (myNeck.x < myHead.x) ? false : moveSafety.left;
        moveSafety.right  = (myNeck.x > myHead.x) ? false : moveSafety.right;
        moveSafety.down  = (myNeck.y < myHead.y) ? false : moveSafety.down;
        moveSafety.up  = (myNeck.y > myHead.y) ? false : moveSafety.up;
    }
    safeBack()
    
    function bounds(){
        moveSafety.left = (myHead.x == 0) ? false : moveSafety.left
        moveSafety.right = (myHead.x == (gameState.board.width) -1) ? false : moveSafety.right
        moveSafety.down = (myHead.y == 0) ? false : moveSafety.down
        moveSafety.up = (myHead.y == (gameState.board.height) -1) ? false : moveSafety.up
    }
    bounds()
    
    let myBody = gameState.you.body
    
    function selfPreservation(){
        let ate = 1
        if(gameState.you.health == 100){
            ate = 0
        }
        for(let i = 1; i < myBody.length - ate; i++){
            moveSafety.right = (myHead.x + 1 == myBody[i].x  && myHead.y == myBody[i].y) ? false : moveSafety.right
            moveSafety.left = (myHead.x  -1 == myBody[i].x && myHead.y == myBody[i].y) ? false : moveSafety.left
            moveSafety.up = (myHead.x == myBody[i].x  && myHead.y + 1== myBody[i].y ) ? false : moveSafety.up
            moveSafety.down = (myHead.x == myBody[i].x && myHead.y -1 == myBody[i].y) ? false : moveSafety.down

            riskyMoves.right = (myHead.x + 1 == myBody[i].x  && myHead.y == myBody[i].y) ? false : riskyMoves.right
            riskyMoves.left = (myHead.x  -1 == myBody[i].x && myHead.y == myBody[i].y) ? false : riskyMoves.left
            riskyMoves.up = (myHead.x == myBody[i].x  && myHead.y + 1== myBody[i].y ) ? false : riskyMoves.up
            riskyMoves.down = (myHead.x == myBody[i].x && myHead.y -1 == myBody[i].y) ? false : riskyMoves.down
        }
    }
    
    function riskyPres() {
        let ate = 1
        if(gameState.you.health == 100){
            ate = 0
        }
        for(let i = 1; i < myBody.length - ate; i++){
            riskyMoves.right = (myHead.x + 1 == myBody[i].x  && myHead.y == myBody[i].y) ? false : riskyMoves.right
            riskyMoves.left = (myHead.x  -1 == myBody[i].x && myHead.y == myBody[i].y) ? false : riskyMoves.left
            riskyMoves.up = (myHead.x == myBody[i].x  && myHead.y + 1== myBody[i].y ) ? false : riskyMoves.up
            riskyMoves.down = (myHead.x == myBody[i].x && myHead.y -1 == myBody[i].y) ? false : riskyMoves.down
        }
    }
    
    selfPreservation()
    riskyPres()
    
    for (let j = 0; j < gameState.board.snakes.length; j++) {
        let enemySnake = gameState.board.snakes[j];
        if (enemySnake.id == gameState.you.id) continue;
        
        function enemyDodging(){
            for (let i = 0; i < enemySnake.body.length; i++) {
                let enemyBody = enemySnake.body[i];
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
    
        if (enemyLength >= myLength) {
            let enemyMoves = [
                { x: enemyHead.x + 1, y: enemyHead.y },
                { x: enemyHead.x - 1, y: enemyHead.y },
                { x: enemyHead.x, y: enemyHead.y + 1 },
                { x: enemyHead.x, y: enemyHead.y - 1 },
            ];
            for (let move of enemyMoves) {
                if (myHead.x + 1 == move.x && myHead.y == move.y) {
                    moveSafety.right = false;
                    riskyMoves.right = true
                }
                if (myHead.x - 1 == move.x && myHead.y == move.y) {
                    moveSafety.left = false;
                    riskyMoves.left = true
                }
                if (myHead.x == move.x && myHead.y + 1 == move.y) {
                    moveSafety.up = false;
                    riskyMoves.up = true
                }
                if (myHead.x == move.x && myHead.y - 1 == move.y) {
                    moveSafety.down = false;
                    riskyMoves.down = true
                }
            }
            enemyDodging()
            selfPreservation()
            riskyPres()
        }
        
        if(enemyLength < myLength){
            let enemyMoves = [
                { x: enemyHead.x + 1, y: enemyHead.y },
                { x: enemyHead.x - 1, y: enemyHead.y },
                { x: enemyHead.x, y: enemyHead.y + 1 },
                { x: enemyHead.x, y: enemyHead.y - 1 },
            ];
            for (let move of enemyMoves) {
                priorityMoves.right = (myHead.x + 1 == move.x && myHead.y == move.y) ? true : priorityMoves.right
                priorityMoves.left = (myHead.x - 1 == move.x && myHead.y == move.y) ? true : priorityMoves.left
                priorityMoves.up = (myHead.x == move.x && myHead.y + 1 == move.y) ? true : priorityMoves.up
                priorityMoves.down = (myHead.x == move.x && myHead.y - 1 == move.y) ? true : priorityMoves.down
            }
            enemyDodging()
            selfPreservation()
        }
    }
    function getNextPosition(pos, dir) {
        let newPos = { x: pos.x, y: pos.y };
        
        if (dir == 'up') {
            newPos.y += 1;
        } else if (dir == 'down') {
            newPos.y -= 1;
        } else if (dir == 'left') {
            newPos.x -= 1;
        } else if (dir == 'right') {
            newPos.x += 1;
        }
        
        return newPos;
    }
    // Updated evaluateSpace function with proper parameters
    function evaluateSpace() {
        let visited = new Set();
        Object.keys(moveSafety).forEach(dir => {
            if (!moveSafety[dir]) {
                spaceScores[dir] = 0;
                return;
            }
            
            let nextPos = getNextPosition(myHead, dir);
            let space = floodFill(nextPos, 0, new Set(visited));
            
            // Bonus for spaces that have multiple exits
            let exits = countExits(nextPos);
            spaceScores[dir] = space + (exits * 5);
        });
    }
    evaluateSpace()

    let myLength = gameState.you.body.length;
    let myHealth = gameState.you.health;

    for (let snake of gameState.board.snakes) {
        if (snake.id == gameState.you.id) continue;
        
        let enemyHead = snake.body[0];
        let enemyLength = snake.body.length;
        
        if (myLength > enemyLength && myHealth > 30) {
            let distance = Math.abs(myHead.x - enemyHead.x) + Math.abs(myHead.y - enemyHead.y);
            
            if (distance <= 3) {
                priorityMoves.right = enemyHead.x > myHead.x || priorityMoves.right;
                priorityMoves.left = enemyHead.x < myHead.x || priorityMoves.left;
                priorityMoves.up = enemyHead.y > myHead.y || priorityMoves.up;
                priorityMoves.down = enemyHead.y < myHead.y || priorityMoves.down;
            }
        }
    }
    
    function findBestFood(snakeHead, foodLocations, allSnakes) {
        let bestFood = null;
        let minDistance = 1000;
        let amIClosest = false;
    
        for (let food of foodLocations) {
            let myDistance = Math.abs(snakeHead.x - food.x) + Math.abs(snakeHead.y - food.y);
        
            let isClosest = true;
            for (let snake of allSnakes) {
                if (snake.id == gameState.you.id) continue;
                
                let enemyDistance = Math.abs(snake.body[0].x - food.x) + Math.abs(snake.body[0].y - food.y);
                if (enemyDistance < myDistance) {
                    isClosest = false;
                    break;
                }
            }
    
            if (isClosest || (!amIClosest && myDistance < minDistance)) {
                if (isClosest) {
                    amIClosest = true;
                }
                minDistance = myDistance;
                bestFood = food;
            }
        }
    
        return bestFood
    }
    
    if (gameState.you.health < 50) {
        let bestFood = findBestFood(myHead, gameState.board.food, gameState.board.snakes);
        
        priorityMoves.right = bestFood.x > myHead.x;
        priorityMoves.left = bestFood.x < myHead.x;
        priorityMoves.up = bestFood.y > myHead.y;
        priorityMoves.down = bestFood.y < myHead.y;
    }
    
    let safeMoves = Object.keys(moveSafety).filter(direction => moveSafety[direction]);
    let riskyOptions = Object.keys(riskyMoves).filter(direction => riskyMoves[direction]);
    
    if (safeMoves.length == 0) {
        for (let move of riskyOptions) {
            if (futureSense(move, gameState, 5)) {
                console.log(`Snake ID: ${gameState.you.id} Turn: ${gameState.turn} - Choosing risky but future-safe move: ${move}`);
                return { move };
            }
        }
        if (riskyOptions.length > 0) {
            let randomRisky = riskyOptions[Math.floor(Math.random() * riskyOptions.length)];
            console.log(`Snake ID: ${gameState.you.id} Turn: ${gameState.turn} - Choosing random risky move: ${randomRisky}`);
            return { move: randomRisky };
        }
        console.log(`Snake ID: ${gameState.you.id} Turn: ${gameState.turn} - No moves left! Going up`);
        return { move: "up" };
    }
    
    let futureSafeMoves = safeMoves.filter(move => futureSense(move, gameState, 10));
    if (futureSafeMoves.length == 0) {
        let chosenMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];
        console.log(`Snake ID: ${gameState.you.id} Turn: ${gameState.turn} - No future-safe moves, using random safe move: ${chosenMove}`);
        return { move: chosenMove };
    }
    let moveScores = {};
    futureSafeMoves.forEach(move => {
        moveScores[move] = 0;
        moveScores[move] += spaceScores[move] || 0;
        moveScores[move] += priorityMoves[move] ? 10 : 0;
    });
    let bestMove = null;
    let bestScore = 0

    for (let move in moveScores) {
        if (moveScores[move] > bestScore) {
            bestScore = moveScores[move];
            bestMove = move;
        }
    }
    
    console.log(`Snake ID: ${gameState.you.id} Turn: ${gameState.turn} - Choosing best scored move: ${bestMove} (score: ${moveScores[bestMove]})`);
    return { move: bestMove };

    // Updated floodFill and countExits functions with proper scope
    function floodFill(pos, depth, visited) {
        let key = `${pos.x},${pos.y}`;
        if (visited.has(key) || depth > 15) return 0;
        
        visited.add(key);
        
        if (pos.x < 0 || pos.x >= gameState.board.width || pos.y < 0 || pos.y >= gameState.board.height) {
            return 0;
        }
        
        // Check if position is occupied by a snake body
        for (let snake of gameState.board.snakes) {
            for (let body of snake.body) {
                if (pos.x == body.x && pos.y == body.y) {
                    return 0;
                }
            }
        }
        
        let totalSpace = 1;
        let directions = ['up', 'down', 'left', 'right'];
        
        directions.forEach(dir => {
            let nextPos = getNextPosition(pos, dir);
            totalSpace += floodFill(nextPos, depth + 1, visited);
        });
        
        return totalSpace;
    }

    function countExits(pos) {
        let exits = 0;
        let directions = ['up', 'down', 'left', 'right'];
        
        directions.forEach(dir => {
            let nextPos = getNextPosition(pos, dir);
            
            if (nextPos.x < 0 || nextPos.x >= gameState.board.width || nextPos.y < 0 || nextPos.y >= gameState.board.height) {
                return;
            }
            
            let occupied = false;
            for (let snake of gameState.board.snakes) {
                for (let body of snake.body) {
                    if (nextPos.x == body.x && nextPos.y == body.y) {
                        occupied = true;
                        break;
                    }
                }
                if (occupied) break;
            }
            
            if (!occupied){
                exits++;
            }
        });
        
        return exits;
    }
}

// checking for dead ends and enemy movement
function futureSense(move, gameState, depth) {
    if (depth <= 0) { // base case
        return true;
    }

    let newGameState = JSON.parse(JSON.stringify(gameState));
    let mySnake = newGameState.you;
    let myBody = mySnake.body;

    let newHead = { ...myBody[0] }; // clone so it can't be changed 
    if (move == "up") {
        newHead.y += 1;
    }
    else if (move == "down") {
        newHead.y -= 1;
    }
    else if (move == "left") {
        newHead.x -= 1;
    }
    else if (move == "right") {
        newHead.x += 1;
    }

    myBody.unshift(newHead);
    mySnake.health -= 1;
    if (mySnake.health != 100) {
        myBody.pop();
    }
    if (newHead.x < 0 || newHead.x >= newGameState.board.width ||
        newHead.y < 0 || newHead.y >= newGameState.board.height) {
        return false;
    }
    for (let i = 1; i < myBody.length; i++) {
        if (newHead.x == myBody[i].x && newHead.y == myBody[i].y) {
            return false;
        }
    }

    for (let snake of newGameState.board.snakes) {
        if (snake.id == mySnake.id) continue;
        
        let enemyHead = snake.body[0];
        let possibleEnemyMoves = [];
        
        let directions = [
            { move: "up", x: enemyHead.x, y: enemyHead.y + 1 },
            { move: "down", x: enemyHead.x, y: enemyHead.y - 1 },
            { move: "left", x: enemyHead.x - 1, y: enemyHead.y },
            { move: "right", x: enemyHead.x + 1, y: enemyHead.y }
        ];
        
        for (let dir of directions) {
            if (dir.x < 0 || dir.x >= newGameState.board.width ||
                dir.y < 0 || dir.y >= newGameState.board.height) {
                continue;
            }
            let hitBody = false;
            for (let i = 0; i < snake.body.length - 1; i++) {
                if (dir.x == snake.body[i].x && dir.y == snake.body[i].y) {
                    hitBody = true;
                    break;
                }
            }
            if (!hitBody) {
                possibleEnemyMoves.push(dir);
            }
        }
        if (possibleEnemyMoves.length == 0) continue;
        
        let randomMove = possibleEnemyMoves[Math.floor(Math.random() * possibleEnemyMoves.length)];
 
        snake.body.unshift({ x: randomMove.x, y: randomMove.y });
        if (snake.health  != 100) {
            snake.body.pop();
        }
    }

    for (let snake of newGameState.board.snakes) {
        if (snake.id == mySnake.id) continue;
        
        if (snake.body.length > 0) {
            let enemyHead = snake.body[0];
            if (newHead.x == enemyHead.x && newHead.y == enemyHead.y) {
                if (myBody.length <= snake.body.length) {
                    return false;
                }
            }
        }
        for (let i = 0; i < snake.body.length; i++) {
            if (newHead.x == snake.body[i].x && newHead.y == snake.body[i].y) {
                return false;
            }
        }
    }

    let nextMoves = ["up", "down", "left", "right"];
    for (let nextMove of nextMoves) {
        if (futureSense(nextMove, newGameState, depth - 1)) {
            return true;
        }
    }
    
    return false;
}