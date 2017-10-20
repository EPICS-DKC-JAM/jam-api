# JAM API

This is the repository housing source code for backend services

## Setting Up for Dev

Make sure you have MongoDB installed along with a database called jam ready to use.
Currently the app does not use authentication for MongoDB, allow anonymous binds for now.
Install dependencies and start server
```
npm install
DEBUG=myapp:* npm start
```

## Endpoints

Below are the current endpoints along with an example response, as well as needed payload if specified

### Consumables (/consumables)

####/get/{specifier} (GET)

This method gets consumables. {specifier} can either be the consumable id or "all" to get all consumables.
If "all", returns a list of consumables, otherwise just a single object.

Sample Response
```
{
    "_id": 26,
    "name": "Frappe",
    "description": "Blended ice, milk, coffee and sweetener topped with whipped cream. Available with chocolate or vanilla (or add other flavor syrups). Choose from a powder mix or for an extra dollar have it made with smooth cold brewed coffee.",
    "price": 4,
    "jslImage": "https://www.deafcancoffee.com/images/portfolio/IMG_6369.JPG",
    "itemImage": "https://www.deafcancoffee.com/images/portfolio/IMG_6369.JPG",
    "caffeine": true,
    "modifiers": [
        "mocha",
        "vanilla",
        "ice",
        "no ice"
    ],
    "size": [
        "small",
        "medium",
        "large"
    ],
    "__v": 0
}
```

####/add (POST)

Adds a consumable to the database.

Sample Payload
```
{
    "data": {
        "name": "Cup of Jamaican Joe",
        "description": "The cup of Jamaican Joe is our rendition of the classic cup of Joe, one of the most popular drinks in the world. It has a slightly nutty, mellow flavor, as well as acidic, sweet, and winey nuances.",
        "price": 4.00,
        "jslImage": "https://www.deafcancoffee.com/images/portfolio/IMG_6369.JPG",
        "itemImage": "https://www.deafcancoffee.com/images/portfolio/IMG_6369.JPG",
        "caffeine": true,
        "modifiers": 1,
        "size": 1
    }
}
```
Sample Response
```
{
    "name": "Cup of Jamaican Joe",
    "description": "The cup of Jamaican Joe is our rendition of the classic cup of Joe, one of the most popular drinks in the world. It has a slightly nutty, mellow flavor, as well as acidic, sweet, and winey nuances.",
    "price": 4,
    "jslImage": "https://www.deafcancoffee.com/images/portfolio/IMG_6369.JPG",
    "itemImage": "https://www.deafcancoffee.com/images/portfolio/IMG_6369.JPG",
    "caffeine": true,
    "modifiers": 1,
    "size": 1
}
```

### Sizes (/sizes)

####/get/{specifier} (GET)

This method gets sizes. {specifier} can either be the size id or "all" to get all sizes.
If "all", returns a list of sizes, otherwise just a single object.

Sample Response
```
{
    "_id": 1,
    "__v": 0,
    "sizes": [
        "small",
        "medium",
        "large"
    ]
}
```

####/add (POST)

Adds a consumable to the database.

Sample Payload
```
{
    "data": {
        "sizes": ["small", "medium", "large"]
    }
}
```
Sample Response
```
{
    "sizes": ["small", "medium", "large"]
}
```

### Modifiers (/modifiers)

####/get/{specifier} (GET)

This method gets modifiers. {specifier} can either be the modifier id or "all" to get all modifiers.
If "all", returns a list of modifiers, otherwise just a single object.

Sample Response
```
{
    "_id": 0,
    "__v": 0,
    "modifiers": [
        "mocha",
        "vanilla",
        "ice",
        "no ice"
    ]
}
```

####/add (POST)

Adds a consumable to the database.

Sample Payload
```
{
    "data": {
        "sizes": ["mocha", "vanilla", "ice", "no ice"]
    }
}
```
Sample Response
```
{
    "sizes": ["mocha", "vanilla", "ice", "no ice"]
}
```