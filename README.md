WACCESS
-

A small script to improve web accessibilty for blind people.

Only useful in relation to ARIA. See here:

	https://www.w3.org/TR/aria-in-html/

Working demo here:
	
	http://showcase.crazything.eu/js-showcase/waccess/
	
Don't forget to have a look at the sessionStorage.

Blind people must navigate using the keyboard. Since they cannot find elements just by 
looking at the screen, they have to step through a web page by using the TAB key or SHIFT+TAB to go back.
There are programs, that read aloud the content of e.g. focused elements. So blind people could 
use the web as well, if there wasn't the problem of web designers simply hiding content from them.

A second problem is just tabbing through a website often is really confusing, because the order is 
simply scrambled. This leads to some kind of a labyrinth for blind people.

So this small script may be used to help blind people navigating the web.

*Note: Using the tabindex attribute isn't sufficient, if there is any dynamic content, otherwise it will do.*

### The idea ###

Ok, lets say, we have HTML containers with child elements, that are dynamically created. 
Why not creating invisible crossovers between them, that may point even to completely remote containers?

A crossover can contain one or many branches. A branch has two directions: to and from. 

Selection of containers are done via CSS queries. So document.querySelectorAll is used internally.

Example 1:
~~~
<waccess>
	<button from=".firstOuterContainer" 
	    to=".secondOuterContainer .innerContainer">Go to Sektion 2, line 2 [auto]</button>
</waccess>
~~~
This is an auto crossover, because there is only one option or button. 
If the button will gain the focus by a key press "TAB", it will instantly proxy the 
focus to element with class ".innerContainer" and parent element with class ".secondOuterContainer" (so "to"). 
If SHIFT+TAB has been pressed, it will proxy to "from", so ".firstOuterContainer".

**Of course the first/last focusable element inside the container will be focused. Or the container itself, 
if it is exceptionally focusable.**

Example 2:
~~~
<waccess>
	<button from=".secondOuterContainer" 
	    to=".thirdOuterContainer">Go to Sektion 3 [select]</button>
	<button from=".secondOuterContainer" 
	    to=".forthOuterContainer">Go to Sektion 4 [select]</button>
</waccess>
~~~
Here auto forwarding is only performed backwards, because both buttons point to the same "from" - target. 
Forward the user has two options. She may select one option by again using TAB or 
SHIFT+TAB and press ENTER to get where she wants.

**Note: of course those waccess-elements are not visible.**

### Special events ###

Sometimes it is useful to declaratively focus a desired element. Just think of a pagination, think 
of the user "clicks" "page 3" from the pagination below a result list. Wouldn't it be nice to focus 
the first entry of page 3 after the content is loaded?

The following will show, how this is done.
~~~
<!-- or some onload event -->
<button onclick="waccess.focusElement('.secondOuterContainer .innerContainer')">
    Goto Section 2, line 2
</button>
~~~
Here the first focusable element will gain the focus.


