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

###API

Waccess is all over static. However you might hold a reference.

E.g. (TypeScript)

~~~
  private waccess: IWaccess = Waccess.init();
~~~

**Remember to call Waccess.init() once since it is not completely static.**

All the following methods are "static". So you may call e.g. Wacess.scanAgain() 
directly.

- init(): IWaccess \
  Must be called once. Returns a normally useless reference. 
- activateWaccess(): Void \
  Activates Waccess.
- scanAgain(): Void \
  If you have dynamical content, you should force Waccess to scan again.
- focusElement(query: string, force?: boolean): Void \
  Declaratively focus an HTML element. \
  => query: the query for querySelectorAll() \
  => force: if true, action will be performed even with inactive Waccess.


