# Robot State Standards

The ```RobotState.java``` class is used for multiple things:
* Localization
* Global variable mutation
* Interpolation maps

Essentially, anything that is required by more than one subsystem, goes in ```RobotState.java```

## Constructing RobotState.java
One of the purposes of ```RobotState.java``` is to combine odometry and vision data to get a more accurate estimated robot pose. This is done by passing data into the ```RobotState.java``` periodic method:

Example:
```java
public static void periodic(
      Rotation2d robotHeading,
      long latestRobotHeadingTimestamp,
      double robotYawVelocity,
      Translation2d robotFieldRelativeVelocity,
      SwerveModulePosition[] modulePositions,
      Camera[] cameras,
      boolean hasNoteLocked,
      boolean hasNoteStaged,
      boolean isIntaking) {

    RobotState.robotHeading = robotHeading;
    RobotState.modulePositions = modulePositions;

    odometry.update(robotHeading, modulePositions);
    poseEstimator.updateWithTime(Timer.getFPGATimestamp(), robotHeading, modulePositions);

    for (Camera camera : cameras) {
      double[] limelightHeadingData = {
        robotHeading.minus(headingOffset).getDegrees(), 0.0, 0.0, 0.0, 0.0, 0.0
      };
      camera.getRobotHeadingPublisher().set(limelightHeadingData, latestRobotHeadingTimestamp);
    }
    NetworkTableInstance.getDefault().flush();
    for (Camera camera : cameras) {

      if (camera.getTargetAquired()
          && !GeometryUtil.isZero(camera.getPrimaryPose())
          && !GeometryUtil.isZero(camera.getSecondaryPose())
          && Math.abs(robotYawVelocity) <= Units.degreesToRadians(15.0)
          && Math.abs(robotFieldRelativeVelocity.getNorm()) <= 1.0) {
        double xyStddevPrimary =
            camera.getPrimaryXYStandardDeviationCoefficient()
                * Math.pow(camera.getAverageDistance(), 2.0)
                / camera.getTotalTargets()
                * camera.getHorizontalFOV();
        poseEstimator.addVisionMeasurement(
            camera.getPrimaryPose(),
            camera.getFrameTimestamp(),
            VecBuilder.fill(xyStddevPrimary, xyStddevPrimary, Double.POSITIVE_INFINITY));
        if (camera.getTotalTargets() > 1) {
          double xyStddevSecondary =
              camera.getSecondaryXYStandardDeviationCoefficient()
                  * Math.pow(camera.getAverageDistance(), 2.0)
                  / camera.getTotalTargets()
                  * camera.getHorizontalFOV();
          poseEstimator.addVisionMeasurement(
              camera.getSecondaryPose(),
              camera.getFrameTimestamp(),
              VecBuilder.fill(xyStddevSecondary, xyStddevSecondary, Double.POSITIVE_INFINITY));
        }
      }
    }


    ...
```

```periodic()``` should be called in ```RobotContainer.java``` just before the button bindings are configured:

Example:

```java
...

public void robotPeriodic() {
    RobotState.periodic(
        drive.getRawGyroRotation(),
        NetworkTablesJNI.now(),
        drive.getYawVelocity(),
        drive.getFieldRelativeVelocity(),
        drive.getModulePositions(),
        vision.getCameras(),
        false,
        false,
        false);

        ...
}

...
```
## Interpolation Maps and Shot Compensation
For shooting games, interpolating hoods and flywheels are very important to dynamically adjust the robot's shot. This is all done in ```RobotState.java```.

All interpolation map values are added in a static block:

Example:
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

Example:
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
Periodically on the robot, the ```RobotState.java``` class takes all the information in from its suppliers, and calculates everything the robot needs to know. For example, in a shooting game:
* Hood Angle
* Flywheel Speed
* Effective Aiming Pose (for shooting on the move)

This data is calculated, and stored in a record called ```ControlData```:

Example: ControlData record for FRC 190 2024 robots
```java
public static record ControlData(
      Rotation2d speakerRobotAngle,
      double speakerRadialVelocity,
      Rotation2d speakerArmAngle,
      FlywheelSpeeds speakerShotSpeed,
      double ampRadialVelocity,
      Rotation2d feedRobotAngle,
      double feedRadialVelocity,
      Rotation2d feedArmAngle,
      FlywheelSpeeds feedShotSpeed,
      boolean hasNoteLocked,
      boolean hasNoteStaged,
      boolean isIntaking) {}
```

```RobotState.java``` contains an instance of ```ControlData``` as a member variable, which is updated in the periodic method, along with the pose estimator:

Example: ControlData update for FRC 190 2024 robots
```java
Translation2d speakerPose =
        AllianceFlipUtil.apply(FieldConstants.Speaker.centerSpeakerOpening.toTranslation2d());
    double distanceToSpeaker =
        poseEstimator.getEstimatedPosition().getTranslation().getDistance(speakerPose);
    Translation2d effectiveSpeakerAimingTranslation =
        poseEstimator
            .getEstimatedPosition()
            .getTranslation()
            .plus(robotFieldRelativeVelocity.times(timeOfFlightMap.get(distanceToSpeaker)));
    double effectiveDistanceToSpeaker = effectiveSpeakerAimingTranslation.getDistance(speakerPose);

    Translation2d ampPose = AllianceFlipUtil.apply(FieldConstants.ampCenter);
    double distanceToAmp =
        poseEstimator.getEstimatedPosition().getTranslation().getDistance(ampPose);
    Translation2d effectiveAmpAimingTranslation =
        poseEstimator
            .getEstimatedPosition()
            .getTranslation()
            .plus(robotFieldRelativeVelocity.times(timeOfFlightMap.get(distanceToAmp)));
    double effectiveDistanceToAmp = effectiveAmpAimingTranslation.getDistance(ampPose);

    Rotation2d speakerRobotAngle =
        speakerPose
            .minus(effectiveSpeakerAimingTranslation)
            .getAngle()
            .minus(Rotation2d.fromDegrees(180.0 + 3.5));
    double speakerTangentialVelocity =
        -robotFieldRelativeVelocity.rotateBy(speakerRobotAngle.unaryMinus()).getY();
    double speakerRadialVelocity = speakerTangentialVelocity / effectiveDistanceToSpeaker;

    Rotation2d ampRobotAngle =
        ampPose.minus(effectiveAmpAimingTranslation).getAngle().minus(Rotation2d.fromDegrees(90.0));
    double ampTangentialVelocity =
        -robotFieldRelativeVelocity.rotateBy(ampRobotAngle.unaryMinus()).getY();
    double ampRadialVelocity = ampTangentialVelocity / effectiveDistanceToAmp;

    Rotation2d feedRobotAngle =
        ampPose
            .minus(effectiveAmpAimingTranslation)
            .getAngle()
            .minus(Rotation2d.fromDegrees(180.0));
    double feedTangentialVelocity =
        -robotFieldRelativeVelocity.rotateBy(feedRobotAngle.unaryMinus()).getY();
    double feedRadialVelocity = feedTangentialVelocity / effectiveDistanceToAmp;

    controlData =
        new ControlData(
            speakerRobotAngle,
            speakerRadialVelocity,
            new Rotation2d(speakerShotAngleMap.get(effectiveDistanceToSpeaker)),
            speakerShotSpeedMap.get(effectiveDistanceToSpeaker),
            ampRadialVelocity,
            feedRobotAngle,
            feedRadialVelocity,
            new Rotation2d(feedShotAngleMap.get(effectiveDistanceToAmp)),
            feedShotSpeedMap.get(effectiveDistanceToAmp),
            hasNoteLocked,
            hasNoteStaged,
            isIntaking);

    Logger.recordOutput(
        "RobotState/Pose Data/Estimated Pose", poseEstimator.getEstimatedPosition());
    Logger.recordOutput("RobotState/Pose Data/Odometry Pose", odometry.getPoseMeters());
    Logger.recordOutput("RobotState/Pose Data/Heading Offset", headingOffset);
    Logger.recordOutput(
        "RobotState/Pose Data/Effective Speaker Aiming Pose",
        new Pose2d(effectiveSpeakerAimingTranslation, speakerRobotAngle));
    Logger.recordOutput(
        "RobotState/Pose Data/Effective Amp Aiming Pose",
        new Pose2d(effectiveAmpAimingTranslation, ampRobotAngle));
    Logger.recordOutput(
        "RobotState/Pose Data/Effective Feed Aiming Pose",
        new Pose2d(effectiveAmpAimingTranslation, feedRobotAngle));
    Logger.recordOutput(
        "RobotState/Pose Data/Effective Distance To Speaker", effectiveDistanceToSpeaker);
    Logger.recordOutput("RobotState/Pose Data/Effective Distance To Amp", effectiveDistanceToAmp);

    Logger.recordOutput(
        "RobotState/Control Data/Speaker Robot Angle", controlData.speakerRobotAngle());
    Logger.recordOutput("RobotState/Control Data/Speaker Arm Angle", controlData.speakerArmAngle());
    Logger.recordOutput(
        "RobotState/Control Data/Speaker Radial Velocity", controlData.speakerRadialVelocity());
    Logger.recordOutput(
        "RobotState/Control Data/Amp Radial Velocity", controlData.ampRadialVelocity());
    Logger.recordOutput("RobotState/Control Data/Feed Robot Angle", controlData.feedRobotAngle());
    Logger.recordOutput(
        "RobotState/Control Data/Feed Radial Velocity", controlData.feedRadialVelocity());
    Logger.recordOutput("RobotState/Control Data/Feed Arm Angle", controlData.feedArmAngle());
  }
```

## Example

See [Snapback and Whiplash RobotState](https://github.com/Team-190/2k24-Robot-Code/blob/main/src/main/java/frc/robot/RobotState.java)