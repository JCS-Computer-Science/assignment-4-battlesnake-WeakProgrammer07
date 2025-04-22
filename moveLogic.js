import e from "express";

export default function move(gameState) {
  gameState.board.snakes.forEach((snake) => console.log(snake.name));
  let moveSafety = {
    up: true,
    down: true,
    left: true,
    right: true,
  };
  let priorityMoves = {
    up: false,
    down: false,
    left: false,
    right: false,
  };
  let riskyMoves = {
    up: false,
    down: false,
    left: false,
    right: false,
  };
  let spaceScores = { up: 0, down: 0, left: 0, right: 0 };

  let myHead = gameState.you.body[0];
  let myNeck = gameState.you.body[1];

  let healthLimit = 100;

  function safeBack() {
    moveSafety.left = myNeck.x < myHead.x ? false : moveSafety.left;
    moveSafety.right = myNeck.x > myHead.x ? false : moveSafety.right;
    moveSafety.down = myNeck.y < myHead.y ? false : moveSafety.down;
    moveSafety.up = myNeck.y > myHead.y ? false : moveSafety.up;
  }
  safeBack();

  function bounds() {
    moveSafety.left = myHead.x == 0 ? false : moveSafety.left;
    moveSafety.right =
      myHead.x == gameState.board.width - 1 ? false : moveSafety.right;
    moveSafety.down = myHead.y == 0 ? false : moveSafety.down;
    moveSafety.up =
      myHead.y == gameState.board.height - 1 ? false : moveSafety.up;
  }
  bounds();

  let myBody = gameState.you.body;

  function selfPreservation() {
    let ate = 1;
    if (gameState.you.health == 100) {
      ate = 0;
    }
    for (let i = 1; i < myBody.length - ate; i++) {
      moveSafety.right =
        myHead.x + 1 == myBody[i].x && myHead.y == myBody[i].y
          ? false
          : moveSafety.right;
      moveSafety.left =
        myHead.x - 1 == myBody[i].x && myHead.y == myBody[i].y
          ? false
          : moveSafety.left;
      moveSafety.up =
        myHead.x == myBody[i].x && myHead.y + 1 == myBody[i].y
          ? false
          : moveSafety.up;
      moveSafety.down =
        myHead.x == myBody[i].x && myHead.y - 1 == myBody[i].y
          ? false
          : moveSafety.down;

      riskyMoves.right =
        myHead.x + 1 == myBody[i].x && myHead.y == myBody[i].y
          ? false
          : riskyMoves.right;
      riskyMoves.left =
        myHead.x - 1 == myBody[i].x && myHead.y == myBody[i].y
          ? false
          : riskyMoves.left;
      riskyMoves.up =
        myHead.x == myBody[i].x && myHead.y + 1 == myBody[i].y
          ? false
          : riskyMoves.up;
      riskyMoves.down =
        myHead.x == myBody[i].x && myHead.y - 1 == myBody[i].y
          ? false
          : riskyMoves.down;
    }
  }

  function riskyPres() {
    let ate = 1;
    if (gameState.you.health == 100) {
      ate = 0;
    }
    for (let i = 1; i < myBody.length - ate; i++) {
      riskyMoves.right =
        myHead.x + 1 == myBody[i].x && myHead.y == myBody[i].y
          ? false
          : riskyMoves.right;
      riskyMoves.left =
        myHead.x - 1 == myBody[i].x && myHead.y == myBody[i].y
          ? false
          : riskyMoves.left;
      riskyMoves.up =
        myHead.x == myBody[i].x && myHead.y + 1 == myBody[i].y
          ? false
          : riskyMoves.up;
      riskyMoves.down =
        myHead.x == myBody[i].x && myHead.y - 1 == myBody[i].y
          ? false
          : riskyMoves.down;
    }
  }

  selfPreservation();
  riskyPres();
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
      let h = 1;
      if (enemySnake.health == 100) {
        h = 0;
      }

      for (let i = 0; i < enemySnake.body.length - h; i++) {
        let enemyBody = enemySnake.body[i];
        moveSafety.right =
          myHead.x + 1 == enemyBody.x && myHead.y == enemyBody.y
            ? false
            : moveSafety.right;
        moveSafety.left =
          myHead.x - 1 == enemyBody.x && myHead.y == enemyBody.y
            ? false
            : moveSafety.left;
        moveSafety.up =
          myHead.x == enemyBody.x && myHead.y + 1 == enemyBody.y
            ? false
            : moveSafety.up;
        moveSafety.down =
          myHead.x == enemyBody.x && myHead.y - 1 == enemyBody.y
            ? false
            : moveSafety.down;
      }

      for (let neck of enemyNecks) {
        moveSafety.right =
          myHead.x + 1 == neck.x && myHead.y == neck.y
            ? false
            : moveSafety.right;
        moveSafety.left =
          myHead.x - 1 == neck.x && myHead.y == neck.y
            ? false
            : moveSafety.left;
        moveSafety.up =
          myHead.x == neck.x && myHead.y + 1 == neck.y ? false : moveSafety.up;
        moveSafety.down =
          myHead.x == neck.x && myHead.y - 1 == neck.y
            ? false
            : moveSafety.down;
        riskyMoves.right =
          myHead.x + 1 == neck.x && myHead.y == neck.y
            ? false
            : riskyMoves.right;
        riskyMoves.left =
          myHead.x - 1 == neck.x && myHead.y == neck.y
            ? false
            : riskyMoves.left;
        riskyMoves.up =
          myHead.x == neck.x && myHead.y + 1 == neck.y ? false : riskyMoves.up;
        riskyMoves.down =
          myHead.x == neck.x && myHead.y - 1 == neck.y
            ? false
            : riskyMoves.down;
      }
    }
    enemyDodging();

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
      enemyDodging();
      selfPreservation();
      riskyPres();
    }

    if (enemyLength < myLength) {
      let enemyMoves = [
        { x: enemyHead.x + 1, y: enemyHead.y },
        { x: enemyHead.x - 1, y: enemyHead.y },
        { x: enemyHead.x, y: enemyHead.y + 1 },
        { x: enemyHead.x, y: enemyHead.y - 1 },
      ];
      for (let move of enemyMoves) {
        priorityMoves.right =
          myHead.x + 1 == move.x && myHead.y == move.y
            ? true
            : priorityMoves.right;
        priorityMoves.left =
          myHead.x - 1 == move.x && myHead.y == move.y
            ? true
            : priorityMoves.left;
        priorityMoves.up =
          myHead.x == move.x && myHead.y + 1 == move.y
            ? true
            : priorityMoves.up;
        priorityMoves.down =
          myHead.x == move.x && myHead.y - 1 == move.y
            ? true
            : priorityMoves.down;
      }
      enemyDodging();
      selfPreservation();
      riskyPres();
    }
  }
  function getNextPosition(pos, dir) {
    let newPos = { x: pos.x, y: pos.y };

    if (dir == "up") {
      newPos.y += 1;
    } else if (dir == "down") {
      newPos.y -= 1;
    } else if (dir == "left") {
      newPos.x -= 1;
    } else if (dir == "right") {
      newPos.x += 1;
    }

    return newPos;
  }
  // Updated evaluateSpace function with proper parameters
  function evaluateSpace() {
    let visited = new Set();
    Object.keys(moveSafety).forEach((dir) => {
      if (!moveSafety[dir]) {
        spaceScores[dir] = 0;
        return;
      }
      let nextPos = getNextPosition(myHead, dir);
      let space = floodFill(nextPos, 0, new Set(visited));
      let exitAnalysis = countExits(nextPos);

      spaceScores[dir] =
        space +
        exitAnalysis.scores.up * 0.2 +
        exitAnalysis.scores.down * 0.2 +
        exitAnalysis.scores.left * 0.2 +
        exitAnalysis.scores.right * 0.2 +
        exitAnalysis.count * 10; // Bonus for multiple good exits
    });
  }
  evaluateSpace();

  let myLength = gameState.you.body.length;
  let myHealth = gameState.you.health;

  for (let snake of gameState.board.snakes) {
    if (snake.id == gameState.you.id) continue;

    let enemyHead = snake.body[0];
    let enemyLength = snake.body.length;

    // Only hunt snakes that are strictly SMALLER than you
    if (myLength > enemyLength && myHealth > 60) {
      let distance =
        Math.abs(myHead.x - enemyHead.x) + Math.abs(myHead.y - enemyHead.y);

      if (distance <= 2) {
        priorityMoves.right = enemyHead.x > myHead.x || priorityMoves.right;
        priorityMoves.left = enemyHead.x < myHead.x || priorityMoves.left;
        priorityMoves.up = enemyHead.y > myHead.y || priorityMoves.up;
        priorityMoves.down = enemyHead.y < myHead.y || priorityMoves.down;
      }
    }
  }

  function findBestFood(snakeHead, foodLocations) {
    let bestFood = null;
    let minDistance = 100000;

    for (let food of foodLocations) {
      let distance =
        Math.abs(snakeHead.x - food.x) + Math.abs(snakeHead.y - food.y);
      if (distance < minDistance) {
        minDistance = distance;
        bestFood = food;
      }
    }

    return bestFood;
  }
  if (gameState.turn < 30 || myLength < 5) {
    healthLimit = 100;
  } else if (gameState.turn < 120) {
    healthLimit = 70;
  } else {
    healthLimit = 20 * gameState.board.snakes.length;
  }

  if (myHealth < healthLimit) {
    priorityMoves = { up: false, down: false, left: false, right: false };
    let bestFood = findBestFood(myHead, gameState.board.food);
    if (bestFood) {
      priorityMoves.right = bestFood.x > myHead.x;
      priorityMoves.left = bestFood.x < myHead.x;
      priorityMoves.up = bestFood.y > myHead.y;
      priorityMoves.down = bestFood.y < myHead.y;
    }
  }
  let safeMoves = Object.keys(moveSafety).filter(
    (direction) => moveSafety[direction]
  );
  let riskyOptions = Object.keys(riskyMoves).filter(
    (direction) => riskyMoves[direction]
  );
  let futureSafeMoves = safeMoves.filter((move) =>
    futureSense(move, gameState, 16)
  );
  let moveScores = {};
  futureSafeMoves = futureSafeMoves.filter((move) =>
    isValidMove(gameState, move)
  );
  futureSafeMoves.forEach((move) => {
    moveScores[move] = 0;
    moveScores[move] += spaceScores[move] * 2;
    if (myHealth < healthLimit) {
      moveScores[move] += priorityMoves[move] ? 150 : 0;
      if (myHealth < 30) {
        moveScores[move] += priorityMoves[move] ? 700 : 0;
      }
    } else {
      moveScores[move] += priorityMoves[move] ? 70 : 0;
    }

    let nextPos = getNextPosition(myHead, move);
    let centerX = Math.floor(gameState.board.width / 2);
    let centerY = Math.floor(gameState.board.height / 2);
    let distanceToCenter =
      Math.abs(nextPos.x - centerX) + Math.abs(nextPos.y - centerY);

    if (gameState.turn < 150) {
      moveScores[move] += distanceToCenter * 12;
    }

    if (gameState.you.health > 40) {
      let nextMoves = countExits(nextPos, gameState.you.body.length).count;
      moveScores[move] += nextMoves * 5;
    }
    let myTail = myBody[myBody.length - 1];
    let tailPriorityMoves = [];

    if (myHead.x < myTail.x && moveSafety.right) {
      tailPriorityMoves.push("right");
    }
    if (myHead.x > myTail.x && moveSafety.left) {
      tailPriorityMoves.push("left");
    }
    if (myHead.y < myTail.y && moveSafety.up) {
      tailPriorityMoves.push("up");
    }
    if (myHead.y > myTail.y && moveSafety.down) {
      tailPriorityMoves.push("down");
    }
    const tailBias = Math.max(0, myBody.length - 1);

    for (const move of tailPriorityMoves) {
      if (moveScores[move] !== undefined) {
        if (myLength > 4) {
          moveScores[move] = moveScores[move] + tailBias * 10;
        } else {
          moveScores[move] += tailBias;
        }
      }
    }

    if (gameState.you.health > 50) {
      for (let snake of gameState.board.snakes) {
        if (snake.id == gameState.you.id) continue;

        if (snake.body.length < gameState.you.body.length) {
          let enemyHead = snake.body[0];
          let currentDistance =
            Math.abs(myHead.x - enemyHead.x) + Math.abs(myHead.y - enemyHead.y);
          let newDistance =
            Math.abs(nextPos.x - enemyHead.x) +
            Math.abs(nextPos.y - enemyHead.y);
          if (newDistance < currentDistance) {
            moveScores[move] += 10;
          }
        }
      }
    }

    if (gameState.you.health < 100) {
      for (let snake of gameState.board.snakes) {
        if (snake.id == gameState.you.id) continue;

        if (snake.body.length > gameState.you.body.length) {
          let enemyHead = snake.body[0];
          let currentDistance =
            Math.abs(myHead.x - enemyHead.x) + Math.abs(myHead.y - enemyHead.y);
          let newDistance =
            Math.abs(nextPos.x - enemyHead.x) +
            Math.abs(nextPos.y - enemyHead.y);
          if (newDistance < currentDistance) {
            moveScores[move] -= 10;
          }
        }
      }
    }
  });
  let bestMove = null;
  let bestScore = -100000;
  let futureSafeMovesFinal = safeMoves.filter((move) =>
    futureSense(move, gameState, 13)
  );
  if (futureSafeMovesFinal.length > 0) {
    futureSafeMovesFinal = futureSafeMovesFinal.filter(
      (move) => isValidMove(gameState, move) && moveSafety[move]
    );
    for (let move of futureSafeMovesFinal) {
      if (moveScores[move] > bestScore) {
        bestScore = moveScores[move];
        bestMove = move;
      }
    }
    if (bestMove && moveSafety[bestMove] && bestScore > 50) {
      console.log(
        `Snake ID: ${gameState.you.id} Turn: ${gameState.turn} - Choosing best future-safe move: ${bestMove} (score: ${moveScores[bestMove]})`
      );
      return { move: bestMove };
    }
  }
  for (let depth of [10, 9, 8, 7]) {
    let bestMoveAtDepth = null;
    let bestScoreAtDepth = -100000;
    let validMovesAtDepth = [];
    for (let move of safeMoves) {
      if (moveSafety[move] && futureSense(move, gameState, depth)) {
        validMovesAtDepth.push(move);
      }
    }
    if (validMovesAtDepth.length > 0) {
      let depthMoveScores = {};
      for (let move of validMovesAtDepth) {
        depthMoveScores[move] = 0;
        depthMoveScores[move] += spaceScores[move] * 2;
        if (myHealth < 50) {
          depthMoveScores[move] += priorityMoves[move] ? 400 : 0;
        } else {
          depthMoveScores[move] += priorityMoves[move] ? 70 : 0;
        }
        if (depthMoveScores[move] > bestScoreAtDepth) {
          bestScoreAtDepth = depthMoveScores[move];
          bestMoveAtDepth = move;
        }
      }
      if (bestMoveAtDepth) {
        console.log(
          `Snake ID: ${gameState.you.id} Turn: ${gameState.turn} - Choosing best-scored safe move with ${depth} future-sense: ${bestMoveAtDepth} (score: ${bestScoreAtDepth})`
        );
        return { move: bestMoveAtDepth };
      }
    }
  }

  for (let depth of [10, 5, 3, 2, 1, 0]) {
    let bestMoveAtDepth = null;
    let bestScoreAtDepth = -100000;
    let validMovesAtDepth = [];
    for (let move of riskyOptions) {
      if (riskyOptions[move] && futureSense(move, gameState, depth)) {
        validMovesAtDepth.push(move);
      }
    }
    if (validMovesAtDepth.length > 0) {
      let depthMoveScores = {};
      for (let move of validMovesAtDepth) {
        depthMoveScores[move] = 0;
        depthMoveScores[move] += spaceScores[move] * 2;
        if (myHealth < 50) {
          depthMoveScores[move] += priorityMoves[move] ? 400 : 0;
        } else {
          depthMoveScores[move] += priorityMoves[move] ? 70 : 0;
        }
        if (depthMoveScores[move] > bestScoreAtDepth) {
          bestScoreAtDepth = depthMoveScores[move];
          bestMoveAtDepth = move;
        }
      }
      if (bestMoveAtDepth) {
        console.log(
          `Snake ID: ${gameState.you.id} Turn: ${gameState.turn} - Choosing best-scored risky move with ${depth} future-sense: ${bestMoveAtDepth} (score: ${bestScoreAtDepth})`
        );
        return { move: bestMoveAtDepth };
      }
    }
  }
  if (riskyOptions.length > 0) {
    bestMove = riskyOptions[0];
    console.log(
      `Snake ID: ${gameState.you.id} Turn: ${gameState.turn} - Using fallback risky move: ${bestMove}`
    );
    return { move: bestMove };
  }
  if (safeMoves.length > 0) {
    bestMove = safeMoves[0];
    console.log(
      `Snake ID: ${gameState.you.id} Turn: ${gameState.turn} - Using fallback safe move: ${bestMove}`
    );
    return { move: bestMove };
  } else {
    const allDirections = ["up", "down", "left", "right"];
    if (riskyOptions.length > 0) {
      bestMove = riskyOptions[0];
      console.log(
        `Snake ID: ${gameState.you.id} Turn: ${gameState.turn} - Using fallback risky move: ${bestMove}`
      );
      return { move: bestMove };
    }
    for (let dir of allDirections) {
      let nextPos = getNextPosition(myHead, dir);
      if (
        nextPos.x >= 0 &&
        nextPos.x < gameState.board.width &&
        nextPos.y >= 0 &&
        nextPos.y < gameState.board.height
      ) {
        let hitSelf = false;
        for (let i = 0; i < myBody.length - 1; i++) {
          if (nextPos.x === myBody[i].x && nextPos.y === myBody[i].y) {
            hitSelf = true;
            break;
          }
        }
        if (!hitSelf) {
          console.log(
            `Snake ID: ${gameState.you.id} Turn: ${gameState.turn} - Last resort move: ${dir}`
          );
          return { move: dir };
        }
      }
    }

    const randomDir =
      allDirections[Math.floor(Math.random() * allDirections.length)];
    console.log(
      `Snake ID: ${gameState.you.id} Turn: ${gameState.turn} - No valid moves, using random direction: ${randomDir}`
    );
    return { move: randomDir };
  }

  //  floodFill and countExits functions
  function floodFill(pos, depth, visited, limit = 100) {
    const key = `${pos.x},${pos.y}`;
    if (visited.has(key) || depth > limit) return 0;
    visited.add(key);

    // Out of bounds
    if (
      pos.x < 0 ||
      pos.x >= gameState.board.width ||
      pos.y < 0 ||
      pos.y >= gameState.board.height
    )
      return 0;

    // Check if the tile is occupied by any body
    for (let snake of gameState.board.snakes) {
      for (let i = 0; i < snake.body.length; i++) {
        const segment = snake.body[i];
        if (segment.x == pos.x && segment.y == pos.y) return 0;
      }
    }

    // Avoid tiles enemy heads might move into
    const dangerousTiles = getEnemyHeadNextMoves();
    for (let danger of dangerousTiles) {
      if (danger.x == pos.x && danger.y == pos.y) return 0;
    }

    let space = 1;
    for (let dx of [-1, 1]) {
      space += floodFill(
        { x: pos.x + dx, y: pos.y },
        depth + 1,
        visited,
        limit
      );
    }
    for (let dy of [-1, 1]) {
      space += floodFill(
        { x: pos.x, y: pos.y + dy },
        depth + 1,
        visited,
        limit
      );
    }

    return space;
  }

  function countExits(pos, myLength) {
    const directions = {
      up: { x: pos.x, y: pos.y + 1 },
      down: { x: pos.x, y: pos.y - 1 },
      left: { x: pos.x - 1, y: pos.y },
      right: { x: pos.x + 1, y: pos.y },
    };

    const enemyHeadMoves = getEnemyHeadNextMoves(myLength);
    let scores = {};
    let count = 0;

    for (let dir in directions) {
      const p = directions[dir];
      let isSafe = true;

      // Check board boundaries
      if (
        p.x < 0 ||
        p.x > gameState.board.width - 1 ||
        p.y < 0 ||
        p.y > gameState.board.height - 1
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

      // Mark snakes of equal or greater length as dangerous
      const isDangerous = snake.body.length >= myLength;
      if (!isDangerous) continue;

      const head = snake.body[0];
      const possibleMoves = [
        { x: head.x + 1, y: head.y },
        { x: head.x - 1, y: head.y },
        { x: head.x, y: head.y + 1 },
        { x: head.x, y: head.y - 1 },
      ];

      for (let move of possibleMoves) {
        // Ignore out-of-bounds
        if (
          move.x >= 0 &&
          move.x < gameState.board.width &&
          move.y >= 0 &&
          move.y < gameState.board.height
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
  if (depth <= 0) {
    // base case
    return true;
  }

  let newGameState = JSON.parse(JSON.stringify(gameState));
  let mySnake = newGameState.you;
  let myBody = mySnake.body;

  let newHead = { ...myBody[0] }; // clone so it can't be changed
  if (move == "up") {
    newHead.y += 1;
  } else if (move == "down") {
    newHead.y -= 1;
  } else if (move == "left") {
    newHead.x -= 1;
  } else if (move == "right") {
    newHead.x += 1;
  }

  myBody.unshift(newHead);
  mySnake.health -= 1;

  if (
    newHead.x < 0 ||
    newHead.x > newGameState.board.width - 1 ||
    newHead.y < 0 ||
    newHead.y > newGameState.board.height - 1
  ) {
    return false;
  }
  for (let i = 1; i < myBody.length - 1; i++) {
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
      { move: "right", x: enemyHead.x + 1, y: enemyHead.y },
    ];

    for (let dir of directions) {
      if (
        dir.x < 0 ||
        dir.x > newGameState.board.width ||
        dir.y < 0 ||
        dir.y > newGameState.board.height
      ) {
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

    let randomMove =
      possibleEnemyMoves[Math.floor(Math.random() * possibleEnemyMoves.length)];

    snake.body.unshift({ x: randomMove.x, y: randomMove.y });
    if (snake.health != 100) {
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
    for (let i = 0; i < snake.body.length - 1; i++) {
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

function isValidMove(gameState, move) {
  const head = gameState.you.head;
  const boardWidth = gameState.board.width;
  const boardHeight = gameState.board.height;

  let newPos = { x: head.x, y: head.y };

  if (move === "up") {
    newPos.y += 1;
  } else if (move === "down") {
    newPos.y -= 1;
  } else if (move === "left") {
    newPos.x -= 1;
  } else if (move === "right") {
    newPos.x += 1;
  }
  if (
    newPos.x < 0 ||
    newPos.x >= boardWidth ||
    newPos.y < 0 ||
    newPos.y >= boardHeight
  ) {
    return false;
  }

  return true;
}
