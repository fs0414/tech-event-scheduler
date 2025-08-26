
export function validateEmail(email: string): { isValid: boolean; sanitized: string } {
  const sanitized = email.toLowerCase().trim();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  return {
    isValid: emailRegex.test(sanitized),
    sanitized
  };
}

export function validateEventTitle(title: string): { isValid: boolean; sanitized: string; error?: string } {
  const sanitized = title?.trim() || '';
  
  if (sanitized.length === 0) {
    return { isValid: false, sanitized, error: 'イベント名は必須です' };
  }
  
  if (sanitized.length > 200) {
    return { isValid: false, sanitized, error: 'イベント名は200文字以内で入力してください' };
  }
  
  return { isValid: true, sanitized };
}

export function validateUrl(url: string): { isValid: boolean; sanitized: string; error?: string } {
  const sanitized = url?.trim() || '';
  
  if (sanitized === '') {
    return { isValid: true, sanitized };
  }
  
  try {
    new URL(sanitized);
    return { isValid: true, sanitized };
  } catch {
    return { isValid: false, sanitized, error: '無効なURL形式です' };
  }
}

export function validateAttendance(attendance: number): { isValid: boolean; error?: string } {
  if (!Number.isInteger(attendance) || attendance < 0 || attendance > 10000) {
    return { 
      isValid: false, 
      error: '出席者数は0以上10000以下の整数である必要があります' 
    };
  }
  
  return { isValid: true };
}

export function validateId(id: string): { isValid: boolean; error?: string } {
  // UUIDまたは特定のパターンのIDのみ許可
  const idRegex = /^[a-zA-Z0-9\-_]{1,50}$/;
  
  if (!idRegex.test(id)) {
    return { 
      isValid: false, 
      error: '無効なID形式です' 
    };
  }
  
  return { isValid: true };
}
