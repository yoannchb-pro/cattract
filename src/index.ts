type Options = {
  elementRadius?: number;
  detectionRadius?: number | "full";
  animation?: {
    ease?: string;
    duration?: number;
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
      const hypp = Math.sqrt(dx * dx + dy * dy);
      const tx = hypp === 0 ? 0 : dx / hypp;
      const ty = hypp === 0 ? 0 : dy / hypp;
      const totalRadius =
        this.options.detectionRadius === "full"
          ? this.getScreenRadius()
          : this.options.detectionRadius;
      const computedRadius = this.options.elementRadius * (hypp / totalRadius);
      const transX = tx * computedRadius;
      const transY = ty * computedRadius;
      const translation = `translate(${transX}px, ${transY}px)`;
      this.applyTranslation(translation);
    } else {
      this.applyTranslation("none");
    }
  }

  /**
   * Start attraction animation
   */
  start() {
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
