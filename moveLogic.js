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
    let spaceScores = { up: 0, down: 0, left: 0, right: 0 }
    
    let myHead = gameState.you.body[0];
    let myNeck = gameState.you.body[1];

    let healthLimit = 100

    function safeBack(){
        moveSafety.left  = (myNeck.x < myHead.x) ? false : moveSafety.left;
        moveSafety.right  = (myNeck.x > myHead.x) ? false : moveSafety.right;
        moveSafety.down  = (myNeck.y < myHead.y) ? false : moveSafety.down;
        moveSafety.up = (myNeck.y > myHead.y) ? false : moveSafety.up;
    }
    safeBack()
    
    function bounds() {
        moveSafety.left = myHead.x == 0 ? false : moveSafety.left;
        moveSafety.right = myHead.x == gameState.board.width - 1 ? false : moveSafety.right;
        moveSafety.down = myHead.y == 0 ? false : moveSafety.down;
        moveSafety.up = myHead.y == gameState.board.height - 1 ? false : moveSafety.up;
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
// Add a new function to detect positions right behind enemy heads
function detectEnemyNecks() {
    let enemyNecks = [];
    
    for (let snake of gameState.board.snakes) {
        if (snake.id === gameState.you.id) continue;
            let enemyNeck = snake.body[1];
            enemyNecks.push({ x: enemyNeck.x, y: enemyNeck.y });
    }
    return enemyNecks;
}
    
    for (let j = 0; j < gameState.board.snakes.length; j++) {
        let enemySnake = gameState.board.snakes[j];
        if (enemySnake.id == gameState.you.id) continue;
        
        
        function enemyDodging() {
            let enemyNecks = detectEnemyNecks();
            
            for (let i = 0; i < enemySnake.body.length; i++) {
                let enemyBody = enemySnake.body[i];
                moveSafety.right = (myHead.x + 1 == enemyBody.x && myHead.y == enemyBody.y) ? false : moveSafety.right
                moveSafety.left = (myHead.x - 1 == enemyBody.x && myHead.y == enemyBody.y) ? false : moveSafety.left
                moveSafety.up = (myHead.x == enemyBody.x && myHead.y + 1 == enemyBody.y) ? false : moveSafety.up
                moveSafety.down = (myHead.x == enemyBody.x && myHead.y - 1 == enemyBody.y) ? false : moveSafety.down
            }
            
            for (let neck of enemyNecks) {
                moveSafety.right = (myHead.x + 1 == neck.x && myHead.y == neck.y) ? false : moveSafety.right
                moveSafety.left = (myHead.x - 1 == neck.x && myHead.y == neck.y) ? false : moveSafety.left
                moveSafety.up = (myHead.x == neck.x && myHead.y + 1 == neck.y) ? false : moveSafety.up
                moveSafety.down = (myHead.x == neck.x && myHead.y - 1 == neck.y) ? false : moveSafety.down
                riskyMoves.right = (myHead.x + 1 == neck.x && myHead.y == neck.y) ? false : riskyMoves.right
                riskyMoves.left = (myHead.x - 1 == neck.x && myHead.y == neck.y) ? false : riskyMoves.left
                riskyMoves.up = (myHead.x == neck.x && myHead.y + 1 == neck.y) ? false : riskyMoves.up
                riskyMoves.down = (myHead.x == neck.x && myHead.y - 1 == neck.y) ? false : riskyMoves.down
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
            riskyPres()
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
            let exitAnalysis = countExits(nextPos);
            
            spaceScores[dir] = space + 
                              (exitAnalysis.scores.up * 0.2) + 
                              (exitAnalysis.scores.down * 0.2) +
                              (exitAnalysis.scores.left * 0.2) + 
                              (exitAnalysis.scores.right * 0.2) +
                              (exitAnalysis.count * 10);  // Bonus for multiple good exits
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
    if(gameState.turn < 10 || myLength < 5){
        healthLimit = 96
    } else if(gameState.turn < 50 || myLength < 7){
        healthLimit = 70
    } else {
        healthLimit = 40
    }
    
    if (gameState.you.health < healthLimit) {
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
            if (futureSense(move, gameState, 10)) {
                console.log(`Snake ID: ${gameState.you.id} Turn: ${gameState.turn} - Choosing risky but 10 future-safe move: ${move}`);
                return { move };
            } else if(futureSense(move, gameState, 5)){
                console.log(`Snake ID: ${gameState.you.id} Turn: ${gameState.turn} - Choosing risky but 5 future-safe move: ${move}`);
                return { move };
            } else if(futureSense(move, gameState, 3)){
                console.log(`Snake ID: ${gameState.you.id} Turn: ${gameState.turn} - Choosing risky but 3 future-safe move: ${move}`);
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
    
    let futureSafeMoves = safeMoves.filter(move => futureSense(move, gameState, 20));
    if (futureSafeMoves.length == 0) {
        for (let move of riskyOptions) {
            if (futureSense(move, gameState, 10)) {
                console.log(`Snake ID: ${gameState.you.id} Turn: ${gameState.turn} - Choosing risky but 10 future-safe move: ${move}`);
                return { move };
            } else if(futureSense(move, gameState, 5)){
                console.log(`Snake ID: ${gameState.you.id} Turn: ${gameState.turn} - Choosing risky but 5 future-safe move: ${move}`);
                return { move };
            } else if(futureSense(move, gameState, 3)){
                console.log(`Snake ID: ${gameState.you.id} Turn: ${gameState.turn} - Choosing risky but 3 future-safe move: ${move}`);
                return { move };
            }else if(futureSense(move, gameState, 2)){
                console.log(`Snake ID: ${gameState.you.id} Turn: ${gameState.turn} - Choosing risky but 2 future-safe move: ${move}`);
                return { move };
            }else if(futureSense(move, gameState, 1)){
                console.log(`Snake ID: ${gameState.you.id} Turn: ${gameState.turn} - Choosing risky but 1 future-safe move: ${move}`);
                return { move };
            }
        }
        let chosenMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];
        console.log(`Snake ID: ${gameState.you.id} Turn: ${gameState.turn} - No future-safe moves, using random safe move: ${chosenMove}`);
        return { move: chosenMove };
    }
    let moveScores = {};
    futureSafeMoves.forEach(move => {
        moveScores[move] = 0;
        moveScores[move] += spaceScores[move] * 1.5;
        moveScores[move] += priorityMoves[move] ? 50 : 0;

        let nextPos = getNextPosition(myHead, move);
        let centerX = Math.floor(gameState.board.width / 2);
        let centerY = Math.floor(gameState.board.height / 2);
        let distanceToCenter = Math.abs(nextPos.x - centerX) + Math.abs(nextPos.y - centerY);
        
        if (gameState.turn < 50) {
            moveScores[move] += (10 - distanceToCenter) * 0.5;
        }

        if (gameState.you.health > 50) {
            let nextMoves = countExits(nextPos, gameState.you.body.length).count;
            moveScores[move] += nextMoves * 5;
        }
        let myTail = myBody[myBody.length - 1];
        let tailPriorityMoves = [];
        
        if (myHead.x < myTail.x && moveSafety.right) {
            tailPriorityMoves.push("right");
        }
        if (myHead.x > myTail.x && moveSafety.left)  {
            tailPriorityMoves.push("left");
        }
        if (myHead.y < myTail.y && moveSafety.up)    {
            tailPriorityMoves.push("up");
        }
        if (myHead.y > myTail.y && moveSafety.down)  {
            tailPriorityMoves.push("down");

        }

        const tailBias = Math.max(0, myBody.length - 5) * 0.2;
        
        for (const move of tailPriorityMoves) {
            if (moveScores[move] !== undefined) {
                moveScores[move] += tailBias;
            }
        }

        if (gameState.you.health > 40 && (myLength < 15)) {
            for (let snake of gameState.board.snakes) {
                if (snake.id == gameState.you.id) continue;
                
                if (snake.body.length < gameState.you.body.length) {
                    let enemyHead = snake.body[0];
                    let currentDistance = Math.abs(myHead.x - enemyHead.x) + Math.abs(myHead.y - enemyHead.y);
                    let newDistance = Math.abs(nextPos.x - enemyHead.x) + Math.abs(nextPos.y - enemyHead.y);
                    if (newDistance < currentDistance) {
                        moveScores[move] += 10;
                    }
                }
            }
        }
    });

        let bestMove = null;
        let bestScore = -100000;
        for (let move in moveScores) {
            if (moveScores[move] > bestScore) {
                bestScore = moveScores[move];
                bestMove = move;
            }
        }

        if (!moveSafety[bestMove]) {
            console.log(
              `Snake ID: ${gameState.you.id} Turn: ${gameState.turn} - Selected best move ${bestMove} is actually unsafe, picking another safe move`
            );
            for (let move of safeMoves) {
              if (move !== bestMove) {
                console.log(
                  `Snake ID: ${gameState.you.id} Turn: ${gameState.turn} - Using alternate safe move: ${move}`
                );
                return { move };
              }
            }
            if (safeMoves.length > 0) {
              return { move: safeMoves[0] };
            }
            return { move: "up" };
          }
    
    console.log(`Snake ID: ${gameState.you.id} Turn: ${gameState.turn} - Choosing best scored move: ${bestMove} (score: ${moveScores[bestMove]})`);
    return { move: bestMove };

    //  floodFill and countExits functions
    function floodFill(pos, depth, visited, limit = 100) {
        const key = `${pos.x},${pos.y}`;
        if (visited.has(key) || depth > limit) return 0;
        visited.add(key);
    
        // Out of bounds
        if (
            pos.x < 0 || pos.x >= gameState.board.width ||
            pos.y < 0 || pos.y >= gameState.board.height
        ) return 0;
    
        // Check if the tile is occupied by any body
        for (let snake of gameState.board.snakes) {
            let h = 1
            if(snake.health == 100){
                h = 0
            }
            for (let i = 0; i < snake.body.length - h; i++) {
                const segment = snake.body[i];
                if (segment.x == pos.x && segment.y == pos.y) return 0;
              }
        }
    
        // Avoid tiles enemy heads might move into
        const dangerousTiles = getEnemyHeadNextMoves();
        for (let danger of dangerousTiles) {
            if (danger.x === pos.x && danger.y === pos.y) return 0;
        }
    
        let space = 1;
        for (let dx of [-1, 1]) {
            space += floodFill({ x: pos.x + dx, y: pos.y }, depth + 1, visited, limit);
        }
        for (let dy of [-1, 1]) {
            space += floodFill({ x: pos.x, y: pos.y + dy }, depth + 1, visited, limit);
        }
    
        return space;
    }

    function countExits(pos, myLength) {
        const directions = {
            up: { x: pos.x, y: pos.y + 1 },
            down: { x: pos.x, y: pos.y - 1 },
            left: { x: pos.x - 1, y: pos.y },
            right: { x: pos.x + 1, y: pos.y }
        };
    
        const enemyHeadMoves = getEnemyHeadNextMoves(myLength);
        let scores = {};
        let count = 0;
    
        for (let dir in directions) {
            const p = directions[dir];
            let isSafe = true;
    
            // Check board boundaries
            if (
                p.x < 0 || p.x >= gameState.board.width ||
                p.y < 0 || p.y >= gameState.board.height
            ) {
                isSafe = false;
            }
    
            // Check bodies
            if (isSafe) {
                for (let snake of gameState.board.snakes) {
                    for (let segment of snake.body) {
                        if (segment.x === p.x && segment.y === p.y) {
                            isSafe = false;
                            break;
                        }
                    }
                    if (!isSafe) break;
                }
            }
    
            // Check if an enemy might move there next
            if (isSafe) {
                for (let danger of enemyHeadMoves) {
                    if (danger.x === p.x && danger.y === p.y) {
                        isSafe = false;
                        break;
                    }
                }
            }
    
            scores[dir] = isSafe ? 1 : 0;
            if (isSafe) count += 1;
        }
    
        return { scores, count };
    }

    function getEnemyHeadNextMoves(myLength = 0) {
        const dangerTiles = [];
    
        for (let snake of gameState.board.snakes) {
            if (snake.id === gameState.you.id) continue; // Skip yourself
    
            const isDangerous = snake.length >= myLength;
            if (!isDangerous) continue;
    
            const head = snake.head;
            const possibleMoves = [
                { x: head.x + 1, y: head.y },
                { x: head.x - 1, y: head.y },
                { x: head.x, y: head.y + 1 },
                { x: head.x, y: head.y - 1 }
            ];
    
            for (let move of possibleMoves) {
                // Ignore out-of-bounds
                if (
                    move.x >= 0 && move.x < gameState.board.width &&
                    move.y >= 0 && move.y < gameState.board.height
                ) {
                    dangerTiles.push(move);
                }
            }
        }
    
        return dangerTiles;
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