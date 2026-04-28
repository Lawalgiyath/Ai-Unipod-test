# Navigation & Footer Logo Updates - Complete

## ✅ Pages Updated

### 1. index.html - DONE
- Navigation logos increased (60px, 56px, 44-48px)
- Footer logos showing in color (no white filter)
- Partners & Supporters section: 100px logos

### 2. about.html - DONE
- Updated navigation with all partner logos
- Larger logo sizes matching index.html

### 3. programs.html - DONE
- Updated navigation with all partner logos
- Larger logo sizes matching index.html

## 📋 Remaining Pages to Update

The following pages need the same navigation and footer updates:
- news.html
- events.html
- gallery.html
- partners.html
- admin.html

## 🔧 Changes Needed for Each Page

### Navigation (Top of page)
Replace old SVG logo navigation with:
```html
<a href="index.html" class="nav__logo">
  <div class="nav__logo-primary">
    <div class="nav__logo-mark" style="background: transparent; width: auto; height: auto; border-radius: 0;">
      <img src="images/unipods Logo.png" alt="UniPod Lagos" style="height: 60px; width: auto;">
    </div>
    <img src="images/undp_logo.png" alt="UNDP" style="height: 56px; width: auto; margin-left: 20px;">
  </div>
  <div class="nav__logo-divider"></div>
  <div class="nav__logo-secondary">
    <span class="nav__logo-partnership">In Partnership With</span>
    <div style="display: flex; gap: 12px; align-items: center;">
      <img src="images/UNILAG LOGO.png" alt="University of Lagos" style="height: 44px;">
      <img src="images/Nigerias_Coat_of_arms.png" alt="Federal Government of Nigeria" style="height: 48px;">
      <img src="images/tetfund_logo.png" alt="TETFund" style="height: 44px;">
    </div>
  </div>
</a>
```

### Footer (Bottom of page)
Update footer logos to remove white backgrounds and filters:
```html
<div class="footer__logos">
  <img src="images/undp_logo.png" alt="UNDP" loading="lazy" style="height: 55px; width: auto;">
  <img src="images/UNILAG LOGO.png" alt="University of Lagos" loading="lazy" style="height: 60px; width: auto;">
  <img src="images/Nigerias_Coat_of_arms.png" alt="Federal Government of Nigeria" loading="lazy" style="height: 65px; width: auto;">
  <img src="images/tetfund_logo.png" alt="TETFund" loading="lazy" style="height: 55px; width: auto;">
</div>
```

## 📊 Logo Sizes Summary

### Navigation
- **Primary**: UniPod (60px), UNDP (56px)
- **Secondary**: UNILAG (44px), Nigeria (48px), TETFund (44px)

### Partners & Supporters Section
- **All logos**: 100px height

### Footer
- **Range**: 55-65px height
- **No filters**: Full color display

---

**Status**: 3/8 pages complete
**Next**: Update remaining 5 pages with same changes
