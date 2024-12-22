# AdvantageKit Standards

AdvantageKit is a powerful software library designed for FRC teams to assist with robot data collection, analysis, and debugging. It provides tools for logging and analyzing robot data, enabling teams to identify issues, refine control algorithms, and make data-driven improvements. For more details, see [AdvantageKit documentation](https://docs.advantagekit.org/getting-started/what-is-advantagekit/).

## IO Interfaces and Inputs
A subsystem's IO interface is what defines the inputs that are automatically logged for that subsystem. It is important to log any information that could be useful in [Log Replay](https://docs.advantagekit.org/getting-started/what-is-advantagekit/), because any information that is not logged as an input can't be used to create new simulated outputs.

The fields that 190 logs in every subsystem's IO interface depends on the hardware used in that subsystem:
* Motors:
    * Position ([Rotation2d](https://docs.wpilib.org/en/stable/docs/software/advanced-controls/geometry/transformations.html#rotation2d))
    * Velocity (Radians/Second)
    * Applied Voltage (Volts)
    * Supply Current (Amps)
    * Stator/Torque Current (Amps)
    * Temperature (Celsius)
* Pneumatic Actuators:
    * Position (boolean, true if extended, false if retracted)


This is not a comprehensive list, rather a starting point for input logging that will be sufficient for most subsystems.

Every IO interface must have a static Inputs class where all the inputs are defined and instantiated with default values. The ```@AutoLog``` annotation must be used to tell the robot code that the fields in the inputs class are to be logged. Every IO interface must also have a default ```updateInputs``` method, updates the inputs for the subsystem every loop cycle.

```java
...

public interface IO {
  @AutoLog
  public static class IOInputs {
    public Rotation2d position = new Rotation2d();
    public double velocityRadiansPerSecond = 0.0;
    public double appliedVolts = 0.0;
    public double supplyCurrentAmps = 0.0;
    public double statorCurrentAmps = 0.0;
    public double temperatureCelsius = 0.0;

    public boolean pneumaticPosition = Value.kOff;
  }

  public default void updateInputs(IOInputs inputs) {}
...
```

## IO Implementations
In FRC, it is often useful to abstract a subsystem's hardware away from its logic. This is useful for running multiple robots with different hardware using the same code. For example, a practice robot may be running one type of motor, whereas the competition robot may run a different type of motor. In order to run the same code on both robots, hardware abstraction is used to keep the logic the same for both robots, while switching between hardware. This is done through the use of IO implementations.


IO implementations are where actual hardware behaviors are defined. Each IO implementation must:
* Implement its subsystem IO interface.
* Override ```updateInputs()``` for specific hardware updates.
* Implement hardware specific actuation, using vendor libraries.



## Simulated IO Implementations
IO implementations can also be physics simulators. Instead of having simulation code in the subsystem, an IO implementation can be written and instantiated when running the robot code in simulation.

## Examples

Simple Example: [Whiplash's Intake Subsystem](https://github.com/Team-190/2k24-Robot-Code/blob/snaplash/src/main/java/frc/robot/subsystems/whiplash/intake)

Complex Example: [Whiplash's Arm Subsystem](https://github.com/Team-190/2k24-Robot-Code/blob/snaplash/src/main/java/frc/robot/subsystems/whiplash/arm)