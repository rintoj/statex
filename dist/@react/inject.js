"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var core_1 = require("../core");
var constance_1 = require("./../core/constance");
/**
 * This decorator helps you to inject application state into a component's state
 * @example
 *
 * class Props {
 *   @data((state: AppState) => state.todos)
 *   todos: Todo[]
 * }
 *
 * interface Props { }
 *
 * @inject(Props)
 * export class TodoListComponent extends React.Component<Props, State> {
 *   ...
 * }
 *
 * @export
 * @param {*} props - Component properties class annotated with @data
 * @returns
 */
function inject(propsClass) {
    if (typeof propsClass === 'object') {
        var bindingsMeta_1 = Reflect.getMetadata(constance_1.STATEX_DATA_BINDINGS_KEY, propsClass);
        if (!Reflect.hasMetadata(constance_1.STATEX_DATA_BINDINGS_KEY, propsClass)) {
            bindingsMeta_1 = { selectors: {}, subscriptions: [], destroyed: true };
        }
        Object.keys(propsClass).forEach(function (propertyKey) {
            if (typeof propsClass[propertyKey] !== 'function') {
                throw new Error(propertyKey + " must be a selector function!");
            }
            bindingsMeta_1.selectors[propertyKey] = propsClass[propertyKey];
        });
        Reflect.defineMetadata(constance_1.STATEX_DATA_BINDINGS_KEY, bindingsMeta_1, propsClass);
    }
    return function (targetComponent) {
        return /** @class */ (function (_super) {
            __extends(ObserverComponent, _super);
            function ObserverComponent() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            ObserverComponent.prototype.componentDidMount = function () {
                core_1.subscribe.bind(this)(propsClass);
            };
            ObserverComponent.prototype.componentWillUnmount = function () {
                core_1.unsubscribe.bind(this)();
            };
            ObserverComponent.prototype.render = function () {
                return React.createElement(targetComponent, __assign({}, this.props, this.state));
            };
            return ObserverComponent;
        }(React.PureComponent));
    };
}
exports.inject = inject;
