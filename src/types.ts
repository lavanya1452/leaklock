export interface Breach {
  id: string;
  sourceEntity: string;
  compromisedData: string[];
  severity: 'CRITICAL' | 'ELEVATED' | 'MODERATE' | 'MINIMAL';
  detectionDate: string;
  icon: string;
  description: string;
  status: 'UNRESOLVED' | 'RESOLVED';
}

export interface Alert {
  id: string;
  type: 'CRITICAL BREACH ATTEMPT' | 'ANOMALY DETECTED' | 'THREAT UPDATE';
  title: string;
  message: string;
  time: string;
  status: 'ACTIVE' | 'DISMISSED' | 'RESOLVED';
  severity: 'CRITICAL' | 'ELEVATED' | 'MODERATE' | 'MINIMAL';
}

export interface Asset {
  id: string;
  name: string;
  type: string;
  riskLevel: 'CRITICAL' | 'ELEVATED' | 'MODERATE' | 'MINIMAL';
  status: 'EXPOSED' | 'ENCRYPTED' | 'SECURED';
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  points: number;
  severity: 'CRITICAL' | 'ELEVATED' | 'MODERATE' | 'MINIMAL';
  actionText: string;
  status: 'PENDING' | 'EXECUTING' | 'COMPLETED';
}

export interface Log {
  id: string;
  time: string;
  tag: 'SIGNAL' | 'PROTECT' | 'UPDATE';
  message: string;
}

export interface SecurityScore {
  score: number;
  status: string;
  totalLeaks: number;
  newLeaks: number;
  avgDetectionTimeHours: number;
  threatLevel: 'MINIMAL' | 'MODERATE' | 'ELEVATED' | 'CRITICAL';
  defconLevel: number;
}
