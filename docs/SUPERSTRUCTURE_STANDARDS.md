# Superstructures

## Purpose
A **Superstructure** is a high-level subsystem responsible for coordinating multiple mechanisms that must move together safely and predictably (for example: elevator, arm, wrist, intake). 

This document defines **how superstructures should generally be designed and implemented**, independent of any specific robot. It establishes a reusable architectural pattern focused on:
- **Safety**: Preventing mechanical interference.
- **Clarity**: Using discrete states instead of complex boolean logic.
- **Maintainability**: Centralizing coordination logic.
- **Consistency**: Ensuring identical behavior across autonomous and teleoperated modes.

---

## 1. What a Superstructure Is (and Is Not)

### 1.1 What a Superstructure Is
A Superstructure:
- Coordinates **multiple physical subsystems**.
- Represents robot configurations as **explicit states**.
- Owns all **inter-mechanism safety constraints**.
- Exposes a **simple, intent-driven API** to the rest of the robot code.

Subsystems continue to control hardware directly. The Superstructure controls **coordination and intent**.

### 1.2 What a Superstructure Is Not
A Superstructure is **not**:
- A replacement for individual subsystems.
- A place for raw motor control.
- A collection of boolean flags.
- A dumping ground for teleop logic.

---

## 2. Core Design Philosophy
Superstructures should be:
- **State-driven**: Behavior is defined by discrete states.
- **Command-based**: All motion is executed via WPILib Commands.
- **Declarative**: States describe *what* the robot should do, not *how*.
- **Centralized**: Coordination logic lives in one place.
- **Deterministic**: Transitions are explicit and repeatable.

**Avoid:**
- Nested `if` / `else` logic.
- Mechanism-to-mechanism coupling (Subsystem A checking Subsystem B).
- Hidden safety rules scattered across individual subsystems.

---

## 3. State-Based Architecture

### 3.1 Superstructure States
States represent **stable, meaningful robot configurations**. 
Example:
```java
public enum SuperstructureState {
    STOWED,
    INTAKE_GROUND,
    INTAKE_SOURCE,
    SCORE_LOW,
    SCORE_HIGH
}
```
Guidelines:

States should represent intent, not motion.

Every state must be physically reachable.

Avoid transitional or time-based state names (e.g., MOVING_TO_SCORE).

3.2 Poses
Each state maps to a pose, which defines the desired physical configuration. A pose typically includes:

Elevator height

Arm angle

Wrist angle

Any other positional mechanism

Rules:

Poses are data, not logic.

Units must be explicit and consistent.

No branching or conditional behavior within a pose definition.

3.3 Actions
Some states require active behavior in addition to holding a pose. Examples:

Running intake rollers.

Ejecting a game piece.

Disabling motors.

Guidelines:

Actions are associated with states.

Avoid sensor-driven logic inside actions.

Let Commands and schedulers handle timing and termination.

4. Transitions and Safety
4.1 Explicit State Transitions
Superstructures must define which state transitions are allowed. Each transition includes:

A source state.

A target state.

One or more Commands that perform the transition.

Benefits:

Prevents unsafe motion (e.g., moving an arm through a support bar).

Makes behavior predictable.

Eliminates special-case logic in teleop.

4.2 Transition Graph
Transitions should form a directed graph. This allows the Superstructure to:

Find safe paths between any two states.

Reuse transition logic.

Avoid hardcoding direct transitions everywhere.

Avoid:

Implicit transitions.

“Teleporting” directly between incompatible states.

5. Command-Based Execution
5.1 Commands Own Motion
All physical motion must be executed via Commands.

The Superstructure must not directly control motors.

Commands should be small, reusable, and single-purpose.

Subsystems should expose safe, high-level control methods to these Commands.

5.2 Scheduling and State Tracking
The Superstructure is responsible for:

Computing a valid transition path.

Scheduling transition Commands in order.

Tracking completion.

Updating the current state.