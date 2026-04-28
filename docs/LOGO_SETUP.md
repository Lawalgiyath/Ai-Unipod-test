# Logo Setup Guide - AI UniPod Lagos

## Adding the UNILAG Logo

According to the **Official UniPods Visual Identity Guidelines**, the logo lock-up should display:

1. **Primary Logo** (AI UniPod) - Larger
2. **"In Partnership With"** text
3. **Secondary Logo** (University Logo - UNILAG) - Smaller

## Step 1: Save the UNILAG Logo

1. Save the UNILAG logo image you have as: `images/unilag-logo.png`
2. Recommended size: 400x400px or higher (transparent background preferred)
3. Format: PNG with transparency

## Step 2: Update Navigation HTML

Replace the navigation logo section in all HTML files with this code:

```html
<a href="index.html" class="nav__logo">
  <!-- Primary Logo (AI UniPod) -->
  <div class="nav__logo-primary">
    <div class="nav__logo-mark">
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" fill="white"/>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" fill="white" opacity="0.4"/>
      </svg>
    </div>
    <div class="nav__logo-text">
      AI UniPod Lagos
      <span>UNDP Timbuktoo</span>
    </div>
  </div>
  
  <!-- Divider -->
  <div class="nav__logo-divider"></div>
  
  <!-- Secondary Logo (UNILAG) -->
  <div class="nav__logo-secondary">
    <span class="nav__logo-partnership">In Partnership With</span>
    <img src="images/unilag-logo.png" alt="University of Lagos" class="nav__logo-university">
  </div>
</a>
```

## Step 3: Files to Update

Update the logo section in these files:
- `index.html` (line ~74)
- `about.html` (line ~249)
- `news.html` (line ~137)
- `events.html` (line ~159)
- `programs.html` (line ~137)
- `gallery.html` (line ~130)
- `partners.html` (line ~65)
- `admin.html` (if applicable)

## Step 4: Alternative - Use Online Logo URL

If you don't want to save the logo locally, you can use a direct URL:

```html
<img src="https://unilag.edu.ng/wp-content/uploads/2023/01/unilag-logo.png" 
     alt="University of Lagos" 
     class="nav__logo-university">
```

## Step 5: Responsive Behavior

The CSS is already set up to handle mobile responsively. On smaller screens:
- The secondary logo will be hidden automatically
- Only the primary AI UniPod logo will show

## Visual Identity Guidelines Compliance

This implementation follows the official guidelines:

✅ **Size Comparison**: Primary logo is larger than secondary  
✅ **Partnership Text**: "In Partnership With" is displayed  
✅ **Proper Spacing**: Divider separates the logos  
✅ **Brand Colors**: Uses official UniPods blue (#1E84C2)  
✅ **Typography**: Uses Ubuntu font as specified  

## Example Logo Lock-up Structure

```
┌─────────────────────────────────────────────────┐
│  [●]  AI UNIPOD LAGOS  │  In Partnership With  │
│       UNDP Timbuktoo   │    [UNILAG LOGO]      │
└─────────────────────────────────────────────────┘
   Primary (Larger)      │    Secondary (Smaller)
```

## Testing

After adding the logo:

1. Open `index.html` in browser
2. Check that both logos appear
3. Verify the UNILAG logo is smaller than the primary logo
4. Test on mobile - secondary logo should hide
5. Check that "In Partnership With" text is visible

## Troubleshooting

**Logo not showing:**
- Check file path: `images/unilag-logo.png`
- Verify image file exists
- Check browser console for 404 errors

**Logo too large/small:**
- Adjust `.nav__logo-university` height in `css/style.css`
- Current setting: `height: 32px`

**Logo quality poor:**
- Use higher resolution image (400x400px minimum)
- Use PNG format with transparency
- Consider using SVG format for best quality

## Official Branding Colors

For reference, the official UniPods colors:
- **Main Color**: #1E84C2 (UniPods Blue)
- **Secondary Color**: #FFDE59 (UniPods Yellow)
- **UNILAG Green**: #2D8659 (from logo)
- **UNILAG Gold**: #C8A84B (from logo)

---

**Need Help?**

See the Visual Identity Guidelines PDF for more details on logo usage and placement.
