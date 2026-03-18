// As if looking at rainbow-coloured droplets falling in a pond, from above.
// Vibe coded with Claude in March 2026

/**
 * Each ripple has a centre, current radius, intensity and colour
 */
/**
 * Drop a raindrop every 800ms
 */
function hsvToRgb (h: number, v: number) {
    region = Math.idiv(h, 43)
    remainder = (h - region * 43) * 6
    q = Math.idiv(v * (255 - remainder), 255)
    tv = Math.idiv(v * remainder, 255)
    if (region == 0) {
        return neopixel.rgb(v, tv, 0)
    }
    if (region == 1) {
        return neopixel.rgb(q, v, 0)
    }
    if (region == 2) {
        return neopixel.rgb(0, v, tv)
    }
    if (region == 3) {
        return neopixel.rgb(0, q, v)
    }
    if (region == 4) {
        return neopixel.rgb(tv, 0, v)
    }
    return neopixel.rgb(v, 0, q)
}
function addRipple () {
    // Find an inactive ripple slot
    for (let j = 0; j <= maxRipples - 1; j++) {
        if (rippleRadius[j] >= 99) {
            rippleX[j] = Math.randomRange(1, 6)
            rippleY[j] = Math.randomRange(1, 6)
            rippleRadius[j] = 0
            rippleIntensity[j] = 255
            rippleHue[j] = Math.randomRange(0, 255)
            return
        }
    }
}
let idx = 0
let brightness = 0
let diff = 0
let dist = 0
let dy = 0
let dx = 0
let lastDrop = 0
let now = 0
let tv = 0
let q = 0
let remainder = 0
let region = 0
let rippleHue: number[] = []
let rippleIntensity: number[] = []
let rippleY: number[] = []
let rippleX: number[] = []
let maxRipples = 0
let rippleRadius: number[] = []
let strip = neopixel.create(DigitalPin.P0, 64, NeoPixelMode.RGB)
strip.setBrightness(3)
maxRipples = 6
// Initialise empty ripples
for (let i = 0; i <= maxRipples - 1; i++) {
    rippleX[i] = 0
    rippleY[i] = 0
    // 99 = inactive
    // 99 = inactive
    rippleRadius[i] = 99
    rippleIntensity[i] = 0
    rippleHue[i] = 0
}
// Build a brightness buffer for each pixel
// so multiple ripples can overlap
basic.forever(function () {
    let bufferHue: number[] = []
    let buffer: number[] = []
    now = input.runningTime()
    if (now - lastDrop > 800) {
        addRipple()
        lastDrop = now
    }
    for (let k = 0; k <= 63; k++) {
        buffer[k] = 0
        bufferHue[k] = 0
    }
    // Update and draw each ripple into the buffer
    for (let l = 0; l <= maxRipples - 1; l++) {
        if (rippleRadius[l] >= 99) {
            continue;
        }
        rippleRadius[l] += 0.25
rippleIntensity[l] = Math.max(0, rippleIntensity[l] - 8)
        // Deactivate if faded out
        if (rippleIntensity[l] <= 0) {
            rippleRadius[l] = 99
            continue;
        }
        // Draw ring onto buffer
        for (let x = 0; x <= 7; x++) {
            for (let y = 0; y <= 7; y++) {
                dx = x - rippleX[l]
                dy = y - rippleY[l]
                dist = Math.sqrt(dx * dx + dy * dy)
                diff = Math.abs(dist - rippleRadius[l])
                if (diff < 1.2) {
                    // Brightness falls off at ring edges
                    brightness = Math.round(rippleIntensity[l] * (1 - diff / 1.2))
                    idx = y * 8 + x
                    // Accumulate brightness from overlapping ripples
                    if (brightness > buffer[idx]) {
                        buffer[idx] = brightness
                        bufferHue[idx] = rippleHue[l]
                    }
                }
            }
        }
    }
    // Render buffer to matrix
    strip.clear()
    for (let m = 0; m <= 63; m++) {
        if (buffer[m] > 0) {
            strip.setPixelColor(m, hsvToRgb(bufferHue[m], buffer[m]))
        }
    }
    strip.show()
    basic.pause(40)
})
