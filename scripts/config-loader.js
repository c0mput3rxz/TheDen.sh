// Configuration loader for multi-site setup
class ConfigLoader {
    constructor() {
        this.config = null;
        this.configName = this.getConfigName();
    }

    getConfigName() {
        // Get config name from URL or default
        const hostname = window.location.hostname.toLowerCase();
        const pathname = window.location.pathname;
        
        // Check if there's a config parameter (highest priority)
        const urlParams = new URLSearchParams(window.location.search);
        const configParam = urlParams.get('config');
        
        if (configParam) {
            return configParam;
        }
        
        // Map hostnames to config files
        const hostnameMap = {
            'sadbirdsclub.com': 'sadbirdsclub',
            'www.sadbirdsclub.com': 'sadbirdsclub',
            'sadbirdsclub.c0mput3rxz.com': 'sadbirdsclub',
            'c0mput3rxz.com': 'c0mput3rxz',
            'www.c0mput3rxz.com': 'c0mput3rxz',
            'localhost': 'c0mput3rxz', // Default for local dev
            '127.0.0.1': 'c0mput3rxz'
        };
        
        // Check exact hostname match first
        if (hostnameMap[hostname]) {
            return hostnameMap[hostname];
        }
        
        // Try partial matches (for subdomains)
        if (hostname.includes('sadbirdsclub')) {
            return 'sadbirdsclub';
        } else if (hostname.includes('c0mput3rxz')) {
            return 'c0mput3rxz';
        }
        
        // Check if pathname indicates a specific site
        if (pathname.includes('sadbirdsclub')) {
            return 'sadbirdsclub';
        }
        
        // Default
        return 'c0mput3rxz';
    }

    async loadConfig() {
        try {
            const response = await fetch(`configs/${this.configName}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load config: ${response.statusText}`);
            }
            this.config = await response.json();
            return this.config;
        } catch (error) {
            console.error('Error loading config:', error);
            // Fallback to default
            const response = await fetch('configs/c0mput3rxz.json');
            this.config = await response.json();
            return this.config;
        }
    }

    getConfig() {
        return this.config;
    }

    // Helper methods to get specific config values
    getName() {
        return this.config?.name || '';
    }

    getTitle() {
        return this.config?.title || '';
    }

    getRole() {
        return this.config?.role || '';
    }

    getCompany() {
        return this.config?.company || '';
    }

    getCompanyUrl() {
        return this.config?.companyUrl || '';
    }

    getDescription() {
        return this.config?.description || '';
    }

    getInterests() {
        return this.config?.interests || [];
    }

    getLocation() {
        return this.config?.location || '';
    }

    getEmail() {
        return this.config?.email || '';
    }

    getGithub() {
        return this.config?.github || '';
    }

    getLinkedin() {
        return this.config?.linkedin || '';
    }

    getProjects() {
        return this.config?.projects || [];
    }

    getLinks() {
        return this.config?.links || [];
    }

    getPress() {
        return this.config?.press || { podcasts: [], articles: [], interviews: [] };
    }

    getType() {
        return this.config?.type || 'personal';
    }

    getProducts() {
        return this.config?.products || {};
    }

    getCategories() {
        return this.config?.categories || [];
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConfigLoader;
}

