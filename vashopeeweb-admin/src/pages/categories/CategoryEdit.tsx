import { Edit, useForm } from '@refinedev/antd';
import { Form, Input } from 'antd';

export default function CategoryEdit() {
  const { formProps, saveButtonProps } = useForm({ resource: 'categories' });
  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item label="Tên danh mục" name="name" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item label="Icon (emoji)" name="icon" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item label="Slug" name="slug" rules={[{ required: true }]}><Input /></Form.Item>
      </Form>
    </Edit>
  );
}
