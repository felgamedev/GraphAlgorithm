var circles = []
const MIN_RADIUS = 50
const MAX_RADIUS = 150
var circleKey = 1
const NEIGHBORLY = 150

var circleGraph = createGraph()

const random = {
  // Return a boolean
  boolean: () => (Math.random() >= 0.5),
  // Return an integer
  integer: (max) => Math.floor(Math.random() * max) + 1,
  // Return an integer with Min and Max included
  integerMinMax: (min, max) => Math.floor(Math.random() * (max-min + 1) + min)
}

// Node factory
function createNode(key){
  const neighbors = []

  return {
    key,
    neighbors,
    addNeighbor(node){
      neighbors.push(node)
    }
  }
}

// Graph factory
function createGraph(directed = false){
  const nodes = []
  const edges = []

  return {
    directed,
    nodes,
    edges,
    addNode: (key) => {
      nodes.push(createNode(key))
    },
    getNode(key){
      return nodes.find(node => node.key === key)
    },
    addEdge(node1Key, node2Key){
      const node1 = this.getNode(node1Key)
      const node2 = this.getNode(node2Key)

      node1.addNeighbor(node2)
      edges.push(`${node1Key} => ${node2Key}`)
      if(!directed){
        node2.addNeighbor(node1)
      }
    },
    print: () => {
      return nodes.map(({key, neighbors}) => {
        let result = key
        if(neighbors.length){
          result += `=> ${neighbors.map(neighbor => neighbor.key).join(' ')}`
        }
        return result
      }).join('\n')
    },
    get length(){
      return nodes.length
    }
  }
}

function createCircle(xIn = null, yIn = null, radiusIn = null, colorIn = null){
  let radius = radiusIn ? radiusIn : random.integerMinMax(MIN_RADIUS, MAX_RADIUS)
  let x =  xIn ? xIn : random.integerMinMax(radius, width - radius)
  let y = yIn ? yIn : random.integerMinMax(radius, height - radius)
  let circleColor = colorIn ? colorIn : color(random.integer(255), random.integer(255), random.integer(255))
  let key = circleKey++

  return {
    radius,
    x, y, circleColor,
    key
  }
}

function createNewCircles(amount = 5){
  circles = []
  for(let i = 0; i < amount; i++){
    let circle = createCircle()
    circles.push(circle)
  }
}

function init(){
  createNewCircles()
  // Add Nodes to the graph
  for(let i = 0; i < circles.length; i++){
    circleGraph.addNode(circles[i].key)
  }

  // find nodes that are within a neighborly distance of each other and create those edges
  for(let i = 0; i < circles.length; i++){
    let circle = circles[i]

    for(let j = 0; j < circles.length; j++){
      if(j <= i) continue
      let circle2 = circles[j]

      if(Math.abs(circle.x - circle2.x) < NEIGHBORLY && Math.abs(circle.y - circle2.y) < NEIGHBORLY){
        circleGraph.addEdge(circle.key, circle2.key)
      }
    }
  }
  console.log(circleGraph.print());
}

function setup() {
  createCanvas(800, 600)
  init()

  textSize(24)
}

function draw() {
  background(0)
  for(let i = 0; i < circles.length; i++){
    let circle = circles[i]
    fill(circle.circleColor)
    ellipse(circle.x, circle.y, circle.radius)
    fill(0)

    text(circle.key, circle.x, circle.y)
  }
}

function mousePressed(){
  init()
}
