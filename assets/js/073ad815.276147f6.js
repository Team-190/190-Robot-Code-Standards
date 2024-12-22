"use strict";(self.webpackChunkcode_standard=self.webpackChunkcode_standard||[]).push([[218],{1019:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>r,default:()=>u,frontMatter:()=>o,metadata:()=>s,toc:()=>d});const s=JSON.parse('{"id":"ADVANTAGEKIT_STANDARDS","title":"AdvantageKit Standards","description":"AdvantageKit is a powerful software library designed for FRC teams to assist with robot data collection, analysis, and debugging. It provides tools for logging and analyzing robot data, enabling teams to identify issues, refine control algorithms, and make data-driven improvements. For more details, see AdvantageKit documentation.","source":"@site/docs/ADVANTAGEKIT_STANDARDS.md","sourceDirName":".","slug":"/ADVANTAGEKIT_STANDARDS","permalink":"/190-Robot-Code-Standards/ADVANTAGEKIT_STANDARDS","draft":false,"unlisted":false,"tags":[],"version":"current","frontMatter":{},"sidebar":"tutorialSidebar","previous":{"title":"FRC Code Overview","permalink":"/190-Robot-Code-Standards/ROBOT_CODE_OVERVIEW"},"next":{"title":"Subsystem Standards","permalink":"/190-Robot-Code-Standards/SUBSYSTEM_STANDARDS"}}');var a=n(4848),i=n(8453);const o={},r="AdvantageKit Standards",l={},d=[{value:"IO Interfaces and Inputs",id:"io-interfaces-and-inputs",level:2},{value:"IO Implementations",id:"io-implementations",level:2},{value:"Simulated IO Implementations",id:"simulated-io-implementations",level:2},{value:"Examples",id:"examples",level:2}];function c(e){const t={a:"a",code:"code",h1:"h1",h2:"h2",header:"header",li:"li",p:"p",pre:"pre",ul:"ul",...(0,i.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(t.header,{children:(0,a.jsx)(t.h1,{id:"advantagekit-standards",children:"AdvantageKit Standards"})}),"\n",(0,a.jsxs)(t.p,{children:["AdvantageKit is a powerful software library designed for FRC teams to assist with robot data collection, analysis, and debugging. It provides tools for logging and analyzing robot data, enabling teams to identify issues, refine control algorithms, and make data-driven improvements. For more details, see ",(0,a.jsx)(t.a,{href:"https://docs.advantagekit.org/getting-started/what-is-advantagekit/",children:"AdvantageKit documentation"}),"."]}),"\n",(0,a.jsx)(t.h2,{id:"io-interfaces-and-inputs",children:"IO Interfaces and Inputs"}),"\n",(0,a.jsxs)(t.p,{children:["A subsystem's IO interface is what defines the inputs that are automatically logged for that subsystem. It is important to log any information that could be useful in ",(0,a.jsx)(t.a,{href:"https://docs.advantagekit.org/getting-started/what-is-advantagekit/",children:"Log Replay"}),", because any information that is not logged as an input can't be used to create new simulated outputs."]}),"\n",(0,a.jsx)(t.p,{children:"The fields that 190 logs in every subsystem's IO interface depends on the hardware used in that subsystem:"}),"\n",(0,a.jsxs)(t.ul,{children:["\n",(0,a.jsxs)(t.li,{children:["Motors:","\n",(0,a.jsxs)(t.ul,{children:["\n",(0,a.jsxs)(t.li,{children:["Position (",(0,a.jsx)(t.a,{href:"https://docs.wpilib.org/en/stable/docs/software/advanced-controls/geometry/transformations.html#rotation2d",children:"Rotation2d"}),")"]}),"\n",(0,a.jsx)(t.li,{children:"Velocity (Radians/Second)"}),"\n",(0,a.jsx)(t.li,{children:"Applied Voltage (Volts)"}),"\n",(0,a.jsx)(t.li,{children:"Supply Current (Amps)"}),"\n",(0,a.jsx)(t.li,{children:"Stator/Torque Current (Amps)"}),"\n",(0,a.jsx)(t.li,{children:"Temperature (Celsius)"}),"\n"]}),"\n"]}),"\n",(0,a.jsxs)(t.li,{children:["Pneumatic Actuators:","\n",(0,a.jsxs)(t.ul,{children:["\n",(0,a.jsx)(t.li,{children:"Position (boolean, true if extended, false if retracted)"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,a.jsx)(t.p,{children:"This is not a comprehensive list, rather a starting point for input logging that will be sufficient for most subsystems."}),"\n",(0,a.jsxs)(t.p,{children:["Every IO interface must have a static Inputs class where all the inputs are defined and instantiated with default values. The ",(0,a.jsx)(t.code,{children:"@AutoLog"})," annotation must be used to tell the robot code that the fields in the inputs class are to be logged. Every IO interface must also have a default ",(0,a.jsx)(t.code,{children:"updateInputs"})," method, updates the inputs for the subsystem every loop cycle."]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-java",children:"...\n\npublic interface IO {\n  @AutoLog\n  public static class IOInputs {\n    public Rotation2d position = new Rotation2d();\n    public double velocityRadiansPerSecond = 0.0;\n    public double appliedVolts = 0.0;\n    public double supplyCurrentAmps = 0.0;\n    public double statorCurrentAmps = 0.0;\n    public double temperatureCelsius = 0.0;\n\n    public boolean pneumaticPosition = Value.kOff;\n  }\n\n  public default void updateInputs(IOInputs inputs) {}\n...\n"})}),"\n",(0,a.jsx)(t.h2,{id:"io-implementations",children:"IO Implementations"}),"\n",(0,a.jsx)(t.p,{children:"In FRC, it is often useful to abstract a subsystem's hardware away from its logic. This is useful for running multiple robots with different hardware using the same code. For example, a practice robot may be running one type of motor, whereas the competition robot may run a different type of motor. In order to run the same code on both robots, hardware abstraction is used to keep the logic the same for both robots, while switching between hardware. This is done through the use of IO implementations."}),"\n",(0,a.jsx)(t.p,{children:"IO implementations are where actual hardware behaviors are defined. Each IO implementation must:"}),"\n",(0,a.jsxs)(t.ul,{children:["\n",(0,a.jsx)(t.li,{children:"Implement its subsystem IO interface."}),"\n",(0,a.jsxs)(t.li,{children:["Override ",(0,a.jsx)(t.code,{children:"updateInputs()"})," for specific hardware updates."]}),"\n",(0,a.jsx)(t.li,{children:"Implement hardware specific actuation, using vendor libraries."}),"\n"]}),"\n",(0,a.jsx)(t.h2,{id:"simulated-io-implementations",children:"Simulated IO Implementations"}),"\n",(0,a.jsx)(t.p,{children:"IO implementations can also be physics simulators. Instead of having simulation code in the subsystem, an IO implementation can be written and instantiated when running the robot code in simulation."}),"\n",(0,a.jsx)(t.h2,{id:"examples",children:"Examples"}),"\n",(0,a.jsxs)(t.p,{children:["Simple Example: ",(0,a.jsx)(t.a,{href:"https://github.com/Team-190/2k24-Robot-Code/blob/snaplash/src/main/java/frc/robot/subsystems/whiplash/intake",children:"Whiplash's Intake Subsystem"})]}),"\n",(0,a.jsxs)(t.p,{children:["Complex Example: ",(0,a.jsx)(t.a,{href:"https://github.com/Team-190/2k24-Robot-Code/blob/snaplash/src/main/java/frc/robot/subsystems/whiplash/arm",children:"Whiplash's Arm Subsystem"})]})]})}function u(e={}){const{wrapper:t}={...(0,i.R)(),...e.components};return t?(0,a.jsx)(t,{...e,children:(0,a.jsx)(c,{...e})}):c(e)}},8453:(e,t,n)=>{n.d(t,{R:()=>o,x:()=>r});var s=n(6540);const a={},i=s.createContext(a);function o(e){const t=s.useContext(i);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function r(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:o(e.components),s.createElement(i.Provider,{value:t},e.children)}}}]);