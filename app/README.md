<p align="center">
  <img src="https://user-images.githubusercontent.com/3274103/31729170-90d2abd4-b42e-11e7-91b8-bdc7a105c2cc.png" />
</p>

The aim of this example app is to send text input from React, convert it into a MD5 hash via PHP, and display it back in the React app.

<p align="center">
  <a href="http://pupper.cod3.net">Try the online demo</a>
</p>


## Usage

```bash
# setup
composer install -o --no-dev
npm i

# run
npm run build
npm start
```

## How it works
### PHP side

**Listening**

PHP is hooked to the same WebSocket as React. 

In this piece of code we add a listener for an event named `text_sent`.

```php
// app/events.php

$websocket = new Pupper\Pupper\WebSocket;

$websocket->addEventListener('text_sent', 
   function (Event $event) {
      // ...
   }
);
```
**Sending**

In the callback, we fetch the event data with `$event->getValue()`, convert it into a md5 hash, and send it back by returning a new `Event` named `hash_sent`.
```php
// app/events.php

return new Event('hash_sent', md5($event->getValue()));
```

### React side
On the React side we connect to the same WebSocket as PHP and create a `SocketProvider` that hydrates it to its child components.

```jsx harmony
// app/pages/HashPage.js

const globalSocket = new WebSocket('ws://127.0.0.1/ws');

<SocketProvider socket={globalSocket}>
    {/* Child components go here */}
</SocketProvider>
```

We export our child components with the `withSocket` function for `SocketProvider` to hydrate them.
```jsx harmony
// app/pages/components/HashForm.js

export default withSocket(HashForm)
```

**Sending**

To send a `text_sent` event that will be caught by the PHP listener, we create a component that extends `EventDispatcher`. 

`EventDispatcher` is a component that sends whatever is in its `toSubmit` prop to the socket it's connected to.

We bind it to the the `text_sent` event.

```jsx harmony
// app/pages/components/HashForm.js

class HashForm extends EventDispatcher

// app/pages/HashPage.js

<HashForm bindTo='text_sent' toSubmit={this.state.textToHash}...>Add</HashForm>
```
**Listening**

To display the hashed version of the text that was sent by PHP, we create a `HashList` component that extends `EventListener`. 

`EventListener` is a listener that triggers its children `onData(value)` with the data that was sent.

We bind it to the `hash_sent` event.

```jsx harmony
// app/pages/components/HashList.js

class HashList extends EventListener

// app/pages/HashPage.js

<HashList bindTo='hash_sent' ... onData={this.onPhpData}/>

// app/pages/HashPage.js

onPhpData(hashedText) {
    // update hash list
}
```
