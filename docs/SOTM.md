# Shooting While Moving

## Introduction
In many competitive robotics games, especially those involving game pieces launched as projectiles, it is advantageous to score while the robot is still in motion. Shooting while moving allows a robot to maintain speed, avoid defenders, and reduce the time spent stationary in vulnerable positions.

Successfully shooting while moving requires predicting how the robot’s motion will affect the trajectory of the game piece and compensating for that motion in the aiming system. This document introduces the fundamental geometric ideas behind that compensation for two common robot configurations:
- Robots with a fixed shooter (no turret)
- Robots with a rotating turret

This document assumes the robot uses a **swerve drive**, which allows independent control of translation (movement) and rotation (heading).

## Linear Algebra Review

Transformations rely on basic linear algebra concepts. Here’s a brief summary:

1. **Vectors**
   A vector is an ordered list of numbers representing a point or direction in space. For example, a 2D point $(x, y)$ is a 2×1 column vector:
   $$
   v =
   \begin{bmatrix}
   x \\
   y
   \end{bmatrix}
   $$

2. **Matrices**
   A matrix is a rectangular array of numbers that can represent a linear transformation. Multiplying a matrix by a vector transforms the vector according to the matrix’s rules:
   $$
   v' = M v
   $$
   where $M$ is a matrix and $v'$ is the transformed vector.

3. **Matrix Multiplication**
   Matrix multiplication applies one transformation after another. For example, if $T_1$ and $T_2$ are transformations, applying both in sequence is:
   $$
   v' = T_1 T_2 v
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
   T_\text{Field->Shooter} = T_\text{Field->Robot} \, T_\text{Robot->Shooter}
   $$

### 2D Transformation
In 2D space, a transformation is represented using a **3×3 homogeneous transformation matrix**. This matrix encodes both rotation and translation in a single structure:

$$
T =
\begin{bmatrix}
r & t \\
0 & 1
\end{bmatrix}
=
\begin{bmatrix}
\cos\theta & -\sin\theta & x \\
\sin\theta & \cos\theta & y \\
0 & 0 & 1
\end{bmatrix}
$$

- \(r\) is a 2×2 rotation matrix
- \(t\) is a 2×1 translation vector
- The bottom row enables the use of homogeneous coordinates

#### Applying the Transformation
To transform a point from a local coordinate frame into a parent coordinate frame, represent the point using homogeneous coordinates:

$$
p =
\begin{bmatrix}
x \\
y \\
1
\end{bmatrix}
$$

Applying the transformation:

$$
p' = T p
$$

This operation simultaneously applies both the rotation and translation encoded in the matrix.

:::important
### A note about transformation notation

In this document, transforms are notated with a $T_{AB}$ where $A$ is the source (original) frame, and $B$ is the result (target) frame. For example, $T_{RS}$ is a transformation from **robot space** into **shooter space**, i.e., it maps points expressed in the robot frame to coordinates expressed in the shooter frame
:::

## Shooting Theory - No Turret

The theory we will use to shoot on the move is an extension of a common stationary shooting technique that we are going to call *Pose Based Shooting*.

### Pose Based Shooting

The theory behind pose based shooting is that if we know the translation of whatever we want to aim at, and the translation of our robot on the field, we can solve for the pose **(translation and rotation)** for the shooter to aim at.

From the game manual, we know the position of the goal relative to the field:

$$
p_{\text{goal}} =
\begin{bmatrix}
x_{\text{goal}} \\
y_{\text{goal}}
\end{bmatrix}
$$

The robot knows where it is on the field from keeping track of its wheel positions over time (odometry) and any updates it gets from cameras:

$$
p_{\text{robot}} =
\begin{bmatrix}
x_{\text{robot}} \\
y_{\text{robot}}
\end{bmatrix}
$$

Because both of these positions are relative to the field, we can compute the translation vector from the robot to the goal:

$$
p_{\text{goal->robot}} =
p_{\text{robot}} - p_{\text{goal}}
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

The above aiming method assumes the shooter is in the center of the robot. If the shooter is in the center, aiming the robot at the target also aims the shooter at the target. However, sometimes the shooter may not be at the robot center due to space constraints. In that case, we define the **shooter offset** as a rigid-body transform relative to the robot frame:

$$
T_{RS} =
\begin{bmatrix}
\cos\theta_{RS} & -\sin\theta_{RS} & x_{RS} \\
\sin\theta_{RS} & \cos\theta_{RS} & y_{RS} \\
0 & 0 & 1
\end{bmatrix}
$$

- $(x_{RS}, y_{RS})$ is the translational offset of the shooter from the robot’s reference point.  
- $\theta_{RS}$ is the shooter’s fixed orientation relative to the robot frame.  

From the game manual, the goal position in **field coordinates** is:

$$
\mathbf{p}_{\text{goal}} =
\begin{bmatrix}
x_{\text{goal}} \\
y_{\text{goal}}
\end{bmatrix}
$$

The robot’s field-relative pose, obtained from odometry and sensors, is:

$$
T_{FR} =
\begin{bmatrix}
\cos\theta_R & -\sin\theta_R & x_R \\
\sin\theta_R & \cos\theta_R & y_R \\
0 & 0 & 1
\end{bmatrix}
$$

The shooter’s pose in field coordinates is obtained by **pose composition**:

$$
T_{FS} = T_{FR} \cdot T_{RS}
$$

The translation part of $T_{FS}$ gives the shooter’s field position:

$$
\mathbf{t}_S =
\begin{bmatrix}
x_S \\
y_S
\end{bmatrix} =
\begin{bmatrix}
T_{FS}[0,2] \\
T_{FS}[1,2]
\end{bmatrix}
$$

The vector from the shooter to the goal is:

$$
\mathbf{v}_{S\to G} = \mathbf{p}_{\text{goal}} - \mathbf{t}_S
$$

The **field-relative angle** the shooter must point is:

$$
\theta_{SF} = \tan^{-1}(\frac{y_{\text{goal}} - y_S}{x_{\text{goal}} - x_S})
$$

> This is the angle the shooter should point **in field coordinates**.

To align the shooter with the goal, the robot must rotate so that the shooter’s field angle matches the target angle. Since the shooter’s field angle is the sum of the robot’s field orientation and the shooter offset:

$$
\theta_{SF} = \theta_{\text{robot to aim}} + \theta_{RS}
$$

Solving for the robot’s orientation:

$$
\boxed{
\theta_{\text{robot to aim}} = \theta_{SF} - \theta_{RS}
}
$$

Where:

- $\theta_{\text{robot to aim}}$ is the **robot’s heading in field coordinates** that makes the shooter point at the goal.  
- $\theta_{SF}$ is the **angle from shooter to goal in field coordinates**.  
- $\theta_{RS}$ is the shooter’s **fixed orientation relative to the robot**.  

### Shooting While Moving

When shooting while moving, the projectile inherits the shooter’s **field-relative velocity** at release. To compensate, the target must be projected **backward along the shooter’s velocity vector** for the projectile’s flight time $\Delta t$.

#### Inputs

To calculate the adjusted target pose $P_{\text{adj\_target}}$, we need:

- Robot's current field-relative pose: $T_{FR}$  
- Nominal field-relative target pose: $\mathbf{p}_{\text{target}}$  
- Robot's current **linear velocity in the field**: $\mathbf{v}_{\text{robot}}$  
- Robot's current **angular velocity**: $\omega_{\text{robot}}$  
- Projectile flight time: $\Delta t$  
- Transform from robot frame to shooter frame: $T_{RS}$

#### Shooter offset distance

Let the translational offset of the shooter in the robot frame be:

$$
\mathbf{t}_{RS} =
\begin{bmatrix}
T_{RS_X} \\
T_{RS_Y}
\end{bmatrix}
$$

The distance from the robot center to the shooter is:

$$
d = \|\mathbf{t}_{RS}\| = \sqrt{T_{RS_X}^2 + T_{RS_Y}^2}
$$

#### Velocity induced by rotation

A shooter offset from the robot’s rotation center experiences a linear velocity due to the robot’s angular velocity:

1. Compute the angle of the shooter relative to the robot frame:

$$
\phi = \tan^{-1}(\frac{T_{RS_Y}}{T_{RS_X}})
$$

2. Linear velocity due to rotation (in robot coordinates):

$$
\mathbf{v}_{\text{rot, robot}} =
\omega_{\text{robot}} \cdot d \cdot
\begin{bmatrix}
-\sin\phi \\
\cos\phi
\end{bmatrix}
$$

#### Transform rotational velocity to field frame

The shooter’s velocity due to rotation in the **field frame** is:

$$
\mathbf{v}_{\text{rot, field}} = \begin{bmatrix}
\cos\theta_{\text{robot}} & -\sin\theta_{\text{robot}} \\
\sin\theta_{\text{robot}} & \cos\theta_{\text{robot}}
\end{bmatrix} \cdot \mathbf{v}_{\text{rot, robot}}
$$

#### Total shooter velocity in the field

Including the robot’s translational velocity:

$$
\mathbf{v}_{\text{shooter}} = \mathbf{v}_{\text{rot, field}} + \mathbf{v}_{\text{robot}}
$$

This is the **field-relative velocity of the shooter at the moment of firing**.

#### Adjust target pose

Finally, compensate for the shooter’s motion during the projectile flight time $\Delta t$:

$$
\mathbf{p}_{\text{adj\_target}} = \mathbf{p}_{\text{target}} - \mathbf{v}_{\text{shooter}} \cdot \Delta t
$$

This is the **adjusted target position in field coordinates** that the shooter should aim at to hit the nominal target while moving.