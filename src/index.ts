type Options = {
  elementRadius?: number;
  detectionRadius?: number | "full";
  animation?: {
    ease?: string;
    duration?: number;
  };
  inverted?: boolean | "x" | "y";
  axe?: "x" | "y";
  with_3d?:
    | boolean
    | {
        axe?: "x" | "y";
        inverted?: boolean | "x" | "y";
        maxAngle?: number;
        perspective?: number;
      };
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

const default3dOptions: Options["with_3d"] = {
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
  }

  /**
   * Return the screen radius
   * @returns
   */
  private getScreenRadius() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return Math.sqrt(width * width + height * height) / 2;
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
   * Update the position of the targer
   * @param x The x position of the cursor
   * @param y The y position of the cursor
   */
  update(x: number, y: number) {
    /* We don't use getBoundingClientRect to avoid translation */
    const rect = {
      top: this.target.offsetTop,
      left: this.target.offsetLeft,
      width: this.target.offsetWidth,
      height: this.target.offsetHeight,
    };
    const targetMiddleX = rect.left + rect.width / 2;
    const targetMiddleY = rect.top + rect.height / 2;
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
        const options3d = this.options.with_3d as any; //TODO: Fixe this any
        const delta = this.getDeltaFromInvertion(options3d.inverted);
        const computedAngle = options3d.maxAngle * pourcentage;
        transformations.push(`perspective(${options3d.perspective}px)`);
        if (!options3d.axe || options3d.axe === "x")
          transformations.push(`rotateX(${ty * computedAngle * delta.x}deg)`);
        if (!options3d.axe || options3d.axe === "y")
          transformations.push(`rotateY(${-tx * computedAngle * delta.y}deg)`);
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
      this.applyTranslation("none");
    }
  }

  /**
   * Start attraction animation
   */
  start() {
    this.target.style.willChange = "trasnform";
    if (this.options.with_3d) this.target.style.transformStyle = "preserve-3d";
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
