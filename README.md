# Multi-Site Website Platform

A shared codebase for multiple personal websites and e-commerce sites. All sites share the same code, with configuration files to customize each site.

## Structure

```
c0mput3rxz_website/
├── configs/                    # Configuration files for each site
│   ├── c0mput3rxz.json        # Your personal site config
│   ├── sadbirdsclub.json      # Sad Birds Club e-commerce config
│   └── team_member_template.json  # Template for new team members
├── sites/                      # Site-specific templates
│   └── sadbirdsclub/          # Sad Birds Club specific files
│       ├── styles.css
│       └── script.js
├── scripts/                    # Shared JavaScript
│   ├── config-loader.js       # Loads config files
│   ├── render-from-config.js  # Renders personal sites from config
│   └── ...                    # Other shared scripts
├── index.html                  # Main personal site (uses c0mput3rxz.json)
├── sadbirdsclub.html          # E-commerce site (uses sadbirdsclub.json)
└── stylesheet.css             # Shared styles for personal sites
```

## Adding a New Team Member Site

1. Copy `configs/team_member_template.json` to `configs/teammembername.json`
2. Fill in the config with their information
3. Access via `index.html?config=teammembername` or set up domain routing

## Configuration File Structure

### Personal Site Config
```json
{
  "name": "Person Name",
  "title": "person.com",
  "role": "Role Title",
  "company": "Company Name",
  "companyUrl": "https://company.com",
  "description": "Brief description",
  "interests": ["Interest 1", "Interest 2"],
  "location": "Location",
  "email": "email@example.com",
  "github": "https://github.com/username",
  "linkedin": "https://linkedin.com/in/username",
  "projects": [...],
  "links": [...],
  "press": {
    "podcasts": [],
    "articles": [],
    "interviews": []
  }
}
```

### E-commerce Config
```json
{
  "name": "Store Name",
  "title": "Store Title",
  "type": "ecommerce",
  "products": {
    "category1": [...],
    "category2": [...]
  },
  "categories": ["category1", "category2"]
}
```

## Benefits

- **Single Codebase**: Update once, all sites benefit
- **Easy Customization**: Just edit JSON config files
- **Consistent Design**: All sites share the same look and feel
- **Easy Maintenance**: Fix bugs once, fix everywhere

## Usage

1. Edit the appropriate config file in `configs/`
2. Changes are automatically reflected when the page loads
3. For new team members, create a new config and access via URL parameter
