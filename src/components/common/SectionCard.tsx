import type {
  LucideIcon,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../ui/card';

import type { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
}

export function SectionCard({
  title,
  icon: Icon,
  children,
}: SectionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {Icon && (
            <Icon className="size-5" />
          )}

          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}