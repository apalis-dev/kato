use actix_web::{App, HttpResponse, HttpServer, Responder, delete, get, post, put, web};
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, sqlite::SqlitePool};

#[derive(Debug, Serialize, Deserialize, FromRow)]
struct Plugin {
    id: String,
    name: String,
    version: String,
    description: Option<String>,
    entry_point: String,
    status: String,
    created_at: i64,
    updated_at: i64,
}

#[derive(Debug, Deserialize)]
struct CreatePlugin {
    id: String,
    name: String,
    version: String,
    description: Option<String>,
    entry_point: String,
    status: Option<String>,
}

#[derive(Debug, Deserialize)]
struct UpdatePlugin {
    name: Option<String>,
    version: Option<String>,
    description: Option<String>,
    entry_point: Option<String>,
    status: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
struct Node {
    id: String,
    plugin_id: String,
    name: String,
    label: String,
    category: Option<String>,
    description: Option<String>,
    icon: Option<String>,
    available: i64,
    config_schema: Option<String>,
    default_data: Option<String>,
    created_at: i64,
}

#[derive(Debug, Deserialize)]
struct CreateNode {
    id: String,
    plugin_id: String,
    name: String,
    label: String,
    category: Option<String>,
    description: Option<String>,
    icon: Option<String>,
    available: Option<i64>,
    config_schema: Option<String>,
    default_data: Option<String>,
}

#[derive(Debug, Deserialize)]
struct UpdateNode {
    label: Option<String>,
    category: Option<String>,
    description: Option<String>,
    icon: Option<String>,
    available: Option<i64>,
    config_schema: Option<String>,
    default_data: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
struct NodePort {
    id: String,
    node_id: String,
    handle: String,
    direction: String,
    port_type: String,
    label: Option<String>,
    description: Option<String>,
    multiple: i64,
    required: i64,
    sort_order: i64,
}

#[derive(Debug, Deserialize)]
struct CreateNodePort {
    id: String,
    node_id: String,
    handle: String,
    direction: String,
    port_type: String,
    label: Option<String>,
    description: Option<String>,
    multiple: Option<i64>,
    required: Option<i64>,
    sort_order: Option<i64>,
}

#[derive(Debug, Deserialize)]
struct UpdateNodePort {
    label: Option<String>,
    description: Option<String>,
    multiple: Option<i64>,
    required: Option<i64>,
    sort_order: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
struct PortTypeCompat {
    id: String,
    from_port_type: String,
    to_port_type: String,
}

#[derive(Debug, Deserialize)]
struct CreatePortTypeCompat {
    id: String,
    from_port_type: String,
    to_port_type: String,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
struct Workflow {
    id: String,
    name: String,
    description: Option<String>,
    status: String,
    created_at: i64,
    updated_at: i64,
}

#[derive(Debug, Deserialize)]
struct CreateWorkflow {
    id: String,
    name: String,
    description: Option<String>,
    status: Option<String>,
}

#[derive(Debug, Deserialize)]
struct UpdateWorkflow {
    name: Option<String>,
    description: Option<String>,
    status: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
struct WorkflowNode {
    id: String,
    workflow_id: String,
    node_id: String,
    label: Option<String>,
    config: Option<String>,
    pos_x: f64,
    pos_y: f64,
    created_at: i64,
}

#[derive(Debug, Deserialize)]
struct CreateWorkflowNode {
    id: String,
    workflow_id: String,
    node_id: String,
    label: Option<String>,
    config: Option<String>,
    pos_x: Option<f64>,
    pos_y: Option<f64>,
}

#[derive(Debug, Deserialize)]
struct UpdateWorkflowNode {
    label: Option<String>,
    config: Option<String>,
    pos_x: Option<f64>,
    pos_y: Option<f64>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
struct WorkflowEdge {
    id: String,
    workflow_id: String,
    from_node_id: String,
    from_handle: String,
    to_node_id: String,
    to_handle: String,
    created_at: i64,
}

#[derive(Debug, Deserialize)]
struct CreateWorkflowEdge {
    id: String,
    workflow_id: String,
    from_node_id: String,
    from_handle: String,
    to_node_id: String,
    to_handle: String,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
struct Execution {
    id: String,
    workflow_id: String,
    status: String,
    trigger_payload: Option<String>,
    started_at: Option<i64>,
    finished_at: Option<i64>,
}

#[derive(Debug, Deserialize)]
struct CreateExecution {
    id: String,
    workflow_id: String,
    status: Option<String>,
    trigger_payload: Option<String>,
    started_at: Option<i64>,
    finished_at: Option<i64>,
}

#[derive(Debug, Deserialize)]
struct UpdateExecution {
    status: Option<String>,
    trigger_payload: Option<String>,
    started_at: Option<i64>,
    finished_at: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
struct Log {
    id: String,
    execution_id: String,
    workflow_node_id: String,
    status: String,
    input_data: Option<String>,
    output_data: Option<String>,
    error: Option<String>,
    started_at: Option<i64>,
    finished_at: Option<i64>,
}

#[derive(Debug, Deserialize)]
struct CreateLog {
    id: String,
    execution_id: String,
    workflow_node_id: String,
    status: Option<String>,
    input_data: Option<String>,
    output_data: Option<String>,
    error: Option<String>,
    started_at: Option<i64>,
    finished_at: Option<i64>,
}

#[derive(Debug, Deserialize)]
struct UpdateLog {
    status: Option<String>,
    input_data: Option<String>,
    output_data: Option<String>,
    error: Option<String>,
    started_at: Option<i64>,
    finished_at: Option<i64>,
}

struct AppState {
    db: SqlitePool,
}

#[get("/plugins")]
async fn list_plugins(state: web::Data<AppState>) -> impl Responder {
    match sqlx::query_as::<_, Plugin>("SELECT * FROM plugins ORDER BY created_at DESC")
        .fetch_all(&state.db)
        .await
    {
        Ok(rows) => HttpResponse::Ok().json(rows),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

#[get("/plugins/{id}")]
async fn get_plugin(state: web::Data<AppState>, path: web::Path<String>) -> impl Responder {
    let id = path.into_inner();
    match sqlx::query_as::<_, Plugin>("SELECT * FROM plugins WHERE id = ?")
        .bind(&id)
        .fetch_optional(&state.db)
        .await
    {
        Ok(Some(row)) => HttpResponse::Ok().json(row),
        Ok(None) => HttpResponse::NotFound().body("Plugin not found"),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

#[post("/plugins")]
async fn create_plugin(
    state: web::Data<AppState>,
    body: web::Json<CreatePlugin>,
) -> impl Responder {
    let status = body.status.clone().unwrap_or_else(|| "active".to_string());
    match sqlx::query(
        "INSERT INTO plugins (id, name, version, description, entry_point, status)
         VALUES (?, ?, ?, ?, ?, ?)",
    )
    .bind(&body.id)
    .bind(&body.name)
    .bind(&body.version)
    .bind(&body.description)
    .bind(&body.entry_point)
    .bind(&status)
    .execute(&state.db)
    .await
    {
        Ok(_) => {
            match sqlx::query_as::<_, Plugin>("SELECT * FROM plugins WHERE id = ?")
                .bind(&body.id)
                .fetch_one(&state.db)
                .await
            {
                Ok(row) => HttpResponse::Created().json(row),
                Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
            }
        }
        Err(e) => HttpResponse::BadRequest().body(e.to_string()),
    }
}

#[put("/plugins/{id}")]
async fn update_plugin(
    state: web::Data<AppState>,
    path: web::Path<String>,
    body: web::Json<UpdatePlugin>,
) -> impl Responder {
    let id = path.into_inner();
    let result = sqlx::query(
        "UPDATE plugins SET
           name        = COALESCE(?, name),
           version     = COALESCE(?, version),
           description = COALESCE(?, description),
           entry_point = COALESCE(?, entry_point),
           status      = COALESCE(?, status),
           updated_at  = unixepoch()
         WHERE id = ?",
    )
    .bind(&body.name)
    .bind(&body.version)
    .bind(&body.description)
    .bind(&body.entry_point)
    .bind(&body.status)
    .bind(&id)
    .execute(&state.db)
    .await;

    match result {
        Ok(r) if r.rows_affected() == 0 => HttpResponse::NotFound().body("Plugin not found"),
        Ok(_) => match sqlx::query_as::<_, Plugin>("SELECT * FROM plugins WHERE id = ?")
            .bind(&id)
            .fetch_one(&state.db)
            .await
        {
            Ok(row) => HttpResponse::Ok().json(row),
            Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
        },
        Err(e) => HttpResponse::BadRequest().body(e.to_string()),
    }
}

#[delete("/plugins/{id}")]
async fn delete_plugin(state: web::Data<AppState>, path: web::Path<String>) -> impl Responder {
    let id = path.into_inner();
    match sqlx::query("DELETE FROM plugins WHERE id = ?")
        .bind(&id)
        .execute(&state.db)
        .await
    {
        Ok(r) if r.rows_affected() == 0 => HttpResponse::NotFound().body("Plugin not found"),
        Ok(_) => HttpResponse::NoContent().finish(),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

#[get("/nodes")]
async fn list_nodes(state: web::Data<AppState>) -> impl Responder {
    match sqlx::query_as::<_, Node>("SELECT * FROM nodes ORDER BY created_at DESC")
        .fetch_all(&state.db)
        .await
    {
        Ok(rows) => HttpResponse::Ok().json(rows),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

#[get("/nodes/{id}")]
async fn get_node(state: web::Data<AppState>, path: web::Path<String>) -> impl Responder {
    let id = path.into_inner();
    match sqlx::query_as::<_, Node>("SELECT * FROM nodes WHERE id = ?")
        .bind(&id)
        .fetch_optional(&state.db)
        .await
    {
        Ok(Some(row)) => HttpResponse::Ok().json(row),
        Ok(None) => HttpResponse::NotFound().body("Node not found"),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

#[post("/nodes")]
async fn create_node(state: web::Data<AppState>, body: web::Json<CreateNode>) -> impl Responder {
    let available = body.available.unwrap_or(1);
    match sqlx::query(
        "INSERT INTO nodes (id, plugin_id, name, label, category, description, icon, available, config_schema, default_data)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(&body.id)
    .bind(&body.plugin_id)
    .bind(&body.name)
    .bind(&body.label)
    .bind(&body.category)
    .bind(&body.description)
    .bind(&body.icon)
    .bind(available)
    .bind(&body.config_schema)
    .bind(&body.default_data)
    .execute(&state.db)
    .await
    {
        Ok(_) => match sqlx::query_as::<_, Node>("SELECT * FROM nodes WHERE id = ?")
            .bind(&body.id)
            .fetch_one(&state.db)
            .await
        {
            Ok(row) => HttpResponse::Created().json(row),
            Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
        },
        Err(e) => HttpResponse::BadRequest().body(e.to_string()),
    }
}

#[put("/nodes/{id}")]
async fn update_node(
    state: web::Data<AppState>,
    path: web::Path<String>,
    body: web::Json<UpdateNode>,
) -> impl Responder {
    let id = path.into_inner();
    let result = sqlx::query(
        "UPDATE nodes SET
           label         = COALESCE(?, label),
           category      = COALESCE(?, category),
           description   = COALESCE(?, description),
           icon          = COALESCE(?, icon),
           available     = COALESCE(?, available),
           config_schema = COALESCE(?, config_schema),
           default_data  = COALESCE(?, default_data)
         WHERE id = ?",
    )
    .bind(&body.label)
    .bind(&body.category)
    .bind(&body.description)
    .bind(&body.icon)
    .bind(body.available)
    .bind(&body.config_schema)
    .bind(&body.default_data)
    .bind(&id)
    .execute(&state.db)
    .await;

    match result {
        Ok(r) if r.rows_affected() == 0 => HttpResponse::NotFound().body("Node not found"),
        Ok(_) => match sqlx::query_as::<_, Node>("SELECT * FROM nodes WHERE id = ?")
            .bind(&id)
            .fetch_one(&state.db)
            .await
        {
            Ok(row) => HttpResponse::Ok().json(row),
            Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
        },
        Err(e) => HttpResponse::BadRequest().body(e.to_string()),
    }
}

#[delete("/nodes/{id}")]
async fn delete_node(state: web::Data<AppState>, path: web::Path<String>) -> impl Responder {
    let id = path.into_inner();
    match sqlx::query("DELETE FROM nodes WHERE id = ?")
        .bind(&id)
        .execute(&state.db)
        .await
    {
        Ok(r) if r.rows_affected() == 0 => HttpResponse::NotFound().body("Node not found"),
        Ok(_) => HttpResponse::NoContent().finish(),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

#[get("/node-ports")]
async fn list_node_ports(state: web::Data<AppState>) -> impl Responder {
    match sqlx::query_as::<_, NodePort>("SELECT * FROM node_ports ORDER BY sort_order")
        .fetch_all(&state.db)
        .await
    {
        Ok(rows) => HttpResponse::Ok().json(rows),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

#[get("/node-ports/{id}")]
async fn get_node_port(state: web::Data<AppState>, path: web::Path<String>) -> impl Responder {
    let id = path.into_inner();
    match sqlx::query_as::<_, NodePort>("SELECT * FROM node_ports WHERE id = ?")
        .bind(&id)
        .fetch_optional(&state.db)
        .await
    {
        Ok(Some(row)) => HttpResponse::Ok().json(row),
        Ok(None) => HttpResponse::NotFound().body("NodePort not found"),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

#[post("/node-ports")]
async fn create_node_port(
    state: web::Data<AppState>,
    body: web::Json<CreateNodePort>,
) -> impl Responder {
    match sqlx::query(
        "INSERT INTO node_ports (id, node_id, handle, direction, port_type, label, description, multiple, required, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(&body.id)
    .bind(&body.node_id)
    .bind(&body.handle)
    .bind(&body.direction)
    .bind(&body.port_type)
    .bind(&body.label)
    .bind(&body.description)
    .bind(body.multiple.unwrap_or(0))
    .bind(body.required.unwrap_or(0))
    .bind(body.sort_order.unwrap_or(0))
    .execute(&state.db)
    .await
    {
        Ok(_) => match sqlx::query_as::<_, NodePort>("SELECT * FROM node_ports WHERE id = ?")
            .bind(&body.id)
            .fetch_one(&state.db)
            .await
        {
            Ok(row) => HttpResponse::Created().json(row),
            Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
        },
        Err(e) => HttpResponse::BadRequest().body(e.to_string()),
    }
}

#[put("/node-ports/{id}")]
async fn update_node_port(
    state: web::Data<AppState>,
    path: web::Path<String>,
    body: web::Json<UpdateNodePort>,
) -> impl Responder {
    let id = path.into_inner();
    let result = sqlx::query(
        "UPDATE node_ports SET
           label       = COALESCE(?, label),
           description = COALESCE(?, description),
           multiple    = COALESCE(?, multiple),
           required    = COALESCE(?, required),
           sort_order  = COALESCE(?, sort_order)
         WHERE id = ?",
    )
    .bind(&body.label)
    .bind(&body.description)
    .bind(body.multiple)
    .bind(body.required)
    .bind(body.sort_order)
    .bind(&id)
    .execute(&state.db)
    .await;

    match result {
        Ok(r) if r.rows_affected() == 0 => HttpResponse::NotFound().body("NodePort not found"),
        Ok(_) => match sqlx::query_as::<_, NodePort>("SELECT * FROM node_ports WHERE id = ?")
            .bind(&id)
            .fetch_one(&state.db)
            .await
        {
            Ok(row) => HttpResponse::Ok().json(row),
            Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
        },
        Err(e) => HttpResponse::BadRequest().body(e.to_string()),
    }
}

#[delete("/node-ports/{id}")]
async fn delete_node_port(state: web::Data<AppState>, path: web::Path<String>) -> impl Responder {
    let id = path.into_inner();
    match sqlx::query("DELETE FROM node_ports WHERE id = ?")
        .bind(&id)
        .execute(&state.db)
        .await
    {
        Ok(r) if r.rows_affected() == 0 => HttpResponse::NotFound().body("NodePort not found"),
        Ok(_) => HttpResponse::NoContent().finish(),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

#[get("/port-type-compat")]
async fn list_port_type_compat(state: web::Data<AppState>) -> impl Responder {
    match sqlx::query_as::<_, PortTypeCompat>("SELECT * FROM port_type_compat")
        .fetch_all(&state.db)
        .await
    {
        Ok(rows) => HttpResponse::Ok().json(rows),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

#[get("/port-type-compat/{id}")]
async fn get_port_type_compat(
    state: web::Data<AppState>,
    path: web::Path<String>,
) -> impl Responder {
    let id = path.into_inner();
    match sqlx::query_as::<_, PortTypeCompat>("SELECT * FROM port_type_compat WHERE id = ?")
        .bind(&id)
        .fetch_optional(&state.db)
        .await
    {
        Ok(Some(row)) => HttpResponse::Ok().json(row),
        Ok(None) => HttpResponse::NotFound().body("PortTypeCompat not found"),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

#[post("/port-type-compat")]
async fn create_port_type_compat(
    state: web::Data<AppState>,
    body: web::Json<CreatePortTypeCompat>,
) -> impl Responder {
    match sqlx::query(
        "INSERT INTO port_type_compat (id, from_port_type, to_port_type) VALUES (?, ?, ?)",
    )
    .bind(&body.id)
    .bind(&body.from_port_type)
    .bind(&body.to_port_type)
    .execute(&state.db)
    .await
    {
        Ok(_) => {
            match sqlx::query_as::<_, PortTypeCompat>("SELECT * FROM port_type_compat WHERE id = ?")
                .bind(&body.id)
                .fetch_one(&state.db)
                .await
            {
                Ok(row) => HttpResponse::Created().json(row),
                Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
            }
        }
        Err(e) => HttpResponse::BadRequest().body(e.to_string()),
    }
}

#[delete("/port-type-compat/{id}")]
async fn delete_port_type_compat(
    state: web::Data<AppState>,
    path: web::Path<String>,
) -> impl Responder {
    let id = path.into_inner();
    match sqlx::query("DELETE FROM port_type_compat WHERE id = ?")
        .bind(&id)
        .execute(&state.db)
        .await
    {
        Ok(r) if r.rows_affected() == 0 => {
            HttpResponse::NotFound().body("PortTypeCompat not found")
        }
        Ok(_) => HttpResponse::NoContent().finish(),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

#[get("/workflows")]
async fn list_workflows(state: web::Data<AppState>) -> impl Responder {
    match sqlx::query_as::<_, Workflow>("SELECT * FROM workflows ORDER BY created_at DESC")
        .fetch_all(&state.db)
        .await
    {
        Ok(rows) => HttpResponse::Ok().json(rows),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

#[get("/workflows/{id}")]
async fn get_workflow(state: web::Data<AppState>, path: web::Path<String>) -> impl Responder {
    let id = path.into_inner();
    match sqlx::query_as::<_, Workflow>("SELECT * FROM workflows WHERE id = ?")
        .bind(&id)
        .fetch_optional(&state.db)
        .await
    {
        Ok(Some(row)) => HttpResponse::Ok().json(row),
        Ok(None) => HttpResponse::NotFound().body("Workflow not found"),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

#[post("/workflows")]
async fn create_workflow(
    state: web::Data<AppState>,
    body: web::Json<CreateWorkflow>,
) -> impl Responder {
    let status = body.status.clone().unwrap_or_else(|| "draft".to_string());
    match sqlx::query("INSERT INTO workflows (id, name, description, status) VALUES (?, ?, ?, ?)")
        .bind(&body.id)
        .bind(&body.name)
        .bind(&body.description)
        .bind(&status)
        .execute(&state.db)
        .await
    {
        Ok(_) => match sqlx::query_as::<_, Workflow>("SELECT * FROM workflows WHERE id = ?")
            .bind(&body.id)
            .fetch_one(&state.db)
            .await
        {
            Ok(row) => HttpResponse::Created().json(row),
            Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
        },
        Err(e) => HttpResponse::BadRequest().body(e.to_string()),
    }
}

#[put("/workflows/{id}")]
async fn update_workflow(
    state: web::Data<AppState>,
    path: web::Path<String>,
    body: web::Json<UpdateWorkflow>,
) -> impl Responder {
    let id = path.into_inner();
    let result = sqlx::query(
        "UPDATE workflows SET
           name        = COALESCE(?, name),
           description = COALESCE(?, description),
           status      = COALESCE(?, status),
           updated_at  = unixepoch()
         WHERE id = ?",
    )
    .bind(&body.name)
    .bind(&body.description)
    .bind(&body.status)
    .bind(&id)
    .execute(&state.db)
    .await;

    match result {
        Ok(r) if r.rows_affected() == 0 => HttpResponse::NotFound().body("Workflow not found"),
        Ok(_) => match sqlx::query_as::<_, Workflow>("SELECT * FROM workflows WHERE id = ?")
            .bind(&id)
            .fetch_one(&state.db)
            .await
        {
            Ok(row) => HttpResponse::Ok().json(row),
            Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
        },
        Err(e) => HttpResponse::BadRequest().body(e.to_string()),
    }
}

#[delete("/workflows/{id}")]
async fn delete_workflow(state: web::Data<AppState>, path: web::Path<String>) -> impl Responder {
    let id = path.into_inner();
    match sqlx::query("DELETE FROM workflows WHERE id = ?")
        .bind(&id)
        .execute(&state.db)
        .await
    {
        Ok(r) if r.rows_affected() == 0 => HttpResponse::NotFound().body("Workflow not found"),
        Ok(_) => HttpResponse::NoContent().finish(),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

#[get("/workflow-nodes")]
async fn list_workflow_nodes(state: web::Data<AppState>) -> impl Responder {
    match sqlx::query_as::<_, WorkflowNode>("SELECT * FROM workflow_nodes ORDER BY created_at DESC")
        .fetch_all(&state.db)
        .await
    {
        Ok(rows) => HttpResponse::Ok().json(rows),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

#[get("/workflow-nodes/{id}")]
async fn get_workflow_node(state: web::Data<AppState>, path: web::Path<String>) -> impl Responder {
    let id = path.into_inner();
    match sqlx::query_as::<_, WorkflowNode>("SELECT * FROM workflow_nodes WHERE id = ?")
        .bind(&id)
        .fetch_optional(&state.db)
        .await
    {
        Ok(Some(row)) => HttpResponse::Ok().json(row),
        Ok(None) => HttpResponse::NotFound().body("WorkflowNode not found"),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

#[post("/workflow-nodes")]
async fn create_workflow_node(
    state: web::Data<AppState>,
    body: web::Json<CreateWorkflowNode>,
) -> impl Responder {
    match sqlx::query(
        "INSERT INTO workflow_nodes (id, workflow_id, node_id, label, config, pos_x, pos_y)
         VALUES (?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(&body.id)
    .bind(&body.workflow_id)
    .bind(&body.node_id)
    .bind(&body.label)
    .bind(&body.config)
    .bind(body.pos_x.unwrap_or(0.0))
    .bind(body.pos_y.unwrap_or(0.0))
    .execute(&state.db)
    .await
    {
        Ok(_) => {
            match sqlx::query_as::<_, WorkflowNode>("SELECT * FROM workflow_nodes WHERE id = ?")
                .bind(&body.id)
                .fetch_one(&state.db)
                .await
            {
                Ok(row) => HttpResponse::Created().json(row),
                Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
            }
        }
        Err(e) => HttpResponse::BadRequest().body(e.to_string()),
    }
}

#[put("/workflow-nodes/{id}")]
async fn update_workflow_node(
    state: web::Data<AppState>,
    path: web::Path<String>,
    body: web::Json<UpdateWorkflowNode>,
) -> impl Responder {
    let id = path.into_inner();
    let result = sqlx::query(
        "UPDATE workflow_nodes SET
           label  = COALESCE(?, label),
           config = COALESCE(?, config),
           pos_x  = COALESCE(?, pos_x),
           pos_y  = COALESCE(?, pos_y)
         WHERE id = ?",
    )
    .bind(&body.label)
    .bind(&body.config)
    .bind(body.pos_x)
    .bind(body.pos_y)
    .bind(&id)
    .execute(&state.db)
    .await;

    match result {
        Ok(r) if r.rows_affected() == 0 => HttpResponse::NotFound().body("WorkflowNode not found"),
        Ok(_) => {
            match sqlx::query_as::<_, WorkflowNode>("SELECT * FROM workflow_nodes WHERE id = ?")
                .bind(&id)
                .fetch_one(&state.db)
                .await
            {
                Ok(row) => HttpResponse::Ok().json(row),
                Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
            }
        }
        Err(e) => HttpResponse::BadRequest().body(e.to_string()),
    }
}

#[delete("/workflow-nodes/{id}")]
async fn delete_workflow_node(
    state: web::Data<AppState>,
    path: web::Path<String>,
) -> impl Responder {
    let id = path.into_inner();
    match sqlx::query("DELETE FROM workflow_nodes WHERE id = ?")
        .bind(&id)
        .execute(&state.db)
        .await
    {
        Ok(r) if r.rows_affected() == 0 => HttpResponse::NotFound().body("WorkflowNode not found"),
        Ok(_) => HttpResponse::NoContent().finish(),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

#[get("/workflow-edges")]
async fn list_workflow_edges(state: web::Data<AppState>) -> impl Responder {
    match sqlx::query_as::<_, WorkflowEdge>("SELECT * FROM workflow_edges ORDER BY created_at DESC")
        .fetch_all(&state.db)
        .await
    {
        Ok(rows) => HttpResponse::Ok().json(rows),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

#[get("/workflow-edges/{id}")]
async fn get_workflow_edge(state: web::Data<AppState>, path: web::Path<String>) -> impl Responder {
    let id = path.into_inner();
    match sqlx::query_as::<_, WorkflowEdge>("SELECT * FROM workflow_edges WHERE id = ?")
        .bind(&id)
        .fetch_optional(&state.db)
        .await
    {
        Ok(Some(row)) => HttpResponse::Ok().json(row),
        Ok(None) => HttpResponse::NotFound().body("WorkflowEdge not found"),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

#[post("/workflow-edges")]
async fn create_workflow_edge(
    state: web::Data<AppState>,
    body: web::Json<CreateWorkflowEdge>,
) -> impl Responder {
    match sqlx::query(
        "INSERT INTO workflow_edges (id, workflow_id, from_node_id, from_handle, to_node_id, to_handle)
         VALUES (?, ?, ?, ?, ?, ?)",
    )
    .bind(&body.id)
    .bind(&body.workflow_id)
    .bind(&body.from_node_id)
    .bind(&body.from_handle)
    .bind(&body.to_node_id)
    .bind(&body.to_handle)
    .execute(&state.db)
    .await
    {
        Ok(_) => {
            match sqlx::query_as::<_, WorkflowEdge>("SELECT * FROM workflow_edges WHERE id = ?")
                .bind(&body.id)
                .fetch_one(&state.db)
                .await
            {
                Ok(row) => HttpResponse::Created().json(row),
                Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
            }
        }
        Err(e) => HttpResponse::BadRequest().body(e.to_string()),
    }
}

#[delete("/workflow-edges/{id}")]
async fn delete_workflow_edge(
    state: web::Data<AppState>,
    path: web::Path<String>,
) -> impl Responder {
    let id = path.into_inner();
    match sqlx::query("DELETE FROM workflow_edges WHERE id = ?")
        .bind(&id)
        .execute(&state.db)
        .await
    {
        Ok(r) if r.rows_affected() == 0 => HttpResponse::NotFound().body("WorkflowEdge not found"),
        Ok(_) => HttpResponse::NoContent().finish(),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

#[get("/executions")]
async fn list_executions(state: web::Data<AppState>) -> impl Responder {
    match sqlx::query_as::<_, Execution>("SELECT * FROM executions ORDER BY started_at DESC")
        .fetch_all(&state.db)
        .await
    {
        Ok(rows) => HttpResponse::Ok().json(rows),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

#[get("/executions/{id}")]
async fn get_execution(state: web::Data<AppState>, path: web::Path<String>) -> impl Responder {
    let id = path.into_inner();
    match sqlx::query_as::<_, Execution>("SELECT * FROM executions WHERE id = ?")
        .bind(&id)
        .fetch_optional(&state.db)
        .await
    {
        Ok(Some(row)) => HttpResponse::Ok().json(row),
        Ok(None) => HttpResponse::NotFound().body("Execution not found"),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

#[post("/executions")]
async fn create_execution(
    state: web::Data<AppState>,
    body: web::Json<CreateExecution>,
) -> impl Responder {
    let status = body.status.clone().unwrap_or_else(|| "pending".to_string());
    match sqlx::query(
        "INSERT INTO executions (id, workflow_id, status, trigger_payload, started_at, finished_at)
         VALUES (?, ?, ?, ?, ?, ?)",
    )
    .bind(&body.id)
    .bind(&body.workflow_id)
    .bind(&status)
    .bind(&body.trigger_payload)
    .bind(body.started_at)
    .bind(body.finished_at)
    .execute(&state.db)
    .await
    {
        Ok(_) => match sqlx::query_as::<_, Execution>("SELECT * FROM executions WHERE id = ?")
            .bind(&body.id)
            .fetch_one(&state.db)
            .await
        {
            Ok(row) => HttpResponse::Created().json(row),
            Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
        },
        Err(e) => HttpResponse::BadRequest().body(e.to_string()),
    }
}

#[put("/executions/{id}")]
async fn update_execution(
    state: web::Data<AppState>,
    path: web::Path<String>,
    body: web::Json<UpdateExecution>,
) -> impl Responder {
    let id = path.into_inner();
    let result = sqlx::query(
        "UPDATE executions SET
           status          = COALESCE(?, status),
           trigger_payload = COALESCE(?, trigger_payload),
           started_at      = COALESCE(?, started_at),
           finished_at     = COALESCE(?, finished_at)
         WHERE id = ?",
    )
    .bind(&body.status)
    .bind(&body.trigger_payload)
    .bind(body.started_at)
    .bind(body.finished_at)
    .bind(&id)
    .execute(&state.db)
    .await;

    match result {
        Ok(r) if r.rows_affected() == 0 => HttpResponse::NotFound().body("Execution not found"),
        Ok(_) => match sqlx::query_as::<_, Execution>("SELECT * FROM executions WHERE id = ?")
            .bind(&id)
            .fetch_one(&state.db)
            .await
        {
            Ok(row) => HttpResponse::Ok().json(row),
            Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
        },
        Err(e) => HttpResponse::BadRequest().body(e.to_string()),
    }
}

#[delete("/executions/{id}")]
async fn delete_execution(state: web::Data<AppState>, path: web::Path<String>) -> impl Responder {
    let id = path.into_inner();
    match sqlx::query("DELETE FROM executions WHERE id = ?")
        .bind(&id)
        .execute(&state.db)
        .await
    {
        Ok(r) if r.rows_affected() == 0 => HttpResponse::NotFound().body("Execution not found"),
        Ok(_) => HttpResponse::NoContent().finish(),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

#[get("/logs")]
async fn list_logs(state: web::Data<AppState>) -> impl Responder {
    match sqlx::query_as::<_, Log>("SELECT * FROM logs ORDER BY started_at DESC")
        .fetch_all(&state.db)
        .await
    {
        Ok(rows) => HttpResponse::Ok().json(rows),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

#[get("/logs/{id}")]
async fn get_log(state: web::Data<AppState>, path: web::Path<String>) -> impl Responder {
    let id = path.into_inner();
    match sqlx::query_as::<_, Log>("SELECT * FROM logs WHERE id = ?")
        .bind(&id)
        .fetch_optional(&state.db)
        .await
    {
        Ok(Some(row)) => HttpResponse::Ok().json(row),
        Ok(None) => HttpResponse::NotFound().body("Log not found"),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

#[post("/logs")]
async fn create_log(state: web::Data<AppState>, body: web::Json<CreateLog>) -> impl Responder {
    let status = body.status.clone().unwrap_or_else(|| "pending".to_string());
    match sqlx::query(
        "INSERT INTO logs (id, execution_id, workflow_node_id, status, input_data, output_data, error, started_at, finished_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(&body.id)
    .bind(&body.execution_id)
    .bind(&body.workflow_node_id)
    .bind(&status)
    .bind(&body.input_data)
    .bind(&body.output_data)
    .bind(&body.error)
    .bind(body.started_at)
    .bind(body.finished_at)
    .execute(&state.db)
    .await
    {
        Ok(_) => match sqlx::query_as::<_, Log>("SELECT * FROM logs WHERE id = ?")
            .bind(&body.id)
            .fetch_one(&state.db)
            .await
        {
            Ok(row) => HttpResponse::Created().json(row),
            Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
        },
        Err(e) => HttpResponse::BadRequest().body(e.to_string()),
    }
}

#[put("/logs/{id}")]
async fn update_log(
    state: web::Data<AppState>,
    path: web::Path<String>,
    body: web::Json<UpdateLog>,
) -> impl Responder {
    let id = path.into_inner();
    let result = sqlx::query(
        "UPDATE logs SET
           status      = COALESCE(?, status),
           input_data  = COALESCE(?, input_data),
           output_data = COALESCE(?, output_data),
           error       = COALESCE(?, error),
           started_at  = COALESCE(?, started_at),
           finished_at = COALESCE(?, finished_at)
         WHERE id = ?",
    )
    .bind(&body.status)
    .bind(&body.input_data)
    .bind(&body.output_data)
    .bind(&body.error)
    .bind(body.started_at)
    .bind(body.finished_at)
    .bind(&id)
    .execute(&state.db)
    .await;

    match result {
        Ok(r) if r.rows_affected() == 0 => HttpResponse::NotFound().body("Log not found"),
        Ok(_) => match sqlx::query_as::<_, Log>("SELECT * FROM logs WHERE id = ?")
            .bind(&id)
            .fetch_one(&state.db)
            .await
        {
            Ok(row) => HttpResponse::Ok().json(row),
            Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
        },
        Err(e) => HttpResponse::BadRequest().body(e.to_string()),
    }
}

#[delete("/logs/{id}")]
async fn delete_log(state: web::Data<AppState>, path: web::Path<String>) -> impl Responder {
    let id = path.into_inner();
    match sqlx::query("DELETE FROM logs WHERE id = ?")
        .bind(&id)
        .execute(&state.db)
        .await
    {
        Ok(r) if r.rows_affected() == 0 => HttpResponse::NotFound().body("Log not found"),
        Ok(_) => HttpResponse::NoContent().finish(),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let database_url =
        std::env::var("DATABASE_URL").unwrap_or_else(|_| "sqlite:db.sqlite3".to_string());

    let pool = SqlitePool::connect(&database_url)
        .await
        .expect("Failed to connect to database");

    let data = web::Data::new(AppState { db: pool });

    println!("Server running at http://0.0.0.0:8080");

    HttpServer::new(move || {
        App::new()
            .app_data(data.clone())
            // plugins
            .service(list_plugins)
            .service(get_plugin)
            .service(create_plugin)
            .service(update_plugin)
            .service(delete_plugin)
            // nodes
            .service(list_nodes)
            .service(get_node)
            .service(create_node)
            .service(update_node)
            .service(delete_node)
            // node ports
            .service(list_node_ports)
            .service(get_node_port)
            .service(create_node_port)
            .service(update_node_port)
            .service(delete_node_port)
            // port type compat
            .service(list_port_type_compat)
            .service(get_port_type_compat)
            .service(create_port_type_compat)
            .service(delete_port_type_compat)
            // workflows
            .service(list_workflows)
            .service(get_workflow)
            .service(create_workflow)
            .service(update_workflow)
            .service(delete_workflow)
            // workflow nodes
            .service(list_workflow_nodes)
            .service(get_workflow_node)
            .service(create_workflow_node)
            .service(update_workflow_node)
            .service(delete_workflow_node)
            // workflow edges
            .service(list_workflow_edges)
            .service(get_workflow_edge)
            .service(create_workflow_edge)
            .service(delete_workflow_edge)
            // executions
            .service(list_executions)
            .service(get_execution)
            .service(create_execution)
            .service(update_execution)
            .service(delete_execution)
            // logs
            .service(list_logs)
            .service(get_log)
            .service(create_log)
            .service(update_log)
            .service(delete_log)
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}
