namespace SpriteKind {
    export const Enemy = SpriteKind.create()
    export const Exit = SpriteKind.create()
}

scene.setBackgroundColor(13)
game.splash("BOB THE NORMAL GUY", "Find the exit!")
info.setLife(3)

let onGround = false
let ended = false

// Bob sprite
let bobImage = image.create(16, 16)
bobImage.fillRect(5, 2, 6, 6, 5)
bobImage.fillRect(4, 0, 8, 2, 2)
bobImage.fillRect(7, 5, 2, 2, 4)
bobImage.fillRect(4, 8, 8, 6, 9)
bobImage.fillRect(1, 13, 6, 3, 1)
bobImage.fillRect(9, 13, 6, 3, 1)

let bob = sprites.create(bobImage, SpriteKind.Player)
bob.x = 30
bob.y = 80
bob.ay = 500
controller.moveSprite(bob, 85, 0)
scene.cameraFollowSprite(bob)

let platforms: Sprite[] = []

function makePlatform(left: number, top: number, width: number) {
    let platformImage = image.create(width, 8)
    platformImage.fill(4)
    platformImage.fillRect(0, 0, width, 2, 2)

    let platform = sprites.create(platformImage, SpriteKind.Food)
    platform.x = left + width / 2
    platform.y = top + 4
    platforms.push(platform)
}

makePlatform(0, 104, 240)
makePlatform(245, 88, 75)
makePlatform(345, 72, 75)
makePlatform(430, 104, 190)
makePlatform(535, 82, 70)
makePlatform(650, 104, 260)

// Juggling Jester
let enemyImage = image.create(14, 14)
enemyImage.fillRect(2, 3, 10, 10, 10)
enemyImage.fillRect(3, 0, 8, 3, 2)
enemyImage.setPixel(5, 6, 1)
enemyImage.setPixel(9, 6, 1)

let enemy = sprites.create(enemyImage, SpriteKind.Enemy)
enemy.x = 490
enemy.y = 96
enemy.vx = 25

// Exit door
let exitImage = image.create(16, 26)
exitImage.fill(5)
exitImage.fillRect(3, 4, 10, 22, 13)
exitImage.setPixel(10, 15, 2)

let exit = sprites.create(exitImage, SpriteKind.Exit)
exit.x = 875
exit.y = 91

controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (onGround && !ended) {
        bob.vy = -180
        onGround = false
    }
})

controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!ended) {
        bob.vy = 190
        onGround = false
    }
})

controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!ended) {
        bob.vy = 190
        onGround = false
    }
})

game.onUpdate(function () {
    if (ended) return

    let previousBottom = bob.bottom
    onGround = false

    for (let platform of platforms) {
        let crossedTop =
            previousBottom <= platform.top + 2 &&
            bob.bottom >= platform.top &&
            bob.vy >= 0 &&
            bob.right > platform.left &&
            bob.left < platform.right

        if (crossedTop) {
            bob.bottom = platform.top
            bob.vy = 0
            onGround = true
        }
    }

    if (bob.y > 170) {
        info.changeLifeBy(-1)
        bob.x = 30
        bob.y = 80
        bob.vy = 0
    }

    if (enemy.x < 455) enemy.vx = 25
    if (enemy.x > 555) enemy.vx = -25
})

sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (player, badGuy) {
    if (player.vy > 0 && player.bottom < badGuy.y + 8) {
        badGuy.destroy(effects.disintegrate, 200)
        player.vy = -110
    } else {
        info.changeLifeBy(-1)
        player.x = 30
        player.y = 80
        player.vy = 0
    }
})

sprites.onOverlap(SpriteKind.Player, SpriteKind.Exit, function (player, door) {
    if (ended) return
    ended = true
    game.splash("BOB ESCAPED THE CIRCUS!")
    game.splash("He wakes in a hospital...")
    game.splash("His family is beside him.")
    game.splash("The circus was a dream.")
    game.over(true)
})
