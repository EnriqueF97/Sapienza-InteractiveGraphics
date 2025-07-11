// This function takes the translation and two rotation angles (in radians) as input arguments.
// The two rotations are applied around x and y axes.
// It returns the combined 4x4 transformation matrix as an array in column-major order.
// You can use the MatrixMult function defined in project5.html to multiply two 4x4 matrices in the same format.
function GetModelViewMatrix(translationX, translationY, translationZ, rotationX, rotationY) {
  // [TO-DO] Modify the code below to form the transformation matrix.
  var trans = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, translationX, translationY, translationZ, 1];

  //Rotation around the x axis
  var rotX = [1, 0, 0, 0, 0, Math.cos(rotationX), -Math.sin(rotationX), 0, 0, Math.sin(rotationX), Math.cos(rotationX), 0, 0, 0, 0, 1];

  //Rotation around the y axis
  var rotY = [Math.cos(rotationY), 0, Math.sin(rotationY), 0, 0, 1, 0, 0, 0 - Math.sin(rotationY), 0, Math.cos(rotationY), 0, 0, 0, 0, 1];

  var mv = MatrixMult(MatrixMult(trans, rotX), rotY); //Already returns column-major representation
  return mv;
}

// [TO-DO] Complete the implementation of the following class.

class MeshDrawer {
  // The constructor is a good place for taking care of the necessary initializations.
  constructor() {
    // [TO-DO] initializations
    var fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
    var fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShaderObject, fragmentShader);
    gl.compileShader(fragmentShaderObject);
    if (!gl.getShaderParameter(fragmentShaderObject, gl.COMPILE_STATUS)) {
      console.error("ERROR compiling fragment shader!", gl.getShaderInfoLog(fragmentShaderObject));
    }

    //Create program
    this.program = InitShaderProgram(vertexShader, fragmentShader);
    gl.useProgram(this.program);

    //Create uniform locations from the current shader
    this.SwapYZ = gl.getUniformLocation(this.program, "SwapYZ");
    this.mvp = gl.getUniformLocation(this.program, "mvp");
    this.mv = gl.getUniformLocation(this.program, "mv");
    this.mn = gl.getUniformLocation(this.program, "mn");
    this.position = gl.getAttribLocation(this.program, "position");
    this.shTexture = gl.getUniformLocation(this.program, "shTexture");
    this.texCoord = gl.getAttribLocation(this.program, "texCoord");
    this.tex = gl.getUniformLocation(this.program, "tex");
    this.textureLoaded = gl.getUniformLocation(this.program, "textureLoaded");
    this.normal = gl.getAttribLocation(this.program, "normal");
    this.lightDirection = gl.getUniformLocation(this.program, "lightDirection");
    this.shininess = gl.getUniformLocation(this.program, "shininess");

    //Initially swap and textureLoaded is false and shTexture is true
    gl.uniform1i(this.SwapYZ, 0);
    gl.uniform1i(this.shTexture, 1);
    gl.uniform1i(this.textureLoaded, 0);

    // Create and store Buffer objects so we can draw multiple triangles in one frame
    this.vertexBuffer = gl.createBuffer();
    this.texCoordsBuffer = gl.createBuffer();
    this.normalBuffer = gl.createBuffer();
  }

  setMesh(vertPos, texCoords, normals) {
    gl.useProgram(this.program);

    // [TO-DO] Update the contents of the vertex buffer objects.
    this.numVerticies = vertPos.length / 3;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertPos), gl.STATIC_DRAW);

    gl.vertexAttribPointer(this.position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.position);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

    gl.vertexAttribPointer(this.texCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.texCoord);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

    gl.vertexAttribPointer(this.normal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.normal);

    //--------------/NORMAL BUFFER HANDLING---------------
  }

  // This method is called when the user changes the state of the
  // "Swap Y-Z Axes" checkbox.
  // The argument is a boolean that indicates if the checkbox is checked.
  swapYZ(swap) {
    gl.useProgram(this.program);

    // [TO-DO] Set the uniform parameter(s) of the vertex shader
    if (swap) {
      gl.uniform1i(this.SwapYZ, 1);
    } else {
      gl.uniform1i(this.SwapYZ, 0);
    }
  }

  // This method is called to draw the triangular mesh.
  // The arguments are the model-view-projection transformation matrixMVP,
  // the model-view transformation matrixMV, the same matrix returned
  // by the GetModelViewProjection function above, and the normal
  // transformation matrix, which is the inverse-transpose of matrixMV.
  draw(matrixMVP, matrixMV, matrixNormal) {
    gl.useProgram(this.program);

    // [TO-DO] Complete the WebGL initializations before drawing

    // Ensure correct buffer binding before drawing. --> shouldnt be needed in theory
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(this.position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.position);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordsBuffer);
    gl.vertexAttribPointer(this.texCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.texCoord);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.vertexAttribPointer(this.normal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.normal);

    // Update the matrix uniforms needed in the shader.
    gl.uniformMatrix4fv(this.mvp, false, matrixMVP);
    gl.uniformMatrix4fv(this.mv, false, matrixMV);
    gl.uniformMatrix3fv(this.mn, false, matrixNormal);

    //Bind texture to unit 0
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    gl.drawArrays(gl.TRIANGLES, 0, this.numVerticies);
  }

  // This method is called to set the texture of the mesh.
  // The argument is an HTML IMG element containing the texture data.
  setTexture(img) {
    gl.useProgram(this.program);

    // [TO-DO] Bind the texture

    //Set texture loaded to true
    gl.uniform1i(this.textureLoaded, 1);
    this.texture = gl.createTexture();

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    //Set the texture image data
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

    //Set uniform sampler to use texture unit 0 (TEXTURE0)
    gl.uniform1i(this.tex, 0);
  }

  // This method is called when the user changes the state of the
  // "Show Texture" checkbox.
  // The argument is a boolean that indicates if the checkbox is checked.
  showTexture(show) {
    // [TO-DO] set the uniform parameter(s) of the fragment shader to specify if it should use the texture.
    gl.useProgram(this.program);

    // [TO-DO] Set the uniform parameter(s) of the vertex shader
    if (show) {
      gl.uniform1i(this.shTexture, 1);
    } else {
      gl.uniform1i(this.shTexture, 0);
    }
  }

  // This method is called to set the incoming light direction
  setLightDir(x, y, z) {
    gl.useProgram(this.program);
    gl.uniform3f(this.lightDirection, x, y, z);
  }

  // This method is called to set the shininess of the material
  setShininess(shininess) {
    gl.useProgram(this.program);
    gl.uniform1f(this.shininess, shininess);
  }
}

var fragmentShader = `
	precision mediump float;
	uniform bool shTexture;
	uniform sampler2D tex; //The actual texture
	uniform bool textureLoaded;
	uniform vec3 lightDirection;  // New uniform
	uniform float shininess; // New uniform

	varying vec2 vertexTexCoord;
	varying vec3 vertexNormal;
	varying vec3 vertexPos;

	void main() {

		//Set light intensity, diffuse and specular color coefficients
		vec3 I = vec3(1.0,1.0,1.0);
		vec3 Ks = vec3(1.0,1.0,1.0);
		vec3 Kd = vec3(1.0,1.0,1.0);
		if(shTexture && textureLoaded){
			Kd = texture2D(tex, vertexTexCoord).rgb;
		}else{
			Kd = vec3(1,gl_FragCoord.z*gl_FragCoord.z,0);
		}

		//Normalize the vectors we need to calculate the angles
		vec3 n = normalize(vertexNormal);
		vec3 omega = normalize(lightDirection);
		vec3 v = normalize(-vertexPos); //View direction towards the camera (thus -)
		vec3 h = normalize((omega + v)/length(omega + v)); //Get the half way vector h

		//Get the angles theta and phi
		float theta = acos(dot(omega,n));
		float phi = acos(dot(n, h));

		//Calculate the Binn reflection
		vec3 finalColor = I*(max(cos(theta),0.0)*Kd + Ks*pow(cos(phi),shininess));

		//Set the color
		gl_FragColor = vec4(finalColor, 1.0);	
}`;

var vertexShader = `
	uniform bool SwapYZ;
	uniform mat4 mvp; //Model view projection	
	uniform mat4 mv; //Model view
	uniform mat3 mn; //Matrix normal

	attribute vec3 position;
	attribute vec2 texCoord; //The texture coordinates that are passed to the fragment shader 
	attribute vec3 normal; 

	varying vec2 vertexTexCoord; //Used to communicate between shaders --> the coordinates are given to the fragment shader
	varying vec3 vertexNormal; //sends the transformed normal to the fragment shader
	varying vec3 vertexPos; //sends the transformed position to the fragment shader

	void main(){
		vec3 pos = position;
		//swap Y and Z axis in our visualization
		if(SwapYZ){
			pos = vec3(pos.x, pos.z, pos.y);
		}
		//Aplly rotation to the visualization of the teapot
		gl_Position = mvp * vec4(pos, 1.0);

		//Pass the texture coordinate to the fragment shader
		vertexTexCoord = texCoord;

		//Transform the normal to vies space and pass it to the fragment shader
		vertexNormal = normalize(mn * normal);

		//Transform the position to view space and pass it to the fragment shader
		vertexPos = (mv * vec4(pos, 1.0)).xyz;
	}
`;
