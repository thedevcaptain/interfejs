**DISCLAIMER: THIS REPOSITORY IS UNDER HEAVY DEVELOPMENT, SO THERE MAY BE DAILY RELEASES AND SOME HENIOUS BUGS, SO DON'T USE IT FOR ANY PRODUCTION PROJECTS** but I don't have to tell you ... right?!?!?

# InterfeJS

InterfeJS (interface from Polish) is a little module that builds on top of an Express.js application a complete declarative REST API for a Google Spreadsheet.  

**Why should I use it?**

Good question, yeah good question indeed. Sadly I'm not here to answer it.

## Getting Started

InterferJS has 1 working authentication methods:

- oAuth2 Google Authentication (for end user's spreadsheets access)

More about this will be covered here: [Authentication](http://www.404notfound.fr/assets/images/pages/img/rachatdemobile.jpg)

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
  "sheetId":"1egSO8BKkL1ji--------HtnfN3Rcl6rrQ",
  "resources":[
    {
      "name":"test",
      "path":"test",
      "methods":[
        {
          "type":"GET",
          "range":"A1:D"
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

  The Id of the Google spreadsheet from which you want to use the data. (https://docs.google.com/spreadsheets/d/{**sheetId**})

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

  The actual HTTP method. (Be careful, you have to write it upper case)

- range `string`

  The range on the spreadsheet to use as source for this endpoint, it has to be written with [A1 Notation](https://developers.google.com/sheets/api/guides/concepts#a1_notation)

### Authentication

#### oAuth2 

In order to access private end users' file, the module need the access token to make API call to the Google API on behalf of the user.

The credentials will be stored into a directory (by default it's named `credentials` and it is located into the root of your project) and it has 4 different files:

- `credentials.json` - this is the file that you have to get from the Google API Console, after creating a firebase project, activating the Google Docs API and creating a Service account credentials. (**You have to provide it and place it under your credentials directory**)
- `token.json` there will be stored the tokens needed for the connection.
- `scopes.json` there are the scopes needed for the token generations.
- `code.json` this file is the second one you have to create in order to authenticate. Since it's oAuth2, once you go to the auth link that the module (on the first run) will provide you, a code will be generated and it is needed to be placed into that file.

With all four of these files, the module is ready to go

## Features

- Declarative API generation
- API GET method
- Google spreadsheet private file access via oAuth2 credentials
- ... more to go

## Next in line

- POST,PUT,DELETE methods
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
[Email](mailto:borrellifrm@gmail.com)
[Facebook](https://www.facebook.com/PirataFrancis)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details