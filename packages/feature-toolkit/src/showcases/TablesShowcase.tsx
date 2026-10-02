import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Table, ThemedText, type Column } from '@squeez/shared-ui'

type Order = {
  id: string
  customer: string
  status: 'Paid' | 'Pending' | 'Failed'
  amount: number
}

const orders: Order[] = [
  { id: 'A-101', customer: 'Asha', status: 'Paid', amount: 1200 },
  { id: 'A-102', customer: 'Ravi', status: 'Pending', amount: 450.5 },
  { id: 'A-103', customer: 'Meera', status: 'Failed', amount: 89 },
  { id: 'A-104', customer: 'Kiran', status: 'Paid', amount: 760 },
]

const columns: Column<Order>[] = [
  { key: 'id', title: 'ID', width: 70 },
  { key: 'customer', title: 'Customer', flex: 1 },
  {
    key: 'status',
    title: 'Status',
    flex: 1,
    // render lets a column draw anything instead of plain text
    render: (row) => (
      <ThemedText
        tone={
          row.status === 'Paid'
            ? 'brand'
            : row.status === 'Failed'
              ? 'danger'
              : 'secondary'
        }
      >
        {row.status}
      </ThemedText>
    ),
  },
  {
    key: 'amount',
    title: 'Amount',
    width: 80,
    align: 'right',
    render: (row) => <ThemedText>{row.amount.toFixed(2)}</ThemedText>,
  },
]

const simpleColumns: Column<Order>[] = [
  { key: 'id', title: 'ID', width: 70 },
  { key: 'customer', title: 'Customer', flex: 1 },
]

export function TablesShowcase() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <View style={styles.root}>
      <ThemedText variant="label" tone="secondary">
        Default (header, striped rows, custom cells)
      </ThemedText>
      <Table data={orders} columns={columns} keyExtractor={(row) => row.id} />

      <ThemedText variant="label" tone="secondary">
        No header, no stripes
      </ThemedText>
      <Table
        data={orders.slice(0, 2)}
        columns={simpleColumns}
        keyExtractor={(row) => row.id}
        showHeader={false}
        striped={false}
      />

      <ThemedText variant="label" tone="secondary">
        Pressable rows
      </ThemedText>
      <Table
        data={orders.slice(0, 3)}
        columns={simpleColumns}
        keyExtractor={(row) => row.id}
        onRowPress={(row) => setSelected(row.id)}
      />
      <ThemedText variant="caption" tone="secondary">
        Selected: {selected ?? 'none (tap a row)'}
      </ThemedText>

      <ThemedText variant="label" tone="secondary">
        Empty state
      </ThemedText>
      <Table
        data={[]}
        columns={simpleColumns}
        keyExtractor={(row: Order) => row.id}
        emptyMessage="No orders yet"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  root: { gap: 12 },
})