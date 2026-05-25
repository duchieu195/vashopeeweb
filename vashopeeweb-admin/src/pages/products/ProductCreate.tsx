import { useState } from 'react';
import { Create, useForm, useSelect } from '@refinedev/antd';
import { Form, Input, InputNumber, Select, Switch, Upload, Button, Divider } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { supabaseClient } from '../../lib/supabase';
import type { UploadFile } from 'antd';
import OptionGroupBuilder, { type OptionGroupDraft } from './OptionGroupBuilder';
import VariantTable, { type VariantDraft } from './VariantTable';
import { saveProductVariants } from './saveProductVariants';

export default function ProductCreate() {
  const { formProps, saveButtonProps, onFinish } = useForm({ resource: 'products' });
  const { selectProps: categorySelectProps } = useSelect({
    resource: 'categories',
    optionLabel: 'name',
    optionValue: 'id',
  });

  const [hasVariants, setHasVariants] = useState(false);
  const [optionGroups, setOptionGroups] = useState<OptionGroupDraft[]>([]);
  const [variants, setVariants] = useState<VariantDraft[]>([]);

  const handleUpload = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabaseClient.storage.from('product-images').upload(path, file);
    if (error) throw error;
    const { data } = supabaseClient.storage.from('product-images').getPublicUrl(path);
    return data.publicUrl;
  };

  const handleFinish = async (values: Record<string, unknown>) => {
    const result = await onFinish({ ...values, has_variants: hasVariants });
    const productId = (result?.data as { id?: string })?.id;
    if (productId && hasVariants) {
      await saveProductVariants(productId, hasVariants, optionGroups, variants);
    }
  };

  return (
    <Create saveButtonProps={{ ...saveButtonProps, onClick: () => formProps.form?.submit() }}>
      <Form {...formProps} layout="vertical" onFinish={handleFinish}>
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

        <Divider />

        <Form.Item
          label="Phân loại sản phẩm"
          extra="Bật để thêm các nhóm phân loại (màu, size, dung tích, v.v.)"
        >
          <Switch checked={hasVariants} onChange={setHasVariants} />
        </Form.Item>

        {hasVariants && (
          <>
            <Form.Item label="Nhóm phân loại">
              <OptionGroupBuilder groups={optionGroups} onChange={setOptionGroups} />
            </Form.Item>
            <Form.Item label="Biến thể">
              <VariantTable groups={optionGroups} variants={variants} onChange={setVariants} />
            </Form.Item>
          </>
        )}
      </Form>
    </Create>
  );
}
