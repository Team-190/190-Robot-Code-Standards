# Robot State Standards
This section provides standards that govern elements of the robot code that pertain to more than one subsystem.

The ```RobotState.java``` class is used for multiple things:
* Pose Estimation
* Interpolation Maps
* Shot Compensation

## Constructing RobotState.java
One of the purposes of ```RobotState.java``` is to combine odometry and vision data to get a more accurate estimated robot pose. This is done by passing suppliers into the ```RobotState.java``` constructor:

ex. (```RobotState.java``` constructor from FRC 190 2024 robot, Snapback)

```java
public RobotState(
      Supplier<Rotation2d> robotHeadingSupplier,
      Supplier<Translation2d> robotFieldRelativeVelocitySupplier,
      Supplier<SwerveModulePosition[]> modulePositionSupplier,
      Supplier<CameraType[]> camerasSupplier,
      Supplier<Pose3d[]> visionPrimaryPosesSupplier,
      Supplier<Pose3d[]> visionSecondaryPosesSupplier,
      Supplier<double[]> visionPrimaryPoseTimestampsSupplier,
      Supplier<double[]> visionSecondaryPoseTimestampsSupplier) {
    RobotState.robotHeadingSupplier = robotHeadingSupplier;
    RobotState.robotFieldRelativeVelocitySupplier = robotFieldRelativeVelocitySupplier;
    RobotState.modulePositionSupplier = modulePositionSupplier;
    RobotState.camerasSupplier = camerasSupplier;
    RobotState.visionPrimaryPosesSupplier = visionPrimaryPosesSupplier;
    RobotState.visionSecondaryPosesSupplier = visionSecondaryPosesSupplier;
    RobotState.visionPrimaryPoseTimestampsSupplier = visionPrimaryPoseTimestampsSupplier;
    RobotState.visionSecondaryPoseTimestampsSupplier = visionSecondaryPoseTimestampsSupplier;

    poseEstimator =
        new SwerveDrivePoseEstimator(
            DriveConstants.KINEMATICS,
            robotHeadingSupplier.get(),
            modulePositionSupplier.get(),
            new Pose2d(),
            DriveConstants.ODOMETRY_STANDARD_DEVIATIONS,
            VisionConstants.DEFAULT_STANDARD_DEVIATIONS);
  }
```

The constructor should be called in ```RobotContainer.java``` just before the button bindings are configured:

ex. (```RobotState.java``` construction in ```RobotContainer.java``` for FRC 190 2024 robot, Snapback)

```java
// ...

// Configure RobotState
    new RobotState(
        drive::getRotation,
        drive::getModulePositions,
        vision::getCameraTypes,
        vision::getPrimaryVisionPoses,
        vision::getSecondaryVisionPoses,
        vision::getPrimaryPoseTimestamps,
        vision::getSecondaryPoseTimestamps);

    // Configure the button bindings
    configureButtonBindings();

// ...
```
## Interpolation Maps and Shot Compensation
For shooting games, interpolating hoods and flywheels are very important to dynamically adjust the robot's shot. This is all done in ```RobotState.java```.

All interpolation map values are added in a static block:

ex. (Interpolation maps from FRC 190 robot, Snapback)
```java
static {
    // Units: radians per second
    shooterSpeedMap.put(2.16, 800.0);
    shooterSpeedMap.put(2.45, 800.0);
    shooterSpeedMap.put(2.69, 800.0);
    shooterAngleMap.put(2.84, 800.0);
    shooterSpeedMap.put(3.19, 800.0);
    shooterSpeedMap.put(3.52, 800.0);
    shooterSpeedMap.put(3.85, 900.0);
    shooterSpeedMap.put(4.29, 900.0);

    // Units: radians
    shooterAngleMap.put(2.16, 0.05);
    shooterAngleMap.put(2.45, 0.05);
    shooterAngleMap.put(2.69, 0.16);
    shooterAngleMap.put(2.84, 0.32);
    shooterAngleMap.put(3.19, 0.39);
    shooterAngleMap.put(3.52, 0.45);
    shooterAngleMap.put(3.85, 0.44);
    shooterAngleMap.put(4.29, 0.45);

    // Units: seconds
    timeOfFlightMap.put(2.50, (4.42 - 4.24));
    timeOfFlightMap.put(2.75, (2.56 - 2.33));
    timeOfFlightMap.put(3.00, (3.43 - 3.18));
    timeOfFlightMap.put(3.25, (3.20 - 2.94));
    timeOfFlightMap.put(3.50, (2.64 - 2.42));
    timeOfFlightMap.put(4.0, (2.60 - 2.32));
}
```

Because of the 1/2" field tolerance, each FRC field can be different, therefore it is paramount that there be a method for adjusting shots on the fly.

ex. (Shot compensation for FRC 190 2024 robot, Snapback)

```java
@Getter @Setter private static double flywheelOffset = 0.0;
@Getter @Setter private static double hoodOffset = 0.0;
```

The variables can then be changed using a Command in ```CompositeCommands.java```:
```java
public static Command increaseFlywheelVelocity() {
    return Commands.runOnce(() -> RobotState.setFlywheelOffset(RobotState.getFlywheelOffset() + 10));
  }

public static Command decreaseFlywheelVelocity() {
    return Commands.runOnce(() -> RobotState.setFlywheelOffset(RobotState.getFlywheelOffset() - 10));
}

public static Command increaseHoodAngle() {
    return Commands.runOnce(() -> RobotState.setHoodOffset(RobotState.getHoodOffset() + Units.degreesToRadians(0.25)));
}

public static Command decreaseHoodAngle() {
    return Commands.runOnce(() -> RobotState.setHoodOffset(RobotState.getHoodOffset() - Units.degreesToRadians(0.25)));
}
```

And bound to a button in ```RobotContainer.java```:
```java
operator.y().whileTrue(CompositeCommands.increaseFlywheelVelocity());
operator.a().whileTrue(CompositeCommands.decreaseFlywheelVelocity());
operator.leftBumper().onTrue(CompositeCommands.decreaseHoodAngle());
operator.leftTrigger().onTrue(CompositeCommands.increaseHoodAngle());
```

## Periodic Pose Estimation and ControlData
Periodically on the robot, the ```RobotState.java``` class takes all the information in from its suppliers, and calculates everything the robot needs to know. For example:
* Hood Angle
* Flywheel Speed
* Effective Aiming Pose (for shooting on the move)

This data is calculated, and stored in a record called ```ControlData```:

ex. (```ControlData``` from FRC 190 2024 robot, Snapback)
```java
public static record ControlData(
      Rotation2d robotAngle,
      double radialVelocity,
      double shooterSpeed,
      Rotation2d shooterAngle) {}
```

```RobotState.java``` contains an instance of ```ControlData``` as a member variable, which is updated in the periodic method, along with the pose estimator:

```java
public static void periodic() {
    poseEstimator.updateWithTime(
        Timer.getFPGATimestamp(), robotHeadingSupplier.get(), modulePositionSupplier.get());
    for (int i = 0; i < visionPrimaryPosesSupplier.get().length; i++) {
      poseEstimator.addVisionMeasurement(
          visionPrimaryPosesSupplier.get()[i].toPose2d(),
          visionPrimaryPoseTimestampsSupplier.get()[i],
          camerasSupplier.get()[i].primaryStandardDeviations);
    }
    if (!secondaryPosesNullAlert.isActive()) {
      try {
        for (int i = 0; i < visionSecondaryPosesSupplier.get().length; i++) {
          poseEstimator.addVisionMeasurement(
              visionSecondaryPosesSupplier.get()[i].toPose2d(),
              visionSecondaryPoseTimestampsSupplier.get()[i],
              camerasSupplier.get()[i].secondaryStandardDeviations);
        }
        secondaryPosesNullAlert.set(false);
      } catch (Exception e) {
        secondaryPosesNullAlert.set(true);
      }
    }

    Translation2d speakerPose =
        AllianceFlipUtil.apply(FieldConstants.Speaker.centerSpeakerOpening.toTranslation2d());
    double distanceToSpeaker =
        poseEstimator.getEstimatedPosition().getTranslation().getDistance(speakerPose);
    Translation2d effectiveAimingPose =
        poseEstimator
            .getEstimatedPosition()
            .getTranslation()
            .plus(
                robotFieldRelativeVelocitySupplier
                    .get()
                    .times(timeOfFlightMap.get(distanceToSpeaker)));
    double effectiveDistanceToSpeaker = effectiveAimingPose.getDistance(speakerPose);

    Rotation2d setpointAngle = speakerPose.minus(effectiveAimingPose).getAngle();
    double tangentialVelocity =
        -robotFieldRelativeVelocitySupplier.get().rotateBy(setpointAngle.unaryMinus()).getY();
    double radialVelocity = tangentialVelocity / effectiveDistanceToSpeaker;
    controlData =
        new ControlData(
            setpointAngle,
            radialVelocity,
            shooterSpeedMap.get(effectiveDistanceToSpeaker),
            new Rotation2d(shooterAngleMap.get(effectiveDistanceToSpeaker)));

    Logger.recordOutput("RobotState/Primary Poses", visionPrimaryPosesSupplier.get());
    Logger.recordOutput("RobotState/Secondary Pose", visionSecondaryPosesSupplier.get());
    Logger.recordOutput("RobotState/Estimated Pose", poseEstimator.getEstimatedPosition());
    Logger.recordOutput("RobotState/ControlData/Robot Angle Setpoint", setpointAngle);
    Logger.recordOutput(
        "RobotState/ControlData/Effective Distance to Speaker", effectiveDistanceToSpeaker);
    Logger.recordOutput(
        "RobotState/ControlData/Effective Aiming Pose",
        new Pose2d(effectiveAimingPose, new Rotation2d()));
  }
```
