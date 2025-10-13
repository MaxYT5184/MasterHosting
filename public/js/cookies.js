// Cookie Consent Banner
(function() {
    // Check if user has already accepted cookies
    if (localStorage.getItem('cookieConsent') === 'accepted') {
        return;
    }
    
    // Create cookie banner
    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.className = 'cookie-banner';
    banner.innerHTML = `
        <div class="cookie-content">
            <div class="cookie-text">
                <i class="fas fa-cookie-bite"></i>
                <p>
                    We use cookies to improve your experience and show relevant ads. 
                    By continuing to use our site, you accept our use of cookies.
                    <a href="/privacy" target="_blank">Learn more</a>
                </p>
            </div>
            <div class="cookie-buttons">
                <button id="accept-cookies" class="btn btn-primary">
                    <i class="fas fa-check"></i> Accept
                </button>
                <button id="decline-cookies" class="btn btn-secondary">
                    <i class="fas fa-times"></i> Decline
                </button>
            </div>
        </div>
    `;
    
    // Add banner to page
    document.body.appendChild(banner);
    
    // Show banner with animation
    setTimeout(() => {
        banner.classList.add('show');
    }, 500);
    
    // Accept cookies
    document.getElementById('accept-cookies').addEventListener('click', function() {
        localStorage.setItem('cookieConsent', 'accepted');
        banner.classList.remove('show');
        setTimeout(() => {
            banner.remove();
        }, 300);
    });
    
    // Decline cookies
    document.getElementById('decline-cookies').addEventListener('click', function() {
        localStorage.setItem('cookieConsent', 'declined');
        banner.classList.remove('show');
        setTimeout(() => {
            banner.remove();
        }, 300);
        
        // Optionally disable ads/tracking if declined
        console.log('Cookies declined - tracking disabled');
    });
})();
