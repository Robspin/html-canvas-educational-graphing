const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const formulaForm = document.getElementById('formula-form')
const functionList = document.getElementById('function-list')

let functions = []

canvas.width = 800
canvas.height = 800

const gridSize = 50
const showAxisTickNumbers = false

let originX = canvas.width / 2
let originY = canvas.height / 2

const toCanvasX = (x) => originX + (x * gridSize)
const toCanvasY = (y) => originY - (y * gridSize)

// Function to safely evaluate user input
const createSafeFunction = (formula) => {
    try {
        let processedFormula = formula.replace('y=', '')
        
        processedFormula = processedFormula.replace(/(\d)x/g, '$1*x')
        processedFormula = processedFormula.replace(/-x\^2/g, '-1*x^2')
        processedFormula = processedFormula.replace(/-x(?!\^)/g, '-1*x')
        
        const cleanFormula = processedFormula.replace(/[^x\s0-9+\-*/().,^]/g, '')
        const jsFormula = cleanFormula.replace(/\^/g, '**')

        console.log('Processed formula:', jsFormula)
        
        const fn = new Function('x', `return ${jsFormula}`)
        
        fn(0)
        return fn
    } catch (error) {
        throw new Error('Invalid formula. Please check your syntax.')
    }
}

const addFunction = (formula, color) => {
    try {
        const fn = createSafeFunction(formula)
        const id = Date.now()
        functions.push({ id, fn, formula, color })
        
        const item = document.createElement('div')
        item.className = 'function-item'
        item.innerHTML = `
            <span style="color: ${color}">${formula}</span>
            <button class="remove-btn" data-id="${id}">Remove</button>
        `
        functionList.appendChild(item)

        drawAll()
    } catch (error) {
        alert(error.message)
    }
}

const removeFunction = (id) => {
    functions = functions.filter(f => f.id !== id)
    drawAll()
}

formulaForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const formula = document.getElementById('formula').value
    const color = document.getElementById('color').value
    addFunction(formula, color)
    document.getElementById('formula').value = ''
})

functionList.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-btn')) {
        const id = parseInt(e.target.dataset.id)
        removeFunction(id)
        e.target.parentElement.remove()
    }
})

const findIntersections = (f1, f2, start = -10, end = 10, step = 0.01) => {
    const intersections = []

    for(let x = start; x <= end; x += step) {
        const y1 = f1(x)
        const y2 = f2(x)
        const nextX = x + step
        const nextY1 = f1(nextX)
        const nextY2 = f2(nextX)

        if ((y1 - y2) * (nextY1 - nextY2) <= 0) {
            let left = x
            let right = nextX
            for(let i = 0; i < 10; i++) {
                const mid = (left + right) / 2
                const midY1 = f1(mid)
                const midY2 = f2(mid)
                if ((f1(left) - f2(left)) * (midY1 - midY2) <= 0) {
                    right = mid
                } else {
                    left = mid
                }
            }

            const intersectX = (left + right) / 2
            const intersectY = f1(intersectX)

            intersections.push({
                x: Math.round(intersectX * 100) / 100,
                y: Math.round(intersectY * 100) / 100
            })
        }
    }

    return intersections
}

const drawIntersectionPoints = () => {
    // Find intersections between all pairs of functions
    for (let i = 0; i < functions.length; i++) {
        for (let j = i + 1; j < functions.length; j++) {
            const intersections = findIntersections(functions[i].fn, functions[j].fn)

            ctx.fillStyle = '#008000'
            intersections.forEach(point => {
                const canvasX = toCanvasX(point.x)
                const canvasY = toCanvasY(point.y)

                ctx.beginPath()
                ctx.arc(canvasX, canvasY, 5, 0, Math.PI * 2)
                ctx.fill()

                ctx.font = '14px Arial'
                ctx.fillStyle = '#000000'
                ctx.textAlign = 'left'
                ctx.textBaseline = 'bottom'
                ctx.fillText(`(${point.x}, ${point.y})`, canvasX + 10, canvasY - 5)
            })
        }
    }
}

const drawCoordinateSystem = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.lineWidth = 1
    ctx.strokeStyle = '#000000'

    // Draw axes
    ctx.beginPath()
    ctx.moveTo(0, originY)
    ctx.lineTo(canvas.width, originY)
    ctx.moveTo(originX, 0)
    ctx.lineTo(originX, canvas.height)
    ctx.stroke()

    // Draw origin
    ctx.font = '14px Arial'
    ctx.textAlign = 'right'
    ctx.textBaseline = 'top'
    ctx.fillText('0', originX - 5, originY + 5)

    // Draw grid
    for(let i = gridSize; i < canvas.width / 2; i += gridSize) {
        if (showAxisTickNumbers) {
            ctx.fillText(i/gridSize, originX + i - 5, originY + 5)
            ctx.fillText(-i/gridSize, originX - i - 5, originY + 5)
        }

        // X axis ticks
        ctx.beginPath()
        ctx.moveTo(originX + i, originY - 5)
        ctx.lineTo(originX + i, originY + 5)
        ctx.moveTo(originX - i, originY - 5)
        ctx.lineTo(originX - i, originY + 5)
        ctx.stroke()
    }

    for(let i = gridSize; i < canvas.height / 2; i += gridSize) {
        if (showAxisTickNumbers) {
            ctx.fillText(-i/gridSize, originX - 5, originY + i + 5)
            ctx.fillText(i/gridSize, originX - 5, originY - i + 5)
        }

        // Y axis ticks
        ctx.beginPath()
        ctx.moveTo(originX - 5, originY + i)
        ctx.lineTo(originX + 5, originY + i)
        ctx.moveTo(originX - 5, originY - i)
        ctx.lineTo(originX + 5, originY - i)
        ctx.stroke()
    }
}

const plotFunction = (fn, color = '#FF0000', stepSize = 0.1) => {
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 2

    const startX = -(originX / gridSize)
    const endX = (canvas.width - originX) / gridSize
    let firstPoint = true

    for(let x = startX; x <= endX; x += stepSize) {
        const y = fn(x)
        if (!isFinite(y)) continue

        const canvasX = toCanvasX(x)
        const canvasY = toCanvasY(y)

        if (firstPoint) {
            ctx.moveTo(canvasX, canvasY)
            firstPoint = false
        } else {
            ctx.lineTo(canvasX, canvasY)
        }
    }

    ctx.stroke()
}

const drawAll = () => {
    drawCoordinateSystem()
    functions.forEach(f => plotFunction(f.fn, f.color))
    drawIntersectionPoints()
}

drawAll()