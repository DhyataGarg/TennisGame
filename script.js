 var canvas, canvasContext, ballX = 50, ballY = 50, ballSpeedX = 10, ballSpeedY = 4, paddle1Y = 250, 
    paddle2Y = 250, player1Score = 0, player2Score = 0, showingWinSreen = false;
    const PADDLE_HEIGHT = 100, PADDLE_THICKNESS = 10, WINNING_SCORE = 3;

    function calculateMousePos (evt) {
        var rect = canvas.getBoundingClientRect();
        var root = document.documentElement;
        var mouseX = evt.clientX - rect.left - root.scrollLeft;
        var mouseY = evt.clientY - rect.top - root.scrollTop;
        return {
            x: mouseX,
            y: mouseY
        };
    }

    function handleMouseClick (evt) {
        if(showingWinSreen){
            player1Score = 0;
            player2Score = 0;
            showingWinSreen = false
        }
    }
 
    window.onload = function (){    
        canvas = document.querySelector('#gameCanvas');
        canvasContext = canvas.getContext('2d');

        var framesPerSecond = 30;
        setInterval(() => {
            moveEverything();
            drawEverything();
        }, 1000 / framesPerSecond)

        canvas.addEventListener('mousedown', handleMouseClick)

        canvas.addEventListener('mousemove', (evt) => {
            var mousePos = calculateMousePos(evt);
            paddle1Y = mousePos.y - (PADDLE_HEIGHT / 2);
        })
    }

    function ballReset () {
        if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE){
            showingWinSreen = true
        }


        ballSpeedX = -ballSpeedX;
        ballX = canvas.width/2;
        ballY = canvas.height/2;
    }

    function computerMovement () {
        var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT / 2);
        if(paddle2YCenter < ballY - 35) {
            paddle2Y += 6;
        }else if(paddle2YCenter > ballY + 35){
            paddle2Y -= 6;
        }
    }

    function moveEverything(){
        if (showingWinSreen){
            return;
        }
        computerMovement();

        ballX += ballSpeedX;
        ballY += ballSpeedY;
        if(ballX < 0) {
            if(ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT){
                ballSpeedX = -ballSpeedX;
                var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT/2);
                ballSpeedY = deltaY * 0.35;
            }else{
                player2Score++; // must be BEFORE ballReset()
                ballReset();
            }
        }
        if(ballX > canvas.width) {
            if(ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT){
                ballSpeedX = -ballSpeedX;
                var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT/2);
                ballSpeedY = deltaY * 0.35;
            }else{
                player1Score++;
                ballReset();
            }        
        }
        if(ballY > canvas.height || ballY < 0) {
            ballSpeedY = -ballSpeedY;
        }
    }

    function drawNet () {
        for (var i = 10; i < canvas.height; i+=40){
            colorRect(canvas.width/2 -1, i, 2, 20, 'white')
        }
    }

    function drawEverything(){
        // next link blanks out the screen with black
        colorRect(0, 0, canvas.width, canvas.height, 'black')
        
        canvasContext.fillStyle = 'white';
        if (showingWinSreen){
            if(player1Score >= WINNING_SCORE){
                canvasContext.fillText ("Left Player Won!!", 350, 200)
            }else{
                canvasContext.fillText ("Right Player Won!!", 350, 200)
            }
            canvasContext.fillText ("Click to continue", 350, 500)
            return;
        }
        
        drawNet();
        // next link draws the left player paddle
        colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white')
        // next link draws the right computer paddle
        colorRect(canvas.width - PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white')
        // next line draws the ball
        colorCircle(ballX, ballY, 10, 'white');

        canvasContext.fillText (player1Score, 100, 100)
        canvasContext.fillText (player2Score, canvas.width - 100, 100)
    }

    function colorCircle (centerX, centerY, radius, drawColor) {
        canvasContext.fillStyle = drawColor;
        canvasContext.beginPath();
        canvasContext.arc(centerX, centerY, radius ,0, Math.PI * 2, true)
        canvasContext.fill();
    }

    function colorRect (leftX, topY, width, height, drawColor){
        canvasContext.fillStyle = drawColor;
        canvasContext.fillRect (leftX, topY, width, height);
    }
