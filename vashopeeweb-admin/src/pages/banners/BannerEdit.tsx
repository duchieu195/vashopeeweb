import { Edit, useForm } from '@refinedev/antd';
import { Form, Input, InputNumber, Switch, Upload, Button, Image, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { supabaseClient } from '../../lib/supabase';
import { useState, useEffect } from 'react';
import type { UploadFile } from 'antd';

const { Text } = Typography;

async function uploadBannerImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabaseClient.storage.from('banner-images').upload(path, file);
  if (error) throw error;
  const { data } = supabaseClient.storage.from('banner-images').getPublicUrl(path);
  return data.publicUrl;
}

export default function BannerEdit() {
  const { formProps, saveButtonProps, query } = useForm({ resource: 'banners' });
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');

  useEffect(() => {
    const data = query?.data?.data as Record<string, unknown> | undefined;
    if (data?.image_url) setCurrentImageUrl(data.image_url as string);
  }, [query?.data]);

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item label="Tiêu đề" name="title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Phụ đề" name="subtitle">
          <Input />
        </Form.Item>
        <Form.Item label="Thứ tự hiển thị" name="sort_order">
          <InputNumber min={0} style={{ width: 120 }} />
        </Form.Item>
        <Form.Item label="Hiển thị" name="is_active" valuePropName="checked">
          <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
        </Form.Item>

        {currentImageUrl && (
          <Form.Item label="Ảnh hiện tại">
            <Image src={currentImageUrl} width={240} height={80} style={{ objectFit: 'cover', borderRadius: 4 }} />
          </Form.Item>
        )}

        <Form.Item
          label="Thay ảnh banner"
          name="image_url"
          extra={
            <Text type="secondary" style={{ fontSize: 12 }}>
              Kích thước khuyến nghị: <strong>1200×400px</strong> (tỉ lệ 3:1). Để trống nếu không muốn thay ảnh.
            </Text>
          }
        >
          <Upload
            listType="picture"
            maxCount={1}
            accept="image/*"
            customRequest={async ({ file, onSuccess, onError }) => {
              try {
                const url = await uploadBannerImage(file as File);
                setCurrentImageUrl(url);
                onSuccess?.({ url });
              } catch (err) {
                onError?.(err as Error);
              }
            }}
            onChange={({ fileList }) => {
              const done = (fileList as UploadFile[]).find((f) => f.status === 'done');
              if (done) {
                formProps.form?.setFieldValue('image_url', done.response?.url ?? done.url);
              }
            }}
          >
            <Button icon={<UploadOutlined />}>Upload ảnh mới</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Edit>
  );
}
