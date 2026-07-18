(function() { 
    var adsKey = localStorage.getItem("bloxcraftstudiosadskey"); 
    if (adsKey === "false") { 
        return; 
    } 
    var newScript = document.createElement('script'); 
    newScript.src = 'https://effectivecpmnetwork.com'; 
    newScript.async = true; 

    var targetScript = document.querySelector('script[src="/assets/ads.js"]'); 

    if (targetScript && targetScript.parentNode) { 
        targetScript.parentNode.insertBefore(newScript, targetScript.nextSibling); 
    } else { 
        document.body.appendChild(newScript); 
    }
})();
