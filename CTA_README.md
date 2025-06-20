# PWMI CTA Screen

## Overview
The CTA (Call to Action) screen is the entry point for the PWMI interactive experience. It uses hand tracking to detect when a user waves their hand, then automatically redirects to the main interactive interface.

## How to Use

### Starting the Application
1. Open `cta.html` in a modern web browser
2. Allow camera access when prompted
3. Position yourself in front of the camera
4. Wave your hand horizontally to trigger the transition

### Wave Detection
The system detects hand waving by:
- Tracking horizontal hand movement
- Ensuring minimal vertical movement (hand stays at same height)
- Detecting direction changes (left-to-right and right-to-left movement)
- Requiring at least 2 direction changes for a valid wave

### Visual Feedback
- Hand landmarks are displayed with subtle green lines and golden dots
- The welcome message glows when a wave is detected
- A loading screen appears during transition to the main interface

### Technical Details
- Uses MediaPipe Hands for hand tracking
- Wave detection algorithm analyzes hand position history
- Requires 0.5-2 seconds of movement for detection
- Prevents multiple detections with 1-second cooldown

## Files
- `cta.html` - Main CTA screen with wave detection
- `cta-style.css` - Styling for the CTA screen
- `index.html` - Main interactive interface (redirected to after wave)

## Browser Requirements
- Modern browser with WebRTC support
- Camera access permissions
- JavaScript enabled

## Troubleshooting
- If wave detection isn't working, try moving your hand more slowly and deliberately
- Ensure good lighting for better hand tracking
- Make sure your hand is clearly visible to the camera
- Try waving from left to right or right to left in a smooth motion 