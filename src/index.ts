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

//all the instance of Cattract class
const instances: Cattract[] = [];

const defaultOptions: Options = {
  elementRadius: 20,
  detectionRadius: 50,
  animation: {
    ease: "ease-in-out",
    duration: 1000,
  },
};

const default3dOptions: With3dOptions = {
  maxAngle: 45,
  perspective: 500,
};

class Cattract {
  /**
   * Create a circle attraction animation on an element
   * @param target The element you want to be animated
   * @param options The differents options
   */
  constructor(public target: HTMLElement, public options: Options = {}) {
    this.options = Object.assign({}, defaultOptions, options);
    this.options.animation = Object.assign(
      {},
      defaultOptions.animation,
      options.animation ?? {}
    );
    if (this.options.with_3d) {
      this.options.with_3d = Object.assign(
        {},
        default3dOptions,
        this.options.with_3d
      );
    }
    this.target.style.transformOrigin = "center";
    this.start();
  }

  /**
   * Apply translation on the target with animation
   * @param translation
   */
  private applyTranslation(translation: string) {
    this.target.animate([{ transform: translation }], {
      duration: this.options.animation.duration,
      fill: "forwards",
      easing: this.options.animation.ease,
    });
    // this.target.style.transform = translation;
  }

  /**
   * Return the screen radius
   * @returns
   */
  private getScreenRadius() {
    return Math.max(window.innerWidth, window.innerHeight) / 2;
  }

  /**
   * Get delta for a specified invertion
   * @param invertion
   * @returns
   */
  private getDeltaFromInvertion(invertion: boolean | "x" | "y") {
    const delta = { x: 1, y: 1 };
    if (invertion === true) {
      delta.x = delta.y = -1;
    } else if (invertion === "x") {
      delta.x = -1;
    } else if (invertion === "y") {
      delta.y = -1;
    }
    return delta;
  }

  /**
   * Create a circle for the debug
   * @param radius
   * @returns
   */
  private createCircle(radius: number, color: string) {
    const circle = document.createElement("div");
    circle.setAttribute(
      "style",
      `
      position: absolute;
      background-color: transparent;
      width: ${radius * 2}px;
      aspect-ratio: 1/1;
      border: thin ${color} solid;
      border-radius: 100%;
    `
        .replace(/\n+/g, "")
        .replace(/\s+/g, " ")
    );
    return circle;
  }

  /**
   * Display circle for detection zone and the element circle for better debugging
   * @param color
   */
  debug(color: string = "#e1e1e130") {
    this.target.parentElement.style.position = "relative";

    const append = (element: HTMLDivElement) => {
      this.target.parentNode.insertBefore(element, this.target);
    };

    const elementRadiusCircle = this.createCircle(
      this.options.elementRadius,
      color
    );
    append(elementRadiusCircle);

    if (this.options.detectionRadius !== "full") {
      const detectionRadiusCircle = this.createCircle(
        this.options.detectionRadius,
        color
      );
      append(detectionRadiusCircle);
    }
  }

  /**
   * Get the actual needed transformation properties of the element
   * @returns
   */
  private getTransformation() {
    const computedStyles = window.getComputedStyle(this.target);
    const transformValue = computedStyles.transform;
    let translationX = 0;
    let translationY = 0;
    let scaleX = 1;
    let scaleY = 1;

    if (transformValue && transformValue !== "none") {
      const matrixRegex = /(matrix3d|matrix)\(([^)]+)\)/;
      const match = transformValue.match(matrixRegex);

      if (match) {
        const matrixValues = match[2].split(",").map(parseFloat);

        if (match[1] === "matrix") {
          // 2D transformation matrix
          scaleX = matrixValues[0];
          scaleY = matrixValues[3];
          translationX = matrixValues[4];
          translationY = matrixValues[5];
        } else if (match[1] === "matrix3d") {
          // 3D transformation matrix
          scaleX = matrixValues[0];
          scaleY = matrixValues[5];
          translationX = matrixValues[12];
          translationY = matrixValues[13];
          // const translationZ = matrixValues[14];
          // const scaleZ = matrixValues[10];
        }
      }
    }

    return { translationX, translationY, scaleX, scaleY };
  }

  /**
   * Update the position of the targer
   * @param x The x position of the cursor
   * @param y The y position of the cursor
   */
  update(x: number, y: number) {
    //TODO: Fixe this shit (fuckng lagging)
    const rect = this.target.getBoundingClientRect();
    const trans = this.getTransformation();
    const width = rect.width / trans.scaleX;
    const height = rect.height / trans.scaleY;
    const targetMiddleX = rect.left - trans.translationX + width / 2;
    const targetMiddleY = rect.top - trans.translationY + height / 2;

    const [dx, dy] = [x - targetMiddleX, y - targetMiddleY];
    const mouseRadius = Math.sqrt(dx * dx + dy * dy);

    if (
      this.options.detectionRadius === "full" ||
      mouseRadius <= this.options.detectionRadius
    ) {
      const transformations: string[] = [];

      const hypp = Math.sqrt(dx * dx + dy * dy);
      const tx = hypp === 0 ? 0 : dx / hypp;
      const ty = hypp === 0 ? 0 : dy / hypp;
      const totalRadius =
        this.options.detectionRadius === "full"
          ? this.getScreenRadius()
          : this.options.detectionRadius;
      const pourcentage = hypp / totalRadius;
      const computedRadius = this.options.elementRadius * pourcentage;

      /* Handle 3D effect */
      if (this.options.with_3d) {
        const options3d = this.options.with_3d as With3dOptions;
        const delta = this.getDeltaFromInvertion(options3d.inverted);
        const computedAngle = options3d.maxAngle * pourcentage;
        transformations.push(`perspective(${options3d.perspective}px)`);
        if (!options3d.axe || options3d.axe === "x")
          transformations.push(`rotateX(${ty * computedAngle * delta.x}deg)`);
        if (!options3d.axe || options3d.axe === "y")
          transformations.push(`rotateY(${-tx * computedAngle * delta.y}deg)`);
      }

      /* Handle scale */
      if (this.options.scale?.to) {
        const scaleOptions = this.options.scale;
        const scaleFrom = scaleOptions.from ?? 1;
        let finalScale = scaleOptions.to - scaleFrom;
        if (scaleOptions.animated) finalScale *= pourcentage;
        transformations.push(`scale(${scaleFrom + finalScale})`);
      }

      /* Handle translation */
      const delta = this.getDeltaFromInvertion(this.options.inverted);
      const [transX, transY] = [
        tx * computedRadius * delta.x,
        ty * computedRadius * delta.y,
      ];
      if (!this.options.axe || this.options.axe === "x")
        transformations.push(`translateX(${transX}px)`);

      if (!this.options.axe || this.options.axe === "y")
        transformations.push(`translateY(${transY}px)`);

      this.applyTranslation(transformations.join(" "));
    } else {
      if (this.options.scale?.from)
        this.applyTranslation(`scale(${this.options.scale.from})`);
      else this.applyTranslation("none");
    }
  }

  /**
   * Start attraction animation
   */
  start() {
    this.target.style.willChange = "transform";
    if (this.options.with_3d) this.target.style.transformStyle = "preserve-3d";
    if (this.options.scale?.from)
      this.target.style.transform = `scale(${this.options.scale.from})`;
    instances.push(this);
  }

  /**
   * Stop the attraction animation
   */
  stop() {
    const index = instances.findIndex(
      (instance) => instance.target === this.target
    );
    if (index !== -1) instances.splice(index, 1);
  }

  /**
   * Reset the element tranformation
   */
  reset() {
    this.target.style.transform = "none";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document.body.addEventListener("mousemove", function (event) {
    const [x, y] = [event.pageX, event.pageY];
    for (const instance of instances) {
      if (!instance.target.isConnected) {
        instance.stop();
        continue;
      }
      instance.update(x, y);
    }
  });
});

export default Cattract;
