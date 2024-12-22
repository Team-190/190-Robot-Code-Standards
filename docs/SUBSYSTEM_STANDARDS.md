# Subsystem Standards

## Subsystems Overview
Subsystems split up the logic for the different parts of the robot, and control how the robot will perform the actions they are designed to do. This requires defining how the robot will interact with it's environment, whether that be in the physical world, or a physics simulation. In the real world, we do this by interacting with physical hardware, like motors, and in a physics simulation by modeling our robot's physical properties to test logic.

Each subsystem must:

* Extend ```SubsystemBase```.
* Override the ```periodic()``` method.
    * Update IO implementation with inputs - this must come before processing the inputs.
    * Process the subsystem inputs.
* Contain all logic for that subsystem.
* Contain all necessary command factories.
* Not include any [constants](CONSTANTS_STANDARDS.md).

Robot code runs once per loop cycle, usually 20 ms (50 Hz). When the robot is running, each subclass of ```SubsystemBase``` runs it's periodic method. The periodic method is where we tell the robot what to do, and under what conditions to do it.

## Simple Example: Whiplash Intake Subsystem

Each subsystem extends ```SubsystemBase```. This tells the robot that the code in this class is affiliated with a subsystem, and the robot will handle the code accordingly.

```java
public class WhiplashIntake extends SubsystemBase {
```

Each subsystem has to declare the variables it will use within itself. In the intake subsystem for Whiplash, the variables are:

* IO implementation to interface with hardware/physics simulator.
* IO inputs to output to log file.
* Timer to track how long the intake possesses 2 game pieces.
* isIntaking Logic variable.

```java
public class WhiplashIntake extends SubsystemBase {
  private final WhiplashIntakeIO io;
  private final WhiplashIntakeIOInputsAutoLogged inputs;

  private final Timer doubleTimer;
  private boolean isIntaking;

  ...
```
:::warning
Every subsystem must have an IO implementation and a set of inputs! See [AdvantageKit Standards](ADVANTAGEKIT_STANDARDS.md) for more details
:::

After declaring the variables the subsystem needs, they need to be instantiated. This occurs in the constructor:

```java
public WhiplashIntake(WhiplashIntakeIO io) {
    this.io = io;
    inputs = new WhiplashIntakeIOInputsAutoLogged();

    doubleTimer = new Timer();
    isIntaking = false;
  }
```
:::tip
To improve readability, it is generally best to instantiate variables in the order they are declared.
:::

The intake subsystem periodically has to:
* Update and log the inputs of the subsystem
* Run the rollers under specific conditions

```java
@Override
  public void periodic() {
    io.updateInputs(inputs);
    Logger.processInputs("Intake", inputs);

    if (hasNoteLocked() && !hasNoteStaged()) {
      io.setTopVoltage(-3.0);
      doubleTimer.stop();
      doubleTimer.reset();
    }

    if (hasNoteLocked() && hasNoteStaged() && doubleTimer.get() <= 3.0) {
      io.setTopVoltage(-1.0);
    }

    if (hasNoteLocked() && hasNoteStaged() && doubleTimer.get() <= 0.0) {
      io.setTopVoltage(0.0);
      doubleTimer.start();
    }

    if (doubleTimer.get() >= 0.0 && !hasNoteStaged() && !hasNoteLocked()) {
      io.setTopVoltage(0.0);
      doubleTimer.stop();
      doubleTimer.reset();
    }

    if (hasNoteLocked() && hasNoteStaged() && doubleTimer.get() >= 3.0) {
      io.setTopVoltage(12.0);
    }

    if (inputs.middleSensor && !inputs.finalSensor) {
      io.setTopVoltage(-1.0);
      io.setBottomVoltage(1.0);
      io.setAcceleratorVoltage(1.0);
    } else if (inputs.finalSensor) {
      io.setBottomVoltage(0.0);
      io.setAcceleratorVoltage(0.0);
    }

    Logger.recordOutput("Intake/Timer", doubleTimer.get());
  }
```

:::danger
Inputs must be updated before they are processed, otherwise the inputs in the log file will be one loop cycle behind.
:::

Subsystems can also define methods to expose inputs to other places in the code that require the subsystem:

```java
  public boolean hasNoteLocked() {
    return inputs.finalSensor;
  }

  public boolean hasNoteStaged() {
    return inputs.intakeSensor || inputs.middleSensor;
  }

  public boolean isIntaking() {
    return isIntaking;
  }
```

In cases where the subsystem needs to react to user input or other parts of the robot, we define ```Command``` structures that can be bound to events that occur elsewhere in our code:

```java
  public Command intake() {
    return Commands.sequence(
            Commands.runOnce(() -> isIntaking = true),
            Commands.parallel(
                    Commands.runEnd(() -> io.setTopVoltage(-12.0), () -> io.setTopVoltage(0.0)),
                    Commands.runEnd(
                        () -> io.setBottomVoltage(12.0), () -> io.setBottomVoltage(0.0)),
                    Commands.runEnd(
                        () -> io.setAcceleratorVoltage(12.0), () -> io.setAcceleratorVoltage(0.0)))
                .until(() -> inputs.middleSensor),
            Commands.parallel(
                    Commands.runEnd(() -> io.setTopVoltage(-1.0), () -> io.setTopVoltage(0.0)),
                    Commands.runEnd(() -> io.setBottomVoltage(1.0), () -> io.setBottomVoltage(0.0)),
                    Commands.runEnd(
                        () -> io.setAcceleratorVoltage(1.0), () -> io.setAcceleratorVoltage(0.0)))
                .until(() -> inputs.finalSensor))
        .until(() -> inputs.finalSensor)
        .finallyDo(() -> isIntaking = false);
  }

  public Command eject() {
    return Commands.parallel(
        Commands.runEnd(() -> io.setTopVoltage(12.0), () -> io.setTopVoltage(0.0)),
        Commands.runEnd(() -> io.setBottomVoltage(-12.0), () -> io.setBottomVoltage(0.0)),
        Commands.runEnd(
            () -> io.setAcceleratorVoltage(-12.0), () -> io.setAcceleratorVoltage(0.0)));
  }

  public Command shoot() {
    return Commands.runEnd(
            () -> io.setAcceleratorVoltage(12.0), () -> io.setAcceleratorVoltage(0.0))
        .withTimeout(0.25);
  }
```
:::info
These types of commands are called factory commands.
:::
:::tip
see [Commands Standards](COMMANDS_STANDARDS.md) for more information about commands.
:::

Full file found here: [Whiplash Intake Subsystem](https://github.com/Team-190/2k24-Robot-Code/blob/snaplash/src/main/java/frc/robot/subsystems/whiplash/intake/WhiplashIntake.java)

## Other Examples

[Whiplash's arm subsystem](https://github.com/Team-190/2k24-Robot-Code/blob/snaplash/src/main/java/frc/robot/subsystems/whiplash/arm/WhiplashArm.java) is an example of motion profiled closed loop position control of a Single Jointed Arm.

[Whiplash's shooter subsystem](https://github.com/Team-190/2k24-Robot-Code/blob/snaplash/src/main/java/frc/robot/subsystems/whiplash/shooter/WhiplashShooter.java) is an example of motion profiled closed loop velocity control of a flywheel shooter.