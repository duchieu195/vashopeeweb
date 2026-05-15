import { Edit, useForm, useSelect } from '@refinedev/antd';
import { Form, Input, InputNumber, Select, Switch, Upload, Button, Image } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { supabaseClient } from '../../lib/supabase';
import { useState, useEffect } from 'react';

export default function ProductEdit() {
  const { formProps, saveButtonProps, query } = useForm({ resource: 'products' });
  const { selectProps: categorySelectProps } = useSelect({
    resource: 'categories',
    optionLabel: 'name',
    optionValue: 'id',
  });

  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const data = query?.data?.data;
    if (data?.images) setImages(data.images as string[]);
  }, [query?.data]);

  const handleUpload = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabaseClient.storage.from('product-images').upload(path, file);
    if (error) throw error;
    const { data } = supabaseClient.storage.from('product-images').getPublicUrl(path);
    return data.publicUrl;
  };

  const removeImage = async (url: string) => {
    const path = url.split('/product-images/')[1];
    if (path) await supabaseClient.storage.from('product-images').remove([path]);
    const updated = images.filter((u) => u !== url);
    setImages(updated);
    formProps.form?.setFieldValue('images', updated);
  };

  return (
    <Edit saveButtonProps={saveButtonProps}>
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
        <Form.Item label="Tồn kho" name="stock_quantity">
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item label="Thành phần" name="ingredients">
          <Input.TextArea rows={2} />
        </Form.Item>

        {/* Current images */}
        <Form.Item label="Ảnh hiện tại">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {images.map((url) => (
              <div key={url} style={{ position: 'relative' }}>
                <Image src={url} width={80} height={80} style={{ objectFit: 'cover', borderRadius: 4 }} />
                <Button
                  size="small" danger icon={<DeleteOutlined />}
                  style={{ position: 'absolute', top: 0, right: 0 }}
                  onClick={() => removeImage(url)}
                />
              </div>
            ))}
          </div>
        </Form.Item>

        {/* Upload new images */}
        <Form.Item label="Thêm ảnh mới">
          <Upload
            listType="picture-card"
            maxCount={5 - images.length}
            accept="image/*"
            showUploadList={false}
            customRequest={async ({ file, onSuccess, onError }) => {
              try {
                const url = await handleUpload(file as File);
                const updated = [...images, url];
                setImages(updated);
                formProps.form?.setFieldValue('images', updated);
                onSuccess?.({ url });
              } catch (err) {
                onError?.(err as Error);
              }
            }}
          >
            {images.length < 5 && <Button icon={<UploadOutlined />}>Upload</Button>}
          </Upload>
        </Form.Item>

        <Form.Item label="Sản phẩm mới" name="is_new" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item label="Bán chạy" name="is_best_seller" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Edit>
  );
}
