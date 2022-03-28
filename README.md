# Dictionary Store

Dictionary Store is a free library to implement multilinguage dictionary application. Store utilities provide data management tools.

Data is stored in local storage scoped by user and languages.

## Installation

```bash
npm install dictionary-store@latest
```

## Basic Usage

```js
import { UsersStore, LanguagesStore, WordsStore } from 'dictionary-store';

export const App = () => {
  const [user, setUser] = useState(null);

  useEffect(async () => {
    // get user informations...
    let user = ...;

    user = await UserStore.register(user);
    setUser(user);
  }, []);

  return(
    <>
      {user && `You're logged with user ${user.id}`}
      {!user && 'You're not logged !'}
    </>
  );
};
```

### Users

#### register({email, firstName?, lastName?}) - Async

Register a user. If the user already exists in the store, the connexions value is updated in the user data.

```js
const user = {
  firstName: 'Joe',
  lastName: 'Smith',
  email: 'joe.smith@gmail.com'
};

// return a promise with registered user object (with id and connexions)
const connectedUser = await UsersStore.register(user);
console.log(connectedUser.id, connectedUser.connexions, connectedUser.email, etc...);
```

#### get({email?, id}) - Async

Return a user match the email or the id.

```js
const email = 'joe.smith@gmail.com';
const user = await UsersStore.get(email);
console.log(user.id, user.email, etc...);
```

### Languages

#### getAll(userId) - Async

Return all the languages stored for a user.

```js
import { Languages } from "dictionary-store";

const userId = "...";
// Array of all the languages object for the current user
const languages = await Languages.getAll(userId);
```

#### get({userId, id}) - Async

Return a single language for the id and the userId associated.

```js
import { Languages } from "dictionary-store";

const languageId = "...";
const userId = "...";
const language = await Languages.get({ id: languageId, userId });
```

#### add({userId, label, etc...}) - Async

Create a language in the store.

```js
import { Languages } from "dictionary-store";

// Return the list of languages associated to the user (last added included)
const languages = Languages.add({
  label: "french",
  userId: "...",
});
```

#### delete({userId, id}) - Async

Delete a language in the store

```js
import { Languages } from "dictionary-store";

const languageId = "...";
const userId = "...";
// Return the list of languages associated to the user (without the last removed)
const languages = await Languages.delete({ id: languageId, userId });
```

### Words

#### get({ userId, id, languageId }) - Async

Return a single word associated to a user && language.

```js
import { Words } from "dictionary-store";

const languageId = "...";
const userId = "...";
const wordId = "...";
// Return word object
const word = await Words.get({ id: wordId, userId, languageId });
// {id: string, label: string, translation: string, success: number, flag: boolean, lockedUntil: number }
```

#### getAll({ userId, languageId }) - Async

Return all the words associated to a user && language

```js
import { Words } from "dictionary-store";

const languageId = "...";
const userId = "...";
// Return an Array of word objects
const words = await Words.getAll({ userId, languageId });
```

#### add({ userId, languageId, label, translation }) - Async

Register a new word in the store. If the word label already exists nothing is done.
Return the list of all the words associated to the user && language (including the new word registered).

```js
import { Words } from "dictionary-store";

const words = await Words.add({
  userId: "...",
  languageId: "...",
  label: "Bonjour",
  translation: "Gutten Tag",
});
```

#### delete({ userId, languageId, id }) - Async

Delete a word in the store. Check is done to verify if the word is associated to the user && language. If not nothing is done.
return the list of the words associated to the user && language (without the word removed).

```js
import { Words } from "dictionary-store";

const wordId = "...";
const words = await Words.delete({
  userId: "...",
  languageId: "...",
  id: wordId,
});
```

#### flag({ userId, id, languageId, flag }) - Async

Flag (toogle boolean value) a word. If the word is flagged it will be ignore in the random picked.
Return the word updated.

```js
import { Words } from "dictionary-store";

const wordId = "...";
const flagValue = false | true;
const word = await Words.flag({
  userId: "...",
  languageId: "...",
  id: wordId,
  flag: flagValue,
});
```

#### failed({ userId, id, languageId }) - Async

Update word after repetition (practice) failed. The success property is reset to 0 and the lockedUntil value set to now.
The word will be available for a next random pick.

```js
import { Words } from "dictionary-store";
const wordId = "...";
const word = await Words.failed({
  userId: "...",
  languageId: "...",
  id: wordId,
});
```

#### succeed({ userId, id, languageId }) - Async

Update word after repetition (practice) success. The success property is incremented and the lockedUntil value set to now + delay (depending of the number of success).
The word will be available for a next random pick when the lockedUntil will be over.

```js
import { Words } from "dictionary-store";
const wordId = "...";
const word = await Words.succeed({
  userId: "...",
  languageId: "...",
  id: wordId,
});
```

#### getRandom({ limit }, { userId, languageId }) - Async

Return a set of random words (user && language associated). Limit can be adjusted (first argument).
The flagged words or with a property lockedUntil > Date().getTime() are ignored.

```js
import { Words } from "dictionary-store";

const words = await Words.getRandom(
  {
    limit: 10,
  },
  {
    userId: "...",
    languageId: "...",
  }
);
```

#### search({ term, inTranslation }, { userId, languageId }) - Async

Return a list of words matched the term argument. Label or translation can be used for the search (inTranslation set to true will provide a search in the translation field).

Search with a starting letter can be done by just passing the starting letter as term (see examples).

```js
import { Words } from "dictionary-store";

// research with a term
const term = "voi";
// will research all the label starting with "voi"
// to sreach in the translation field pass inTranslation = true
const words = await Words.search(
  { term, inTranslation: false },
  { userId: "...", languageId: "..." }
);

// search all the words starting with a "b"
const wordsStartingWithLetter = await Words.search(
  { term: "b", inTranslation: false },
  { userId: "...", languageId: "..." }
);
```

#### update({userId, languageId, id, label?, translation?, etc...}) - Async

Update a word in the store. Props userId, languageId, id are required.
After this all properties are optionnal (merge is done between the current word in the store and the object passed in the update method).

```js
import { Words } from "dictionary-store";

const label = "my Label";
const wordId = "...";
const userId = "...";
const languageId = "...";
// will just update the label
const word = await Words.update({ id: wordId, userId, languageId, label });
```
