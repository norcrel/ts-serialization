# easy-class-serialization
A small library for enabling serialization of objects with prototypes in Typescript using JSON.stringify().
Intended for simple, hierarchical data model classes with some functions.

# Limitations

- Types are _not_ tracked in the data. They are derived via runtime prototype definitions.
- No cyclical references.
- No references to specific instances (deserialization only creates new instances).

# Installation
1. `npm i https://github.com/norcrel/easy-class-serialization.git`

# Usage
```
import {serializedType, deserialize} from '@norcrel/easy-class-serializer'

class DataModel {
    public description:string;
    
    @serializedType(OtherDataModel)
    public other:OtherDataModel;
}

class OtherDataModel
{
    public x:number;
    
    getXString()
    {
        return x.toString();
    }
}

const subModel = new OtherDataModel();
subModel.x = 42;

const dataModel = new DataModel();
dataModel.description = "Hello!";
dataModel.other = subModel;

const serializedString = JSON.stringify(dataModel);

const deserializedObj = deserialize(serializedString, DataModel.prototype);

console.log(deserializedObj.other.getXString()); // "42"
```

Have a wonderful day :)
