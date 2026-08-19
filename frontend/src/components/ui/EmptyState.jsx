import React from 'react';
import { Inbox } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No items found',
  description = 'There are no records to display at this moment.',
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-white border border-linkedin-border my-4 shadow-xs">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-linkedin-muted mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-linkedin-text mb-1">{title}</h3>
      <p className="text-sm text-linkedin-muted max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
