# AlgorithmeTN

[![React Native](https://img.shields.io/badge/React_Native-0.77.1-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.4-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-15.4.0-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Material Design](https://img.shields.io/badge/Material%20Design-3-757575?style=for-the-badge&logo=material-design&logoColor=white)](https://m3.material.io/)

> [!CAUTION]
> **PROJECT STATUS: DISCONTINUED** 
> 
> This project is currently discontinued because it didn't go as I planned. If I see any contributions, I will get back to work on the project.

**A comprehensive educational platform for Tunisian Baccalaureate students to master algorithms and programming concepts**

---

## 🌟 About

> [!NOTE]
> **AlgoTN** is a modern React Native application specifically designed for Tunisian high school students preparing for their Baccalaureate exams.

The app provides an interactive platform to learn, practice, and share algorithms across different educational tracks:

- 🧪 **Sciences Naturelles** (Natural Sciences)
- 💻 **Sciences Informatiques** (Computer Science) 
- 📊 **Économie & Gestion** (Economics & Management)

### 🎯 Mission
> To democratize algorithm education in Tunisia by providing accessible, interactive, and culturally relevant learning materials in multiple languages.

## ✨ Features

### 📚 Educational Platform
```yaml
Grade Levels: [1ère, 2ème, 3ème, BAC]
Tracks: [Sciences Naturelles, Sciences Informatiques, Économie & Gestion]
Content: Interactive algorithms with step-by-step explanations
Progress: Bookmark system and achievement tracking
```

### 💻 Advanced Code Editor
```yaml
Languages: [JavaScript, Python, Java, C++, PHP, SQL, Custom "algo" pseudocode]
Features: [Syntax highlighting, Real-time editing, Copy/paste, Undo/redo]
Integration: Seamless WebView integration with native app
```

### 🌐 Social & Sharing
```yaml
Community: [Comments system, Like/bookmark functionality]
Profiles: [User statistics, Achievements, Activity feeds]
Notifications: Real-time updates and notifications
```

### 🎨 Modern UX/UI
```yaml
Design: Material Design 3 with React Native Paper
Themes: [Dark mode, Light mode, System integration]
Animation: Smooth transitions with Reanimated 3
Responsive: Adaptive design for all screen sizes
```


## 🚀 Installation

> [!IMPORTANT]
> **Prerequisites:** Ensure you have the following installed before proceeding

```mermaid
flowchart TD
    A[Node.js >= 16.x] --> B[Yarn Package Manager]
    B --> C[React Native CLI]
    C --> D[Android Studio]
    C --> E[Xcode macOS only]
    D --> F[Ready to Build!]
    E --> F
```

### ⚡ Quick Start

> [!TIP]
> Follow these steps to get the project running locally

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/AlgorithmeTN.git
cd AlgorithmeTN

# 2. Install dependencies
yarn install

# 3. Install iOS dependencies (macOS only)
cd ios && pod install && cd ..

# 4. Start Metro bundler
yarn start

# 5. Run on your platform
yarn android  # For Android
yarn ios      # For iOS (macOS only)
```

### 🔧 Environment Setup

> [!WARNING]
> **Required Configuration:** These steps are mandatory for the app to function properly

#### Firebase Configuration
```bash
# Add your Firebase config files to:
# 📁 android/app/google-services.json
# 📁 ios/AlgoTN/GoogleService-Info.plist
```

#### OneSignal Setup
```bash
# Configure OneSignal App ID in your environment variables
ONESIGNAL_APP_ID=your_app_id_here
```

#### Appodeal Integration
```bash
# Set up Appodeal keys for monetization
APPODEAL_API_KEY=your_api_key_here
```

## 🏗️ Project Structure

```
AlgorithmeTN/
├── 📁 src/
│   ├── 📁 components/           # Reusable UI components
│   │   ├── 📁 baseview/        # Base layout component
│   │   ├── 📁 code-editor-webview/  # Custom code editor with algo syntax
│   │   ├── 📁 modals/          # Modal components (image picker, etc.)
│   │   ├── 📁 numbered-list/   # Instruction list component
│   │   └── 📁 spacer/          # Layout spacing utilities
│   ├── 📁 config/              # Configuration files
│   │   ├── 📁 i18n/           # Internationalization (FR/EN/AR)
│   │   ├── 📁 navigation/     # Navigation setup & deep linking
│   │   ├── 📁 storage/        # MMKV storage configuration
│   │   └── 📄 dimensions.ts    # Responsive design helpers
│   ├── 📁 screens/             # Application screens
│   │   ├── 📁 algo/           # Algorithm viewing & editing
│   │   ├── 📁 home/           # Main app screens
│   │   ├── 📁 login/          # Authentication flow
│   │   └── 📁 settings/       # User settings & preferences
│   ├── 📁 types/              # TypeScript type definitions
│   └── 📁 utils/              # Helper functions & utilities
├── 📁 android/                # Android-specific code
├── 📁 ios/                    # iOS-specific code
└── 📄 package.json           # Dependencies & scripts
```

## 🤝 Contributing

> [!NOTE]
> **We welcome contributions!** This project needs community support to continue development.

### 🐛 How to Contribute

```mermaid
gitGraph
    commit id: "Fork Repo"
    branch feature/amazing-feature
    checkout feature/amazing-feature
    commit id: "Add Feature"
    commit id: "Add Tests"
    commit id: "Update Docs"
    checkout main
    merge feature/amazing-feature
    commit id: "Feature Merged!"
```

#### Step-by-step guide:

1. **🍴 Fork** the repository
2. **🌿 Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **📝 Follow** TypeScript and React Native best practices
4. **🧪 Test** your changes thoroughly
5. **💾 Commit** with clear messages: `git commit -m 'Add amazing feature'`
6. **🚀 Push** to your branch: `git push origin feature/amazing-feature`
7. **📬 Submit** a pull request

> [!TIP]
> **Code Style:** Follow the existing patterns in the codebase and use TypeScript strictly

## 🔮 Future Roadmap

> [!NOTE]
> **If development resumes**, these features are planned for future releases

```mermaid
gantt
    title AlgoTN Development Roadmap
    dateFormat  YYYY-MM-DD
    section Phase 1
    Arabic Language Support     :done, arabic, 2024-01-01, 2024-03-01
    Offline Functionality      :active, offline, 2024-03-01, 2024-06-01
    
    section Phase 2
    AI Recommendations         :ai, 2024-06-01, 2024-09-01
    Video Tutorials            :video, 2024-07-01, 2024-10-01
    
    section Phase 3
    Collaborative Features     :collab, 2024-09-01, 2024-12-01
    Progressive Web App        :pwa, 2024-10-01, 2025-01-01
```

### Planned Features:

- [ ] 🌍 **Arabic language support** with full RTL layout
- [ ] 📱 **Offline functionality** for algorithm access without internet  
- [ ] 🎮 **Gamification system** with points and achievements
- [ ] 🤖 **AI-powered recommendations** for personalized learning
- [ ] 🎥 **Video tutorials** integration for visual learners
- [ ] 👥 **Collaborative features** for group learning
- [ ] 📤 **Export functionality** for sharing algorithms
- [ ] 📊 **Advanced analytics** for learning progress
- [ ] 🌐 **Progressive Web App** version for web access

---

## ‍💻 Author

**M. Rayen Sbai** - *Hobbyist Android Developer from Tunisia*

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/SectionTN)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/mohamed-rayen-sbai)

---

> [!NOTE]
> **Made with ❤️ for Tunisian students preparing for their Baccalaureate exams**
> 
> *Empowering the next generation of Tunisian developers and computer scientists*
