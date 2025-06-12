// 🔄 Keep track of current content
let currentSlide = 0;

const contentArray = [
  "poster here",
  "calendar here",
  "painting here",
  "brochure here",
  "flyer here"
];

export function onButtonSelected(label) {
  const notification = document.querySelector('.popUpNotification');
  const notificationText = document.querySelector('.popUpNotificationText');

  const message = getLanguageMessage(label);
  notificationText.innerHTML = message;
  notification.style.display = 'flex';

  // Restart animation
  notificationText.classList.remove('progress-animate');
  void notificationText.offsetWidth;
  notificationText.classList.add('progress-animate');

  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);

  // ✅ Handle content switching for < (4) and > (5)
  handleContent(label);
}

// ✅ Helper to return message text
function getLanguageMessage(label) {
  switch (label) {
    case '1':
    case 1:
      return 'Nederlands geselecteerd!';
    case '2':
    case 2:
      return 'English selected!';
    case '3':
    case 3:
      return 'العربية مختارة';
    case '4':
    case 4:
      return 'Selected Previous!';
    case '5':
    case 5:
      return 'Selected Next!';
    default:
      return 'Onbekende selectie';
  }
}

// ✅ Update visible content based on navigation
function handleContent(label) {
  if (label === '4' || label === 4) {
    currentSlide = (currentSlide - 1 + contentArray.length) % contentArray.length;
  } else if (label === '5' || label === 5) {
    currentSlide = (currentSlide + 1) % contentArray.length;
  }

  const contentElement = document.querySelector('.itemContent');
  if (contentElement) {
    contentElement.textContent = contentArray[currentSlide];
  }
}
