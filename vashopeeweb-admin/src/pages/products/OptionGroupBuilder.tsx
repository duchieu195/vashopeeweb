import { useState } from 'react';
import { Button, Input, Space, Tag, Tooltip, Typography } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

export interface OptionValueDraft {
  id: string;       // uuid or temp id like "new-<timestamp>"
  value: string;
  displayOrder: number;
  isNew?: boolean;
  isDeleted?: boolean;
}

export interface OptionGroupDraft {
  id: string;
  name: string;
  displayOrder: number;
  values: OptionValueDraft[];
  isNew?: boolean;
  isDeleted?: boolean;
}

interface Props {
  groups: OptionGroupDraft[];
  onChange: (groups: OptionGroupDraft[]) => void;
}

function uid() {
  return `new-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function OptionGroupBuilder({ groups, onChange }: Props) {
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingGroupName, setEditingGroupName] = useState('');
  const [newValueInputs, setNewValueInputs] = useState<Record<string, string>>({});

  const visibleGroups = groups.filter((g) => !g.isDeleted);

  const updateGroups = (updated: OptionGroupDraft[]) => onChange(updated);

  const addGroup = () => {
    const newGroup: OptionGroupDraft = {
      id: uid(),
      name: 'Nhóm mới',
      displayOrder: groups.length,
      values: [],
      isNew: true,
    };
    const updated = [...groups, newGroup];
    updateGroups(updated);
    setEditingGroupId(newGroup.id);
    setEditingGroupName(newGroup.name);
  };

  const startEditGroupName = (group: OptionGroupDraft) => {
    setEditingGroupId(group.id);
    setEditingGroupName(group.name);
  };

  const confirmEditGroupName = (groupId: string) => {
    const name = editingGroupName.trim();
    if (!name) return;
    updateGroups(groups.map((g) => g.id === groupId ? { ...g, name } : g));
    setEditingGroupId(null);
  };

  const cancelEditGroupName = () => setEditingGroupId(null);

  const deleteGroup = (groupId: string) => {
    updateGroups(groups.map((g) =>
      g.id === groupId ? { ...g, isDeleted: true } : g
    ));
  };

  const moveGroup = (groupId: string, dir: -1 | 1) => {
    const visible = visibleGroups;
    const idx = visible.findIndex((g) => g.id === groupId);
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= visible.length) return;

    const reordered = [...visible];
    [reordered[idx], reordered[newIdx]] = [reordered[newIdx], reordered[idx]];
    const reorderedWithOrder = reordered.map((g, i) => ({ ...g, displayOrder: i }));

    const deletedGroups = groups.filter((g) => g.isDeleted);
    updateGroups([...reorderedWithOrder, ...deletedGroups]);
  };

  const addValue = (groupId: string) => {
    const raw = (newValueInputs[groupId] ?? '').trim();
    if (!raw) return;

    updateGroups(groups.map((g) => {
      if (g.id !== groupId) return g;
      const newVal: OptionValueDraft = {
        id: uid(),
        value: raw,
        displayOrder: g.values.filter((v) => !v.isDeleted).length,
        isNew: true,
      };
      return { ...g, values: [...g.values, newVal] };
    }));
    setNewValueInputs((prev) => ({ ...prev, [groupId]: '' }));
  };

  const deleteValue = (groupId: string, valueId: string) => {
    updateGroups(groups.map((g) => {
      if (g.id !== groupId) return g;
      return {
        ...g,
        values: g.values.map((v) =>
          v.id === valueId ? { ...v, isDeleted: true } : v
        ),
      };
    }));
  };

  const moveValue = (groupId: string, valueId: string, dir: -1 | 1) => {
    updateGroups(groups.map((g) => {
      if (g.id !== groupId) return g;
      const visible = g.values.filter((v) => !v.isDeleted);
      const idx = visible.findIndex((v) => v.id === valueId);
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= visible.length) return g;

      const reordered = [...visible];
      [reordered[idx], reordered[newIdx]] = [reordered[newIdx], reordered[idx]];
      const reorderedWithOrder = reordered.map((v, i) => ({ ...v, displayOrder: i }));
      const deleted = g.values.filter((v) => v.isDeleted);
      return { ...g, values: [...reorderedWithOrder, ...deleted] };
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {visibleGroups.map((group, gIdx) => {
        const visibleValues = group.values.filter((v) => !v.isDeleted);
        const isEditingName = editingGroupId === group.id;

        return (
          <div
            key={group.id}
            style={{
              border: '1px solid #d9d9d9',
              borderRadius: 8,
              padding: 12,
              background: '#fafafa',
            }}
          >
            {/* Group header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              {isEditingName ? (
                <Space.Compact style={{ flex: 1 }}>
                  <Input
                    value={editingGroupName}
                    onChange={(e) => setEditingGroupName(e.target.value)}
                    onPressEnter={() => confirmEditGroupName(group.id)}
                    autoFocus
                    size="small"
                    style={{ maxWidth: 200 }}
                  />
                  <Button size="small" icon={<CheckOutlined />} type="primary" onClick={() => confirmEditGroupName(group.id)} />
                  <Button size="small" icon={<CloseOutlined />} onClick={cancelEditGroupName} />
                </Space.Compact>
              ) : (
                <Text strong style={{ flex: 1 }}>{group.name}</Text>
              )}

              <Space size={4}>
                {!isEditingName && (
                  <Tooltip title="Sửa tên">
                    <Button size="small" icon={<EditOutlined />} onClick={() => startEditGroupName(group)} />
                  </Tooltip>
                )}
                <Tooltip title="Lên">
                  <Button size="small" icon={<ArrowUpOutlined />} disabled={gIdx === 0} onClick={() => moveGroup(group.id, -1)} />
                </Tooltip>
                <Tooltip title="Xuống">
                  <Button size="small" icon={<ArrowDownOutlined />} disabled={gIdx === visibleGroups.length - 1} onClick={() => moveGroup(group.id, 1)} />
                </Tooltip>
                <Tooltip title="Xóa nhóm">
                  <Button size="small" danger icon={<DeleteOutlined />} onClick={() => deleteGroup(group.id)} />
                </Tooltip>
              </Space>
            </div>

            {/* Values */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
              {visibleValues.map((val, vIdx) => (
                <Tag
                  key={val.id}
                  closable
                  onClose={() => deleteValue(group.id, val.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 8px' }}
                >
                  <Button
                    type="text"
                    size="small"
                    icon={<ArrowUpOutlined />}
                    disabled={vIdx === 0}
                    style={{ padding: 0, height: 16, width: 16, minWidth: 16 }}
                    onClick={() => moveValue(group.id, val.id, -1)}
                  />
                  {val.value}
                  <Button
                    type="text"
                    size="small"
                    icon={<ArrowDownOutlined />}
                    disabled={vIdx === visibleValues.length - 1}
                    style={{ padding: 0, height: 16, width: 16, minWidth: 16 }}
                    onClick={() => moveValue(group.id, val.id, 1)}
                  />
                </Tag>
              ))}
            </div>

            {/* Add value input */}
            <Space.Compact>
              <Input
                size="small"
                placeholder="Thêm giá trị..."
                value={newValueInputs[group.id] ?? ''}
                onChange={(e) => setNewValueInputs((prev) => ({ ...prev, [group.id]: e.target.value }))}
                onPressEnter={() => addValue(group.id)}
                style={{ width: 160 }}
              />
              <Button size="small" icon={<PlusOutlined />} onClick={() => addValue(group.id)}>
                Thêm
              </Button>
            </Space.Compact>
          </div>
        );
      })}

      <Button type="dashed" icon={<PlusOutlined />} onClick={addGroup} style={{ width: '100%' }}>
        Thêm nhóm phân loại
      </Button>
    </div>
  );
}
