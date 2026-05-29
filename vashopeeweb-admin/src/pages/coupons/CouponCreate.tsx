import { Create, useForm } from '@refinedev/antd';
import { Form, Input, InputNumber } from 'antd';

export default function CouponCreate() {
  const { formProps, saveButtonProps } = useForm({
    resource: 'coupons',
    action: 'create',
    redirect: 'list',
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Mã giảm giá"
          name="code"
          rules={[{ required: true, message: 'Vui lòng nhập mã' }]}
          extra="Chữ in hoa, không dấu. VD: SUMMER20"
        >
          <Input placeholder="SUMMER20" style={{ maxWidth: 240 }} />
        </Form.Item>
        <Form.Item
          label="Phần trăm giảm"
          name="discount"
          rules={[{ required: true, message: 'Vui lòng nhập % giảm' }]}
        >
          <InputNumber min={1} max={100} addonAfter="%" style={{ width: 160 }} />
        </Form.Item>
      </Form>
    </Create>
  );
}
