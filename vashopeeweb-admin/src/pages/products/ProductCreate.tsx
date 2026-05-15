import { Create, useForm, useSelect } from '@refinedev/antd';
import { Form, Input, InputNumber, Select, Switch, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { supabaseClient } from '../../lib/supabase';
import type { UploadFile } from 'antd';

export default function ProductCreate() {
  const { formProps, saveButtonProps } = useForm({ resource: 'products' });
  const { selectProps: categorySelectProps } = useSelect({
    resource: 'categories',
    optionLabel: 'name',
    optionValue: 'id',
  });

  const handleUpload = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabaseClient.storage.from('product-images').upload(path, file);
    if (error) throw error;
    const { data } = supabaseClient.storage.from('product-images').getPublicUrl(path);
    return data.publicUrl;
  };

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Thương hiệu" name="brand" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Danh mục" name="category_id" rules={[{ required: true }]}>
          <Select {...(categorySelectProps as object)} />
        </Form.Item>
        <Form.Item label="Giá bán (₫)" name="price" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: '100%' }} formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
        </Form.Item>
        <Form.Item label="Giá gốc (₫)" name="original_price">
          <InputNumber min={0} style={{ width: '100%' }} formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
        </Form.Item>
        <Form.Item label="Tồn kho" name="stock_quantity" initialValue={0}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item label="Thành phần" name="ingredients">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item label="Ảnh sản phẩm" name="images" valuePropName="fileList"
          getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
        >
          <Upload
            listType="picture-card"
            maxCount={5}
            accept="image/*"
            customRequest={async ({ file, onSuccess, onError }) => {
              try {
                const url = await handleUpload(file as File);
                onSuccess?.({ url });
              } catch (err) {
                onError?.(err as Error);
              }
            }}
            onChange={({ fileList }) => {
              const urls = fileList
                .filter((f: UploadFile) => f.status === 'done')
                .map((f: UploadFile) => f.response?.url ?? f.url);
              formProps.form?.setFieldValue('images', urls);
            }}
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item label="Sản phẩm mới" name="is_new" valuePropName="checked" initialValue={false}>
          <Switch />
        </Form.Item>
        <Form.Item label="Bán chạy" name="is_best_seller" valuePropName="checked" initialValue={false}>
          <Switch />
        </Form.Item>
      </Form>
    </Create>
  );
}
