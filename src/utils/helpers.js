export const validateEmail = (email) => {
  const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  return emailPattern.test(email);
};

export const getBrowserInfo = () => {
  const ua = navigator.userAgent;
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  return 'Navigateur inconnu';
};

export const getOSInfo = () => {
  const platform = navigator.platform;
  const ua = navigator.userAgent;
  if (platform.includes('Win')) return 'Windows';
  if (platform.includes('Mac')) return 'macOS';
  if (platform.includes('Linux')) return 'Linux';
  if (/Android/i.test(ua)) return 'Android';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
  return 'Système inconnu';
};

export const getCurrentTime = () => {
  const now = new Date();
  return now.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};