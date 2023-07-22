# Cattract

Animate anything just like it was attracted by the cursor

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
