import { useMemo } from 'react';
import type { StrukturOrganisasi } from './useStrukturOrganisasi';
import type { TreeNode } from '../components/common/TreeNodeComponent';

export const useBuildTree = (data: StrukturOrganisasi[]): TreeNode[] => {
  return useMemo(() => {
    const map: { [key: string]: TreeNode } = {};
    const roots: TreeNode[] = [];

    // Create all nodes
    data.forEach(item => {
      map[item.id] = { ...item, children: [] };
    });

    // Build tree
    data.forEach(item => {
      if (item.parent_id === null) {
        roots.push(map[item.id]);
      } else {
        const parent = map[item.parent_id];
        if (parent) {
          parent.children.push(map[item.id]);
        }
      }
    });

    return roots;
  }, [data]);
};
