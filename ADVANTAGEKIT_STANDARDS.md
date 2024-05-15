# AdvantageKit Standards
This section provides standards that govern the IO inputs and implementations in robot projects.

## IO Interfaces and Inputs
A subsystem's IO interface is what defines the inputs that are automatically logged for that subsystem. It is important to log any information that could be useful in [Log Replay](https://github.com/Mechanical-Advantage/AdvantageKit/blob/main/docs/WHAT-IS-ADVANTAGEKIT.md#example-1-output-logging-in-replay), because any information that is not logged as an input can't be used to create new simulated outputs.

The fields that 190 logs in every subsystem's IO interface depends on the hardware used in that subsystem:
* Motors:
    * Position ([Rotation2d](https://docs.wpilib.org/en/stable/docs/software/advanced-controls/geometry/transformations.html#rotation2d))
    * Velocity (Radians/Second)
    * Applied Voltage (Volts)
    * Current (Amps)
    * Temperature (Celcius)
* Pneumatic Actuators:
    * Position (boolean, true if extended, false if retracted)


This is not a comprehensive list, rather a starting point for input logging that will be sufficient for most subsystems.

Every IO interface must have a static Inputs class where all the inputs are defined and instantiated with default values. The ```@AutoLog``` annotation must be used to tell the robot code that the fields in the inputs class are to be logged. Every IO interface must also have a default ```updateInputs``` method, updates the inputs for the subsystem every loop cycle.

ex. (Intake subsystem IO interface from FRC 190 2024 robot, Snapback)

```java
package frc.robot.subsystems.intake;

import org.littletonrobotics.junction.AutoLog;

public interface IntakeIO {
  @AutoLog
  public static class IntakeIOInputs {
    public Rotation2d rollersPosition = Rotation2d.fromRadians(0.0);
    public double rollersVelocityRadPerSec = 0.0;
    public double rollersAppliedVolts = 0.0;
    public double rollersCurrentAmps = 0.0;
    public double rollersTempCelcius = 0.0;

    public boolean leftPosition = false;
    public boolean rightPosition = false;
  }

  public default void updateInputs(IntakeIOInputs inputs) {}

  public default void setRollersVoltage(double volts) {}

  public default void setIntakePosition(boolean isDeployed) {}
}

```
## IO Implementations
In FRC, it is often useful to abstract a subsystem's hardware away from its logic. This is useful for running multiple robots with different hardware using the same code. For example, a practice robot may be running one type of motor, whereas the competition robot may run a different type of motor. In order to run the same code on both robots, hardware abstraction is used to keep the logic the same for both robots, while switching between hardware. This is done through the use of IO implementations.


IO implementations are where actual hardware behaviors are defined. Each IO implementation must:
* Implement its subsystem IO interface.
* Override ```updateInputs()``` for specific hardware updates.
* Implement hardware specific actuation.

ex. (Intake TalonFX IO implementation for FRC 190 2024 robot, Snapback)
```java
package frc.robot.subsystems.intake;

import com.ctre.phoenix6.BaseStatusSignal;
import com.ctre.phoenix6.StatusSignal;
import com.ctre.phoenix6.configs.TalonFXConfiguration;
import com.ctre.phoenix6.controls.VoltageOut;
import com.ctre.phoenix6.hardware.TalonFX;
import com.ctre.phoenix6.signals.InvertedValue;

import edu.wpi.first.math.geometry.Rotation2d;
import edu.wpi.first.math.util.Units;
import edu.wpi.first.wpilibj.PneumaticsModuleType;
import edu.wpi.first.wpilibj.Solenoid;
import frc.robot.util.Alert;
import frc.robot.util.Alert.AlertType;

public class IntakeIOTalonFX implements IntakeIO {
  private final TalonFX rollersTalon;
  private final Solenoid solenoid;

  private final StatusSignal<Double> rollersPosition;
  private final StatusSignal<Double> rollersVelocity;
  private final StatusSignal<Double> rollersAppliedVolts;
  private final StatusSignal<Double> rollersCurrent;
  private final StatusSignal<Double> rollersTemperature;

  private final Alert rollersDisconnectedAlert =
      new Alert("Rollers Talon is disconnected, check CAN bus.", AlertType.ERROR);

  public IntakeIOTalonFX() {
    rollersTalon = new TalonFX(IntakeConstants.DEVICE_ID);
    solenoid = new Solenoid(PneumaticsModuleType.CTREPCM, IntakeConstants.SOLENOID_CHANNEL);

    var config = new TalonFXConfiguration();
    config.CurrentLimits.SupplyCurrentLimit = IntakeConstants.SUPPLY_CURRENT_LIMIT;
    config.CurrentLimits.SupplyCurrentLimitEnable = true;
    config.MotorOutput.Inverted = InvertedValue.Clockwise_Positive;
    config.Audio.AllowMusicDurDisable = true;
    config.Audio.BeepOnBoot = false;
    config.Audio.BeepOnConfig = false;

    rollersTalon.getConfigurator().apply(config);

    rollersPosition = rollersTalon.getPosition();
    rollersVelocity = rollersTalon.getVelocity();
    rollersAppliedVolts = rollersTalon.getMotorVoltage();
    rollersCurrent = rollersTalon.getSupplyCurrent();
    rollersTemperature = rollersTalon.getDeviceTemp();

    BaseStatusSignal.setUpdateFrequencyForAll(100.0, rollersVelocity);
    BaseStatusSignal.setUpdateFrequencyForAll(
        50.0, rollersPosition, rollersAppliedVolts, rollersCurrent, rollersTemperature);
    rollersTalon.optimizeBusUtilization();
  }

  @Override
  public void updateInputs(IntakeIOInputs inputs) {
    boolean rollersConnected =
        BaseStatusSignal.refreshAll(
                rollersVelocity,
                rollersPosition,
                rollersAppliedVolts,
                rollersCurrent,
                rollersTemperature)
            .isOK();
    rollersDisconnectedAlert.set(!rollersConnected);

    inputs.rollersPositionRad =
        Rotation2d.fromRadians(Units.rotationsToRadians(rollersPosition.getValueAsDouble()) / IntakeConstants.GEAR_RATIO);
    inputs.rollersVelocityRadPerSec =
        Units.rotationsToRadians(rollersVelocity.getValueAsDouble()) / IntakeConstants.GEAR_RATIO;
    inputs.rollersAppliedVolts = rollersAppliedVolts.getValueAsDouble();
    inputs.rollersCurrentAmps = rollersCurrent.getValueAsDouble();
    inputs.rollersTempCelcius = rollersTemperature.getValueAsDouble();

    inputs.leftPosition = solenoid.get();
  }

  @Override
  public void setRollersVoltage(double volts) {
    rollersTalon.setControl(new VoltageOut(volts));
  }

  @Override
  public void setIntakePosition(boolean position) {
    solenoid.set(position);
  }
}

```

## Simulated IO Implementations
IO implementations can also be physics simulators. Instead of having simulation code in the subsystem, an IO implementation can be written and instantiated when running the robot code in simulation.

ex. (Intake simulator IO implementation for FRC 190 2024 robot, Snapback)

```java
package frc.robot.subsystems.intake;

import edu.wpi.first.math.MathUtil;
import edu.wpi.first.math.geometry.Rotation2d;
import edu.wpi.first.wpilibj.simulation.DCMotorSim;
import frc.robot.Constants;

public class IntakeIOSim implements IntakeIO {
  private DCMotorSim motorSim =
      new DCMotorSim(
          IntakeConstants.MOTOR_CONFIG,
          IntakeConstants.GEAR_RATIO,
          IntakeConstants.MOMENT_OF_INERTIA);

  private double rollersAppliedVolts = 0.0;
  private boolean leftPosition = false;
  private boolean rightPosition = false;

  @Override
  public void updateInputs(IntakeIOInputs inputs) {
    motorSim.update(Constants.LOOP_PERIOD_SECS);

    inputs.rollersPositionRad = Rotation2d.fromRadians(motorSim.getAngularPositionRad());
    inputs.rollersVelocityRadPerSec = motorSim.getAngularVelocityRadPerSec();
    inputs.rollersAppliedVolts = rollersAppliedVolts;
    inputs.rollersCurrentAmps = Math.abs(motorSim.getCurrentDrawAmps());
    inputs.rollersTempCelcius = 0.0;

    inputs.leftPosition = leftPosition;
    inputs.rightPosition = rightPosition;
  }

  @Override
  public void setRollersVoltage(double volts) {
    rollersAppliedVolts = MathUtil.clamp(volts, -12.0, 12.0);
    motorSim.setInputVoltage(rollersAppliedVolts);
  }

  @Override
  public void setIntakePosition(boolean position) {
    leftPosition = position;
    rightPosition = position;
  }
}

```