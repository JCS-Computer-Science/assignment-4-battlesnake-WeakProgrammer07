const optimizedParams = {
  // Space evaluation weights
  SPACE_SCORE_WEIGHT: 2.8,
  EXIT_COUNT_WEIGHT: 22,
  FUTURE_DEPTH_WEIGHT: 12,

  // Health and food-seeking weights
  HEALTH_THRESHOLD: 35,
  LOW_HEALTH_BONUS: 420,
  NORMAL_HEALTH_BONUS: 25,

  // Snake interaction weights
  HEAD_COLLISION_BONUS: 1100,
  TAIL_BIAS: 7,
  CENTER_CONTROL_BONUS: 120,

  // Risk management weights
  ENEMY_AVOIDANCE_PENALTY: 350,
  SIZE_DIFF_HUNT_BONUS: 12,
  CORNER_FOOD_PENALTY: 110,
  EDGE_FOOD_PENALTY: 60
};

export default function move(gameState, params = optimizedParams) {
  // Initialize move evaluation objects
  let moveSafety = { up: true, down: true, left: true, right: true };
  let priorityMoves = { up: false, down: false, left: false, right: false };
  let riskyMoves = { up: false, down: false, left: false, right: false };
  let spaceScores = { up: 0, down: 0, left: 0, right: 0 };

  // Get snake information
  let myHead = gameState.you.body[0];
  let myNeck = gameState.you.body[1];
  let myBody = gameState.you.body;
  let myLength = myBody.length;
  let myHealth = gameState.you.health;
  let myId = gameState.you.id;

  // Find longest enemy snake
  let longestSnake = 0;
  for (const snake of gameState.board.snakes) { 
    if (snake.id == myId) continue;
    if (snake.body.length > longestSnake) {
      longestSnake = snake.body.length;
    }
  }

  // Basic safety checks
  function safeBack() {
    moveSafety.left = myNeck.x < myHead.x ? false : moveSafety.left;
    moveSafety.right = myNeck.x > myHead.x ? false : moveSafety.right;
    moveSafety.down = myNeck.y < myHead.y ? false : moveSafety.down;
    moveSafety.up = myNeck.y > myHead.y ? false : moveSafety.up;
  }
  safeBack();

  function bounds() {
    moveSafety.left = myHead.x == 0 ? false : moveSafety.left;
    moveSafety.right = myHead.x == gameState.board.width - 1 ? false : moveSafety.right;
    moveSafety.down = myHead.y == 0 ? false : moveSafety.down;
    moveSafety.up = myHead.y == gameState.board.height - 1 ? false : moveSafety.up;
  }
  bounds();

  // Self collision avoidance
  function selfPreservation() {
    let ate = myHealth == 100 ? 0 : 1;
    for (let i = 1; i < myBody.length - ate; i++) {
      moveSafety.right = myHead.x + 1 == myBody[i].x && myHead.y == myBody[i].y ? false : moveSafety.right;
      moveSafety.left = myHead.x - 1 == myBody[i].x && myHead.y == myBody[i].y ? false : moveSafety.left;
      moveSafety.up = myHead.x == myBody[i].x && myHead.y + 1 == myBody[i].y ? false : moveSafety.up;
      moveSafety.down = myHead.x == myBody[i].x && myHead.y - 1 == myBody[i].y ? false : moveSafety.down;
    }
  }
  selfPreservation();

  // Enemy collision avoidance
  function enemyDodging() {
    for (let snake of gameState.board.snakes) {
      if (snake.id == myId) continue;
      
      let h = snake.health == 100 ? 0 : 1;
      for (let i = 0; i < snake.body.length - h; i++) {
        let enemyBody = snake.body[i];
        moveSafety.right = myHead.x + 1 == enemyBody.x && myHead.y == enemyBody.y ? false : moveSafety.right;
        moveSafety.left = myHead.x - 1 == enemyBody.x && myHead.y == enemyBody.y ? false : moveSafety.left;
        moveSafety.up = myHead.x == enemyBody.x && myHead.y + 1 == enemyBody.y ? false : moveSafety.up;
        moveSafety.down = myHead.x == enemyBody.x && myHead.y - 1 == enemyBody.y ? false : moveSafety.down;
      }
    }
  }
  enemyDodging();

  // Enemy head collision opportunities
  for (let snake of gameState.board.snakes) {
    if (snake.id == myId) continue;

    let enemyHead = snake.body[0];
    let enemyLength = snake.body.length;

    if (enemyLength >= myLength) {
      // Avoid larger snakes
      let enemyMoves = [
        { x: enemyHead.x + 1, y: enemyHead.y },
        { x: enemyHead.x - 1, y: enemyHead.y },
        { x: enemyHead.x, y: enemyHead.y + 1 },
        { x: enemyHead.x, y: enemyHead.y - 1 }
      ];
      for (let move of enemyMoves) {
        if (myHead.x + 1 == move.x && myHead.y == move.y) {
          moveSafety.right = false;
          riskyMoves.right = true;
        }
        if (myHead.x - 1 == move.x && myHead.y == move.y) {
          moveSafety.left = false;
          riskyMoves.left = true;
        }
        if (myHead.x == move.x && myHead.y + 1 == move.y) {
          moveSafety.up = false;
          riskyMoves.up = true;
        }
        if (myHead.x == move.x && myHead.y - 1 == move.y) {
          moveSafety.down = false;
          riskyMoves.down = true;
        }
      }
    } else {
      // Hunt smaller snakes
      let enemyMoves = [
        { x: enemyHead.x + 1, y: enemyHead.y },
        { x: enemyHead.x - 1, y: enemyHead.y },
        { x: enemyHead.x, y: enemyHead.y + 1 },
        { x: enemyHead.x, y: enemyHead.y - 1 }
      ];
      for (let move of enemyMoves) {
        priorityMoves.right = myHead.x + 1 == move.x && myHead.y == move.y ? true : priorityMoves.right;
        priorityMoves.left = myHead.x - 1 == move.x && myHead.y == move.y ? true : priorityMoves.left;
        priorityMoves.up = myHead.x == move.x && myHead.y + 1 == move.y ? true : priorityMoves.up;
        priorityMoves.down = myHead.x == move.x && myHead.y - 1 == move.y ? true : priorityMoves.down;
      }
    }
  }

  // Space evaluation using optimized parameters
  function getNextPosition(pos, dir) {
    return {
      up: { x: pos.x, y: pos.y + 1 },
      down: { x: pos.x, y: pos.y - 1 },
      left: { x: pos.x - 1, y: pos.y },
      right: { x: pos.x + 1, y: pos.y }
    }[dir];
  }

  function evaluateSpace() {
    Object.keys(moveSafety).forEach((dir) => {
      if (!moveSafety[dir]) {
        spaceScores[dir] = 0;
        return;
      }
      let nextPos = getNextPosition(myHead, dir);
      let space = floodFill(nextPos, 0, new Set());
      let exitAnalysis = countExits(nextPos);

      spaceScores[dir] =
        space * params.SPACE_SCORE_WEIGHT +
        exitAnalysis.scores.up * 0.2 +
        exitAnalysis.scores.down * 0.2 +
        exitAnalysis.scores.left * 0.2 +
        exitAnalysis.scores.right * 0.2 +
        exitAnalysis.count * params.EXIT_COUNT_WEIGHT;
    });
  }
  evaluateSpace();

  // Health-based food seeking
  let healthLimit = params.HEALTH_THRESHOLD * gameState.board.snakes.length - 0.5;
  if (myLength + 1 <= longestSnake) {
    healthLimit = 30 * gameState.board.snakes.length - 0.5;
  } else {
    healthLimit = 25 * gameState.board.snakes.length - 1;
  }

  if (myHealth < healthLimit) {
    priorityMoves = { up: false, down: false, left: false, right: false };
    let bestFood = findBestFood(myHead, gameState.board.food, gameState);
    if (bestFood) {
      priorityMoves.right = bestFood.x > myHead.x;
      priorityMoves.left = bestFood.x < myHead.x;
      priorityMoves.up = bestFood.y > myHead.y;
      priorityMoves.down = bestFood.y < myHead.y;
    }
  }

  // Score moves based on optimized parameters
  let moveScores = {};
  let safeMoves = Object.keys(moveSafety).filter(dir => moveSafety[dir]);
  
  safeMoves.forEach(move => {
    moveScores[move] = 0;
    
    // Space score
    moveScores[move] += spaceScores[move] * params.SPACE_SCORE_WEIGHT;
    
    // Health-based priorities
    if (myHealth < healthLimit) {
      const bonus = myHealth < 20 ? 1000000000 : 
                   myHealth < 30 ? params.LOW_HEALTH_BONUS * 2 : 
                   gameState.turn < 100 ? params.LOW_HEALTH_BONUS * 0.6 : 
                   params.LOW_HEALTH_BONUS;
      moveScores[move] += priorityMoves[move] ? bonus : 0;
    } else {
      moveScores[move] += priorityMoves[move] ? params.NORMAL_HEALTH_BONUS : 0;
    }
    
    // Center control
    if (gameState.turn < 150) {
      let nextPos = getNextPosition(myHead, move);
      let centerX = Math.floor(gameState.board.width / 2);
      let centerY = Math.floor(gameState.board.height / 2);
      let distanceToCenter = Math.abs(nextPos.x - centerX) + Math.abs(nextPos.y - centerY);
      moveScores[move] += (gameState.board.width - distanceToCenter) * params.CENTER_CONTROL_BONUS / 10;
    }
    
    // Tail chasing
    let myTail = myBody[myBody.length - 1];
    if ((myHead.x < myTail.x && move === "right") ||
        (myHead.x > myTail.x && move === "left") ||
        (myHead.y < myTail.y && move === "up") ||
        (myHead.y > myTail.y && move === "down")) {
      moveScores[move] += params.TAIL_BIAS * 5;
    }
    
    // Enemy avoidance
    moveScores = penalizeHeadProximity(moveScores, myHead, gameState, params);
    
    // Hunting behavior
    if (myHealth > 50 && myLength > 5) {
      moveScores = huntSmallerSnakes(moveScores, gameState, myHead, myLength, params);
    }
    
    // Head collision opportunities
    moveScores = seekHeadCollisions(moveScores, gameState, myHead, myLength, params);
  });

  // Select best move
  let bestMove = null;
  let bestScore = -Infinity;
  
  for (let move of safeMoves) {
    if (moveScores[move] > bestScore) {
      bestScore = moveScores[move];
      bestMove = move;
    }
  }
  
  // Fallback to risky moves if no safe moves
  if (!bestMove) {
    let riskyOptions = Object.keys(riskyMoves).filter(dir => riskyMoves[dir]);
    if (riskyOptions.length > 0) {
      bestMove = riskyOptions[0];
    } else {
      // Last resort random move
      const allDirections = ["up", "down", "left", "right"];
      bestMove = allDirections[Math.floor(Math.random() * allDirections.length)];
    }
  }

  console.log(`Choosing move ${bestMove} with score ${bestScore}`);
  return { move: bestMove };

  // Helper functions
  function floodFill(pos, depth, visited, limit = 60) {
    const key = `${pos.x},${pos.y}`;
    if (visited.has(key) || depth > limit) return 0;
    visited.add(key);

    if (pos.x < 0 || pos.x >= gameState.board.width || 
        pos.y < 0 || pos.y >= gameState.board.height) {
      return 0;
    }

    for (let snake of gameState.board.snakes) {
      for (let segment of snake.body) {
        if (segment.x == pos.x && segment.y == pos.y) return 0;
      }
    }

    let space = 1;
    space += floodFill({ x: pos.x + 1, y: pos.y }, depth + 1, visited, limit);
    space += floodFill({ x: pos.x - 1, y: pos.y }, depth + 1, visited, limit);
    space += floodFill({ x: pos.x, y: pos.y + 1 }, depth + 1, visited, limit);
    space += floodFill({ x: pos.x, y: pos.y - 1 }, depth + 1, visited, limit);
    return space;
  }

  function countExits(pos) {
    const directions = {
      up: { x: pos.x, y: pos.y + 1 },
      down: { x: pos.x, y: pos.y - 1 },
      left: { x: pos.x - 1, y: pos.y },
      right: { x: pos.x + 1, y: pos.y }
    };

    let scores = {};
    let count = 0;

    for (let dir in directions) {
      const p = directions[dir];
      let isSafe = true;

      if (p.x < 0 || p.x >= gameState.board.width || 
          p.y < 0 || p.y >= gameState.board.height) {
        isSafe = false;
      }

      if (isSafe) {
        for (let snake of gameState.board.snakes) {
          for (let segment of snake.body) {
            if (segment.x == p.x && segment.y == p.y) {
              isSafe = false;
              break;
            }
          }
          if (!isSafe) break;
        }
      }

      scores[dir] = isSafe ? 1 : 0;
      if (isSafe) count += 1;
    }

    return { scores, count };
  }

  function findBestFood(snakeHead, foodLocations, gameState) {
    if (!foodLocations || foodLocations.length == 0) return null;
    
    let foodScores = [];
    for (let food of foodLocations) {
      const distance = Math.abs(snakeHead.x - food.x) + Math.abs(snakeHead.y - food.y);
      let score = 100 - distance * 5;

      // Apply food location penalties from parameters
      const isCorner = (food.x == 0 || food.x == gameState.board.width - 1) &&
                      (food.y == 0 || food.y == gameState.board.height - 1);
      const isEdge = food.x == 0 || food.x == gameState.board.width - 1 ||
                    food.y == 0 || food.y == gameState.board.height - 1;
      
      if (isCorner) score -= params.CORNER_FOOD_PENALTY;
      if (isEdge) score -= params.EDGE_FOOD_PENALTY;

      // Consider enemy proximity
      for (let snake of gameState.board.snakes) {
        if (snake.id == myId) continue;
        
        const enemyHead = snake.body[0];
        const enemyDistance = Math.abs(enemyHead.x - food.x) + Math.abs(enemyHead.y - food.y);
        const myDistance = Math.abs(snakeHead.x - food.x) + Math.abs(snakeHead.y - food.y);
        
        if (enemyDistance < myDistance) {
          if (snake.body.length > myLength) {
            score -= 200;
          } else {
            score -= 40;
          }
        }
      }

      foodScores.push({ food, score });
    }
    
    foodScores.sort((a, b) => b.score - a.score);
    return foodScores[0]?.food;
  }

  function penalizeHeadProximity(moveScores, myHead, gameState, params) {
    for (const move in moveScores) {
      let nextPos = getNextPosition(myHead, move);
      for (const snake of gameState.board.snakes) {
        if (snake.id == myId) continue;
        
        const enemyHead = snake.body[0];
        const enemyLength = snake.body.length;
        const distance = Math.abs(nextPos.x - enemyHead.x) + Math.abs(nextPos.y - enemyHead.y);
        
        let sizePenalty = enemyLength >= myLength ? 2.5 : 0.5;
        
        if (distance <= 1) {
          moveScores[move] -= params.ENEMY_AVOIDANCE_PENALTY * sizePenalty;
        } else if (distance == 2) {
          moveScores[move] -= params.ENEMY_AVOIDANCE_PENALTY * 0.5 * sizePenalty;
        } else if (distance == 3) {
          moveScores[move] -= params.ENEMY_AVOIDANCE_PENALTY * 0.25 * sizePenalty;
        }
      }
    }
    return moveScores;
  }

  function huntSmallerSnakes(moveScores, gameState, myHead, myLength, params) {
    for (let snake of gameState.board.snakes) {
      if (snake.id == myId) continue;
      
      const enemyHead = snake.body[0];
      const enemyLength = snake.body.length;
      const distance = Math.abs(myHead.x - enemyHead.x) + Math.abs(myHead.y - enemyHead.y);

      if (myLength > enemyLength) {
        const sizeDiff = myLength - enemyLength;
        const huntBonus = Math.min(sizeDiff * params.SIZE_DIFF_HUNT_BONUS, 50);

        if (distance <= 5) {
          moveScores.right = enemyHead.x > myHead.x ? moveScores.right + 400 + huntBonus : moveScores.right;
          moveScores.left = enemyHead.x < myHead.x ? moveScores.left + 400 + huntBonus : moveScores.left;
          moveScores.up = enemyHead.y > myHead.y ? moveScores.up + 400 + huntBonus : moveScores.up;
          moveScores.down = enemyHead.y < myHead.y ? moveScores.down + 400 + huntBonus : moveScores.down;
        }
      }
    }
    return moveScores;
  }

  function seekHeadCollisions(moveScores, gameState, myHead, myLength, params) {
    for (let snake of gameState.board.snakes) {
      if (snake.id == myId) continue;
      
      const enemyHead = snake.body[0];
      const enemyLength = snake.body.length;

      if (myLength > enemyLength) {
        const enemyMoves = [
          { x: enemyHead.x + 1, y: enemyHead.y },
          { x: enemyHead.x - 1, y: enemyHead.y },
          { x: enemyHead.x, y: enemyHead.y + 1 },
          { x: enemyHead.x, y: enemyHead.y - 1 }
        ];

        for (let enemyMove of enemyMoves) {
          if (myHead.x + 1 == enemyMove.x && myHead.y == enemyMove.y) {
            moveScores.right += params.HEAD_COLLISION_BONUS;
          }
          if (myHead.x - 1 == enemyMove.x && myHead.y == enemyMove.y) {
            moveScores.left += params.HEAD_COLLISION_BONUS;
          }
          if (myHead.x == enemyMove.x && myHead.y + 1 == enemyMove.y) {
            moveScores.up += params.HEAD_COLLISION_BONUS;
          }
          if (myHead.x == enemyMove.x && myHead.y - 1 == enemyMove.y) {
            moveScores.down += params.HEAD_COLLISION_BONUS;
          }
        }
      }
    }
    return moveScores;
  }
}

