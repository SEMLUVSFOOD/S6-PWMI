# Silhouette + Hand Glow Interactive Display


### Overzicht
Dit project creëert een interactief display dat als simpele versie van Playstation iToy fungeert om handbewegingen te detecteren en een silhoueteffect te creëren om het spiegelbeeld van de gebruiker te laten zien. Gebruikers kunnen interacteren met knoppen op het scherm door hun handen erboven te hoveren, wat een timer animation en een activatie activeert.

### Functies
- Real-time handtracking met MediaPipe Hands
- Lichaamssilhouetdetectie met TensorFlow BodyPix
- Interactief knoppensysteem met hover-detectie
- Meertalige ondersteuning (Engels, Nederlands, Arabisch)
- Geanimeerde feedback voor gebruikersinteracties
- Navigatiesysteem voor inhoud

### Technische Vereisten
- Moderne webbrowser met camera-toegang
- WebGL-ondersteuning
- Cameratoestemmingen

### Dependencies
- TensorFlow.js (v4.11.0)
- BodyPix (v2.2.0)
- MediaPipe Hands
- MediaPipe Drawing Utils

### Installatie
1. Clone de repository
2. Open `index.html` in een moderne webbrowser
3. Sta camera-toegang toe wanneer daarom wordt gevraagd
4. Gebruik je handen om met de interface te interacteren

### Gebruik
- Houd je hand boven knoppen om te interacteren
- Wacht tot de cirkelanimatie is voltooid om acties te activeren
- Navigeer door de inhoud met de pijlknoppen
- Schakel tussen talen met de taalselectieknoppen