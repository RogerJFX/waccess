WACCESS
-

A small script to improve web accessibilty for blind people. Initial idea 
is to place hidden HTML elements inside the HTML code, that just forward the focus 
to other elements once they are focused.

Sources here:

	https://github.com/rogerjfx/waccess
	
Usage:

Waccess is designed to nearly everything handle within HTML. The main tag is

~~~
  <waccess></waccess>
~~~

Main child nodes are buttons. They should have two attributes, "from" and "to". 
The values should point to other containers using document.querySelectorAll().

~~~
  <waccess>
    <button from="#myContainer" to="#myOtherContainer">Foo</button>
  </waccess>
~~~

So once the nested button is focused, it either forwards to node with id "myContainer"
or "myOtherContainer", if the SHIFT key is down.

If there are more than one button inside the Waccess container, the user might select
one of those options by pressing ENTER. If all buttons have the same target for one 
direction, auto forwarding again will be performed in this direction.

Initially Waccess should be activated. This is done by asking the user first. 

~~~
  <waccess>
  	<a class="welcome" href="javascript:$waccess.activateWaccess();">Activate?</a>
    <a class="activated" href="javascript:;">Ok, activated.</a>
  </waccess>
~~~

Once Waccess is activated, it will be stored to session storage and the user 
won't be asked again within this session.

Note: the module really searches for the anchors with the mentioned classes.

### API ###

Waccess is all over static. Just import it, and it is alive. You should think 
of it as of a very eager singleton, if you are in doubt. Me too, I am in doubt 
as well. :D

However you might fetch and hold a (yet useless) reference.

E.g. (TypeScript)

~~~
  private waccess: IWaccess = Waccess.init();
~~~

All the following methods are "static". So you may call e.g. Wacess.scanAgain() 
directly.

- init(): IWaccess \
  Normally completely useless. Returns a reference to the singleton Waccess 
  instance. Should become deprecated soon. Very soon...
- activateWaccess(): Void \
  Activates Waccess for the UI.
- scanAgain(): Void \
  If you have dynamical content, you should force Waccess to scan again.
- focusElement(query: string, force?: boolean): Void \
  Declaratively focus an HTML element. Usefull, for events like "load" or 
  any related promises \
  => query: the query for querySelectorAll() \
  => force: if true, action will be performed even with inactive Waccess.

### Notes ### 

1. If dealing with Angular 2++, don't forget to put NO_ERRORS_SCHEMA to schemas 
in app.module.ts. Otherwise Angular will complain unknown tags.
