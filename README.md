

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

### Sample code

```javascript
var interfjs = require('interfejs');
var express = require("express");
var app = express();

var api = interfjs(app);
api.run();
```

This code will load a file named **api.json** and it will search for it into the root of your project (by default). You can customize the file name and path by editing the 



### API configuration



## Feature list



## Changelog

Please refer to [CHANGELOG.md](http://www.404notfound.fr/assets/images/pages/img/rachatdemobile.jpg) for release-to-release detail.

## Contributing

1. Fork it (https://github.com/PirataFrancis/sunmi-card-reader/fork)
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
