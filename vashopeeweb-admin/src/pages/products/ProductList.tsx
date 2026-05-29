import { List, useTable, DeleteButton } from '@refinedev/antd';
import { Table, Space, Image, Tag, Input, Button } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProductList() {
  const [search, setSearch] = useState('');
  const [showBroken, setShowBroken] = useState(false);
  const navigate = useNavigate();

  const filters = [];
  if (search) filters.push({ field: 'name', operator: 'contains' as const, value: search });
  if (showBroken) filters.push({ field: 'name', operator: 'contains' as const, value: '_' });

  const { tableProps } = useTable({
    resource: 'products',
    sorters: { initial: [{ field: 'created_at', order: 'desc' }] },
    filters: { permanent: filters },
    meta: { select: '*, categories(name)' },
  });

  return (
    <List headerButtons={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/products/create')}>
          Thêm sản phẩm
        </Button>
      }>
      <Space style={{ marginBottom: 16 }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Tìm theo tên sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 320 }}
          allowClear
        />
        <Button
          type={showBroken ? 'primary' : 'default'}
          danger={showBroken}
          onClick={() => setShowBroken((v) => !v)}
        >
          Tên bị lỗi (_)
        </Button>
      </Space>
      <Table {...(tableProps as object)} rowKey="id" scroll={{ x: 900 }}>
        <Table.Column
          title="Ảnh"
          dataIndex="images"
          width={70}
          render={(imgs: string[]) => (
            <Image src={imgs?.[0]} width={50} height={50} style={{ objectFit: 'cover', borderRadius: 4 }} />
          )}
        />
        <Table.Column title="Tên sản phẩm" dataIndex="name" ellipsis />
        <Table.Column title="Mô tả" dataIndex="description" ellipsis width={220} />
        <Table.Column title="Thương hiệu" dataIndex="brand" width={120} />
        <Table.Column
          title="Danh mục"
          dataIndex={['categories', 'name']}
          width={130}
          render={(v: string) => <Tag>{v}</Tag>}
        />
        <Table.Column
          title="Giá"
          dataIndex="price"
          width={120}
          render={(v: number) => `${v.toLocaleString('vi-VN')}₫`}
        />
        <Table.Column
          title="Tồn kho"
          dataIndex="stock_quantity"
          width={90}
          render={(v: number) => <Tag color={v > 10 ? 'green' : v > 0 ? 'orange' : 'red'}>{v}</Tag>}
        />
        <Table.Column
          title="Thao tác"
          width={120}
          render={(_, record: { id: string }) => (
            <Space>
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={() => navigate(`/products/edit/${record.id}`)}
              />
              <DeleteButton hideText size="small" resource="products" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
}
