import React from 'react';
import { PageContainer } from '@/components/base';
import { NodesPageContent } from '@/components/ui/nodes';

const Nodes: React.FC = () => {
  return (
    <PageContainer className="min-h-screen flex flex-col">
      <NodesPageContent />
    </PageContainer>
  );
};

export default Nodes;
