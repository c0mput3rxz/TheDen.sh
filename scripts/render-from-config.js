// Render website content from config
const SOCIAL_ICON_SVG = {
    github: '<svg class="social-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>',
    linkedin: '<svg class="social-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>'
};

class WebsiteRenderer {
    constructor(configLoader) {
        this.configLoader = configLoader;
        this.config = null;
    }

    async init() {
        this.config = await this.configLoader.loadConfig();
        this.render();
    }

    render() {
        if (this.config.type === 'ecommerce') {
            this.renderEcommerce();
        } else {
            this.renderPersonal();
        }
    }

    renderPersonal() {
        // Update page title
        document.title = this.config.title;
        
        // Update meta description
        const metaDesc = document.querySelector('meta[name="Description"]');
        if (metaDesc) {
            metaDesc.content = `${this.config.name} - ${this.config.description}`;
        }

        // Update name in header
        const nameElement = document.querySelector('#card1 h1 strong');
        if (nameElement) {
            nameElement.textContent = this.config.name;
        }

        // Update about section
        const aboutSection = document.querySelector('#card1 .move:last-of-type');
        if (aboutSection) {
            let html = '<h4>About</h4>';
            html += `<p>${this.config.role} @ <a href="${this.config.companyUrl}" target="_blank">${this.config.company}</a></p>`;
            html += `<p>${this.config.description}</p>`;
            html += '<h4>Interests</h4>';
            html += `<p>${this.config.interests.join(', ')}</p>`;
            html += '<h4>Location</h4>';
            html += `<p>${this.config.location}</p>`;
            html += '<h4>Contact</h4>';
            html += `<p>${this.config.email}</p>`;
            aboutSection.innerHTML = html;
        }

        // Update social links
        const socialLinks = document.querySelector('#card1 h1');
        if (socialLinks) {
            let socialHtml = `<h1><strong>${this.config.name}</strong></h1>`;
            if (this.config.github) {
                socialHtml += `<a class="social-icon-link" href="${this.config.github}" target="_blank" rel="noopener noreferrer" aria-label="GitHub">${SOCIAL_ICON_SVG.github}</a>`;
            }
            if (this.config.linkedin) {
                socialHtml += `<a class="social-icon-link" href="${this.config.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">${SOCIAL_ICON_SVG.linkedin}</a>`;
            }
            socialLinks.outerHTML = `<div id="card1" class="move">${socialHtml}</div>`;
        }

        // Update projects section (must not use :last-of-type — manifesto is last .draggable)
        const projectsSection = document.querySelector('#card-projects');
        if (projectsSection && this.config.projects.length > 0) {
            let html = '<h3>Projects & Work</h3>';
            this.config.projects.forEach(project => {
                html += `<p><a href="${project.url}" target="_blank">${project.name}</a> - ${project.description}</p>`;
            });
            html += '<hr/>';
            html += '<h3>Links of interest</h3>';
            this.config.links.forEach(link => {
                html += `<p><a href="${link.url}" target="_blank">${link.name}</a> - ${link.description}</p>`;
            });
            html += '<hr/>';
            html += '<h4><strong>[root@c0mput3rxz ~]# uptime</strong></h4>';
            html += '<span id="clock" class="clock"><script type="text/javascript" src="scripts/uptime.js"></script></span>';
            projectsSection.innerHTML = html;
        }

        // Update press section if it exists — only replace when config has at least one item
        const pressCard = document.querySelector('#card-press');
        if (pressCard) {
            const press = this.config.press || { podcasts: [], articles: [], interviews: [] };
            const hasPress =
                (press.podcasts && press.podcasts.length > 0) ||
                (press.articles && press.articles.length > 0) ||
                (press.interviews && press.interviews.length > 0);
            if (hasPress) {
                let html = '<h3>Press & Media</h3>';
                if (press.podcasts && press.podcasts.length > 0) {
                    html += '<h4>Podcasts</h4>';
                    press.podcasts.forEach(podcast => {
                        html += `<p><a href="${podcast.url}" target="_blank">${podcast.name}</a> - ${podcast.description || ''}</p>`;
                    });
                    html += '<hr/>';
                }
                if (press.articles && press.articles.length > 0) {
                    html += '<h4>Articles</h4>';
                    press.articles.forEach(article => {
                        html += `<p><a href="${article.url}" target="_blank">${article.name}</a> - ${article.publication || ''}</p>`;
                    });
                    html += '<hr/>';
                }
                if (press.interviews && press.interviews.length > 0) {
                    html += '<h4>Interviews</h4>';
                    press.interviews.forEach(interview => {
                        html += `<p><a href="${interview.url}" target="_blank">${interview.name}</a> - ${interview.outlet || ''}</p>`;
                    });
                }
                pressCard.innerHTML = html;
            }
        }
    }

    renderEcommerce() {
        // This will be handled by a separate ecommerce template
        // For now, redirect or show message
        console.log('Ecommerce site - use sadbirdsclub.html');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
    const configLoader = new ConfigLoader();
    const renderer = new WebsiteRenderer(configLoader);
    await renderer.init();
});

