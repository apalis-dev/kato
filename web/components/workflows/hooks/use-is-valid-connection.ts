import type { Connection, Edge, Node } from "@xyflow/react";
import { getOutgoers } from "@xyflow/react";
import { useCallback } from "react";
function hasCycle(
  node: Node,
  connection: Connection | Edge,
  nodes: Node[],
  edges: Edge[],
  visited: Set<string> = new Set<string>()
): boolean {
  if (visited.has(node.id)) {
    return false;
  }
  visited.add(node.id);
  for (const outgoer of getOutgoers(node, nodes, edges)) {
    if (outgoer.id === connection.source) {
      return true;
    }
    if (hasCycle(outgoer, connection, nodes, edges, visited)) {
      return true;
    }
  }
  return false;
}
export function useIsValidConnection(nodes: Node[], edges: Edge[]) {
  return useCallback(
    (connection: Connection | Edge) => {
      if (connection.source === connection.target) {
        return false;
      }
      const target = nodes.find((node) => node.id === connection.target);
      return target ? !hasCycle(target, connection, nodes, edges) : true;
    },
    [nodes, edges]
  );
}
