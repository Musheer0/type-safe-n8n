import { Edge, Node } from "@xyflow/react";
import { create } from "zustand";

// ─── Types ────────────────────────────────────────────────────────────────────

/** Keys prefixed with `_user` are editable by the user.
 *  Keys prefixed with `_internal` are managed by the store. */
export interface NodeData extends Record<string, unknown> {
  // User-facing
  _user_name: string;
  _user_data: Record<string, unknown>;

  // Internal / derived
  _internal_connectedSources: string[]; // node ids that feed INTO this node
  _internal_connectedTargets: string[]; // node ids this node feeds INTO
  _internal_edgeIds: string[];          // edge ids this node participates in,
  _internal_position:{x:number, y:number}
}

interface FlowStore {
  nodes: Node<NodeData>[];
  edges: Edge[];

  // ── Node operations ──────────────────────────────────────────────────────
  setNodes: (nodes: Node[]) => void;
  addNode: (id: string) => void;
  removeNode: (id: string) => void;
  updateNodeName: (id: string, name: string) => void;
  updateNodeData: (id: string, data: Partial<NodeData["_user_data"]>) => void;

  // ── Edge operations ──────────────────────────────────────────────────────
  addEdge: (fromNodeId: string, toNodeId: string) => void;
  removeEdge: (fromNodeId: string, toNodeId: string) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Build a deterministic edge id from the two endpoint node ids. */
const buildEdgeId = (from: string, to: string) => `edge__${from}__${to}`;

/** Produce a fresh NodeData object for a newly created node. */
const makeNodeData = (name: string): NodeData => ({
  // Spread whatever base schema you have defined in your types file
  _user_name: name,
  _user_data: {},

  _internal_connectedSources: [],
  _internal_connectedTargets: [],
  _internal_edgeIds: [],
  _internal_position:{x:50, y:0}
});
 
/** Update a single node inside the array immutably. */
const patchNode = (
  nodes: Node<NodeData>[],
  id: string,
  patch: (prev: NodeData) => Partial<NodeData>
): Node<NodeData>[] =>
  nodes.map((n) =>
    n.id === id ? { ...n, data: { ...n.data, ...patch(n.data) } } : n
  );

// ─── Store ────────────────────────────────────────────────────────────────────

export const useFlowStore = create<FlowStore>((set, get) => ({
  nodes: [],
  edges: [],

  // ── setNodes ──────────────────────────────────────────────────────────────
  /**
   * Replace the node list and rebuild all edges derived from node.data.
   * Any edge implied by _internal_connectedTargets is (re)created.
   */
  setNodes: (incoming: Node[]) => {
    const nodes = incoming as Node<NodeData>[];

    const edgeSet = new Map<string, Edge>();

    for (const node of nodes) {
      const targets: string[] = node.data?._internal_connectedTargets ?? [];
      for (const targetId of targets) {
        const id = buildEdgeId(node.id, targetId);
        edgeSet.set(id, {
          id,
          source: node.id,
          target: targetId,
        });
      }
    }

    set({ nodes, edges: Array.from(edgeSet.values()) });
  },

  // ── addNode ───────────────────────────────────────────────────────────────
  addNode: (id: string) => {
    const position = {
      x: Math.random() * 400,
      y: Math.random() * 400,
    };

    const newNode: Node<NodeData> = {
      id,
      position,
      data: makeNodeData(id),
      type: "default",
    };

    set((state) => ({ nodes: [...state.nodes, newNode] }));
  },

  // ── removeNode ────────────────────────────────────────────────────────────
  /**
   * Remove the node and prune every edge that touched it.
   * Also cleans up connection references in neighbouring nodes.
   */
  removeNode: (id: string) => {
    set((state) => {
      const survivingEdges = state.edges.filter(
        (e) => e.source !== id && e.target !== id
      );

      // Collect neighbour ids that need cleanup
      const removedEdges = state.edges.filter(
        (e) => e.source === id || e.target === id
      );

      let nodes = state.nodes.filter((n) => n.id !== id);

      for (const edge of removedEdges) {
        const neighbourId = edge.source === id ? edge.target : edge.source;

        nodes = patchNode(nodes, neighbourId, (prev) => ({
          _internal_connectedSources: prev._internal_connectedSources.filter(
            (s) => s !== id
          ),
          _internal_connectedTargets: prev._internal_connectedTargets.filter(
            (t) => t !== id
          ),
          _internal_edgeIds: prev._internal_edgeIds.filter(
            (eid) => eid !== edge.id
          ),
        }));
      }

      return { nodes, edges: survivingEdges };
    });
  },

  // ── addEdge ───────────────────────────────────────────────────────────────
  /**
   * Creates an edge and updates both endpoint nodes:
   *  • source node gains the target in _internal_connectedTargets
   *  • target node gains the source in _internal_connectedSources
   *  • both nodes register the new edge id in _internal_edgeIds
   */
  addEdge: (fromNodeId: string, toNodeId: string) => {
    set((state) => {
      const id = buildEdgeId(fromNodeId, toNodeId);

      // Avoid duplicates
      if (state.edges.some((e) => e.id === id)) return state;

      const newEdge: Edge = { id, source: fromNodeId, target: toNodeId };

      let nodes = patchNode(state.nodes, fromNodeId, (prev) => ({
        _internal_connectedTargets: [
          ...new Set([...prev._internal_connectedTargets, toNodeId]),
        ],
        _internal_edgeIds: [...new Set([...prev._internal_edgeIds, id])],
      }));

      nodes = patchNode(nodes, toNodeId, (prev) => ({
        _internal_connectedSources: [
          ...new Set([...prev._internal_connectedSources, fromNodeId]),
        ],
        _internal_edgeIds: [...new Set([...prev._internal_edgeIds, id])],
      }));

      return { nodes, edges: [...state.edges, newEdge] };
    });
  },

  // ── removeEdge ────────────────────────────────────────────────────────────
  /**
   * Removes the edge and cleans up both endpoint nodes' internal data.
   */
  removeEdge: (fromNodeId: string, toNodeId: string) => {
    set((state) => {
      const id = buildEdgeId(fromNodeId, toNodeId);

      let nodes = patchNode(state.nodes, fromNodeId, (prev) => ({
        _internal_connectedTargets: prev._internal_connectedTargets.filter(
          (t) => t !== toNodeId
        ),
        _internal_edgeIds: prev._internal_edgeIds.filter((eid) => eid !== id),
      }));

      nodes = patchNode(nodes, toNodeId, (prev) => ({
        _internal_connectedSources: prev._internal_connectedSources.filter(
          (s) => s !== fromNodeId
        ),
        _internal_edgeIds: prev._internal_edgeIds.filter((eid) => eid !== id),
      }));

      return {
        nodes,
        edges: state.edges.filter((e) => e.id !== id),
      };
    });
  },

  // ── updateNodeName ────────────────────────────────────────────────────────
  updateNodeName: (id: string, name: string) => {
    set((state) => ({
      nodes: patchNode(state.nodes, id, () => ({ _user_name: name })),
    }));
  },

  // ── updateNodeData ────────────────────────────────────────────────────────
  /** Shallow-merges new key/value pairs into the node's _user_data bag. */
  updateNodeData: (id: string, data: Partial<NodeData["_user_data"]>) => {
    set((state) => ({
      nodes: patchNode(state.nodes, id, (prev) => ({
        _user_data: { ...prev._user_data, ...data },
      })),
    }));
  },
}));