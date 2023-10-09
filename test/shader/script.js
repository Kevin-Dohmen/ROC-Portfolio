"use strict";

//initWebGL function
function initWebGL(canvas){
  //get a webGL context
  var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

  //if we have a context, we're good to go. if not, alert, and return the nothing that is our empty context
  if(!gl){
    alert("Your browser does not support WebGL");
  }
  return gl;
}

//shader creation function
function createShader(gl, type, source){
  //create and compile the shader
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  //if success, then return the shader. if not, log the shader info, and then delete the shader.
  if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
    return shader;
  }
  alert(gl.getShaderInfoLog(shader) + "");
  gl.deleteShader(shader);
}

//program creation function
function createProgram(gl, vertexShader, fragmentShader){
  //create the program and attach the shaders
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  //if success, return the program. if not, log the program info, and delete it.
  if(gl.getProgramParameter(program, gl.LINK_STATUS)){
    return program;
  }
  alert(gl.getProgramInfoLog(program) + "");
  gl.deleteProgram(program);
}

//main function
function start(){
    //get the canvas
    var canvas = document.getElementById("webgl_canvas");

    //initialize WebGL
    var gl = initWebGL(canvas);

    //keep going if we have a context
    if(!gl){
        return;
    }

    //set the clear color
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //set up depth testing
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    //clear the color and the depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clear(gl.DEPTH_BUFFER_BIT);

    //set up the viewport
    gl.viewport(0, 0, canvas.width, canvas.height);

    //set up shaders
    var vertexShaderSource = `
    attribute vec2 a_position;

    void main(){
        gl_Position = vec4(a_position, 0, 1);
    }
    `;
    var fragmentShaderSource = `
    precision mediump float;

    uniform vec2 iResolution; // Resolution uniform
    uniform float iTime; // Time uniform

    void main() {
        vec2 uv = gl_FragCoord.xy / iResolution.xy;
        float tim = iTime /iTime;
        vec3 col = vec3(sin(tim), cos(tim), 0.);
        gl_FragColor = vec4(col, 1);
    }
    `;
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    //set up the program
    var program = createProgram(gl, vertexShader, fragmentShader);

    //get the attributes
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    var resolutionUniformLocation = gl.getUniformLocation(program, "iResolution");
    var timeUniformLocation = gl.getUniformLocation(program, "iTime");

    //set up a position buffer
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1,  // Vertex 1 (bottom-left)
         1, -1,  // Vertex 2 (bottom-right)
        -1,  1,  // Vertex 3 (top-left)
         1,  1   // Vertex 4 (top-right)
    ]), gl.STATIC_DRAW);
    
    // Define the indices for two triangles to form a square
    var indices = new Uint16Array([
        0, 1, 2,  // Triangle 1
        1, 3, 2   // Triangle 2
    ]);
    
    // Create an index buffer and store the indices
    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    //tell webGL to use the program
    gl.useProgram(program);

    //enable the vertex attribute array
    gl.enableVertexAttribArray(positionAttributeLocation);
    
    gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
    
    var currentTime = Date.now() * 0.001; // Convert to seconds
    gl.uniform1f(timeUniformLocation, currentTime);
    console.log("Current Time:", currentTime);
    
    
    //tell webgl how to pull out the data
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // Tell WebGL to use the index buffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    
    // Render using the index buffer
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
}