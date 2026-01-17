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

$
\text{t} =
\begin{bmatrix}
x \\
y
\end{bmatrix}
$

- **x** represents movement along the field’s horizontal axis  
- **y** represents movement along the field’s vertical axis  

This is typically used to describe a robot’s position or velocity on the field.

#### 3D Translation
In 3D space, an additional axis is included:

$\text{t} =
\begin{bmatrix}
x \\
y \\
z
\end{bmatrix}
$

- **z** represents height, which is useful when modeling projectile motion or shooter exit points.

#### Example
$
\text{t} =
\begin{bmatrix}
3 \\
4 \\
5
\end{bmatrix}
$

This translation represents:
- 3 units of movement in the x direction  
- 4 units of movement in the y direction  
- 5 units of movement in the z direction  
---

### Rotation
A **rotation** describes how an object’s orientation changes in space. While translation answers *“Where is it?”*, rotation answers *“Which way is it pointing?”*

#### 2D Rotation
In 2D, rotation is represented by a single angle:

$
\text{r} = \theta
$

- $\theta$ is typically measured in radians  
- A positive value usually represents counterclockwise rotation  

For a robot, this often corresponds to the robot’s heading on the field.

#### 3D Rotation
In 3D space, rotation can be described using three angles:

$
\text{r} =
\begin{bmatrix}
\alpha \\
\beta \\
\gamma
\end{bmatrix}
$

These angles represent rotations about three perpendicular axes:
- $\alpha$: rotation about the x-axis (roll)  
- $\beta$: rotation about the y-axis (pitch)  
- $\gamma$: rotation about the z-axis (yaw)

> Note: This representation uses [Euler angles](https://en.wikipedia.org/wiki/Euler_angles). The final orientation depends on the order
> in which the rotations are applied (commonly roll → pitch → yaw).

#### Example
$
\text{r} =
\begin{bmatrix}
0 \\
\frac{\pi}{4} \\
\pi
\end{bmatrix}
$

This rotation represents:
- 0 radians of roll rotation
- $\frac{\pi}{4}$ radians ($\text{45}\degree$) of pitch rotation  
- $\pi$ radians ($\text{180}\degree$) of yaw rotation

Unlike translation vectors, rotation vectors do not represent a direction or magnitude in space.
They are a parameterization of orientation.

---

### Pose
TODO

### Transformation
TODO

