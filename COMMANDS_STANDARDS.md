# Command Standards
This section provides standards that govern the Commands and autonomous routines in robot projects.

## Subsystem Commands
In order for a subsystem to be useful, they must be told to do something, this is what commands are for. Subsystems tell the actuators how to do something (ex. run at a voltage, follow a motion profile, account for feedback, etc.) while commands tell the robot when execute those tasks.

Simple commands that only require one subsystem are located in that subsystem.

ex. (Shooter command to run flywheels at set velocity on FRC 190 2024 robot, Snapback)

```java
public Command runVelocity() {
    return runEnd(
        () -> {
          setSpinVelocity(ShooterConstants.DEFAULT_SPEED.get());
        },
        () -> {
          stop();
        });
  }
```

These commands can be used in other places in the robot code by referencing the subsystem.

ex.
```java
shooter.runVelocity();
```

## Subsystem Command Exceptions
In long and complicated subsystems that have a lot of logic, it can be useful to separate commands into a different class to improve code readibility.

ex. ([DriveCommands.java](https://github.com/Team-190/2k24-Robot-Code/blob/main/src/main/java/frc/robot/commands/DriveCommands.java) from FRC 190 2024 robot, Snapback)

## Composite Commands
Composite commands are commands that are made up of more than one pre-defined command. They always take the form of a static factory. In general, composite commands should never be their own classes. [WPIlib](https://github.com/wpilibsuite/allwpilib) has excellent documentation on [Command Composition](https://docs.wpilib.org/en/stable/docs/software/commandbased/command-compositions.html) as well as [Command Decorators](https://docs.wpilib.org/en/2020/docs/software/commandbased/convenience-features.html) which are much more intuitive and concise.

It is generally best to write commands as compositions rather than string commands together with decorators.

ex.

```java
public static final Command getCollectCommand(Intake intake, Serializer serializer) {
    return Commands.sequence(
        intake.deployIntake(),
        Commands.race(intake.runVoltage(), serializer.intake()),
        intake.retractIntake());
}
```
instead of 

```java
public static final Command getCollectCommand(Intake intake, Serializer serializer) {
    return
        intake.deployIntake()
        .andThen(Commands.race(intake.runVoltage(), serializer.intake()))
        .andThen(intake.retractIntake());
}
```

Composite commands reside in their own class called ```CompositeCommands.java```.

ex. ([```CompositeCommands.java```](https://github.com/Team-190/2k24-Robot-Code/blob/main/src/main/java/frc/robot/commands/CompositeCommands.java) from FRC 190 2024 robot, Snapback)

## Autonomous Routines
Autonomous routines are simply composite command that are called during autonomous. Autonomous paths are loaded into the roborio when the code is deployed, and called during the autonomous period. We can follow a path using its path on the roborio.

ex. (Center Two Piece autonomous routine from FRC 190 2024 robot, Snapback)

```java
private static final Command centerTwoPiece(
      Drive drive, Intake intake, Serializer serializer, Kicker kicker, TrackingMode targetType) {
    return Commands.sequence(
        AutoBuilder.followPath(PathPlannerPath.fromPathFile("deploy/paths/Center to Center Wing Note")),
        CompositeCommands.getAimSpeakerCommand(drive),
        CompositeCommands.getShootCommand(intake, serializer, kicker),
        CompositeCommands.getTrackNoteSpikeCommand(
            drive, intake, serializer, AutoPathPoints.NOTE_2, targetType),
        CompositeCommands.getAimSpeakerCommand(drive),
        CompositeCommands.getShootCommand(intake, serializer, kicker));
      }
```