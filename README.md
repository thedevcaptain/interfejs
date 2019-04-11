**DISCLAIMER: THIS REPOSITORY IS UNDER HEAVY DEVELOPMENT, SO THERE MAY BE DAILY RELEASES AND SOME HENIOUS BUGS, SO DON'T USE IT FOR ANY PRODUCTION PROJECTS** but I don't have to tell you ... right?!?!?

# InterfeJS

InterfeJS (interface from Polish) is a little module that builds on top of an Express.js application a complete declarative REST API for a Google Spreadsheet.  

**Why should I use it?**

Good question, yeah good question indeed. Sadly I'm not here to answer it.

[![npm](https://img.shields.io/npm/v/interfejs.svg?label=Version)](https://www.npmjs.com/package/interfejs)
[![GitHub last commit](https://img.shields.io/github/last-commit/PirataFrancis/interfejs.svg)](https://github.com/PirataFrancis/interfejs/commits/master)
![CircleCI (all branches)](https://img.shields.io/circleci/project/github/PirataFrancis/interfejs.svg)


## Getting Started

InterferJS has 2 working authentication methods:

- oAuth2 Google Authentication (for end user's spreadsheets access)
- API Key (for public accessible spreadsheets)

More about this will be covered here: [Authentication](https://github.com/PirataFrancis/interfejs#authentication)

### Installing

This module won't work without an express app running, so it is mandatory to install it

```
npm install interfejs express
```

### Usage

```js
var interfejs = require('interfejs');
var express = require("express");
var app = express();

var api = interfejs(app);
api.run();
```

This code will load a file named `api.json` and it will search for it into the root of your project (by default). You can customize the file name and path by adding a second parameter to the `intefejs()` function.

```js
var interfjs = require('interfejs');
var express = require("express");
var app = express();

var api = interfejs(app,"./api/myapi.json");
api.run();
```

### API configuration

The module parse and validate a json file to get the REST API structure to expose.

```json
{
  "name":"My API",
  "version":1,
  "sheetId":"1egSO8BKkL1--------......QFa4aHtnfN3Rcl6rrQ",
  "authorization": {
    "key": "AIzaSyAw_d0..........jkmLYt_hIcA"
  },
  "resources":[
    {
      "name":"test",
      "path":"test",
      "methods":[
        {
          "type":"GET",
          "range":"A1:D",
          "mapping": true
        }
      ],
      "resources":[
        {
          "name":"test",
          "path":"tiny",
          "methods":[
            {
              "type":"GET",
              "range":"A1:B2"
            }
          ]
        }
      ]
    }
  ]
}
```

There are 3 main schema here to analyze:

#### API schema

- name `string` 

  The name of the api, just a friendly reminder for you.

- version `int`

  The version of the api you are going to expose.

- sheetId `string` 

  The Id of the Google spreadsheet you want to use. (https://docs.google.com/spreadsheets/d/{**sheetId**})

- authorization `object`

  The authorization method that should be used and it has two different attributes that can be defined:

  - key `string`

    The APIKey generated from the Google API Console.

  - dir `string`

    The directory where the oAuth2 Credentials are stored and where the tokens will be.

- resources `array of` [Resource](https://github.com/PirataFrancis/interfejs#Resources)

  The collection of resources that will be exposed.

#### Resource Schema

- name `string` 

  The name of the resourse, another friendly reminder for you.

- path `string`

  The path of the resource. (The starting `/` will be added by the module so it's not required)

- methods `array of`  [Method](https://github.com/PirataFrancis/interfejs#Resources)

  The methods exposed for this resource.

- resources `array of` [Resource](https://github.com/PirataFrancis/interfejs#Resources)

  The collection of sub resource of this one.

#### Method Schema

- type`string`

  The actual HTTP method. (Be careful, you have to write it uppercase)
  
- mapping`boolean`
    
    A boolean flag that enables the data mapping. If it is true the response will be 
    an `array of objects` for each of which the keys will be the values into the first row  and the effective data will be retrieved from the 2nd row. (just like a real table).
    
- range `string`

  The range on the spreadsheet to use as source for this endpoint, it has to be written with [A1 Notation](https://developers.google.com/sheets/api/guides/concepts#a1_notation)

- search `object`
    
    If this object is specified the endpoint will be used as a GET search endpoint
    and it will search for the values (retrieved from the query parameter named `param`) into the column `column`.
    If search is active, the `mapping` and `range` parameter won't be executed.
    - param `string`
    - column `string`

### Authentication

#### oAuth2 

In order to access private end users' file, the module need the access token to make API call to the Google API on behalf of the user.

The credentials will be stored into a directory (by default it's named `credentials` and it is located into the root of your project) and it has 4 different files:

- `credentials.json` - this is the file that you have to get from the Google API Console, after creating a firebase project, activating the Google Docs API and creating a Service account credentials. (**You have to provide it and place it under your credentials directory**)
- `token.json` there will be stored the tokens needed for the connection.
- `code.txt` this file is the second one you have to create in order to authenticate. Since it's oAuth2, once you go to the auth link that the module (on the first run) will provide you, a code will be generated and it is needed to be placed into that file.

With all three of these files the module is ready to go.

#### API Key

Since it may be tedious to authenticate the API with oAuth2, you can still specify an API Key linked to a Google project.

This authentication method makes accessible the published Google spreadsheets only, so before using it make sure your sheet is public. 
**This kind of auth does not permit any update to data on the spreadsheets**

## Features

- Declarative API generation
- GET method
- Access to both private and public Spreadsheets
- Searching into columns value
- Logging levels

## Next in line

- POST, PUT, DELETE methods
- Output customization
- Function reference by name

## Changelog

Please refer to [CHANGELOG.md](http://www.404notfound.fr/assets/images/pages/img/rachatdemobile.jpg) for release-to-release detail.

## Contributing

1. Fork it (https://github.com/PirataFrancis/interfejs/fork)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

## About me

I'm Francesco Borrelli an Italian Software Engineer, I love coding, solving problems and pizza so feel free contact me about anything :facepunch:
[Email](mailto:borrellifrn@gmail.com)
[Facebook](https://www.facebook.com/PirataFrancis)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details