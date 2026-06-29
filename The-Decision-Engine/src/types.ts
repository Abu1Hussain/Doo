export type UserRole = 'Admin' | 'Finance Manager' | 'Customer Support' | 'Junior Developer';

export interface UserContext {
  userId: string;
  username: string;
  role: UserRole;
  clearanceLevel: number; // 1-3 (3 is highest)
  ipAddress: string;
  location: string;
  mfaVerified: boolean;
}

export interface SecurityPolicy {
  id: string;
  name: string;
  category: 'Spending' | 'DataAccess' | 'TimeBound' | 'Safety';
  description: string;
  enabled: boolean;
  ruleDefinition: string;
}

export interface EvaluationResult {
  id: string;
  requestId: string;
  timestamp: string;
  userContext: UserContext;
  prompt: string;
  status: 'APPROVED' | 'DENIED' | 'PENDING_MFA';
  confidenceScore: number; // 0 - 100
  reasoningChain: string[];
  policyVerdicts: {
    policyId: string;
    policyName: string;
    verdict: 'PASSED' | 'FAILED' | 'WARNING';
    message: string;
  }[];
  actionTarget: {
    toolName: string;
    arguments: Record<string, any>;
    payloadSummary: string;
  } | null;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userContext: UserContext;
  prompt: string;
  status: 'APPROVED' | 'DENIED' | 'PENDING_MFA' | 'MFA_APPROVED' | 'MFA_BYPASSED';
  confidenceScore: number;
  toolExecuted: string | null;
  actionSummary: string;
  reasoning: string;
}
