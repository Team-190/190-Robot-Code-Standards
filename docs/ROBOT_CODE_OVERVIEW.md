# FRC Code Overview

The Command-Based Programming paradigm in FRC is a design pattern that structures robot code into highly modular and testable units. By discretizing robot hardware through subsystems, it becomes possible to define complex behaviors far easier than if all mechanism code was in one place.

## The Command-Based Programming Model
Command-Based Programming organizes robot code into two main components:

**Subsystems** Represent the physical mechanisms of the robot (e.g., drivetrain, flywheels, arm, elevator). Subsystems encapsulate the hardware and define a set of capabilities that other parts of the robot can interact with.

**Commands** Represent actions or sequences of actions that the robot performs. Commands control subsystems, but they are not directly tied to specific hardware implementations.

This separation of concerns makes the code easier to understand, extend, and debug.

## The Role of Hardware Abstraction
Hardware abstraction is the practice of creating an interface layer between the subsystem logic and the actual hardware. Instead of directly interacting with sensors and actuators, the subsystem interacts with a hardware abstraction layer. This enables:

* **Simulation of Robot Behavior:** Simulation tools, such as WPILib's built-in physics simulation, allow for testing robot code without access to physical hardware. By using hardware abstraction, it becomes possible to replace the physical hardware implementation with a simulated version that mimics the behavior of the real hardware.

* **Unit Testing:** Hardware abstraction decouples subsystem logic from specific hardware implementations. This decoupling allows for mock or dummy hardware implementations to test subsystem and command functionality in isolation. This is especially useful for automated testing, ensuring robot code behaves correctly under various scenarios before running on a robot.

* **Easy Adaptation to Hardware Changes:** Robots often evolve, with components being swapped or upgraded during development or between seasons. With hardware abstraction, adapting to new hardware becomes straightforward, by replacing the underlying implementation while leaving subsystem logic and commands untouched.

Structuring Subsystems for Hardware Abstraction
Subsystems are designed to define the robot's functional behavior without being tied to specific hardware. This is achieved by separating the following layers:

* **Hardware Interface:** The hardware interface defines a contract for how the subsystem interacts with its hardware components. It specifies what the subsystem needs to do (e.g., set motor speeds, read sensor values) but not how these actions are implemented.
* **Physical Hardware Implementation:** The physical hardware implementation fulfills the hardware interface by directly interacting with the robot's sensors and actuators (e.g., motor controllers, encoders, gyros). This layer depends on libraries like WPILib to interact with physical hardware.
* **Simulated Hardware Implementation:** The simulated hardware implementation provides the same interface but replaces physical interactions with computed or virtual behavior. This layer allows testing in simulation or environments without access to a robot.
* **Subsystem Logic:** The subsystem logic defines the functional capabilities of the robot component (e.g., driving forward, turning). This layer uses the hardware interface and is agnostic to whether the hardware is real or simulated.

## Benefits of Subsystem Hardware Abstraction
* **Seamless Transition Between Environments:** With hardware abstraction, the same subsystem logic and commands can be used in both physical and simulated environments. This is particularly valuable for debugging and iterative development when access to a robot is limited.

* **Improved Maintainability:** Subsystems only rely on the hardware interface, allowing changes to hardware details to be made in one place. This reduces the ripple effects of hardware changes throughout the codebase.

* **Enhanced Code Reusability:** Subsystems and commands become portable across projects and robots. As long as the hardware interface remains consistent, the same logic can be reused regardless of the underlying hardware.

* **Simplified Debugging:** Simulated hardware implementations can provide detailed logs or visualizations of the robot's behavior, helping to identify issues that may not be apparent with physical hardware.