// Gently descending rainbow twinkles
// Vibe coded with Claude in March 2026

let strip = neopixel.create(DigitalPin.P0, 64, NeoPixelMode.RGB)
strip.setBrightness(3)

// Each star has an x, y, brightness and speed
let starX: number[] = []
let starY: number[] = []
let starBrightness: number[] = []
let starSpeed: number[] = []
let starHue: number[] = []
let numStars = 20

function hsvToRgb(h: number, v: number): number {
    let region = Math.idiv(h, 43)
    let remainder = (h - region * 43) * 6
    let p = 0
    let q = Math.idiv(v * (255 - remainder), 255)
    let t = Math.idiv(v * remainder, 255)
    if (region == 0) return neopixel.rgb(v, t, p)
    if (region == 1) return neopixel.rgb(q, v, p)
    if (region == 2) return neopixel.rgb(p, v, t)
    if (region == 3) return neopixel.rgb(p, q, v)
    if (region == 4) return neopixel.rgb(t, p, v)
    return neopixel.rgb(v, p, q)
}

function resetStar(i: number) {
    starX[i] = Math.randomRange(0, 7)
    starY[i] = Math.randomRange(-8, 0)  // start above the grid
    starBrightness[i] = Math.randomRange(150, 255)
    starSpeed[i] = Math.randomRange(1, 4)
    starHue[i] = Math.randomRange(0, 255)
}

// Initialise all stars at random positions
for (let i = 0; i < numStars; i++) {
    starX[i] = Math.randomRange(0, 7)
    starY[i] = Math.randomRange(0, 7)
    starBrightness[i] = Math.randomRange(150, 255)
    starSpeed[i] = Math.randomRange(1, 4)
    starHue[i] = Math.randomRange(0, 255)
}

basic.forever(function () {
    strip.clear()

    for (let i = 0; i < numStars; i++) {
        // Move star down
        starY[i] += starSpeed[i] * 0.2

        // Twinkle by varying brightness
        starBrightness[i] += Math.randomRange(-20, 20)
        starBrightness[i] = Math.constrain(starBrightness[i], 80, 255)

        // Reset if fallen off the bottom
        if (starY[i] > 7) {
            resetStar(i)
        }

        // Draw star
        let sx = Math.round(starX[i])
        let sy = Math.round(starY[i])
        if (sx >= 0 && sx < 8 && sy >= 0 && sy < 8) {
            strip.setPixelColor(
                sy * 8 + sx,
                hsvToRgb(starHue[i], starBrightness[i])
            )
        }
    }

    strip.show()
    basic.pause(50)
})
