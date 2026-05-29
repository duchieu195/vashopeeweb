import { List, useTable, DeleteButton } from '@refinedev/antd';
import { useUpdate } from '@refinedev/core';
import { Table, Space, Button, Switch, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface Coupon {
  id: string;
  code: string;
  discount: number;
  is_active: boolean;
  created_at: string;
}

export default function CouponList() {
  const { tableProps } = useTable({
    resource: 'coupons',
    sorters: { initial: [{ field: 'created_at', order: 'desc' }] },
  });
  const { mutate: update } = useUpdate();
  const navigate = useNavigate();

  const toggleActive = (record: Coupon) => {
    update({ resource: 'coupons', id: record.id, values: { is_active: !record.is_active } });
  };

  return (
    <List headerButtons={
      <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/coupons/create')}>
        Thêm mã giảm giá
      </Button>
    }>
      <Table {...(tableProps as object)} rowKey="id">
        <Table.Column title="Mã" dataIndex="code" render={(v: string) => <Tag color="blue">{v}</Tag>} />
        <Table.Column
          title="Giảm giá"
          dataIndex="discount"
          width={120}
          render={(v: number) => <strong>{v}%</strong>}
        />
        <Table.Column
          title="Trạng thái"
          dataIndex="is_active"
          width={120}
          render={(v: boolean, record: Coupon) => (
            <Switch
              checked={v}
              checkedChildren="Bật"
              unCheckedChildren="Tắt"
              onChange={() => toggleActive(record)}
            />
          )}
        />
        <Table.Column
          title="Ngày tạo"
          dataIndex="created_at"
          width={160}
          render={(v: string) => String(v ?? '').slice(0, 10)}
        />
        <Table.Column
          title="Thao tác"
          width={80}
          render={(_, record: Coupon) => (
            <Space>
              <DeleteButton hideText size="small" resource="coupons" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
}
