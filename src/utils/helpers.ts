// Format currency (VND)
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

// Format number with thousand separators
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('vi-VN').format(num);
};

// Format date
export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) {
    return 'Chưa có thông tin';
  }

  const d = new Date(date);

  // Check if date is valid
  if (isNaN(d.getTime())) {
    return 'Ngày không hợp lệ';
  }

  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
};

// Format relative time (e.g., "2 days ago")
export const formatRelativeTime = (
  date: string | Date | null | undefined
): string => {
  if (!date) {
    return 'Chưa có thông tin';
  }

  const now = new Date();
  const past = new Date(date);

  // Check if date is valid
  if (isNaN(past.getTime())) {
    return 'Ngày không hợp lệ';
  }

  const diffMs = now.getTime() - past.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffDays > 0) {
    return `${diffDays} ngày trước`;
  } else if (diffHours > 0) {
    return `${diffHours} giờ trước`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} phút trước`;
  } else {
    return 'Vừa xong';
  }
};

// Check if date is valid
export const isValidDate = (
  date: string | Date | null | undefined
): boolean => {
  if (!date) return false;
  const d = new Date(date);
  return !isNaN(d.getTime());
};

// Get file extension
export const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};

// Validate file type for image uploads
export const isValidImageType = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return validTypes.includes(file.type);
};

// Validate file size (in MB)
export const isValidFileSize = (file: File, maxSizeMB: number): boolean => {
  const fileSizeMB = file.size / (1024 * 1024);
  return fileSizeMB <= maxSizeMB;
};

// Generate random ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Debounce function
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Deep clone object
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

// Remove undefined/null values from object
export const cleanObject = (
  obj: Record<string, unknown>
): Record<string, unknown> => {
  const cleaned: Record<string, unknown> = {};
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (value !== undefined && value !== null && value !== '') {
      cleaned[key] = value;
    }
  });
  return cleaned;
};
