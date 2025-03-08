# Interactive Math & JavaScript Lesson: Graphing Functions and Finding Intersections

This lesson will guide students through creating an interactive graphing calculator that visually demonstrates mathematical concepts while introducing fundamental JavaScript programming concepts.

## Learning Objectives

By the end of this lesson, students will be able to:
1. Understand how to represent mathematical functions in JavaScript
2. Create a basic coordinate system on an HTML canvas
3. Plot functions using JavaScript
4. Implement an algorithm to find intersections between functions
5. Connect mathematical concepts with programming applications

## Prerequisites

- Basic understanding of HTML
- Familiarity with mathematical functions and coordinate systems
- Introduction to JavaScript variables and functions

## Lesson Structure

### Part 1: Setting Up the Canvas (20 minutes)
- Understanding the HTML canvas element
- Initializing the canvas and getting the context
- Setting dimensions and preparing for drawing

### Part 2: Creating a Coordinate System (30 minutes)
- Translating mathematical coordinates to canvas coordinates
- Drawing axes and grid marks
- Adding labels and tick marks

### Part 3: Plotting Mathematical Functions (40 minutes)
- Defining mathematical functions in JavaScript
- Converting functions to visual representations
- Using loops to plot points and create continuous curves

### Part 4: Finding Intersections (40 minutes)
- Understanding the mathematical approach to finding intersections
- Implementing an algorithm to detect when functions cross
- Refining intersection points for accuracy

### Part 5: Interactive Extensions (Optional 30 minutes)
- Adding zoom functionality
- Enabling function input from users
- Enhancing the visual display

## Detailed Lesson Guide

### Part 1: Setting Up the Canvas

Start by explaining how the HTML canvas works as a drawing surface:

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Function Grapher</title>
</head>
<body>
    <canvas id="canvas"></canvas>
</body>
<script>
    // JavaScript will go here
</script>
</html>
```

Explain the initial canvas setup in JavaScript:

```javascript
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

canvas.width = 800
canvas.height = 800

// We'll set a scale factor to determine how large each grid square is
const gridSize = 50
```

**Discussion points:**
- What is a canvas element and why is it useful for mathematical visualization?
- How does the coordinate system of a canvas differ from mathematical coordinates?
- What does the context (ctx) allow us to do?

### Part 2: Creating a Coordinate System

Explain how to translate between mathematical coordinates and canvas coordinates:

```javascript
// Define where the origin (0,0) point will be located on the canvas
let originX = canvas.width / 2
let originY = canvas.height / 2

// These functions convert from math coordinates to canvas coordinates
const toCanvasX = (x) => originX + (x * gridSize)
const toCanvasY = (y) => originY - (y * gridSize)
```

Then show how to draw the coordinate system:

```javascript
const drawCoordinateSystem = () => {
    // Clear the canvas first
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw X and Y axes
    ctx.lineWidth = 1
    ctx.strokeStyle = '#000000'
    
    // X axis
    ctx.beginPath()
    ctx.moveTo(0, originY)
    ctx.lineTo(canvas.width, originY)
    ctx.stroke()
    
    // Y axis
    ctx.beginPath()
    ctx.moveTo(originX, 0)
    ctx.lineTo(originX, canvas.height)
    ctx.stroke()
    
    // Add tick marks and labels as needed
    // ...
}
```

**Discussion points:**
- Why do we need to convert between coordinate systems?
- How does the y-axis differ between canvas and math coordinates?
- What happens if we change the gridSize variable?

### Part 3: Plotting Mathematical Functions

Explain how to define mathematical functions in JavaScript:

```javascript
// Example functions: a parabola and another curve
const f1 = (x) => Math.pow(x, 2) - 4       // y = x² - 4
const f2 = (x) => -Math.pow(x, 2) - 2*x + 2  // y = -x² - 2x + 2
```

Then show how to plot these functions:

```javascript
const plotFunction = (fn, color = '#FF0000', stepSize = 0.1) => {
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    
    // Calculate the range of x values based on canvas size
    const startX = -(originX / gridSize)
    const endX = (canvas.width - originX) / gridSize
    
    let firstPoint = true
    
    // Plot the function point by point
    for(let x = startX; x <= endX; x += stepSize) {
        const y = fn(x)
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
```

**Discussion points:**
- How does the step size affect the smoothness of the graph?
- What mathematical functions would be interesting to visualize?
- How could we handle vertical asymptotes or discontinuities?

### Part 4: Finding Intersections

Explain the algorithm for finding intersections:

```javascript
const findIntersections = (f1, f2, start = -10, end = 10, step = 0.01) => {
    const intersections = []
    
    // Scan the x-axis looking for points where the functions cross
    for(let x = start; x <= end; x += step) {
        const y1 = f1(x)
        const y2 = f2(x)
        const nextX = x + step
        const nextY1 = f1(nextX)
        const nextY2 = f2(nextX)
        
        // If the difference changes sign, we have an intersection
        if ((y1 - y2) * (nextY1 - nextY2) <= 0) {
            // Use binary search to refine the intersection point
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
```

**Discussion points:**
- Why do we look for a sign change in the difference between functions?
- What is binary search and why is it useful for refining the intersection point?
- How does the step size affect the accuracy of finding intersections?

### Part 5: Integration and Extensions

Finally, show how to integrate all parts and add visual elements:

```javascript
const drawAll = () => {
    drawCoordinateSystem()
    
    // Plot the functions
    plotFunction(f1, '#FF0000')  // Red for first function
    plotFunction(f2, '#0000FF')  // Blue for second function
    
    // Find and display intersections
    const intersections = findIntersections(f1, f2)
    drawIntersectionPoints(intersections)
}

// Define function to visualize intersection points
const drawIntersectionPoints = (intersections) => {
    ctx.fillStyle = '#008000'  // Green for intersection points
    
    intersections.forEach(point => {
        const canvasX = toCanvasX(point.x)
        const canvasY = toCanvasY(point.y)
        
        // Draw point
        ctx.beginPath()
        ctx.arc(canvasX, canvasY, 5, 0, Math.PI * 2)
        ctx.fill()
        
        // Label coordinates
        ctx.fillStyle = '#000000'
        ctx.fillText(`(${point.x}, ${point.y})`, canvasX + 10, canvasY - 5)
    })
}

// Call the main drawing function
drawAll()
```

**Extension ideas:**
- Add sliders to modify function parameters
- Implement zoom and pan functionality
- Allow users to input their own functions
- Add the ability to find roots, maxima, and minima

## Classroom Activities

1. **Function Exploration**: Have students modify the functions and observe how the graphs and intersections change.

2. **Algorithm Analysis**: Discuss the efficiency of the intersection-finding algorithm and how it could be improved.

3. **Creative Challenge**: Ask students to create visually interesting patterns by combining multiple functions.

4. **Math Connection**: Have students solve for intersections algebraically, then verify their answers using the program.

5. **Real-world Application**: Discuss how finding intersections relates to real-world problems like finding break-even points in economics.

## Assessment Ideas

1. Have students implement a new feature, such as finding the area between curves
2. Ask students to modify the code to handle a different type of function (e.g., trigonometric)
3. Challenge students to optimize the code for better performance
4. Have students create an educational mini-presentation explaining one aspect of the code

## Resources

- [MDN Canvas API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Mathematical Functions in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math)
- [Binary Search Algorithm](https://en.wikipedia.org/wiki/Binary_search_algorithm)