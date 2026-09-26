import { Screen, Table, ThemedText, type Column } from '@squeez/shared-ui'
type Row = { id: string; name: string; status: string; amount: number }

const rows: Row[] = [
  { id: '1', name: 'Alice', status: 'Active', amount: 1200 },
  { id: '2', name: 'Bob', status: 'Pending', amount: 850 },
  { id: '3', name: 'Carol', status: 'Active', amount: 2100 },
]

const columns: Column<Row>[] = [
  { key: 'name', title: 'Name', flex: 2 },
  { key: 'status', title: 'Status' },
  {
    key: 'amount',
    title: 'Amount',
    align: 'right',
    render: (row) => <ThemedText>${row.amount.toLocaleString()}</ThemedText>,
  },
]

export default function DashboardRoute() {
  return (
    <Screen scrollable>
      <Table
        data={rows}
        columns={columns}
        keyExtractor={(row) => row.id}
        onRowPress={(row) => console.log('pressed', row.id)}
      />
    </Screen>
  )
}