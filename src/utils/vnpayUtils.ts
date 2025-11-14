/**
 * VNPay utility functions for processing payment results
 */

import type { VNPayReturnParams, PaymentResult } from '../types';

// VNPay response codes and their meanings
export const VNP_RESPONSE_CODES: Record<string, string> = {
  '00': 'Giao dịch thành công',
  '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
  '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
  '10': 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
  '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
  '12': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
  '13': 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.',
  '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
  '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
  '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
  '75': 'Ngân hàng thanh toán đang bảo trì.',
  '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch',
  '99': 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)',
};

/**
 * Parse URL search params to VNPay return parameters
 * @param searchParams URLSearchParams from useSearchParams hook
 * @returns VNPayReturnParams object
 */
export const parseVNPayParams = (
  searchParams: URLSearchParams
): VNPayReturnParams => {
  return {
    vnp_Amount: searchParams.get('vnp_Amount') || '',
    vnp_BankCode: searchParams.get('vnp_BankCode') || undefined,
    vnp_BankTranNo: searchParams.get('vnp_BankTranNo') || undefined,
    vnp_CardType: searchParams.get('vnp_CardType') || undefined,
    vnp_OrderInfo: searchParams.get('vnp_OrderInfo') || '',
    vnp_PayDate: searchParams.get('vnp_PayDate') || '',
    vnp_ResponseCode: searchParams.get('vnp_ResponseCode') || '',
    vnp_TmnCode: searchParams.get('vnp_TmnCode') || '',
    vnp_TransactionNo: searchParams.get('vnp_TransactionNo') || undefined,
    vnp_TransactionStatus: searchParams.get('vnp_TransactionStatus') || '',
    vnp_TxnRef: searchParams.get('vnp_TxnRef') || '',
    vnp_SecureHash: searchParams.get('vnp_SecureHash') || '',
  };
};

/**
 * Process VNPay parameters and create payment result
 * @param vnpayParams VNPay return parameters
 * @returns PaymentResult object
 */
export const processPaymentResult = (
  vnpayParams: VNPayReturnParams
): PaymentResult => {
  const isSuccess =
    vnpayParams.vnp_ResponseCode === '00' &&
    vnpayParams.vnp_TransactionStatus === '00';
  const amount = parseInt(vnpayParams.vnp_Amount) / 100; // VNPay returns amount in cents
  const message =
    VNP_RESPONSE_CODES[vnpayParams.vnp_ResponseCode] || 'Lỗi không xác định';

  return {
    success: isSuccess,
    amount,
    orderInfo: decodeURIComponent(vnpayParams.vnp_OrderInfo),
    payDate: formatVNPayDate(vnpayParams.vnp_PayDate),
    transactionRef: vnpayParams.vnp_TxnRef,
    responseCode: vnpayParams.vnp_ResponseCode,
    message,
  };
};

/**
 * Format VNPay date string to readable format
 * @param vnpayDate VNPay date string (yyyyMMddHHmmss)
 * @returns Formatted date string
 */
export const formatVNPayDate = (vnpayDate: string): string => {
  if (!vnpayDate || vnpayDate.length !== 14) {
    return 'Không xác định';
  }

  try {
    const year = vnpayDate.substring(0, 4);
    const month = vnpayDate.substring(4, 6);
    const day = vnpayDate.substring(6, 8);
    const hour = vnpayDate.substring(8, 10);
    const minute = vnpayDate.substring(10, 12);
    const second = vnpayDate.substring(12, 14);

    const date = new Date(
      `${year}-${month}-${day}T${hour}:${minute}:${second}`
    );

    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch (error) {
    console.error('Error formatting VNPay date:', error);
    return 'Không xác định';
  }
};

/**
 * Format currency for display
 * @param amount Amount in VND
 * @returns Formatted currency string
 */
export const formatPaymentAmount = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

/**
 * Get payment status color for UI
 * @param success Whether payment was successful
 * @returns MUI color string
 */
export const getPaymentStatusColor = (
  success: boolean
): 'success' | 'error' => {
  return success ? 'success' : 'error';
};

/**
 * Get payment status icon name
 * @param success Whether payment was successful
 * @returns Icon component name
 */
export const getPaymentStatusIcon = (success: boolean) => {
  return success ? 'CheckCircle' : 'Error';
};

/**
 * Validate VNPay parameters (basic validation)
 * @param vnpayParams VNPay return parameters
 * @returns true if parameters appear valid
 */
export const validateVNPayParams = (
  vnpayParams: VNPayReturnParams
): boolean => {
  return !!(
    vnpayParams.vnp_Amount &&
    vnpayParams.vnp_OrderInfo &&
    vnpayParams.vnp_PayDate &&
    vnpayParams.vnp_ResponseCode &&
    vnpayParams.vnp_TmnCode &&
    vnpayParams.vnp_TransactionStatus &&
    vnpayParams.vnp_TxnRef &&
    vnpayParams.vnp_SecureHash
  );
};
