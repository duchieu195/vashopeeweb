import { List, useTable } from '@refinedev/antd';
import { Table, Tag, Select } from 'antd';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const STATUS_COLOR: Record<string, string> = {
  pending: 'orange', paid: 'blue', confirmed: 'cyan',
  shipping: 'purple', delivered: 'green', cancelled: 'red',
};
const STATUS_LABEL: Record<string, string> = {
  pending: 'Chờ thanh toán', paid: 'Đã thanh toán', confirmed: 'Đã xác nhận',
  shipping: 'Đang giao', delivered: 'Hoàn thành', cancelled: 'Đã huỷ',
};

export default function OrderList() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  const { tableProps } = useTable({
    resource: 'orders',
    sorters: { initial: [{ field: 'created_at', order: 'desc' }] },
    filters: {
      permanent: statusFilter ? [{ field: 'status', operator: 'eq', value: statusFilter }] : [],
    },
  });

  return (
    <List>
      <Select
        placeholder="Lọc theo trạng thái"
        allowClear
        style={{ marginBottom: 16, width: 200 }}
        onChange={setStatusFilter}
        options={Object.entries(STATUS_LABEL).map(([v, l]) => ({ value: v, label: l }))}
      />
      <Table {...(tableProps as object)} rowKey="id" scroll={{ x: 800 }}>
        <Table.Column
          title="Mã đơn"
          dataIndex="payment_code"
          render={(v: string, r: { id: string }) => <Link to={`/orders/${r.id}`}>{v}</Link>}
        />
        <Table.Column title="Khách hàng" dataIndex="customer_name" />
        <Table.Column title="SĐT" dataIndex="customer_phone" />
        <Table.Column
          title="Tổng tiền"
          dataIndex="total_amount"
          render={(v: number) => `${v.toLocaleString('vi-VN')}₫`}
        />
        <Table.Column
          title="Trạng thái"
          dataIndex="status"
          render={(v: string) => <Tag color={STATUS_COLOR[v]}>{STATUS_LABEL[v]}</Tag>}
        />
        <Table.Column
          title="Ngày tạo"
          dataIndex="created_at"
          render={(v: string) => v?.slice(0, 16).replace('T', ' ')}
        />
      </Table>
    </List>
  );
}
