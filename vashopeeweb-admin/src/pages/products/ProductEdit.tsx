import { Edit, useForm, useSelect } from '@refinedev/antd';
import { Form, Input, InputNumber, Select, Switch, Upload, Button, Image, Divider } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { supabaseClient } from '../../lib/supabase';
import { useState, useEffect } from 'react';
import OptionGroupBuilder, { type OptionGroupDraft } from './OptionGroupBuilder';
import VariantTable, { type VariantDraft } from './VariantTable';
import { saveProductVariants } from './saveProductVariants';

export default function ProductEdit() {
  const { formProps, saveButtonProps, query, onFinish } = useForm({ resource: 'products' });
  const { selectProps: categorySelectProps } = useSelect({
    resource: 'categories',
    optionLabel: 'name',
    optionValue: 'id',
  });

  const [images, setImages] = useState<string[]>([]);
  const [hasVariants, setHasVariants] = useState(false);
  const [optionGroups, setOptionGroups] = useState<OptionGroupDraft[]>([]);
  const [variants, setVariants] = useState<VariantDraft[]>([]);

  const productId = (query?.data?.data as { id?: string })?.id;

  useEffect(() => {
    const data = query?.data?.data as Record<string, unknown> | undefined;
    if (!data) return;
    if (data.images) setImages(data.images as string[]);
    if (data.has_variants) setHasVariants(data.has_variants as boolean);
  }, [query?.data]);

  // Fetch existing option groups + variants when product loads
  useEffect(() => {
    if (!productId) return;

    const fetchVariantData = async () => {
      const { data: groupsData } = await supabaseClient
        .from('product_option_groups')
        .select('*, product_option_values(*)')
        .eq('product_id', productId)
        .order('display_order');

      if (groupsData) {
        const mapped: OptionGroupDraft[] = groupsData.map((g) => ({
          id: g.id,
          name: g.name,
          displayOrder: g.display_order,
          values: (g.product_option_values ?? [])
            .sort((a: { display_order: number }, b: { display_order: number }) => a.display_order - b.display_order)
            .map((v: { id: string; value: string; display_order: number }) => ({
              id: v.id,
              groupId: g.id,
              value: v.value,
              displayOrder: v.display_order,
            })),
        }));
        setOptionGroups(mapped);
      }

      const { data: variantsData } = await supabaseClient
        .from('product_variants')
        .select('*, product_variant_options(option_value_id)')
        .eq('product_id', productId);

      if (variantsData && groupsData) {
        const mapped: VariantDraft[] = variantsData.map((v) => {
          const optionValueIds = (v.product_variant_options ?? []).map(
            (o: { option_value_id: string }) => o.option_value_id
          );
          const label = buildLabelFromGroups(optionValueIds, groupsData);
          return {
            id: v.id,
            optionValueIds,
            label,
            sku: v.sku ?? '',
            price: v.price,
            originalPrice: v.original_price ?? null,
            stockQuantity: v.stock_quantity,
            images: v.images ?? [],
            isActive: v.is_active,
          };
        });
        setVariants(mapped);
      }
    };

    fetchVariantData();
  }, [productId]);

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

  const handleFinish = async (values: Record<string, unknown>) => {
    await onFinish({ ...values, has_variants: hasVariants });
    if (productId) {
      await saveProductVariants(productId, hasVariants, optionGroups, variants);
    }
  };

  return (
    <Edit saveButtonProps={{ ...saveButtonProps, onClick: () => formProps.form?.submit() }}>
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
        <Form.Item label="Tồn kho" name="stock_quantity">
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item label="Thành phần" name="ingredients">
          <Input.TextArea rows={2} />
        </Form.Item>

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
    </Edit>
  );
}

function buildLabelFromGroups(
  optionValueIds: string[],
  groups: Array<{ display_order: number; product_option_values: Array<{ id: string; value: string }> }>
): string {
  return [...groups]
    .sort((a, b) => a.display_order - b.display_order)
    .map((g) => {
      const val = g.product_option_values.find((v) => optionValueIds.includes(v.id));
      return val?.value ?? '';
    })
    .filter(Boolean)
    .join(' / ');
}
