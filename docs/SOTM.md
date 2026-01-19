# Shooting While Moving

## Introduction
In many competitive robotics games, especially those involving game pieces launched as projectiles, it is advantageous to score while the robot is still in motion. Shooting while moving allows a robot to maintain speed, avoid defenders, and reduce the time spent stationary in vulnerable positions.

Successfully shooting while moving requires predicting how the robot’s motion will affect the trajectory of the game piece and compensating for that motion in the aiming system. This document introduces the fundamental geometric ideas behind that compensation for two common robot configurations:
- Robots with a fixed shooter (no turret)
- Robots with a rotating turret

This document assumes the robot uses a **swerve drive**, which allows independent control of translation (movement) and rotation (heading).

---

## Key Terms
To reason about shooting while moving, we need a precise way to describe where things are on the field and how they are oriented. This document uses standard geometric representations commonly found in robotics, physics, and control systems.

<details>
<summary>TLDR</summary>

<table>
  <thead>
    <tr>
      <th>Concept</th>
      <th>Definition</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Translation (2D)</td>
      <td>
        $t = \begin{bmatrix} x \\ y \end{bmatrix}$
      </td>
    </tr>
    <tr>
      <td>Translation (3D)</td>
      <td>
        $t = \begin{bmatrix} x \\ y \\ z \end{bmatrix}$
      </td>
    </tr>
    <tr>
      <td>Rotation (2D)</td>
      <td>
        $r = \theta$
      </td>
    </tr>
    <tr>
      <td>Rotation (3D)</td>
      <td>
        $
        r = \begin{bmatrix}
        \alpha & \text{(roll)} \\
        \beta & \text{(pitch)} \\
        \gamma & \text{(yaw)}
        \end{bmatrix}
        $
      </td>
    </tr>
    <tr>
      <td>Pose (2D)</td>
      <td>
        $P = \begin{bmatrix} x \\ y \\ \theta \end{bmatrix}$
      </td>
    </tr>
    <tr>
      <td>Pose (3D)</td>
      <td>
        $
        P = \begin{bmatrix}
        x \\ y \\ z \\
        \alpha \\ \beta \\ \gamma
        \end{bmatrix}
        $
      </td>
    </tr>
    <tr>
      <td>Transform (2D)</td>
      <td>
        $T = \begin{bmatrix} x \\ y \\ \theta \end{bmatrix}$
      </td>
    </tr>
    <tr>
      <td>Transform (3D)</td>
      <td>
        $
        T = \begin{bmatrix}
        x \\ y \\ z \\
        \alpha \\ \beta \\ \gamma
        \end{bmatrix}
        $
      </td>
    </tr>
  </tbody>
</table>

</details>


---

### Translation
A **translation** describes linear movement through space, essentially how an object’s position changes without considering its orientation.

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

- **z** represents height, which is useful when modeling projectile motion.

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
In 3D, a pose combines a 3D translation vector with a 3D rotation:

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

While transformations are technically represented as matrices, in practice, they are often represented as vectors with translation and rotation components. This representation is more compact and intuitive for computation and reasoning in robotics.

$$
T_{2D} =
\begin{bmatrix}
x \\
y \\
\theta
\end{bmatrix}
$$

$$
T_{3D} =
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

Reviews for how to represent transformations as matrices are shown below

<details>
<summary>
Linear Algebra Review
</summary>
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
</details>

<details>
<summary>
2D and 3D Transformation Matrix Definitions
</summary>
#### 2D Transformation
In 2D space, a transformation is represented using a **3×3 homogeneous transformation matrix**. This matrix encodes both rotation and translation in a single structure:

$$
T =
\begin{bmatrix}
r & t \\
0 & 1
\end{bmatrix}
$$

- \(r\) is a 2×2 rotation matrix
- \(t\) is a 2×1 translation vector
- The bottom row enables the use of homogeneous coordinates

---

##### Translation Component
The translation portion of the transform is:

$$
t =
\begin{bmatrix}
x \\
y
\end{bmatrix}
$$

This represents a shift of:
- \(x\) units along the x-axis
- \(y\) units along the y-axis

---

##### Rotation Component
In 2D, rotation is fully described by a single angle $\theta$, representing a counterclockwise rotation about the origin.

The 2D rotation matrix is:

$$
r =
\begin{bmatrix}
\cos\theta & -\sin\theta \\
\sin\theta & \cos\theta
\end{bmatrix}
$$

---

##### Full 3×3 Transformation Matrix
Combining rotation and translation yields the full 2D transformation matrix:

$$
T =
\begin{bmatrix}
\cos\theta & -\sin\theta & x \\
\sin\theta & \cos\theta & y \\
0 & 0 & 1
\end{bmatrix}
$$

---

##### Applying the Transformation
To transform a point from a local coordinate frame into a parent coordinate frame, represent the point using homogeneous coordinates:

$$
\mathbf{p} =
\begin{bmatrix}
x \\
y \\
1
\end{bmatrix}
$$

Applying the transformation:

$$
\mathbf{p}' = T \mathbf{p}
$$

This operation simultaneously applies both the rotation and translation encoded in the matrix.

---

:::important
In planar robotics systems such as FRC drivetrains:
- The robot moves on a flat field
- Orientation is fully described by a single heading angle \(\theta\)

As a result, 2D transformations are sufficient for modeling robot motion, odometry, and aiming problems where height and roll/pitch effects can be ignored.
:::

Applying $T$ to a point in the robot’s local frame converts it to the field frame.

#### 3D Transformation
In 3D space, a transformation is represented using a **4×4 homogeneous transformation matrix**. This matrix encodes both rotation and translation in a single structure:

$$
T =
\begin{bmatrix}
r & t \\
0 & 1
\end{bmatrix}
$$

- \(r\) is a 3×3 rotation matrix
- \(t\) is a 3×1 translation vector
- The bottom row enables the use of homogeneous coordinates

---

##### Translation Component
The translation portion of the transform is:

$$
t =
\begin{bmatrix}
x \\
y \\
z
\end{bmatrix}
$$

This represents a shift of:
- \(x\) units along the x-axis
- \(y\) units along the y-axis
- \(z\) units along the z-axis

---

##### Rotation Component
The rotation matrix \(r\) is constructed from **Euler angles**:
- $\alpha$: roll (rotation about the x-axis)
- $\beta$: pitch (rotation about the y-axis)
- $\gamma$: yaw (rotation about the z-axis)

This document assumes the rotations are applied in the following order:

$$
\text{roll} \rightarrow \text{pitch} \rightarrow \text{yaw}
$$

The resulting rotation matrix is:

$$
r =
\begin{bmatrix}
\cos\gamma\cos\beta &
\cos\gamma\sin\beta\sin\alpha - \sin\gamma\cos\alpha &
\cos\gamma\sin\beta\cos\alpha + \sin\gamma\sin\alpha \\[6pt]

\sin\gamma\cos\beta &
\sin\gamma\sin\beta\sin\alpha + \cos\gamma\cos\alpha &
\sin\gamma\sin\beta\cos\alpha - \cos\gamma\sin\alpha \\[6pt]

-\sin\beta &
\cos\beta\sin\alpha &
\cos\beta\cos\alpha
\end{bmatrix}
$$

---

##### Full 4×4 Transformation Matrix
Combining rotation and translation yields the full 3D transformation matrix:

$$
T =
\begin{bmatrix}
\cos\gamma\cos\beta &
\cos\gamma\sin\beta\sin\alpha - \sin\gamma\cos\alpha &
\cos\gamma\sin\beta\cos\alpha + \sin\gamma\sin\alpha &
x \\[6pt]

\sin\gamma\cos\beta &
\sin\gamma\sin\beta\sin\alpha + \cos\gamma\cos\alpha &
\sin\gamma\sin\beta\cos\alpha - \cos\gamma\sin\alpha &
y \\[6pt]

-\sin\beta &
\cos\beta\sin\alpha &
\cos\beta\cos\alpha &
z \\[6pt]

0 & 0 & 0 & 1
\end{bmatrix}
$$

</details>

:::important
### A note about transformation notation

In this document, transforms are notated with a $T_{AB}$ where $B$ is the source (original) frame, and $A$ is the result (target) frame. For example, $T_{SR}$ is a transformation from **robot space** into **shooter space**, i.e., it maps points expressed in the robot frame to coordinates expressed in the shooter frame
:::

---

## Shooting Theory - No Turret

The theory we will use to shoot on the move is an extension of a common stationary shooting technique that we are going to call *Pose Based Shooting*.

### Pose Based Shooting

The theory behind pose based shooting is that if we know the translation of whatever we want to aim at, and the translation of our robot on the field, we can solve for the pose **(translation and rotation)** for the shooter to aim at.

From the game manual, we know the translation of the goal relative to the field:

$$
\mathbf{t}_{\text{goal}} =
\begin{bmatrix}
x_{\text{goal}} \\
y_{\text{goal}}
\end{bmatrix}
$$

The robot knows where it is on the field from keeping track of its wheel positions over time (odometry) and any updates it gets from cameras:

$$
\mathbf{t}_{\text{robot}} =
\begin{bmatrix}
x_{\text{robot}} \\
y_{\text{robot}}
\end{bmatrix}
$$

Because both of these translations are relative to the field, we can compute the translation vector from the robot to the goal:

$$
\mathbf{t}_{\text{goal->robot}} =
\mathbf{t}_{\text{goal}} - \mathbf{t}_{\text{robot}}
$$

The angle the shooter must rotate to aim at the goal is then:

$$
\theta_{\text{shooter}} =
\tan^{-1}\left(\frac{
y_{\text{goal}} - y_{\text{robot}}}
{x_{\text{goal}} - x_{\text{robot}}}
\right)
$$

### Offset Shooter

The above aiming method assumes the shooter is in the center of the robot. If the shooter is in the center of the robot, aiming the robot at the target also aims the shooter at the target. However, in certain circumstances, a shooter may not be in the center of the robot due to space constraints. In that case, we can use a transformation ($T_{SR}$) that maps points from **robot space** to **shooter space**.

We define the shooter offset as a **rigid-body transform** relative to the robot frame:

$$
T_{SR} =
\begin{bmatrix}
x_{SR} \\
y_{SR} \\
\theta_{SR}
\end{bmatrix}
$$

Here:

- $\begin{bmatrix} x_{SR} \\ y_{SR} \end{bmatrix}$ is the translational offset of the shooter from the robot center.  
- $\theta_{SR}$ is the orientation of the shooter relative to the robot frame.

From the game manual, we know the translation of the goal relative to the field:

$$
\mathbf{t}_{\text{goal}} =
\begin{bmatrix}
x_{\text{goal}} \\
y_{\text{goal}}
\end{bmatrix}
$$

The robot knows its pose on the field from keeping track of its wheel positions over time (odometry) and any updates it gets from cameras.

$$
P_{robot} =
\begin{bmatrix}
x_{\text{robot}} \\
y_{\text{robot}} \\
\theta_{robot}
\end{bmatrix}
$$

Because the robot pose is relative to the origin of the field reference frame, we can express the pose of the robot on the field as a transform from the field origin to the  robot:

$$
T_{FR} =
\begin{bmatrix}
x_{\text{robot}} \\
y_{\text{robot}} \\
\theta_{robot}
\end{bmatrix}
$$

Then:

$$
T_{FS} = T_{FR} \cdot T_{SR}
$$

And:

$$
t_{FS} = \begin{bmatrix} x_{FS} \\ y_{FS} \end{bmatrix} = \text{translation part of } T_{FS}
$$

Then the goal relative to the shooter in field coordinates is:

$$
\mathbf{t}_{\text{goal to shooter in field coordinates}} =
\begin{bmatrix}
x_{\text{goal}} \\
y_{\text{goal}}
\end{bmatrix}
-
\begin{bmatrix}
x_{\text{shooter}} \\
y_{\text{shooter}}
\end{bmatrix}
$$

The field-relative angle the shooter must point is:

$$
\theta_{\text{shooter field}} =
\tan^{-1}\left(\frac{
y_{\text{goal}} - y_{\text{shooter}}}
{x_{\text{goal}} - x_{\text{shooter}}}
\right)
$$

> This is the angle the shooter should point **in field coordinates**.

To align the shooter with the goal, the robot must rotate so that the shooter’s field angle matches the target angle.  

The robot’s required orientation is:

$$
\theta_{\text{robot to aim}} = \theta_{\text{SF}} - \theta_{SR}
$$

Here:

- $\theta_{\text{robot to aim}}$ is the robot’s orientation in the field that will make the shooter point at the goal.  
- $\theta_{\text{SF}}$ is the angle from shooter to goal in field coordinates.  
- $\theta_{SR}$ is the shooter’s fixed orientation relative to the robot.