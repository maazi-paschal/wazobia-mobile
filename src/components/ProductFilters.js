import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { CATEGORIES, SIZE_OPTIONS, SORT_OPTIONS } from '../utils/catalog';

/* Bottom-sheet style selector used for the Size and Sort dropdowns. */
const DropdownSelect = ({ label, options, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value) || options[0];

  return (
    <>
      <TouchableOpacity
        style={[styles.dropdown, value !== options[0].value && styles.dropdownActive]}
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.dropdownLabel}>{label}</Text>
        <View style={styles.dropdownValueRow}>
          <Text style={styles.dropdownValue} numberOfLines={1}>
            {current.label}
          </Text>
          <Text style={styles.chevron}>▾</Text>
        </View>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>{label}</Text>
            {options.map((opt) => {
              const selected = opt.value === value;
              return (
                <TouchableOpacity
                  key={opt.value || 'all'}
                  style={[styles.option, selected && styles.optionSelected]}
                  onPress={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                    {opt.label}
                  </Text>
                  {selected && <Text style={styles.check}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

/* Web-store filter system: category pills + Size & Sort dropdowns. */
export const ProductFilters = ({
  category,
  onCategoryChange,
  size,
  onSizeChange,
  sortBy,
  onSortChange,
  resultCount,
  onReset,
}) => {
  const hasActive = category !== 'All' || size !== '' || sortBy !== 'featured';

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillsRow}
      >
        {CATEGORIES.map((cat) => {
          const isActive = category === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.pill, isActive && styles.pillActive]}
              onPress={() => onCategoryChange(cat)}
              activeOpacity={0.7}
            >
              <Text style={[styles.pillText, isActive && styles.pillTextActive]}>{cat}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.dropdownRow}>
        <View style={{ flex: 1 }}>
          <DropdownSelect label="SIZE" options={SIZE_OPTIONS} value={size} onChange={onSizeChange} />
        </View>
        <View style={{ flex: 1.4 }}>
          <DropdownSelect
            label="SORT BY"
            options={SORT_OPTIONS}
            value={sortBy}
            onChange={onSortChange}
          />
        </View>
      </View>

      {typeof resultCount === 'number' && (
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>
            {resultCount} PIECE{resultCount === 1 ? '' : 'S'}
          </Text>
          {hasActive && onReset && (
            <TouchableOpacity onPress={onReset}>
              <Text style={styles.resetText}>Reset filters</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fcfbf9',
    paddingTop: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e6df',
  },
  pillsRow: { paddingHorizontal: 14, alignItems: 'center' },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e8e6df',
  },
  pillActive: { backgroundColor: '#111111', borderColor: '#111111' },
  pillText: { fontSize: 12, fontWeight: '600', color: '#666666', letterSpacing: 0.5 },
  pillTextActive: { color: '#fcfbf9', fontWeight: '800' },
  dropdownRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
    marginTop: 10,
  },
  dropdown: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e8e6df',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  dropdownActive: { borderColor: '#c85a32' },
  dropdownLabel: { fontSize: 8.5, fontWeight: '800', color: '#999999', letterSpacing: 1.2 },
  dropdownValueRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  dropdownValue: { flex: 1, fontSize: 12.5, fontWeight: '700', color: '#111111' },
  chevron: { fontSize: 12, color: '#c85a32', marginLeft: 4 },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  metaText: { fontSize: 10.5, fontWeight: '800', color: '#888888', letterSpacing: 1 },
  resetText: { fontSize: 11, fontWeight: '700', color: '#c85a32' },
  backdrop: { flex: 1, backgroundColor: 'rgba(17,17,17,0.45)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#fcfbf9',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 32,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#d9d5cd',
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#111111',
    marginBottom: 10,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
  },
  optionSelected: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e8e6df' },
  optionText: { fontSize: 14, color: '#444444', fontWeight: '500' },
  optionTextSelected: { color: '#111111', fontWeight: '800' },
  check: { fontSize: 14, color: '#c85a32', fontWeight: '900' },
});
