# Project Name

**FISK 3D Chart**

## File Structure

```
FISK-3D-CHART/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── fonts/
│   └── your-font-files.ttf
├── images/
│   └── your-image-files.jpg
└── README.md
```

## Integration Instructions

To integrate the chart into your website:

1. **Reference Example File**: Open the "example.html" file and use it as a reference for integrating the 3D chart into your website.

2. **Copy Asset Folders**: Copy over the "js", "css", "fonts", and "images" folders from this repository to your project directory.

3. **Add CSS Link**: In the `<head>` section of your HTML file, add the following CSS link:

   ```html
   <link rel="stylesheet" type="text/css" href="css/styles.css" />
   ```

4. **Copy HTML Structure and Scripts**: Copy the following HTML structure and scripts from the "example.html" page:

   - Copy the `<div id="fisk-component">` and its contents from the "example.html" page and paste it into your HTML file where you want the chart to appear. Ensure that you include everything inside this div, including the scripts.

   ```html
   <div id="fisk-component">
     <!-- Your Three.js chart HTML structure goes here -->
   </div>
   ```

These instructions will guide you through the process of integrating the FISK 3D Chart into your website. If you have any questions, feel free to reach out for assistance.
