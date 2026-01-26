import React from 'react';
import type { StrukturOrganisasi } from '../../services/useStrukturOrganisasi';

export interface TreeNode extends StrukturOrganisasi {
  children: TreeNode[];
}

interface TreeNodeComponentProps {
  node: TreeNode;
}

export const TreeNodeComponent: React.FC<TreeNodeComponentProps> = ({ node }) => {
  const isLeader = !node.parent_id;

  return (
    <div className="pb-4 border-b border-gray-200 last:border-b-0">
      <div className={isLeader ? 'bg-emerald-50 p-4 rounded-lg' : 'p-4'}>
        <div className="flex items-start gap-4">
          {node.foto_url && (
            <img
              src={node.foto_url}
              alt={node.nama}
              className="w-16 h-16 rounded-full object-cover flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}
          <div className="flex-1">
            <h4 className={`font-bold text-lg ${isLeader ? 'text-emerald-700' : 'text-gray-900'}`}>
              {node.nama}
            </h4>
            <p className="text-sm text-gray-600 mb-1">{node.jabatan}</p>
            {node.nomor_nip && (
              <p className="text-xs text-gray-500">NIP: {node.nomor_nip}</p>
            )}
          </div>
        </div>
      </div>

      {/* Render children if they exist */}
      {node.children.length > 0 && (
        <div className="ml-4 mt-2 space-y-2 border-l-2 border-emerald-200 pl-4">
          {node.children.map((child) => (
            <TreeNodeComponent key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNodeComponent;
