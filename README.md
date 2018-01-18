# Imperial tobacco

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and production purposes.

### Installing

First of all clone this repository to your local machine and install all dependencies:

```
git clone https://github.com/IlyaMokin/imperial-tobacco.git
yarn
```

### Running in development mode

To run it in development mode you should firstly run this:

```
yarn run migrate
```

Then run two following commands in separate terminals:

```
yarn run client
yarn run server
```

Then just visit http://localhost:8080/


### Running in production mode

To run it in production mode you should firstly run this:

```
yarn run build
```

And then

```
yarn run server
```

Then just visit http://localhost:3002/

