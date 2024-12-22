# Constants Standards

## Naming Conventions and Modifiers
All constants follow SNAKE_CASE, and all constants have the modifiers: ```public static final```.

## Constants.java
The official [WPIlib](https://github.com/wpilibsuite/allwpilib) constants file houses the different robot types, the tuning mode variable, and the robot loop cycle time. The constants file does not house specific subsystem constants, which are kept in separate constants classes.

## Subsystem Constants
Each subsystem requires its own set of constants, however, because the robot code often services more than one robot, these constants can be different depending on the robot the code is running on.

Each subsystem will have a constants file in the same directory as the subsystem. Each constant will be declared before it is instantiated, (except for any [Tunable Numbers](LOGGING_STANDARDS.md) whose values are set after being initialized). Constants will be instantiated in a static block based on which robot is currently running the code. This is done with a switch statement. If a constant is the same across all robots, it is instantiated above the switch statement

Example: Serializer subsystem constants from FRC 190 2024 robot, Snapback

```java
package frc.robot.subsystems.serializer;

import edu.wpi.first.math.system.plant.DCMotor;
import frc.robot.Constants;
import frc.robot.util.LoggedTunableNumber;

public class SerializerConstants {
  public static final LoggedTunableNumber SHOOT_VOLTAGE =
      new LoggedTunableNumber("Serializer/Shoot Voltage");
  public static final LoggedTunableNumber INTAKE_VOLTAGE =
      new LoggedTunableNumber("Serializer/Intake Voltage");
      
  public static final int DEVICE_ID;
  public static final double SUPPLY_CURRENT_LIMIT;
  public static final double GEAR_RATIO;
  public static final double MOMENT_OF_INERTIA;
  public static final DCMotor MOTOR_CONFIG;
  public static final int SENSOR_CHANNEL;

  static {
    SHOOT_VOLTAGE.initDefault(12.0);
    INTAKE_VOLTAGE.initDefault(12.0);

    SUPPLY_CURRENT_LIMIT = 40.0;
    GEAR_RATIO = 2.0;
    MOMENT_OF_INERTIA = 0.004;
    MOTOR_CONFIG = DCMotor.getKrakenX60(1);
    SENSOR_CHANNEL = 0;
    switch (Constants.ROBOT) {
      case SNAPBACK:
        DEVICE_ID = 3;
        break;
      case ROBOT_2K24_TEST:
        DEVICE_ID = 48;
        break;
      case ROBOT_SIM:
      default:
        DEVICE_ID = -1;
    }
  }
}

```