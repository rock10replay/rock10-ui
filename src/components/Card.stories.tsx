import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';

const meta: Meta<typeof Card> = {
  title: 'Components/Layout/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    hoverable: {
      control: 'boolean',
    },
    padded: {
      control: 'boolean',
    },
  },
  args: {
    hoverable: false,
    padded: true,
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: (args) => (
    <div className="w-96">
      <Card {...args}>
        <CardHeader actions={<Badge variant="success" dot>Ativo</Badge>}>
          <CardTitle>Arena Central Rock10</CardTitle>
          <CardDescription>São Paulo, SP • 4 Quadras Cobertas</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-dark-text-muted">
            Transmissão contínua em 4K com câmeras acionadas por inteligência artificial.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm">Gerenciar</Button>
          <Button variant="primary" size="sm">Ver Câmeras</Button>
        </CardFooter>
      </Card>
    </div>
  ),
};

export const Hoverable: Story = {
  render: () => (
    <div className="w-96">
      <Card hoverable>
        <CardTitle>Card Interativo com Efeito Hover</CardTitle>
        <CardDescription>Passe o mouse para notar a elevação suave e sombra dinâmica.</CardDescription>
      </Card>
    </div>
  ),
};
