# Global Standards

## Global Dependencies
* [WPIlib](https://github.com/wpilibsuite/allwpilib) is the framework that teams use to write code for FRC robots.
* [AdvantageKit](https://github.com/Mechanical-Advantage/AdvantageKit) is a logging framework created by [FRC team 6328](https://www.thebluealliance.com/team/6328/) which has been released for public use.
* [Gversion](https://github.com/lessthanoptimal/gversion-plugin) is an [AdvantageKit](https://github.com/Mechanical-Advantage/AdvantageKit) dependency that creates the ```BuildConstants.java``` file which is important for log replay.
* [Lombok](https://projectlombok.org/) is an annotation based java library that helps reduce boilerplate code by automatically generating getters, setters, etc.
* [Spotless](https://github.com/diffplug/spotless) is a code formatter that automatically formats the entire project when compiled.
* [GomeiLib](https://github.com/Team-190/GompeiLib) is a custom library developed by FRC 19 in an attempt to reduce the amount of rewritten code from year to year.

These dependencies should be present in the ```build.gradle``` file in each robot project.

## Data
### Naming Conventions
* Classes and Enumerations should follow PascalCase.
* Variables should follow camelCase.
* Constants should follow SNAKE_CASE.
* Variables should have any relevant unit in the name, for example ```intakeTemperatureCelcius```.

### Object Instantiation
Objects should be declared and instantiated separately. Static variables should be instantiated in static blocks, while all other variables should be instantiated in a constructor, regardless of reliance on parameters:

```java
...

public class AClass {

  public static int variable1;
  private int variable2;
  private int variable3;

  static {
    variable1 = 42;
  }

  public AClass(variable3) {
    this.variable2 = 17;
    this.variable3 = variable3;
  }

  ...
}
```

### Modifiers
Member variables should always be private with ```@Getter```/```@Setter``` annotations if they require getters and/or setters. Static variables should always come before non-static variables

Constants should always have the ```public static final``` modifiers.

## Default Units
190 uses these default units for all robot code:

Measurement | Unit
------------|------
|Linear Position|Meters|
|Linear Velocity|Meters per Second|
|Linear Acceleration|Meters per Second Squared|
|Angluar Position|Radians|
|Angular Velocity|Radians per Second|
|Angular Acceleration|Radians per Second Squared|
|Mass|Kilograms|
|Moment of Inertia|Kilogram Meters Squared|
|Force|Netwons|
|Torque/Moment|Newton Meters|
|Voltage|Volts|
|Current|Amps|
|Temperature|Celcius|