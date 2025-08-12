# SkinCare AI - Professional Multi-Page Website

A professional, modern website for AI-powered skin cancer detection with a sleek black and white theme featuring glowing effects and the Unbounded font family.

## 🌟 Features

### Design & Theme
- **Professional Black & White Theme**: Clean, modern aesthetic with cyan and magenta accent colors
- **Glowing Effects**: Subtle glow effects on interactive elements for a futuristic feel
- **Unbounded Font**: Modern, geometric font family for a professional look
- **Responsive Design**: Fully responsive across all devices
- **Smooth Animations**: CSS animations and transitions for enhanced user experience

### Pages
1. **Home Page** (`/`) - Landing page with hero section, features, and call-to-action
2. **Detection Page** (`/detection`) - AI skin analysis with file upload and camera capture
3. **About Page** (`/about`) - Company information, team, and mission
4. **Services Page** (`/services`) - Service offerings and pricing plans
5. **Contact Page** (`/contact`) - Contact form and company information
6. **FAQ Page** (`/faq`) - Frequently asked questions with search functionality

### Technical Features
- **Template Inheritance**: Base template with consistent navigation and footer
- **Modular CSS**: Separate CSS files for base styles, components, and page-specific styles
- **Interactive JavaScript**: Form validation, camera functionality, FAQ search, and more
- **Mobile-First Design**: Optimized for mobile devices with responsive navigation
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

## 📁 File Structure

```
application/
├── app.py                          # Flask application with all routes
├── balanced_cancer.h5              # AI model file
├── static/
│   ├── css/
│   │   ├── base.css               # Base styles and theme
│   │   ├── components.css         # Reusable component styles
│   │   └── detection.css          # Detection page specific styles
│   └── js/
│       ├── base.js                # Common JavaScript functionality
│       ├── detection.js           # Detection page JavaScript
│       ├── faq.js                 # FAQ page JavaScript
│       └── contact.js             # Contact page JavaScript
└── templates/
    ├── base.html                  # Base template with navigation and footer
    ├── home.html                  # Home page template
    ├── detection.html             # Detection page template
    ├── about.html                 # About page template
    ├── services.html              # Services page template
    ├── contact.html               # Contact page template
    └── faq.html                   # FAQ page template
```

## 🚀 Getting Started

### Prerequisites
- Python 3.7+
- Flask
- Keras/TensorFlow
- PIL (Pillow)
- NumPy

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SCHOOL_STUDENTS_SKIN
   ```

2. **Install dependencies**
   ```bash
   pip install flask keras tensorflow pillow numpy
   ```

3. **Update model path** in `application/app.py`
   ```python
   MODEL_PATH = "path/to/your/balanced_cancer.h5"
   ```

4. **Run the application**
   ```bash
   cd application
   python app.py
   ```

5. **Access the website**
   Open your browser and navigate to `http://localhost:5000`

## 🎨 Design System

### Color Palette
- **Primary**: `#00ffff` (Cyan)
- **Secondary**: `#ffffff` (White)
- **Accent**: `#ff00ff` (Magenta)
- **Background Dark**: `#000000` (Black)
- **Background Light**: `#111111` (Dark Gray)
- **Text Primary**: `#ffffff` (White)
- **Text Secondary**: `#cccccc` (Light Gray)
- **Border**: `#333333` (Medium Gray)

### Typography
- **Font Family**: Unbounded (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Sizes**: Responsive scaling from 1rem to 3.5rem

### Effects
- **Glow Effects**: Box shadows with rgba colors for glowing borders
- **Backdrop Blur**: Glass-morphism effects on cards and navigation
- **Gradients**: Linear gradients for buttons and backgrounds
- **Animations**: Smooth transitions and hover effects

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 Customization

### Adding New Pages
1. Create a new template file in `templates/`
2. Extend the base template: `{% extends "base.html"}`
3. Add a route in `app.py`
4. Create page-specific CSS if needed
5. Add JavaScript functionality if required

### Modifying the Theme
1. Update CSS variables in `base.css`
2. Modify color values in the `:root` selector
3. Adjust glow effects and animations as needed

### Adding Features
1. Create new JavaScript files in `static/js/`
2. Include them in templates using `{% block extra_js %}`
3. Add corresponding CSS styles
4. Update navigation if needed

## 🎯 Key Features by Page

### Home Page
- Hero section with animated floating cards
- Feature grid with hover effects
- How it works section with step-by-step process
- Call-to-action sections

### Detection Page
- File upload with drag & drop
- Camera capture functionality
- Real-time image preview
- AI analysis results display
- Professional recommendations

### About Page
- Mission statement with statistics
- Technology overview
- Team member profiles
- Company values

### Services Page
- Service cards with features
- Pricing plans with comparison table
- Feature comparison matrix

### Contact Page
- Contact form with validation
- Company contact information
- Support options
- Interactive elements

### FAQ Page
- Categorized questions
- Search functionality
- Expandable answers
- Keyboard navigation

## 🔒 Security Features

- Form validation (client and server-side)
- File type and size validation
- XSS protection through proper escaping
- CSRF protection (recommended for production)

## 📈 Performance Optimizations

- Minified CSS and JavaScript (recommended for production)
- Optimized images
- Lazy loading for images
- Efficient CSS animations
- Minimal JavaScript footprint

## 🌐 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📄 License

This project is for educational purposes. Please ensure you have proper licenses for any third-party assets or models used.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support or questions, please contact the development team or create an issue in the repository.

---

**Note**: This is a professional-grade website template. The AI model and medical functionality should be properly validated and tested before use in production environments.
