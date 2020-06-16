
const Game = {

    title: 'Geometry Dash',
    description: 'Imposible game!',
    authors: 'Tirso del Álamo y Elena Sánchez',
    license: null,
    version: '1',
    canvasDom: undefined,
    ctx: undefined,
    canvasSize: {
        w: undefined,
        h: undefined
    },
    keySPACE: 32,
    groundHeight: 50,
    refDimensions: 25,
    velX: 2,
    fps: 60,

    music: {
        levelSound: new Audio('sound/levelSoundComplete50sec.mp3'),
        crashSound: new Audio('sound/explode_11.mp3'),
        jumpSound: new Audio('sound/350906__cabled-mess__jump-c-04.wav') 
    },


    background : undefined,
    player: undefined,
    obstacles: {
        squares: [],
        triangles: [],
        picks: []
    },



    init(id){
        this.canvasDom = document.getElementById(id)
        this.ctx = this.canvasDom.getContext('2d')
        this.setDimensions()
        this.createBackground()
        this.createPlayer()
        this.createObstacles()
        this.start()
   
    },

    start() {
        this.music.levelSound.play()
        this.music.levelSound.volume = 0.1
        setInterval(() =>{
            this.clearScreen()
            this.draw()
            this.detectCollisions()
            this.removeObstacles()

        },1000 / this.fps)
    },
    
    setDimensions(){
        
        this.canvasSize.w = window.innerWidth / 2
        this.canvasSize.h = 300
        this.canvasDom.setAttribute('width', this.canvasSize.w)
        this.canvasDom.setAttribute('height', this.canvasSize.h)
    },
    
    createBackground() {
        this.background = new Background(this.ctx, this.canvasSize, this.groundHeight)

    },
    
    createPlayer(){
        
        this.player = new Player(this.ctx, this.canvasSize, this.groundHeight, this.refDimensions, this.keySPACE)

    },

    createObstacles(){

        arrSquareObstacles.forEach(elem => {
            this.obstacles.squares.push(new Square (this.ctx, this.canvasSize, this.groundHeight, this.refDimensions, elem.posX , elem.posY, this.velX))
        })
        arrTriangleObstacles.forEach(elem => {
            this.obstacles.triangles.push(new Triangle (this.ctx, this.canvasSize, this.groundHeight, this.refDimensions, elem.posX, elem.posY, this.velX))
        })
        arrPicksObstacles.forEach(elem => {
            this.obstacles.picks.push(new Picks (this.ctx, this.canvasSize, this.groundHeight, this.refDimensions, elem.posX, elem.posY, this.velX))
        })

    },

    draw(){

        this.background.drawBackground()
        this.background.drawGround()
        this.player.drawPlayer()
        this.obstacles.squares.forEach(elem => elem.drawSquares())
        this.obstacles.triangles.forEach(elem => elem.drawTriangles()) 
        this.obstacles.picks.forEach(elem => elem.drawPicks()) 

    },

    clearScreen() {
        this.ctx.clearRect(0 ,0 , this.canvasSize.w, this.canvasSize.h)
    },

    removeObstacles(){
        this.obstacles.squares = this.obstacles.squares.filter(elem => elem.obstaclesPosition.posX >= -this.refDimensions * 2)

        this.obstacles.triangles = this.obstacles.triangles.filter(elem => elem.obstaclesPosition.posX >= -this.refDimensions * 2)

        this.obstacles.picks = this.obstacles.picks.filter(elem => elem.obstaclesPosition.posX >= -this.refDimensions * 2)
      
    },
    // playSound(){
    //     const audio = new Audio(src="/sound/levelSoundComplete50sec.mp3") // NO NECESARIO
    //     audio.loop = false
    //     audio.play()

    // },


//---------------------------------------COLLISIONS---------------------------------------------------------------------------------


    detectCollisions(){
        //VAMOS A COMPROBAR SI ALGUN ELEMENTO ESTA COLISIONANDO
        //PARA ELLO VAMOS A USAR EN VEZ DE FOREACH, SOME
        //NUESTRO detectModifyColisionSquares DEVOLVERA AHORA TRUE/FALSE
        //SI ALGUNO DEVUELVE, SOME DEVOLVERA TRUE

    //----------------------------ground collisions---------------------------------
        if(this.isGroundColliding()){
            this.player.currentBasePosition = this.canvasSize.h - this.groundHeight
            this.player.playerPosition.y = this.player.currentBasePosition
            this.player.isJumping = false
        }
    //----------------------------positive square collisions-----------------
        if(this.obstacles.squares.some(square => this.isSquarePositiveColliding(square))){
            this.player.isColliding = true
            this.player.isJumping = false
        } else {
            this.player.isColliding = false
        }
    //----------------------------negative square lateral collisions-----------------

        if(this.obstacles.squares.some(square => this.isSquareLateralNegativeColliding(square))){
            this.gameOver()
        }
        
    //----------------------------negative square down collisions-----------------

        if(this.obstacles.squares.some(square => this.isSquareDownNegativeColliding(square))){
            this.gameOver()
        }
    //----------------------------triangle Up collisions------------------------

        if(this.obstacles.triangles.some(triangles => this.isTriangleUpNegativeColliding(triangles))){
            this.gameOver()
        }
    
    //----------------------------triangle lateral collisions------------------------

        if(this.obstacles.triangles.some(triangles => this.isTriangleLateralNegativeColliding(triangles))){
            this.gameOver()
        }


    //----------------------------pikes collisions---------------------------

        if(this.obstacles.picks.some(picks => this.isPickNegativeColliding(picks))){
            this.gameOver()
        }

    },


    isGroundColliding(){
        if (this.player.playerPosition.y >= this.canvasSize.h - this.groundHeight){
            return true

        } else {
            return false
        }
    },


    isSquarePositiveColliding(square) {
       // ESTOY EN EL EJE Y CORRECTO
        if (this.player.playerPosition.y <= square.obstaclesPosition.posY - this.refDimensions + 5 &&
            this.player.playerPosition.y >= square.obstaclesPosition.posY - this.refDimensions - 5 &&
            
            //MI VERTICE ABAJO/IZQ ESTA TOCANDO EL CUADRADO
            ((this.player.playerPosition.x >= square.obstaclesPosition.posX &&
                this.player.playerPosition.x <= square.obstaclesPosition.posX + this.refDimensions)
            ||
            //MI VERTICE ABAJO/DER ESTA TOCANDO EL CUADRADO
            (this.player.playerPosition.x + this.refDimensions >= square.obstaclesPosition.posX &&
            this.player.playerPosition.x + this.refDimensions <= square.obstaclesPosition.posX + this.refDimensions)
            )) {

            this.player.playerPosition.y =  square.obstaclesPosition.posY - this.refDimensions
            this.player.currentBasePosition = square.obstaclesPosition.posY - this.refDimensions
            return true

        } else {
            return false
        }

    },


    isSquareLateralNegativeColliding(square) {
        // ESTOY EN EL EJE X CORRECTO
        if (!this.player.isColliding && 
            this.player.playerPosition.x + this.refDimensions >= square.obstaclesPosition.posX -1 &&
            this.player.playerPosition.x + this.refDimensions <= square.obstaclesPosition.posX + 1 && //los cuadrados tocan por los vertices de abajo)
            
            ((this.player.playerPosition.y >= square.obstaclesPosition.posY - this.refDimensions &&
            this.player.playerPosition.y  <= square.obstaclesPosition.posY)
            ||
            (this.player.playerPosition.y - this.refDimensions >= square.obstaclesPosition.posY &&
            this.player.playerPosition.y - this.refDimensions <= square.obstaclesPosition.posY - this.refDimensions)
                ))
             {
            
            return true

        } else {
            return false 
        }

    },

    isSquareDownNegativeColliding(square){

        if (this.player.playerPosition.y - this.refDimensions<= square.obstaclesPosition.posY  + 3 &&
            this.player.playerPosition.y - this.refDimensions>= square.obstaclesPosition.posY  - 3 &&
            
            //MI VERTICE ABAJO/IZQ ESTA TOCANDO EL CUADRADO
            ((this.player.playerPosition.x >= square.obstaclesPosition.posX &&
                this.player.playerPosition.x <= square.obstaclesPosition.posX + this.refDimensions)
            ||
            //MI VERTICE ABAJO/DER ESTA TOCANDO EL CUADRADO
            (this.player.playerPosition.x + this.refDimensions >= square.obstaclesPosition.posX &&
            this.player.playerPosition.x + this.refDimensions <= square.obstaclesPosition.posX + this.refDimensions)
            )) {

            return true

        } else {
            return false
        }

    },


    isTriangleUpNegativeColliding(triangle){ //POSIBLES RETOQUES DE ANCHO

        if (this.player.playerPosition.y <= triangle.obstaclesPosition.posY - 20 + 3 && 
            this.player.playerPosition.y >= triangle.obstaclesPosition.posY - 20 - 3 &&
            
            //MI VERTICE ABAJO/IZQ ESTA TOCANDO EL CUADRADO
            ((this.player.playerPosition.x >= triangle.obstaclesPosition.posX + 11.5 &&
                this.player.playerPosition.x <= triangle.obstaclesPosition.posX + 13.5)
            ||
            //MI VERTICE ABAJO/DER ESTA TOCANDO EL CUADRADO
            (this.player.playerPosition.x + this.refDimensions >= triangle.obstaclesPosition.posX + 11.5 &&
            this.player.playerPosition.x + this.refDimensions <= triangle.obstaclesPosition.posX + 13.5) 
            )) {

            return true

        } else {

            return false
        }

    },


    isTriangleLateralNegativeColliding(triangle){ //POSIBLES RETOQUES DE ANCHO
        
        if (this.player.playerPosition.x + this.refDimensions >= triangle.obstaclesPosition.posX +11.5 -2 &&
            this.player.playerPosition.x + this.refDimensions <= triangle.obstaclesPosition.posX + 13.5 + 2 && //los cuadrados tocan por los vertices de abajo)
            
            ((this.player.playerPosition.y >= triangle.obstaclesPosition.posY - this.refDimensions &&
            this.player.playerPosition.y  <= triangle.obstaclesPosition.posY)
            ||
            (this.player.playerPosition.y - this.refDimensions >= triangle.obstaclesPosition.posY &&
            this.player.playerPosition.y - this.refDimensions <= triangle.obstaclesPosition.posY - this.refDimensions)
                ))
             {
            
            return true

        } else {
            return false 
        }

    },

    
    isPickNegativeColliding(picks) {
        // ESTOY EN EL EJE Y CORRECTO
         if (this.player.playerPosition.y <= picks.obstaclesPosition.posY - this.refDimensions/2 + 3 && 
             this.player.playerPosition.y >= picks.obstaclesPosition.posY - this.refDimensions/2 - 3 &&
             
             //MI VERTICE ABAJO/IZQ ESTA TOCANDO EL CUADRADO
             ((this.player.playerPosition.x >= picks.obstaclesPosition.posX &&
                 this.player.playerPosition.x <= picks.obstaclesPosition.posX + this.refDimensions * 2)
             ||
             //MI VERTICE ABAJO/DER ESTA TOCANDO EL CUADRADO
             (this.player.playerPosition.x + this.refDimensions >= picks.obstaclesPosition.posX + this.refDimensions * 2 &&
             this.player.playerPosition.x + this.refDimensions <= picks.obstaclesPosition.posX + this.refDimensions * 2) 
             )) {

 
             return true
 
         } else {
             return false
         }
 
     },




    gameOver() {

        this.music.levelSound.pause()
        const canvas = document.querySelector('canvas')
        canvas.style.display = 'none'
        const gameOverScreen = document.querySelector('.gameOver')
        gameOverScreen.style.display = 'block'
        document.addEventListener('keydown', e =>{
            if (e.keyCode == 82){
                location.reload()  
            }
        })
        return true
    }

}