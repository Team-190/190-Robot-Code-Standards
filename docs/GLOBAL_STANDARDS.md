# Global Standards

## Global Dependencies
* [WPIlib](https://github.com/wpilibsuite/allwpilib) is the framework that teams use to write code for FRC robots.
* [AdvantageKit](https://github.com/Mechanical-Advantage/AdvantageKit) is a logging framework created by [FRC team 6328](https://www.thebluealliance.com/team/6328/) which has been released for public use.
* [Gversion](https://github.com/lessthanoptimal/gversion-plugin) is an [AdvantageKit](https://github.com/Mechanical-Advantage/AdvantageKit) dependency that creates the [```BuildConstants.java```] file which is important for log replay.
* [Lombok](https://projectlombok.org/) is an annotation based java library that helps reduce boilerplate code by automatically generating getters, setters, etc.
* [Spotless](https://github.com/diffplug/spotless) is a code formatter that automatically formats the entire project when compiled.

These dependencies should be present in the ```build.gradle``` file in each robot project.

## Classes
### Naming Conventions
* Classes and Enumerations should follow PascalCase.
* Variables should follow camelCase.
* Constants should follow SNAKE_CASE.

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

190 uses radians per second for the following reasons:

* **Consistency with Trigonometric Functions**

  Radians are a natural unit of measurement when dealing with trigonometric functions such as sine and cosine. In calculus and physics, many formulas and equations involving angles are expressed in terms of radians. Using radians per second for angular velocity maintains consistency with these mathematical principles.

* **Uniformity in Physics Equations**
  
  In many physics equations, angular velocity appears alongside other quantities such as angular acceleration, torque, and moment of inertia. When using radians per second, these equations become simpler and more elegant, avoiding the need for conversion factors or adjustments.

* **Precision and Accuracy**
  
  Radians per second offer higher precision and accuracy compared to RPM, especially when dealing with small angles or high-speed rotations. Since radians are based on the ratio of the arc length to the radius of a circle, they provide a more precise measure of angular displacement.

Overall, while RPM may be more intuitive in the context of FRC, radians per second are preferred in code due to their consistency, simplicity, and compatibility with mathematical principles.
