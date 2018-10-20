$acs = window.$acs || {};
(function acs(self) {
	
    const KEY = '$_ACCESSIBILITY';
    
    const dataObject = JSON.parse(sessionStorage.getItem(KEY)) || {
		acsActivated: false
	};
	
	function persist() {
        sessionStorage.setItem(KEY, JSON.stringify(dataObject));
    }
    
    self.activateAcs = () => {
		dataObject.acsActivated = true;
		persist();
	};
	
	self.isAcsActivated = () => {
		return dataObject.acsActivated;
	}
	
})($acs.storage = $acs.storage || {});
