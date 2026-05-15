import { Create, useForm } from '@refinedev/antd';
import { Form, Input } from 'antd';

export default function CategoryCreate() {
  const { formProps, saveButtonProps } = useForm({
    resource: 'categories',
    action: 'create',
    redirect: 'list',
  });

  const { form: _form, ...restFormProps } = formProps;

  const handleFinish = (values: Record<string, unknown>) => {
    return formProps.onFinish?.({ ...values, id: values.slug });
  };

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...restFormProps} onFinish={handleFinish} layout="vertical">
        <Form.Item label="Tên danh mục" name="name" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item label="Icon (emoji)" name="icon" rules={[{ required: true }]}><Input placeholder="💄" /></Form.Item>
        <Form.Item label="Slug" name="slug" rules={[{ required: true }]}><Input placeholder="son-moi" /></Form.Item>
      </Form>
    </Create>
  );
}
