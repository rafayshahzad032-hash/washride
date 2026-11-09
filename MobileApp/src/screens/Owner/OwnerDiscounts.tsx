import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Switch, Alert } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useBusinesses, Discount } from '../../context/BusinessContext';
import { parseDate } from '../../utils/discounts';
import { Shell, NoBusiness, useMyBusiness } from './OwnerShared';

export function OwnerDiscounts() {
  const { colors } = useTheme();
  const business = useMyBusiness();
  const { addDiscount, updateDiscount, deleteDiscount, toggleDiscount } = useBusinesses();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [percent, setPercent] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [serviceIds, setServiceIds] = useState<string[]>([]);

  if (!business) return <Shell title="Discounts"><NoBusiness /></Shell>;

  const input = { borderWidth: 1.5, borderColor: colors.border, borderRadius: 10, padding: 12, color: colors.text, backgroundColor: colors.card, marginBottom: 10 } as const;

  const toggleService = (id: string) =>
    setServiceIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setPercent('');
    setStartDate('');
    setEndDate('');
    setServiceIds([]);
  };

  const startEdit = (d: Discount) => {
    setEditingId(d.id);
    setTitle(d.title);
    setPercent(String(d.percent));
    setStartDate(d.startDate);
    setEndDate(d.endDate);
    setServiceIds(d.serviceIds);
  };

  const confirmDelete = (d: Discount) =>
    Alert.alert('Delete discount', `Delete "${d.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteDiscount(business.id, d.id);
          if (editingId === d.id) resetForm();
        },
      },
    ]);

  const save = () => {
    const pct = Number(percent);
    if (!title.trim() || !(pct > 0 && pct <= 90)) return Alert.alert('Enter a title and a percentage between 1 and 90');
    if (!parseDate(startDate) || !parseDate(endDate)) {
      return Alert.alert('Invalid date', 'Write dates like 5 Nov 2026.');
    }
    if (serviceIds.length === 0) return Alert.alert('Select at least one service');

    const data = {
      title: title.trim(),
      percent: pct,
      serviceIds,
      startDate: startDate.trim(),
      endDate: endDate.trim(),
    };
    if (editingId) updateDiscount(business.id, editingId, data);
    else addDiscount(business.id, data);
    resetForm();
  };

  return (
    <Shell title="Discounts">
      <Text style={{ color: colors.subtext, marginBottom: 14 }}>
        Customers only see a discount when you create one here.
      </Text>

      <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 10 }}>
        {editingId ? 'Edit discount' : 'New discount'}
      </Text>
      <TextInput style={input} value={title} onChangeText={setTitle} placeholder="Offer title" placeholderTextColor={colors.subtext} />
      <TextInput style={input} value={percent} onChangeText={t => setPercent(t.replace(/[^0-9]/g, ''))} keyboardType="numeric" placeholder="Discount percentage" placeholderTextColor={colors.subtext} />
      <TextInput style={input} value={startDate} onChangeText={setStartDate} placeholder="Start date (e.g. 6 Nov 2026)" placeholderTextColor={colors.subtext} />
      <TextInput style={input} value={endDate} onChangeText={setEndDate} placeholder="Expiry date (e.g. 30 Nov 2026)" placeholderTextColor={colors.subtext} />

      <Text style={{ color: colors.subtext, fontSize: 12, fontWeight: '600', marginBottom: 6 }}>Applies to</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {business.services.map(s => {
          const on = serviceIds.includes(s.id);
          return (
            <TouchableOpacity
              key={s.id}
              onPress={() => toggleService(s.id)}
              style={{ paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: on ? colors.primary : colors.border, backgroundColor: on ? colors.primary : colors.card }}
            >
              <Text style={{ color: on ? colors.primaryText : colors.text, fontWeight: '600' }}>{s.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity onPress={save} style={{ backgroundColor: colors.primary, padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 16 }}>
        <Text style={{ color: colors.primaryText, fontWeight: '600' }}>
          {editingId ? 'Save Changes' : 'Create Discount'}
        </Text>
      </TouchableOpacity>
      {editingId && (
        <TouchableOpacity onPress={resetForm} style={{ padding: 12, alignItems: 'center' }}>
          <Text style={{ color: colors.subtext, fontWeight: '600' }}>Cancel editing</Text>
        </TouchableOpacity>
      )}

      <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text, marginTop: 24, marginBottom: 10 }}>
        Your discounts
      </Text>
      {business.discounts.length === 0 && (
        <Text style={{ color: colors.subtext }}>No discounts yet.</Text>
      )}
      {business.discounts.map(d => (
        <View
          key={d.id}
          style={{
            backgroundColor: colors.card,
            borderWidth: 1.5,
            borderColor: editingId === d.id ? colors.primary : colors.border,
            borderRadius: 12,
            padding: 14,
            marginBottom: 10,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: colors.text, fontWeight: '700', flex: 1 }}>{d.title} · {d.percent}% off</Text>
            <Switch value={d.active} onValueChange={() => toggleDiscount(business.id, d.id)} />
          </View>
          <Text style={{ color: colors.subtext, marginTop: 4 }}>{d.startDate} to {d.endDate}</Text>
          <Text style={{ color: colors.subtext, marginTop: 2 }}>
            {business.services.filter(s => d.serviceIds.includes(s.id)).map(s => s.name).join(', ')}
          </Text>
          <View style={{ flexDirection: 'row', gap: 20, marginTop: 10 }}>
            <TouchableOpacity onPress={() => startEdit(d)}>
              <Text style={{ color: colors.primary, fontWeight: '600' }}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => confirmDelete(d)}>
              <Text style={{ color: '#EF4444', fontWeight: '600' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </Shell>
  );
}