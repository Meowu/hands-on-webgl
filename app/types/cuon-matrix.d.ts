/**
 * This is a class treating 4x4 matrix.
 * This class contains the function that is equivalent to OpenGL matrix stack.
 * The matrix after conversion is calculated by multiplying a conversion matrix from the right.
 * The matrix is replaced by the calculated result.
 */
/**
 * Constructor of Matrix4
 * If opt_src is specified, new matrix is initialized by opt_src.
 * Otherwise, new matrix is initialized by identity matrix.
 * @param opt_src source matrix(option)
 */
declare function Matrix4(opt_src?: Matrix4): void;
declare class Matrix4 {
    /**
     * This is a class treating 4x4 matrix.
     * This class contains the function that is equivalent to OpenGL matrix stack.
     * The matrix after conversion is calculated by multiplying a conversion matrix from the right.
     * The matrix is replaced by the calculated result.
     */
    /**
     * Constructor of Matrix4
     * If opt_src is specified, new matrix is initialized by opt_src.
     * Otherwise, new matrix is initialized by identity matrix.
     * @param opt_src source matrix(option)
     */
    constructor(opt_src?: Matrix4);
    elements: Float32Array;
    /**
     * Set the identity matrix.
     * @return this
     */
    setIdentity(): Matrix4;
    /**
     * Copy matrix.
     * @param src source matrix
     * @return this
     */
    set(src: any): Matrix4;
    /**
     * Multiply the matrix from the right.
     * @param other The multiply matrix
     * @return this
     */
    concat(other: any): Matrix4;
    multiply: any;
    /**
     * Multiply the three-dimensional vector.
     * @param pos  The multiply vector
     * @return The result of multiplication(Float32Array)
     */
    multiplyVector3(pos: any): Vector3;
    /**
     * Multiply the four-dimensional vector.
     * @param pos  The multiply vector
     * @return The result of multiplication(Float32Array)
     */
    multiplyVector4(pos: any): Vector4;
    /**
     * Transpose the matrix.
     * @return this
     */
    transpose(): Matrix4;
    /**
     * Calculate the inverse matrix of specified matrix, and set to this.
     * @param other The source matrix
     * @return this
     */
    setInverseOf(other: any): Matrix4;
    /**
     * Calculate the inverse matrix of this, and set to this.
     * @return this
     */
    invert(): Matrix4;
    /**
     * Set the orthographic projection matrix.
     * @param left The coordinate of the left of clipping plane.
     * @param right The coordinate of the right of clipping plane.
     * @param bottom The coordinate of the bottom of clipping plane.
     * @param top The coordinate of the top top clipping plane.
     * @param near The distances to the nearer depth clipping plane. This value is minus if the plane is to be behind the viewer.
     * @param far The distances to the farther depth clipping plane. This value is minus if the plane is to be behind the viewer.
     * @return this
     */
    setOrtho(left: any, right: any, bottom: any, top: any, near: any, far: any): Matrix4;
    /**
     * Multiply the orthographic projection matrix from the right.
     * @param left The coordinate of the left of clipping plane.
     * @param right The coordinate of the right of clipping plane.
     * @param bottom The coordinate of the bottom of clipping plane.
     * @param top The coordinate of the top top clipping plane.
     * @param near The distances to the nearer depth clipping plane. This value is minus if the plane is to be behind the viewer.
     * @param far The distances to the farther depth clipping plane. This value is minus if the plane is to be behind the viewer.
     * @return this
     */
    ortho(left: any, right: any, bottom: any, top: any, near: any, far: any): Matrix4;
    /**
     * Set the perspective projection matrix.
     * @param left The coordinate of the left of clipping plane.
     * @param right The coordinate of the right of clipping plane.
     * @param bottom The coordinate of the bottom of clipping plane.
     * @param top The coordinate of the top top clipping plane.
     * @param near The distances to the nearer depth clipping plane. This value must be plus value.
     * @param far The distances to the farther depth clipping plane. This value must be plus value.
     * @return this
     */
    setFrustum(left: any, right: any, bottom: any, top: any, near: any, far: any): Matrix4;
    /**
     * Multiply the perspective projection matrix from the right.
     * @param left The coordinate of the left of clipping plane.
     * @param right The coordinate of the right of clipping plane.
     * @param bottom The coordinate of the bottom of clipping plane.
     * @param top The coordinate of the top top clipping plane.
     * @param near The distances to the nearer depth clipping plane. This value must be plus value.
     * @param far The distances to the farther depth clipping plane. This value must be plus value.
     * @return this
     */
    frustum(left: any, right: any, bottom: any, top: any, near: any, far: any): Matrix4;
    /**
     * Set the perspective projection matrix by fovy and aspect.
     * @param fovy The angle between the upper and lower sides of the frustum.
     * @param aspect The aspect ratio of the frustum. (width/height)
     * @param near The distances to the nearer depth clipping plane. This value must be plus value.
     * @param far The distances to the farther depth clipping plane. This value must be plus value.
     * @return this
     */
    setPerspective(fovy: any, aspect: any, near: any, far: any): Matrix4;
    /**
     * Multiply the perspective projection matrix from the right.
     * @param fovy The angle between the upper and lower sides of the frustum.
     * @param aspect The aspect ratio of the frustum. (width/height)
     * @param near The distances to the nearer depth clipping plane. This value must be plus value.
     * @param far The distances to the farther depth clipping plane. This value must be plus value.
     * @return this
     */
    perspective(fovy: any, aspect: any, near: any, far: any): Matrix4;
    /**
     * Set the matrix for scaling.
     * @param x The scale factor along the X axis
     * @param y The scale factor along the Y axis
     * @param z The scale factor along the Z axis
     * @return this
     */
    setScale(x: any, y: any, z: any): Matrix4;
    /**
     * Multiply the matrix for scaling from the right.
     * @param x The scale factor along the X axis
     * @param y The scale factor along the Y axis
     * @param z The scale factor along the Z axis
     * @return this
     */
    scale(x: any, y: any, z: any): Matrix4;
    /**
     * Set the matrix for translation.
     * @param x The X value of a translation.
     * @param y The Y value of a translation.
     * @param z The Z value of a translation.
     * @return this
     */
    setTranslate(x: any, y: any, z: any): Matrix4;
    /**
     * Multiply the matrix for translation from the right.
     * @param x The X value of a translation.
     * @param y The Y value of a translation.
     * @param z The Z value of a translation.
     * @return this
     */
    translate(x: any, y: any, z: any): Matrix4;
    /**
     * Set the matrix for rotation.
     * The vector of rotation axis may not be normalized.
     * @param angle The angle of rotation (degrees)
     * @param x The X coordinate of vector of rotation axis.
     * @param y The Y coordinate of vector of rotation axis.
     * @param z The Z coordinate of vector of rotation axis.
     * @return this
     */
    setRotate(angle: any, x: any, y: any, z: any): Matrix4;
    /**
     * Multiply the matrix for rotation from the right.
     * The vector of rotation axis may not be normalized.
     * @param angle The angle of rotation (degrees)
     * @param x The X coordinate of vector of rotation axis.
     * @param y The Y coordinate of vector of rotation axis.
     * @param z The Z coordinate of vector of rotation axis.
     * @return this
     */
    rotate(angle: any, x: any, y: any, z: any): Matrix4;
    /**
     * Set the viewing matrix.
     * @param eyeX, eyeY, eyeZ The position of the eye point.
     * @param centerX, centerY, centerZ The position of the reference point.
     * @param upX, upY, upZ The direction of the up vector.
     * @return this
     */
    setLookAt(eyeX: any, eyeY: any, eyeZ: any, centerX: any, centerY: any, centerZ: any, upX: any, upY: any, upZ: any): Matrix4;
    /**
     * Multiply the viewing matrix from the right.
     * @param eyeX, eyeY, eyeZ The position of the eye point.
     * @param centerX, centerY, centerZ The position of the reference point.
     * @param upX, upY, upZ The direction of the up vector.
     * @return this
     */
    lookAt(eyeX: any, eyeY: any, eyeZ: any, centerX: any, centerY: any, centerZ: any, upX: any, upY: any, upZ: any): Matrix4;
    /**
     * Multiply the matrix for project vertex to plane from the right.
     * @param plane The array[A, B, C, D] of the equation of plane "Ax + By + Cz + D = 0".
     * @param light The array which stored coordinates of the light. if light[3]=0, treated as parallel light.
     * @return this
     */
    dropShadow(plane: any, light: any): Matrix4;
    /**
     * Multiply the matrix for project vertex to plane from the right.(Projected by parallel light.)
     * @param normX, normY, normZ The normal vector of the plane.(Not necessary to be normalized.)
     * @param planeX, planeY, planeZ The coordinate of arbitrary points on a plane.
     * @param lightX, lightY, lightZ The vector of the direction of light.(Not necessary to be normalized.)
     * @return this
     */
    dropShadowDirectionally(normX: any, normY: any, normZ: any, planeX: any, planeY: any, planeZ: any, lightX: any, lightY: any, lightZ: any): Matrix4;
}
/**
 * Constructor of Vector3
 * If opt_src is specified, new vector is initialized by opt_src.
 * @param opt_src source vector(option)
 */
declare function Vector3(opt_src: any): void;
declare class Vector3 {
    /**
     * Constructor of Vector3
     * If opt_src is specified, new vector is initialized by opt_src.
     * @param opt_src source vector(option)
     */
    constructor(opt_src: any);
    elements: Float32Array;
    /**
      * Normalize.
      * @return this
      */
    normalize(): Vector3;
}
/**
 * Constructor of Vector4
 * If opt_src is specified, new vector is initialized by opt_src.
 * @param opt_src source vector(option)
 */
declare function Vector4(opt_src: any): void;
declare class Vector4 {
    /**
     * Constructor of Vector4
     * If opt_src is specified, new vector is initialized by opt_src.
     * @param opt_src source vector(option)
     */
    constructor(opt_src: any);
    elements: Float32Array;
}
