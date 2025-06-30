# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

This is a static website for Gartenbau Z.M., a German landscaping company in Remseck am Neckar. The site is optimized for local SEO and serves customers in the Stuttgart region.

### Structure
- **Static HTML site** with German content focused on local SEO
- **Multi-page layout**: `index.html` (main), `impressum.html`, `datenschutz.html`
- **Asset organization**: `css/`, `js/`, `img/` directories
- **Deployment**: Production domain (gartenbauzm.de)

### Key Features
- Comprehensive local SEO with Schema.org structured data for LocalBusiness
- Fancybox gallery integration for project photos
- Contact form with Formspree integration (action="https://formspree.io/f/xoqznyqb")
- Mobile-responsive design with burger menu
- Dynamic image gallery (149 images loaded via JavaScript)
- WhatsApp integration for direct contact

### Dependencies
- **jQuery 3.4.1**: Core JavaScript functionality
- **Fancybox**: Image gallery lightbox
- **Slick**: Slider functionality (though not heavily used)
- **Google Fonts**: Typography (Inter, Jost, Montserrat, Roboto, Rubik)

### Image Processing
Located at `/img/script-fotos-to-webp/`:
- **Sharp.js** script for converting JPEG/PNG to WebP format
- Batch processes images with 80% quality
- Run with: `cd img/script-fotos-to-webp && node convert-to-webp.js`

### Contact Information
- Phone: +49 178 2747470 (WhatsApp enabled)
- Email: info.gartenbauzm@gmx.de
- Address: Lerchenrain 9, 71686 Remseck am Neckar
- Service area: Stuttgart region, Rems-Murr-Kreis

### Development Notes
- Site content is in German - maintain language consistency
- Local SEO is critical - preserve location keywords and Schema.org data
- Image optimization is important - use WebP format for new images
- Form submissions go to Formspree - test contact form after changes
- Google review integration link: https://g.page/r/CZk_BZnPcSqHEB0/review