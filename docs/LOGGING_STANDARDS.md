# Logger Standards

## Recording Outputs
Any values that need to be published over [NetworkTables](https://docs.wpilib.org/en/stable/docs/software/networktables/networktables-intro.html) for viewing on [Shuffleboard](https://docs.wpilib.org/en/stable/docs/software/dashboards/shuffleboard/index.html) or other [WPIlib](https://github.com/wpilibsuite/allwpilib) tools, should be published through the [AdvantageKit Logger](https://github.com/Mechanical-Advantage/AdvantageKit/blob/main/docs/RECORDING-OUTPUTS.md).

### Formatting
The keys for each recorded output should be:

* Descriptive
* Gramatically correct
* Uppercase

Each recorded output has a subsystem associated with it. [NetworkTables](https://docs.wpilib.org/en/stable/docs/software/networktables/networktables-intro.html) differentiates values into sections with a ```/```. For each output, before the name of the output's key, goes the subsystem name.

Example:
```java
Logger.recordOutput("Intake/Has Game Piece", sensor.get());
```

## Tunable Numbers
Tunable numbers are the way that 190 tunes constants without having to re-deploy code. Because tunable numbers are just tunable constants, they should be located in their respective subsystem's constants file. Tunable numbers follow the same formatting guidelines as recorded outputs:

Example:
```java
public static final LoggedTunableNumber A_TUNABLE_CONSTANT = new LoggedTunableNumber("Subsystem/A Tunable Constant", 0.0);
```

Tunable numbers can be tuned over NetworkTables when the ```TUNING_MODE``` variable in ```Constants.java``` is set to true.