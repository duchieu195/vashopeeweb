import { Show } from '@refinedev/antd';
import { useShow, useUpdate, useDelete } from '@refinedev/core';
import { Descriptions, Tag, Select, Table, Image, Divider, Spin, Alert, Popconfirm, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseClient } from '../../lib/supabase';

const STATUS_LABEL: Record<string, string> = {
  pending: 'Chờ thanh toán', paid: 'Đã thanh toán', confirmed: 'Đã xác nhận',
  shipping: 'Đang giao', delivered: 'Hoàn thành', cancelled: 'Đã huỷ',
};

export default function OrderShow() {
  const { query } = useShow({ resource: 'orders' });
  const { mutate: updateOrder } = useUpdate();
  const { mutate: deleteOrder } = useDelete();
  const navigate = useNavigate();
  const order = query?.data?.data;
  const isLoading = query?.isPending ?? false;
  const [items, setItems] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    if (!order?.id) return;
    supabaseClient
      .from('order_items')
      .select('*')
      .eq('order_id', order.id)
      .then(({ data }) => setItems(data ?? []));
  }, [order?.id]);

  const handleStatusChange = (status: string) => {
    if (!order?.id) return;
    updateOrder({ resource: 'orders', id: order.id, values: { status } });
  };

  const itemColumns = [
    { title: 'Ảnh', dataIndex: 'product_image', render: (v: string) => v ? <Image src={v} width={40} height={40} style={{ objectFit: 'cover', borderRadius: 4 }} /> : '—' },
    {
      title: 'Sản phẩm',
      dataIndex: 'product_name',
      render: (name: string, r: Record<string, unknown>) => (
        <div>
          <div>{name}</div>
          {!!r.variant_label && (
            <div style={{ fontSize: 12, color: '#999' }}>{r.variant_label as string}</div>
          )}
        </div>
      ),
    },
    { title: 'Số lượng', dataIndex: 'quantity' },
    { title: 'Đơn giá', dataIndex: 'price_at_purchase', render: (v: number) => `${(v ?? 0).toLocaleString('vi-VN')}₫` },
    { title: 'Thành tiền', render: (_: unknown, r: Record<string, unknown>) => `${(((r.quantity as number) ?? 0) * ((r.price_at_purchase as number) ?? 0)).toLocaleString('vi-VN')}₫` },
  ];

  const renderContent = () => {
    if (isLoading) {
      return <div style={{ padding: 40, textAlign: 'center' }}><Spin size="large" /></div>;
    }
    if (query?.isError) {
      return <Alert type="error" message={`Lỗi tải đơn hàng: ${String(query.error)}`} style={{ margin: 16 }} />;
    }
    if (!order) {
      return <Alert type="warning" message="Không tìm thấy đơn hàng" style={{ margin: 16 }} />;
    }
    return (
      <>
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="Mã đơn hàng">{order.payment_code as string}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Select
              value={order.status as string}
              onChange={handleStatusChange}
              style={{ width: 180 }}
              options={Object.entries(STATUS_LABEL).map(([v, l]) => ({ value: v, label: l }))}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Khách hàng">{order.customer_name as string}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">{order.customer_phone as string}</Descriptions.Item>
          <Descriptions.Item label="Email">{order.customer_email as string}</Descriptions.Item>
          <Descriptions.Item label="Ngày đặt">{String(order.created_at ?? '').slice(0, 16).replace('T', ' ')}</Descriptions.Item>
          <Descriptions.Item label="Địa chỉ giao hàng" span={2}>{order.shipping_address as string}</Descriptions.Item>
          {order.notes && <Descriptions.Item label="Ghi chú" span={2}>{order.notes as string}</Descriptions.Item>}
        </Descriptions>

        <Divider>Sản phẩm trong đơn</Divider>
        <Table dataSource={items} columns={itemColumns} rowKey="id" pagination={false} size="small"
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={4} align="right"><strong>Tổng cộng:</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <Tag color="pink" style={{ fontSize: 14 }}>
                  {((order.total_amount as number) ?? 0).toLocaleString('vi-VN')}₫
                </Tag>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      </>
    );
  };

  return (
    <Show
      isLoading={isLoading}
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          <Popconfirm
            title="Xoá đơn hàng này?"
            description="Hành động này không thể hoàn tác."
            okText="Xoá"
            cancelText="Huỷ"
            okButtonProps={{ danger: true }}
            onConfirm={() =>
              order?.id &&
              deleteOrder(
                { resource: 'orders', id: order.id as string },
                { onSuccess: () => navigate('/orders') },
              )
            }
          >
            <Button danger icon={<DeleteOutlined />} disabled={!order?.id}>
              Xoá đơn hàng
            </Button>
          </Popconfirm>
        </>
      )}
    >
      {renderContent()}
    </Show>
  );
}
