import { useState } from 'react';
import {
  Button, InputNumber, Input, Switch, Table, Typography, Upload, Image, Space, Popconfirm, Alert,
} from 'antd';
import { PlusOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { supabaseClient } from '../../lib/supabase';
import type { OptionGroupDraft } from './OptionGroupBuilder';

const { Text } = Typography;

export interface VariantDraft {
  id: string;
  optionValueIds: string[];
  label: string;
  sku: string;
  price: number;
  originalPrice: number | null;
  stockQuantity: number;
  images: string[];
  isActive: boolean;
  isNew?: boolean;
  isDeleted?: boolean;
}

interface Props {
  groups: OptionGroupDraft[];
  variants: VariantDraft[];
  onChange: (variants: VariantDraft[]) => void;
}

function uid() {
  return `new-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function buildLabel(optionValueIds: string[], groups: OptionGroupDraft[]): string {
  const sorted = [...groups]
    .filter((g) => !g.isDeleted)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return sorted
    .map((g) => {
      const val = g.values.find((v) => !v.isDeleted && optionValueIds.includes(v.id));
      return val?.value ?? '';
    })
    .filter(Boolean)
    .join(' / ');
}

function cartesian(arrays: string[][]): string[][] {
  return arrays.reduce<string[][]>(
    (acc, arr) => acc.flatMap((combo) => arr.map((val) => [...combo, val])),
    [[]]
  );
}

export default function VariantTable({ groups, variants, onChange }: Props) {
  const [uploading, setUploading] = useState<Record<string, boolean>>({});

  const visibleGroups = groups.filter((g) => !g.isDeleted);
  const visibleVariants = variants.filter((v) => !v.isDeleted);
  const inactiveVariants = variants.filter((v) => v.isDeleted);

  const totalCombinations = visibleGroups.reduce((acc, g) => {
    const count = g.values.filter((v) => !v.isDeleted).length;
    return acc * (count || 1);
  }, 1);

  const canGenerate = visibleGroups.length > 0 &&
    visibleGroups.every((g) => g.values.filter((v) => !v.isDeleted).length > 0);

  const generateVariants = () => {
    const valueArrays = visibleGroups
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((g) => g.values.filter((v) => !v.isDeleted).map((v) => v.id));

    const combinations = cartesian(valueArrays);

    const newVariants: VariantDraft[] = [];
    for (const combo of combinations) {
      const alreadyExists = variants.some(
        (v) =>
          !v.isDeleted &&
          v.optionValueIds.length === combo.length &&
          combo.every((id) => v.optionValueIds.includes(id))
      );
      if (!alreadyExists) {
        newVariants.push({
          id: uid(),
          optionValueIds: combo,
          label: buildLabel(combo, groups),
          sku: '',
          price: 0,
          originalPrice: null,
          stockQuantity: 0,
          images: [],
          isActive: true,
          isNew: true,
        });
      }
    }

    onChange([...variants, ...newVariants]);
  };

  const updateVariant = (id: string, patch: Partial<VariantDraft>) => {
    onChange(variants.map((v) => (v.id === id ? { ...v, ...patch } : v)));
  };

  const deleteVariant = (id: string) => {
    onChange(variants.map((v) => (v.id === id ? { ...v, isDeleted: true } : v)));
  };

  const handleUploadImage = async (variantId: string, file: File): Promise<void> => {
    setUploading((prev) => ({ ...prev, [variantId]: true }));
    try {
      const ext = file.name.split('.').pop();
      const path = `variants/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabaseClient.storage.from('product-images').upload(path, file);
      if (error) throw error;
      const { data } = supabaseClient.storage.from('product-images').getPublicUrl(path);
      const variant = variants.find((v) => v.id === variantId);
      if (variant) {
        updateVariant(variantId, { images: [...variant.images, data.publicUrl] });
      }
    } finally {
      setUploading((prev) => ({ ...prev, [variantId]: false }));
    }
  };

  const removeVariantImage = async (variantId: string, url: string) => {
    const path = url.split('/product-images/')[1];
    if (path) await supabaseClient.storage.from('product-images').remove([path]);
    const variant = variants.find((v) => v.id === variantId);
    if (variant) {
      updateVariant(variantId, { images: variant.images.filter((u) => u !== url) });
    }
  };

  const columns = [
    {
      title: 'Biến thể',
      dataIndex: 'label',
      width: 180,
      render: (label: string) => <Text strong>{label}</Text>,
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      width: 120,
      render: (sku: string, record: VariantDraft) => (
        <Input
          size="small"
          value={sku}
          placeholder="SKU"
          onChange={(e) => updateVariant(record.id, { sku: e.target.value })}
        />
      ),
    },
    {
      title: 'Giá bán (₫)',
      dataIndex: 'price',
      width: 140,
      render: (price: number, record: VariantDraft) => (
        <InputNumber
          size="small"
          min={0}
          value={price}
          style={{ width: '100%' }}
          formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          onChange={(val) => updateVariant(record.id, { price: val ?? 0 })}
        />
      ),
    },
    {
      title: 'Giá gốc (₫)',
      dataIndex: 'originalPrice',
      width: 140,
      render: (originalPrice: number | null, record: VariantDraft) => (
        <InputNumber
          size="small"
          min={0}
          value={originalPrice ?? undefined}
          style={{ width: '100%' }}
          formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          onChange={(val) => updateVariant(record.id, { originalPrice: val ?? null })}
        />
      ),
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stockQuantity',
      width: 100,
      render: (stock: number, record: VariantDraft) => (
        <InputNumber
          size="small"
          min={0}
          value={stock}
          style={{ width: '100%' }}
          onChange={(val) => updateVariant(record.id, { stockQuantity: val ?? 0 })}
        />
      ),
    },
    {
      title: 'Ảnh',
      dataIndex: 'images',
      width: 160,
      render: (images: string[], record: VariantDraft) => (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
          {images.map((url) => (
            <div key={url} style={{ position: 'relative' }}>
              <Image src={url} width={40} height={40} style={{ objectFit: 'cover', borderRadius: 4 }} />
              <Button
                size="small"
                danger
                icon={<DeleteOutlined />}
                style={{ position: 'absolute', top: -6, right: -6, padding: 0, width: 16, height: 16, minWidth: 16, fontSize: 10 }}
                onClick={() => removeVariantImage(record.id, url)}
              />
            </div>
          ))}
          {images.length < 3 && (
            <Upload
              accept="image/*"
              showUploadList={false}
              customRequest={async ({ file, onSuccess, onError }) => {
                try {
                  await handleUploadImage(record.id, file as File);
                  onSuccess?.({});
                } catch (err) {
                  onError?.(err as Error);
                }
              }}
            >
              <Button
                size="small"
                icon={<UploadOutlined />}
                loading={uploading[record.id]}
                style={{ width: 40, height: 40 }}
              />
            </Upload>
          )}
        </div>
      ),
    },
    {
      title: 'Bật',
      dataIndex: 'isActive',
      width: 60,
      render: (isActive: boolean, record: VariantDraft) => (
        <Switch
          size="small"
          checked={isActive}
          onChange={(val) => updateVariant(record.id, { isActive: val })}
        />
      ),
    },
    {
      title: '',
      width: 40,
      render: (_: unknown, record: VariantDraft) => (
        <Popconfirm title="Xóa biến thể này?" onConfirm={() => deleteVariant(record.id)} okText="Xóa" cancelText="Hủy">
          <Button size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {canGenerate && (
        <Space>
          <Button icon={<PlusOutlined />} onClick={generateVariants} type="default">
            Tạo biến thể tự động
          </Button>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Sẽ tạo {totalCombinations} biến thể từ {visibleGroups.length} nhóm
          </Text>
        </Space>
      )}

      {visibleVariants.length > 0 && (
        <Table
          dataSource={visibleVariants}
          columns={columns}
          rowKey="id"
          pagination={false}
          size="small"
          scroll={{ x: 800 }}
        />
      )}

      {inactiveVariants.length > 0 && (
        <Alert
          type="warning"
          message={`${inactiveVariants.length} biến thể đã bị xóa (do xóa giá trị phân loại). Chúng sẽ bị deactivate khi lưu.`}
          showIcon
        />
      )}
    </div>
  );
}
