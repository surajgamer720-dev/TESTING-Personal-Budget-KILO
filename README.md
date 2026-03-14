# MY BUDGET - Personal Budget Tracking PWA

A comprehensive Progressive Web Application for tracking personal finances, managing budgets, and analyzing spending habits with beautiful visualizations and smart insights.

![MY BUDGET Logo](icons/icon.svg)

## ✨ Features

### 🔐 User Authentication & Profiles
- Email/password login and registration
- Google social login (optional)
- Secure session handling
- User profile management
- Data isolation per user

### 💰 Transaction Management
- Add income or expense transactions
- Edit or delete transactions
- Add notes and descriptions
- Categories and subcategories
- Optional receipt/image attachments
- Transaction tagging

### 📊 Smart Categorization
Built-in categories:
- 🍔 Food & Dining
- 🚗 Transportation
- 🛍️ Shopping
- 📄 Bills & Utilities
- 🎬 Entertainment
- 🏥 Health
- 💰 Savings
- 💼 Salary
- 📈 Investments
- 💻 Freelance
- 💵 Other Income

### 🎯 Budget Management
- Set monthly/weekly/yearly budgets
- Category-specific budgets
- Visual progress tracking
- Alert thresholds (80-90%)
- Budget exceeded warnings

### 🔔 Notifications System
- Budget nearing limit alerts
- Budget exceeded notifications
- Daily spending summaries
- Weekly financial insights
- Push notification support

### 📈 Data Visualization
- **Pie Chart** - Expense distribution by category
- **Donut Chart** - Income sources distribution
- **Line Chart** - Income vs Expenses over time
- **Area Chart** - Spending growth trends
- **Bar Chart** - Daily transaction history
- **Stacked Bar Chart** - Category comparison

### 🔍 Powerful Filtering
Filter all data by:
- Day
- Week
- Month
- Year
- Custom date range

Filters apply to:
- Dashboard data
- Charts and analytics
- Transaction history

### 🎨 Multiple Themes
- 🌙 Dark/Black theme
- ☀️ Light/White theme
- 🌈 Neon theme (vibrant futuristic)
- 📝 Minimal theme

### 📱 PWA Features
- Installable on mobile and desktop
- Offline functionality
- Background sync
- Push notifications
- Fast loading performance

### 📤 Data Export
- CSV export
- Excel export
- PDF reports
- Transaction history
- Budget summaries

### 🧠 Smart Insights
- Financial health score
- Spending trend analysis
- Category insights
- Savings suggestions
- Expense predictions

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js (for local development server)

### Installation

1. **Clone or download the project**
   ```bash
   git clone https://github.com/yourusername/budgetwise.git
   cd budgetwise
   ```

2. **Start a local server**
   
   Using Python:
   ```bash
   python -m http.server 8000
   ```
   
   Using Node.js:
   ```bash
   npx http-server
   ```
   
   Using PHP:
   ```bash
   php -S localhost:8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

4. **Install as PWA**
   - Click the install button in the address bar
   - Or use "Add to Home Screen" on mobile

## 📁 Project Structure

```
budgetwise/
├── index.html          # Main HTML file
├── styles.css          # All CSS styles with themes
├── app.js              # Main JavaScript application
├── manifest.json       # PWA manifest
├── sw.js               # Service worker
├── icons/              # App icons
│   └── icon.svg        # Main icon
└── README.md           # This file
```

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables
- **JavaScript (ES6+)** - Application logic
- **Chart.js** - Data visualization
- **SheetJS (XLSX)** - Excel export
- **jsPDF** - PDF generation
- **Service Worker API** - Offline support
- **LocalStorage** - Data persistence

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes

### Navigation
- **Desktop**: Sidebar navigation
- **Mobile**: Bottom navigation bar

## 🎨 Theme Customization

Themes can be switched instantly via:
- Settings page
- Theme toggle button in header

### CSS Variables
Each theme uses CSS variables for easy customization:
```css
:root {
    --primary: #6366f1;
    --bg-primary: #0f172a;
    --text-primary: #f1f5f9;
    /* ... more variables */
}
```

## 📊 Charts & Analytics

### Dashboard Charts
- Expense distribution pie chart
- Income vs expenses trend line

### Analytics Page
- Income sources donut chart
- Spending trends area chart
- Daily transactions bar chart
- Category comparison stacked bar

### Financial Health Score
Calculated based on:
- Savings rate (20%)
- Budget adherence (15%)
- Transaction consistency (10%)
- Category diversity (5%)

## 🔔 Notifications

### Budget Alerts
- Warning at 80-90% of budget
- Alert when budget exceeded

### Push Notifications
- Requires user permission
- Works in background
- Click to open app

## 📤 Export Options

### CSV Export
- All transaction data
- Compatible with spreadsheets

### Excel Export
- Formatted worksheets
- Multiple columns
- Easy analysis

### PDF Reports
- Professional formatting
- Summary statistics
- Transaction list

## 🔒 Data Security

- Data stored locally (LocalStorage)
- No server required
- User data isolation
- Secure authentication flow

## 🌐 Browser Support

| Browser | Version |
|---------|---------|
| Chrome  | 60+     |
| Firefox | 55+     |
| Safari  | 11+     |
| Edge    | 79+     |

## 📈 Future Enhancements

- [ ] Cloud sync with backend
- [ ] Multi-currency support
- [ ] Recurring transactions
- [ ] Bill reminders
- [ ] Investment tracking
- [ ] Goal setting
- [ ] Family sharing
- [ ] API integrations
- [ ] Advanced reports
- [ ] Machine learning insights

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- [Chart.js](https://www.chartjs.org/) for beautiful charts
- [Font Awesome](https://fontawesome.com/) for icons
- [Google Fonts](https://fonts.google.com/) for Inter font
- [SheetJS](https://sheetjs.com/) for Excel export
- [jsPDF](https://parall.ax/products/jspdf) for PDF generation

## 📧 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - email@example.com

Project Link: [https://github.com/yourusername/budgetwise](https://github.com/yourusername/budgetwise)

## ⭐ Support

If you find this project helpful, please give it a star on GitHub!

---

Made with ❤️ by BudgetWise Team