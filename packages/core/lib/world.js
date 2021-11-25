import { v4 as uuid } from 'uuid';
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
export var Component = /*#__PURE__*/ function() {
    "use strict";
    function Component(param) {
        var attributes = param === void 0 ? {
        } : param;
        _classCallCheck(this, Component);
        for(var key in attributes){
            this[key] = attributes[key];
        }
    }
    _createClass(Component, [
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
    return Component;
}();
export var World = /*#__PURE__*/ function() {
    "use strict";
    function World() {
        _classCallCheck(this, World);
        // Entities with a bitmask for their contained components
        this.entities = new Map();
        // Tables contain components, each table a list of active components
        this.tables = new Map();
        // Available masks
        this.masks = new Map();
    }
    _createClass(World, [
        {
            /**
   * Creates a new entity and adds it to the world
   */ key: "createEntity",
            value: function createEntity() {
                var entity = uuid();
                this.entities.set(entity, 0);
                return entity;
            }
        },
        {
            /**
   * Registers a component type with the world
   */ key: "register",
            value: function register(component) {
                var mask = -1;
                this.masks.forEach(function(isAvailable, n) {
                    if (isAvailable) {
                        mask = n;
                    }
                });
                if (mask < 0) {
                    mask = Math.pow(2, this.masks.size);
                    this.masks.set(mask, false);
                }
                this.tables.set(component.name, {
                    entities: new Map(),
                    mask: mask
                });
            }
        },
        {
            /**
   * Applies a component instance to an entity
   */ key: "applyComponent",
            value: function applyComponent(component, entity) {
                var table = this.tables.get(component.constructor.name);
                var currentMask = this.entities.get(entity);
                if (table == null || currentMask == null) {
                    return false;
                }
                table.entities.set(entity, component);
                this.entities.set(entity, currentMask | table.mask);
            }
        },
        {
            /**
   * Returns a set of components that have the supplied components
   * @TODO for now just use one type parameter
   */ key: "query",
            value: function query(component1) {
                var table = this.tables.get(component1.name);
                var components = new Set();
                table.entities.forEach(function(component, key) {
                    components.add([
                        component.data,
                        key
                    ]);
                });
                return components;
            }
        }
    ]);
    return World;
}();
