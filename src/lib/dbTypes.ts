export type Candidate = {
  candidateId: string;
  name: string;
  imageUrl?: string;
  linkUrl?: string;
  description?: string;
};

export type Ballot = {
  ballotId: string;
  name: string;
  description?: string;
  candidates: Candidate[];
  createdAt: number;
};

export type Vote = {
  voteId: string;
  ballotId: string;
  voterName: string;
  scores: Record<string, number>;
  createdAt: number;
  updatedAt: number;
};
