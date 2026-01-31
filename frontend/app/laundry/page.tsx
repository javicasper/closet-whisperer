'use client';

import { useEffect, useState } from 'react';
import {
  Button,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  InlineNotification,
  Loading,
  Grid,
  Column,
  Tag,
} from '@carbon/react';
import { Renew, CheckmarkOutline } from '@carbon/icons-react';
import { getLaundryQueue, removeFromLaundry } from '@/lib/api';
import { Garment } from '@/types';

export default function LaundryPage() {
  const [garments, setGarments] = useState<Garment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLaundry();
  }, []);

  const loadLaundry = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLaundryQueue();
      setGarments(Array.isArray(data) ? data : (data as any).garments || []);
    } catch (error) {
      console.error('Load error:', error);
      setError('Failed to load laundry queue.');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnToCloset = async (id: string) => {
    try {
      await removeFromLaundry(id);
      setGarments(garments.filter((g) => g.id !== id));
    } catch (error) {
      console.error('Return error:', error);
      setError('Failed to return garment to closet.');
    }
  };

  const headers = [
    { key: 'type', header: 'Type' },
    { key: 'color', header: 'Color' },
    { key: 'season', header: 'Season' },
    { key: 'added', header: 'Added to Laundry' },
    { key: 'actions', header: 'Actions' },
  ];

  const rows = garments.map((garment) => ({
    id: garment.id,
    type: garment.type || '-',
    color: garment.color || '-',
    season: garment.season || '-',
    added: garment.updated_at
      ? new Date(garment.updated_at).toLocaleDateString()
      : '-',
    actions: garment.id,
  }));

  return (
    <div>
      {/* Header */}
      <Grid fullWidth narrow className="mb-6">
        <Column lg={12} md={6} sm={4}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            Laundry Queue
          </h1>
          <p style={{ color: 'var(--cds-text-secondary)' }}>
            Garments currently in the laundry
          </p>
        </Column>
        <Column lg={4} md={2} sm={4} className="flex items-end justify-end">
          <Button
            kind="secondary"
            renderIcon={Renew}
            onClick={loadLaundry}
            disabled={loading}
          >
            Refresh
          </Button>
        </Column>
      </Grid>

      {/* Error Notification */}
      {error && (
        <Grid fullWidth narrow className="mb-4">
          <Column lg={16} md={8} sm={4}>
            <InlineNotification
              kind="error"
              title="Error"
              subtitle={error}
              onCloseButtonClick={() => setError(null)}
            />
          </Column>
        </Grid>
      )}

      {/* Stats */}
      <Grid fullWidth narrow className="mb-6">
        <Column lg={16} md={8} sm={4}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Tag type="blue" size="md">
              {garments.length} item{garments.length !== 1 ? 's' : ''} in laundry
            </Tag>
          </div>
        </Column>
      </Grid>

      {/* Data Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loading description="Loading laundry queue..." withOverlay={false} />
        </div>
      ) : garments.length === 0 ? (
        <Grid fullWidth narrow>
          <Column lg={16} md={8} sm={4}>
            <div className="text-center py-12" style={{ background: 'var(--cds-layer-01)', padding: '3rem', borderRadius: '4px' }}>
              <p style={{ color: 'var(--cds-text-secondary)', marginBottom: '1rem', fontSize: '1.125rem' }}>
                No garments in laundry! 🎉
              </p>
              <p style={{ color: 'var(--cds-text-secondary)' }}>
                Your closet is fully available.
              </p>
            </div>
          </Column>
        </Grid>
      ) : (
        <Grid fullWidth narrow>
          <Column lg={16} md={8} sm={4}>
            <DataTable rows={rows} headers={headers}>
              {({
                rows,
                headers,
                getTableProps,
                getHeaderProps,
                getRowProps,
              }: any) => (
                <TableContainer>
                  <Table {...getTableProps()}>
                    <TableHead>
                      <TableRow>
                        {headers.map((header: any) => (
                          <TableHeader {...getHeaderProps({ header })} key={header.key}>
                            {header.header}
                          </TableHeader>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row: any) => (
                        <TableRow {...getRowProps({ row })} key={row.id}>
                          {row.cells.map((cell: any) => {
                            if (cell.info.header === 'actions') {
                              return (
                                <TableCell key={cell.id}>
                                  <Button
                                    size="sm"
                                    kind="tertiary"
                                    renderIcon={CheckmarkOutline}
                                    onClick={() => handleReturnToCloset(row.id)}
                                  >
                                    Return to Closet
                                  </Button>
                                </TableCell>
                              );
                            }
                            return <TableCell key={cell.id}>{cell.value}</TableCell>;
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </DataTable>
          </Column>
        </Grid>
      )}
    </div>
  );
}
