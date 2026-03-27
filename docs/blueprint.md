# **App Name**: SOS Emergency

## Core Features:

- SOS Trigger & Cancellation: A large central SOS button that triggers a help sequence on a 1.5-second long press (anti-misoperation). Allows cancellation within a 5-second window post-trigger.
- Emergency Contact Management: Manage a list of emergency contacts, including adding, editing, deleting, and designating a primary contact. Displays contact name and phone number in a card-style UI.
- Location & Status Display: Displays the user's current location (city + coordinates) and location acquisition status. Shows 'Sending Request…' during distress message transmission and success/failure confirmations.
- Emergency Communication Settings: Configure automatic actions upon SOS trigger, such as sending SMS, making calls, uploading real-time location, and choosing danger levels (low, medium, high) with varying actions.
- SOS History Log: Maintains a chronological record of all past SOS requests, detailing time, location, and transmission status (success/failure) for review.
- Onboarding & Permission Guide: A multi-page guided introduction for first-time users, explaining the app's purpose, usage instructions, and requesting necessary permissions (location, notifications, SMS/call).

## Style Guidelines:

- The visual scheme is a dark, high-contrast palette to convey urgency. The primary accent is a vibrant red (HSL: 0, 100%, 60% / Hex: #FF3333) to highlight critical actions. The background is a very dark, slightly reddish gray (HSL: 0, 15%, 8% / Hex: #191616) for stark contrast. A secondary accent, a bright orange-yellow (HSL: 30, 90%, 70% / Hex: #FFD47F), is used for attention-grabbing elements and warnings.
- The single font 'Inter' (sans-serif) is recommended for both headlines and body text, providing a clean, modern, and highly legible aesthetic suitable for quick information consumption and high-stress situations. It aligns with the minimalist and high-contrast style.
- Use clear, universally recognizable icons that are bold and generously sized. Symbols for help, call, message, location, success, and warning should be visually unambiguous to aid rapid comprehension in an emergency.
- The core SOS button must be the central, dominant visual element on the homepage. All user interactions should be designed to require two steps or less for critical actions, prioritizing quick access and minimizing cognitive load. Layouts are optimized for mobile-first use, ensuring large tappable areas and intuitive navigation.
- Implement a 'breathing' pulse animation for the SOS button to subtly indicate its active state. Provide immediate visual and haptic feedback (vibration, press-down animation) upon button interaction. Trigger full-screen, high-contrast, flashing visual alerts during the critical SOS sending phase to emphasize urgency.