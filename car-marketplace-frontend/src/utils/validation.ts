// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation (Vietnamese format)
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+84|0)[3-9]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Password validation
export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^.{6,}$/;
  return passwordRegex.test(password);
};

// Price validation (positive number)
export const isValidPrice = (price: number): boolean => {
  return price > 0 && price <= 50000000000; // Max 50 billion VND
};

// Year validation (car year)
export const isValidYear = (year: number): boolean => {
  const currentYear = new Date().getFullYear();
  return year >= 1990 && year <= currentYear + 1;
};

// Mileage validation
export const isValidMileage = (mileage: number): boolean => {
  return mileage >= 0 && mileage <= 1000000; // Max 1 million km
};

// Required field validation
export const isRequired = (value: unknown): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

// String length validation
export const isValidLength = (
  value: string,
  min: number,
  max: number
): boolean => {
  const length = value.trim().length;
  return length >= min && length <= max;
};

// Form validation errors
export interface ValidationError {
  field: string;
  message: string;
}

// Validate login form
export const validateLoginForm = (
  email: string,
  password: string
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!isRequired(email)) {
    errors.push({ field: 'email', message: 'Email là bắt buộc' });
  } else if (!isValidEmail(email)) {
    errors.push({ field: 'email', message: 'Email không hợp lệ' });
  }

  if (!isRequired(password)) {
    errors.push({ field: 'password', message: 'Mật khẩu là bắt buộc' });
  }

  return errors;
};

// Validate register form
export const validateRegisterForm = (
  email: string,
  password: string,
  confirmPassword: string,
  name: string,
  phone?: string
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!isRequired(name)) {
    errors.push({ field: 'name', message: 'Họ tên là bắt buộc' });
  } else if (!isValidLength(name, 2, 50)) {
    errors.push({ field: 'name', message: 'Họ tên phải từ 2-50 ký tự' });
  }

  if (!isRequired(email)) {
    errors.push({ field: 'email', message: 'Email là bắt buộc' });
  } else if (!isValidEmail(email)) {
    errors.push({ field: 'email', message: 'Email không hợp lệ' });
  }

  if (!isRequired(password)) {
    errors.push({ field: 'password', message: 'Mật khẩu là bắt buộc' });
  } else if (!isValidPassword(password)) {
    errors.push({
      field: 'password',
      message: 'Mật khẩu phải có ít nhất 6 ký tự',
    });
  }

  if (password !== confirmPassword) {
    errors.push({
      field: 'confirmPassword',
      message: 'Xác nhận mật khẩu không khớp',
    });
  }

  if (phone && !isValidPhone(phone)) {
    errors.push({ field: 'phone', message: 'Số điện thoại không hợp lệ' });
  }

  return errors;
};

// Validate car form
export const validateCarForm = (carData: {
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  description: string;
  location: string;
}): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!isRequired(carData.title)) {
    errors.push({ field: 'title', message: 'Tiêu đề là bắt buộc' });
  } else if (!isValidLength(carData.title, 10, 100)) {
    errors.push({ field: 'title', message: 'Tiêu đề phải từ 10-100 ký tự' });
  }

  if (!isRequired(carData.brand)) {
    errors.push({ field: 'brand', message: 'Hãng xe là bắt buộc' });
  }

  if (!isRequired(carData.model)) {
    errors.push({ field: 'model', message: 'Dòng xe là bắt buộc' });
  }

  if (!isValidYear(carData.year)) {
    errors.push({ field: 'year', message: 'Năm sản xuất không hợp lệ' });
  }

  if (!isValidPrice(carData.price)) {
    errors.push({ field: 'price', message: 'Giá không hợp lệ' });
  }

  if (!isValidMileage(carData.mileage)) {
    errors.push({ field: 'mileage', message: 'Số km đã đi không hợp lệ' });
  }

  if (!isRequired(carData.description)) {
    errors.push({ field: 'description', message: 'Mô tả là bắt buộc' });
  } else if (!isValidLength(carData.description, 50, 1000)) {
    errors.push({
      field: 'description',
      message: 'Mô tả phải từ 50-1000 ký tự',
    });
  }

  if (!isRequired(carData.location)) {
    errors.push({ field: 'location', message: 'Địa điểm là bắt buộc' });
  }

  return errors;
};
