export function onButtonSelected(label) {
    const notification = document.querySelector('.popUpNotification');
    const notificationText = document.querySelector('.popUpNotificationText');
  
    const message = getLanguageMessage(label); // ⬅️ Use the new helper function
  
    notificationText.innerHTML = message;
    notification.style.display = 'flex';
  
    // Restart animation
    notificationText.classList.remove('progress-animate');
    void notificationText.offsetWidth;
    notificationText.classList.add('progress-animate');
  
    setTimeout(() => {
      notification.style.display = 'none';
    }, 3000);
  }
  
  // ✅ New helper function
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
      default:
        return 'Onbekende selectie';
    }
  }
  