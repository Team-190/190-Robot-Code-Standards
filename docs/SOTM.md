# Shooting While Moving

## Introduction
In many competitive robotics games, especially those involving  game pieces launched as projectiles, it is advantageous to score while the robot is still in motion. Shooting while moving allows a robot to maintain speed, avoid defenders, and reduce the time spent stationary in vulnerable positions.

Successfully shooting while moving requires predicting how the robot’s motion will affect the trajectory of the game piece and compensating for that motion in the aiming system. This document introduces the fundamental geometric ideas behind that compensation for two common robot configurations:
- Robots with a fixed shooter (no turret)
- Robots with a rotating turret

This document assumes the robot uses a **swerve drive**, which allows independent control of translation (movement) and rotation (heading).

---

## Key Terms
To reason about shooting while moving, we need a precise way to describe where things are on the field and how they are oriented. This document uses standard geometric representations commonly found in robotics, physics, and control systems.

---

### Translation
A **translation** describes linear movement through space, how an object’s position changes without considering its orientation.

#### 2D Translation
In a 2D plane (such as the field surface), a translation is represented as a vector:

$$
\text{t} =
\left[
\begin{matrix}
x \\
y
\end{matrix}
\right]
$$

- **x** represents movement along the field’s horizontal axis  
- **y** represents movement along the field’s vertical axis  

This is typically used to describe a robot’s position or velocity on the field.

#### 3D Translation
In 3D space, an additional axis is included:

$$
\text{t} =
\left[
\begin{matrix}
x \\
y \\
z
\end{matrix}
\right]
$$

- **z** represents height, which is useful when modeling projectile motion or shooter exit points.

#### Example
$$
\text{t} =
\begin{bmatrix}
3 \\
4 \\
5
\end{bmatrix}
$$

This translation represents:
- 3 units of movement in the x direction  
- 4 units of movement in the y direction  
- 5 units of movement in the z direction  
---

### Rotation
A **rotation** describes how an object’s orientation changes in space. While translation answers *“Where is it?”*, rotation answers *“Which way is it pointing?”*

#### 2D Rotation
In 2D, rotation is represented by a single angle:

$$
\text{r} = \theta
$$

- $\theta$ is typically measured in radians  
- A positive value usually represents counterclockwise rotation  

For a robot, this often corresponds to the robot’s heading on the field.

#### 3D Rotation
In 3D space, rotation can be described using three angles:

$$
\text{r} =
\begin{bmatrix}
\alpha \\
\beta \\
\gamma
\end{bmatrix}
$$

These angles represent rotations about three perpendicular axes:
- $\alpha$: rotation about the x-axis (roll)  
- $\beta$: rotation about the y-axis (pitch)  
- $\gamma$: rotation about the z-axis (yaw)

> Note: This representation uses [Euler angles](https://en.wikipedia.org/wiki/Euler_angles). The final orientation depends on the order
> in which the rotations are applied (commonly roll -> pitch -> yaw).

#### Example
$$
\text{r} =
\begin{bmatrix}
0 \\
\frac{\pi}{4} \\
\pi
\end{bmatrix}
$$

This rotation represents:
- 0 radians of roll rotation
- $\frac{\pi}{4}$ radians ($\text{45}\degree$) of pitch rotation  
- $\pi$ radians ($\text{180}\degree$) of yaw rotation

Unlike translation vectors, rotation vectors do not represent a direction or magnitude in space.
They are a parameterization of orientation.

---

### Pose
A **pose** combines both a robot’s position and orientation into a single description. While translation tells us *where* the robot is and rotation tells us *which way* it is pointing, a pose captures both simultaneously.

> While translations, rotations, and transforms can be relative to arbitrary points, **poses always represent the absolute position and orientation of a point in space**.


#### 2D Pose
In 2D space, a pose consists of a translation vector and a rotation angle:

$$
P =
\begin{bmatrix}
x \\
y \\
\theta
\end{bmatrix}
$$

- $x$ and $y$ define the robot’s position on the field  
- $\theta$ defines the robot’s heading (orientation)  

This is commonly used for ground robots moving on a planar surface.

#### 3D Pose
In 3D, a pose combines a 3D translation vector with a 3D rotation (Euler angles, rotation matrix, or quaternion):

$$
P =
\begin{bmatrix}
x \\
y \\
z \\
\alpha \\
\beta \\
\gamma
\end{bmatrix}
$$

- $(x, y, z)$ specifies the robot’s position in space  
- $(\alpha, \beta, \gamma)$ specifies its orientation  

A 3D pose is essential when dealing with projectile motion, shooter elevation, or aerial robots.

#### Example
$$
P =
\begin{bmatrix}
2 \\
5 \\
0.5 \\
0 \\
\frac{\pi}{6} \\
\frac{\pi}{2}
\end{bmatrix}
$$

This represents a point that is:
- 2 units along x, 5 units along y, 0.5 units above the field  
- Oriented with 0 roll, 30° pitch, and 90° yaw  

---

### Transformation
A **transformation** describes how to convert a pose or point from one coordinate frame to another. Transformations combine both translation and rotation into a single operation.

#### Linear Algebra Primer for Transformations
Transformations rely on basic linear algebra concepts. Here’s a brief summary:

1. **Vectors**  
   A vector is an ordered list of numbers representing a point or direction in space. For example, a 2D point $(x, y)$ is a 2×1 column vector:
   $$
   \mathbf{v} =
   \begin{bmatrix}
   x \\
   y
   \end{bmatrix}
   $$

2. **Matrices**  
   A matrix is a rectangular array of numbers that can represent a linear transformation. Multiplying a matrix by a vector transforms the vector according to the matrix’s rules:
   $$
   \mathbf{v}' = M \mathbf{v}
   $$
   where $M$ is a matrix and $\mathbf{v}'$ is the transformed vector.

3. **Matrix Multiplication**  
   Matrix multiplication applies one transformation after another. For example, if $T_1$ and $T_2$ are transformations, applying both in sequence is:
   $$
   \mathbf{v}' = T_1 T_2 \mathbf{v}
   $$
   Order matters: $T_1 T_2 \neq T_2 T_1$ in general.

4. **Rotation Matrices**  
   A rotation matrix rotates a vector around the origin. In 2D:
   $$
   R(\theta) =
   \begin{bmatrix}
   \cos\theta & -\sin\theta \\
   \sin\theta & \cos\theta
   \end{bmatrix}
   $$
   Multiplying $R(\theta)$ by a vector rotates it counterclockwise by $\theta$ radians.

5. **Translation in Homogeneous Coordinates**  
   Ordinary 2×2 rotation matrices cannot represent translation directly. By using **homogeneous coordinates**, we embed translation in a 3×3 matrix:
   $$
   T =
   \begin{bmatrix}
   r & t \\
   0 & 1
   \end{bmatrix}
   $$
   where $R$ is rotation and $t$ is translation. Multiplying this matrix by a 3×1 vector $(x, y, 1)^T$ applies both rotation and translation simultaneously.

6. **Chaining Transformations**  
   By multiplying transformation matrices, we can combine multiple motions into a single operation. For example, moving from the robot frame to the shooter frame and then to the field frame is just:
   $$
   T_\text{field} = T_\text{robot->field} \, T_\text{shooter->robot}
   $$

> Summary: Matrices are a compact way to encode rotations, translations, and other linear operations. By representing points as vectors and using matrix multiplication, we can apply complex motion and orientation changes with simple algebra.

#### 2D Transformation
A 2D transformation can be represented as a 3×3 matrix using **homogeneous coordinates**:

$$
T =
\begin{bmatrix}
r & t \\
0 & 1
\end{bmatrix}
$$

- The top-left 2×2 submatrix encodes rotation  
- The top-right column encodes translation  
- The bottom row is used for homogeneous coordinates  

Applying $T$ to a point in the robot’s local frame converts it to the field frame.

#### 3D Transformation
In 3D, a transformation is represented as a 4×4 matrix:

$$
T =
\begin{bmatrix}
r & t \\
0 & 1
\end{bmatrix}
$$

- $r$ is a 3×3 rotation matrix  
- $t$ is a 3×1 translation vector  
- The bottom row allows the use of homogeneous coordinates for matrix multiplication  

Transformations allow chaining multiple motions and orientations easily, such as moving from a robot’s coordinate frame to a turret frame or from the turret frame to the field frame.

#### Example
A 2D transformation for a robot at $(x, y) = (3, 4)$ with heading $\theta = \pi/4$:

$$
T =
\begin{bmatrix}
\frac{\sqrt{2}}{2} & -\frac{\sqrt{2}}{2} & 3 \\
\frac{\sqrt{2}}{2} & \frac{\sqrt{2}}{2} & 4 \\
0 & 0 & 1
\end{bmatrix}
$$

This matrix can be used to transform points from the robot’s local frame into the field frame, which is crucial for predicting where shots will land while the robot is moving.

:::important
While transformations are technically represented as matrices, in practice they are often represented as vectors where the translation is a 3D vector and the rotation is encoded as a 3D rotation (Euler angles, rotation vector, or quaternion). This representation is more compact and intuitive for computation and reasoning in robotics.

$$
T =
\begin{bmatrix}
x \\
y \\
z \\
\alpha \\
\beta \\
\gamma
\end{bmatrix}
$$

Using this interpretation, a pose and a transform are similar constructs, the difference is that a pose represents a position and orientation in a coordinate system, and a transform represents a movement from one coordinate system to another.
:::