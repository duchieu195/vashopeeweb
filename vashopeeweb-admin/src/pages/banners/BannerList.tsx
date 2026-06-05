import { List, useTable, DeleteButton, EditButton } from '@refinedev/antd';
import { Table, Space, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
}

export default function BannerList() {
  const { tableProps } = useTable({
    resource: 'banners',
    sorters: { initial: [{ field: 'sort_order', order: 'asc' }] },
  });
  const navigate = useNavigate();

  return (
    <List headerButtons={
      <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/banners/create')}>
        Thêm banner
      </Button>
    }>
      <Table {...(tableProps as object)} rowKey="id">
        <Table.Column
          title="Ảnh"
          dataIndex="image_url"
          width={80}
          render={(url: string, record: Banner) => (
            <img src={url} alt={record.title} style={{ width: 60, height: 20, objectFit: 'cover', borderRadius: 2 }} />
          )}
        />
        <Table.Column title="Tiêu đề" dataIndex="title" />
        <Table.Column title="Phụ đề" dataIndex="subtitle" />
        <Table.Column title="Thứ tự" dataIndex="sort_order" width={90} />
        <Table.Column
          title="Trạng thái"
          dataIndex="is_active"
          width={110}
          render={(v: boolean) => (
            <Tag color={v ? 'green' : 'default'}>{v ? 'Hiển thị' : 'Ẩn'}</Tag>
          )}
        />
        <Table.Column
          title="Thao tác"
          width={100}
          render={(_, record: Banner) => (
            <Space>
              <EditButton hideText size="small" resource="banners" recordItemId={record.id} />
              <DeleteButton hideText size="small" resource="banners" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
}
