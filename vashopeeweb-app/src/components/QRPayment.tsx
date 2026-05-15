import { useState } from 'react';

interface Props {
  orderCode: string;
  amount: number;
  bankId?: string;
  accountNo?: string;
  accountName?: string;
}

const BANK_ID = 'vietcombank';
const ACCOUNT_NO = '1017588888';
const ACCOUNT_NAME = 'NGUYEN VAN A';

export default function QRPayment({
  orderCode,
  amount,
  bankId = BANK_ID,
  accountNo = ACCOUNT_NO,
  accountName = ACCOUNT_NAME,
}: Props) {
  const [copied, setCopied] = useState<string | null>(null);

  const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(orderCode)}&accountName=${encodeURIComponent(accountName)}`;

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-3">Quét mã QR để thanh toán</p>
        <img
          src={qrUrl}
          alt="QR thanh toán VietQR"
          className="w-52 h-52 mx-auto rounded-lg border"
        />
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
          <span className="text-gray-500">Ngân hàng</span>
          <span className="font-medium text-gray-800 uppercase">{bankId}</span>
        </div>
        <div className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
          <span className="text-gray-500">Số tài khoản</span>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-800">{accountNo}</span>
            <button
              onClick={() => copy(accountNo, 'account')}
              className="text-primary hover:text-primary-dark text-xs"
            >
              {copied === 'account' ? '✓ Đã copy' : 'Copy'}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
          <span className="text-gray-500">Số tiền</span>
          <span className="font-bold text-primary">{amount.toLocaleString('vi-VN')}₫</span>
        </div>
        <div className="flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded px-3 py-2">
          <span className="text-gray-600 font-medium">Nội dung CK</span>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-800">{orderCode}</span>
            <button
              onClick={() => copy(orderCode, 'code')}
              className="text-primary hover:text-primary-dark text-xs"
            >
              {copied === 'code' ? '✓ Đã copy' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      <p className="text-xs text-red-500 text-center font-medium">
        ⚠️ Nhập đúng nội dung chuyển khoản để đơn hàng được xác nhận tự động
      </p>
    </div>
  );
}
