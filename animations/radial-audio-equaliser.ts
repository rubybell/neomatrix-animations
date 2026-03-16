// Rainbow-coloured audio visualiser
// Vibe coded with Claude in March 2026

let strip = neopixel.create(DigitalPin.P0, 64, NeoPixelMode.RGB)
strip.setBrightness(30)

let currentRadius = 0
let hueOffset = 0

function setPixel(x: number, y: number, colour: number) {
    if (x >= 0 && x < 8 && y >= 0 && y < 8) {
        strip.setPixelColor(y * 8 + x, colour)
    }
}

function hsvToRgb(h: number): number {
    // h is 0-255, converts to a rainbow colour
    let region = Math.idiv(h, 43)
    let remainder = (h - region * 43) * 6
    let p = 0
    let q = Math.idiv(255 * (255 - remainder), 255)
    let t = Math.idiv(255 * remainder, 255)

    if (region == 0) return neopixel.rgb(255, t, p)
    if (region == 1) return neopixel.rgb(q, 255, p)
    if (region == 2) return neopixel.rgb(p, 255, t)
    if (region == 3) return neopixel.rgb(p, q, 255)
    if (region == 4) return neopixel.rgb(t, p, 255)
    return neopixel.rgb(255, p, q)
}

basic.forever(function () {
    let volume = input.soundLevel()

    // Map volume to a radius (0-6)
    let targetRadius = Math.map(volume, 0, 255, 0, 6) // If you want to adjust the volume sensitivity, change '255' to a lower value
    targetRadius = Math.constrain(targetRadius, 0, 6)

    // Instant attack, slow decay
    if (targetRadius > currentRadius) {
        currentRadius = targetRadius
    } else {
        currentRadius = Math.max(0, currentRadius - 1.0)
    }

    // Slowly rotate the rainbow hue over time
    hueOffset = (hueOffset + 2) % 256

    strip.clear()

    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            let dx = x - 3.5
            let dy = y - 3.5
            let dist = Math.sqrt(dx * dx + dy * dy)

            if (dist <= currentRadius) {
                // Hue based on distance from centre + rotating offset
                let hue = Math.round(
                    Math.map(dist, 0, 6, 0, 200) + hueOffset
                ) % 256
                setPixel(x, y, hsvToRgb(hue))
            }
        }
    }

    strip.show()
    basic.pause(40)
})

