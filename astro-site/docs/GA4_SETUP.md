# Google Analytics 4 Setup Guide

## Overview

This project includes Google Analytics 4 (GA4) tracking for comprehensive user behavior analysis. The implementation is privacy-focused with IP anonymization and GDPR compliance.

## Features

### Automatic Tracking
- **Page Views**: All page visits are tracked automatically
- **Page Transitions**: Astro View Transitions are tracked

### Custom Event Tracking

1. **WhatsApp Clicks**
   - Event: `whatsapp_click`
   - Tracks clicks on WhatsApp links
   - Captures link URL

2. **Form Submissions**
   - Event: `form_submit`
   - Tracks contact form submissions
   - Labeled: "Contact Form"

3. **Gallery Image Views**
   - Event: `gallery_image_view`
   - Tracks when users open gallery images
   - Captures image alt text

4. **Service Card Clicks**
   - Event: `service_card_click`
   - Tracks interactions with service cards
   - Captures service title

5. **Scroll Depth**
   - Event: `scroll_depth`
   - Tracks at: 25%, 50%, 75%, 100%
   - Helps understand content engagement

6. **Outbound Clicks**
   - Event: `outbound_click`
   - Tracks clicks to external websites
   - Captures destination URL

## Setup Instructions

### 1. Create GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Admin" → "Create Property"
3. Follow the setup wizard
4. Select "Web" as platform
5. Note your **Measurement ID** (format: `G-XXXXXXXXXX`)

### 2. Configure Environment Variable

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your Measurement ID:
   ```env
   PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

3. For production deployment, set the environment variable on your hosting platform:
   - **Netlify**: Site Settings → Environment Variables
   - **Vercel**: Project Settings → Environment Variables
   - **GitHub Pages**: Repository Settings → Secrets

### 3. Verify Installation

1. Build and preview the site:
   ```bash
   npm run build
   npm run preview
   ```

2. Open browser DevTools → Network tab
3. Look for requests to `googletagmanager.com`
4. Check Console for event logs (development mode only)

### 4. Test in GA4 Dashboard

1. Go to GA4 Dashboard → Reports → Realtime
2. Open your website in another browser window
3. Verify events appear in real-time view:
   - Page views
   - Custom events (whatsapp_click, form_submit, etc.)

## Privacy & GDPR Compliance

### Built-in Privacy Features

- **IP Anonymization**: Enabled by default
- **Cookie Flags**: `SameSite=None;Secure`
- **Development Mode**: GA4 disabled in development (mocked tracking)
- **User Consent**: Datenschutz page updated with GA4 notice

### User Rights

Users can opt-out via:
1. **Browser Plugin**: [Google Analytics Opt-out](https://tools.google.com/dlpage/gaoptout)
2. **Cookie Settings**: Browser cookie management
3. **Do Not Track**: Respects browser DNT signals

### GDPR Compliance Checklist

- [x] Privacy policy updated (datenschutz.astro)
- [x] IP anonymization enabled
- [x] Clear description of data collection
- [x] User opt-out instructions provided
- [x] Data retention configured (GA4 dashboard)
- [x] Cookie consent banner (if required)

## Custom Tracking API

The component exposes a global `window.trackEvent()` function for custom tracking:

```javascript
// Track custom events
window.trackEvent('custom_event_name', {
  event_category: 'engagement',
  event_label: 'Custom Label',
  value: 123
});

// Example: Track CTA button clicks
document.querySelector('.cta-button').addEventListener('click', function() {
  window.trackEvent('cta_click', {
    event_category: 'conversion',
    event_label: 'Hero CTA'
  });
});
```

## Troubleshooting

### GA4 not tracking events

1. **Check environment variable**:
   ```bash
   echo $PUBLIC_GA_MEASUREMENT_ID
   ```

2. **Verify production build**:
   GA4 only loads in production (`import.meta.env.PROD === true`)

3. **Check browser console**:
   Look for errors related to gtag.js

4. **Test with GA4 DebugView**:
   - Install [GA Debugger Chrome Extension](https://chrome.google.com/webstore/detail/google-analytics-debugger/)
   - Enable debug mode in extension
   - View events in GA4 → Configure → DebugView

### Events not appearing in reports

- **Realtime reports**: Events appear immediately
- **Standard reports**: Can take 24-48 hours to process
- **Custom events**: May need to register as custom dimensions

## Data Retention

Configure data retention in GA4:

1. Admin → Data Settings → Data Retention
2. Recommended: 14 months (GDPR compliant)
3. Save settings

## Useful GA4 Reports

1. **Acquisition → Traffic Acquisition**
   - See traffic sources (Google, direct, referral)

2. **Engagement → Events**
   - View all tracked events
   - Event count, users, revenue

3. **Engagement → Pages and Screens**
   - Top pages by views
   - Average engagement time

4. **User → User Attributes**
   - Demographics (if enabled)
   - Location, device, browser

## Next Steps

1. Set up **Conversion Events** in GA4:
   - form_submit → Conversion
   - whatsapp_click → Conversion

2. Create **Custom Reports**:
   - Gallery engagement analysis
   - Service card performance
   - Form conversion funnel

3. Configure **Alerts**:
   - Traffic drops
   - Conversion rate changes
   - Error spikes

## References

- [GA4 Documentation](https://support.google.com/analytics/answer/10089681)
- [GA4 Event Reference](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [GDPR Compliance Guide](https://support.google.com/analytics/answer/9019185)

---

**Last Updated**: February 15, 2026
