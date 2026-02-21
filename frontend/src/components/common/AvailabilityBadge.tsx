import { getAvailabilityColor, type AvailabilityStatus } from "../../utils/availability";

interface AvailabilityBadgeProps {
  status: AvailabilityStatus;
}

export function AvailabilityBadge({ status }: AvailabilityBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getAvailabilityColor(status)}`}>
      {status}
    </span>
  );
}
