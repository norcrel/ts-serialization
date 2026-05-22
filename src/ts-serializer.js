"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializedType = serializedType;
exports.deserialize = deserialize;
// WARNING: This must match the property used below in ReflectedClass
const REFLECTION_PROP = "__ts-serialization-refl";
/**
 * Decorator - records the type that should be deserialized for a field
 */
function serializedType(cls) {
    return function (target, fieldName) {
        const t = target;
        t[REFLECTION_PROP] ||= new Map();
        t[REFLECTION_PROP].set(fieldName, new WeakRef(cls.prototype));
    };
}
/**
 * Generalized deserialization method using a class
 * @param {string|object} data The serialized data of the passed in object.
 *      If string, will be deserialized with JSON.parse()
 * @param {object} cls The prototype of the class that's being deserialized
 * @returns {any} An instance of the class passed in (cls) with data filled
 */
function deserialize(data, cls) {
    const reflectedClass = cls;
    const saveObj = typeof data === "string" ? JSON.parse(data) : data;
    const instance = Object.assign(Object.create(cls), saveObj);
    const reflectionMap = reflectedClass[REFLECTION_PROP];
    if (reflectionMap) {
        reflectionMap.forEach((value, key) => {
            const c = value.deref();
            if (!c) {
                return;
            }
            instance[key] = deserialize(JSON.stringify(instance[key]), c);
        });
    }
    return instance;
}
