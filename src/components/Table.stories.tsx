import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  TableContainer,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from './Table';
import { Badge } from './Badge';

const meta: Meta<typeof Table> = {
  title: 'Components/Data Display/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Default: Story = {
  render: () => (
    <div className="w-[700px]">
      <TableContainer>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quadra</TableHead>
              <TableHead>Esporte</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Lances Gravados</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-bold">Quadra 01</TableCell>
              <TableCell>Beach Tennis</TableCell>
              <TableCell>
                <Badge variant="success" dot pulseDot>Gravando</Badge>
              </TableCell>
              <TableCell>142 vídeos</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">Quadra 02</TableCell>
              <TableCell>Futevôlei</TableCell>
              <TableCell>
                <Badge variant="primary">Disponível</Badge>
              </TableCell>
              <TableCell>89 vídeos</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">Quadra 03</TableCell>
              <TableCell>Padel</TableCell>
              <TableCell>
                <Badge variant="warning">Manutenção</Badge>
              </TableCell>
              <TableCell>0 vídeos</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  ),
};
