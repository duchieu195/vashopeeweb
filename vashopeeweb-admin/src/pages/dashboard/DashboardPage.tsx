import { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Table, Tag } from 'antd';
import { ShoppingCartOutlined, DollarOutlined, ClockCircleOutlined, AppstoreOutlined } from '@ant-design/icons';
import { supabaseClient } from '../../lib/supabase';
import { Link } from 'react-router-dom';

const STATUS_COLOR: Record<string, string> = {
  pending: 'orange', paid: 'blue', confirmed: 'cyan',
  shipping: 'purple', delivered: 'green', cancelled: 'red',
};
const STATUS_LABEL: Record<string, string> = {
  pending: 'Chờ TT', paid: 'Đã TT', confirmed: 'Xác nhận',
  shipping: 'Đang giao', delivered: 'Hoàn thành', cancelled: 'Huỷ',
};

export default function DashboardPage() {
  const [stats, setStats] = useState({ todayOrders: 0, todayRevenue: 0, pendingOrders: 0, totalProducts: 0 });
  const [recentOrders, setRecentOrders] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);

    Promise.all([
      supabaseClient.from('orders').select('total_amount, status, created_at').gte('created_at', today),
      supabaseClient.from('orders').select('id, payment_code, customer_name, total_amount, status, created_at').order('created_at', { ascending: false }).limit(5),
      supabaseClient.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabaseClient.from('products').select('id', { count: 'exact', head: true }),
    ]).then(([todayRes, recentRes, pendingRes, productsRes]) => {
      const todayData = todayRes.data ?? [];
      setStats({
        todayOrders: todayData.length,
        todayRevenue: todayData.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.total_amount, 0),
        pendingOrders: pendingRes.count ?? 0,
        totalProducts: productsRes.count ?? 0,
      });
      setRecentOrders(recentRes.data ?? []);
    });
  }, []);

  const columns = [
    { title: 'Mã đơn', dataIndex: 'payment_code', render: (v: string, r: Record<string, unknown>) => <Link to={`/orders/${r.id}`}>{v}</Link> },
    { title: 'Khách hàng', dataIndex: 'customer_name' },
    { title: 'Tổng tiền', dataIndex: 'total_amount', render: (v: number) => `${v.toLocaleString('vi-VN')}₫` },
    { title: 'Trạng thái', dataIndex: 'status', render: (v: string) => <Tag color={STATUS_COLOR[v]}>{STATUS_LABEL[v]}</Tag> },
    { title: 'Ngày tạo', dataIndex: 'created_at', render: (v: string) => v?.slice(0, 16).replace('T', ' ') },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Dashboard</h2>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Đơn hàng hôm nay" value={stats.todayOrders} prefix={<ShoppingCartOutlined />} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Doanh thu hôm nay" value={stats.todayRevenue} suffix="₫" formatter={(v) => Number(v).toLocaleString('vi-VN')} prefix={<DollarOutlined />} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Đơn chờ xử lý" value={stats.pendingOrders} prefix={<ClockCircleOutlined />} valueStyle={{ color: '#fa8c16' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Tổng sản phẩm" value={stats.totalProducts} prefix={<AppstoreOutlined />} /></Card>
        </Col>
      </Row>

      <Card title="5 Đơn Hàng Mới Nhất">
        <Table dataSource={recentOrders} columns={columns} rowKey="id" pagination={false} size="small" />
      </Card>
    </div>
  );
}
