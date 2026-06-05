import { Create, useForm } from '@refinedev/antd';
import { Form, Input, InputNumber, Switch, Upload, Button, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { supabaseClient } from '../../lib/supabase';
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

export default function BannerCreate() {
  const { formProps, saveButtonProps } = useForm({ resource: 'banners' });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item label="Tiêu đề" name="title" rules={[{ required: true }]}>
          <Input placeholder="Mỹ Phẩm Chính Hãng" />
        </Form.Item>
        <Form.Item label="Phụ đề" name="subtitle">
          <Input placeholder="Giảm đến 30% cho đơn hàng đầu tiên" />
        </Form.Item>
        <Form.Item label="Thứ tự hiển thị" name="sort_order" initialValue={0}>
          <InputNumber min={0} style={{ width: 120 }} />
        </Form.Item>
        <Form.Item label="Hiển thị" name="is_active" valuePropName="checked" initialValue={true}>
          <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
        </Form.Item>
        <Form.Item
          label="Ảnh banner"
          name="image_url"
          rules={[{ required: true, message: 'Vui lòng upload ảnh banner' }]}
          extra={
            <Text type="secondary" style={{ fontSize: 12 }}>
              Kích thước khuyến nghị: <strong>1200×400px</strong> (tỉ lệ 3:1)
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
            <Button icon={<UploadOutlined />}>Upload ảnh</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Create>
  );
}
