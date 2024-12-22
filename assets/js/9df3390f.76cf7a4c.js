"use strict";(self.webpackChunkcode_standard=self.webpackChunkcode_standard||[]).push([[439],{1860:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>d,contentTitle:()=>l,default:()=>h,frontMatter:()=>r,metadata:()=>i,toc:()=>c});const i=JSON.parse('{"id":"GLOBAL_STANDARDS","title":"Global Standards","description":"Global Dependencies","source":"@site/docs/GLOBAL_STANDARDS.md","sourceDirName":".","slug":"/GLOBAL_STANDARDS","permalink":"/190-Robot-Code-Standards/GLOBAL_STANDARDS","draft":false,"unlisted":false,"tags":[],"version":"current","frontMatter":{},"sidebar":"tutorialSidebar","previous":{"title":"FRC 190 Code Standards","permalink":"/190-Robot-Code-Standards/"},"next":{"title":"FRC Code Overview","permalink":"/190-Robot-Code-Standards/ROBOT_CODE_OVERVIEW"}}');var t=s(4848),a=s(8453);const r={},l="Global Standards",d={},c=[{value:"Global Dependencies",id:"global-dependencies",level:2},{value:"Classes",id:"classes",level:2},{value:"Naming Conventions",id:"naming-conventions",level:3},{value:"Object Instantiation",id:"object-instantiation",level:3},{value:"Modifiers",id:"modifiers",level:3},{value:"Default Units",id:"default-units",level:2}];function o(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,a.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.header,{children:(0,t.jsx)(n.h1,{id:"global-standards",children:"Global Standards"})}),"\n",(0,t.jsx)(n.h2,{id:"global-dependencies",children:"Global Dependencies"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.a,{href:"https://github.com/wpilibsuite/allwpilib",children:"WPIlib"})," is the framework that teams use to write code for FRC robots."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.a,{href:"https://github.com/Mechanical-Advantage/AdvantageKit",children:"AdvantageKit"})," is a logging framework created by ",(0,t.jsx)(n.a,{href:"https://www.thebluealliance.com/team/6328/",children:"FRC team 6328"})," which has been released for public use."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.a,{href:"https://github.com/lessthanoptimal/gversion-plugin",children:"Gversion"})," is an ",(0,t.jsx)(n.a,{href:"https://github.com/Mechanical-Advantage/AdvantageKit",children:"AdvantageKit"})," dependency that creates the [",(0,t.jsx)(n.code,{children:"BuildConstants.java"}),"] file which is important for log replay."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.a,{href:"https://projectlombok.org/",children:"Lombok"})," is an annotation based java library that helps reduce boilerplate code by automatically generating getters, setters, etc."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.a,{href:"https://github.com/diffplug/spotless",children:"Spotless"})," is a code formatter that automatically formats the entire project when compiled."]}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["These dependencies should be present in the ",(0,t.jsx)(n.code,{children:"build.gradle"})," file in each robot project."]}),"\n",(0,t.jsx)(n.h2,{id:"classes",children:"Classes"}),"\n",(0,t.jsx)(n.h3,{id:"naming-conventions",children:"Naming Conventions"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Classes and Enumerations should follow PascalCase."}),"\n",(0,t.jsx)(n.li,{children:"Variables should follow camelCase."}),"\n",(0,t.jsx)(n.li,{children:"Constants should follow SNAKE_CASE."}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"object-instantiation",children:"Object Instantiation"}),"\n",(0,t.jsx)(n.p,{children:"Objects should be declared and instantiated separately. Static variables should be instantiated in static blocks, while all other variables should be instantiated in a constructor, regardless of reliance on parameters:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-java",children:"...\n\npublic class AClass {\n\n  public static int variable1;\n  private int variable2;\n  private int variable3;\n\n  static {\n    variable1 = 42;\n  }\n\n  public AClass(variable3) {\n    this.variable2 = 17;\n    this.variable3 = variable3;\n  }\n\n  ...\n}\n"})}),"\n",(0,t.jsx)(n.h3,{id:"modifiers",children:"Modifiers"}),"\n",(0,t.jsxs)(n.p,{children:["Member variables should always be private with ",(0,t.jsx)(n.code,{children:"@Getter"}),"/",(0,t.jsx)(n.code,{children:"@Setter"})," annotations if they require getters and/or setters. Static variables should always come before non-static variables"]}),"\n",(0,t.jsxs)(n.p,{children:["Constants should always have the ",(0,t.jsx)(n.code,{children:"public static final"})," modifiers."]}),"\n",(0,t.jsx)(n.h2,{id:"default-units",children:"Default Units"}),"\n",(0,t.jsx)(n.p,{children:"190 uses these default units for all robot code:"}),"\n",(0,t.jsxs)(n.table,{children:[(0,t.jsx)(n.thead,{children:(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.th,{children:"Measurement"}),(0,t.jsx)(n.th,{children:"Unit"})]})}),(0,t.jsxs)(n.tbody,{children:[(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:"Linear Position"}),(0,t.jsx)(n.td,{children:"Meters"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:"Linear Velocity"}),(0,t.jsx)(n.td,{children:"Meters per Second"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:"Linear Acceleration"}),(0,t.jsx)(n.td,{children:"Meters per Second Squared"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:"Angluar Position"}),(0,t.jsx)(n.td,{children:"Radians"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:"Angular Velocity"}),(0,t.jsx)(n.td,{children:"Radians per Second"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:"Angular Acceleration"}),(0,t.jsx)(n.td,{children:"Radians per Second Squared"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:"Mass"}),(0,t.jsx)(n.td,{children:"Kilograms"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:"Moment of Inertia"}),(0,t.jsx)(n.td,{children:"Kilogram Meters Squared"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:"Force"}),(0,t.jsx)(n.td,{children:"Netwons"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:"Torque/Moment"}),(0,t.jsx)(n.td,{children:"Newton Meters"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:"Voltage"}),(0,t.jsx)(n.td,{children:"Volts"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:"Current"}),(0,t.jsx)(n.td,{children:"Amps"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:"Temperature"}),(0,t.jsx)(n.td,{children:"Celcius"})]})]})]}),"\n",(0,t.jsx)(n.p,{children:"190 uses radians per second for the following reasons:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.strong,{children:"Consistency with Trigonometric Functions"})}),"\n",(0,t.jsx)(n.p,{children:"Radians are a natural unit of measurement when dealing with trigonometric functions such as sine and cosine. In calculus and physics, many formulas and equations involving angles are expressed in terms of radians. Using radians per second for angular velocity maintains consistency with these mathematical principles."}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.strong,{children:"Uniformity in Physics Equations"})}),"\n",(0,t.jsx)(n.p,{children:"In many physics equations, angular velocity appears alongside other quantities such as angular acceleration, torque, and moment of inertia. When using radians per second, these equations become simpler and more elegant, avoiding the need for conversion factors or adjustments."}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.strong,{children:"Precision and Accuracy"})}),"\n",(0,t.jsx)(n.p,{children:"Radians per second offer higher precision and accuracy compared to RPM, especially when dealing with small angles or high-speed rotations. Since radians are based on the ratio of the arc length to the radius of a circle, they provide a more precise measure of angular displacement."}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"Overall, while RPM may be more intuitive in the context of FRC, radians per second are preferred in code due to their consistency, simplicity, and compatibility with mathematical principles."})]})}function h(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(o,{...e})}):o(e)}},8453:(e,n,s)=>{s.d(n,{R:()=>r,x:()=>l});var i=s(6540);const t={},a=i.createContext(t);function r(e){const n=i.useContext(a);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:r(e.components),i.createElement(a.Provider,{value:n},e.children)}}}]);