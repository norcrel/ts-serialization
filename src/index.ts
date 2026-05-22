interface IPrototype
{
    prototype:object;
}

// WARNING: This must match the property used below in ReflectedClass
const REFLECTION_PROP = "__ts-serialization-refl";
interface ReflectedClass
{
    "__ts-serialization-refl"?:Map<string, WeakRef<object>>;
}

/**
 * Decorator - records the type that should be deserialized for a field
 */
export function serializedType(cls:object)
{
    return function (target:object, fieldName:string)
    {
        const t = target as ReflectedClass;
        t[REFLECTION_PROP] ||= new Map();
        t[REFLECTION_PROP].set(fieldName, new WeakRef((cls as IPrototype).prototype));
    };
}

/**
 * Generalized deserialization method using a class
 * @param {string|object} data The serialized data of the passed in object.
 *      If string, will be deserialized with JSON.parse()
 * @param {object} cls The prototype of the class that's being deserialized
 * @returns {any} An instance of the class passed in (cls) with data filled
 */
export function deserialize(data:string|object, cls:object)
{
    const reflectedClass = cls as ReflectedClass;
    const saveObj = typeof data === "string" ? JSON.parse(data) : data;
    const instance = Object.assign(Object.create(cls), saveObj);
    const reflectionMap = reflectedClass[REFLECTION_PROP];
    if (reflectionMap)
    {
        reflectionMap.forEach((value, key) =>
        {
            const c = value.deref() as ReflectedClass;
            if (!c)
            {
                return;
            }

            instance[key] = deserialize(instance[key], c);
        });
    }

    return instance;
}
