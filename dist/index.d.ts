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
declare class Cattract {
    target: HTMLElement;
    options: Options;
    /**
     * Create a circle attraction animation on an element
     * @param target The element you want to be animated
     * @param options The differents options
     */
    /**
     * Create a circle attraction animation on an element
     * @param target The element you want to be animated
     * @param options The differents options
     */
    constructor(target: HTMLElement, options?: Options);
    /**
     * Apply translation on the target with animation
     * @param translation
     */
    /**
     * Apply translation on the target with animation
     * @param translation
     */
    private applyTranslation;
    /**
     * Return the screen radius
     * @returns
     */
    /**
     * Return the screen radius
     * @returns
     */
    private getScreenRadius;
    /**
     * Get delta for a specified invertion
     * @param invertion
     * @returns
     */
    /**
     * Get delta for a specified invertion
     * @param invertion
     * @returns
     */
    private getDeltaFromInvertion;
    /**
     * Create a circle for the debug
     * @param radius
     * @returns
     */
    /**
     * Create a circle for the debug
     * @param radius
     * @returns
     */
    private createCircle;
    /**
     * Display circle for detection zone and the element circle for better debugging
     * @param color
     */
    /**
     * Display circle for detection zone and the element circle for better debugging
     * @param color
     */
    debug(color?: string): void;
    /**
     * Get the actual needed transformation properties of the element
     * @returns
     */
    /**
     * Get the actual needed transformation properties of the element
     * @returns
     */
    private getTransformation;
    /**
     * Update the position of the targer
     * @param x The x position of the cursor
     * @param y The y position of the cursor
     */
    /**
     * Update the position of the targer
     * @param x The x position of the cursor
     * @param y The y position of the cursor
     */
    update(x: number, y: number): void;
    /**
     * Start attraction animation
     */
    /**
     * Start attraction animation
     */
    start(): void;
    /**
     * Stop the attraction animation
     */
    /**
     * Stop the attraction animation
     */
    stop(): void;
    /**
     * Reset the element tranformation
     */
    /**
     * Reset the element tranformation
     */
    reset(): void;
}
export { Cattract as default };
