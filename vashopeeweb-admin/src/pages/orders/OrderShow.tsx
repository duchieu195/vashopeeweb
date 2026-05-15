import { Show } from '@refinedev/antd';
import { useShow, useUpdate } from '@refinedev/core';
import { Descriptions, Tag, Select, Table, Image, Divider } from 'antd';
import { useEffect, useState } from 'react';
import { supabaseClient } from '../../lib/supabase';

const STATUS_LABEL: Record<string, string> = {
  pending: 'Chờ thanh toán', paid: 'Đã thanh toán', confirmed: 'Đã xác nhận',
  shipping: 'Đang giao', delivered: 'Hoàn thành', cancelled: 'Đã huỷ',
};

export default function OrderShow() {
  const { query } = useShow({ resource: 'orders' });
  const { mutate: updateOrder } = useUpdate();
  const order = query?.data?.data;
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
    { title: 'Sản phẩm', dataIndex: 'product_name' },
    { title: 'Số lượng', dataIndex: 'quantity' },
    { title: 'Đơn giá', dataIndex: 'price_at_purchase', render: (v: number) => `${v.toLocaleString('vi-VN')}₫` },
    { title: 'Thành tiền', render: (_: unknown, r: Record<string, unknown>) => `${((r.quantity as number) * (r.price_at_purchase as number)).toLocaleString('vi-VN')}₫` },
  ];

  return (
    <Show>
      {order && (
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
            <Descriptions.Item label="Ngày đặt">{(order.created_at as string)?.slice(0, 16).replace('T', ' ')}</Descriptions.Item>
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
                    {(order.total_amount as number).toLocaleString('vi-VN')}₫
                  </Tag>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
        </>
      )}
    </Show>
  );
}
