# Cattract

Animate anything just like it was attracted by the cursor

## Demo

Demo on the [github page](https://yoannchb-pro.github.io/cattract/index.html)

## Install

For nodejs

```
$ npm i @yoannchb/cattract
```

Or with the cdn

```html
<script src="https://unpkg.com/@yoannchb/cattract@1.0.0/dist/index.js"></script>
```

## Import

```ts
import Cattract from "cattract";
//Or
const Cattract = require("cattract");
```

## Api

```ts
const animation = new Cattract(document.querySelector("#button"));
```

Or with specified options

```ts
const animation = new Cattract(document.querySelector("#button"), {
  //options you need
});
```

## Method

- `animation.stop()` stop the animation
- `animation.start()` Start the animation after a stop
- `animation.reset()` Reset the target style
- `animation.debug(color: string = "#e1e1e130")` Create two circle around the target to see the `elementRadius` and `detectionRadius`

## Options

```ts
type With3dOptions = {
  axe?: "x" | "y";
  inverted?: boolean | "x" | "y";
  maxAngle?: number;
  perspective?: number;
};

type Options = {
  elementRadius?: number;
  detectionRadius?: number | "full";
  animation?: {
    ease?: string;
    duration?: number;
  };
  scale?: {
    from?: number;
    to?: number;
    animated?: boolean;
  };
  inverted?: boolean | "x" | "y";
  axe?: "x" | "y";
  with_3d?: boolean | With3dOptions;
};
```
