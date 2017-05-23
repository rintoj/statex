/**
 * State selector function
 *
 * @export
 * @interface StateSelector
 * @template T
 */
export interface StateSelector {
    (state: any): any;
}
