import { World, Component as Component1 } from './world';
function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function _assertThisInitialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
}
function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;
    try {
        for(var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
}
function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assertThisInitialized(self);
}
function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _setPrototypeOf(o, p);
}
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}
var _typeof = function(obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
        }));
        return true;
    } catch (e) {
        return false;
    }
}
function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
        var Super = _getPrototypeOf(Derived), result;
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return _possibleConstructorReturn(this, result);
    };
}
var ITestComponent = /*#__PURE__*/ function(Component) {
    "use strict";
    _inherits(ITestComponent, Component);
    var _super = _createSuper(ITestComponent);
    function ITestComponent(data) {
        _classCallCheck(this, ITestComponent);
        var _this;
        _this = _super.call(this);
        _this.id = 'TestComponent';
        _this.data = '';
        _this.data = data;
        return _this;
    }
    _createClass(ITestComponent, [
        {
            key: "onAdd",
            value: function onAdd() {
            }
        },
        {
            key: "onRemove",
            value: function onRemove() {
            }
        }
    ]);
    return ITestComponent;
}(Component1);
var ITestComponent2 = /*#__PURE__*/ function(Component) {
    "use strict";
    _inherits(ITestComponent2, Component);
    var _super = _createSuper(ITestComponent2);
    function ITestComponent2(data) {
        _classCallCheck(this, ITestComponent2);
        var _this;
        _this = _super.call(this);
        _this.id = 'TestComponent2';
        _this.data = 0;
        _this.data = data;
        return _this;
    }
    _createClass(ITestComponent2, [
        {
            key: "onAdd",
            value: function onAdd() {
            }
        },
        {
            key: "onRemove",
            value: function onRemove() {
            }
        }
    ]);
    return ITestComponent2;
}(Component1);
it('World can create entities with a bitmask', function() {
    var world = new World();
    var entity = world.createEntity();
    expect(typeof entity === "undefined" ? "undefined" : _typeof(entity)).toBe('string');
    expect(world.entities.get(entity)).toBe(0);
});
it('World can register components by their class type', function() {
    var world = new World();
    world.register(ITestComponent);
    expect(world.tables.size).toBe(1);
    expect(world.tables.get(ITestComponent.name).mask).toBe(1);
    world.register(ITestComponent2);
    expect(world.tables.size).toBe(2);
    expect(world.tables.get(ITestComponent2.name).mask).toBe(2);
});
it('World can apply components to entities and set the bitmask correctly', function() {
    var world = new World();
    var entity = world.createEntity();
    world.register(ITestComponent);
    world.register(ITestComponent2);
    world.applyComponent(new ITestComponent('hello'), entity);
    world.applyComponent(new ITestComponent2(42), entity);
    var entityMask = world.entities.get(entity);
    expect((entityMask & 1) > 0).toBe(true);
    expect((entityMask & 2) > 0).toBe(true);
    expect((entityMask & (1 | 2)) > 0).toBe(true);
    expect((entityMask & 4) > 0).toBe(false);
});
it('World can get queries for entities that match the component set', function() {
    var world = new World();
    var entity = world.createEntity();
    var testString = 'hello';
    var testNumber = 42;
    world.register(ITestComponent);
    world.register(ITestComponent2);
    world.applyComponent(new ITestComponent(testString), entity);
    world.applyComponent(new ITestComponent2(testNumber), entity);
    var entities = world.query(ITestComponent);
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = entities[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var _value = _slicedToArray(_step.value, 2), data = _value[0], id = _value[1];
            expect(data).toBe(testString);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
});
