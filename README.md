# QW - Landing Page

A simple, clean landing page for collecting email addresses from future users.

## Features

- Email collection form with validation
- Social media links
- Fully responsive design (mobile-friendly)
- Modern, clean UI

## Setup

1. Open `index.html` in your web browser
2. That's it! No build process needed.

## Customization

### Update Social Media Links

Edit the `href` attributes in `index.html` for each social link:

```html
<a href="YOUR_TWITTER_URL" class="social-link">...</a>
<a href="YOUR_INSTAGRAM_URL" class="social-link">...</a>
<a href="YOUR_LINKEDIN_URL" class="social-link">...</a>
<a href="YOUR_GITHUB_URL" class="social-link">...</a>
```

### Connect Email Form to Backend

In `script.js`, replace the `submitEmail` function with your actual API endpoint:

```javascript
async function submitEmail(email) {
    const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    if (!response.ok) throw new Error('Failed to submit');
    return response.json();
}
```

### Styling

All styles are in `styles.css`. You can easily customize:
- Colors (currently using purple gradient)
- Fonts
- Spacing
- Layout

## Files

- `index.html` - Main HTML structure
- `styles.css` - All styling
- `script.js` - Form handling and validation
- `README.md` - This file

