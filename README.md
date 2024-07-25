# AnyChat

An anonymous chatting web application which helps users to connect with strangers. 

AnyChat is built using NodeJS and MongoDB at Backend and ReactJS at Frontend.

## Installation

- Clone the repository
```
git clone https://github.com/neelansh27/AnyChat
```

### Backend

- Setup up Backend

```
cd BackEnd 
npm install 
```
- Create a `.env` file and add following variables

```
PORT=<Port>
DB_URI=<MongoDB url>
SECRET=<Any random string OR hash code>
```

###  Frontend

- Setup up Backend

```
cd Frontend 
npm install 
```

- Create a `.env` file and add following variables
```
VITE_BACK_URL=<Backend url>
```

## Start servers

- BackEnd: `npm start`
- Frontend: `npm run dev`
