export interface InitOptions {
    hotLoad?: boolean;
    cache?: string;
    showError?: boolean;
    domain?: string;
}
export declare function initialize(initialState: any, options?: InitOptions): void;
