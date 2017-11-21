export interface InitOptions {
    hotLoad?: boolean;
    showError?: boolean;
    domain?: string;
}
export declare function initialize(initialState: any, options?: InitOptions): void;
