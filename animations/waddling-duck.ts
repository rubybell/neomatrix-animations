// It's a waddling duck!
// Vibe coded with Claude in March 2026

function drawDuck (x: number, waddle: number) {
    strip.clear()
    // body
    setPixel(x, 4, yellow)
    setPixel(x + 1, 4, yellow)
    setPixel(x - 1, 5, yellow)
    setPixel(x, 5, yellow)
    setPixel(x + 1, 5, yellow)
    setPixel(x + 2, 5, yellow)
    setPixel(x - 1, 6, yellow)
    setPixel(x, 6, yellow)
    setPixel(x + 1, 6, yellow)
    setPixel(x + 2, 6, yellow)
    // head
    setPixel(x + 1, 2, yellow)
    setPixel(x + 2, 2, yellow)
    setPixel(x + 1, 3, yellow)
    setPixel(x + 2, 3, yellow)
    // eye
    setPixel(x + 2, 2, white)
    // beak
    setPixel(x + 3, 3, orange)
    // feet alternate with waddle
    setPixel(x, 7, orange)
    setPixel(x + 1 + waddle, 7, orange)
    strip.show()
}
function setPixel (x: number, y: number, colour: number) {
    if (x >= 0 && x < 8 && y >= 0 && y < 8) {
        strip.setPixelColor(y * 8 + x, colour)
    }
}
let white = 0
let orange = 0
let yellow = 0
let strip: neopixel.Strip = null
strip = neopixel.create(DigitalPin.P0, 64, NeoPixelMode.RGB)
strip.setBrightness(30)
yellow = neopixel.rgb(255, 180, 0)
orange = neopixel.rgb(255, 80, 0)
white = neopixel.rgb(255, 255, 255)
basic.forever(function () {
    for (let pos = -3; pos < 9; pos++) {
        drawDuck(pos, 0)
        basic.pause(150)
        drawDuck(pos, 1)
        basic.pause(150)
    }
// pause at the end before looping
    strip.clear()
    strip.show()
    basic.pause(300)
})
