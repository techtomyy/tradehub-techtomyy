export interface EscrowDeal {
  id: string;
  deal: string;
  counterparty: string;
  counterpartyType: 'seller' | 'buyer';
  amountHeld: number;
  fee: number;
  netToSeller: number;
  counterpartyConfirmed: 'confirmed' | 'pending';
  status: 'funded' | 'in_progress';
}

export interface TimelineStep {
  id: string;
  title: string;
  date: string;
  status: 'completed' | 'pending';
}

export interface EscrowManagementProps {
  deals: EscrowDeal[];
  onConfirmCompletion: (dealId: string) => void;
  onRaiseDispute: (dealId: string) => void;
}

export interface DealStatusTimelineProps {
  steps: TimelineStep[];
}

export interface InitiateNewEscrowProps {
  onCreateEscrow: (dealDescription: string, counterpartyUsername: string, amount: number) => void;
  isLoading?: boolean;
}

export interface DisputeResolutionProps {
  deals: EscrowDeal[];
  onSubmitDispute: (dealId: string, disputeDetails: string) => void;
  isLoading?: boolean;
}
