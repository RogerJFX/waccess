const assert = require('assert');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const validDom1 = `<!doctype html><html><body>
<waccess>
	<a class="welcome" href="javascript:$waccess.activateWaccess();">Do you want to activate?</a>
    <a class="activated" href="javascript:;">Waccess activated.</a>
</waccess>
<div class="container firstOuterContainer">
	<p tabindex="0">Section animals.</p>
	<div class="container innerContainer">
		<button class="bf b1">Elephant</button>
		<button class="bf b2">Crocodile</button>
	</div>
	<button class="bf b1">Fledermaus</button>
	<button class="bf b2">Opossum</button>
</div>
<waccess>
		<button id="foobar" from=".firstOuterContainer p:first-of-type" to=".secondOuterContainer .innerContainer">Hidden button</button>
</waccess>
<div class="container secondOuterContainer">
	<p>Sektion Elite Team 14</p>
	<div class="container firstInnerContainer">
		<button class="bf b1">Denise</button>
		<button class="bf b2">Katharina</button>
	</div>
	<div class="container innerContainer">
		<button class="bf b1">Dennis</button>
		<button class="bf b2">Christian</button>
	</div>
</div>
<waccess>
    <a id="auswahl_der_naechsten_Punkte" href="javascript:;">Wählen sie hier, wohin Sie navigieren wollen</a>
    <br/>
	<button from="#auswahl_der_naechsten_Punkte" to=".thirdOuterContainer">Wählen Sie Hannes</button>
	<button id="sel2_lst" from="#auswahl_der_naechsten_Punkte" to=".thirdOuterContainer > button:last-of-type">Wählen Sie Julian</button>
</waccess>
<div class="container thirdOuterContainer">
	<p>Sektion Ersatzbank Team 14</p>
	<div class="container innerContainer">
		<button class="bf b1">Hannes</button>
		<button class="bf b2">Henning</button>
	</div>
	<button class="bf b1">Özgür</button>
	<button class="bf b2">Julian</button>
</div>
</body></html>`;

const invalidDom1 = `<!doctype html><html><body>
<waccess>
		<button to=".secondOuterContainer .innerContainer">Hidden button</button>
</waccess>
</body></html>`;
const loadDom = (domString) => {
    const dom = new JSDOM(domString);
    const win = dom.window;
    global.document = win.document;
    global.window = win;
    global.sessionStorage = {
        getItem:(key) => {return null;},
        setItem:(key, value) => {}
    }
    require('./waccess.js');
};


const fireKeyEvent = (keyCode, type) => {
    var evt = document.createEvent("Event");
    evt.initEvent(type, true, true); 
    evt.keyCode = keyCode;
    window.dispatchEvent(evt);
}

describe('Waccess', function() {

    describe('### On load', function() {
        loadDom(validDom1);
        it('should put focus on welcome', function() {
            assert.equal(document.activeElement.textContent, 'Do you want to activate?');
        });
        it('should activate and focus confirmation', () => {
            $waccess.activateWaccess();
            assert.equal(document.activeElement.textContent, 'Waccess activated.');
        });
    });
    
    describe('### Navigation', function() {
        loadDom(validDom1);
        //$waccess.activateWaccess(true);
        it('should put the focus to "Dennis" after 5 further tab downs', () => {
            document.getElementById('foobar').focus();
            assert.equal(document.activeElement.textContent, 'Dennis');
        });
        it('should auto go back to "Sektion Tierchen"', () => {
            fireKeyEvent(16, 'keydown');
            document.getElementById('foobar').focus();
            assert.equal(document.activeElement.textContent, 'Section animals.');
            fireKeyEvent(16, 'keyup');
        });
        it('should put the focus on Julian onclick.', () => {
            document.getElementById('sel2_lst').focus();
            document.activeElement.click();
            assert.equal(document.activeElement.textContent, 'Julian');

        });
        it('should put the focus on Julian onclick.', () => {
            fireKeyEvent(16, 'keydown');
            document.getElementById('sel2_lst').focus();
            document.activeElement.click();
            assert.equal(document.activeElement.textContent, 'Wählen sie hier, wohin Sie navigieren wollen');
            fireKeyEvent(16, 'keyup');

        });
    });
   
    describe('### Detecting invalid waccess crossovers during startup', function() {
        it('should throw an Error after loading invalid DOM', () => {
            loadDom(invalidDom1);
            assert.throws(() => {$waccess.activateWaccess();},
                          Error, 
                          'Not enough arguments for button inside waccess element. Please specify attributes "from" and "to". button is logged above.');
        });
    });
});
