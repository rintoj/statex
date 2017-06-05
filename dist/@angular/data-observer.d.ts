import { OnDestroy, OnInit } from '@angular/core';
/**
 * Every component that uses `@BindAction` must extends from this
 * class in order to make sure that AOT won't delete OnInit and
 * OnDestroy life-cycle events used by the decorator, irrespective
 * of the fact that it may or may not be used by the component itself
 *
 * @export
 * @class DataObserver
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
export declare class DataObserver implements OnInit, OnDestroy {
    constructor();
    ngOnInit(): void;
    ngOnDestroy(): void;
}
