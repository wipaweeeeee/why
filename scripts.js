var orbit;

function init() {
var stats = initStats();
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
var webGLRenderer = new THREE.WebGLRenderer();
webGLRenderer.setClearColor(new THREE.Color(0xffffff));
webGLRenderer.setSize(window.innerWidth, window.innerHeight);
webGLRenderer.shadowMap.enabled = true;

var shape = createMesh(new THREE.ShapeGeometry(drawShape()));
scene.add(shape);

var wire = createWire(new THREE.ShapeGeometry(drawShape()));
scene.add(wire);

// position and point the camera to the center of the scene
camera.position.x = -500;
camera.position.y = 0;
camera.position.z = 500;
// camera.lookAt(new THREE.Vector3(60, -60, 0));
var spotLight = new THREE.DirectionalLight(0xffffff);
spotLight.position = new THREE.Vector3(0, 300, 0);
spotLight.intensity = 1.0;
scene.add(spotLight);
// add the output of the renderer to the html element
document.getElementById("WebGL-output").appendChild(webGLRenderer.domElement);
orbit = new THREE.OrbitControls(camera, webGLRenderer.domElement);

// setup the control gui
var controls = new function () {

    this.curve = 1.5;
    this.radius = 90;
    this.x = false;
    this.y = false;
    this.z = true;

    var randomPoints = [];
    for ( var i = 0; i < this.curve; i = i + 0.1 ) {
        randomPoints.push( new THREE.Vector3( i, Math.sin(i) * this.radius, Math.cos(i) * this.radius ));
    }
    var randomSpline =  new THREE.CatmullRomCurve3( randomPoints );
    
    this.steps = 100;
    this.bevelEnabled = false;
    this.extrudePath = randomSpline;
    this.asGeom = function () {
        // remove the old plane
        scene.remove(shape);
        scene.remove(wire);
        randomPoints = [];

        for ( var i = -1; i < controls.curve; i = i + 0.1 ) {
            if ( controls.x ) {
                randomPoints.push( 
                    new THREE.Vector3( Math.cos(i) * controls.radius, Math.sin(i) * controls.radius, i )
                );
            } else if (controls.y) {
                randomPoints.push( 
                    new THREE.Vector3( Math.cos(i) * controls.radius, i, Math.sin(i) * controls.radius )
                );
            } else {
                randomPoints.push( 
                    new THREE.Vector3( i, Math.cos(i) * controls.radius, Math.sin(i) * controls.radius )
                );
            }
        }

        randomSpline =  new THREE.CatmullRomCurve3( randomPoints );
        // create a new one
        var options = {
            curve: controls.curve,
            steps: controls.steps,
            radius: controls.radius,
            extrudePath: randomSpline
        };


        shape = createMesh(new THREE.ExtrudeGeometry(drawShape(), options));
        wire = createWire(new THREE.ExtrudeGeometry(drawShape(), options));
        // add it to the scene.
        scene.add(shape);
        scene.add(wire);
    };
};
var gui = new dat.GUI();
gui.add(controls, 'curve', 0, 6).step(0.1).onChange(controls.asGeom);
gui.add(controls, 'radius', 0, 200).step(1).onChange(controls.asGeom);
gui.add(controls, 'steps', 1, 200).step(1).onChange(controls.asGeom);
gui.add(controls, 'x').onChange(controls.asGeom);
gui.add(controls, 'y').onChange(controls.asGeom);
gui.add(controls, 'z').onChange(controls.asGeom);
controls.asGeom();
render();
function drawShape() {
    var svgString = document.querySelector("#v").getAttribute("d");
    var shape = transformSVGPathExposed(svgString);
    return shape;
}
function createMesh(geom) {

    var meshMaterial = new THREE.MeshStandardMaterial({color: 0x333333});
    var mesh = new THREE.Mesh(geom, meshMaterial);
    mesh.rotation.z = Math.PI;
    mesh.rotation.y = Math.PI/360 * 220;
    return mesh;
}

function createWire(geom) {
    var wireframeMat = new THREE.MeshStandardMaterial({color: 0xffffff, wireframe: true, wireframeLinewidth: 2.0})
    var meshWireframe = new THREE.Mesh(geom, wireframeMat);
    meshWireframe.rotation.z = Math.PI;
    meshWireframe.rotation.y = Math.PI/360 * 220;
    return meshWireframe;
}
function render() {
    stats.update();
    // shape.rotation.y = step += 0.005;
    orbit.update();
    requestAnimationFrame(render);
    webGLRenderer.render(scene, camera);
}
function initStats() {
    var stats = new Stats();
    stats.setMode(0); // 0: fps, 1: ms
    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.getElementById("Stats-output").appendChild(stats.domElement);
    return stats;
}
}
window.onload = init;