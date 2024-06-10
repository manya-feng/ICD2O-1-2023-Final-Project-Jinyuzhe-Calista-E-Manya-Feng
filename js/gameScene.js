/* global Phaser */

// Copyright (c) 2024 Calista.E and Manya ALL Rights reserved
//
// Created by: Calista.E and Manya
// Created on: May 2024
// This is the Game Scene

/**
 * This class is the Game Scene.
 */
class GameScene extends Phaser.Scene {

    // create a fruit
    createFruit () {
      const fruitXLocation = Math.floor(Math.random() * 1920) + 1 // this will get a number between 1 and 1920
      let fruitXVelocity = Math.floor(Math.random() * 50) + 1 // this will get a number between 1 and 50:
      fruitXVelocity *= Math.round(Math.random()) ? 1 : -1 // this will add minus sign in 50% of cases
      const aFruit = this.physics.add.sprite(fruitXLocation, -100, "fruit")
      aFruit.body.velocity.y = 200
      aFruit.body.velocity.x = fruitXVelocity
      this.fruitGroup.add(aFruit)
    }
  
    constructor() {
      super({ key: "gameScene" })

      this.background = null
      this.girl = null
      this.plate = false
      this.score = 0
      this.scoreText = null
      this.scoreTextStyle = { font: "65px Arial", fill: "#ffffff", align:"center"}
      this.gameOverTextStyle = { font: "65px Arial", fill: "#ff0000", align: "center" }
    }
  
    /**
     * Can be defined on your own Scenes.
     * This method is called by the Scene Manager when the scene starts,
     *   before preload() and create().
     * @param {object} data - Any data passed via ScenePlugin.add() or ScenePlugin.start().
     */
    init(data) {
      this.cameras.main.setBackgroundColor("#0x5f6e7a")
    }
  
    /**
     * Can be defined on your own Scenes.
     * Use it to load assets.
     */
    preload() {
      console.log("Game Scene")
  
      // images
      this.load.image("fruitsBackground", "./assets/gameSceneBackground.png")
      this.load.image("girl", "./assets/girl.png")
      this.load.image("plate", "assets/plate.png")
      this.load.image("grape", "assets/grape.png")
      this.load.image("apple", "assets/apple.png")
      this.load.image("mango", "assets/mango.png")
      this.load.image("strawberry", "assets/strawberry.png")
      this.load.image("watermelon", "assets/watermelon.png")

      // sound
      this.load.audio("bomb", "assets/bomb.wav")
      this.load.audio("gameOver", "assets/game over.wav")
      this.load.audio("getFruits", "assets/get fruits.wav")
    }
  
    /**
     * Can be defined on your own Scenes.
     * Use it to create your game objects.
     * @param {object} data - Any data passed via ScenePlugin.add() or ScenePlugin.start().
     */
    create(data) {
      this.background = this.add.image(0, 0, "fruitsBackground").setScale(4.0)
      this.background.setOrigin(0, 0)
  
      this.scoreText = this.add.text(10, 10, "Score: " + this.score.toString(), this.scoreTextStyle)
  
      this.girl = this.physics.add.sprite(1920 / 2, 1080 - 100, "girl")

      // create a group for the plate
      this.plateGroup = this.physics.add.group()

      // create a group for the fruits
      this.fruitsGroup = this.add.group()
      this.createFruits()
  
      // Collisions between plate and fruits
      this.physics.add.collider(this.plateGroup, this.fruitsGroup, function (plateCollide, fruitsCollide) {
        fruitsCollide.destroy()
        plateCollide.destroy()
        this.sound.play("get fruits")
        this.score = this.score + 1
        this.scoreText.setText("Score: " + this.score.toString())
        this.createFruits()
        this.createFruits()
      }.bind(this))
  
      // Collisions between girl and bomb
      this.physics.add.collider(this.girl, this.bombGroup, function (girlCollide, bombCollide) {
        this.sound.play("bomb")
        this.physics.pause()
        bombCollide.destroy()
        girlCollide.destroy()
        this.gameOverText = this.add.text(1920 / 2, 1080 / 2, "Game Over!\nClick to play again.", this.gameOverTextStyle).setOrigin(0.5)
        this.gameOverText.setInteractive({ useHandCursor: true })
        this.score = 0
        this.gameOverText.on("pointerdown", () => this.scene.start("gameScene"))
      }.bind(this))
    }
  
    /**
     * Should be overridden by your own Scenes.
     * This method is called once per game step while the scene is running.
     * @param {number} time - The current time.
     * @param {number} delta - The delta time in ms since the last frame.
     */
    update(time, delta) {
      // called 60 times a second, hopefully!
  
      const keyLeftObj = this.input.keyboard.addKey("LEFT")
      const keyRightObj = this.input.keyboard.addKey("RIGHT")
      const keySpaceObj = this.input.keyboard.addKey("SPACE")
  
      if (keyLeftObj.isDown === true) {
        this.girl.x -= 15
        if (this.girl.x < 0) {
          this.girl.x = 0
        }
      }
  
      if (keyRightObj.isDown === true) {
        this.girl.x = this.girl.x + 15
        if (this.girl.x > 1920) {
          this.girl.x = 1920
        }
      }
  
      if (keySpaceObj.isDown === true) {
        if (this.bigPlate === false) {
          // plate
          this.bigPlate = true
          const aNewPlate = this.physics.add.sprite(this.girl.x, this.girl.y, "plate")
          this.plateGroup.add(aNewPlate)
          this.sound.play("laser")
        }
      }
  
      if (keySpaceObj.isUp === true) {
        this.bigPlate = false
      }
  
      this.plateGroup.children.each(function (item) {
        item.y = item.y - 15
        if (item.y < 0) {
          item.destroy()
        }
      })
    }
  }
  
  export default GameScene
  