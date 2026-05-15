import { List, useTable, DeleteButton } from '@refinedev/antd';
import { Table, Space, Button } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export default function CategoryList() {
  const { tableProps } = useTable({ resource: 'categories', sorters: { initial: [{ field: 'name', order: 'asc' }] } });
  const navigate = useNavigate();

  return (
    <List headerButtons={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/categories/create')}>
          Thêm danh mục
        </Button>
      }>
      <Table {...(tableProps as object)} rowKey="id">
        <Table.Column title="Icon" dataIndex="icon" width={60} render={(v: string) => <span style={{ fontSize: 24 }}>{v}</span>} />
        <Table.Column title="Tên danh mục" dataIndex="name" />
        <Table.Column title="Slug" dataIndex="slug" />
        <Table.Column
          title="Thao tác"
          width={100}
          render={(_, record: { id: string }) => (
            <Space>
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={() => navigate(`/categories/edit/${record.id}`)}
              />
              <DeleteButton hideText size="small" resource="categories" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
}
