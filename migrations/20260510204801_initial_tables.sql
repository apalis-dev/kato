PRAGMA journal_mode = WAL;

PRAGMA foreign_keys = ON;

CREATE TABLE plugins (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  description TEXT,
  path BLOB NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled', 'error')),
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE nodes (
  id TEXT PRIMARY KEY,
  plugin_id TEXT NOT NULL REFERENCES plugins(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  label TEXT NOT NULL,
  -- 'trigger' | 'transform' | 'output' | etc.
  category TEXT,
  description TEXT,
  icon TEXT,
  -- e.g. 'i-custom:icon'
  available INTEGER NOT NULL DEFAULT 1,
  config_schema TEXT,
  -- JSON Schema for instance config
  default_data TEXT,
  -- JSON default instance data
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  UNIQUE (plugin_id, name)
);

-- ── Ports ─────────────────────────────────────────────────────────────────────
-- Each node declares its input and output ports.
-- Compatibility is determined by port_type, not by node pairs.
CREATE TABLE node_ports (
  id TEXT PRIMARY KEY,
  node_id TEXT NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  handle TEXT NOT NULL,
  -- e.g. 'output', 'true', 'false', 'items'
  direction TEXT NOT NULL CHECK (direction IN ('input', 'output')),
  port_type TEXT NOT NULL,
  -- e.g. 'any' | 'number' | 'http.response'
  label TEXT,
  description TEXT,
  multiple INTEGER NOT NULL DEFAULT 0,
  -- can multiple edges attach to this port?
  required INTEGER NOT NULL DEFAULT 0,
  -- for inputs: must be connected to run?
  sort_order INTEGER NOT NULL DEFAULT 0,
  UNIQUE (node_id, handle, direction)
);

CREATE TABLE port_type_compat (
  id TEXT PRIMARY KEY,
  from_port_type TEXT NOT NULL,
  -- output side
  to_port_type TEXT NOT NULL,
  -- input side
  UNIQUE (from_port_type, to_port_type)
);

CREATE TABLE workflows (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE workflow_nodes (
  id TEXT PRIMARY KEY,
  workflow_id TEXT NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  node_id TEXT NOT NULL REFERENCES nodes(id),
  label TEXT,
  config TEXT,
  -- JSON matching nodes.config_schema
  pos_x REAL NOT NULL DEFAULT 0,
  pos_y REAL NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- ── Workflow edges (connections between workflow node instances) ───────────────
-- from/to reference workflow_nodes, handles reference node_ports.
-- Validity is checked at publish time via port_type_compat.
CREATE TABLE workflow_edges (
  id TEXT PRIMARY KEY,
  workflow_id TEXT NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  from_node_id TEXT NOT NULL REFERENCES workflow_nodes(id) ON DELETE CASCADE,
  from_handle TEXT NOT NULL,
  to_node_id TEXT NOT NULL REFERENCES workflow_nodes(id) ON DELETE CASCADE,
  to_handle TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  UNIQUE (
    workflow_id,
    from_node_id,
    from_handle,
    to_node_id,
    to_handle
  )
);

CREATE TABLE executions (
  id TEXT PRIMARY KEY,
  workflow_id TEXT NOT NULL REFERENCES workflows(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN (
      'pending',
      'running',
      'success',
      'failed',
      'cancelled'
    )
  ),
  trigger_payload TEXT,
  started_at INTEGER,
  finished_at INTEGER
);

CREATE TABLE logs (
  id TEXT PRIMARY KEY,
  execution_id TEXT NOT NULL REFERENCES executions(id) ON DELETE CASCADE,
  workflow_node_id TEXT NOT NULL REFERENCES workflow_nodes(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN (
      'pending',
      'running',
      'success',
      'failed',
      'skipped'
    )
  ),
  input_data TEXT,
  output_data TEXT,
  error TEXT,
  started_at INTEGER,
  finished_at INTEGER
);

CREATE INDEX idx_nodes_plugin ON nodes(plugin_id);

CREATE INDEX idx_node_ports_node ON node_ports(node_id);

CREATE INDEX idx_node_ports_type ON node_ports(port_type);

CREATE INDEX idx_port_compat_from ON port_type_compat(from_port_type);

CREATE INDEX idx_wf_nodes_workflow ON workflow_nodes(workflow_id);

CREATE INDEX idx_wf_edges_workflow ON workflow_edges(workflow_id);

CREATE INDEX idx_wf_edges_from ON workflow_edges(from_node_id);

CREATE INDEX idx_wf_edges_to ON workflow_edges(to_node_id);

CREATE INDEX idx_executions_workflow ON executions(workflow_id);

CREATE INDEX idx_logs_execution ON logs(execution_id);

CREATE INDEX idx_logs_node ON logs(workflow_node_id);
