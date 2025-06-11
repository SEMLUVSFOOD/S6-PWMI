export function onButtonSelected(label) {
    const notification = document.querySelector('.popUpNotification');
    const notificationText = document.querySelector('.popUpNotificationText');
  
    // Set notification text based on label
    let message = '';
    switch (label) {
      case '1':
      case 1:
        message = 'Nederlands geselecteerd!';
        break;
      case '2':
      case 2:
        message = 'English selected!';
        break;
      case '3':
      case 3:
        message = 'العربية مختارة';
        break;
      default:
        message = 'Onbekende selectie';
    }
  
    // Apply text and show the notification
    notificationText.innerHTML = message;
    notification.style.display = 'flex';
  
    // Reset animation if it's already running
    notificationText.classList.remove('progress-animate');
    void notificationText.offsetWidth; // force reflow
    notificationText.classList.add('progress-animate');
  
    // Hide after 3 seconds
    setTimeout(() => {
      notification.style.display = 'none';
    }, 3000);
  }
  