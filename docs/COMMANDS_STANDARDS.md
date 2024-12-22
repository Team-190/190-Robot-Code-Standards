# Command Standards

## Subsystem Commands
In order for a subsystem to be useful, they must be told to do something, this is what commands are for. Subsystems tell the actuators how to do something (ex. run at a voltage, follow a motion profile, account for feedback, etc.) while commands tell the robot to actually execute the tasks.

Simple commands that only require one subsystem are located in that subsystem.

Example: Running a motor at a velocity

```java
public Command runVelocity() {
    return runEnd(
        () -> {
          setSpinVelocity(SubsystemConstants.DEFAULT_SPEED.get());
        },
        () -> {
          setSpinVelocity(0.0);
        });
  }
```

These commands can be used in other places in the robot code by referencing the subsystem.

```java
subsystem.runVelocity();
```

## Subsystem Command Exceptions
In long and complicated subsystems that have a lot of logic, it can be useful to separate commands into a different class to improve code readibility.

Example: [DriveCommands.java](https://github.com/Team-190/2k24-Robot-Code/blob/main/src/main/java/frc/robot/commands/DriveCommands.java) from FRC 190 2024 robots

## Composite Commands
Composite commands are commands that are made up of more than one pre-defined command. They always take the form of a static factory. In general, composite commands should never be their own classes. [WPIlib](https://github.com/wpilibsuite/allwpilib) has excellent documentation on [Command Composition](https://docs.wpilib.org/en/stable/docs/software/commandbased/command-compositions.html) as well as [Command Decorators](https://docs.wpilib.org/en/2020/docs/software/commandbased/convenience-features.html) which are much more intuitive and concise.

It is generally best to write commands as compositions rather than string commands together with decorators.

Example:
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

Example: [CompositeCommands.java](https://github.com/Team-190/2k24-Robot-Code/blob/main/src/main/java/frc/robot/commands/CompositeCommands.java) from FRC 190 2024 robots

## Button Bindings and Triggers
Commands tell the robot to execute tasks, but in order for the robot code to schedule the command for execution, it needs to be bound to a [Trigger](https://docs.wpilib.org/en/stable/docs/software/commandbased/binding-commands-to-triggers.html). Triggers tell the robot which conditions need to be met to execute commands. Triggers are always instantiated in the ```configureButtonBindings()``` method of ```RobotContainer.java```.

Example: Shooting a game piece
```java
driver
        .rightBumper()
        .and(() -> RobotState.shooterReady(hood, shooter))
        .whileTrue(
            Commands.waitSeconds(0.25)
                .andThen(CompositeCommands.getShootCommand(intake, serializer, kicker)));
```

in this case, ```rightBumper()``` is the trigger representing the right bumper button on the driver's Xbox 360 controller. The ```.and()``` call adds another condition to the trigger. The ```.whileTrue()``` call means that the robot trigger will only run the command while the conditions of the trigger are met. This trigger made the robot only able to shoot when the driver pressed the right bumper and when the robot code reported the shooter was ready to fire.

It is worth noting that Triggers can be arbitrary by creating a new Trigger object and binding it to an event, which can then be passed into a command as a parameter.

Example: An arbitrary trigger
```java
Trigger arbitraryTrigger = new Trigger(limitSwitch::get)
```

However, this usually isn't necessary because required subsystems get passed into composite commands, meaning there usually isn't a reason to bind command to a trigger unless it's being bound to a button.

Arbitrary Triggers are most useful when a condition must be met across a wide number of commands.

Example: Shooting a game piece using a trigger.
```java
Trigger shooterReady = new Trigger(() -> RobotState.shooterReady(hood, shooter))

driver
        .rightBumper()
        .and(shooterReady)
        .whileTrue(
            Commands.waitSeconds(0.25)
                .andThen(CompositeCommands.getShootCommand(intake, serializer, kicker)));
```

## Autonomous Routines
Autonomous routines are simply composite command that are called during autonomous. Autonomous paths are loaded into the roborio when the code is deployed, and called during the autonomous period. We can follow a path using its path on the roborio.

Example: Center Two Piece autonomous routine from FRC 190 2024 robots

```java
public static final Command centerTwoPiece(
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

:::danger
This autonomous routine may not be correct, as it uses Pathplanner rather than Choreo, if using this as a reference, do not use the ```AutoBuilder``` class if not using Pathplanner.
:::